@echo off
setlocal

if exist "%~dp0.env" (
  echo Loading environment variables from .env
  for /f "usebackq tokens=1,* delims==" %%a in ("%~dp0.env") do (
    if not "%%a"=="" set "%%a=%%b"
  )
)

if not defined JAVA_HOME (
  if exist "C:\Program Files\Java\jdk-21.0.10\bin\java.exe" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.10"
  ) else if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21"
  )
)

if defined JAVA_HOME (
  if not exist "%JAVA_HOME%\bin\java.exe" (
    echo JAVA_HOME is set to "%JAVA_HOME%", but java.exe was not found there.
    echo Please update JAVA_HOME or install JDK 21.
    exit /b 1
  )
  set "PATH=%JAVA_HOME%\bin;%PATH%"
  echo Using Java: %JAVA_HOME%
) else (
  where java >nul 2>&1
  if errorlevel 1 (
    echo Java was not found in PATH.
    echo Please install JDK 21 or set JAVA_HOME before running this script.
    exit /b 1
  )
  echo Using Java from PATH
)

java -version
if errorlevel 1 (
  echo Java is available, but it could not be executed successfully.
  exit /b 1
)

cd /d "%~dp0backend"

if exist "mvnw.cmd" (
  call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local -DskipTests
) else (
  echo Maven wrapper not found, falling back to system mvn.
  mvn spring-boot:run -Dspring-boot.run.profiles=local -DskipTests
)

endlocal
