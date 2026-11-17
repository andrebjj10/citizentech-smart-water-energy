param([ValidateSet('Test', 'Build', 'Run')][string]$Action = 'Run')
. "$PSScriptRoot/Use-LocalTools.ps1"
Push-Location (Join-Path $projectRoot 'backend')
try {
    if ($Action -eq 'Run') {
        if (-not (Test-Path 'target/citizentech-api-1.0.0.jar')) { throw 'Execute primeiro: .\scripts\Backend.ps1 -Action Build' }
        & java -jar target/citizentech-api-1.0.0.jar
    } else {
        $goal = if ($Action -eq 'Test') { 'test' } else { 'verify' }
        & .\mvnw.cmd "-Dmaven.repo.local=$projectRoot/.cache/maven" $goal -B -ntp
    }
    if ($LASTEXITCODE -ne 0) { throw "Backend terminou com código $LASTEXITCODE" }
} finally { Pop-Location }
