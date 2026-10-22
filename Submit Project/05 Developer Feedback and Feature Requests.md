# Developer feedback — submission field answers

Prepared 22 October 2026 from the recorded build and verification work. Copy the text beneath each question into its matching field.

## Feedback Question 1: Which developer tools, APIs, and SDKs did you use and for what?

We used the Android SDK and Java to build our Fire OS-targeted TV app, with HTML, CSS and JavaScript inside Android WebView. Android AtomicFile keeps household records on the device. Android TV Emulator, ADB and Windows Hypervisor Platform let us check remote input, installation, provider handoff and persistence without physical Fire TV hardware.

Node.js runs the local participant-room and controlled-media services; its built-in test runner checks decision logic and HTTP behavior. Playwright supports browser/UI regression checks. Wikidata supplied sourced CC0 film metadata, alongside our separate illustrative fixtures.

OpenAI Codex assisted development and documentation, and built-in AI image generation produced promotional artwork. Python and FFmpeg supported the walkthrough. ElevenLabs Sarah through OpenRouter supplied narration, and Scribe v2 supplied word timestamps. Git and GitHub hold the source and reviewer materials. These speech services are production tools; the app's decision engine runs without a remote AI model.

## Feedback Question 2: For each tool, API, or SDK used in your project, what worked well?

The Android SDK tools let us build a small app with the Java and SDK installation already available. WebView let us reuse the interface and decision modules in the native app and browser preview. AtomicFile gave us a practical way to preserve records, which survived app and emulator restarts in our checks.

The emulator and ADB made native remote-input and provider-return checks possible on our existing computer. Node.js suited the small local services, and its tests made agreement rules and streaming responses easy to exercise. Playwright's separate browser contexts were especially useful for three independent participants.

Wikidata identifiers helped retain provenance. Codex helped us move between code, debugging, tests and documentation, with verification kept separate. Image generation produced matching original artwork. FFmpeg gave us inspectable exports, while Sarah's voice and Scribe's timestamps helped synchronize the movie. GitHub brought the source and evaluation material together.

## Feedback Question 3: For each tool, API, or SDK used in your project, what needs work?

Our biggest setup issue was telling when the emulator was really ready. ADB could appear before the package service was usable, and cold starts on this older Windows machine needed patience. A documented readiness check would make that less confusing.

The older target WebView lacked a visibility API expected by current Playwright inspection tools. We needed a QA-only shim. A compatibility guide and a small TV starter covering remote focus, Back and persistence would have saved integration work.

Wikidata still needed careful checking: title matches and runtimes do not establish streaming availability or complete content-boundary coverage. For recording, we had to inspect actual media timestamps rather than assume they matched emulator action times. Speech generation depended on provider account availability, so we separated picture editing from voice generation until the selected route worked.

Node.js and AtomicFile caused no project-blocking tooling issue in our verified paths. Codex output and generated artwork still needed tests and review. Our private GitHub repository needs an explicit reviewer-access step. We distinguish these observations from bugs in our own app; the friction log records concrete steps and workarounds.

## Feedback Question 4: For each tool, API, or SDK used in your project, how was your onboarding experience?

Reusing the existing Android SDK and Java installation got us to a small first APK without adding a large framework. Getting a dependable emulator session took more work: acceleration, storage, boot readiness and inspection needed attention. Once that was stable, the development loop became easier.

Web technologies and Node.js gave us a quick first interface and services. AtomicFile was straightforward, while D-pad and Back behavior needed deliberate work. Playwright was easy against the browser preview; attaching it to the older native WebView needed the compatibility step.

Wikidata was useful early, although validation took longer than retrieval. Codex helped organize incremental work. Image generation was quick to start, with text and visual review afterward. Python/FFmpeg needed an explicit shot and caption pipeline. A short Sarah audition made voice selection easier, and OpenRouter provided the successful speech route. Git/GitHub setup was straightforward; we documented reviewer access after checking the repository without a login.

## Feedback Question 5: Would you build with these devices and services again?

Yes. Fire TV fits a product about people sharing a screen, and Android/WebView let us keep the app small and its decisions understandable. We would use the SDK, AtomicFile and emulator again, with readiness and remote-navigation checks in place from the start.

We would also reuse Node.js and Playwright for services and testing, Wikidata for carefully bounded metadata, and GitHub for source and reviewer materials. Codex was useful across development and documentation, with tests and review guiding what we accepted. Python, FFmpeg and the approved ElevenLabs/OpenRouter workflow are reusable parts of our demo-production process.

For the next stage, we would add physical Fire TV and household evaluation rather than treating emulator checks as complete real-world validation.

## Optional Feature Requests

**Important — a maintained Fire TV web-app starter.** A small reference combining bundled WebView content, predictable D-pad focus, Back handling, app-private storage and a separate-activity handoff would help teams reach a useful TV prototype sooner. We had to assemble and verify these connected pieces ourselves. A working sample with tests would be more useful than isolated snippets.

**Important — an emulator readiness and compatibility checklist.** Explain how an available ADB transport differs from a usable Android framework, with checks to run before installing an APK. Include older WebView limitations that affect current inspection tools. This matters for people building on modest hardware or an existing SDK installation.

**Nice-to-have — a TV-and-companion local testing recipe.** Show a TV emulator, independent browser participants and a controlled media service together. Examples for loopback networking, ADB reverse, temporary invitations and safe return to the TV app would have helped us. Original test media would let developers validate the flow without commercial streaming accounts.
