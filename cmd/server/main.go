package main

import (
	"log"
	"net/http"
	"yaml-validator/internal/api"
)

func main() {
	// API маршруты
	http.HandleFunc("/api/validate", api.ValidateHandler)

	// Раздача статики React (предполагаем, что билд лежит в папке frontend/dist)
	fs := http.FileServer(http.Dir("./frontend/dist"))
	http.Handle("/", fs)

	log.Println("Server starting on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}