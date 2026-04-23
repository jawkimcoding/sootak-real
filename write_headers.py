import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Google Sheets API 인증
scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name(r'C:\Users\KPC_User\Desktop\안티그래비티\자동화\credentials.json', scope)
client = gspread.authorize(creds)

# 스프레드시트 열기 (ID로 접근)
sheet_id = '1_TgAvXAk1xM5Zxmre-kRbTygsG09qZHo5UVD6G5DMzk'
sheet = client.open_by_key(sheet_id).sheet1

# 1행(1열부터) 헤더 적용
headers = [
    "접수일시(타임스탬프)", "회사명", "부서", "주요 연령대", "직급", "예상 수강 인원", "부서 주 업무",
    "구체적인 교육 목적 (향상 능력)", "예상 예산", "희망 교육 기간", "희망 일수 및 시간", "강의 장소", "교육 형태",
    "유사 교육 경험 유무(Y/N)", "경험 상세 내역", "교재 인쇄 준비 방식", "시작 희망 일정", "기타 문의 사항"
]

# 1행에 헤더 입력 (range 형식으로 업데이트)
cell_list = sheet.range(1, 1, 1, len(headers))
for i, cell in enumerate(cell_list):
    cell.value = headers[i]

sheet.update_cells(cell_list)

# 헤더 행 서식 적용 (굵게, 배경색)
sheet.format('A1:R1', {
    "backgroundColor": {
        "red": 0.2,
        "green": 0.5,
        "blue": 0.9,
        "alpha": 0.2
    },
    "textFormat": {
        "bold": True,
        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}
    },
    "horizontalAlignment": "CENTER"
})

# 컬럼 너비 조정 (gspread에서는 기본적으로 미지원하나, 필요시 API 호출 가능. 여기서는 값만 채움)
print("Headers inserted successfully!")
