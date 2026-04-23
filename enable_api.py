import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

CREDS_FILE = r"C:\Users\KPC_User\Desktop\안티그래비티\자동화\credentials.json"
SCOPES = ['https://www.googleapis.com/auth/cloud-platform']

def main():
    creds = service_account.Credentials.from_service_account_file(CREDS_FILE, scopes=SCOPES)
    service = build('serviceusage', 'v1', credentials=creds)

    print("Enabling Apps Script API...")
    # Project ID can be found in credentials or error: 356567995347
    project_id = creds.project_id
    
    # Enable API
    request = service.services().enable(
        name=f"projects/{project_id}/services/script.googleapis.com"
    )
    request.execute()
    print("API Enabled Successfully!")

if __name__ == '__main__':
    main()
