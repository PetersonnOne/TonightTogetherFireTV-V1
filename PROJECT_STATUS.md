> **Video completed — 22 October:** Final local narrated demo is 2:29.6, with ElevenLabs Sarah, English subtitles and verified audio/video. Video files (kept locally) · [production checks](docs/official-demo/PRODUCTION_STATUS.md). Public hosting and submission remain pending.

> **21 October presentation update:** Final visual improvements and labelled fictional programme names are implemented. [Current verification](docs/FINAL_IMPROVEMENTS_VERIFICATION.md) records 31 tests, browser/connected checks and native playback. Five separate submission PNGs (kept locally) are saved for manual upload. The official narrated walkthrough is now exported; evaluation-package reinstall smoke remains pending. Earlier screenshots/video below are historical.

# Tonight Together — Milestone 2 status

**21 October 2026.** The richer local app is implemented. It is an emulator-tested evaluation candidate with three local services, a separate controlled-provider APK and no deployed AWS dependency. This checkout is independent of the preserved Milestone 1 fallback. See [verification](docs/MILESTONE_2_VERIFICATION.md) for evidence and limits.

## What is built

| Area | Implemented behavior |
| --- | --- |
| Original household experience | Profiles, sourced/sample catalogues, hard filters, group/minimum individual fit, fairness, comparison, explicit agreement, saved/watched separation, reflection, history and deletion |
| Independent participation | QR/link invites, temporary browser sessions, explicit host approval, per-person preference editing and responses, capability revocation/expiry |
| Reliable consensus | Material revisions invalidate votes; firm rejection removes a candidate; stale acceptance is rejected; unanimous current agreement saves one durable record |
| Active negotiation | Specific explained time/mood proposals; deliberate confirmation; firm exclusions remain enforced |
| Feedback learning | Two explicit watched ratings per genre before influence; bounded adjustment of at most three points per viewer; reasons, disable/reset and evidence deletion |
| Controlled streaming | Separate Android provider, signed short-lived links, actual HTTP MP4 byte streaming, play/pause/seek/return, labelled access/region/unavailable/expired/error situations |
| Continuity and privacy | AtomicFile local memory, reconnect feedback, logical room expiry, limited participant responses, notes excluded from room payloads, explicit data controls |

## Evidence collected

- **30/30 automated domain, storage and HTTP tests pass.** Includes baseline rules plus participant authorization, revisions, idempotency, negotiation, adaptation and actual media ranges.
- **17 browser regression groups pass**, with zero script errors and no unexpected requests in the local baseline journey.
- Three independent participant tab sessions complete the integrated room journey at a 390×844 viewport; rejection, reload, connection loss/recovery, single-record saving and provider error/recovery cases pass. These are browser sessions, not three physical phones.
- Android TV Emulator runs the connected host and separate provider. Native agreement saves; the clip actually plays; Back returns to the same saved evening without marking watched. Explicit watched feedback survives force-stop/relaunch and a complete cold emulator restart with snapshots disabled; the full saved state matches. Missing-provider recovery preserves the record.
- Directional reachability passes **20 screens/states**, including connected agreement and the learning lab. The separate provider's controls are reachable; browser pause and a three-second seek are asserted.
- Both evaluation APKs build, signatures verify and installs succeed. The non-debuggable pair passes visible handoff, actual playback and Back-return smoke checks. They use separate package IDs and local development signing.
- All 55 protected original source/document hashes remain unchanged. Private retrospective history and signing/build output remain ignored.

## What remains outside this local delivery

**User decision — 21 October 2026:** Skip AWS for this submission candidate. AWS/Bedrock deployment is out of scope, not a pending requirement or blocker. Continue with the verified local emulator/services approach.

AWS deployment, credit eligibility, public HTTPS hosting, Bedrock integration, commercial availability/playback, physical Fire TV and physical-phone LAN testing, screen-reader certification and real-household evaluation have not been performed. The test provider proves our controlled contract; it cannot establish Netflix/Prime Video compatibility. Saved choices work locally without the connected services; rooms and test streaming require those services.

Heavy concurrent tools put this laptop under memory pressure. Polling/reconnect work was verified after recovery, but broad hardware performance targets are not established. This is not an Appstore-certified or production release.

Public video hosting, repository publication, reviewer access and final submission are still external delivery actions. No AWS resources, purchases, upload, Git remote or submission were created during this implementation.

The new local walkthrough is `build/demo/tonight-together-m2-walkthrough.mp4` (105 seconds,1.07MB,silent,2× accelerated actual emulator footage). Both evaluation APKs are under build/app and build/provider; exact filenames/hashes are in verification. The richer [submission draft](docs/MILESTONE_2_SUBMISSION_DRAFT.md) and [demo outline](docs/MILESTONE_2_DEMO_OUTLINE.md) are ready for final publication preparation.

Use the [Milestone 2 runbook](docs/MILESTONE_2_RUNBOOK.md), [architecture](docs/MILESTONE_2_ARCHITECTURE.md) and [second PRD](Tonight_Together_Milestone_2_PRD.md). Inherited Milestone 1 reports remain historical baseline evidence.
