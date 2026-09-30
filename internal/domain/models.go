package domain

type ValidationRequest struct {
	Content string `json:"content"`
	Type    string `json:"type"` // "yaml", "ansible", "hiera"
}

type ValidationResponse struct {
	Valid          bool   `json:"valid"`
	ErrorMsg       string `json:"error_msg,omitempty"`
	Formatted      string `json:"formatted,omitempty"`
	LinterWarnings string `json:"linter_warnings,omitempty"`
	ErrorLine      int    `json:"error_line,omitempty"`
}