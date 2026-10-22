# Tonight Together architecture visuals

Two complementary diagrams, created 22 October 2026 from the implemented connected edition. PNGs are 2560×1500 and ready for submission/gallery use. SVGs preserve editable vector shapes, arrows and text. Neither image contains judge tags, diagram numbers or a watermark.

- [Household decision flow — PNG](Tonight-Together-Household-Decision-Flow.png) · [editable SVG](Tonight-Together-Household-Decision-Flow.svg): the shared-viewing pain, independent contributions, visible tradeoffs, consent-based revision, unanimous agreement, controlled playback and feedback loop.
- [Technical architecture — PNG](Tonight-Together-Technical-Architecture.png) · [editable SVG](Tonight-Together-Technical-Architecture.svg): Android/WebView host, durable AtomicFile storage, browser participants, HTTP-polling room service, shared deterministic decision modules and separate ticketed media provider.

The diagrams describe the actual local implementation, not a proposed cloud architecture. They distinguish durable TV memory from temporary service state and controlled original-media playback from a commercial service. No AWS, remote LLM, Netflix/Prime Video integration or physical Fire TV certification is implied.

Source of truth: [connected architecture decisions](../docs/MILESTONE_2_ARCHITECTURE.md), `server/rooms.mjs`, `server/provider-server.mjs`, `src/core/adaptation.js`, `android/TonightActivity.java`, and `provider/ProviderActivity.java`. The same pure modules power local TV ranking and connected-room evaluation; the central placement explains the connected service's use, not an exclusive location for the engine.

Regenerate from the active project root with `python scripts/Build-ArchitectureDiagrams.py`. Requires Python, Pillow and the configured Windows Segoe UI fonts. The source is editable; no generation API or credentials are required. PNGs were visually reviewed; SVG XML and image dimensions were checked. Existing app/video and reusable production archive were not changed.
