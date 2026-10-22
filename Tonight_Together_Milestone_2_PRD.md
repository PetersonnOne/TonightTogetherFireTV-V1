# Tonight Together — Milestone 2 PRD

**Version:** 0.1 | **Created:** 20 October 2026, Africa/Lagos  
**Status — 21 October 2026:** Required local capabilities implemented following the user's resume instruction. Consult [Milestone 2 verification](docs/MILESTONE_2_VERIFICATION.md) for actual evidence and remaining coverage; the requirements below remain the governing scope. Optional AWS/Bedrock work is not deployed.  
**Purpose:** Build a richer household-consensus experience in an independent source clone while retaining the working Milestone 1 application as the deadline fallback.

## 1. Two milestones, one product identity

Tonight Together remains the product name. Milestone 1 is the existing local evaluation app. Its source, primary PRD, evaluation APK and walkthrough remain in the original `Tonight Together` folder. That original PRD is not expanded or replaced.

This sibling `Tonight Together - Milestone 2` folder is a separate source clone and local Git repository. Its inherited [baseline PRD](Tonight_Together_PRD.md) describes the original requirements; **this document governs the additional architecture and scope here**. Shared baseline requirements continue unless this document explicitly changes the corresponding behaviour in this clone.

The new milestone must not endanger the fallback. Before new executable work, give this app its own Android package ID, browser storage key, ports, build outputs and cloud environment. Do not install an app from this clone over the fallback package, copy household data automatically, or write to the original checkout. Improvements are not merged back automatically.

## 2. Customer problem and stronger outcome

The research-backed problem remains household disagreement over shared viewing. The richer experience should make individual participation easier, ask useful questions when choices conflict, remember explicit feedback and carry an accepted decision through a credible provider handoff.

The demonstration should show a complete story: people independently join tonight's session; their needs conflict; the app explains the obstacle and offers a focused next step; everyone accepts a revised choice; the controlled provider actually streams a test clip; the app retains the choice and lets people explicitly record watched status and feedback.

This is a proposed product benefit, not proof of time savings or family satisfaction. Keep the [existing research and claim boundaries](README.md) and [catalogue notices](CATALOGUE_SOURCES.md). A larger catalogue or an LLM alone is not the differentiator.

## 3. Scope and release priorities

| Capability | Required for a Milestone 2 release | Outcome |
| --- | --- | --- |
| Independent participation | Yes | Phone/browser joining through QR/link and session code; multiple participants; reliable live updates |
| Active negotiation | Yes | Diagnose conflicts and ask a targeted question without silently weakening firm boundaries |
| Transparent adaptation | Yes | Explicit watched feedback influences future preference fit within documented bounds |
| Controlled provider | Yes | Labelled mock service, actual test-media streaming, app handoff/return and honest failure states |
| Integrated TV experience | Yes | Remote-first host journey, coherent phone/TV presentation, durability and reconnection |
| Optional AWS deployment | Conditional enhancement | Makes connected sessions/test media accessible online, once account eligibility and deployment are verified |
| Optional Bedrock language input | Conditional enhancement | Converts natural input into proposed structured preferences; people confirm changes |
| Commercial availability API/provider | Deferred unless separately verified | No Netflix/Prime Video integration or live-commercial-availability claim is required for this milestone |

All required rows must pass before this milestone is described as complete. If they cannot be completed and demonstrated in time, select Milestone 1 for submission. Do not silently relabel a partial richer build as the finished Milestone 2.

Out of scope: building a Netflix replacement, accessing other apps' private histories, bypassing DRM, purchases, confidential authenticated household voting, automatic mood/emotion surveillance, camera features, social networks, required paid accounts for household members, and Vega OS.

## 4. Experience and requirements

### M2-F01 — Join independently

The TV host starts a short-lived room. Display a QR code, readable link and alternative code. Participants use a normal phone browser without installing an app. Test browser sessions can represent multiple phones when physical phones are unavailable; label that test method honestly.

- Host approves joining participants and maps them to tonight's viewers; aliases need not identify real people.
- Each participant sees their own editable preferences and response, plus the shared shortlist and progress. Do not expose other people's unshared draft responses through participant endpoints.
- The host sees who has responded and what is blocking progress. Explain the actual visibility boundary: the session operator/backend is not cryptographically excluded from processing responses.
- Joining late, leaving, host removal, duplicate requests and reconnection cannot create duplicate viewers/votes or restore revoked access.
- Keep a shared-remote path available. Phone participation must not be mandatory for basic use.

### M2-F02 — Negotiate a meaningful next step

Use structured blocker facts and deterministic candidate evaluation to identify why no choice works or why a candidate serves somebody poorly. Offer a useful, specific follow-up instead of random reshuffling.

