package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/fct_decides_2026?sslmode=disable"
	}

	dbPool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer dbPool.Close()

	password := "password"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Error hashing password: %v", err)
	}

	users := []struct {
		Email       string
		Role        string
		AreaCouncil string
	}{
		{"admin@yiaga.org", "SUPER_ADMIN", ""},
		{"clerk@yiaga.org", "CLERK", "MUNICIPAL"},
	}

	for _, u := range users {
		query := `
			INSERT INTO users (email, password_hash, role, area_council)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT (email) DO UPDATE 
			SET password_hash = EXCLUDED.password_hash
		`
		_, err := dbPool.Exec(context.Background(), query, u.Email, string(hashedPassword), u.Role, u.AreaCouncil)
		if err != nil {
			log.Printf("Error seeding user %s: %v", u.Email, err)
		} else {
			fmt.Printf("Seeded user: %s\n", u.Email)
		}
	}
}
