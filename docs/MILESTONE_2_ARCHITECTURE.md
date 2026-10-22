# Milestone 2 architecture decisions

Recorded 21 October 2026. This applies only to the independent richer checkout.

## Isolation

Android host package com.tonighttogether.milestone2; provider com.tonighttogether.testprovider; browser key tonight-together-m2-v1; preview/room/provider ports 4181/4182/4183. Original package, app-private records, preview 4173 and primary PRD are untouched. There is no automatic import from the fallback.

## Connected room transport

Use bounded HTTP polling at two-second intervals, not a required realtime framework or a deployed AWS service. This avoids a new heavy toolchain while keeping a versioned protocol that can later use another transport. A material revision changes participants/preferences/requirements/candidate and clears votes. A separate monotonic change counter advances for vote/join changes; clients cannot replace a newer command result with an older poll result.

Rooms, secrets and provider signing keys live only in service memory. Restart explicitly expires active rooms/tickets; durable household choices remain in the TV file. Joining needs a random code and host approval, then a separate unguessable participant capability. Host capability is never included in participant payloads. Participants receive their own preference/score details, shared titles/group facts and response totals, not other participants' raw preference components or votes. Host/session service processes the inputs; this is not cryptographically confidential voting.

Invitation lifetime is five minutes; room lifetime two hours. Expired/revoked capabilities cannot mutate a room. Commands carry a request ID and revision; save is idempotent. Ending a reachable room deletes its in-memory state. If closure cannot reach the service, logical expiry still applies; local data deletion must not falsely claim immediate remote erasure.

## Feedback adaptation 1.0

Use only explicit ratings on watched records after the viewer's reset timestamp, from the ten most recent such records. For each genre with at least two ratings:

`genre adjustment = clamp(1.5 × mean(rating − 3), −3, +3)`

For a title, average its supported genre adjustments; average those title adjustments across current viewers. Add this bounded result to ranking total. With insufficient evidence or learning disabled, the adjustment is zero. This never changes hard eligibility. Base individual/group preference-fit scores and the existing fairness adjustment remain separate and visible; neither is claimed to predict satisfaction. Deletion/reset removes the contributing evidence. The synthetic lab is ephemeral and writes no household records.

## Controlled provider

An explicit Android component handoff carries only a signed, short-lived provider ticket containing a test title ID, situation and expiry. No household aliases, votes, notes or profiles are sent. Provider HTTP service validates HMAC/expiry, serves actual local MP4 bytes with range support and injects labelled entitlement/region/outage states. Demo access performs no real sign-in or purchase. Provider playback does not mark a saved programme watched.

The separate provider WebView accepts only loopback port 4183. The host serves bundled assets and allows only the two optional loopback service ports; file/content access remains off. Internet permission is now required for optional connected services. HTTP cleartext is allowed only for loopback in the test configuration, with ADB reverse mapping to this laptop. This is local network streaming, not a verified commercial provider or public Internet deployment.

## Physical phones and future cloud

Default participant URLs work in local browser tabs. LAN mode binds the room service to the local network and advertises a computer address; verify that address and connectivity before using actual phones. Use a trusted test network; public hosting requires HTTPS/WSS-equivalent secure transport and a deliberate deployment review. AWS access, credit coverage, Bedrock, public hosting and commercial catalogue/streaming adapters are not implemented merely because the account exists.

## Evaluation boundaries

Browser protocol tests and emulator handoff/playback have separate evidence. Inherited Milestone 1 reports are historical. Neither controlled provider tests nor emulator acceptance guarantee playback in Netflix/Prime Video or every physical Fire TV. Test media and vendor source notices are in THIRD_PARTY_NOTICES.md.
