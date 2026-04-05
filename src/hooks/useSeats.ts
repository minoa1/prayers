import { useState, useCallback } from 'react';
import { Seat } from '../types';
import {
  fetchSeats,
  registerSeat,
  cancelSeat,
  adminMoveSeat,
  adminToggleLeader,
  adminClearSeat,
} from '../services/sheetsApi';

function initLocalSeats(): Seat[] {
  const seats: Seat[] = [];
  for (let row = 1; row <= 16; row++) {
    for (let col = 1; col <= 4; col++) {
      const id = (row - 1) * 4 + col;
      seats.push({ id, row, col, name: null, isGroupLeader: false });
    }
  }
  return seats;
}

export function useSeats() {
  const [seats, setSeats] = useState<Seat[]>(initLocalSeats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSeats = useCallback(async () => {
    setLoading(true);
    setError(null);
    const data = await fetchSeats();
    if (data.length > 0) {
      setSeats(data);
    }
    setLoading(false);
  }, []);

  const handleRegister = useCallback(
    async (seatId: number, name: string): Promise<string | null> => {
      setError(null);
      const res = await registerSeat(seatId, name);
      if (!res.success) return res.error ?? '등록 실패';
      setSeats((prev) =>
        prev.map((s) => (s.id === seatId ? { ...s, name } : s))
      );
      return null;
    },
    []
  );

  const handleCancel = useCallback(
    async (seatId: number, name: string): Promise<string | null> => {
      const res = await cancelSeat(seatId, name);
      if (!res.success) return res.error ?? '취소 실패';
      setSeats((prev) =>
        prev.map((s) => (s.id === seatId ? { ...s, name: null, isGroupLeader: false } : s))
      );
      return null;
    },
    []
  );

  const handleAdminMove = useCallback(
    async (password: string, fromId: number, toId: number): Promise<string | null> => {
      const res = await adminMoveSeat(password, fromId, toId);
      if (!res.success) return res.error ?? '이동 실패';
      setSeats((prev) => {
        const from = prev.find((s) => s.id === fromId);
        const to = prev.find((s) => s.id === toId);
        if (!from || !to) return prev;
        return prev.map((s) => {
          if (s.id === fromId) return { ...s, name: null, isGroupLeader: false };
          if (s.id === toId) return { ...s, name: from.name, isGroupLeader: from.isGroupLeader };
          return s;
        });
      });
      return null;
    },
    []
  );

  const handleAdminToggleLeader = useCallback(
    async (password: string, seatId: number): Promise<string | null> => {
      const res = await adminToggleLeader(password, seatId);
      if (!res.success) return res.error ?? '조장 지정 실패';
      setSeats((prev) =>
        prev.map((s) =>
          s.id === seatId ? { ...s, isGroupLeader: !s.isGroupLeader } : s
        )
      );
      return null;
    },
    []
  );

  const handleAdminClear = useCallback(
    async (password: string, seatId: number): Promise<string | null> => {
      const res = await adminClearSeat(password, seatId);
      if (!res.success) return res.error ?? '초기화 실패';
      setSeats((prev) =>
        prev.map((s) =>
          s.id === seatId ? { ...s, name: null, isGroupLeader: false } : s
        )
      );
      return null;
    },
    []
  );

  return {
    seats,
    loading,
    error,
    loadSeats,
    handleRegister,
    handleCancel,
    handleAdminMove,
    handleAdminToggleLeader,
    handleAdminClear,
  };
}
