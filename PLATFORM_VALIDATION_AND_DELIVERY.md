# Platform validation and delivery

> Inherited Milestone 1 checklist. Connected-edition artifacts and evidence are in [Milestone 2 verification](docs/MILESTONE_2_VERIFICATION.md) and [current status](PROJECT_STATUS.md).

Checked 20 October 2026. Required product scope remains the [PRD](Tonight_Together_PRD.md); implementation does not shrink it to a catalogue browser. See [verification](docs/VERIFICATION.md) for test boundaries.

| Gate | Current evidence/status |
| --- | --- |
| Runtime decision | Android WebView APK targeting Fire OS; Android TV API 30 emulator; Vega excluded |
| Launch / render | Actual product APK installed and rendered at 1280 × 720 |
| Consensus depth | Profiles, ranking, comparison, acceptance, rejection/revision, no-match recovery implemented |
| Memory / ownership | App-private AtomicFile, watched state, feedback, retrieval, deletion and explicit recovery implemented |
| Restart / offline | Process and cold-emulator restart persistence; saving with no active guest network verified |
| Save failure | Native read-only QA file/directory produced visible failure and unchanged saved data; permissions restored |
| Catalogue / assets | 24 sourced real metadata records; separate sample fixtures; original code-native visual assets; source notices |
| Automated regression | 21 logic/storage tests and 17 browser scenario groups pass |
| Remote / visual polish | Actual D-pad flows checked; initial recovery dispatch and new-form focus defects found and corrected; final pass documented in verification |
| Evaluation package / demo | Final evidence and artifact details in verification and demo runbook |
| Physical devices / household study | Not performed; no usability-impact or all-device compatibility claim |
| Publication / submission | Not performed; requires user account and repository/video choices |

## Current submission checklist

Rechecked against the [official rules](https://amazonappdev2026.devpost.com/rules) and [FAQ](https://amazonappdev2026.devpost.com/details/faqs) on 20 October 2026. The deadline displayed is **23 October 2026, 12:00 PDT (20:00 Africa/Lagos)**. Verify the live pages again before submission.

- Primary track: Fire TV. The FAQ accepts Android TV Emulator without physical hardware.
- Supply a runnable GitHub repository with setup instructions. Choose public with an open-source licence, or private with the specified Amazon/Devpost reviewer access.
- Supply an English description and a publicly hosted YouTube/Vimeo demonstration under three minutes, showing the intended platform running.
- Supply developer-tool feedback; optional concrete friction entries can strengthen the submission.
- Confirm entrant/team eligibility and rights, then submit through the account. No AWS mini-challenge claim: this build does not call AWS.

Prepared materials live in [submission preparation](docs/SUBMISSION.md). Repository visibility/licensing, public hosting, account invitations and final submission remain decisions/actions for the project owner. No private retrospective files, signing keys or raw diagnostics belong in an upload.

## Reproduction and release boundary

Use the [runbook](docs/RUNBOOK.md). Debug packages permit inspection; evaluation packages disable it but still use a local development signing identity. This is not Play Store/Appstore distribution signing or certification. Browser integration cannot establish Android storage or remote behaviour; those are separately exercised on the actual app. Keep the private living logs current during subsequent work.
