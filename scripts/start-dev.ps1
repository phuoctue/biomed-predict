$ErrorActionPreference = "Stop"

function Get-EnvValue {
    param([Parameter(Mandatory = $true)][string]$Name)
    return [System.Environment]::GetEnvironmentVariable($Name, "Process")
}

function Set-EnvValue {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Value
    )
    [System.Environment]::SetEnvironmentVariable($Name, $Value, "Process")
}

function Import-EnvFile {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return @{}
    }

    $values = @{}
    foreach ($line in Get-Content -LiteralPath $Path) {
        $trimmed = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmed) -or $trimmed.StartsWith("#")) {
            continue
        }

        if ($trimmed -match "^\s*([^=]+?)\s*=\s*(.*)\s*$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($value.Length -ge 2 -and $value.StartsWith('"') -and $value.EndsWith('"')) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            $values[$key] = $value
        }
    }

    return $values
}

function Save-EnvFile {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][hashtable]$Values
    )

    $lines = New-Object System.Collections.Generic.List[string]
    foreach ($key in ($Values.Keys | Sort-Object)) {
        $value = $Values[$key]
        if ($null -eq $value) {
            $value = ""
        }
        $lines.Add("$key=$value")
    }

    Set-Content -LiteralPath $Path -Value $lines -Encoding utf8
}

function Read-SecurePlainText {
    param([Parameter(Mandatory = $true)][string]$Prompt)

    $secure = Read-Host -Prompt $Prompt -AsSecureString
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
    }
    finally {
        if ($ptr -ne [IntPtr]::Zero) {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
        }
    }
}

function Resolve-SupabaseJdbcUrl {
    param([Parameter(Mandatory = $true)][string]$InputValue)

    $trimmed = $InputValue.Trim()
    if ($trimmed.StartsWith("jdbc:postgresql://")) {
        return $trimmed
    }

    if ($trimmed -match "^[a-z0-9]{10,}$") {
        return "jdbc:postgresql://db.$trimmed.supabase.co:5432/postgres?sslmode=require"
    }

    throw "Supabase database input must be a JDBC URL or a project ref."
}

function Get-Python313Path {
    $candidates = @(
        "py -3.13 -c ""import sys; print(sys.executable)""",
        "py -3.10 -c ""import sys; print(sys.executable)""",
        "python -c ""import sys; print(sys.executable)"""
    )

    foreach ($candidate in $candidates) {
        try {
            $result = Invoke-Expression $candidate 2>$null
            if (-not [string]::IsNullOrWhiteSpace($result)) {
                return $result.Trim()
            }
        }
        catch {
        }
    }

    throw "Unable to find a usable Python interpreter."
}

