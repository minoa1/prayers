import { Seat, ApiResponse } from '../types';

const SCRIPT_URL_KEY = 'prayer_meeting_script_url';
const MY_SEAT_KEY = 'prayer_meeting_my_seat';
const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyCngNJepe7yOpmps8W8JN4fzwCdn81lis9uCfglzV3G_Q-JnbHfNrkED0ST18G_By-/exec';

export function getMyRegistration(): { seatId: number; name: string } | null {
  const raw = localStorage.getItem(MY_SEAT_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveMyRegistration(seatId: number, name: string) {
  localStorage.setItem(MY_SEAT_KEY, JSON.stringify({ seatId, name }));
}

export function clearMyRegistration() {
  localStorage.removeItem(MY_SEAT_KEY);
}

export function getScriptUrl(): string {
  return localStorage.getItem(SCRIPT_URL_KEY) ?? DEFAULT_SCRIPT_URL;
}

export function setScriptUrl(url: string): void {
  localStorage.setItem(SCRIPT_URL_KEY, url);
}

async function callApi<T = null>(
  params: Record<string, string | number | boolean>
): Promise<ApiResponse<T>> {
  const scriptUrl = getScriptUrl();
  if (!scriptUrl) {
    return { success: false, error: 'Apps Script URL이 설정되지 않았습니다.' };
  }

  try {
    const query = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');

    const res = await fetch(`${scriptUrl}?${query}`, {
      redirect: 'follow',
    });

    const json: ApiResponse<T> = await res.json();
    return json;
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function fetchSeats(): Promise<Seat[]> {
  const scriptUrl = getScriptUrl();
  if (!scriptUrl) return [];

  try {
    const url = `${scriptUrl}?action=getSeats`;
    const res = await fetch(url, { redirect: 'follow' });
    const json: ApiResponse<Seat[]> = await res.json();
    if (json.success && json.data) return json.data;
    return [];
  } catch {
    return [];
  }
}

export async function registerSeat(
  seatId: number,
  name: string
): Promise<ApiResponse> {
  const res = await callApi({ action: 'register', seatId, name });
  if (res.success) saveMyRegistration(seatId, name);
  return res;
}

export async function cancelSeat(
  seatId: number,
  name: string
): Promise<ApiResponse> {
  const res = await callApi({ action: 'cancel', seatId, name });
  if (res.success) clearMyRegistration();
  return res;
}

export async function adminMoveSeat(
  password: string,
  fromSeatId: number,
  toSeatId: number
): Promise<ApiResponse> {
  return callApi({ action: 'adminMove', password, fromSeatId, toSeatId });
}

export async function adminToggleLeader(
  password: string,
  seatId: number
): Promise<ApiResponse> {
  return callApi({ action: 'adminToggleLeader', password, seatId });
}

export async function adminClearSeat(
  password: string,
  seatId: number
): Promise<ApiResponse> {
  return callApi({ action: 'adminClear', password, seatId });
}

const PRAYER_TOPICS_KEY = 'prayer_meeting_prayer_topics';

export async function fetchPrayerTopics(): Promise<string> {
  // localStorage를 먼저 반환 (즉시 표시)
  const cached = localStorage.getItem(PRAYER_TOPICS_KEY) ?? '';

  const scriptUrl = getScriptUrl();
  if (!scriptUrl) return cached;

  try {
    const res = await fetch(`${scriptUrl}?action=getPrayerTopics`, { redirect: 'follow' });
    const json: ApiResponse<string> = await res.json();
    if (json.success && json.data != null) {
      // Sheets에서 가져온 값으로 캐시 업데이트
      localStorage.setItem(PRAYER_TOPICS_KEY, json.data);
      return json.data;
    }
    return cached;
  } catch {
    return cached;
  }
}

export async function savePrayerTopics(
  password: string,
  text: string
): Promise<ApiResponse> {
  // localStorage에 항상 저장 (오프라인 / Apps Script 미설정 대비)
  localStorage.setItem(PRAYER_TOPICS_KEY, text);

  const scriptUrl = getScriptUrl();
  if (!scriptUrl) {
    return { success: true };
  }

  const res = await callApi({ action: 'savePrayerTopics', password, text });
  return res;
}
