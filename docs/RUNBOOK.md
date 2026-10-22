# Build, run and evaluate

> Historical Milestone 1 setup. For this connected checkout use the [Milestone 2 runbook](MILESTONE_2_RUNBOOK.md); package names, ports, services and outputs differ.

## Browser development preview

Use Node.js 22 or newer. There are no npm runtime dependencies to download.

```powershell
npm test
npm run dev
```

Open http://127.0.0.1:4173. Preview records belong to that browser origin and are separate from Android app data. Use a 1280 × 720 viewport for TV layout review. The installed APK remains the platform test.

## Android build on Windows

Install Android Studio, its Java runtime, Android SDK platform 35 and build tools 35.0.0. The script currently expects the standard per-user SDK location and Android Studio under Program Files; edit its explicit tool paths for other installations. It uses javac, D8, aapt, zipalign and apksigner directly. No Gradle or framework download is needed.

```powershell
.\scripts\Build-App.ps1
.\scripts\Build-App.ps1 -Evaluation
```

Outputs are `build/app/tonight-together-debug.apk` and `build/app/tonight-together-evaluation.apk`. Evaluation disables Android debuggability and WebView inspection. Both are signed with a locally generated development key under ignored build output. They are evaluation packages, not Appstore releases. Preserve that key locally for updates; a new key cannot replace an installed package with the old signature.

## Emulator

Create an Android TV API 30 x86 AVD named `TonightTogetherTV` at 1280 × 720. The existing Windows host uses Windows Hypervisor Platform, two emulator cores, 1536 MB RAM and software rendering. The image archive was approximately 699 MB; the extracted image is approximately 3.34 GB, with additional AVD and SDK storage required. Do not download another image if this AVD is already present.

```powershell
.\scripts\Start-TVEmulator.ps1
.\scripts\Wait-TVReady.ps1
$taskAdb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
& $taskAdb -s emulator-5556 install -r --no-incremental build/app/tonight-together-evaluation.apk
& $taskAdb -s emulator-5556 shell am start -n com.tonighttogether.app/.TonightActivity
```

The start script uses port 5556 and refuses a duplicate instance. Add `-Headless` for automated checks. Boot can take several minutes on older hardware; wait for framework/package readiness, not merely an ADB connection. Logs are under ignored `build/emulator/`. Never wipe household data as a routine troubleshooting step.

Use arrow keys/D-pad to move, centre/Enter to activate and Back to return. Left/right change a focused list's selection; up/down leave it. Text entry opens Android's local text dialog. Physical Fire TV and older WebView versions remain outside the current device coverage.

## Data and demo modes

Start with **Create your household** to use 24 real sourced film records. **Try the sample household** loads three neutral viewers and 24 explicitly illustrative entries, only when the household is empty. This makes disagreement, boundaries and fairness reproducible without pretending that invented titles are real films.

Use **Your data → Clear all household data** to remove local profiles, choices, feedback and added titles after confirmation. Sample mode can be exited this way. Uninstalling also removes app-private records. No cloud backup, export or account recovery is provided.

## Repeatable browser integration checks

The optional Playwright CLI scenario script is `scripts/qa/browser-regression.js`. It must run against the local preview and creates an isolated context so it does not change the user's preview records. Supply an already installed Chromium through Playwright CLI configuration; a new browser download is not required when a suitable one exists. Invoke `playwright-cli -s=<preview-session> run-code --filename=scripts/qa/browser-regression.js`.

For inspection of this older emulator WebView, current Playwright's ARIA snapshot utility needs the QA-only `scripts/qa/webview-compat.js` shim after CDP attach. The shim is not part of the APK. Browser checks do not replace actual Android persistence, offline and remote tests.
