## Inspiration

Everyone finally sits down. One person wants comedy, another wants adventure, someone has only an hour, and someone else has a firm “anything but that.” The family has made time together, but the evening starts disappearing into the choice.

That moment inspired Tonight Together. Amazon’s work on [conversational Fire TV discovery](https://www.amazon.science/latest-news/the-science-behind-the-new-alexa-what-should-i-watch-fire-tv-experience) and research into [group viewing patterns](https://www.microsoft.com/en-us/research/publication/large-scale-exploration-group-viewing-patterns/) helped us focus on a specific opportunity: helping the people sharing a screen reach a decision together.

Our guiding question became: **Can everyone feel represented in the choice, including the person who usually gives way?** Fire TV is a natural home for that experience because the shared screen is where the household gathers.

## What it does

Tonight Together turns “What should we watch?” into a shared yes.

Viewers set tonight’s time, mood, preferences and firm boundaries. They can contribute through the shared remote or join a host-approved session from individual browsers. Suggestions explain each viewer’s fit and the compromises behind the group result, making a weaker individual match visible.

Firm exclusions apply before ranking. A firm no removes that title from tonight’s choices. When the household gets stuck, the app can propose a focused adjustment to time or mood for people to confirm. Any material change clears earlier acceptances; **only fresh agreement from every selected viewer saves the current choice**.

Saved evenings remain local. Explicit watched feedback can influence future ranking within a small, inspectable bound, and people can disable or reset learning. Choosing, playing and marking watched remain separate actions.

The demonstration also follows a saved choice into a separate, clearly labelled test provider with actual original-media playback, pause, seek and return. It shows the full journey from disagreement to a preserved evening, using controlled test streaming.

## How we built it

We built a Java Android shell with a bundled HTML, CSS and JavaScript interface, designed around readable television layouts and D-pad navigation. Android AtomicFile stores household records privately and durably; the browser preview uses separate localStorage.

Pure JavaScript modules handle eligibility, individual fit, fairness, negotiation and bounded feedback adaptation. Explanations come from those same calculations. This makes decisions inspectable and the core experience usable without a remote language model.

Node.js services coordinate connected sessions and serve original test media. Temporary participant capabilities, host approval, revision checks and idempotent requests protect the agreement workflow. The separate provider validates short-lived signed tickets and supports HTTP media ranges. Household profiles, aliases, notes and votes are not sent to that provider.

We verified the native journey on Android TV Emulator and used independent browser sessions for connected participation. Playwright supported UI checks; Node’s test runner covered domain and HTTP behavior. FFmpeg assembled the demo, with ElevenLabs Sarah narration generated through OpenRouter. Those voice services are demo-production tools, separate from the app runtime.

## Challenges we ran into

The hardest challenge was making agreement remain meaningful as the situation changed. A vote for an earlier title cannot approve a new candidate. We designed revision-aware decisions so changed needs, participants or choices require fresh acceptance, and stale responses cannot overwrite newer state.

We also had to preserve clear boundaries between a preference, a firm exclusion and missing metadata. A high group score must never silently override someone’s hard requirement.

TV interaction introduced its own challenges: predictable remote focus, older WebView compatibility, emulator readiness and dependable return from a separate provider. We tested failures and recovery alongside the happy path, including lost connections, unavailable playback and saved-state continuity.

## Accomplishments that we’re proud of

We completed a connected journey that gives every viewer a voice: independent participation, explained compromise, firm rejection, deliberate revision, fresh unanimous agreement, saved memory and controlled playback.

Our current suite passes **31 automated tests**. Browser regression covers **17 scenario groups**, directional checks cover **20 screens and states**, and three independent participant browser sessions exercise the connected flow. Native emulator checks verify actual playback, pause, seek, Back return and persistence.

We are also proud of keeping the demonstration honest: fabricated programme names carry “(Illustrative),” synthetic learning is labelled, and the controlled provider is clearly identified. The finished narrated walkthrough runs **2 minutes 29.6 seconds**.

## What we learned

A recommendation becomes more useful when people understand its tradeoffs and retain control over the decision. Showing the weakest individual fit can reveal a compromise that an attractive average would hide.

We learned that explainability, explicit consent and recovery belong in the architecture from the beginning. Transparent rules and careful state management can create an intelligent experience while keeping the household’s choices understandable.

Building for Fire TV also reinforced the value of a shared screen: readable choices, visible focus and participation across screens can support the conversation happening in the room.

## What’s next for Tonight Together (Family App)

Our next steps are real-household evaluation, broader physical Fire TV coverage and accessibility testing. We want to measure whether people feel represented, understand the compromise and want to use the experience again.

We also plan to explore permissioned catalogue and provider integrations, broader content coverage and a secure hosted session service for easier participation across devices. These are future enhancements; the current submission demonstrates the local/emulator implementation and controlled original-media streaming.

**One screen. Different tastes. A night worth sharing.**
