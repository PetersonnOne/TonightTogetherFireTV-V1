# Tonight Together — Product Requirements Document

**Version:** 1.0 | **Date:** 19 October 2026  
**Status:** Required scope implemented for local evaluation; see [verification](docs/VERIFICATION.md) for tested acceptance criteria and remaining platform/release limits.  
**Product authority:** User-selected [Household Consensus concept](docs/PRODUCT_DECISIONS.md), refined by the user's confirmed name and competitive quality expectations.

## 1. Product purpose

Tonight Together helps a family or household reach a viewing choice that everyone can accept. People identify who is watching, express tonight's needs and boundaries, and compare a small shortlist whose reasons and compromises are visible. The household chooses; the app remembers its decision and any voluntarily entered feedback.

The central question is: **“What can we enjoy together tonight, and why is this a fair choice for us?”**

The product should reduce decision friction and make less vocal participants' preferences visible. Local processing supports trust and availability. Competitive strength comes from the complete consensus experience: useful disagreement handling, understandable tradeoffs, thoughtful TV interaction, and reliable memory.

## 2. Evidence and claims

The selected concept documents existing family and household friction around shared television preferences, mixed recommendations, and fragmented service profiles. Treat this as a research-supported pain point, not an invented problem. Its linked discussions are qualitative signals; they do not establish how many households experience it or prove that this app solves it.

