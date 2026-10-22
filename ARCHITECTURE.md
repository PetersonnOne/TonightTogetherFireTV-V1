# Tonight Together — implementation architecture

> Historical Milestone 1 architecture. For this connected checkout use [Milestone 2 architecture](docs/MILESTONE_2_ARCHITECTURE.md) and [current status](PROJECT_STATUS.md).

Decision recorded 20 October 2026. Target: Fire OS-compatible Android APK, tested first on the event-accepted Android TV Emulator. Vega is excluded. This is a development build; certification, physical Fire TV coverage and production readiness are not established.

## Selected structure

- **Product UI:** bundled HTML/CSS/ES modules in `web/`. No hosted site, React runtime, Google service, remote model or third-party JavaScript dependency is required. The interface uses semantic controls, explicit focus and D-pad movement. Android text entry uses a local native dialog.
- **Decision logic:** pure modules under `src/core/`. The UI consumes the same ranking/individual-fit facts exercised by Node tests. Saving requires each selected viewer's explicit acceptance. Watched state is a separate action.
- **Android host:** `android/TonightActivity.java`, a small standard WebView host serving only bundled assets from an intercepted application origin. File/content access is disabled, external navigations blocked, no Internet permission declared, and backup disabled. The JavaScript bridge exposes a local record read/write API and native text entry only. The APK has no declared permissions, and the core flow has been exercised offline. Physical-device/network-stack certification is not claimed.
- **Storage:** schema v1 household record in an app-private UTF-8 file through Android `AtomicFile`. The bridge synchronises calls, and the JS store advances memory only after a successful write. Corrupt or future-schema records lead to an explicit recovery state, not silent reset. Browser preview uses separate localStorage and is not Android persistence evidence. No export/cloud sync is promised.
- **Catalogue:** 24 real Wikidata CC0 film metadata records plus household-added records. A separate sample mode contains 24 clearly labelled illustrative fixtures. Unknown content coverage never passes an exclusion check. See CATALOGUE_SOURCES.md for provenance and rights boundaries.
- **Build:** reuse installed Java and Android SDK tools with `scripts/Build-App.ps1`. It compiles, packages assets and signs a debug or non-debuggable evaluation APK, without fetching Gradle, a framework or a second emulator image. Both use the locally generated development key; production distribution signing remains separate.

## Why this path

The probe already established basic Android rendering, remote interaction and app-restart storage on this host. A small Android shell lets the project reuse its JavaScript ranking component and use a fast browser preview for iteration, while requiring actual emulator checks for platform behaviour. Native Kotlin/Compose or React Native would add dependencies and toolchain/download overhead without evidence of a necessary benefit for the chosen interaction.

Actual product storage has survived a cold-emulator restart with snapshots disabled. The actual product supplies the current persistence evidence; the historical probe is not counted as product verification. If target WebView focus/text/compatibility proves unsuitable, record evidence before revising the shell choice.

## Run

```powershell
npm test
node scripts/preview.mjs
```

Preview: `http://127.0.0.1:4173`. Browser preview storage is separate from installed app data.

```powershell
.\scripts\Build-App.ps1
.\scripts\Start-TVEmulator.ps1 -Headless
```

Wait for Android boot completion and available package/activity services, then install `build/app/tonight-together-debug.apk` through `adb -s emulator-5556 install -r --no-incremental` and launch `com.tonighttogether.app/.TonightActivity`. Never use the probe package name to report product-app validation. Debug keys and APKs remain ignored build output. The retrospective catalog stays private and ignored.


