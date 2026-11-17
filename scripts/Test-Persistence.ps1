# Inicia dois processos próprios, sem apagar o banco e sem encerrar servidores de terceiros.
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot/Use-LocalTools.ps1"
$backendPath = Join-Path $projectRoot 'backend'
$cachePath = Join-Path $projectRoot '.cache'
New-Item -ItemType Directory -Force $cachePath | Out-Null
$javaPath = (Get-Command java).Source
$base = 'http://127.0.0.1:8080/api'
$jar = Join-Path $backendPath 'target/citizentech-api-1.0.0.jar'
if (-not (Test-Path $jar)) { throw 'Gere o JAR antes: .\scripts\Backend.ps1 -Action Build' }
$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, 8080)
try { $listener.Start() } catch { throw 'A porta 8080 está ocupada. Pare seu backend antes deste teste.' } finally { $listener.Stop() }

function Start-Station([string]$label) {
    $process = Start-Process -FilePath $javaPath -ArgumentList @('-jar', $jar) -WorkingDirectory $backendPath -WindowStyle Hidden -PassThru -RedirectStandardOutput "$cachePath/persistence-$label.log" -RedirectStandardError "$cachePath/persistence-$label.err.log"
    try {
        for ($attempt = 0; $attempt -lt 40; $attempt++) {
            if ($process.HasExited) { throw "Backend encerrou; consulte .cache/persistence-$label.log" }
            try {
                $health = Invoke-RestMethod "$base/health" -TimeoutSec 1
                $readyActuators = Invoke-RestMethod "$base/actuators" -TimeoutSec 1
                $readyReading = Invoke-RestMethod "$base/readings/latest" -TimeoutSec 1
                if ($health.status -eq 'online' -and $readyActuators.Count -ge 3 -and $readyReading.id) { return $process }
            } catch { }
            Start-Sleep -Milliseconds 500
        }
        throw 'Backend não iniciou no tempo esperado.'
    } catch {
        if (-not $process.HasExited) { Stop-Process -Id $process.Id; $process.WaitForExit() }
        throw
    }
}

function Send-Json([string]$path, [string]$method, $body) {
    Invoke-RestMethod "$base/$path" -Method $method -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes(($body | ConvertTo-Json -Compress)))
}

$stationProcess = $null
try {
    $stationProcess = Start-Station 'before'
    $previous = Invoke-RestMethod "$base/readings/latest"
    $reading = Send-Json 'readings' 'Post' @{waterLevel=63.7; flowRate=17.2; powerWatts=975; energyKwh=($previous.energyKwh + 0.1)}
    $fault = Send-Json 'faults' 'Post' @{message="Teste persistencia $([DateTime]::UtcNow.ToString('o'))"; severity='INFO'}
    $allActuators = Invoke-RestMethod "$base/actuators"
    $actuator = $allActuators[0]
    $changed = Send-Json "actuators/$($actuator.id)" 'Put' @{enabled=(-not $actuator.enabled)}
    $firstProcessId = $stationProcess.Id
    Stop-Process -Id $stationProcess.Id
    $stationProcess.WaitForExit()
    $stationProcess = $null
    $stationProcess = Start-Station 'after'
    $latest = Invoke-RestMethod "$base/readings/latest"
    $history = Invoke-RestMethod "$base/faults"
    $equipment = Invoke-RestMethod "$base/actuators"
    if ($latest.id -ne $reading.id -or $latest.waterLevel -ne $reading.waterLevel -or $latest.energyKwh -ne $reading.energyKwh) { throw 'Leitura divergiu após reinício' }
    if (-not ($history | Where-Object { $_.id -eq $fault.id -and $_.message -eq $fault.message })) { throw 'Evento não persistiu' }
    $persisted = $equipment | Where-Object { $_.id -eq $changed.id }
    if ($persisted.enabled -ne $changed.enabled) { throw "Estado do atuador divergiu: esperado=$($changed.enabled), recebido=$($persisted.enabled)" }
    if (-not (Test-Path "$backendPath/data/estacao.mv.db")) { throw 'Arquivo H2 não localizado' }
    $receipt = @{result='PASS'; firstProcessId=$firstProcessId; secondProcessId=$stationProcess.Id; reading=$latest; fault=$fault; actuator=$persisted; database='backend/data/estacao.mv.db'; checkedAt=[DateTimeOffset]::Now.ToString('o')}
    $receipt | ConvertTo-Json -Depth 6 | Set-Content "$cachePath/persistence-result.json" -Encoding UTF8
    Write-Output "PASS: leitura $($reading.id), evento $($fault.id) e atuador $($changed.id) preservados entre processos $firstProcessId e $($stationProcess.Id)."
    # Devolve o equipamento ao estado anterior após comprovar sua persistência.
    Send-Json "actuators/$($actuator.id)" 'Put' @{enabled=$actuator.enabled} | Out-Null
} finally {
    if ($stationProcess -and -not $stationProcess.HasExited) { Stop-Process -Id $stationProcess.Id; $stationProcess.WaitForExit() }
}
