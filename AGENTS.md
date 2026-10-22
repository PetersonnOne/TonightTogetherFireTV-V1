# Milestone 2 isolation and continuation

This checkout is the independent richer milestone, NOT the preserved fallback. Read MILESTONE_2_START_HERE.md and Tonight_Together_Milestone_2_PRD.md first. The copied Tonight_Together_PRD.md is the unchanged baseline specification, not an instruction to add richer features to the original folder.

The user resumed local Milestone 2 development on 21 October 2026. Implement and verify the milestone in this checkout. No AWS deployment or spending is authorised by this local resume; prepare a reviewable deployment first.

The original sibling Tonight Together checkout and its original primary PRD, package/data, APK and video are the fallback. Do not edit, reset, move, delete or merge into it. The ignored build/fallback-reference folder holds a verified source snapshot and copied evaluation artifacts; never overwrite that reference during ordinary builds.

Isolation is implemented: Android package com.tonighttogether.milestone2, browser key tonight-together-m2-v1, ports 4181/4182/4183 and separate provider package com.tonighttogether.testprovider. Preserve separate signing/build output and keep secrets/private records ignored. No SDK/emulator-image copy or download is needed. Consult PROJECT_STATUS.md and docs/MILESTONE_2_VERIFICATION.md for current coverage.

The instructions below are inherited baseline conventions and continue where compatible with the milestone PRD and the user's later directions.

# Tonight Together project working instructions

## Product authority

Follow the selected Household Consensus concept, the user-approved name Tonight Together, and subsequent user decisions. Target Fire OS; Vega is excluded. Keep the competitive product quality bar and local-first boundaries in the PRD. Read the README and relevant requirements before changing product scope.

## Retrospective Catalog — living project history

The user explicitly requests descriptive, detailed, relevant activity logs that are maintained during or after tasks and consulted when issues arise.

The user requires `Retrospective Catalog/` to remain local and excluded from uploads. Preserve its `.gitignore` rule; never force-add, publish, attach or copy its contents into a public artifact. Keep public status reports concise and free of private log content. Do not create public Markdown links to ignored catalog files. If these files ever become tracked in a future repository, remove them from the index without deleting the local originals before any push.

- At the start of substantive work, read `Retrospective Catalog/README.md` and search the index for the affected component or issue. Read only the relevant logs rather than the entire catalogue.
- Before repeating troubleshooting, consult previous symptoms, commands, failed attempts, confirmed outcomes and open hypotheses. Reuse evidence where still valid; recheck drift-prone host and runtime state.
- During a long task, record meaningful decisions, failures, recoveries and checkpoints. At task end or interruption, update the relevant log and index with exact current status and the next concrete action.
- Use descriptive dated Markdown filenames: `YYYY-MM-DD_topic_action_or_issue.md`. Continue an active incident log; use a new dated log for a distinct task or later session and cross-link related records.
- Include purpose, scope, environment, actions and rationale, errors, hypotheses versus confirmed causes, validation evidence, files changed, limitations, and continuation instructions as applicable. Do not invent times, test results, successful fixes or completed steps.
- Preserve failed attempts and corrections. Append a dated follow-up rather than silently rewriting an earlier observation into a success. Keep a clearly labelled current-state summary so old observations are not mistaken for current facts.
- Link to actual code, evidence and authoritative sources. Reference large logs and binary artifacts by path instead of duplicating them. Capture the useful diagnostic excerpt and method. Do not include credentials, keys, personal household information, full environment dumps, or irrelevant raw tool noise.
- These records complement the PRD and delivery checklist. They do not automatically change requirements, authorise system changes, or establish production readiness.

This instruction governs project records, not global agent memory. Do not write or modify global memory as part of catalogue upkeep.


