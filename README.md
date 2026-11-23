# Neon Vortex Protocol

A browser-based point-and-click cyberpunk adventure inspired by the public **Neon Vortex Protocol** lore.

## Play

## Run locally

The game uses native JavaScript modules, so serve the project over HTTP rather than opening `index.html` directly. With Python 3 installed, run this from the project folder:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000>. Stop the server with `Ctrl+C`. No package install or build step is required.

Explore a scene by clicking its marked points, collect evidence, make a choice, and use **Continue** when the current objectives are complete. Progress autosaves in the browser's local storage. Use **Export save** to download a portable JSON backup or **Load save** to restore one; loading a save replaces the current browser progress after confirmation.

Browser saves are scoped to the address you use. When moving between a local server and a hosted copy, export a save first and load it at the new address.

The game follows Hunter/Aurion, Echo, Mia, Ryder, Viktor, and new character Nia “Patch” Solis through 12 story chapters, a pre-finale convergence interlude, and an epilogue set in Seattle in 2076. In the interlude, Hunter’s whole brain and Echo’s complete intelligence merge by mutual choice into one shared consciousness, while both retain distinct voices and identities. The cost is permanent intimacy: Hunter’s grief over Mia and Echo’s fear of being used become shared memories they cannot simply take back.

Choices and conversations shape Aurion’s displayed path: **Hero**, **Antihero**, or **Villain**. Earlier decisions change later mission briefings, crew support, evidence, and the final act. The final decision determines the city’s future: release power to the district, destroy the grid under temporary emergency oversight, or seize permanent control. The ending changes the city’s governance and how Mia, Ryder, and Echo respond; each path also has distinct epilogue interactions. You can revisit the final decision from the epilogue without replaying the entire story.

Two clue-based deductions—the SkyCom entry route and the PHOENIX activation sequence—must be solved before their decisions unlock. Wrong answers give a hint and can be retried. Progress, puzzle solutions, and preferences are saved locally; older saves are migrated when loaded. Use the text-size selector for small, standard, or large reading text. The **Read aloud** control uses built-in browser speech synthesis for the current story passage; it can be stopped at any time and cancels when the passage changes or the game tab is hidden. Available voices depend on the browser and device, and written text always remains available. The **Open a private channel with Echo** panel provides optional, locally authored, story-aware replies; it does not use a network service or change game progress. The synth volume slider ranges from mute to 30%, with 10% as the default; the music button toggles playback. The game also respects the system's reduced-motion preference.

## Lore and artwork

The story and existing scene artwork are adapted from the public source provided for this project: <https://aretepath.github.io/neonvortextprotocol/>. The ACT 10 Apex Core background is original artwork created for this game. A shared cinematic grade and subtle HUD framing unify the scenes, with distinct color accents for memory, Apex, and epilogue moments. The original source repository is <https://github.com/Aretepath/neonvortextprotocol>.

## Project structure

- `index.html` contains the accessible game interface.
- `styles.css` contains layout and visual styling.
- `src/main.js` coordinates game state, rendering, choices, and controls.
- `src/story-data.js` contains scenes, dialogue, evidence, and music themes.
- `src/save-manager.js`, `src/audio.js`, and `src/echo-chat.js` isolate persistence, music, and the optional Echo side channel.

## Music library

Music is generated in the browser with [Tone.js](https://tonejs.github.io/), an open-source music synthesis library under the MIT license. The pinned library build is loaded from jsDelivr; an internet connection is needed to load it.
