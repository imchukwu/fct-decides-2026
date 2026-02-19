package models

import (
	"time"
)

type User struct {
	ID           int       `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	AreaCouncil  string    `json:"area_council,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}

type ProcessData struct {
	ID             int                    `json:"id"`
	PUID           string                 `json:"pu_id"`
	ArrivalTime    *time.Time             `json:"arrival_time"`
	PersonnelStats map[string]interface{} `json:"personnel_stats"`
	MaterialStats  map[string]interface{} `json:"material_stats"`
	Timestamp      time.Time              `json:"timestamp"`
}

type ResultData struct {
	ID         int                    `json:"id"`
	PUID       string                 `json:"pu_id"`
	PartyVotes map[string]interface{} `json:"party_votes"`
	TotalValid int                    `json:"total_valid"`
	Rejected   int                    `json:"rejected"`
	Accredited int                    `json:"accredited"`
	Timestamp  time.Time              `json:"timestamp"`
}

type CollationData struct {
	ID        int                    `json:"id"`
	Level     string                 `json:"level"`
	Location  string                 `json:"location"`
	Status    string                 `json:"status"`
	Presence  map[string]interface{} `json:"presence"`
	Timestamp time.Time              `json:"timestamp"`
}

type AuditLog struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Action    string    `json:"action"`
	Details   string    `json:"details"`
	Timestamp time.Time `json:"timestamp"`
}
