# Run Milestone 2 locally

The original Tonight Together remains the fallback. This independent checkout needs no AWS account for local use.

## Services

Run `scripts/Start-Local-Services.ps1` from this project. It starts missing services and preserves processes already using their ports; verify that existing listeners belong to this checkout. Alternatively run `npm run dev`, `npm run rooms` and `npm run provider` in three terminals.

Preview is at http://127.0.0.1:4181 and the participant page is at http://127.0.0.1:4182. Provider port 4183 is opened through a signed handoff. Launcher logs/process IDs are under ignored build/services. No cloud resource is created.

Default QR/link URLs are for this computer's browser sessions. For actual phones on the same trusted network, start the room service with `node server/rooms-server.mjs --lan` instead of its loopback-only instance. Check the advertised address; ROOM_PUBLIC_URL can override it when multiple interfaces make selection unsuitable. Do not expose the HTTP test service publicly. Public hosting requires a separate HTTPS deployment. Browser tests do not establish physical-phone connectivity.

## Android emulator

Reuse the installed SDK and TonightTogetherTV AVD. Do not download another image or copy the SDK.

1. Build the app with `scripts/Build-App.ps1`, then the provider with `scripts/Build-TestProvider.ps1`.
2. Start the emulator with `scripts/Start-TVEmulator.ps1 -Headless`, unless already running. Wait with `scripts/Wait-TVReady.ps1`.
3. Run `scripts/Connect-TVServices.ps1` to reverse emulator loopback ports 4182/4183 to the laptop. Repeat after restart.
4. Install `build/app/tonight-together-m2-debug.apk` and `build/provider/tonight-together-test-provider.apk` through ADB on emulator-5556.
5. Launch `com.tonighttogether.milestone2/.TonightActivity`.

These are actual local HTTP connections, not public Internet or commercial streaming. Guest Wi-Fi can remain disabled. On this older host, framework readiness may take several minutes. Avoid overlapping heavy browser scenarios, Java compilation and emulator boot when RAM is scarce; do not close unrelated user applications automatically.

## Richer journey

1. Load the labelled sample household or create profiles. Select tonight's viewers and constraints.
2. Invite phones. Selected preferences and bounded rating/fit summaries go to the session service; raw notes stay on the television.
3. Open the link in separate participant tabs or supported phone browsers. Enter aliases; the host explicitly maps requests to selected profiles.
4. Change preferences, discuss a candidate, object and revise. Material changes clear earlier acceptances. Negotiation proposals require confirmation.
5. Gather fresh acceptance from every viewer, save once and open the evening. Chosen remains separate from watched.
6. For an illustrative entry, open a labelled test-provider situation. Play/pause/seek the original eight-second clip, or exercise a failure state. Back/Return restores the saved evening. Playback never silently marks watched.
7. Optionally mark watched and rate. Two explicit watched ratings per genre are required before a bounded learned adjustment. Inspect/disable/reset it in Household. The labelled synthetic lab in Your data writes no fake household history.

Missing provider installation produces an explanatory message. A lost room connection disables consequential host actions until recovery. End rooms when finished. If closure cannot reach the service, capabilities still expire after two hours.

## Checks and packages

`npm test` runs baseline and milestone domain/HTTP tests. Optional Playwright CLI scripts are browser-regression.js, focus-regression.js and milestone-regression.js under scripts/qa. The milestone test uses a separate host context and three independent participant tab sessions, actual HTTP media and forced recovery cases. Native handoff and physical-device coverage require separate evidence.

Current Playwright needs the QA-only webview-compat.js shim after attaching to this older API 30 WebView. It is not part of the product. Evaluation builds disable inspection.

Use the Evaluation switch on both build scripts for non-debuggable evaluation packages. They remain locally development-signed, not Appstore-certified. Preserve private keys, build output and retrospective records. Read the milestone verification report for tested artifacts and remaining limits.
