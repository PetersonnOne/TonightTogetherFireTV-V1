> Historical baseline evidence. For the 21 October UI, media, tests and current rebuilt hashes, see [Final Improvements Verification](FINAL_IMPROVEMENTS_VERIFICATION.md).

# Milestone 2 verification

**Evidence date: 21 October 2026.** Required local feature implementation, browser/service regression and native emulator checks. This report supersedes inherited completion claims for this checkout; [Milestone 1 verification](VERIFICATION.md) remains historical baseline evidence.

**Submission scope decision:** The user explicitly chose to skip AWS on21 October. Local Android TV Emulator plus laptop-hosted services is the selected evaluation approach. AWS/Bedrock/public-cloud deployment is excluded from the candidate's required scope. Emulator testing is an evaluation environment; it does not establish universal device compatibility or competitive merit.

## Acceptance evidence

| PRD criterion | Observed evidence and scope |
| --- | --- |
| M2-AC01 Isolation | Original 55-file SHA-256 manifest rechecked unchanged. Separate package com.tonighttogether.milestone2, browser key tonight-together-m2-v1, ports 4181/4182/4183, separate provider package/key/build output. Main PRD unchanged. |
| M2-AC02 Participation | Three independent participant tab sessions in a phone-sized browser context join, receive host approval, change preferences and respond. Native host separately approves one Node protocol participant. No physical-phone test claimed. |
| M2-AC03 Session integrity | Automated authorization, revoked/expired capabilities, duplicate joins, stale revisions and idempotency cases pass. Monotonic change numbers prevent delayed polls overwriting newer snapshots. Host/participant capabilities are distinct; participant payloads omit others' raw preferences and votes. |
| M2-AC04 Negotiation | Conflict fixture proposes the next useful duration while preserving exclusions; soft-mood proposal requires improved minimum fit. Hard/unknown-metadata filters pass baseline regressions. Applying a proposal requires explicit confirmation and fresh acceptance. |
| M2-AC05 Agreement | Browser rejection/revision invalidates earlier votes. All three current acceptances save one selected record. Native host saves a three-viewer agreed record; service retry test returns the same decision. |
| M2-AC06 Learning | Tests cover two-rating threshold, bounded influence, reset, disable, hard-filter ordering and deletion scrubbing. Native synthetic lab visibly separates declared fit, feedback and fairness. Lab never writes fabricated household evidence. |
| M2-AC07 Provider | Separate Android activity opens through a signed ticket. Actual native H264 clip time reached 5.914958/8 seconds with no MediaError. Browser actual playback, pause and +3-second seek pass. Real native D-pad events pause at7.644204 seconds, then seek to the clamped8-second end with no media error. Native Back preserves the saved record unchanged and selected. |
| M2-AC08 Failure recovery | Browser sign-in/demo-access, subscription/demo-access, region, unavailable, expired and service-error screens pass. HTTP tests reject forged/expired/unentitled tickets. Native missing-install message leaves saved record available. Opening/returning never silently marks watched. |
| M2-AC09 Reconnection | Forced browser request outage disables consequential host controls; successful equal-state polling restores them after the identified recovery bug was fixed. Participant reload retains its own response. Actual service restart returns 410 for an old capability with an explicit local-history-preserved message. Rooms are intentionally memory-only. |
| M2-AC10 Baseline continuity | 30 domain/storage/HTTP tests and 17 browser scenario groups pass. Native explicit watched/rating4 record survives force-stop/relaunch. Full emulator cold-restart check is recorded separately below. |
| M2-AC11 Navigation | Directional reachability passes 20 screens/states including connected host/agreement and synthetic lab. Provider controls pass directional reachability. Real ADB centre/Back events verify native voting/save, Play and return. 390×844 participant layout is exercised; physical touch/screen-reader/all-device certification is not claimed. |
| M2-AC12 Honest demonstration | Sample, synthetic learning and controlled provider labels remain visible. Original test clip, source notices, reviewer runbook, submission draft and demo outline distinguish implementation from proposals and external unverified claims. |

## Reproducible checks

- `npm test`: **30 passed, 0 failed**. Baseline engine/storage plus milestone room, negotiation, adaptation and media HTTP cases.
- `scripts/qa/browser-regression.js`: **17 groups**, zero page script errors, zero unexpected runtime requests for the baseline local journey.
- `scripts/qa/focus-regression.js`: **20 screens/states** reachable through the actual app's directional navigation function. This is not a screen-reader audit.
- `scripts/qa/milestone-regression.js`: three participant sessions, preference revision, firm no, fresh unanimity, reconnect, one saved record, actual provider media, pause/seek, directional controls and failure screens.
- Android TV Emulator: API30 x86,1280×720,WHPX,software SwiftShader,snapshots disabled. Debug WebView inspection uses a QA-only compatibility shim for Playwright's newer checkVisibility expectation. That shim is absent from the APK.

