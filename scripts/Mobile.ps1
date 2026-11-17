param([ValidateSet('Start', 'Web', 'Test', 'Export', 'Integration')][string]$Action = 'Start')
. "$PSScriptRoot/Use-LocalTools.ps1"
Push-Location (Join-Path $projectRoot 'mobile')
try {
    switch ($Action) {
        'Start' { & npm.cmd start -- --lan --max-workers 2 }
        'Web' { & npx.cmd --no-install expo start --web --localhost --max-workers 2 }
        'Test' { & npm.cmd test }
        'Export' { & npx.cmd --no-install expo export --platform ios --output-dir dist --max-workers 2 }
        'Integration' { & npm.cmd run test:integration }
    }
    if ($LASTEXITCODE -ne 0) { throw "Mobile terminou com código $LASTEXITCODE" }
} finally { Pop-Location }
