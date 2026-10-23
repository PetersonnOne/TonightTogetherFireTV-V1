# Tonight Together — connected edition submission draft

**Draft, 21 October 2026.** Replace placeholder delivery links only after the selected artifacts are hosted and accessible to reviewers. This document does not constitute submission.

## Elevator pitch

Give everyone a say in tonight's viewing. Tonight Together helps a household find common ground, understand the compromise, reach fresh agreement and remember what worked.

## The problem we chose

The television is shared; individual recommendations rarely explain how to reconcile the people sharing it. Discovery friction and group-viewing research led us to focus on the decision between people. The [README](../README.md) links the historical Amazon, Microsoft Research and household anecdotal sources and distinguishes them from impact validation.

## What we built

A television host with an independent browser companion: people join through a QR/link, receive approval and share their own preferences. Hard boundaries run before ranking. The app shows individual fit and compromises, respects a firm rejection, and proposes a specific adjustment when time or mood blocks progress. Changing the candidate or needs clears earlier votes. Only unanimous current agreement saves an evening.

Explicit watched ratings can teach the next recommendation within a small, explainable bound. Two ratings are required before genre influence appears. People can inspect, disable, reset or delete that evidence. A separate controlled provider accepts signed links, streams an original test clip over HTTP, handles simulated access and availability failures, and returns to the saved choice without silently marking it watched.

## Why it is distinctive

The demonstration is about reaching an understood agreement. Independent participation, meaningful revision, transparent learning and a complete choice-to-provider-to-history loop serve that purpose. The rules and explanations share the same facts; no remote model invents suitability or agreement.

## Implementation and proof

Plain web technologies in a Java Android TV shell, Node room/media services, temporary capabilities, revisioned decisions, AtomicFile local storage and a separate Android test-provider activity. No runtime framework dependency or AWS account is required for local evaluation. See [architecture](MILESTONE_2_ARCHITECTURE.md), [verification](MILESTONE_2_VERIFICATION.md) and [reviewer setup](MILESTONE_2_RUNBOOK.md).

The final-polish suite passes 31 tests; the baseline browser journey passes 17 scenario groups; directional reachability passes 20 screens/states. Three independent participant browser tabs complete the integrated journey. Android TV Emulator verifies the native host, actual test-media playback, Back return and record preservation. These claims have the scope detailed in the verification report.

## Honest boundaries

Illustrative entries, synthetic learning histories and controlled provider states are visibly labelled. The catalogue contains metadata, not commercial film rights. This is not Netflix/Prime Video integration, verified commercial availability, physical-device certification or evidence of family satisfaction. AWS/Bedrock deployment is optional and unperformed. Browser sessions do not establish physical-phone LAN compatibility.

## Delivery fields to fill

- Source URL: https://github.com/PetersonnOne/TonightTogetherFireTV-V1 — pushed to main; anonymous access returns404, so private-repository reviewer access must be arranged.
- Public video URL: pending hosting and access check.
- APK download URLs: pending hosting; local evaluation artifacts are listed in verification.
- Submission form/category/eligibility: recheck current official requirements before publishing.

## Completed video asset — 22 October

The official narrated walkthrough (kept locally) is 2:29.6 with ElevenLabs Sarah narration and English captions. [Export checks](official-demo/PRODUCTION_STATUS.md) distinguish verified local production from pending public hosting.