Browser automation and native tests are separate evidence. Browser Playwright activation is not claimed as physical remote testing. Native QA combines locator focus/activation with explicitly identified real ADB D-pad events. Native participation uses one external Node protocol client; three independent browser clients are proven by the browser integration run.

## Evaluation artifacts

Both packages were built with the Evaluation switch and passed apksigner verification. Manifest inspection confirms debuggable=false and allowBackup=false. They are locally development-signed, not certified for an Amazon store.

| Local artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| build/app/tonight-together-m2-evaluation.apk | 62,994 | 40E4F7E7D4BCF4671481CA2F6AA1CAFE159C19665AA6B36FC3FFC9205DBC91C1 |
| build/provider/tonight-together-test-provider-evaluation.apk | 17,020 | F2C721BFC53ED95856161E859F4849740E1D958FDFAF42BA0B27FEEC0E998148 |

APK sizes exclude laptop-side services and the 467,697-byte original test clip. No new SDK image was downloaded. Build output, keys, runtime logs and private retrospective records remain ignored. Successful compilation alone is not runtime evidence.

Full cold emulator restart with snapshots disabled passed: the entire parsed AtomicFile state equals the pre-restart snapshot, including three profiles, one watched evening and the explicit rating4. Force-stop/relaunch independently passed. An actual room-service restart returned410 for the old capability, with local saved history intact.

Evaluation pair installation succeeded. The host launches and shows both the existing watched evening and the additional selected demonstration evening. Android run-as access is rejected because the package is not debuggable. The thirteen packaged web/source assets match their current source hashes; package inspection found no private records, keys or stale qrcode.mjs module.

Final non-debuggable pair smoke: opened the saved evening through host UI, launched the separate provider through the host's handoff, used real D-pad events to start media, observed moving test footage with the progress label at3.7/8seconds, then real Back returned to the still-selected evening. See [evaluation playback](screenshots/m2-evaluation-playing.png) and [preserved return](screenshots/m2-evaluation-return.png). Native source-video captures used the debug variant for QA focus assistance; these final screenshots independently verify the installed evaluation pair.

## Local walkthrough

`build/demo/tonight-together-m2-walkthrough.mp4`: **105.466667 seconds,1,069,330 bytes**, H264,1280×720,15fps,no audio. SHA-256: `CA0962AEA2B14BEC8345BDC52A08B813C5FD6FD61CE9CC4562C28D76C4C8F561`.

This is an actual emulator screen capture assembled from the host/provider journey and return/learning segment, normalized and accelerated2×. Contact-sheet inspection covers the QR room, revisioned disagreement/agreement, selected record, actual moving clip and synthetic lab. TV responses in this capture use shared-remote controls with automated QA focus assistance; independent participation is demonstrated by the separate three-tab browser run. It is a supporting silent walkthrough, not a finished narrated or hosted submission video.

Actual native screenshots: [connected host](screenshots/m2-connected-tv.png), [agreement](screenshots/m2-connected-agreement.png), [moving test clip](screenshots/m2-provider-tv.png), [labelled learning lab](screenshots/m2-learning-tv.png).

## Defects found and corrected

An equal-state response after reconnect originally failed to redraw the offline host; clearing the cached render comparison on failure fixed the repeatable outage scenario. Android's default video poster was blocked by content policy; a generic resource error was misclassified as fatal playback failure. An original same-origin poster plus handling only actual MediaError restored native playback. Stale-revision test races were fixed in the QA harness by waiting for command responses and visible revision convergence, without relaxing server checks.

## Practical limits

Under heavy concurrent browser/emulator tooling the host had approximately 315 MB free RAM and one local response probe took 7.5 seconds. Tests were sequenced to reduce contention. No universal device performance claim follows. Physical Fire TV/phone LAN, older WebViews, screen readers, commercial providers, family research, public HTTPS and AWS/Bedrock are untested or undeployed. A default loopback QR is for same-computer browser tests; follow the runbook's LAN instructions for phones. A two-hour logical capability lifetime limits orphan rooms, but a failed close request cannot guarantee immediate remote erasure. Temporary service state is lost on restart; saved local evenings remain durable.
