# Official narrated walkthrough — 22 October 2026

**Completed local export:** [Tonight-Together-Official-Demo.mp4](../../Submission%20Video/Tonight-Together-Official-Demo.mp4), **2:29.6**, 1280×720 H.264 with female Sarah narration, AAC audio and burned-in English subtitles. Public upload/submission remains unperformed.

The user listened to and approved Sarah's audition, then authorized the full production. Narration uses ElevenLabs Sarah through OpenRouter, model `elevenlabs/eleven-v4`. This premade voice replaces the earlier custom Voice Design proposal. [Reusable voice identity and API recipes](../APPROVED_NARRATION_VOICE.md) cover direct ElevenLabs and OpenRouter; direct generation has not been retested after its earlier billing issue.

## What the completed video contains

The household problem and product reveal; native Android TV Emulator app footage; invitation and three independent browser participants; individual fit, firm rejection and fresh unanimous agreement; explicit learning controls; actual original-test-media playback through the separate controlled provider, including pause/seek/Back; recovery/persistence evidence; Fire TV/Fire OS platform positioning and Amazon Developer acknowledgement.

This is edited real application footage with cuts, speed changes to picture and frame holds. Source labels distinguish native emulator, browser development preview and the controlled provider. No physical Fire TV or commercial-service testing, Amazon endorsement, or measured household satisfaction is claimed. The five submission PNGs remain separate.

## Voice, timing and verification

The existing approved 333-word narration text is unchanged. Its original take lasts 147.6 seconds, with no time stretching, reverb or other voice effects. The final mix applies loudness normalization and pads the closing card. Scribe v2 transcribed all 333 words in order; only equivalent UK/US spellings differ. Actual word timestamps drive chapter starts and subtitle cues; character timing is interpolated within words, not phoneme alignment.

- Final duration: **149.625 seconds**, below 180 seconds.
- MP4 size: 6,969,400 bytes (6.97 MB).
- Full audio/video decode: passed without errors.
- Subtitles: 31 cues; all 333 approved words match exactly.
- Measured integrated loudness: -16.45 LUFS; true peak: -1.41 dBTP.
- Exported chapter frames reviewed across all ten chapters; audio/video streams and ending timing checked.
- SHA256: `99c37e78170283431333e54b736a4390853f100d69cab7da178b21a9788585ba`.

The user approved the audition's sound. Full-take verification uses machine transcription, decoding and level checks; no assistant subjective listening signoff is claimed. Listen to the complete final movie before publishing if you want to approve its overall delivery.

## Files and reproducibility

[Submission folder](../../Submission%20Video/README.md) lists the MP4, standalone female narration MP3, SRT captions, edit timeline and verification JSON. Raw recordings, original unprocessed narration, timestamp response, generation hashes and contact sheet remain under ignored `build/official-demo/`. The original 167-second silent workprint is preserved with its original SHA256.

Production helpers: `scripts/Generate-OpenRouterDemoVoice.py`, `scripts/Align-OpenRouterDemoVoice.py`, `scripts/Assemble-OfficialDemo.py`, and `scripts/Verify-OfficialDemo.py`. Generation preserves the existing take instead of spending again. The older direct Voice Design helper is retained as an earlier proposed workflow; it is not the route used for this final export.

The [official rules](https://amazonappdev2026.devpost.com/rules), rechecked 22 October, request a video under three minutes and a publicly visible YouTube/Vimeo URL. This local export completes video production; hosting and entering its URL are still external delivery steps. Nothing was uploaded or submitted.
