# Sarah — approved narration voice

On 22 October 2026, the user listened to the Sarah audition, said “I love it,” selected it for Tonight Together's official demo, and requested a reusable record for other projects. This is a preferred voice to consider in future projects; it does not authorize unrelated paid generations automatically.

## Identity and tested sound

- Voice: **Sarah — Mature, Reassuring, Confident**, an ElevenLabs premade female voice; not a custom voice or clone.
- Direct ElevenLabs voice ID: **`EXAVITQu4vr4xnSDxMaL`**.
- Approved audition route: OpenRouter, model **`elevenlabs/eleven-v4`**, voice **`sarah`**.
- Direct equivalent model ID: **`eleven_v4`**. The authenticated direct voice and model catalogue were checked on 22 October 2026. Direct generation remains untested after the earlier account billing issue; account access must be checked before using that route.
- Approved audition: `Voice Auditions/ElevenLabs OpenRouter/01-sarah-eleven-v4-natural.mp3`, 17.84 seconds, SHA256 `7859adcf0f73d3bf631b9f64f0fb5afde3c1e5c2107130b1f7e94bf37f59bafc` (local, ignored).
- Settings: plain script, default model delivery, MP3 output. No speed override, time stretching, echo, reverb or other effects. Preserve natural timing. A future model/version or route can vary in delivery; this record identifies the approved combination, not a guarantee of identical output.

## OpenRouter recipe — generation verified

`POST https://openrouter.ai/api/v1/audio/speech`

Headers: `Authorization: Bearer <OPENROUTER_API_KEY>` and `Content-Type: application/json`.

```json
{
  "model": "elevenlabs/eleven-v4",
  "voice": "sarah",
  "input": "Your approved narration text.",
  "response_format": "mp3"
}
```

## Direct ElevenLabs recipe — identity/model verified, generation pending billing

`POST https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL?output_format=mp3_44100_128`

Headers: `xi-api-key: <ELEVENLABS_API_KEY>` and `Content-Type: application/json`.

```json
{
  "model_id": "eleven_v4",
  "text": "Your approved narration text."
}
```

The response is audio bytes; save them as MP3. Keep credentials in local environment variables or ignored `.env`, never in source, the app or a media export. Do not send OpenRouter model IDs to the direct endpoint. No OpenAI service is involved in either recipe.

## Sources and continuation

[OpenRouter's ElevenLabs speech guide](https://openrouter.ai/blog/announcements/elevenlabs-on-openrouter/) documents the speech endpoint, named voices and v4 parameters. [ElevenLabs' direct speech endpoint](https://elevenlabs.io/docs/api-reference/text-to-speech/convert) documents voice IDs, model selection and MP3 output. Do not pass non-default speed to v4. Recheck current account access, model availability and pricing before another project spends credits.

The approved production take uses this same OpenRouter model and Sarah voice, with the full existing 333-word script. Raw speech is retained unchanged; the video mix applies loudness normalization only.
