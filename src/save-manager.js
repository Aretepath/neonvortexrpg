"use strict";

export function createSaveManager({ key, version, state, scenes, announce, rebuildAlignmentFromHistory }) {
  const SAVE_KEY = key;
  const SAVE_VERSION = version;

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      announce("Progress could not be saved in this browser.");
      return false;
    }
  }

  function loadSave(serializedSave) {
    let previousState;
    try {
      previousState = JSON.parse(JSON.stringify(state));
      const saveText = typeof serializedSave === "string" ? serializedSave : localStorage.getItem(SAVE_KEY);
      const saved = JSON.parse(saveText);
      if (saved === null) return false;
      if (!saved || typeof saved !== "object" || Array.isArray(saved)
        || !Number.isInteger(saved.scene) || saved.scene < 0) {
        announce("Saved progress is invalid. A new story is ready.");
        return false;
      }
      const saveVersion = Number.isInteger(saved.storyVersion) ? saved.storyVersion : 1;
      if (saveVersion < 2) {
        if (saved.scene >= 9) saved.scene += 1;
        if (saved.dialogues && typeof saved.dialogues === "object") {
          const migratedDialogues = {};
          Object.entries(saved.dialogues).forEach(([key, outcome]) => {
            const match = key.match(/^(\d+):(.*)$/);
            const index = match ? Number(match[1]) : -1;
            migratedDialogues[match && index >= 9 ? `${index + 1}:${match[2]}` : key] = outcome;
          });
          saved.dialogues = migratedDialogues;
        }
      }
      if (saved.scene >= scenes.length || saveVersion > SAVE_VERSION) {
        announce("Saved progress is invalid. A new story is ready.");
        return false;
      }
      const hasSavedAlignment = saved.alignment && typeof saved.alignment === "object"
        && Object.values(saved.alignment).some((value) => Number.isFinite(value));
      const hasSavedPuzzles = saved.puzzles && typeof saved.puzzles === "object" && !Array.isArray(saved.puzzles);
      saved.storyVersion = SAVE_VERSION;
      Object.assign(state, saved);
      state.visited = state.visited && typeof state.visited === "object" ? state.visited : {};
      state.choices = state.choices && typeof state.choices === "object" ? state.choices : {};
      state.dialogues = state.dialogues && typeof state.dialogues === "object" ? state.dialogues : {};
      state.storyFlags = state.storyFlags && typeof state.storyFlags === "object" ? state.storyFlags : {};
      const savedPuzzles = state.puzzles && typeof state.puzzles === "object" ? state.puzzles : {};
      state.puzzles = {};
      if (hasSavedPuzzles) {
        scenes.forEach((scene) => {
          if (scene.puzzle && savedPuzzles[scene.puzzle.id] === true) state.puzzles[scene.puzzle.id] = true;
        });
      }
      if (!hasSavedPuzzles) {
        scenes.forEach((scene) => {
          if (scene.puzzle && scene.choice && scene.choice.options.some((option) => state.choices[option.flag])) {
            state.puzzles[scene.puzzle.id] = true;
          }
        });
      }
      const savedAlignment = state.alignment && typeof state.alignment === "object" ? state.alignment : {};
      state.alignment = { hero: 0, antihero: 0, villain: 0 };
      Object.keys(state.alignment).forEach((path) => {
        if (Number.isFinite(savedAlignment[path])) state.alignment[path] = savedAlignment[path];
      });
      if (!hasSavedAlignment) rebuildAlignmentFromHistory();
      const savedRelationships = state.relationships && typeof state.relationships === "object" ? state.relationships : {};
      state.relationships = { mia: 0, ryder: 0, echo: 0, patch: 0, arivon: 0 };
      Object.keys(state.relationships).forEach((character) => {
        if (Number.isFinite(savedRelationships[character])) state.relationships[character] = savedRelationships[character];
      });
      state.inventory = Array.isArray(state.inventory) ? state.inventory : [];
      state.started = typeof state.started === "boolean" ? state.started : false;
      state.musicOn = typeof state.musicOn === "boolean" ? state.musicOn : true;
      state.musicVolume = Number.isFinite(state.musicVolume)
        ? Math.max(0, Math.min(30, Math.round(state.musicVolume / 5) * 5))
        : 10;
      state.musicOn = state.musicOn && state.musicVolume > 0;
      state.readingSize = ["small", "standard", "large"].includes(state.readingSize) ? state.readingSize : "standard";
      state.storyVersion = SAVE_VERSION;
      return true;
    } catch (error) {
      if (previousState) {
        Object.keys(state).forEach((key) => delete state[key]);
        Object.assign(state, previousState);
      }
      announce("Saved progress could not be read. A new story is ready.");
      return false;
    }
  }

  return { save, loadSave };
}
