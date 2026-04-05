import { useState } from 'react';
import { Seat } from '../types';

interface Props {
  selectedSeat: Seat | null;
  moveSrcSeat: Seat | null;
  adminPassword: string;
  prayerTopics: string;
  onStartMove: () => void;
  onConfirmMove: (toSeatId: number) => void;
  onCancelMove: () => void;
  onToggleLeader: () => void;
  onClearSeat: () => void;
  onLogout: () => void;
  onSavePrayerTopics: (text: string) => void;
}

export default function AdminPanel({
  selectedSeat,
  moveSrcSeat,
  adminPassword: _adminPassword,
  prayerTopics,
  onStartMove,
  onConfirmMove,
  onCancelMove,
  onToggleLeader,
  onClearSeat,
  onLogout,
  onSavePrayerTopics,
}: Props) {
  const [draft, setDraft] = useState(prayerTopics);

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-4 w-full max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-purple-700">관리자 모드</h3>
        <button
          onClick={onLogout}
          className="text-xs text-purple-500 hover:text-purple-700 underline"
        >
          로그아웃
        </button>
      </div>

      {/* 기도제목 입력 */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-purple-700 mb-1">기도제목</label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="기도제목을 입력하세요"
          rows={4}
          className="w-full border border-purple-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none bg-white"
        />
        <button
          onClick={() => onSavePrayerTopics(draft)}
          className="w-full mt-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg py-1.5 font-medium transition-colors"
        >
          저장
        </button>
      </div>

      <div className="border-t border-purple-200 pt-3">

      {!selectedSeat && !moveSrcSeat && (
        <p className="text-xs text-gray-500">
          아래 좌석을 클릭하면 관리 옵션이 나타납니다.
        </p>
      )}

      {moveSrcSeat && !selectedSeat && (
        <div>
          <p className="text-xs text-gray-600 mb-2">
            <strong className="text-purple-700">{moveSrcSeat.name}</strong> 님을
            이동할 빈 자리를 클릭하세요.
          </p>
          <button
            onClick={onCancelMove}
            className="w-full text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-1.5 transition-colors"
          >
            이동 취소
          </button>
        </div>
      )}

      {selectedSeat && !moveSrcSeat && (
        <div>
          <p className="text-xs text-gray-500 mb-2">
            선택:{' '}
            <strong>
              {selectedSeat.id}번{' '}
              {selectedSeat.name ? `(${selectedSeat.name})` : '(빈 자리)'}
            </strong>
          </p>

          {selectedSeat.name && (
            <div className="flex flex-col gap-1.5">
              <button
                onClick={onStartMove}
                className="w-full text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg py-1.5 transition-colors"
              >
                자리 이동
              </button>
              <button
                onClick={onToggleLeader}
                className={`w-full text-xs rounded-lg py-1.5 transition-colors ${
                  selectedSeat.isGroupLeader
                    ? 'bg-amber-400 hover:bg-amber-500 text-white'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                }`}
              >
                {selectedSeat.isGroupLeader ? '★ 조장 해제' : '조장 지정'}
              </button>
              <button
                onClick={onClearSeat}
                className="w-full text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-lg py-1.5 transition-colors"
              >
                자리 비우기
              </button>
            </div>
          )}

          {moveSrcSeat && (
            <button
              onClick={() => onConfirmMove(selectedSeat.id)}
              className="w-full text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg py-1.5 transition-colors"
            >
              {selectedSeat.name ? '자리 바꾸기' : '이 자리로 이동'}
            </button>
          )}
        </div>
      )}

      {selectedSeat && moveSrcSeat && (
        <div>
          <p className="text-xs text-gray-600 mb-2">
            {selectedSeat.name ? (
              <><strong>{moveSrcSeat.name}</strong> ↔ <strong>{selectedSeat.name}</strong> 자리를 바꾸시겠습니까?</>
            ) : (
              <><strong>{moveSrcSeat.name}</strong> → <strong>{selectedSeat.id}번 자리</strong>로 이동하시겠습니까?</>
            )}
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => onConfirmMove(selectedSeat.id)}
              className="flex-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg py-1.5 transition-colors"
            >
              확인
            </button>
            <button
              onClick={onCancelMove}
              className="flex-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-1.5 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
