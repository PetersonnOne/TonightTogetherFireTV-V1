param([switch]$Headless, [switch]$KernelLog)
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskSdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
$taskAvdRoot = Join-Path $env:USERPROFILE '.android\avd'
$taskAvd = Join-Path $taskAvdRoot 'TonightTogetherTV.avd'
if (-not (Test-Path -LiteralPath "$taskAvd\config.ini")) { throw 'TonightTogetherTV is not configured yet.' }
$taskExisting = Get-CimInstance Win32_Process -Filter "Name = 'emulator.exe'" | Where-Object { $_.CommandLine -match '-avd TonightTogetherTV' }
if ($taskExisting) { throw 'TonightTogetherTV is already running. Use the existing instance or shut it down cleanly first.' }
$taskLogs = Join-Path $taskRoot ('build\emulator\' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $taskLogs -Force | Out-Null
$taskArgs = @('-avd','TonightTogetherTV','-port','5556','-cores','2','-accel','on','-gpu','swiftshader','-feature','-Vulkan','-no-snapshot','-no-audio','-no-boot-anim','-camera-back','none','-camera-front','none')
if ($Headless) { $taskArgs += '-no-window' }
if ($KernelLog) { $taskArgs += '-show-kernel' }
$taskProcess = Start-Process -FilePath "$taskSdk\emulator\emulator.exe" -ArgumentList $taskArgs -WindowStyle Hidden -RedirectStandardOutput "$taskLogs\stdout.log" -RedirectStandardError "$taskLogs\stderr.log" -PassThru
@{pid=$taskProcess.Id;startedAt=(Get-Date).ToString('o');logs=$taskLogs} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $taskRoot 'build\emulator\latest.json')
Write-Output "Started TonightTogetherTV; PID $($taskProcess.Id); adb serial emulator-5556. Snapshots disabled. Logs: $taskLogs"
