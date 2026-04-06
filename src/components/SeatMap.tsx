import { useEffect } from 'react';
import { Seat } from '../types';
import SeatCell from './SeatCell';

interface Props {
  seats: Seat[];
  selectedSeatId: number | null;
  moveSrcId: number | null;
  isAdminMode: boolean;
  currentUser: string | null;
  onSeatClick: (seat: Seat) => void;
}

const ROWS = 16;
const COLS = 4;
const ROW_PAIRS = ROWS / 2; // 8개 대그룹

export default function SeatMap({
  seats,
  selectedSeatId,
  moveSrcId,
  isAdminMode,
  currentUser,
  onSeatClick,
}: Props) {
  const seatMap = new Map(seats.map((s) => [s.id, s]));

  useEffect(() => {
    if (!currentUser) return;
    const hasMySeat = seats.some((s) => s.name === currentUser);
    if (!hasMySeat) return;
    const el = document.getElementById('my-seat');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [seats, currentUser]);

  const renderSubGroup = (rows: number[], cols: number[]) => (
    <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-200 shadow-sm p-1">
      {/* 2행 × 2열 */}
      <div className="flex flex-col gap-0.5">
        {rows.map((row) => (
          <div key={row} className="flex gap-1">
            {cols.map((col) => {
              const id = (row - 1) * COLS + col;
              const seat = seatMap.get(id);
              if (!seat) return null;
              return (
                <SeatCell
                  key={id}
                  seat={seat}
                  isSelected={selectedSeatId === id}
                  isMoveTarget={moveSrcId !== null && moveSrcId !== id}
                  isAdminMode={isAdminMode}
                  isMySeat={!isAdminMode && !!currentUser && seat.name === currentUser}
                  onClick={onSeatClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* 좌석 그리드 */}
      {Array.from({ length: ROW_PAIRS }, (_, pairIdx) => {
        const row1 = pairIdx * 2 + 1;
        const row2 = pairIdx * 2 + 2;
        return (
          <div
            key={pairIdx}
            className="flex items-stretch gap-1.5 bg-gray-50 rounded-xl border border-gray-100 px-1.5 py-1.5"
          >
            {/* 행 번호 */}
            <div className="flex flex-col justify-around items-end pr-0.5 shrink-0">
              <span className="text-[10px] text-gray-400 font-mono">{row1}</span>
              <span className="text-[10px] text-gray-400 font-mono">{row2}</span>
            </div>

            {/* 왼쪽 조 (col 1-2) */}
            {renderSubGroup([row1, row2], [1, 2])}

            {/* 오른쪽 조 (col 3-4) */}
            {renderSubGroup([row1, row2], [3, 4])}
          </div>
        );
      })}

      {/* 범례 */}
      <div className="mt-4 flex gap-3 text-xs text-gray-500 flex-wrap justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-white border-2 border-dashed border-gray-300" />
          <span>빈 자리</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600" />
          <span>예약됨</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-gradient-to-br from-orange-400 to-rose-500" />
          <span>조장 ★</span>
        </div>
        {isAdminMode && (
          <>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-md ring-2 ring-violet-500" />
              <span>선택됨</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-md ring-2 ring-emerald-400" />
              <span>이동 대상</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
