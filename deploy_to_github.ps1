# GitHub 배포 자동화 스크립트
# 사용법: 이 파일을 마우스 우클릭 후 'PowerShell에서 실행'을 누르세요.

$repoName = "kpc-recruitment-form"

Write-Host "1. GitHub에 새로운 저장소를 만들었는지 확인해 주세요 (https://github.com/new)" -ForegroundColor Cyan
$githubId = Read-Host "GitHub 아이디(Username)를 입력해주세요"

if (-not $githubId) {
    Write-Host "아이디가 입력되지 않았습니다. 종료합니다." -ForegroundColor Red
    exit
}

Write-Host "준비 중..." -ForegroundColor Yellow

# Git 설정 확인
git init
git add .
git commit -m "배포 준비 완료"

# Remote 설정
git remote remove origin 2>$null
git remote add origin "https://github.com/$githubId/$repoName.git"
git branch -M main

Write-Host "GitHub로 업로드 중... (로그인 창이 뜨면 로그인 해주세요)" -ForegroundColor Yellow
git push -u origin main --force

Write-Host "`n작업이 완료되었습니다!" -ForegroundColor Green
Write-Host "배포된 링크: https://$githubId.github.io/$repoName" -ForegroundColor Cyan
Write-Host "`n※ 주의: GitHub 저장소 설정(Settings > Pages)에서 Build and deployment의 Branch를 'main'으로 설정해야 링크가 활성화됩니다." -ForegroundColor DarkGray

pause
