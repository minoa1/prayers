import { useState, useEffect } from 'react';
import { Seat } from '../types';

interface Props {
  seat: Seat;
  userName?: string;
  onRegister: (name: string) => Promise<void>;
  onCancel: (name: string) => Promise<void>;
  onClose: () => void;
}

export default function UserModal({ seat, userName, onRegister, onCancel, onClose }: Props) {
  const [name, setName] = useState(userName ?? '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const isEmpty = seat.name === null;

  // 빈 자리 + 이름이 전달된 경우 확인 다이얼로그 모드
  const isConfirmMode = isEmpty && !!userName;

  useEffect(() => {
    setName(userName ?? '');
    setErrorMsg('');
  }, [seat.id, userName]);

  const handleRegister = async () => {
    if (!name.trim()) {
      setErrorMsg('이름을 입력해주세요.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    await onRegister(name.trim());
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!name.trim()) {
      setErrorMsg('본인 이름을 입력해주세요.');
      return;
    }
    if (name.trim() !== seat.name) {
      setErrorMsg('이름이 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    await onCancel(name.trim());
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {seat.id}번 자리 ({seat.row}줄 {seat.col}번)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {isConfirmMode ? (
          /* 확인 다이얼로그 모드 */
          <>
            <p className="text-base font-semibold text-gray-800 mb-5">
              {seat.row}-{seat.col} 자리를 선택하시겠습니까?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleRegister}
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors"
              >
                {loading ? '등록 중...' : '예'}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 text-sm font-medium transition-colors"
              >
                아니오
              </button>
            </div>
          </>
        ) : (
          /* 이름 입력 모드 (관리자 또는 예약 취소) */
          <>
            {!isEmpty && (
              <p className="mb-3 text-sm text-gray-600">
                현재 예약자:{' '}
                <strong className="text-blue-600">
                  {seat.isGroupLeader ? `★ ${seat.name} (조장)` : seat.name}
                </strong>
              </p>
            )}

            <input
              type="text"
              placeholder={isEmpty ? '이름을 입력하세요' : '본인 이름 확인 후 취소'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (isEmpty ? handleRegister() : handleCancel())}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
              autoFocus
            />

            {errorMsg && (
              <p className="text-red-500 text-xs mb-2">{errorMsg}</p>
            )}

            <div className="flex gap-2 mt-1">
              {isEmpty ? (
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                >
                  {loading ? '등록 중...' : '자리 등록'}
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                >
                  {loading ? '취소 중...' : '예약 취소'}
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 text-sm font-medium transition-colors"
              >
                닫기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
