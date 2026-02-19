package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/yiaga/fct-decides-2026/backend/internal/models"
)

type CollationRequest struct {
	Level    string                 `json:"level"`
	Location string                 `json:"location"`
	Status   string                 `json:"status"`
	Presence map[string]interface{} `json:"presence"`
}

func (h *AuthHandler) CreateCollationData(w http.ResponseWriter, r *http.Request) {
	var req CollationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO collation_data (level, location, status, presence)
		VALUES ($1, $2, $3, $4)
		RETURNING id, timestamp
	`

	var id int
	var timestamp time.Time
	err := h.DB.QueryRow(context.Background(), query, req.Level, req.Location, req.Status, req.Presence).Scan(&id, &timestamp)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":        id,
		"timestamp": timestamp,
		"message":   "Collation data submitted successfully",
	})
}

func (h *AuthHandler) GetCollationData(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(context.Background(), "SELECT id, level, location, status, presence, timestamp FROM collation_data ORDER BY timestamp DESC LIMIT 50")
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var data []models.CollationData
	for rows.Next() {
		var cd models.CollationData
		if err := rows.Scan(&cd.ID, &cd.Level, &cd.Location, &cd.Status, &cd.Presence, &cd.Timestamp); err != nil {
			continue
		}
		data = append(data, cd)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
