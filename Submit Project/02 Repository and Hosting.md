# Repository and hosting decision

Recorded 22 October 2026.

**Selected source repository:** https://github.com/PetersonnOne/TonightTogetherFireTV-V1

The user explicitly chose **Skip Vercel**. No website deployment is required for the selected installable Fire TV submission. The complete connected demonstration runs locally with the Android TV Emulator, Node room service and controlled original-media service. The browser preview is a development/evaluation path, not a public hosted connected service.

The [official rules](https://amazonappdev2026.devpost.com/rules), checked again on 22 October, require accessible source, setup instructions and a publicly visible YouTube/Vimeo demo. The [FAQ](https://amazonappdev2026.devpost.com/details/faqs) accepts Android TV Emulator without physical Fire TV hardware. Reviewer access must remain available through judging. A source repository is distinct from a deployed website or a hosted demo video.

## Submission fields

- Source code: the initial push to `main` succeeded and the remote commit was verified.
- Live website: not deployed; use “not applicable — installable TV application; local emulator setup documented” if the form asks for an optional live-app field.
- Public demo video URL: still to be recorded after owner upload. The completed MP4 is in [Submission Video](../Submission%20Video/README.md); putting an MP4 in GitHub does not replace the specified YouTube/Vimeo link.
- Reviewer setup: [Milestone 2 runbook](../docs/MILESTONE_2_RUNBOOK.md).

Private credentials, signing keys, generated build output, auditions, Retrospective Catalog and the reusable media-production archive remain excluded from source publication. The final demo, diagrams, promotional artwork, original test-media clip and source documentation are included as project assets.

## Publication result

Initial source publication succeeded on 22 October 2026. GitHub main matched local commit `b79d0662769738ecd963914d949c915706220479`. The local milestone-2 branch tracks origin/main; explicit future push command is `git push origin HEAD:main`.

Anonymous requests to both the GitHub repository page and API returned HTTP404 after the push. The repository is not anonymously accessible; its visibility was not changed. If kept private, grant access to the official Amazon/Devpost reviewers listed in the event FAQ before the deadline. Source publication alone does not establish judge access.

No Vercel project or website was deployed. The user explicitly selected Skip Vercel. No demo-video host URL or final Devpost submission confirmation has been recorded yet.