| Evidence | What it supports | What remains unproven |
| --- | --- | --- |
| Existing [family profile discussion](https://www.reddit.com/r/fireTV/comments/o3cq55/link_firetv_profiles_to_netflix_mycanal_plex_or/) cited in the concept | Reported friction between household and streaming-service profiles | Population prevalence and willingness to use a separate app |
| Existing [parental-control discussion](https://www.reddit.com/r/fireTV/comments/1w655mu/need_better_parental_controls/) cited in the concept | Reported concerns about household viewing contexts | That preference filters guarantee age suitability; they do not |
| [Amazon conversational discovery research](https://www.amazon.science/latest-news/the-science-behind-the-new-alexa-what-should-i-watch-fire-tv-experience), cited in the concept | General conversational discovery overlaps with the earlier proposals | A competitive advantage for this app without a distinct consensus flow |
| User's selected direction | Product centres on household consensus and local control | Usability, adoption, recommendation quality, or measured benefit |

These are inherited sources, not freshly checked research on 19 October. Source availability and current platform capabilities need verification before external claims or implementation reliance.

Solution evaluation should ask whether households reach an acceptable decision, understand the compromise, feel heard, and would use the app again. Do not delay basic platform work while waiting for interviews; do not manufacture interview results.

## 3. Users and scope

Primary users are families, partners, and housemates sharing a television. Design for different tastes, available time, languages, and comfort boundaries without assuming a country, family structure, or content culture. Setup uses aliases and optional preferences; it does not require ages, relationships, email addresses, or sensitive personal facts.

Initial operating envelope: 1–6 local profiles, with 2–3 contrasting profiles in the principal demonstration. A solo session is supported but does not replace the shared-choice story. Profiles on a shared device are visible to other people using the app; local storage is not confidential storage between household members.

### Required competitive release

- Short onboarding and editable local profiles, plus a clearly labelled optional sample household.
- Guided session setup for viewers, mood, time, languages, and explicit exclusions.
- Deterministic ranking that balances individual fit and the least well-served viewer.
- Three explainable choices, individual fit details, and a direct comparison view.
- Explicit group acceptance and revision, including disagreement and no-match recovery.
- Fairness across completed sessions, visible as a small bounded ranking factor.
- Durable local choices, individual quick ratings, optional notes, and retrieval.
- Complete D-pad flow, clear focus, readable screens, error recovery, and data controls.
- A curated catalogue with field provenance and usable assets.

All of these form the intended release. “First vertical slice” below means an implementation milestone, not completion of the product.

### Deferred

Live LLM chat, voice input, accounts, cloud sync, backend services, external analytics, cross-service viewing history, verified live service availability, streaming playback, recording, printing/export, automatic reminders, and phone pairing. None is necessary to demonstrate the selected concept. New backend work requires an explicit scope decision and data-flow assessment.

## 4. Product experience and screens

| Screen | Required behaviour | Completion condition |
| --- | --- | --- |
| Welcome / Home | Explain the benefit briefly; start a session; manage household; reopen history. Offer sample data separately. | A returning household can start without repeating onboarding. |
| Household | Add, rename, edit, and delete profiles; choose a few likes, soft dislikes, languages, and hard exclusions. Preferences can be skipped. | User can inspect every stored preference and distinguish dislike from exclusion. |
| Tonight setup | Select viewers, mood, runtime cap or “Any”, and session overrides; show a concise final constraint summary. | At least one viewer and valid constraints are selected. |
| Shortlist | Show up to three titles, runtime, mood/genre information, group fit, individual fit, and two concise reasons. State compromises and uncertain metadata. | Group can explain why the first result appears and inspect alternatives. |
| Compare / Details | Compare two titles against the same viewers and constraints; show the largest tradeoff. | Comparison is useful without memorising another screen. |
| Agreement | Collect “Works for me”, “Prefer another”, or “Firm no” for each selected viewer; label this as shared-remote input. | Save the household choice only after all selected viewers accept. |
| No fit / Revise | Explain the active blockers; offer specific editable settings or catalogue additions. Preserve session state. | User can deliberately change a condition; hard exclusions never change silently. |
| Saved choice / History | Save a selection immediately; mark watched later; collect optional individual ratings and notes; filter by title, viewer, or status. | Saved information survives a normal app restart and remains retrievable. |
| Data and preferences | Explain local shared-device storage; delete profile, record, or all household data; distinguish sample data. | Deletion effects are explicit and verified. |

### Interaction rules

- Every required action works with directional controls, select, and back. Pointer and voice are unnecessary.
- Show one primary action per stage, predictable focus, and readable text from a television viewing distance. Avoid hover-only content and colour-only meaning.
- Back returns to the previous step with entered choices intact. Cancelling an active session requires confirmation; ordinary back navigation does not.
- Returning from details restores the previously focused title. Lists scroll the focused control into view. A modal retains focus until dismissal and then restores it.
- Keep the shortlist short. Additional candidates are available through “More choices”; rejection must not create an endless carousel.
- Require text entry only for a short profile alias or a user-added title; notes are optional. Use chips and explicit “Any” defaults for routine settings.
- Loading, save failure, invalid data, empty history, no participants, and no eligible titles each need a clear state and next action.
- Visual direction: warm, calm, social, and readable, with a consistent type and spacing system. Do not use a streaming-service clone as the product identity. Validate actual screens before claiming visual completion.

## 5. Session constraints and metadata

Firm exclusions filter eligibility. Soft dislikes affect fit. Store these separately and label the distinction in the interface. Hard runtime and language requirements apply only when explicitly selected. A preferred language can be soft; “must support” is hard.

For multiple mandatory viewer language sets, a title must have at least one declared language in each viewer's set; this indicates options exist, not that multiple audio tracks play simultaneously. If a common listening language is required, the household selects it as a session constraint. Do not infer subtitle, caption, or audio-description support from a title's language.

Missing metadata cannot satisfy a hard condition. Unknown runtime fails a selected runtime cap; unknown required language or exclusion coverage fails that hard check. Explain exclusion due to missing data separately from a known conflict. If content-tag coverage is incomplete, do not claim the title avoids all excluded themes. Use the catalogue's explicit coverage flags to decide whether that check is verifiable.

Preference exclusions aid household decisions; they do not certify age suitability. Never infer sensitive traits or silently assign child profiles. A displayed content classification must include its source and jurisdiction, if included at all.

## 6. Ranking and explanation contract

The following is the proposed v1 algorithm, to be calibrated with fixtures and household observation. It is application logic, not a claim of AI or objective quality.

### Eligibility first

1. Build effective constraints from selected profiles plus explicit session choices. Overrides apply to this session only unless deliberately saved to a profile.
2. Remove candidates violating any hard condition or lacking the metadata needed to verify one.
3. Remove titles receiving a session “Firm no”. Keep a local session record of the rejection reason only when the participant chooses one.
4. Score remaining candidates. Fairness never restores an ineligible title.

### Individual fit and group fit

Each available preference factor is normalised to 0–1. Genre/language matches use the matched fraction of the explicitly selected options. An unexpressed profile factor has zero weight and is omitted from the denominator. A title with unknown data receives zero for an expressed factor, with uncertainty shown. A known mood tag match is 1; a known non-match is 0. No selected mood means that factor is omitted.

Proposed weights: genre 0.60, soft language 0.25, session mood 0.15. Let `B_i` be the weighted mean of available factors for viewer `i`; if no factors are expressed, set `B_i = 0.50` and label “Limited preferences”. Let `d_i` be the fraction of expressed soft-dislike tags matched by the title, or zero when no dislikes were expressed.

`F_i = 100 × clamp(B_i − 0.25 × d_i, 0, 1)`

`G = 0.60 × mean(F_i) + 0.40 × min(F_i)`

Including the minimum individual fit prevents a very high score for one person from fully hiding a poor fit for another. Show `G` as “Group fit”, a preference guide, never as a probability, quality rating, or promise that everyone will like the programme.

### Bounded fairness adjustment

For each selected viewer, use up to five recent **watched** sessions they participated in. From the stored choice-time individual fit, calculate `need_i = max(0, 60 − mean(previous F_i)) / 60`. With no usable history, `need_i = 0`.

`J = 5 × mean(need_i × F_i / 100)`

Rank by `G + J`, retaining full precision until display. Show fairness separately as a bonus of at most five ranking points; the displayed group fit remains `G`. Break exact ties by higher minimum individual fit, then least recently watched, then stable title ID. Unwatched titles precede watched titles on recency ties.

Fairness uses historical fit, not inferred emotion or undisclosed tracking. Marking a saved selection watched is an explicit household action. Reopening, rating, or editing one session never counts as another session. The UI explains why previous sessions affected a ranking. Profile deletion and history deletion remove the corresponding fairness evidence. No promise of equal satisfaction follows from this heuristic.

### Explanations and tradeoffs

Ranking returns structured facts: eligibility checks, per-viewer component scores, dislikes, missing fields, group fit, fairness contribution, and tie-break reason. UI text must derive from those same facts. Store a scoring-version identifier.

Show both a positive reason and a meaningful compromise when one exists: “Fits the 90-minute limit; matches both viewers' comedy preference. One viewer's preferred language is unconfirmed.” Never claim every viewer likes a genre when only one does. Only verified hard conditions can produce statements such as “Fits your time limit”. If a weighted numerical lead is tiny, avoid language implying a decisive winner.

## 7. Agreement and disagreement

The shared remote records each person's stated choice; it does not authenticate who pressed a button or provide private voting. Show that limitation plainly during agreement.

“Prefer another” leaves the title eligible but opens comparison or more choices. “Firm no” removes it for this session. After two unsuccessful rounds, offer a deliberate edit to the session or a pause rather than repeatedly pushing similar titles. Hard exclusions remain in force until the affected preference is explicitly edited. For no matches, show which constraints rule titles out and offer changes without labelling excluded titles as recommendations.

Selection is saved only when all selected viewers choose “Works for me”. This means acceptance at decision time, not proof of enjoyment. One viewer may operate the remote on the group's behalf. The demo must not present this as independently collected votes.

## 8. Catalogue and local data

Target a compact catalogue of approximately 24–40 records spanning enough runtime, genre, mood, and language combinations to demonstrate real tradeoffs. This is a proposed coverage target, not a substitute for sourced metadata. Use rights-documented real records where feasible; clearly labelled fictional fixtures can support development but cannot masquerade as real programmes or availability data. Do not invent culturally specific titles, characters, or settings as approved brand canon.

Ship local text and simple code-native visual treatment initially; artwork requires documented reuse rights. A source URL alone does not grant asset or database reuse permission. Store the source, checked date, licence/permission basis, and field coverage for each record. Clearly label illustrative versus verified metadata and never mix fictional fixtures into the real catalogue without a visible distinction.

Support a basic “Add a title” flow after initial catalogue browsing: title, runtime, selectable genre/mood/language tags, and optional household-known source label. Missing fields remain unknown. No provider API or playback promise is implied. Avoid requiring manual catalogue entry during onboarding.

| Entity | Minimum fields |
| --- | --- |
| Profile | ID, alias, likes, soft dislikes, hard exclusions, language modes, timestamps |
| Title | ID, title, runtime or unknown, tags, language options, metadata coverage, provenance, illustration flag |
| Session | ID, participants, effective constraints, session rejections, agreement state, selected title, timestamps |
| Choice record | Session ID, title snapshot, participant IDs, score facts and version, selected/watched state, individual optional ratings and notes |
| App settings | Schema version, sample-data marker, local privacy explanation, display preferences |

Persist accepted choices atomically with their score snapshot. Save successful profile edits immediately. If a write fails, preserve entered information in memory, display “Not saved”, and allow retry; do not display a success state. Fairness reads only persisted watched records. Preserve records on ordinary app updates where the runtime permits; add a versioned migration and non-destructive recovery path for incompatible storage. Uninstall/device reset may erase local data and there is no backup/sync promise.

Profile deletion must remove the profile and their individual votes, ratings, notes, scores, and snapshots from history. Remove them from active sessions and recompute before agreement. Retain only nonpersonal title/date records and remaining participants' data; a record with no remaining participants is deleted. Derived caches and fairness data must follow the same rule. “Clear household” removes all household and user-added data; bundled catalogue records remain. Sample reset must never erase real household data without explicit confirmation.

## 9. Privacy and accessibility requirements

Core household operations require no account, remote model call, external analytics, or network dependency. Document dependencies and application network activity before using the phrase “household preferences and notes stay on this device”. Platform services may behave separately from the app; scope any verified claim to the application and tested environment. Do not log aliases, preference contents, notes, or ratings in diagnostic output.

Provide view, edit, and delete controls in the same app. Local data is accessible on a shared device; do not promise encryption, individual secrecy, regulatory certification, or parental enforcement without implementation evidence.

All controls have descriptive labels and visible focus; meaning does not rely on colour or animation. Respect reduced-motion capabilities where supported. Verify text contrast, layout at the chosen TV resolution, and label/reading order with available accessibility tooling. Record unsupported platform behaviour as a limitation rather than marking accessibility complete.

## 10. Acceptance criteria and quality targets

Targets are prospective; no measured results are claimed.

| ID | Required evidence |
| --- | --- |
| AC-01 | Fresh install can create two contrasting profiles and complete a session using remote controls alone; optional notes may be skipped. |
| AC-02 | Changing one participant or relevant constraint changes the known fixture ranking and corresponding explanation consistently. |
| AC-03 | Any hard exclusion removes a conflicting title; unknown required metadata cannot bypass the filter. |
| AC-04 | Controlled fixtures show that a higher mean fit cannot erase the specified minimum-fit contribution; fairness is bounded, deterministic, and cannot override exclusions. |
| AC-05 | Each displayed reason can be traced to scoring facts; group scores, rounding, and comparison use the same result. |
| AC-06 | Disagreement, firm rejection, zero results, and sparse preferences lead to actionable screens without silent relaxation. |
| AC-07 | Choice requires all selected participants' recorded acceptance; saving it does not mark it watched. |
| AC-08 | Profiles, choices, watched status, ratings, and notes survive process termination/relaunch; history retrieves the saved record. |
| AC-09 | Profile/history deletion also removes related historical personal data and fairness contributions; clearing all works after relaunch. |
| AC-10 | Every primary path, modal, empty state, and back transition is navigable with D-pad; focus restoration works. |
| AC-11 | Save failure and invalid stored data are exercised; recovery does not silently erase the household. |
| AC-12 | Core flow works after installation with networking disabled; dependency/network inspection supports the scoped privacy wording. |
| AC-13 | Catalogue provenance/rights review is complete for shipped records/assets, and no unverified service-availability claim appears. |
| AC-14 | Recorded demonstration runs in a currently accepted target environment and accurately labels sample data and limitations. |

On the recorded target, aim for shortlist recomputation within 200 ms for 100 catalogue entries and six profiles, and visibly responsive focus without perceptible input backlog. Record timings and device configuration rather than claiming all-device performance. Returning-user setup should target under 60 seconds in observed trials. Evaluate actual TV viewing readability and critical flow usability before declaring visual readiness.

Conduct exploratory sessions with 3–5 real households if access permits. Obtain consent; keep findings anonymous and local. Observe time to first acceptable choice, success without assistance, understanding of hard/soft preferences, perceived fairness, and willingness to return. This is formative evidence, not statistically representative validation. No external messages or participant recruitment are authorised by this PRD.

## 11. Competitive demonstration and release criteria

Proposed recording: 0:00–0:20 household problem and contrasting profiles; 0:20–0:50 tonight's constraints; 0:50–1:25 shortlist and visible compromise; 1:25–1:50 change a viewer or limit and see the result; 1:50–2:15 disagreement and agreement; 2:15–2:40 saved history, explicit watched state and quick feedback; 2:40–2:55 target environment, local data boundary, and catalogue scope. Adjust after current rules are checked. A polished demo must show actual interactions, not imply scenes or persistence that were not tested.

Release requires the full required scope, AC-01 through AC-14 with evidence, coherent visual QA, no unresolved blocker in launch/navigation/storage, reproducible setup instructions, dependency and catalogue notices, and a concise account of known limitations. Submit-ready and public-store-ready are separate statuses. Do not label the product production-ready based on an emulator demonstration.

## 12. Decisions and continuation

**Confirmed:** product name; Candidate 1 authority; local-first household consensus; competitive product depth; exclusion of broad AI-companion features from this MVP.

**Proposed defaults:** ranking formula and fairness window, shared-remote agreement, profile ceiling, catalogue size, screen map, and quality targets. Refine these from evidence without reopening the selected product direction unnecessarily.

**Unresolved through execution:** accepted runtime and tooling, actual persistence adapter, metadata/asset sources, measured usability, and final event obligations. Follow the [platform and delivery checklist](PLATFORM_VALIDATION_AND_DELIVERY.md). Verify the [official rules](https://amazonappdev2026.devpost.com/rules) and [FAQ](https://amazonappdev2026.devpost.com/details/faqs) before relying on prior deadline or simulator statements. This PRD does not claim a current rules check.

