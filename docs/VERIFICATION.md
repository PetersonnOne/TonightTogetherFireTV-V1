# Verification report — 20 October 2026

> Historical Milestone 1 evidence. See [Milestone 2 verification](MILESTONE_2_VERIFICATION.md) for the connected edition and its evaluation artifacts.

**Result:** local evaluation candidate, version 0.1.0. The required local consensus features are implemented. Android TV Emulator is the tested target; physical Fire TV, Appstore certification and household research are separate, uncompleted validation activities. No publication or submission has occurred.

## Test results

| Layer | Result | Practical coverage |
| --- | --- | --- |
| Node logic/storage/catalogue | 21 passed, zero failed | Hard constraints, unknown metadata, individual/group scoring, bounded fairness, deterministic ties, rejection, agreement gating, chosen/watched separation, feedback validation, deletion scrubbing, failed writes, schema recovery, source records and 100-entry/six-viewer performance |
| Browser integration | 17 scenario groups passed | Participant changes; comparison; rejection; unanimous agreement; persistence; profile deletion; real catalogue/provenance; no-match boundaries; manual content review; escaped text; history search/filter; title editing/removal; failed writes; future-format preservation, cancellation and confirmed reset/reload |
| Browser directional reachability | 16 screen/state checks passed | Calls the actual navigation function and checks that every enabled visible control is reachable from initial focus, including forms, comparison, source/confirmation dialogs, saved/watched records, data and title management |
| Browser runtime requests/errors | Zero unexpected requests; zero script errors in integration run | Isolated local preview context; not a packet capture of every Android system process |
| Actual Android product | Passed the scenarios below | Product package, not the earlier standalone probe |

Scripts: [logic tests](../tests/), [integration](../scripts/qa/browser-regression.js), [directional checks](../scripts/qa/focus-regression.js). Run instructions: [RUNBOOK](RUNBOOK.md).

## Actual target observations

- Installed and rendered the product on Android TV API 30 x86, 1280 × 720, WHPX/software rendering. Inspected home, shortlist, agreement, history and native profile-entry screens.
- Fresh empty household: created **Viewer 1** with adventure and **Viewer 2** with comedy using real ADB D-pad key events only. Selected a 90-minute cap, opened a real sourced result, recorded both acceptances and saved it. The stored record remained `selected`, not watched. Read-only inspection confirmed the two distinct profiles and the recorded votes.
- Sample household: comparison, firm rejection, revised choice, all three acceptances, saving, watched status and reflection controls ran on the installed app. Native text dialog accepted and saved a short viewing note.
- Profile/history/feedback survived process force-stop/relaunch. With emulator snapshots disabled, a complete emulator shutdown/cold boot retained an identical household file; the saved note was also displayed after reopening.
- Android reported **Active default network: none** with guest Wi-Fi disabled. Saving another choice worked. The final evaluation APK also launched and accepted D-pad input in this state.
- A deliberately read-only QA household file/directory caused a visible “Not saved” message and left the saved bytes unchanged. Permissions were restored. All injected records were disposable test data.
- Clear-all confirmation produced an empty v1 record, which remained empty after relaunch. Injected future schema v99 opened recovery without overwriting it. Real D-pad confirmation reset the record to empty v1.
- Back returned from an evening to history, from profile to household, and to home. Source dialogs and confirmation focus were exercised.
- Native pure-ranking benchmark: 100 entries/six viewers, ten measurements, **maximum 80.2 ms**. This is host-specific engine timing, not whole-screen latency or an all-device guarantee.

Two input defects were caught and fixed: recovery initially lacked reliable centre-key handling before WebView consumed the event, and a newly opened profile inherited a previous form's Save position. Android now intercepts D-pad events in `dispatchKeyEvent`; recovery focuses its first control, and fresh forms discard stale form focus. Real remote onboarding/recovery and the browser regression were repeated after the fixes.

## PRD acceptance matrix

“Pass” below means the documented local test scope, not universal device certification.

| Criterion | Evidence/result |
| --- | --- |
| AC-01 remote onboarding | Pass: two contrasting real-catalogue profiles through a saved choice with actual D-pad events; editable default aliases avoid mandatory typing |
| AC-02 ranking responds | Pass: controlled participant/constraint changes and explanation checks |
| AC-03 hard boundaries | Pass: excluded/unknown fields blocked, including real catalogue unknown content coverage |
| AC-04 compromise/fairness | Pass: mean/minimum and capped fairness tests; hard filters run first |
| AC-05 faithful reasons | Pass: displayed individual facts, group result and comparison share the deterministic result; no generated rationale |
| AC-06 disagreement/no-match | Pass: firm rejection and revision, explicit unknown-content no-match, sparse preference neutral handling |
| AC-07 agreement / watched | Pass: saving requires all participants; saved choice is not automatically watched |
| AC-08 durable memory | Pass: process and cold-emulator restart, watched state, rating/note retrieval |
| AC-09 ownership/deletion | Pass: profile scrubbing, history/fairness deletion, clear-all and relaunch checks |
| AC-10 navigation | Pass within 16 checked screen/states plus actual native flows and Back; exhaustive physical-device and screen-reader coverage not claimed |
| AC-11 failure/recovery | Pass: browser and native write failures; future-format preservation, cancellation and explicit reset |
| AC-12 offline/privacy | Pass within package/source inspection and tested offline journey; no Android permissions, runtime backend, account or analytics SDK |
| AC-13 provenance/rights | Pass for shipped metadata and original visual assets; film rights, suitability, current availability and audio tracks are explicitly unverified |
| AC-14 target demonstration | Local Android TV capture completed with labelled sample titles; public hosting and submission pending |

## Evaluation artifact inspection

`build/app/tonight-together-evaluation.apk`: **42,060 bytes**. SHA-256:

```text
482f0d99480e46cc72bdc728c8f2d5dcfcd46c4476e3571af3e8bf06649e9254
```

apksigner verification passed. Manifest inspection confirms debuggability false, backup false, no permissions, landscape Leanback launcher and bundled icon/banner. Archive inventory contains only product HTML/CSS/JS, catalogue/core modules, resources, DEX and signature metadata. No private records, signing keys, development scripts or raw logs are packaged. After installing this evaluation artifact, the app launched offline, D-pad opened its profile form, Back returned home, and no WebView inspection socket was listed.

The APK uses a local development signing identity. Byte hashes change with signing identity/build changes; do not treat this as a reproducible-build cryptographic guarantee. Keep the key private. Store release signing and review are not completed.

## Remaining limits

The 24-record real catalogue has unknown content-exclusion coverage, so firm exclusions can produce zero results. Household-entered, explicitly reviewed records offer a transparent recovery path. Original-language data does not verify a streaming edition's audio/subtitles. No playback, provider API or service-availability promise is made.

No physical Fire TV, older WebView compatibility matrix, screen-reader audit, multi-household study or measured decision-time benefit is established. Semantic labels, visible focus, pressed-state marks and navigation checks support accessibility without claiming certification. Shared-device votes are visible statements, not authenticated individual ballots.
