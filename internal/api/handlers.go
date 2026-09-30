package api

import (
	"encoding/json"
	"net/http"
	"regexp"
	"strconv"
	"yaml-validator/internal/domain"
	"yaml-validator/internal/validator"
)

// Функция вытаскивает номер строки из текста ошибки
func extractErrorLine(errMsg string) int {
	re := regexp.MustCompile(`line (\d+)`)
	match := re.FindStringSubmatch(errMsg)
	if len(match) > 1 {
		line, _ := strconv.Atoi(match[1])
		return line
	}
	return 0
}

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

	formatted, err := validator.ValidateAndFormat(req.Content)
	if err != nil {
		resp.Valid = false
		resp.ErrorMsg = err.Error()
		resp.ErrorLine = extractErrorLine(err.Error()) // <--- Записываем номер строки
	} else {
		resp.Valid = true
		resp.Formatted = formatted
	}

	json.NewEncoder(w).Encode(resp)
}