function Test-UvicornAvailable {
    param([Parameter(Mandatory = $true)][string]$PythonPath)

    try {
        & $PythonPath -c "import uvicorn" 1>$null 2>$null
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$envExamplePath = Join-Path $repoRoot ".env.example"
$envPath = Join-Path $repoRoot ".env"
$backendRoot = Join-Path $repoRoot "backend"
$aiRoot = Join-Path $repoRoot "ai-service"
$logsRoot = Join-Path $repoRoot "logs"

if (-not (Test-Path -LiteralPath $logsRoot)) {
    New-Item -ItemType Directory -Path $logsRoot | Out-Null
}

$values = Import-EnvFile -Path $envExamplePath
if (Test-Path -LiteralPath $envPath) {
    $existing = Import-EnvFile -Path $envPath
    foreach ($key in $existing.Keys) {
        $values[$key] = $existing[$key]
    }
}

$supabaseUrl = Get-EnvValue -Name "DATABASE_URL"
if ([string]::IsNullOrWhiteSpace($supabaseUrl)) {
    $supabaseUrl = $values["DATABASE_URL"]
}

if ([string]::IsNullOrWhiteSpace($supabaseUrl) -or -not $supabaseUrl.StartsWith("jdbc:postgresql://")) {
    Write-Host "Supabase PostgreSQL connection setup" -ForegroundColor Cyan
    $directUrl = Read-Host -Prompt "Paste Supabase JDBC URL or project ref"

    if ([string]::IsNullOrWhiteSpace($directUrl)) {
        $projectRef = Read-Host -Prompt "Enter Supabase project ref"
        if ([string]::IsNullOrWhiteSpace($projectRef)) {
            throw "Supabase project ref is required."
        }

        $supabaseUrl = Resolve-SupabaseJdbcUrl -InputValue $projectRef
    }
    else {
        $supabaseUrl = Resolve-SupabaseJdbcUrl -InputValue $directUrl
    }
}

$supabaseUser = Get-EnvValue -Name "POSTGRES_USER"
if ([string]::IsNullOrWhiteSpace($supabaseUser)) {
    $supabaseUser = $values["POSTGRES_USER"]
}
if ([string]::IsNullOrWhiteSpace($supabaseUser) -or $supabaseUser -eq "mediai") {
    $supabaseUser = Read-Host -Prompt "Enter Supabase DB username (press Enter for postgres)"
    if ([string]::IsNullOrWhiteSpace($supabaseUser)) {
        $supabaseUser = "postgres"
    }
}

$supabasePassword = Get-EnvValue -Name "POSTGRES_PASSWORD"
if ([string]::IsNullOrWhiteSpace($supabasePassword)) {
    $supabasePassword = $values["POSTGRES_PASSWORD"]
}
if ([string]::IsNullOrWhiteSpace($supabasePassword) -or $supabasePassword -eq "mediai123") {
    $supabasePassword = Read-SecurePlainText -Prompt "Enter Supabase DB password"
    if ([string]::IsNullOrWhiteSpace($supabasePassword)) {
        throw "Supabase password is required."
    }
}

$values["DATABASE_URL"] = $supabaseUrl
$values["POSTGRES_USER"] = $supabaseUser
$values["POSTGRES_PASSWORD"] = $supabasePassword
$values["AI_SERVICE_URL"] = if ([string]::IsNullOrWhiteSpace($values["AI_SERVICE_URL"])) { "http://localhost:8000" } else { $values["AI_SERVICE_URL"] }
$values["BACKEND_PORT"] = if ([string]::IsNullOrWhiteSpace($values["BACKEND_PORT"])) { "8080" } else { $values["BACKEND_PORT"] }
$values["AI_SERVICE_PORT"] = if ([string]::IsNullOrWhiteSpace($values["AI_SERVICE_PORT"])) { "8000" } else { $values["AI_SERVICE_PORT"] }
$values["FRONTEND_PORT"] = if ([string]::IsNullOrWhiteSpace($values["FRONTEND_PORT"])) { "5173" } else { $values["FRONTEND_PORT"] }

Save-EnvFile -Path $envPath -Values $values

foreach ($key in @("DATABASE_URL", "POSTGRES_USER", "POSTGRES_PASSWORD", "AI_SERVICE_URL", "BACKEND_PORT", "AI_SERVICE_PORT", "FRONTEND_PORT")) {
    Set-EnvValue -Name $key -Value $values[$key]
}

$pythonPath = Get-Python313Path
$aiVenvPython = Join-Path $aiRoot ".venv\Scripts\python.exe"
if ((-not (Test-Path -LiteralPath $aiVenvPython)) -or (-not (Test-UvicornAvailable -PythonPath $aiVenvPython))) {
    if (Test-Path -LiteralPath (Join-Path $aiRoot ".venv")) {
        Remove-Item -LiteralPath (Join-Path $aiRoot ".venv") -Recurse -Force
    }
    Write-Host "Creating Python virtual environment for AI service..." -ForegroundColor Cyan
    & $pythonPath -m venv (Join-Path $aiRoot ".venv")
}

Write-Host "Installing AI service dependencies..." -ForegroundColor Cyan
Push-Location $aiRoot
try {
    & $aiVenvPython -m pip install --upgrade pip | Out-Null
    & $aiVenvPython -m pip install -r requirements.txt | Out-Null
}
finally {
    Pop-Location
}

$backendLogOut = Join-Path $logsRoot "backend.out.log"
$backendLogErr = Join-Path $logsRoot "backend.err.log"
$aiLogOut = Join-Path $logsRoot "ai-service.out.log"
$aiLogErr = Join-Path $logsRoot "ai-service.err.log"

Write-Host "Stopping old Java/Python processes if any..." -ForegroundColor DarkYellow
Get-Process java,python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Starting AI service..." -ForegroundColor Cyan
Start-Process -FilePath $aiVenvPython -ArgumentList @("-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload") -WorkingDirectory $aiRoot -WindowStyle Hidden -RedirectStandardOutput $aiLogOut -RedirectStandardError $aiLogErr

Write-Host "Starting backend in this terminal..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop backend and AI service." -ForegroundColor DarkGray

$backendEnv = @{
    DATABASE_URL = $values["DATABASE_URL"]
    POSTGRES_USER = $values["POSTGRES_USER"]
    POSTGRES_PASSWORD = $values["POSTGRES_PASSWORD"]
    BACKEND_PORT = $values["BACKEND_PORT"]
}

foreach ($entry in $backendEnv.GetEnumerator()) {
    [System.Environment]::SetEnvironmentVariable($entry.Key, $entry.Value, "Process")
}

Push-Location $backendRoot
try {
    & .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local -DskipTests
}
finally {
    Pop-Location
}
