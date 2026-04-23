import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name(r'C:\Users\KPC_User\Desktop\안티그래비티\자동화\credentials.json', scope)
client = gspread.authorize(creds)

sheet_id = '1_TgAvXAk1xM5Zxmre-kRbTygsG09qZHo5UVD6G5DMzk'
spreadsheet = client.open_by_key(sheet_id)
sheet = spreadsheet.get_worksheet_by_id(394669539)

headers = [
    "접수일시(타임스탬프)", "성함", "이메일", "전화번호", "회사명", "부서", "주요 연령대", "직급", "예상 수강 인원", "부서 주 업무",
    "구체적인 교육 목적 (향상 능력)", "예상 예산", "희망 교육 기간", "희망 일수 및 시간", "강의 장소", "교육 형태",
    "유사 교육 경험 유무(Y/N)", "경험 상세 내역", "교재 인쇄 준비 방식", "시작 희망 일정", "기타 문의 사항"
]

cell_list = sheet.range(1, 1, 1, len(headers))
for i, cell in enumerate(cell_list):
    cell.value = headers[i]

sheet.update_cells(cell_list)

sheet.format('A1:U1', {
    "backgroundColor": {
        "red": 0.0,
        "green": 0.2,
        "blue": 0.5,
        "alpha": 0.8
    },
    "textFormat": {
        "bold": True,
        "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}
    },
    "horizontalAlignment": "CENTER"
})

print("Updated headers for KPC!")
