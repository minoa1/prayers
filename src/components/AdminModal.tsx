import { useState } from 'react';

interface Props {
  onLogin: (password: string) => void;
  onClose: () => void;
}

export default function AdminModal({ onLogin, onClose }: Props) {
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (password.trim()) {
      onLogin(password.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">관리자 로그인</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <input
          type="password"
          placeholder="관리자 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
          autoFocus
        />

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
          >
            로그인
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
