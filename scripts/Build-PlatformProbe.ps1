$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskSdkRoot = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
$taskBuildTools = Join-Path $taskSdkRoot 'build-tools\35.0.0'
$taskJavaRoot = 'C:\Program Files\Android\Android Studio\jbr'
$taskAndroidJar = Join-Path $taskSdkRoot 'platforms\android-35\android.jar'
$taskBuildRoot = Join-Path $taskRoot 'build\platform-probe'
$taskClasses = Join-Path $taskBuildRoot 'classes'
$taskDex = Join-Path $taskBuildRoot 'dex'
New-Item -ItemType Directory -Path $taskClasses,$taskDex -Force | Out-Null
$taskUnsigned = Join-Path $taskBuildRoot 'probe-unsigned.apk'
$taskAligned = Join-Path $taskBuildRoot 'probe-aligned.apk'
$taskApk = Join-Path $taskBuildRoot 'tonight-platform-probe.apk'
$taskKey = Join-Path $taskBuildRoot 'probe-debug.keystore'
function Check-TaskExit { if ($LASTEXITCODE -ne 0) { throw "Build command failed: $LASTEXITCODE" } }
& "$taskJavaRoot\bin\javac.exe" --release 8 -classpath $taskAndroidJar -d $taskClasses "$taskRoot\platform-probe\ProbeActivity.java"
Check-TaskExit
$taskClassFiles = @(Get-ChildItem -LiteralPath $taskClasses -Recurse -Filter '*.class' | Select-Object -ExpandProperty FullName)
& "$taskJavaRoot\bin\java.exe" -cp "$taskBuildTools\lib\d8.jar" com.android.tools.r8.D8 --min-api 22 --lib $taskAndroidJar --output $taskDex @taskClassFiles
Check-TaskExit
& "$taskBuildTools\aapt.exe" package -f -M "$taskRoot\platform-probe\AndroidManifest.xml" -I $taskAndroidJar -F $taskUnsigned
Check-TaskExit
Push-Location $taskDex
try { & "$taskBuildTools\aapt.exe" add $taskUnsigned 'classes.dex'; Check-TaskExit } finally { Pop-Location }
& "$taskBuildTools\zipalign.exe" -f 4 $taskUnsigned $taskAligned
Check-TaskExit
if (-not (Test-Path -LiteralPath $taskKey)) {
    & "$taskJavaRoot\bin\keytool.exe" -genkeypair -keystore $taskKey -storepass android -keypass android -alias probe -keyalg RSA -keysize 2048 -validity 3650 -dname 'CN=Tonight Together Development'
    Check-TaskExit
}
& "$taskJavaRoot\bin\java.exe" -jar "$taskBuildTools\lib\apksigner.jar" sign --ks $taskKey --ks-pass pass:android --out $taskApk $taskAligned
Check-TaskExit
& "$taskJavaRoot\bin\java.exe" -jar "$taskBuildTools\lib\apksigner.jar" verify $taskApk
Check-TaskExit
Write-Output "Built and verified: $taskApk"
