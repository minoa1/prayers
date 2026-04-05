import { useState } from 'react';

interface Props {
  onEnter: (name: string) => void;
  onAdminEnter: (password: string) => void;
  prayerTopics: string;
}

export default function LoginPage({ onEnter, onAdminEnter, prayerTopics }: Props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');

  const handleEnter = () => {
    if (!name.trim()) {
      setNameError('이름을 입력해주세요.');
      return;
    }
    onEnter(name.trim());
  };

  const handleAdminEnter = () => {
    if (!password.trim()) return;
    onAdminEnter(password.trim());
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex justify-center px-4 py-8">
      <div className="w-full max-w-[480px]">

        {/* 헤더 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-4xl">
            ⛪
          </div>
          <h1 className="text-xl font-bold text-[#1e3a5f] mb-1">수요지성소 기도회</h1>
          <p className="text-sm text-gray-500">새움청년부 · 좌석 선택</p>
        </div>

        {/* 기도제목 */}
        {prayerTopics && (
          <div className="relative rounded-2xl mb-4 overflow-hidden shadow-md">
            {/* 그라디언트 배경 */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-blue-500 to-sky-400" />
            {/* 반투명 패턴 장식 */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full" />

            <div className="relative p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🙏</span>
                <h2 className="text-sm font-bold text-white tracking-wide">이번 주 기도제목</h2>
              </div>
              <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">{prayerTopics}</p>
            </div>
          </div>
        )}

        {/* 로그인 카드 */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          {/* 이름 입력 */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              maxLength={10}
              onChange={(e) => { setName(e.target.value); setNameError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
              className="w-full border-[1.5px] border-gray-300 rounded-lg px-3.5 py-2.5 text-[15px] focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
            {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            <button
              onClick={handleEnter}
              className="w-full mt-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold text-[15px] transition-colors"
            >
              입장하기
            </button>
          </div>

          {/* 구분선 */}
          <div className="relative text-center text-sm text-gray-400 my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-white px-3">관리자</span>
          </div>

          {/* 관리자 로그인 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">관리자 비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminEnter()}
              className="w-full border-[1.5px] border-gray-300 rounded-lg px-3.5 py-2.5 text-[15px] focus:outline-none focus:border-gray-400 transition-colors"
            />
            <button
              onClick={handleAdminEnter}
              className="w-full mt-2.5 bg-white border-[1.5px] border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg py-3 font-semibold text-[15px] transition-colors"
            >
              관리자 입장
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
