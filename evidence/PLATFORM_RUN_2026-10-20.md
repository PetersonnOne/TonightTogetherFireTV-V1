**Historical installation/probe checkpoint.** Later actual product results are in [verification](../docs/VERIFICATION.md). Pending statements below describe this earlier checkpoint, not the current app.

# Platform installation and boot run — 20 October 2026

## Installed

- Single Google Android TV API 30 x86 image, revision 4, in the existing Android SDK. Download: 699,304,963 bytes; extracted archive contents: 3,337,096,169 bytes.
- Archive SHA-1 matched Google's published manifest: `f4151d2390fc015ddb2a7715bea9bc69a5ee0b4e`. The verified temporary ZIP was removed after extraction; the installed image remains. No additional SDK manager, Studio installation, framework, or TV image was downloaded.
- AVD `TonightTogetherTV`: 1280 × 720, 1536 MiB guest RAM, explicit two-core launch, software graphics, WHPX CPU acceleration, snapshots disabled, port 5556. The emulator can enlarge virtual data capacity beyond the requested configuration; monitor physical free space rather than assuming the initial requested size is its full cost.
- Built and signature-verified a separate small Java platform-check APK using installed SDK tools. Source and build script are local workspace artifacts; build output and the development signing key are ignored. Product application UI is not implemented by this probe.

## Actual evidence and unresolved issue

The emulator passed its startup compatibility checks and logged `Windows Hypervisor Platform accelerator is operational`. One kernel-logged run reported `Boot completed in 355611 ms` and ADB briefly listed the target as `device`. This confirms boot completion on this host, but not stable operation.

The guest then stopped its `adbd` debugging service on a `sys.usb.config=none` transition. The first attempted APK installation and UI queries failed because the device was offline; those are **not passes**. A one-core trial did not resolve the problem; the previous CPU value could also be restored by shutdown, so launch scripts now specify cores explicitly. Kernel logs showed TSC clock instability and stalls. A verbose root-console trial was stopped; ordinary launch is preferred while diagnosing the older host/runtime combination.

Follow-up: the automated wait reached ADB before Android framework services were ready, so initial settings and install commands failed with missing-service errors. Once the settings service was available, enabling debugging through `settings put global adb_enabled 1` succeeded. Root/property-write attempts were rejected by this production image; they were not fixes. A standard streamed probe installation then returned `Success`. After an initial launch timeout, a retry returned `Status: ok` and a foreground-activity query confirmed the probe. The latest normal boot log reported 166856 ms. Capture/input commands remained pending at the retrospective checkpoint; no visual, navigation or persistence pass is claimed. No Windows security setting, BIOS setting, or unrelated application was changed. Full history: private local retrospective.

## Acceptance status

| Check | Status |
| --- | --- |
| Image download and checksum | Passed |
| Image extraction and AVD discovery | Passed |
| WHPX startup | Passed |
| Android boot-complete log | Observed; approximately six minutes in one run |
| Stable debugging connection | Pending / unstable |
| Probe APK compile and signature verification | Passed |
| Probe install and launch | Passed after framework readiness and debugging setup; initial failures retained above |
| D-pad navigation and visible focus | Initial focus screenshot inspected; centre/down/centre opened saved detail; full focus/back coverage pending |
| Local save and retrieval | Passed for dummy choice through probe UI and preference-file check |
| Process/emulator restart persistence | Stored value is displayed after app force-stop/relaunch; cold emulator restart not tested |
| Explicit clear | D-pad action removes dummy preference record; subsequent restart after deletion not tested |
| Privacy/network audit of product | Not tested |

## Reproduction

Follow-up: capture and input commands completed successfully during retrospective creation. The inspected initial screenshot and subsequent detail-screen UI hierarchy confirm rendering, focus, D-pad choice saving and retrieval. The preference file retained the dummy value after app force-stop/relaunch. Launch waiting remains slow and can time out despite the probe becoming foreground later. Latest checked C: headroom was 10.96 GiB. Consult the private local incident log for the capture timing distinction and remaining checks.

Use `scripts/Start-TVEmulator.ps1 -Headless` and the serial `emulator-5556`. Omit `-Headless` to request a visible virtual TV. Build the separate probe with `scripts/Build-PlatformProbe.ps1`. Diagnostic logs live in ignored `build/emulator/`; do not publish them without checking their contents. The normal AVD contains only emulator/system setup data until installation succeeds; no real household profile has been entered.


