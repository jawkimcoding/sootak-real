import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

CREDS_FILE = r"C:\Users\KPC_User\Desktop\안티그래비티\자동화\credentials.json"
SCOPES = ['https://www.googleapis.com/auth/script.projects', 'https://www.googleapis.com/auth/script.deployments', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']

def main():
    creds = service_account.Credentials.from_service_account_file(CREDS_FILE, scopes=SCOPES)
    script_service = build('script', 'v1', credentials=creds)

    print("Creating Apps Script Project...")
    request = {
        'title': 'KPC_Education_Form_Backend'
    }
    project = script_service.projects().create(body=request).execute()
    script_id = project['scriptId']
    print(f"Created script with ID: {script_id}")

    # Set content
    code = """
function doPost(e) {
  // Use SpreadsheetApp.openById because the script is standalone
  var sheet = SpreadsheetApp.openById("1_TgAvXAk1xM5Zxmre-kRbTygsG09qZHo5UVD6G5DMzk").getActiveSheet();
  var params = e.parameter;
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "타임스탬프", "회사명", "부서", "연령대", "직급", "예상인원", "부서주업무",
      "교육목적", "예상예산", "교육기간", "교육일수/시간", "강의장소", "교육형태",
      "유사경험(Y/N)", "경험상세", "교재인쇄방법", "희망일정", "기타문의"
    ]);
  }

  var rowData = [
    new Date(),
    params.companyName || "",
    params.department || "",
    params.ageGroup || "",
    params.position || "",
    params.attendeeCount || "",
    params.mainTask || "",
    params.trainingPurpose || "",
    params.budget || "",
    params.trainingPeriod || "",
    params.trainingDaysHours || "",
    params.trainingLocation || "",
    params.trainingType || "",
    params.pastExperience || "",
    params.pastExperienceDetails || "",
    params.bookPrinting || "",
    params.desiredSchedule || "",
    params.otherInquiries || ""
  ];

  sheet.insertRowAfter(1);
  sheet.getRange(2, 1, 1, rowData.length).setValues([rowData]);

  return ContentService.createTextOutput(JSON.stringify({"status":"success"})).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("Backend is running!");
}
"""
    appsscript_json = """{
  "timeZone": "Asia/Seoul",
  "dependencies": {
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  }
}"""

    content = {
        'files': [
            {
                'name': 'Code',
                'type': 'SERVER_JS',
                'source': code
            },
            {
                'name': 'appsscript',
                'type': 'JSON',
                'source': appsscript_json
            }
        ]
    }
    
    print("Updating project content...")
    script_service.projects().updateContent(scriptId=script_id, body=content).execute()

    print("Creating deployment...")
    version_req = {
        'description': 'Initial Version'
    }
    version = script_service.projects().versions().create(scriptId=script_id, body=version_req).execute()
    version_num = version['versionNumber']

    deploy_req = {
        'versionNumber': version_num,
        'manifestFileName': 'appsscript',
        'description': 'Web App Deployment'
    }
    deployment = script_service.projects().deployments().create(scriptId=script_id, body=deploy_req).execute()
    
    print(deployment)
    with open('deployment_info.json', 'w') as f:
        json.dump(deployment, f, indent=2)

if __name__ == '__main__':
    main()
