import { useState, useEffect } from 'react';
import { Seat } from './types';
import { useSeats } from './hooks/useSeats';
import { fetchPrayerTopics, savePrayerTopics } from './services/sheetsApi';
import SeatMap from './components/SeatMap';
import UserModal from './components/UserModal';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';

export default function App() {
  const {
    seats,
    loading,
    loadSeats,
    handleRegister,
    handleAdminMove,
    handleAdminToggleLeader,
    handleAdminClear,
  } = useSeats();

  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [moveSrcSeat, setMoveSrcSeat] = useState<Seat | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [prayerTopics, setPrayerTopics] = useState<string>('');

  useEffect(() => {
    loadSeats();
    fetchPrayerTopics().then(setPrayerTopics);
  }, [loadSeats]);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEnter = (name: string) => {
    setCurrentUser(name);
  };

  const handleAdminEnter = (password: string) => {
    setAdminPassword(password);
    setIsAdminMode(true);
    setCurrentUser('관리자');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminMode(false);
    setAdminPassword('');
    setSelectedSeat(null);
    setMoveSrcSeat(null);
    setShowUserModal(false);
  };

  const handleSeatClick = (seat: Seat) => {
    if (isAdminMode) {
      if (moveSrcSeat) {
        if (seat.id === moveSrcSeat.id) {
          setMoveSrcSeat(null);
          setSelectedSeat(null);
          return;
        }
        setSelectedSeat(seat);
        return;
      }
      setSelectedSeat(seat);
    } else {
      // 이미 예약된 자리는 클릭 불가
      if (seat.name !== null) {
        showToast('이미 예약된 자리입니다.', false);
        return;
      }
      // 본인이 이미 다른 자리에 등록되어 있으면 차단
      const mySeat = seats.find((s) => s.name === currentUser);
      if (mySeat) {
        showToast(`이미 ${mySeat.row}-${mySeat.col} 자리에 등록되어 있습니다.`, false);
        return;
      }
      setSelectedSeat(seat);
      setShowUserModal(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
    setAdminPassword('');
    setSelectedSeat(null);
    setMoveSrcSeat(null);
  };

  const handleStartMove = () => {
    if (!selectedSeat || !selectedSeat.name) return;
    setMoveSrcSeat(selectedSeat);
    setSelectedSeat(null);
  };

  const handleConfirmMove = async (toSeatId: number) => {
    if (!moveSrcSeat) return;
    const err = await handleAdminMove(adminPassword, moveSrcSeat.id, toSeatId);
    if (err) {
      showToast(err, false);
    } else {
      const toSeat = seats.find((s) => s.id === toSeatId);
      if (toSeat?.name) {
        showToast(`${moveSrcSeat.name} ↔ ${toSeat.name} 자리 교체 완료`);
      } else {
        showToast(`${moveSrcSeat.name} → ${toSeatId}번 이동 완료`);
      }
    }
    setMoveSrcSeat(null);
    setSelectedSeat(null);
  };

  const handleCancelMove = () => {
    setMoveSrcSeat(null);
    setSelectedSeat(null);
  };

  const handleToggleLeader = async () => {
    if (!selectedSeat) return;
    const err = await handleAdminToggleLeader(adminPassword, selectedSeat.id);
    if (err) {
      showToast(err, false);
    } else {
      showToast(selectedSeat.isGroupLeader ? '조장 해제 완료' : '조장 지정 완료');
    }
    setSelectedSeat(null);
  };

  const handleClearSeat = async () => {
    if (!selectedSeat || !selectedSeat.name) return;
    if (!confirm(`${selectedSeat.name}의 자리를 비우시겠습니까?`)) return;
    const err = await handleAdminClear(adminPassword, selectedSeat.id);
    if (err) {
      showToast(err, false);
    } else {
      showToast('자리 초기화 완료');
    }
    setSelectedSeat(null);
  };

  const handleSavePrayerTopics = async (text: string) => {
    const res = await savePrayerTopics(adminPassword, text);
    if (res.success) {
      setPrayerTopics(text);
      showToast('기도제목이 저장되었습니다.');
    } else {
      showToast(res.error ?? '저장 실패', false);
    }
  };

  const occupied = seats.filter((s) => s.name !== null).length;

  if (!currentUser) {
    return <LoginPage onEnter={handleEnter} onAdminEnter={handleAdminEnter} prayerTopics={prayerTopics} />;
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-6 px-4">
      {/* 헤더 */}
      <header className="flex flex-col items-center mb-5">
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-2">⛪</div>
        <h1 className="text-xl font-bold text-[#1e3a5f]">수요지성소 기도회</h1>
        <p className="text-sm text-gray-500 mt-0.5">{occupied} / 64 명 착석</p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => loadSeats()}
            disabled={loading}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 shadow-sm transition-colors disabled:opacity-50"
          >
            {loading ? '로딩 중...' : '⟳ 새로고침'}
          </button>

          {isAdminMode && (
            <button
              onClick={handleAdminLogout}
              className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs shadow-sm transition-colors"
            >
              관리자 모드 ON
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
          >
            나가기
          </button>
        </div>
      </header>

      {/* 관리자 패널 */}
      {isAdminMode && (
        <div className="flex justify-center mb-2">
          <AdminPanel
            selectedSeat={selectedSeat}
            moveSrcSeat={moveSrcSeat}
            adminPassword={adminPassword}
            prayerTopics={prayerTopics}
            onStartMove={handleStartMove}
            onConfirmMove={handleConfirmMove}
            onCancelMove={handleCancelMove}
            onToggleLeader={handleToggleLeader}
            onClearSeat={handleClearSeat}
            onLogout={handleAdminLogout}
            onSavePrayerTopics={handleSavePrayerTopics}
          />
        </div>
      )}

      {/* 좌석 배치도 */}
      <main className="flex justify-center">
        <SeatMap
          seats={seats}
          selectedSeatId={selectedSeat?.id ?? null}
          moveSrcId={moveSrcSeat?.id ?? null}
          isAdminMode={isAdminMode}
          currentUser={currentUser}
          onSeatClick={handleSeatClick}
        />
      </main>

      {/* 유저 모달 */}
      {showUserModal && selectedSeat && (
        <UserModal
          seat={selectedSeat}
          userName={isAdminMode ? undefined : currentUser}
          onRegister={async (name) => {
            const err = await handleRegister(selectedSeat.id, name);
            if (err) { showToast(err, false); return; }
            showToast(`${name} 님 등록 완료!`);
            setShowUserModal(false);
            setSelectedSeat(null);
          }}
          onClose={() => { setShowUserModal(false); setSelectedSeat(null); }}
        />
      )}

      {/* 토스트 알림 */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
            toast.ok ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