- Distinguish a firm exclusion, an adjustable preference and unknown metadata.
- Compare permitted hypothetical changes, such as a different mood or a deliberately changed time cap. State what would change and why it may help; do not apply it without confirmation.
- When firm requirements conflict, acknowledge the conflict. Suggest adding a reviewed title, changing who is watching by consent, or pausing the decision.
- A firm no excludes that candidate from the current session. Alternative suggestions must respect the same active hard constraints.
- Any material change to participants, candidate, constraints or preference revision invalidates earlier acceptances and requires fresh agreement.
- Surface minimum individual fit and compromises, not just an attractive average score. Reasons must come from the actual calculation.

### M2-F03 — Remember explicit feedback

Separate three concepts visibly: declared preferences, preference-fit scores and actual voluntary ratings. A fit score is not a satisfaction prediction.

- Only explicitly watched records with valid individual feedback contribute to a learned preference adjustment. Selected-but-unwatched choices do not.
- Keep the existing bounded fairness mechanism distinct from preference adaptation; explain both and avoid double-counting the same signal.
- Define a versioned formula before implementation, with a small capped influence, minimum evidence count and neutral cold start. Explicit current preferences and hard requirements retain priority.
- Let viewers inspect, reset or disable learned adjustments. Profile/history deletion removes the relevant evidence and recomputes derived values.
- Demonstrate repeatability with a labelled synthetic history as well as a newly entered rating. Never present synthetic evenings as observations of a real family.

### M2-F04 — Controlled streaming provider

Build our own separately identified provider and service. It must not copy a commercial provider's brand or imply a commercial integration.

- Provide a small test catalogue with stable provider/title IDs, explicit simulated availability/entitlement states and short original or appropriately licensed media.
- Stream actual media bytes over HTTP locally or HTTPS in a deployed environment. Support byte-range requests, seek/retry and meaningful failure handling. Label a short clip as a test clip, not the full programme described by an illustrative recommendation record.
- Open the provider from an accepted saved choice. Send only the identifiers needed for handoff; do not send household profiles, notes or raw votes.
- Demonstrate ready, provider-not-installed, sign-in-required, subscription-required, region-unavailable, title-unavailable, expired link and service/network failure states. Test sign-in/entitlement actions are simulated, with no real credentials or money requested.
- Back/return brings people to the correct saved evening without duplicating it. Starting or finishing a clip must not silently mark the programme watched; that remains an explicit user action.
- Make simulated data and injected failures conspicuous in test mode. Keep the provider contract isolated so future authorised real integrations can be tested individually.

### M2-F05 — Consent, recovery and local continuity

Keep the baseline's inspect/edit/delete, saved history, chosen/watched separation, source notices and failed-write guarantees. Connected mode introduces a different data boundary and must explain it before session data leaves the device.

- Cloud participation is an optional session mode. Preserve local remote-only decisions when the network or backend is unavailable.
- Distinguish reconnecting, offline, stale data, expired room and provider errors. Never display stale votes as current agreement.
- Persist only the minimum intended household history locally. Use short-lived backend state for the room; do not upload complete historical notes/profiles by default.
- Retain unreadable/future records until deliberate recovery; add schema migration tests for any new persistent format.

## 5. Architecture and isolation

| Layer | Planned responsibility |
| --- | --- |
| TV Android host | Existing Java/WebView foundation, remote input, restricted provider handoff, app-private persistence |
| Shared domain modules | Eligibility, fit/fairness/adaptation, negotiation facts and versioned session transitions |
| Phone web client | Join, express preferences, receive shortlist, respond and reconnect |
| Session transport adapter | Local development service and optional deployed service using the same validated messages |
| Controlled provider | Separate TV package/player and metadata/media service with fault injection |
| Optional AWS | API Gateway/Lambda for room messages, short-lived DynamoDB state, S3/CloudFront for appropriate static/test media assets |
| Optional Bedrock | Structured language interpretation or question wording; never final authority for exclusions, eligibility or agreement |

Initial isolation targets: Android package `com.tonighttogether.milestone2`, separate provider package `com.tonighttogether.testprovider`, browser key prefix `tonight-together-m2`, preview port 4181, room service 4182 and provider service 4183. Confirm availability before use. The original preview remains on 4173; no second emulator image or copied SDK is needed.

Isolation is implemented and verified as of 21 October: separate package/storage/ports and provider identity. This table remains the required boundary for subsequent work; the original fallback must remain untouched.

Use one server-authoritative revision for the active candidate, participants and constraints. Every response carries room ID, participant capability, revision and request ID. Reject stale/unauthorised messages; deduplicate retries. Saving requires current-revision acceptance from every current participant and must be idempotent.

## 6. Session security and data lifecycle

Use unguessable participant/host capabilities; a short displayed join code alone must not grant host powers. Rate-limit joining and validate all IDs, payload size, allowed origins and provider URLs. Use HTTPS/WSS for publicly reachable sessions. Never put AWS credentials in the APK/browser or repository.

Proposed defaults: join invitations expire after five minutes unless renewed; rooms expire after two hours unless explicitly renewed. Enforce logical expiry on every request. If DynamoDB TTL is used, do not promise instantaneous physical deletion: expired items must be inaccessible immediately, with cleanup behaviour and retention limits documented and tested.

