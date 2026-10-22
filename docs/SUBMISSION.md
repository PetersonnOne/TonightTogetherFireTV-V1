> **Current connected-edition materials:** Use [Milestone 2 submission draft](MILESTONE_2_SUBMISSION_DRAFT.md) and [completed official narrated video](../Submission%20Video/README.md). The baseline description below is retained as historical fallback preparation.

# Submission preparation

**Project:** Tonight Together. **Primary track:** Fire TV. **State:** local evaluation candidate; nothing uploaded or submitted. The current event checklist and source links are in [delivery](../PLATFORM_VALIDATION_AND_DELIVERY.md).

## Description draft

One screen. Different tastes. A night worth sharing.

Tonight Together helps the people around a television choose something they can willingly accept together. Each viewer brings preferences and firm boundaries. The app narrows the field, shows each person's fit and the compromises behind a group result, supports comparison and rejection, and requires everyone's recorded acceptance before saving the choice.

It remembers evenings locally, separates choosing from watching, and uses a small transparent fairness adjustment so recent compromises can inform the next decision. Profiles, history, individual reflections and household-added titles can be inspected, changed or deleted. No account, streaming-service login, backend or remote model is required.

The implementation is a Java Android host with bundled web UI, deterministic JavaScript ranking and app-private AtomicFile storage. The evaluation APK runs on Android TV Emulator, with offline operation, restart persistence and failure recovery tested. It includes 24 sourced real metadata records and a separate labelled illustrative scenario for reproducible demonstrations. The app does not provide playback or claim current streaming availability or guaranteed suitability.

## Demonstration

A silent local Android TV walkthrough is under ignored `build/demo/`. It shows sample setup, 90-minute ranking, comparison, firm rejection, a revised choice, three acceptances, saving and the separate watched action. It uses the actual installed UI; automated focus assistance was used during capture. Independent real D-pad-only onboarding and consensus checks are documented in [verification](VERIFICATION.md).

Suggested owner-narrated sequence, under three minutes:

| Time | Show / explain |
| --- | --- |
| 0:00–0:20 | The family has made time together, but tastes differ. Introduce the consensus problem and clearly identify sample data. |
| 0:20–0:45 | Select viewers and tonight's time/mood. Preferences and firm boundaries play different roles. |
| 0:45–1:15 | Show individual fits and a visible compromise. Compare two; a high average alone does not decide for everyone. |
| 1:15–1:45 | Record a firm no, revise without weakening boundaries, then gather each person's acceptance. |
| 1:45–2:10 | Save the choice, separately mark watched, show optional reflections and searchable memory. |
| 2:10–2:35 | Show local data controls. Mention offline operation, 24 sourced metadata records, separate fixtures and honest availability limits. |
| 2:35–2:50 | Close on the value: a choice the household understands and willingly shares. |

Use original UI footage. No third-party film clips, poster art, copyrighted soundtrack or synthetic voice is included. The current capture is a technical walkthrough, not a claim of an observed real family's satisfaction. Select/edit the final video and host it through the owner's approved account.

## Developer feedback draft — based on this implementation

| Tool / purpose | Worked well | Friction / suggested improvement | Build again? |
| --- | --- | --- | --- |
| Android SDK: APK compilation, packaging/signing | Installed javac/D8/aapt/zipalign/apksigner supported a very small dependency-free host | Tool paths and build-tools versions need explicit configuration; a compact maintained TV starter with local storage would improve onboarding | Proposed yes, for an offline TV experience |
| Android TV Emulator / WHPX: accepted target checks | Genuine remote input, app-private storage and cold-restart/offline tests were possible without buying hardware | On this older host, transport readiness preceded framework readiness and cold boots were slow; expose a single clear ready-for-apps signal | Proposed yes; budget disk and startup time |
| WebView / AtomicFile: local UI and persistence | Shared JS logic, isolated bundled assets, local text dialog and atomic saving worked | D-pad needed interception before WebView default handling; older WebView inspection conflicted with current test-tool APIs | Proposed yes, with explicit input and version coverage |
| Node.js / Playwright CLI: regression | Pure engine/storage tests and isolated UI contexts gave fast feedback | Current ARIA snapshot tooling expected an API missing from the older target WebView; a QA-only compatibility shim was needed | Proposed yes, with native checks retained |
| Wikidata: source metadata | Structured CC0 metadata and entity provenance made a bounded catalogue possible | Rate limits, ambiguous title matches and versioned runtimes required checks; content boundaries/availability were not established by these records | Proposed yes for metadata, with explicit coverage limits |

These are draft engineering observations, not invented participant quotes. The project owner should review the final feedback answers.

## Owner-controlled release steps

- Decide GitHub visibility. Public distribution needs an approved open-source licence; a private judging repository needs the required reviewer access. No source licence has been selected automatically.
- Review the APK, source notices, description and final video. Confirm ownership/team information and entrant eligibility.
- Upload approved repository/video, grant any required access and submit the project through Devpost. Check live requirements and deadline again.

Do not upload the private retrospective catalog, signing key, household records or raw diagnostics. No external messages or collaborator invitations have been sent.
