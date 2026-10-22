param([switch]$Evaluation)
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskSdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
$taskTools = Join-Path $taskSdk 'build-tools\35.0.0'
$taskJava = 'C:\Program Files\Android\Android Studio\jbr'
$taskJar = Join-Path $taskSdk 'platforms\android-35\android.jar'
$taskOutput = Join-Path $taskRoot 'build\app'
$taskClasses = Join-Path $taskOutput 'classes'
$taskDex = Join-Path $taskOutput 'dex'
$taskAssets = Join-Path $taskOutput 'assets'
foreach ($taskRequired in @("$taskJava\bin\javac.exe",$taskJar,"$taskTools\aapt.exe")) { if (-not (Test-Path -LiteralPath $taskRequired)) { throw "Required local Android build tool is missing: $taskRequired" } }
New-Item -ItemType Directory -Path $taskClasses,$taskDex,$taskAssets -Force | Out-Null
if ([IO.Path]::GetFullPath($taskAssets) -ne [IO.Path]::GetFullPath((Join-Path $taskRoot 'build\app\assets'))) { throw 'Unexpected generated-assets directory.' }
Get-ChildItem -LiteralPath $taskAssets -Force | Remove-Item -Recurse -Force
& (Join-Path $PSScriptRoot 'Generate-BrandAssets.ps1')
Copy-Item -Path "$taskRoot\web\*" -Destination $taskAssets -Recurse -Force
Copy-Item -LiteralPath "$taskRoot\src" -Destination $taskAssets -Recurse -Force
function Check-TaskExit { if ($LASTEXITCODE -ne 0) { throw "Build command failed: $LASTEXITCODE" } }
& "$taskJava\bin\javac.exe" --release 8 -classpath $taskJar -d $taskClasses "$taskRoot\android\TonightActivity.java"
Check-TaskExit
$taskClassFiles = @(Get-ChildItem -LiteralPath $taskClasses -Recurse -Filter '*.class' | Select-Object -ExpandProperty FullName)
& "$taskJava\bin\java.exe" -cp "$taskTools\lib\d8.jar" com.android.tools.r8.D8 --min-api 22 --lib $taskJar --output $taskDex @taskClassFiles
Check-TaskExit
$taskUnsigned = Join-Path $taskOutput 'unsigned.apk'
$taskManifest = Join-Path $taskOutput 'AndroidManifest.xml'
$taskManifestText = Get-Content -LiteralPath "$taskRoot\android\AndroidManifest.xml" -Raw
if ($Evaluation) { $taskManifestText = $taskManifestText.Replace('android:debuggable="true"','android:debuggable="false"') }
Set-Content -LiteralPath $taskManifest -Value $taskManifestText -Encoding utf8
& "$taskTools\aapt.exe" package -f -M $taskManifest -I $taskJar -S "$taskRoot\android\res" -A $taskAssets -F $taskUnsigned
Check-TaskExit
Push-Location $taskDex
try { & "$taskTools\aapt.exe" add $taskUnsigned 'classes.dex'; Check-TaskExit } finally { Pop-Location }
$taskAligned = Join-Path $taskOutput 'aligned.apk'
& "$taskTools\zipalign.exe" -f 4 $taskUnsigned $taskAligned
Check-TaskExit
$taskKey = Join-Path $taskOutput 'debug.keystore'
if (-not (Test-Path -LiteralPath $taskKey)) {
    & "$taskJava\bin\keytool.exe" -genkeypair -keystore $taskKey -storepass android -keypass android -alias tonight -keyalg RSA -keysize 2048 -validity 3650 -dname 'CN=Tonight Together Development'
    Check-TaskExit
}
$taskApk = Join-Path $taskOutput $(if ($Evaluation) { 'tonight-together-m2-evaluation.apk' } else { 'tonight-together-m2-debug.apk' })
& "$taskJava\bin\java.exe" -jar "$taskTools\lib\apksigner.jar" sign --ks $taskKey --ks-pass pass:android --out $taskApk $taskAligned
Check-TaskExit
& "$taskJava\bin\java.exe" -jar "$taskTools\lib\apksigner.jar" verify $taskApk
Check-TaskExit
Write-Output "Verified locally signed APK: $taskApk"

