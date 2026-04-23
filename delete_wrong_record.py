import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name(r'C:\Users\KPC_User\Desktop\안티그래비티\자동화\credentials.json', scope)
client = gspread.authorize(creds)

sheet_id = '1_TgAvXAk1xM5Zxmre-kRbTygsG09qZHo5UVD6G5DMzk'
spreadsheet = client.open_by_key(sheet_id)

try:
    # "2026년 일정" 시트 찾기
    wrong_sheet = spreadsheet.worksheet("2026년 일정")
    # 보통 2번째 행에 쌓였을 것이므로 2번째 행 삭제 (헤더가 1행에 있다면)
    # 2번째 행이 비어있지 않으면 삭제
    val = wrong_sheet.row_values(2)
    if val:
        wrong_sheet.delete_rows(2)
        print("Deleted the wrongly inserted row from '2026년 일정' sheet.")
    else:
        print("No data in row 2 of '2026년 일정' sheet to delete.")
except Exception as e:
    print(f"Error deleting row: {e}")
