import { Seat, ApiResponse } from '../types';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyCngNJepe7yOpmps8W8JN4fzwCdn81lis9uCfglzV3G_Q-JnbHfNrkED0ST18G_By-/exec';

async function callApi<T = null>(
  params: Record<string, string | number | boolean>
): Promise<ApiResponse<T>> {
  try {
    const query = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');

    const res = await fetch(`${SCRIPT_URL}?${query}`, { redirect: 'follow' });
    const json: ApiResponse<T> = await res.json();
    return json;
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function fetchSeats(): Promise<Seat[]> {
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getSeats`, { redirect: 'follow' });
    const json: ApiResponse<Seat[]> = await res.json();
    if (json.success && json.data) return json.data;
    return [];
  } catch {
    return [];
  }
}

export async function registerSeat(seatId: number, name: string): Promise<ApiResponse> {
  return callApi({ action: 'register', seatId, name });
}

export async function cancelSeat(seatId: number, name: string): Promise<ApiResponse> {
  return callApi({ action: 'cancel', seatId, name });
}

export async function adminMoveSeat(password: string, fromSeatId: number, toSeatId: number): Promise<ApiResponse> {
  return callApi({ action: 'adminMove', password, fromSeatId, toSeatId });
}

export async function adminToggleLeader(password: string, seatId: number): Promise<ApiResponse> {
  return callApi({ action: 'adminToggleLeader', password, seatId });
}

export async function adminClearSeat(password: string, seatId: number): Promise<ApiResponse> {
  return callApi({ action: 'adminClear', password, seatId });
}

export async function fetchPrayerTopics(): Promise<string> {
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getPrayerTopics`, { redirect: 'follow' });
    const json: ApiResponse<string> = await res.json();
    if (json.success && json.data != null) return json.data;
    return '';
  } catch {
    return '';
  }
}

export async function savePrayerTopics(password: string, text: string): Promise<ApiResponse> {
  return callApi({ action: 'savePrayerTopics', password, text });
}
