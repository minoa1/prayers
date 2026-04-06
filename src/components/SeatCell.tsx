import { Seat } from '../types';

interface Props {
  seat: Seat;
  isSelected: boolean;
  isMoveTarget: boolean;
  isAdminMode: boolean;
  isMySeat: boolean;
  onClick: (seat: Seat) => void;
}

export default function SeatCell({
  seat,
  isSelected,
  isMoveTarget,
  isAdminMode: _isAdminMode,
  isMySeat,
  onClick,
}: Props) {
  const isEmpty = seat.name === null;

  let containerStyle = '';
  let labelStyle = '';
  let posStyle = '';

  if (isMySeat) {
    containerStyle = 'bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-emerald-300 text-white shadow-lg shadow-emerald-200';
    labelStyle = 'text-[11px] font-bold drop-shadow-sm';
    posStyle = 'text-[10px] text-emerald-100';
  } else if (isEmpty) {
    containerStyle = 'bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-300 hover:text-blue-400 shadow-sm';
    labelStyle = 'text-[11px] font-semibold tracking-wide';
    posStyle = 'text-[10px]';
  } else if (seat.isGroupLeader) {
    containerStyle = 'bg-gradient-to-br from-orange-400 to-rose-500 border-2 border-orange-300 text-white shadow-md shadow-orange-200';
    labelStyle = 'text-[11px] font-bold drop-shadow-sm';
    posStyle = 'text-[10px] text-orange-100';
  } else {
    containerStyle = 'bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-blue-400 text-white shadow-md shadow-blue-200';
    labelStyle = 'text-[11px] font-bold drop-shadow-sm';
    posStyle = 'text-[10px] text-blue-100';
  }

  let ring = '';
  if (isMySeat) ring = 'ring-2 ring-offset-2 ring-emerald-500 scale-110';
  if (isSelected) ring = 'ring-2 ring-offset-2 ring-violet-500 scale-105';
  if (isMoveTarget) ring = 'ring-2 ring-offset-2 ring-emerald-400 animate-pulse scale-105';

  return (
    <button
      id={isMySeat ? 'my-seat' : undefined}
      onClick={() => onClick(seat)}
      className={`
        relative w-28 h-14 rounded-xl text-xs font-medium cursor-pointer
        transition-all duration-150 select-none
        ${containerStyle} ${ring}
      `}
      title={seat.name ?? `${seat.row}-${seat.col}`}
    >
      {/* 좌석 위치 */}
      <span className={`absolute top-1 left-1.5 font-mono opacity-70 ${posStyle}`}>
        {seat.row}-{seat.col}
      </span>

      {/* 내 자리 표시 */}
      {isMySeat && (
        <span className="absolute top-0.5 right-1 text-[11px] text-yellow-200">나</span>
      )}

      {/* 조장 별 */}
      {seat.isGroupLeader && !isMySeat && (
        <span className="absolute top-0.5 right-1 text-[11px] text-yellow-200">★</span>
      )}

      {/* 이름 or 좌석번호 */}
      <span className={`block px-1 truncate leading-tight mt-4 ${labelStyle}`}>
        {isEmpty ? `${seat.row}-${seat.col}` : seat.name}
      </span>
    </button>
  );
}
