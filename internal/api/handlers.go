package api

import (
	"encoding/json"
	"net/http"
	"yaml-validator/internal/domain"
	"yaml-validator/internal/validator"
)

func ValidateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req domain.ValidationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	resp := domain.ValidationResponse{}

	// Базовая проверка и форматирование YAML
	formatted, err := validator.ValidateAndFormat(req.Content)
	if err != nil {
		resp.Valid = false
		resp.ErrorMsg = err.Error() // Здесь будет указана строка с ошибкой пробелов/синтаксиса
	} else {
		resp.Valid = true
		resp.Formatted = formatted
	}

	// TODO: Здесь можно добавить switch req.Type и вызывать ansible-lint через os/exec

	json.NewEncoder(w).Encode(resp)
}