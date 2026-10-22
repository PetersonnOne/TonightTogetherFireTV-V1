# Hackathon Developer Friction Log — Tonight Together

**Project:** Tonight Together (Family App)  
**Track:** Fire TV  
**Recorded:** 22 October 2026  
**Environment:** Windows development computer; Android TV API 30 x86 emulator at 1280×720; WHPX, two virtual cores and software rendering; Java Android/WebView host; local Node services and current Playwright tooling.

We built a Fire OS-targeted application using the event-accepted Android TV Emulator. These entries describe what happened in that environment. We have not reproduced them on a physical Fire TV. They are developer-experience observations, not claims that Amazon caused every issue or that every device behaves this way.

Severity describes impact on our workflow: **High** blocked the attempted step until a workaround was found; **Medium** disrupted testing or recording while the core app could still run. We have not invented time-loss totals or attributed uncertain root causes to the platform.

## 1. A connected ADB transport did not always mean the emulator was ready

**Tool/component:** Android TV Emulator, ADB and Android framework startup on our Windows host.

**Task attempted:** Install and launch the app after starting the emulator.

**Steps taken:**

1. Start the configured emulator and wait for ADB to detect the target.
2. Attempt APK installation or query activity/package services.
3. Check the guest boot-completed property and package service separately after an early command fails.

**Expected:** An apparently available target would be ready for installation and launch.

**Actual:** ADB visibility could precede usable framework/package services. Early attempts encountered an offline target or unavailable services, making incomplete startup difficult to distinguish from an app problem. Cold starts were also slow on this older computer. We did not establish a single cause for every early transport failure.

**Severity:** High during initial setup; it blocked installation and reliable checks until the guest was ready.

**Workaround:** We added a bounded readiness script checking `sys.boot_completed` and the package service. We waited for those checks before continuing and preserved emulator data instead of wiping it as a first response.

**Suggested improvement:** Include this distinction in emulator onboarding and provide a ready-to-install check. Report whether it is waiting for transport, guest boot or package services, with a clear timeout and diagnostic next step. This would stop developers debugging their app while Android is still starting.

**Outcome:** Later installation, native interaction and restart-persistence checks passed. This improved our host's workflow; it is not a universal emulator fix.

**Evidence:** [Readiness script](scripts/Wait-TVReady.ps1), [historical boot observations](evidence/PLATFORM_RUN_2026-10-20.md), [platform findings](PLATFORM_FINDINGS.md), and [product verification](docs/VERIFICATION.md). Historical baseline findings are distinct from the current connected-edition setup.

## 2. Current inspection tooling expected an API missing from the older WebView

**Tool/component:** Playwright inspection/ARIA snapshot tooling attached to the emulator's older Android WebView.

**Task attempted:** Inspect native-app controls and run UI checks through the debug WebView connection.

**Steps taken:**

1. Launch the debug APK and attach inspection tooling to its WebView.
2. Request an ARIA/accessibility snapshot with the current toolchain.
3. Compare the required visibility API with the target WebView's available API.

**Expected:** Inspection would enumerate the controls so we could select and verify them.

**Actual:** Snapshot tooling expected `Element.prototype.checkVisibility`, which this WebView did not provide. This was a test-tool/runtime compatibility issue; our product interface did not require that API.

**Severity:** Medium. It blocked that inspection path while the app itself could still run.

**Workaround:** We injected a small compatibility shim into the QA utility execution context. We kept it out of app code and retained separate real ADB D-pad checks instead of treating inspection success as proof of remote usability.

**Suggested improvement:** Publish a short compatibility guide for testing TV WebViews with current browser tools. Include feature detection, a supported fallback or tested tool versions, and a clear distinction between an application failure and a missing inspection-only API.

**Outcome:** Inspection and regression work could continue. Native remote-input and Back checks remained separate evidence.

**Evidence:** [QA-only shim](scripts/qa/webview-compat.js), [current runbook](docs/MILESTONE_2_RUNBOOK.md), and [native verification](docs/VERIFICATION.md).

## 3. Emulator action times were not a safe substitute for recording timestamps

**Tool/component:** ADB screen recording and video editing on the slower emulator host.

**Task attempted:** Record the native app/provider journey and align it with a short narrated demo.

**Steps taken:**

1. Start screen recording and log the wall-clock time of each interaction.
2. Pull the recording and use those event times to locate important moments.
3. Inspect actual frames, source duration and media presentation timestamps before editing.

**Expected:** The action log would be a close enough guide to select matching source moments directly.

**Actual:** Recording startup and sparse captured frames meant action times and the media timeline did not line up reliably. An early selection reached outside the usable source range, and the first assembled picture was shorter than intended. This exposed an assumption in our capture/edit workflow; we are not presenting it as a confirmed Fire TV recording defect.

**Severity:** Medium. We had to review and correct source selections before trusting the submission movie.

**Workaround:** We inspected actual recorded frames and media timestamps, corrected source ranges, checked that selected segments contained video, and used explicit frame holds where appropriate. We preserved originals and verified final duration with ffprobe. Narration timing stayed natural.

**Suggested improvement:** Provide a TV-emulator capture recipe covering recorder startup, recording limits and media-time versus wall-time behavior. A small verification example checking non-empty output and usable source duration would help developers prepare accurate demos on slower machines.

**Outcome:** The corrected narrated film is 149.625 seconds and passed full decoding. This is a recovered production workflow, not a claim that every emulator capture has this problem.

**Evidence:** [Final production report](docs/official-demo/PRODUCTION_STATUS.md), [edit and duration-normalization logic](scripts/Assemble-OfficialDemo.py), and [export verification](Submission%20Video/verification.json).

## Related feature requests

A maintained TV WebView starter, an emulator readiness/compatibility checklist and a companion-browser/local-media testing recipe would address the most repeatable parts of this experience. See [Developer Feedback and Feature Requests](Submit%20Project/05%20Developer%20Feedback%20and%20Feature%20Requests.md) for descriptions and priorities.

## Scope and evidence boundaries

We fixed application-specific focus, stale-state and presentation defects during development. Those fixes are not listed as Amazon developer-tool failures. Provider account/billing matters are also excluded because they do not establish a Fire TV platform defect. No private troubleshooting catalog, credentials, household records or personal/account logs are published here.

The [official rules](https://amazonappdev2026.devpost.com/rules), checked 22 October 2026, request the task, steps, expected/actual behavior, severity, workaround and actionable suggestion. They describe a possible bonus of up to 10%; submitting this document does not guarantee that bonus.
