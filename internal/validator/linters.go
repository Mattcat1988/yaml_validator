package validator

import (
	"os"
	"os/exec"
)

func CheckAnsible(content string) (string, error) {
	// Создаем временный файл
	tmpFile, _ := os.CreateTemp("", "*.yaml")
	defer os.Remove(tmpFile.Name())
	tmpFile.WriteString(content)
	tmpFile.Close()

	// Запускаем ansible-lint
	cmd := exec.Command("ansible-lint", tmpFile.Name())
	output, err := cmd.CombinedOutput()
	
	return string(output), err
}