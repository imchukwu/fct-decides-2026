package handlers

import (
	"context"
	"encoding/json"
	"net/http"
)

type DashboardStats struct {
	PUsOpened         int `json:"pus_opened"`
	ResultsUploaded   int `json:"results_uploaded"`
	CollationStarted  int `json:"collation_started"`
	IncidentsReported int `json:"incidents_reported"`
}

func (h *AuthHandler) GetDashboardStats(w http.ResponseWriter, r *http.Request) {
	stats := DashboardStats{}

	// Query for PUs Opened (count of distinct PU IDs in process_data)
	err := h.DB.QueryRow(context.Background(), "SELECT COUNT(DISTINCT pu_id) FROM process_data").Scan(&stats.PUsOpened)
	if err != nil {
		stats.PUsOpened = 0 // Fail gracefully or log error
	}

	// Query for Results Uploaded
	err = h.DB.QueryRow(context.Background(), "SELECT COUNT(DISTINCT pu_id) FROM result_data").Scan(&stats.ResultsUploaded)
	if err != nil {
		stats.ResultsUploaded = 0
	}

	// Query for Collation Started
	err = h.DB.QueryRow(context.Background(), "SELECT COUNT(DISTINCT location) FROM collation_data").Scan(&stats.CollationStarted)
	if err != nil {
		stats.CollationStarted = 0
	}

	// Query for Incidents Reported
	err = h.DB.QueryRow(context.Background(), "SELECT COUNT(*) FROM incidents").Scan(&stats.IncidentsReported)
	if err != nil {
		stats.IncidentsReported = 0
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}
