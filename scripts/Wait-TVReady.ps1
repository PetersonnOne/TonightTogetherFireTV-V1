param([int]$TimeoutSeconds = 420)
$ErrorActionPreference = 'Stop'
$taskAdb = Join-Path $env:LOCALAPPDATA 'Android\Sdk\platform-tools\adb.exe'
$taskDeadline = (Get-Date).AddSeconds($TimeoutSeconds)
while ((Get-Date) -lt $taskDeadline) {
    $taskBoot = & $taskAdb -s emulator-5556 shell getprop sys.boot_completed 2>$null
    if ($taskBoot -eq '1') {
        $taskPackageService = & $taskAdb -s emulator-5556 shell service check package 2>$null
        if ($taskPackageService -match 'found') {
            & $taskAdb -s emulator-5556 shell settings put global adb_enabled 1
            Write-Output 'Android TV boot and package service are ready.'
            exit 0
        }
    }
    Start-Sleep -Seconds 3
}
throw 'Android TV did not become ready before the timeout. Inspect the latest emulator logs; do not wipe data automatically.'
