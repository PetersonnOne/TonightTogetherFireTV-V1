# Platform findings

Checked 20 October 2026. Development targets a Fire OS-compatible Android APK; Vega is excluded. Android TV Emulator is explicitly accepted by the event's [FAQ](https://amazonappdev2026.devpost.com/details/faqs). Emulator success does not establish all-model Fire OS compatibility.

The installed Android TV API 30 x86 image runs at 1280 × 720 with WHPX, two virtual cores, 1536 MB RAM and software rendering. The image archive was 699,304,963 bytes and verified against its SDK-published SHA-1; extracted system-image files total approximately 3.34 GB. SDK/AVD growth needs additional space. No second image, framework runtime or browser was downloaded for this implementation.

The actual product APK launches, renders and performs the household consensus journey. Process and cold-emulator restart checks retained app-private data. Offline saving worked with Android reporting no active default network. The package declares no permissions. The input implementation intercepts D-pad events before WebView dispatch and handles Back separately; native text uses local Android dialogs.

Cold boots were slow on this older Windows host, approximately 102–167 seconds in observed runs. A connected ADB transport can appear before framework/package services are usable. The readiness script checks both. WHPX availability is established for this host; no broad speed or hardware compatibility guarantee is implied.

The early standalone platform probe is retained for historical reference. It is not the product. Current instructions are in the [runbook](docs/RUNBOOK.md), architecture in [ARCHITECTURE.md](ARCHITECTURE.md), and scoped evidence in [verification](docs/VERIFICATION.md).
