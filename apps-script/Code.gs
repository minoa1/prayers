// ============================================================
// 수요지성소 기도회 - Google Apps Script 백엔드
// ============================================================
//
// [설정 방법]
// 1. Google Sheets를 새로 만들고, 시트 이름을 "Seats"로 변경
// 2. Google Apps Script 편집기 열기 (확장 프로그램 > Apps Script)
// 3. 이 코드를 붙여넣고 ADMIN_PASSWORD를 원하는 비밀번호로 변경
// 4. 저장 후, "배포" > "새 배포" > 유형: 웹앱
//    - 실행 계정: 나
//    - 액세스 권한: 모든 사용자
// 5. 배포 URL을 복사해서 React 앱의 "설정"에 붙여넣기
// 6. 최초 1회 실행: Apps Script 편집기에서 initSheet() 함수를 직접 실행
// ============================================================

const SHEET_NAME = 'Seats';
const ADMIN_PASSWORD = '4321'; // ← 반드시 변경하세요!
const TOTAL_ROWS = 16;
const TOTAL_COLS = 4;

// CORS 헤더 포함 응답 생성
function createResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// 시트 초기화 (최초 1회 실행)
function initSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  sheet.clearContents();

  // 헤더
  sheet.getRange(1, 1, 1, 5).setValues([['id', 'row', 'col', 'name', 'isGroupLeader']]);

  // 64개 자리 생성
  const rows = [];
  for (let r = 1; r <= TOTAL_ROWS; r++) {
    for (let c = 1; c <= TOTAL_COLS; c++) {
      const id = (r - 1) * TOTAL_COLS + c;
      rows.push([id, r, c, '', false]);
    }
  }
  sheet.getRange(2, 1, rows.length, 5).setValues(rows);
}

// 전체 좌석 데이터 반환
function getSeats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const seats = [];
  for (let i = 1; i < data.length; i++) {
    const [id, row, col, name, isGroupLeader] = data[i];
    seats.push({
      id: Number(id),
      row: Number(row),
      col: Number(col),
      name: name === '' ? null : String(name),
      isGroupLeader: isGroupLeader === true || isGroupLeader === 'TRUE',
    });
  }
  return seats;
}

// 시트에서 seatId에 해당하는 행 번호 반환 (1-indexed, 헤더 포함)
function findRowById(sheet, seatId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (Number(data[i][0]) === Number(seatId)) return i + 1; // 1-indexed
  }
  return -1;
}

// ---- GET 요청 처리 (모든 요청을 GET으로 통일) ----
function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const action = params.action;

  if (action === 'getSeats') {
    return createResponse({ success: true, data: getSeats() });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  try {
    // 자리 등록
    if (action === 'register') {
      const seatId = Number(params.seatId);
      const name = String(params.name).trim();
      if (!name) return createResponse({ success: false, error: '이름을 입력하세요.' });

      const rowNum = findRowById(sheet, seatId);
      if (rowNum === -1) return createResponse({ success: false, error: '존재하지 않는 자리입니다.' });

      const currentName = sheet.getRange(rowNum, 4).getValue();
      if (currentName !== '') return createResponse({ success: false, error: '이미 예약된 자리입니다.' });

      sheet.getRange(rowNum, 4).setValue(name);
      return createResponse({ success: true });
    }

    // 자리 취소
    if (action === 'cancel') {
      const seatId = Number(params.seatId);
      const name = String(params.name).trim();

      const rowNum = findRowById(sheet, seatId);
      if (rowNum === -1) return createResponse({ success: false, error: '존재하지 않는 자리입니다.' });

      const currentName = sheet.getRange(rowNum, 4).getValue();
      if (currentName !== name) return createResponse({ success: false, error: '이름이 일치하지 않습니다.' });

      sheet.getRange(rowNum, 4).setValue('');
      sheet.getRange(rowNum, 5).setValue(false);
      return createResponse({ success: true });
    }

    // [관리자] 자리 이동
    if (action === 'adminMove') {
      if (params.password !== ADMIN_PASSWORD) return createResponse({ success: false, error: '비밀번호가 틀렸습니다.' });

      const fromId = Number(params.fromSeatId);
      const toId = Number(params.toSeatId);

      const fromRow = findRowById(sheet, fromId);
      const toRow = findRowById(sheet, toId);
      if (fromRow === -1 || toRow === -1) return createResponse({ success: false, error: '자리를 찾을 수 없습니다.' });

      const fromName = sheet.getRange(fromRow, 4).getValue();
      const fromLeader = sheet.getRange(fromRow, 5).getValue();
      const toName = sheet.getRange(toRow, 4).getValue();
      if (toName !== '') return createResponse({ success: false, error: '이동할 자리가 이미 사용 중입니다.' });

      sheet.getRange(toRow, 4).setValue(fromName);
      sheet.getRange(toRow, 5).setValue(fromLeader);
      sheet.getRange(fromRow, 4).setValue('');
      sheet.getRange(fromRow, 5).setValue(false);
      return createResponse({ success: true });
    }

    // [관리자] 조장 토글
    if (action === 'adminToggleLeader') {
      if (params.password !== ADMIN_PASSWORD) return createResponse({ success: false, error: '비밀번호가 틀렸습니다.' });

      const seatId = Number(params.seatId);
      const rowNum = findRowById(sheet, seatId);
      if (rowNum === -1) return createResponse({ success: false, error: '자리를 찾을 수 없습니다.' });

      const name = sheet.getRange(rowNum, 4).getValue();
      if (!name) return createResponse({ success: false, error: '빈 자리에는 조장을 지정할 수 없습니다.' });

      const current = sheet.getRange(rowNum, 5).getValue();
      sheet.getRange(rowNum, 5).setValue(!current);
      return createResponse({ success: true });
    }

    // [관리자] 자리 초기화
    if (action === 'adminClear') {
      if (params.password !== ADMIN_PASSWORD) return createResponse({ success: false, error: '비밀번호가 틀렸습니다.' });

      const seatId = Number(params.seatId);
      const rowNum = findRowById(sheet, seatId);
      if (rowNum === -1) return createResponse({ success: false, error: '자리를 찾을 수 없습니다.' });

      sheet.getRange(rowNum, 4).setValue('');
      sheet.getRange(rowNum, 5).setValue(false);
      return createResponse({ success: true });
    }

    return createResponse({ success: false, error: `알 수 없는 action: ${action}` });
  } catch (err) {
    return createResponse({ success: false, error: String(err) });
  }
}
