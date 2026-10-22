param([switch]$Evaluation)
$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
$taskSdk=Join-Path $env:LOCALAPPDATA 'Android\Sdk'
$taskTools=Join-Path $taskSdk 'build-tools\35.0.0'
$taskJava='C:\Program Files\Android\Android Studio\jbr'
$taskOutput=Join-Path $taskRoot 'build\provider'
New-Item -ItemType Directory -Path "$taskOutput\classes","$taskOutput\dex" -Force | Out-Null
function Check-TaskExit { if($LASTEXITCODE -ne 0){throw "Provider build failed: $LASTEXITCODE"} }
& "$taskJava\bin\javac.exe" --release 8 -classpath "$taskSdk\platforms\android-35\android.jar" -d "$taskOutput\classes" "$taskRoot\provider\ProviderActivity.java"
Check-TaskExit
$taskClasses=@(Get-ChildItem "$taskOutput\classes" -Filter '*.class' -Recurse | Select-Object -ExpandProperty FullName)
& "$taskJava\bin\java.exe" -cp "$taskTools\lib\d8.jar" com.android.tools.r8.D8 --min-api 24 --lib "$taskSdk\platforms\android-35\android.jar" --output "$taskOutput\dex" @taskClasses
Check-TaskExit
$taskManifestText=Get-Content "$taskRoot\provider\AndroidManifest.xml" -Raw
if($Evaluation){$taskManifestText=$taskManifestText.Replace('android:debuggable="true"','android:debuggable="false"')}
Set-Content "$taskOutput\AndroidManifest.xml" $taskManifestText -Encoding utf8
& "$taskTools\aapt.exe" package -f -M "$taskOutput\AndroidManifest.xml" -I "$taskSdk\platforms\android-35\android.jar" -S "$taskRoot\android\res" -F "$taskOutput\unsigned.apk"
Check-TaskExit
Push-Location "$taskOutput\dex"
try { & "$taskTools\aapt.exe" add "$taskOutput\unsigned.apk" classes.dex; Check-TaskExit } finally { Pop-Location }
& "$taskTools\zipalign.exe" -f 4 "$taskOutput\unsigned.apk" "$taskOutput\aligned.apk"
Check-TaskExit
$taskApk=Join-Path $taskOutput $(if($Evaluation){'tonight-together-test-provider-evaluation.apk'}else{'tonight-together-test-provider.apk'})
& "$taskJava\bin\java.exe" -jar "$taskTools\lib\apksigner.jar" sign --ks "$taskRoot\build\app\debug.keystore" --ks-pass pass:android --out $taskApk "$taskOutput\aligned.apk"
Check-TaskExit
& "$taskJava\bin\java.exe" -jar "$taskTools\lib\apksigner.jar" verify $taskApk
Check-TaskExit
Write-Output 'Provider APK verified.'
