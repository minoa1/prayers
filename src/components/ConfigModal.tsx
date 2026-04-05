import { useState } from 'react';
import { getScriptUrl, setScriptUrl } from '../services/sheetsApi';

interface Props {
  onClose: () => void;
  onSave: () => void;
}

export default function ConfigModal({ onClose, onSave }: Props) {
  const [url, setUrl] = useState(getScriptUrl());

  const handleSave = () => {
    setScriptUrl(url.trim());
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Google Sheets 연동 설정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Google Apps Script 웹앱 URL을 붙여넣으세요.
          설정 방법은 <code className="bg-gray-100 px-1 rounded">apps-script/Code.gs</code> 파일을 참고하세요.
        </p>

        <input
          type="url"
          placeholder="https://script.google.com/macros/s/.../exec"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 font-mono"
          autoFocus
        />

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 text-sm font-medium transition-colors"
          >
            저장
          </button>
          <button
            onClick={onClose}
            className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 text-sm font-medium transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
