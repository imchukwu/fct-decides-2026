package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/yiaga/fct-decides-2026/backend/internal/models"
)

type ProcessDataRequest struct {
	PUID           string                 `json:"pu_id"`
	ArrivalTime    *time.Time             `json:"arrival_time"`
	PersonnelStats map[string]interface{} `json:"personnel_stats"`
	MaterialStats  map[string]interface{} `json:"material_stats"`
}

func (h *AuthHandler) CreateProcessData(w http.ResponseWriter, r *http.Request) {
	var req ProcessDataRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO process_data (pu_id, arrival_time, personnel_stats, material_stats)
		VALUES ($1, $2, $3, $4)
		RETURNING id, timestamp
	`

	var id int
	var timestamp time.Time
	err := h.DB.QueryRow(context.Background(), query, req.PUID, req.ArrivalTime, req.PersonnelStats, req.MaterialStats).Scan(&id, &timestamp)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":        id,
		"timestamp": timestamp,
		"message":   "Process data submitted successfully",
	})
}

func (h *AuthHandler) GetProcessData(w http.ResponseWriter, r *http.Request) {
	// Implementation for fetching process data (e.g., for dashboard)
	// For now, let's just return a placeholder or list
	rows, err := h.DB.Query(context.Background(), "SELECT id, pu_id, arrival_time, personnel_stats, material_stats, timestamp FROM process_data ORDER BY timestamp DESC LIMIT 50")
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var data []models.ProcessData
	for rows.Next() {
		var pd models.ProcessData
		if err := rows.Scan(&pd.ID, &pd.PUID, &pd.ArrivalTime, &pd.PersonnelStats, &pd.MaterialStats, &pd.Timestamp); err != nil {
			continue // Skip erroneous rows
		}
		data = append(data, pd)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
