package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/yiaga/fct-decides-2026/backend/internal/handlers"
	customMiddleware "github.com/yiaga/fct-decides-2026/backend/internal/middleware"
)

func main() {
	// Load configuration (Environment variables)
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/fct_decides_2026?sslmode=disable"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	// Connect to Database
	dbPool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer dbPool.Close()

	if err := dbPool.Ping(context.Background()); err != nil {
		log.Fatalf("Unable to ping database: %v\n", err)
	}
	fmt.Println("Connected to PostgreSQL database")

	// Setup Router
	r := chi.NewRouter()

	// Initialize Database Schema
	_, err = dbPool.Exec(context.Background(), `
		CREATE TABLE IF NOT EXISTS incidents (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			severity TEXT NOT NULL,
			location TEXT NOT NULL,
			source TEXT,
			victim TEXT,
			perpetrator TEXT,
			status TEXT DEFAULT 'OPEN',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS process_data (
			id SERIAL PRIMARY KEY,
			pu_id TEXT UNIQUE NOT NULL,
			arrival_time TIMESTAMP,
			personnel_stats JSONB,
			material_stats JSONB,
			timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS result_data (
			id SERIAL PRIMARY KEY,
			pu_id TEXT UNIQUE NOT NULL,
			party_votes JSONB,
			total_valid INT,
			rejected INT,
			accredited INT,
			timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS collation_data (
			id SERIAL PRIMARY KEY,
			level TEXT NOT NULL,
			location TEXT NOT NULL,
			status TEXT,
			presence JSONB,
			timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`)
	if err != nil {
		log.Printf("Error creating tables: %v", err)
	}

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:8080"}, // Vite default ports + custom
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Initialize Handlers
	authHandler := &handlers.AuthHandler{DB: dbPool}
	adminHandler := &handlers.AdminHandler{DB: dbPool}

	// Routes
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	// Public Routes
	r.Post("/api/auth/login", authHandler.Login)
	r.Get("/api/dashboard/stats", authHandler.GetDashboardStats)
	r.Get("/api/process-data", authHandler.GetProcessData)
	r.Get("/api/result-data", authHandler.GetResultData)
	r.Get("/api/collation", authHandler.GetCollationData)

	// Protected Routes
	r.Group(func(r chi.Router) {
		r.Use(customMiddleware.AuthMiddleware)
		// r.Get("/api/dashboard/stats", authHandler.GetDashboardStats) // Moved to public
		r.Post("/api/process-data", authHandler.CreateProcessData)
		r.Post("/api/result-data", authHandler.CreateResultData)
		r.Post("/api/collation", authHandler.CreateCollationData)

		// Admin Routes
		r.Post("/api/admin/reset-db", adminHandler.ResetDatabase)
	})

	// Start Server
	fmt.Printf("Server listening on port %s\n", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
