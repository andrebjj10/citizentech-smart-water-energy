# Carregado pelos scripts; altera apenas o ambiente deste processo/terminal.
$projectRoot = Split-Path $PSScriptRoot -Parent
$localJava = Get-ChildItem (Join-Path $projectRoot '.tools') -Directory -Filter 'jdk-21*' -ErrorAction SilentlyContinue | Select-Object -First 1
if ($localJava) {
    $env:JAVA_HOME = $localJava.FullName
    $env:Path = (Join-Path $env:JAVA_HOME 'bin') + ';' + $env:Path
}
$localNode = Get-ChildItem (Join-Path $projectRoot '.tools') -Directory -Filter 'node-v24*-win-x64' -ErrorAction SilentlyContinue | Select-Object -First 1
if ($localNode) { $env:Path = $localNode.FullName + ';' + $env:Path }
$env:npm_config_cache = Join-Path $projectRoot '.cache/npm'
