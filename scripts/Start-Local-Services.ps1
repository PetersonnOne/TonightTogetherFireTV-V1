param([switch]$Lan)
$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
$taskNode=(Get-Command node.exe).Source
$taskLogRoot=Join-Path $taskRoot ('build\services\'+(Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $taskLogRoot -Force | Out-Null
$taskSpecs=@(@{port=4181;script='scripts\preview.mjs'},@{port=4182;script='server\rooms-server.mjs'},@{port=4183;script='server\provider-server.mjs'})
$taskStarted=@()
foreach($taskSpec in $taskSpecs){
 if(Get-NetTCPConnection -LocalPort $taskSpec.port -State Listen -ErrorAction SilentlyContinue){Write-Output "Port $($taskSpec.port) already in use; preserving the running process. Verify it is this project's service.";continue}
 $taskArguments=@(('"'+(Join-Path $taskRoot $taskSpec.script)+'"'))
 if($Lan -and $taskSpec.port -eq 4182){$taskArguments+='--lan'}
 $taskProcess=Start-Process -FilePath $taskNode -ArgumentList $taskArguments -WorkingDirectory $taskRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $taskLogRoot "$($taskSpec.port).out.log") -RedirectStandardError (Join-Path $taskLogRoot "$($taskSpec.port).err.log") -PassThru
 $taskStarted+=@{port=$taskSpec.port;pid=$taskProcess.Id;script=$taskSpec.script}
}
$taskStarted | ConvertTo-Json | Set-Content (Join-Path $taskLogRoot 'started.json')
Write-Output 'Preview 4181; room/participant service 4182; controlled provider 4183. Local test services only. No AWS resources or public deployment.'
Write-Output "Logs and started process IDs: $taskLogRoot"
