package validator

import (
	"bytes"
	"gopkg.in/yaml.v3"
)

// ValidateAndFormat проверяет YAML на ошибки и возвращает отформатированный вариант
func ValidateAndFormat(input string) (string, error) {
	var node yaml.Node

	// Пытаемся распарсить
	err := yaml.Unmarshal([]byte(input), &node)
	if err != nil {
		return "", err // Вернет ошибку с указанием строки, например: "yaml: line 4: could not find expected ':'"
	}

	// Собираем обратно (это автоматически исправит пробелы и выравнивание)
	var buf bytes.Buffer
	encoder := yaml.NewEncoder(&buf)
	encoder.SetIndent(2) // Стандарт отступов для Ansible и Kubernetes
	err = encoder.Encode(&node)
	if err != nil {
		return "", err
	}

	return buf.String(), nil
}