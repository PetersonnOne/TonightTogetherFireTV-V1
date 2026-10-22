# Local dependency and media notices

## QR code generator

web/vendor/qrcode.js is the ES-module distribution of qrcode-generator 2.0.4 by Kazuhiko Arase, obtained from the npm package. Its original copyright/MIT header is retained. The full MIT notice is beside it in web/vendor/LICENSE.qrcode-generator.txt. No runtime npm download or remote QR service is used. Package source: https://github.com/kazuhikoarase/qrcode-generator .

## Controlled streaming clip

provider/media/test-clip.mp4 is an original eight-second motion illustration, A Little Common Ground, derived from the project's own shared-evening.svg and its 1280×720 raster export shared-evening.png. It uses a slow camera move over an original evening landscape, encoded H264 at640×360,24fps,yuv420p, without audio. It is not the selected illustrative programme, a commercial provider asset or a licensed soundtrack. The provider explicitly labels it as controlled test media. Re-encode with:

```powershell
./scripts/Build-ProviderMedia.ps1
```

FFmpeg is a development tool, not bundled into either APK. Existing catalogue metadata notices remain in CATALOGUE_SOURCES.md. No commercial streaming integration or media right is implied.

## Programme names, artwork and identity

The24 sample programme names in src/sample-titles.js are fictional display labels, each suffixed (Illustrative). They do not establish real programmes, title exclusivity or commercial availability. Internal IDs and scoring metadata remain stable. Old saved generic names are projected for display without rewriting snapshots. Real sourced catalogue names/provenance are preserved.

Genre illustrations and viewer identity components in web/presentation.js are original project-authored SVG/CSS artwork, not official film posters, actor likenesses or Amazon logos. Illustrations convey genres rather than verified programme scenes. The shared-light brand motif is Tonight Together's own identity. No external image generator, stock media, celebrity voice or commercial footage was used in this final-polish pass.
