> **22 October video completion:** [Final narrated demo and captions](Submission%20Video/README.md) are exported and checked. Sarah is the approved voice. Public hosting/submission remain pending.

> **21 October presentation update:** Final visual improvements and labelled fictional programme names are implemented. [Current verification](docs/FINAL_IMPROVEMENTS_VERIFICATION.md) records 31 tests, browser/connected checks and native playback. [Five separate submission PNGs](Submission%20Screenshots/README.md) are saved for manual upload. The official narrated walkthrough is now exported; evaluation-package reinstall smoke remains pending. Earlier screenshots/video below are historical.

# Start here — Tonight Together Milestone 2

**Current state — 21 October 2026: connected local implementation and evaluation packaging.** See [status](PROJECT_STATUS.md), [verification](docs/MILESTONE_2_VERIFICATION.md) and [runbook](docs/MILESTONE_2_RUNBOOK.md).

The current working app remains in the sibling `Tonight Together` folder. This separate `Tonight Together - Milestone 2` folder contains an independent copy of its source, not a Git clone of committed history: the original repository had no commits and its source was untracked. Fifty-five copied files were SHA-256 checked before milestone documentation changes. A separate local Git repository is initialized on branch `milestone-2`; no remote, commit, publication or upload was created.

Read [the second PRD](Tonight_Together_Milestone_2_PRD.md). The existing [main PRD copy](Tonight_Together_PRD.md) stays unchanged as the baseline. Do not expand the original main PRD or implement Milestone 2 in the original checkout.

## What is protected

- Original source and main PRD remain in their original folder.
- Original evaluation APK: sibling `Tonight Together/build/app/tonight-together-evaluation.apk`.
- Original video: sibling `Tonight Together/build/demo/tonight-together-demo-60s.mp4`.
- This clone also has ignored `build/fallback-reference/source/`, `source-manifest.json`, `artifact-manifest.json`, and exact APK/video copies. Signing keys, household records, raw runtime logs and the original private retrospective catalog were not copied.
- All inherited verification reports describe Milestone 1. They are not evidence that the richer features have been built or that a new APK passes.

## Resume sequence

1. Resume only when the user asks. Read this checkout's AGENTS.md and private retrospective index.
2. Isolation is implemented: package com.tonighttogether.milestone2, browser key tonight-together-m2-v1, preview/session/provider ports 4181/4182/4183. The separate provider package is com.tonighttogether.testprovider. Keep these identities distinct from the fallback.
3. Preserve the deterministic boundaries, revision-safe agreement and explicit watched semantics. Reproduce the integrated journey with the documented tests before changing it.
4. Treat AWS and model access as unverified. Prepare a concrete small deployment/cost configuration before any account action; do not send keys in chat or embed them in clients.
5. Verify all required second-PRD criteria before selecting this candidate. Keep Milestone 1 deployable independently at every gate.

## Deadline decision

Official submission deadline: **23 October 2026 at 20:00 Africa/Lagos**, checked 20 October. Planned candidate decision: 22 October at 20:00 Lagos; final-materials target: 23 October at 16:00 Lagos. These are planning checkpoints, not automations. If required Milestone 2 scope cannot pass in time, retain Milestone 1 for submission and continue richer work later. No merge is required to choose a candidate.

Connected sessions, negotiation, feedback adaptation and the separate controlled provider now exist. AWS deployment and Bedrock remain optional, unperformed work. The original separation record is historical rather than the present implementation status.
