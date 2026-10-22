$ErrorActionPreference='Stop'
$taskAdb=Join-Path $env:LOCALAPPDATA 'Android\Sdk\platform-tools\adb.exe'
& $taskAdb -s emulator-5556 reverse tcp:4182 tcp:4182
if($LASTEXITCODE -ne 0){throw 'Could not connect room service. Start/wait for emulator first.'}
& $taskAdb -s emulator-5556 reverse tcp:4183 tcp:4183
if($LASTEXITCODE -ne 0){throw 'Could not connect provider service.'}
Write-Output 'ADB reverse connects emulator loopback to local test services; guest Internet access is not required.'
