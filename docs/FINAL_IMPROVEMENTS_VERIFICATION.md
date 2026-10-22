> **22 October video update:** [Final Sarah-narrated walkthrough](../Submission%20Video/README.md) is now exported and checked. Earlier video-blocker observations below are historical.

# Final improvements verification — 21 October 2026

The active Milestone 2 source now includes original genre illustrations, distinct viewer identities, a shared-light visual motif, warmer accents, accurate acceptance/save states, reduced text density and 24 fabricated programme names carrying `(Illustrative)`. Existing IDs, ranking metadata and real sourced catalogue names are preserved. Old saved illustrative names are projected for display without rewriting stored snapshots.

## Current evidence

| Check | Result |
| --- | --- |
| Domain, storage and HTTP tests | 31 passed, including ranking invariance and nonmutating legacy-title display |
| Final browser regression | 17 behaviour groups passed; no script errors or unexpected external requests |
| Directional focus regression | 20 screen states passed |
| Presentation regression | Artwork, identities, truthful agreement states, legacy and new-name search, unchanged storage and narrow layout passed |
| Connected participant regression | Three independent phone-sized browser sessions; agreement revisions, rejection, reconnect, save and provider controls/failure cases passed |
| Native emulator | Updated debug app retained prior records; real D-pad acceptance; new selected evening saved; original clip played to 8/8 seconds, readyState 4, error null |
| Provider Back and persistence | Complete stored JSON unchanged after return; both older evening snapshots preserved; third evening remains selected |
| Submission gallery | Five separate 1280×720 native PNGs visually inspected; captions in the gallery README |

Raw local evidence is under ignored `build/qa/`, including `fi-tests.txt`, `fi-final-browser-regression.txt`, `fi-final-focus-regression.txt`, `fi-polish-regression.txt` and `fi-connected-regression.txt`. This is local Android TV Emulator evidence, not physical Fire TV or household field evaluation.

## Original controlled media

`provider/media/test-clip.mp4` is an original eight-second, silent H.264 motion illustration, 640×360, 88,975 bytes. It is separate from the selected illustrative programme. SHA256: `26DDD1F55DB137D79E33475731D17BD8AC9EDF21E90F38587652387688770A2D`.

An initial capture used an expired two-minute ticket and was excluded from the gallery. Fresh-ticket native playback then completed without media error. Ticket expiry was retained. Browser playback, pause and seek checks passed. A subsequent official-video recording also verified native pause at6.497seconds, seek to8seconds, real Back and unchanged full household JSON; raw evidence is in build/official-demo/provider-proof.json.

## Built artifacts and remaining work

Rebuilt evaluation host: 67,231 bytes, SHA256 `0CE4416D80848C3F35971C5F18EC5A21DC2121B6D2A4D40348CCC0DA102FA925`.

Rebuilt evaluation provider: 17,020 bytes, SHA256 `F2C721BFC53ED95856161E859F4849740E1D958FDFAF42BA0B27FEEC0E998148`.

These evaluation artifacts were built and signature checked. The new native runtime evidence above uses the updated debug build; post-polish evaluation-package installation smoke remains pending. Earlier verification/video files describe earlier captures and must not be represented as the final official walkthrough.

The official narrated video has not been generated. ElevenLabs authentication succeeded through a read-only check; the subsequent voice-design request was rejected with an account payment issue, so no narration was generated. AWS remains excluded. The preserved Milestone 1 fallback and main PRD were not modified.

See [the five upload assets and captions](../Submission%20Screenshots/README.md).
