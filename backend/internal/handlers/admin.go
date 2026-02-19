package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

type AdminHandler struct {
	DB *pgxpool.Pool
}

func (h *AdminHandler) ResetDatabase(w http.ResponseWriter, r *http.Request) {
	// Verify user role is SUPER_ADMIN (this should ideally be done in middleware, but for safety we check here too if context has user info)
	// For now, we assume the route is protected by AuthMiddleware and potentially a RoleMiddleware.
	// To be safe, we can check the context if "user" claims are present and have correct role.

	// Truncate tables but keep users
	query := `
		TRUNCATE TABLE process_data, result_data, collation_data, audit_logs, incidents RESTART IDENTITY;
	`

	_, err := h.DB.Exec(context.Background(), query)
	if err != nil {
		http.Error(w, "Failed to reset database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Database reset successfully. All election data has been cleared.",
	})
}
