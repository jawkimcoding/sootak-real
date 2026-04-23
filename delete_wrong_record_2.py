import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name(r'C:\Users\KPC_User\Desktop\안티그래비티\자동화\credentials.json', scope)
client = gspread.authorize(creds)

sheet_id = '1_TgAvXAk1xM5Zxmre-kRbTygsG09qZHo5UVD6G5DMzk'
spreadsheet = client.open_by_key(sheet_id)

try:
    # Get the very first sheet (index 0) which is where getActiveSheet() usually defaults to
    wrong_sheet = spreadsheet.worksheets()[0]
    
    # Check if the title is NOT the one we want
    if wrong_sheet.id != 394669539:
        val = wrong_sheet.row_values(2)
        if val:
            wrong_sheet.delete_rows(2)
            print("Deleted the wrongly inserted row from the first sheet.")
        else:
            print("No data in row 2 of the first sheet to delete.")
    
except Exception as e:
    print(f"Error deleting row: {e}")
