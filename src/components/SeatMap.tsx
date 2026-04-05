import { Seat } from '../types';
import SeatCell from './SeatCell';

interface Props {
  seats: Seat[];
  selectedSeatId: number | null;
  moveSrcId: number | null;
  isAdminMode: boolean;
  onSeatClick: (seat: Seat) => void;
}

const ROWS = 16;
const COLS = 4;

export default function SeatMap({
  seats,
  selectedSeatId,
  moveSrcId,
  isAdminMode,
  onSeatClick,
}: Props) {
  const seatMap = new Map(seats.map((s) => [s.id, s]));

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* 좌석 그리드 */}
      {Array.from({ length: ROWS }, (_, rowIdx) => {
        const row = rowIdx + 1;
        return (
          <div key={row} className="flex items-center gap-1">
            {/* 줄 번호 */}
            <span className="w-6 text-right text-xs text-gray-400 font-mono shrink-0">
              {row}
            </span>

            {/* 4자리 동일 간격 */}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((col) => {
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
                    onClick={onSeatClick}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {/* 범례 */}
      <div className="mt-6 flex gap-3 text-xs text-gray-500 flex-wrap justify-center">
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
