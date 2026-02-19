package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/yiaga/fct-decides-2026/backend/internal/models"
)

type ResultDataRequest struct {
	PUID       string                 `json:"pu_id"`
	PartyVotes map[string]interface{} `json:"party_votes"`
	TotalValid int                    `json:"total_valid"`
	Rejected   int                    `json:"rejected"`
	Accredited int                    `json:"accredited"`
}

func (h *AuthHandler) CreateResultData(w http.ResponseWriter, r *http.Request) {
	var req ResultDataRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO result_data (pu_id, party_votes, total_valid, rejected, accredited)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, timestamp
	`

	var id int
	var timestamp time.Time
	err := h.DB.QueryRow(context.Background(), query, req.PUID, req.PartyVotes, req.TotalValid, req.Rejected, req.Accredited).Scan(&id, &timestamp)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":        id,
		"timestamp": timestamp,
		"message":   "Result data submitted successfully",
	})
}

func (h *AuthHandler) GetResultData(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(context.Background(), "SELECT id, pu_id, party_votes, total_valid, rejected, accredited, timestamp FROM result_data ORDER BY timestamp DESC LIMIT 50")
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var data []models.ResultData
	for rows.Next() {
		var rd models.ResultData
		if err := rows.Scan(&rd.ID, &rd.PUID, &rd.PartyVotes, &rd.TotalValid, &rd.Rejected, &rd.Accredited, &rd.Timestamp); err != nil {
			continue
		}
		data = append(data, rd)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
