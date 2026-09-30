import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';

function App() {
  const [yamlCode, setYamlCode] = useState('');
  const [result, setResult] = useState(null);
  
  // Ссылки на инстанс редактора, чтобы управлять подсветкой ошибок
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleValidate = async () => {
    // Очищаем старые маркеры ошибок перед новой проверкой
    if (monacoRef.current && editorRef.current) {
      const model = editorRef.current.getModel();
      monacoRef.current.editor.setModelMarkers(model, 'yaml-validator', []);
    }

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: yamlCode, type: 'yaml' })
      });
      const data = await res.json();
      setResult(data);
      
      if (data.valid && data.formatted) {
        setYamlCode(data.formatted); // Заменяем на красивый код
      } else if (!data.valid && data.error_line > 0) {
        // Если есть ошибка и мы знаем строку — подсвечиваем её!
        if (monacoRef.current && editorRef.current) {
          const model = editorRef.current.getModel();
          monacoRef.current.editor.setModelMarkers(model, 'yaml-validator', [
            {
              startLineNumber: data.error_line,
              startColumn: 1,
              endLineNumber: data.error_line,
              endColumn: 1000, // Подсветит строку до конца
              message: data.error_msg,
              severity: monacoRef.current.MarkerSeverity.Error,
            }
          ]);
        }
      }
    } catch (error) {
      setResult({ valid: false, error_msg: "Сервер недоступен." });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Локальный YAML Валидатор</h2>
      <p style={{ color: '#555' }}>Вставьте манифест. Ошибки синтаксиса подсветятся прямо в коде.</p>
      
      <div style={{ 
          borderRadius: '5px', 
          overflow: 'hidden', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          border: '1px solid #444',
          height: '500px'
        }}>
        <Editor
          height="100%"
          defaultLanguage="yaml"
          theme="vs-dark" // Красивая темная тема VS Code
          value={yamlCode}
          onChange={(value) => setYamlCode(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false }, // Отключаем миникарту справа
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      
      <button 
        onClick={handleValidate} 
        style={{ marginTop: '20px', padding: '12px 24px', fontSize: '16px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Проверить и выровнять
      </button>

      {result && !result.valid && (
        <div style={{ color: '#721c24', background: '#f8d7da', padding: '15px', marginTop: '20px', borderRadius: '4px' }}>
          <strong>Ошибка на строке {result.error_line}:</strong> {result.error_msg}
        </div>
      )}
      
      {result && result.valid && (
        <div style={{ color: '#155724', background: '#d4edda', padding: '15px', marginTop: '20px', borderRadius: '4px' }}>
          <strong>Успешно!</strong> Синтаксис верен, отступы выровнены.
        </div>
      )}
    </div>
  );
}

export default App;