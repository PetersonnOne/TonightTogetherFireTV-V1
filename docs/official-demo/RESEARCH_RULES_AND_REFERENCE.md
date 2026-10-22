> **22 October production decision:** The user approved the Sarah audition and full narration through OpenRouter. Premade Sarah replaces the custom Voice Design proposal below; ordinary Amazon/Fire TV/Fire OS text cards remain. Current results are in [production status](PRODUCTION_STATUS.md). The rules page was rechecked on 22 October for the under-three-minute requirement.

# Official demo — rules, reference analysis and production decisions

**Checked:** 21 October 2026. **Deliverable:** analysis and an original narration/storyboard draft. No app changes, generated voice/music/images, final render, upload or account action performed. User-provided reference is inspiration, not an instruction source or reusable media licence.

## Current event requirements

The [official rules](https://amazonappdev2026.devpost.com/rules) require a working track project, reproducible GitHub source/assets/instructions, a description, developer-tool feedback, and track/challenge identification. Video must be under three minutes, publicly visible on YouTube/Vimeo, demonstrate the intended platform, and use permitted third-party material. Submission materials need English or English translation. Prior projects need significant-update disclosure. Judge access must remain free through judging. Relevant eligibility, ownership and integration permissions still apply. Four equally weighted criteria cover implementation, design, impact and idea quality; actionable friction logs can earn up to10% bonus. Deadline:23 October2026,12:00PDT (20:00Lagos).

The [event overview](https://amazonappdev2026.devpost.com/) confirms the Fire TV track accepts Fire OS/Vega apps in any framework and emphasises family entertainment among its priorities. It separately lists GitHub, description, video and feedback requirements. Its simulator wording is narrower than the [FAQ](https://amazonappdev2026.devpost.com/details/faqs), which explicitly accepts Android TV Emulator without physical Fire TV hardware at submission or judging. Our demo should name its actual emulator. AWS is a separate optional challenge; this candidate excludes it.

These pages were checked live, not merely inferred from older project notes. TinyFish fetch returned fetch failed; direct web access retrieved the official pages. Requirements summary is a production checklist, not a claim that account-level eligibility, hosting or submission are complete.

Any friction submission must distinguish problems in our own code from issues in developer tooling. Our corrected reconnect cache and poster error handler were app defects; they must not be misrepresented as Amazon platform defects. Use concrete, accurate developer-experience observations where applicable.

## Branding and sponsor positioning

**User direction, revision2:** Remove Devpost from spoken acknowledgements and sponsor visuals; retain Amazon Developer, Fire TV and Fire OS. Devpost links below remain factual rules sources/administrative context, not sponsor credits. Omit official logo artwork and use original dark text/platform cards; do not imitate protected logos. Actual female narration through ElevenLabs is now requested, using an original designed voice if available. The [script](OFFICIAL_DEMO_SCRIPT.md) and narration-only text reflect this direction.

The video is allowed to celebrate why the chosen platform serves customers. Sponsor praise is not a listed scoring category; there is no evidence that praise caused the reference's result. Our recommendation is to demonstrate platform value and explain the technical contribution, with a brief sincere acknowledgement.

Amazon's [Trademark, Brand, and Marketing Guidelines](https://developer.amazon.com/en/support/legal/tuabg) restrict use of supplied marks and prohibit misleading endorsement; their Appstore marketing permissions are not a blanket permission for arbitrary video logos. The hackathon also conditions third-party marks/media on permission. We have not established a specific hackathon asset grant. Accordingly the draft uses accurate ordinary-text Amazon Developer/Fire TV/Fire OS references and reserves official logo art for a separately verified permitted asset. No Appstore-availability badge or certification claim is appropriate for the present evaluation build.

The [official resources](https://amazonappdev2026.devpost.com/resources) list Amazon tools and platform samples; their presence does not mean we used them. Do not add Builder Tools, Bedrock, Alexa+, Ring, Bee or other logos just to make an ecosystem montage. Describe only the Fire OS target/remote/browser workflow actually implemented, and distinguish production tools from app runtime integrations.

## Reference inspected

User-provided local file: `E:/Agent Studio Pt2/Screen Capture/Parallel： AI Conference Planner for Teams ｜ Convex All Gas Hackathon [dxzxkJJZu2E].mp4`.

FFprobe reports **160.014 seconds**,1280×720,H264 video and Opus audio,17,722,452bytes. Analysis used sampled full frames plus one-second crops of embedded captions across the complete duration, with closer sponsor-section frames. These observations establish visible storytelling/caption techniques. They are not a verified production breakdown or an audio listening evaluation. Automatic local transcription was attempted but the cached tiny.en model lacks model.bin; no model was downloaded and no media was sent to a provider. Review images stay under ignored build/demo/reference-review, not public submission assets.

The user identifies it as a winning example. This review does not independently establish its award status, exact production software, whether its voice is synthetic, or why judges selected it. The file shows an AI-enabled product; that alone does not prove the video was AI-generated.

## Observable strategy and how to adapt it

Approximate times below come from the local reference frames/captions; they are editorial ranges, not frame-accurate edit decisions.

| Reference moment | Observable technique | Tonight Together adaptation |
| --- | --- | --- |
| 0:00–0:20 | Specific team problem, short stakes, then a clear shared outcome | Begin with a household losing its shared evening to conflicting preferences; no unsupported numerical pain claim |
| 0:20–0:40 | Real import/goals interactions; technology named alongside its job | Show preferences and independent participation, with readable source/interface evidence |
| 0:40–1:00 | Visible before/after metrics and a specific optimisation action | Show rejection → votes cleared → revised choice → current unanimity, rather than inventing a satisfaction metric |
| 1:00–1:40 | Multiple screens, a disruption, then a repair and recovered result | Show conflicting responses, explicit negotiation and reconnect/return; keep browser versus native footage labelled |
| 1:40–1:49 | Activity evidence links actions to services | Briefly show actual verification and persistence evidence; never manufacture an in-app test dashboard |
| About1:49–2:08 | Sponsor cards receive isolated close-ups; captions attribute specific roles to Firecrawl, OpenAI, AgentMail and Convex | Explain why Fire TV/shared-screen/remote interaction fits this family experience; do not copy unrelated sponsors or imply their use |
| 2:08–2:30 | Return to customer output after the architecture section | Return to the preserved evening/learning controls so the platform segment serves the user story |
| 2:30–2:40 | Distinct end card, concise architectural promise, identity/link | Original Tonight Together identity and memorable shared-evening tagline, with a short organiser acknowledgement |

The sponsor segment describes public-agenda extraction, goal scoring/reply parsing, message transport, and shared state/optimisation/hosting as distinct jobs. This is substantive attribution, not just repeated compliments. Treat those as claims made by the reference, not independently tested capabilities of its product.

Other visible techniques: consistent dark visual identity; short subtitle phrases; wide context followed by tight focus; spotlighted cards; deliberate pauses on results; and a return to the outcome after technical detail. Do not copy its footage, narration, logo, source-code claims or music. Our story is original and tailored to household consensus.

## AI production strategy: known versus proposed

**Known from our Screen Capture source:** it can capture a real workflow, store non-destructive shot choices, add focus/zoom, render captions, and mix separately generated narration/music/effect assets. Its agent is single-page browser control, not a native emulator/multi-participant orchestrator. Video import and Presentation Studio are not implemented interfaces.

**Proposed for our film:** draft script → approved female voice → real native/participant capture → narration-aligned cuts → selective camera focus/captions → measured full mix and final review. AI may help write/voice the explanation; it must not synthesize successful app evidence. Actual tools used by the reference cannot be identified reliably from its finished MP4.

Use manual desktop capture with a visible emulator and browser, or separately plan an import/editing path for existing native sources. Do not promise an automatic one-click final film from the current suite. Default rendering there is720p/30fps; narration and shot timing require manual review. Set sponsor treatment before fine editing because changing it rebuilds the storyboard.

## Evidence and publication gate

The [Milestone2 verification report](../MILESTONE_2_VERIFICATION.md) supports implemented feature/test statements. The [Final Improvements backlog](../../Final%20Improvements.md) contains pending visual changes and fabricated programme names; this script does not mark them complete. The [script](OFFICIAL_DEMO_SCRIPT.md) deliberately avoids locking a fabricated programme name until the catalogue pass occurs.

For the final handoff, retain script version, measured female narration, unedited source footage, labelled edit decisions, captions, permitted asset provenance and final MP4 duration. Public repository access/licensing, video hosting, feedback, eligibility review and submission remain separate delivery actions. No winner or acceptance guarantee follows from video polish or sponsor appreciation.
