export interface Seat {
  id: number;       // 1 ~ 64
  row: number;      // 1 ~ 16
  col: number;      // 1 ~ 4
  name: string | null;
  isGroupLeader: boolean;
}

export type AdminActionType = 'move' | 'toggleLeader' | 'clear';

export interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  error?: string;
}
