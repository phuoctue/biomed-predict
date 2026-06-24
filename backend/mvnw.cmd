@echo off
setlocal enabledelayedexpansion

set "MVN_VERSION=3.9.9"
set "MVN_BASE_DIR=%LOCALAPPDATA%\biomed-predict\maven"
set "MVN_INSTALL_DIR=%MVN_BASE_DIR%\apache-maven-%MVN_VERSION%"
set "MVN_ZIP=%MVN_BASE_DIR%\apache-maven-%MVN_VERSION%-bin.zip"
set "MVN_URL=https://archive.apache.org/dist/maven/maven-3/%MVN_VERSION%/binaries/apache-maven-%MVN_VERSION%-bin.zip"

if exist "%MVN_INSTALL_DIR%\bin\mvn.cmd" goto run

if not exist "%MVN_BASE_DIR%" mkdir "%MVN_BASE_DIR%" >nul 2>&1

echo Downloading Maven %MVN_VERSION%...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%MVN_URL%' -OutFile '%MVN_ZIP%'"
if errorlevel 1 (
  echo Failed to download Maven. Please check your network connection.
  exit /b 1
)

echo Extracting Maven...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%MVN_ZIP%' -DestinationPath '%MVN_BASE_DIR%' -Force"
if errorlevel 1 (
  echo Failed to extract Maven.
  exit /b 1
)

:run
set "MVN_CMD=%MVN_INSTALL_DIR%\bin\mvn.cmd"
if not exist "%MVN_CMD%" (
  echo Maven installation not found at "%MVN_CMD%".
  exit /b 1
)

call "%MVN_CMD%" %*
exit /b %errorlevel%
