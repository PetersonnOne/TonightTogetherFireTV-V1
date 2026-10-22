# Platform check application

Temporary, separately packaged application for validating the Android TV target before committing to the product shell. This is not the Tonight Together product interface.

Build using the existing local Android SDK and Android Studio Java runtime:

```powershell
.\scripts\Build-PlatformProbe.ps1
.\scripts\Start-TVEmulator.ps1 -Headless
```

The emulator script uses a single `TonightTogetherTV` AVD, port 5556, software graphics and accelerated CPU execution, with snapshots disabled. Omit `-Headless` for a visible emulator surface. Software graphics deliberately avoids relying on the old host GPU; rendering performance still needs evaluation.

Once `adb -s emulator-5556 shell getprop sys.boot_completed` returns `1`, install `build\platform-probe\tonight-platform-probe.apk` and start `com.tonighttogether.probe/.ProbeActivity`.

Verify the initial focus, select “Save a local test choice” using D-pad centre, navigate down to open the saved choice, and press Back. Force-stop/relaunch the app and confirm the saved value remains. Shut down/relaunch the emulator without wiping data and check again. Finally select “Clear test data”, relaunch, and confirm “Saved: None”.

The debug app requests no Internet permission and disables application backup. Its only record is dummy platform-check data in private SharedPreferences; this does not establish product data architecture or a full framework/platform privacy audit. The debug signing key stays in ignored build output and is not a release signing identity. Android build-tool and API documentation: [d8](https://developer.android.com/tools/d8), [SharedPreferences](https://developer.android.com/reference/android/content/SharedPreferences).
