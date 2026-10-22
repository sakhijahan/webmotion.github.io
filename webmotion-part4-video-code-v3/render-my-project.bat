@echo off
cd /d C:\webmotion
if exist "%USERPROFILE%\Downloads\project.json" (
  copy /Y "%USERPROFILE%\Downloads\project.json" project.json >nul
  echo project.json found in Downloads and copied.
) else (
  echo No project.json in Downloads. Using the one already in C:\webmotion.
)
call npm run render
echo.
echo Done. Video file: C:\webmotion\out\video.mp4
pause
