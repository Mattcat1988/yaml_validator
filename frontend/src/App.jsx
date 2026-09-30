import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-tomorrow.css'; // Темная тема для кода

function App() {
  const [yamlCode, setYamlCode] = useState('');
  const [result, setResult] = useState(null);

  const handleValidate = async () => {
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: yamlCode, type: 'yaml' })
      });
      const data = await res.json();
      setResult(data);
      
      if (data.valid && data.formatted) {
        setYamlCode(data.formatted);
      }
    } catch (error) {
      setResult({ valid: false, error_msg: "Сервер недоступен. Бэкенд на Go запущен?" });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>YAML Валидатор</h2>
      <p style={{ color: '#555' }}>Вставьте манифест. Сервис проверит синтаксис и автоматически выровняет отступы.</p>
      
      <div style={{ 
          borderRadius: '5px', 
          overflow: 'hidden', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          background: '#2d2d2d', // Фон под цвет темы prism-tomorrow
          border: '1px solid #444'
        }}>
        <Editor
          value={yamlCode}
          onValueChange={code => setYamlCode(code)}
          highlight={code => Prism.highlight(code, Prism.languages.yaml, 'yaml')}
          padding={15}
          style={{
            fontFamily: '"Fira Code", "JetBrains Mono", monospace',
            fontSize: 15,
            minHeight: '500px', // Увеличили высоту
            color: '#f8f8f2'
          }}
          textareaClassName="focus:outline-none"
        />
      </div>
      
      <button 
        onClick={handleValidate} 
        style={{ marginTop: '20px', padding: '12px 24px', fontSize: '16px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Проверить и выровнять
      </button>

      {result && !result.valid && (
        <div style={{ color: '#721c24', background: '#f8d7da', padding: '15px', marginTop: '20px', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
          <strong>Ошибка:</strong> {result.error_msg}
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