Allow host room closure and capability revocation. Do not log raw notes, full preferences or access tokens. Keep private retrospective records and signing keys ignored in this independent repository too.

## 7. AWS and account gates

The user confirmed an Amazon developer account and AWS promotional credits. Balance, expiry, eligible services, IAM permissions, model availability and testing entitlements remain unverified.

Local development must not depend on credits. Before a cloud deployment, prepare the actual infrastructure/configuration and cost estimate, check credit eligibility and confirm deployment within the user's authorised scope. Prefer small on-demand services; set operational request/media limits, billing notifications and a teardown procedure. A budget alert is not a guaranteed spending cap.

If Bedrock is used, validate schema, handle refusal/timeout/unavailable models and preserve the deterministic path. Do not send more household information than the feature needs. No AWS Builder claim is earned merely by mentioning services: document and demonstrate any actual integration.

## 8. Acceptance and test evidence

| ID | Required evidence |
| --- | --- |
| M2-AC01 | Baseline source/main PRD/artifact hashes remain unchanged; separate package, storage and ports verified |
| M2-AC02 | Three participant browser sessions join one TV session; edits/responses propagate to the correct clients |
| M2-AC03 | Revoked/expired capabilities, duplicate joins, stale votes and out-of-order messages cannot alter current agreement |
| M2-AC04 | Known conflict fixtures produce useful follow-up questions; unknown metadata and firm exclusions remain enforced |
| M2-AC05 | A material change invalidates votes; only unanimous current-revision acceptance saves exactly one evening |
| M2-AC06 | Explicit feedback produces a bounded, explainable change; reset/deletion removes its effect; no cold-start invention |
| M2-AC07 | Actual provider handoff and network clip playback work on Android TV Emulator; return preserves the chosen record |
| M2-AC08 | Each provider failure state has an accurate, actionable screen; no fake successful playback or silent watched flag |
| M2-AC09 | Disconnect/reconnect and server restart recover or explicitly expire the room without lost/duplicated saved choices |
| M2-AC10 | Core baseline journey, persistence, failed-write and deletion regressions pass in the richer clone |
| M2-AC11 | Host TV controls and provider remain navigable by D-pad/Back; phone layouts fit a narrow viewport and support touch/keyboard |
| M2-AC12 | Demo/setup distinguishes real application behaviour, synthetic histories, controlled-provider footage and any untested commercial/device claims |

Automate consequential domain/protocol/range/error tests. Exercise the actual installed APK for remote navigation, handoff, video, Back, lifecycle, persistence and network failure. Multiple browser contexts supplement but do not establish physical-phone or Fire TV hardware coverage. Optional Amazon-hosted testing is useful if accessible; it is not a development blocker.

## 9. Delivery gates and deadline fallback

The [official deadline](https://amazonappdev2026.devpost.com/rules) is **23 October 2026, 12:00 PDT / 20:00 Africa/Lagos**, checked 20 October. This leaves about three calendar days; it is not a four-day engineering commitment. The [FAQ](https://amazonappdev2026.devpost.com/details/faqs) accepts Android TV Emulator. Other entry/repository/video obligations still apply.

| Gate | Exit condition | If unavailable by checkpoint |
| --- | --- | --- |
| M2-0: Separation — this task | Clone, fallback reference, second PRD, pause/handoff and integrity check | Do not begin new architecture in the original |
| M2-1: First integrated slice — target 21 Oct | Isolated APK; participant room; revisioned agreement; ready-provider handoff/clip | Reassess feasibility before spending time on optional cloud/AI |
| M2-2: Required depth — target 22 Oct | Negotiation, adaptation, failure/reconnect coverage and core acceptance tests | Plan Milestone 1 submission if required rows remain incomplete |
| M2-3: Candidate choice — target 22 Oct, 20:00 Lagos | Working richer end-to-end candidate and credible evidence, or explicit fallback selection | Use preserved Milestone 1; keep richer work for later |
| M2-4: Final materials — target 23 Oct, 16:00 Lagos | Selected build tested, English demo/description/repository ready; final requirements/access check | Prioritise the verified fallback and submission buffer |

These are planning checkpoints, not scheduled jobs or a promise of completion. No feature development resumes merely because the date advances. Publication, account invitations, spending or submission must remain within the user's actual authorisation.

Preserve a runnable fallback at every gate. A failed richer experiment does not justify editing the original into a partial hybrid. Local milestones are not instructions to submit duplicate versions as separate hackathon entries.

## 10. Definition of done and continuation

Milestone 2 is done when its required scope and M2-AC01–12 have evidence, the actual emulator journey is coherent, claims match implementation, source/media notices are complete and reproducible instructions/demo exist. Production certification, physical Fire TV coverage, commercial provider support and real household impact remain separate unless actually established.

Current handoff — 21 October: **required local implementation and evaluation candidate**. Read [the start guide](MILESTONE_2_START_HERE.md) and [verification](docs/MILESTONE_2_VERIFICATION.md) for current evidence and limitations. Keep optional cloud/model work from consuming the submission buffer.
