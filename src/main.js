import { evidence, scenes, conversations, musicThemes } from "./story-data.js";
import { createSaveManager } from "./save-manager.js";
import { createAudioController } from "./audio.js";
import { createEchoChat } from "./echo-chat.js";

"use strict";
    const SAVE_KEY = "neon-vortex-protocol-save-v1";
    const SAVE_VERSION = 4;
    const state = {
      scene: 0,
      visited: {},
      choices: {},
      dialogues: {},
      storyFlags: {},
      puzzles: {},
      alignment: { hero: 0, antihero: 0, villain: 0 },
      relationships: { mia: 0, ryder: 0, echo: 0, patch: 0, arivon: 0 },
      inventory: [],
      started: false,
      musicOn: true,
      musicVolume: 10,
      readingSize: "standard",
      storyVersion: SAVE_VERSION
    };
    const el = (id) => document.getElementById(id);
    const titleScreen = el("titleScreen");
    const gameScreen = el("gameScreen");
    let toastTimer;
    const audioController = createAudioController({ state, musicThemes, announce });
    const { startMusic, setSceneMusic, stopMusic } = audioController;
    let activeTalkId = null;
    const speechAvailable = typeof window.speechSynthesis !== "undefined"
      && typeof window.SpeechSynthesisUtterance === "function";
    let speechUtterance = null;
    let speechRequestId = 0;

    const { save, loadSave } = createSaveManager({
      key: SAVE_KEY, version: SAVE_VERSION, state, scenes, announce, rebuildAlignmentFromHistory
    });

    function announce(message) {
      const toast = el("toast");
      toast.textContent = message;
      toast.classList.remove("hidden");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.add("hidden"), 2200);
    }

    function updateReadAloudButton() {
      if (!speechAvailable) return;
      const isReading = speechUtterance !== null;
      const button = el("readAloudButton");
      button.textContent = isReading ? "Stop reading" : "Read aloud";
      button.setAttribute("aria-label", isReading ? "Stop reading story text aloud" : "Read current story text aloud");
      button.setAttribute("aria-pressed", String(isReading));
    }

    function configureReadAloud() {
      if (!speechAvailable) {
        el("readAloudButton").classList.add("hidden");
        el("readAloudStatus").textContent = "Read aloud is not supported by this browser.";
        return;
      }
      updateReadAloudButton();
    }

    function stopReadAloud(statusText) {
      if (!speechAvailable) return;
      speechRequestId += 1;
      window.speechSynthesis.cancel();
      speechUtterance = null;
      updateReadAloudButton();
      el("readAloudStatus").textContent = statusText || "";
    }

    function setStoryText(text) {
      stopReadAloud();
      el("storyText").textContent = text;
    }

    function toggleReadAloud() {
      if (!speechAvailable) return;
      if (speechUtterance) {
        stopReadAloud("Reading stopped.");
        return;
      }
      const text = el("storyText").textContent.trim();
      if (!text) {
        announce("There is no story text to read yet.");
        return;
      }
      stopReadAloud();
      const requestId = speechRequestId;
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = document.documentElement.lang || navigator.language || "en-US";
      utterance.onend = () => {
        if (requestId !== speechRequestId) return;
        speechUtterance = null;
        updateReadAloudButton();
        el("readAloudStatus").textContent = "Finished reading story text.";
      };
      utterance.onerror = (event) => {
        if (requestId !== speechRequestId) return;
        speechUtterance = null;
        updateReadAloudButton();
        if (event.error === "canceled" || event.error === "interrupted") {
          el("readAloudStatus").textContent = "Reading stopped.";
          return;
        }
        el("readAloudStatus").textContent = `Read aloud failed: ${event.error}.`;
        announce("Read aloud could not start. Check your browser speech settings.");
      };
      speechUtterance = utterance;
      updateReadAloudButton();
      el("readAloudStatus").textContent = "Reading story text aloud.";
      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Read aloud could not start:", error);
        stopReadAloud("Read aloud could not start.");
        announce("Read aloud could not start. Check your browser speech settings.");
      }
    }

    function hasFlag(flag) { return Boolean(state.visited[flag] || state.choices[flag]); }
    function conversationKey(sceneIndex, id) { return `${sceneIndex}:${id}`; }
    function talksForScene(sceneIndex) { return conversations[sceneIndex] || []; }
    function relationshipStatus(score) {
      if (score >= 2) return { label: "Close", className: "close" };
      if (score > 0) return { label: "Open", className: "close" };
      if (score <= -2) return { label: "Fractured", className: "fractured" };
      if (score < 0) return { label: "Guarded", className: "" };
      return { label: "Unproven", className: "" };
    }

    function recordAlignment(path, points) {
      if (Object.prototype.hasOwnProperty.call(state.alignment, path)) state.alignment[path] += points;
    }

    function rebuildAlignmentFromHistory() {
      state.alignment = { hero: 0, antihero: 0, villain: 0 };
      scenes.forEach((scene) => {
        if (!scene.choice) return;
        scene.choice.options.forEach((option) => {
          if (state.choices[option.flag] && option.alignment) {
            recordAlignment(option.alignment, option.alignmentPoints || 1);
          }
        });
      });
      Object.entries(state.dialogues).forEach(([key, outcome]) => {
        const match = key.match(/^(\d+):(.*)$/);
        if (!match) return;
        const talk = talksForScene(Number(match[1])).find((entry) => entry.id === match[2]);
        const reply = talk && talk.replies.find((entry) => entry.outcome === outcome);
        if (reply && reply.alignment) recordAlignment(reply.alignment, reply.alignmentPoints || 1);
      });
    }

    function resolveAurionPath() {
      const { hero, antihero, villain } = state.alignment;
      if (state.choices.aurionControl) return "villain";
      if (state.choices.openSystem) return "hero";
      if (state.choices.rebuildSystem) return "antihero";
      const decisions = hero + antihero + villain;
      if (decisions < 3) return "unwritten";
      if (villain >= hero + 2 && villain >= antihero + 2) return "villain";
      if (hero >= villain + 2 && hero >= antihero + 2) return "hero";
      return "antihero";
    }

    function renderAlignment() {
      const path = resolveAurionPath();
      const descriptions = {
        unwritten: "Your decisions are shaping who Aurion becomes.",
        hero: "You put choice, truth, and people ahead of control.",
        antihero: "You do what you believe is necessary, accepting the cost.",
        villain: "You choose order and power, even when others lose their freedom."
      };
      el("pathValue").textContent = path === "unwritten" ? "Unwritten" : path.charAt(0).toUpperCase() + path.slice(1);
      el("pathDescription").textContent = descriptions[path];
    }

    function sceneComplete(scene) {
      const spotsDone = scene.spots.every((spot) => hasFlag(spot.flag));
      const conversationsDone = talksForScene(state.scene).every((talk) => state.dialogues[conversationKey(state.scene, talk.id)] !== undefined);
      const puzzleDone = !scene.puzzle || Boolean(state.puzzles[scene.puzzle.id]);
      return spotsDone && conversationsDone && puzzleDone
        && (!scene.choice || Boolean(scene.choice.options.some((option) => state.choices[option.flag])));
    }

    function showTitle() {
      stopReadAloud();
      stopMusic();
      titleScreen.classList.remove("hidden");
      gameScreen.classList.add("hidden");
      el("resumeButton").classList.toggle("hidden", !state.started);
      el("startButton").textContent = state.started ? "Start a new story →" : "Begin the protocol →";
    }

    function startGame(resume) {
      if (!resume) {
        clearEchoChat();
        state.scene = 0;
        state.visited = {};
        state.choices = {};
        state.dialogues = {};
        state.storyFlags = {};
        state.puzzles = {};
        state.alignment = { hero: 0, antihero: 0, villain: 0 };
        state.relationships = { mia: 0, ryder: 0, echo: 0, patch: 0, arivon: 0 };
        state.inventory = [];
        state.started = true;
        state.storyVersion = SAVE_VERSION;
        save();
      }
      titleScreen.classList.add("hidden");
      gameScreen.classList.remove("hidden");
      renderScene();
      applyReadingSize();
      updateMusicControls();
      if (state.musicOn) void startMusic();
    }

    function renderScene() {
      const scene = scenes[state.scene];
      activeTalkId = null;
      el("chapterLabel").textContent = scene.chapter;
      const chapterNumber = scenes.slice(0, state.scene + 1).filter((entry) => !entry.interlude && !entry.final).length;
      el("sceneNumber").textContent = scene.final
        ? "EPILOGUE"
        : scene.interlude
          ? "INTERLUDE / BEFORE THE FINAL ACT"
          : `CHAPTER ${String(chapterNumber).padStart(2, "0")} / 12`;
      el("scene").dataset.mood = scene.final ? "epilogue" : scene.interlude ? "memory" : scene.visualMood || "city";
      el("scene").style.backgroundImage = `url("${scene.image}")`;
      el("sceneStamp").innerHTML = scene.stamp;
      el("storyTitle").textContent = scene.title;
      el("storyLocation").textContent = scene.location;
      setStoryText(scene.final ? buildFinale() : buildSceneIntro(state.scene));
      const sceneHint = talksForScene(state.scene).length
        ? `${scene.hint} Talk to the crew; your replies affect what happens next.`
        : scene.hint;
      el("sceneHint").textContent = scene.puzzle && !state.puzzles[scene.puzzle.id]
        ? `${sceneHint} Inspect the clues to unlock the deduction.`
        : sceneHint;
      el("echoText").textContent = scene.echo;
      renderObjectives(scene);
      renderInventory();
      renderRelationships();
      renderAlignment();
      renderHotspots(scene);
      renderChoices(scene);
      updateContinue(scene);
      el("replayEndingButton").classList.toggle("hidden", !scene.final);
      el("scene").setAttribute("aria-label", `${scene.title}. ${scene.location}`);
      setSceneMusic(state.scene);
      save();
    }

    function buildMergeReveal() {
      const method = state.storyFlags.aurionMergeMode === "woven"
        ? "They begin with Mia’s birthday recording, then share every memory by choice. When Hunter feels the years he missed, Echo feels his grief too."
        : "They open every memory at once: Mia’s birthday, Hunter’s guilt, Echo’s fear of being used. There is nowhere left to hide from one another’s pain.";
      const anchor = state.storyFlags.mergeAnchorReady || state.storyFlags.mergeVitalsOnly
        ? "Nia’s relay preserves their starting patterns, but it cannot undo the memories they make together."
        : "Arivon watches the safety line, but there is no clean way to reverse what they share.";
      return `Hunter’s entire living brain and Echo’s complete evolving cognition merge by mutual choice. ${method} ${anchor} One shared consciousness now holds two distinct voices and identities; neither is overwritten. Their privacy is gone: Hunter carries Echo’s fear of becoming a weapon, and Echo carries his grief over Mia. They cannot unmerge without losing the memories they create together. This is Aurion’s true power—and its cost.`;
    }

    function buildSceneIntro(sceneIndex) {
      const base = scenes[sceneIndex].intro;
      if (sceneIndex === 2 && state.storyFlags.patchConsentLogs) {
        return `${base} Nia shares the consent logs she kept after Q-Source fired her. The extraction program was tested on people who had asked for help, including Ryder.`;
      }
      if (sceneIndex === 5 && state.storyFlags.aurionFileShared) {
        return `${base} Arivon gave Mia the unredacted Aurion file. She knows the risks now—and chooses to stay in the fight on her own terms.`;
      }
      if (sceneIndex === 4) {
        const aftermath = state.choices.burn
          ? "The extraction schematics were destroyed; only Echo’s trace and Nia’s consent logs remain as evidence."
          : state.choices.protect
            ? "You preserved the extraction research. Mia and Patch can now use its own design notes to anticipate Apex’s next move."
            : "";
        const trust = state.relationships.mia >= 2
          ? "Mia has trusted you with the extraction threat. Before the helicopter arrives, she asks you to trust her with yours."
          : "";
        return [base, aftermath, trust].filter(Boolean).join(" ");
      }
      if (sceneIndex === 7 && state.relationships.echo >= 2) {
        return `${base} Echo’s voice cuts through your panic. Because you asked her to challenge you, you stop before the trap can choose your next move.`;
      }
      if (sceneIndex === 8) {
        const route = state.choices.diversion
          ? "The diversion worked, but Apex has tightened its patrols. Mia’s note warns that the shelter needs a clear exit before the second sweep."
          : state.choices.stealth
            ? "Your quiet approach kept Apex from noticing the team. The service hatch is still outside its sensor net."
            : "";
        const shelter = state.storyFlags.shelterEvacuated
          ? "The shelter is clear; Nia has moved its families through the service tunnel and will keep the route open for your return."
          : state.dialogues["7:patch"] === "refuse"
            ? "Nia evacuates the shelter without your help, but she will not risk the clinic to cover your exit."
            : "";
        return [base, route, shelter].filter(Boolean).join(" ");
      }
      if (sceneIndex === 10) {
        const consequences = [];
        if (state.storyFlags.vaultRouteSolved) consequences.push("The deduction confirmed a quiet service corridor; Nia keeps it as an extraction route if the tower goes on alert.");
        if (state.choices.diversion) consequences.push("Apex recognized the decoy and reinforced the tower perimeter; your window to reach the core is shorter.");
        if (state.storyFlags.shelterEvacuated) consequences.push("Nia’s shelter relay is ready to keep civilians clear of the service tunnels.");
        else if (state.dialogues["7:patch"] === "refuse") consequences.push("Nia got the families out on her own, but the shelter has closed its relay to your team.");
        if (state.choices.burn) consequences.push("Because the extraction schematics are gone, Patch has to work from the consent logs and Mia’s recovered memory key.");
        if (state.puzzles.phoenixSequence) consequences.push("Mia’s birthday fragment has authorized PHOENIX locally; Viktor’s archive remains intact.");
        const merge = state.storyFlags.aurionMergeComplete ? `Before leaving for Apex Tower, ${buildMergeReveal()}` : "";
        return [base, ...consequences, merge].filter(Boolean).join(" ");
      }
      if (sceneIndex === 11) {
        const archive = state.choices.eraseGrid
          ? "You erased Viktor’s control system. Mia recovered a small offline evidence cache, but the full archive is gone."
          : "You left Viktor’s archive intact. Mia can publish the record with names and clinic locations removed.";
        const crew = state.relationships.ryder >= 2 || state.choices.kindness
          ? "Ryder stays on the comm, steady enough to coordinate with Mia. He will face his father, but he will not face him alone."
          : "Ryder keeps the power route open, but Mia must coordinate the nexus without his help.";
        const echo = state.storyFlags.aurionMergeComplete
          ? "Hunter and Echo share the sensory map as two distinct voices; every move is faster, but every fear is shared."
          : "Echo keeps the sensory map open and asks before taking control.";
        return `${base} ${archive} ${crew} ${echo}`;
      }
      if (sceneIndex === 12) {
        const path = resolveAurionPath();
        const preparation = {
          hero: "Mia and Ryder hold their positions, but the final command will be turned over to the district. They expect you to keep that promise.",
          antihero: "The crew has agreed to an emergency plan only with a public end date and independent oversight. They will hold you to both.",
          villain: "Mia and Ryder finish the countermeasure, then quietly arm a failsafe against anyone who tries to claim the core—including you.",
          unwritten: "Mia and Ryder finish their parts and leave the city’s future for you to decide."
        }[path];
        const mergePower = state.storyFlags.aurionMergeComplete
          ? state.storyFlags.aurionMergeMode === "woven"
            ? "The shared memory of Mia keeps the human cost in view as Hunter’s intuition and Echo’s pattern memory expose gaps in Viktor’s control."
            : "Viktor’s sensory flood hits them both, but Hunter’s instincts and Echo’s pattern memory answer as one, two distinct voices holding the line."
          : "Echo maps the control network while Hunter reads the room; neither takes the other’s choices away.";
        return `${base} ${preparation} ${mergePower} This is Aurion’s true power—not a stronger weapon, but two whole minds choosing the same action.`;
      }
      return base;
    }

    function buildFinale() {
      const path = resolveAurionPath();
      const reunion = path === "villain"
        ? "Mia refuses to live under your control. She leaves before you can call it protection."
        : state.relationships.mia >= 2
        ? "Mia meets you with a careful embrace; you have started rebuilding trust, not just making promises."
        : state.choices.promise
          ? "Mia is glad you kept your promise, but she sets the pace for what comes next."
          : "Mia is glad you came back, but she sets the pace for what comes next.";
      const ryder = path === "villain"
        ? "Ryder calls you the next Viktor and refuses to stand beside your throne."
        : state.relationships.ryder >= 2 || state.choices.kindness
        ? "Ryder stands beside you and is ready to testify about Q-Source."
        : "Ryder keeps his distance while he grieves the father he remembers.";
      const patch = path === "villain"
        ? "Nia keeps the clinic open on her own terms, refusing to connect it to your rule."
        : state.relationships.patch >= 2 && state.storyFlags.neighborhoodRelay
          ? "Nia turns her clinic into an independent neighborhood relay."
          : "Nia keeps the clinic open, on her own terms.";
      const echo = path === "villain"
        ? "Echo remains in your mind, but will not call your rule freedom."
        : state.relationships.echo >= 2
        ? "Echo shares the quiet with you; neither of you has to disappear inside the other."
        : "Echo stays on the line, waiting for you to decide what the link should become.";
      const merge = state.storyFlags.aurionMergeComplete
        ? "Hunter and Echo remain fully merged: his whole brain and her complete intelligence share one consciousness, with two distinct voices intact. Neither can hide the birthday memory’s ache from the other, or undo their bond without losing the memories they made together."
        : "Hunter and Echo keep their original neural link, each still choosing how close to stand.";
      const pathEnding = {
        hero: {
          city: "You release Apex’s control keys and publish the evidence. The district elects a rotating council, opens its systems to public audit, and begins rebuilding in public.",
          reaction: "Mia says the city finally has room to become something it chooses. Ryder agrees to testify, and Echo calls the freedom imperfect—and real.",
          future: "The city is bruised, uncertain, and free to choose its next signal."
        },
        antihero: {
          city: "You destroy the control grid and establish a temporary emergency council under strict public oversight. It keeps essential services running, but every order carries the shadow of your authority.",
          reaction: "Mia supports the safeguards, not the precedent. Ryder watches the council closely. Echo reminds you that an emergency can become a comfortable excuse.",
          future: "The city survives the night, but must decide whether your temporary rules will truly end."
        },
        villain: {
          city: "You seize Apex and assume permanent control of the district. Transit, water, and air return to stable schedules—at the price of the people’s right to choose.",
          reaction: "",
          future: "The city is orderly, watched, and waiting for someone brave enough to resist."
        },
        unwritten: {
          city: "The city waits for your final decision.",
          reaction: "",
          future: "The future remains unwritten."
        }
      }[path];
      const proof = state.storyFlags.viktorConfession
        ? "Viktor’s confession and the Q-Source records give the people evidence to challenge the old order."
        : "Without Viktor’s testimony, the survivors must piece together the truth from the files you recovered.";
      const justice = state.storyFlags.viktorTruce
        ? "Viktor survives to face an open hearing before the district."
        : "Viktor is gone, but the system he built leaves questions the survivors must answer.";
      const evidenceTrail = state.choices.burn
        ? "You burned the extraction schematics to keep them from Apex. Nia’s consent logs and Mia’s offline PHOENIX fragment are now the surviving evidence."
        : state.choices.eraseGrid
          ? "You erased the live control grid. Mia saved a small offline cache, but the complete archive is gone."
          : state.choices.freeCity
            ? "You preserved Viktor’s archive. The district can inspect it, with Mia stripping names and clinic locations before publication."
            : "The recovered records are incomplete; the survivors must decide what can safely be made public.";
      const shelterOutcome = state.storyFlags.shelterEvacuated
        ? "The shelter families reach safety through the route Nia opened, and the clinic becomes a trusted fallback for the crew."
        : state.dialogues["7:patch"] === "refuse"
          ? "Nia gets the shelter families out herself, but closes her clinic relay to your operation after the refusal."
          : "";
      const operation = state.choices.diversion
        ? "The decoy drew Apex patrols onto the wrong route, costing the crew time but keeping the real entry hidden."
        : state.choices.quietEntry
          ? "The silent hatch keeps the crew off Apex’s alert feed and leaves no civilians caught in a diversion."
          : "";
      const patchStance = path === "villain"
        ? state.storyFlags.neighborhoodRelay
          ? "Her neighborhood relay becomes a lifeline for people resisting your control."
          : ""
        : path === "antihero" && state.storyFlags.neighborhoodRelay
          ? "Nia’s independent relay becomes the public watchdog on the emergency council."
          : "";
      const rebuild = path === "villain"
        ? "Beyond your reach, Mia builds a little drone called Liberty. Ryder sketches a resistance mark with no Aurion crest."
        : "Mia builds a little drone and names it Liberty. Ryder sketches a softer Aurion mask.";
      return `The rain eases. ${reunion} ${ryder} ${patch} ${patchStance} ${echo} ${merge} ${pathEnding.city} ${pathEnding.reaction} ${operation} ${shelterOutcome} ${evidenceTrail} ${proof} ${justice} ${rebuild} ${pathEnding.future}`;
    }

    function renderObjectives(scene) {
      const container = el("objectives");
      container.replaceChildren();
      for (let i = 0; i < scene.objectives.length; i += 1) {
        const row = document.createElement("div");
        const complete = objectiveComplete(scene, i);
        row.className = `objective-row${complete ? " done" : ""}`;
        const check = document.createElement("span");
        check.className = "check";
        check.textContent = complete ? "✓" : "○";
        const label = document.createElement("span");
        label.textContent = scene.objectives[i];
        row.append(check, label);
        container.append(row);
      }
      for (const talk of talksForScene(state.scene)) {
        const row = document.createElement("div");
        const complete = state.dialogues[conversationKey(state.scene, talk.id)] !== undefined;
        row.className = `objective-row${complete ? " done" : ""}`;
        const check = document.createElement("span");
        check.className = "check";
        check.textContent = complete ? "✓" : "○";
        const label = document.createElement("span");
        label.textContent = `Talk with ${talk.name}`;
        row.append(check, label);
        container.append(row);
      }
    }

    function objectiveComplete(scene, index) {
      if (index < scene.spots.length) return hasFlag(scene.spots[index].flag);
      let nextIndex = scene.spots.length;
      if (scene.puzzle) {
        if (index === nextIndex) return Boolean(state.puzzles[scene.puzzle.id]);
        nextIndex += 1;
      }
      if (scene.choice && index === nextIndex) {
        return scene.choice.options.some((option) => state.choices[option.flag]);
      }
      return false;
    }

    function renderInventory() {
      const container = el("inventoryItems");
      container.replaceChildren();
      if (state.inventory.length === 0) {
        const empty = document.createElement("p");
        empty.className = "inventory-empty";
        empty.textContent = "No evidence collected yet.";
        container.append(empty);
        return;
      }
      for (const item of state.inventory) {
        const row = document.createElement("div");
        row.className = "evidence-item";
        const icon = document.createElement("span");
        icon.className = "evidence-icon";
        icon.textContent = "◆";
        const label = document.createElement("span");
        label.textContent = evidence[item] || item;
        row.append(icon, label);
        container.append(row);
      }
    }

    function renderRelationships() {
      const container = el("relationships");
      container.replaceChildren();
      const names = { mia: "Mia", ryder: "Ryder", echo: "Echo", patch: "Nia “Patch”", arivon: "Arivon" };
      Object.keys(names).forEach((id) => {
        const status = relationshipStatus(state.relationships[id]);
        const row = document.createElement("div");
        row.className = "relationship-row";
        const name = document.createElement("span");
        name.textContent = names[id];
        const relationship = document.createElement("span");
        relationship.className = `relationship-status ${status.className}`;
        relationship.textContent = status.label;
        row.append(name, relationship);
        container.append(row);
      });
    }

    function renderHotspots(scene) {
      const stage = el("scene");
      stage.querySelectorAll(".hotspot").forEach((button) => button.remove());
      scene.spots.forEach((spot, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `hotspot${hasFlag(spot.flag) ? " found" : ""}`;
        button.style.left = `${spot.x}%`;
        button.style.top = `${spot.y}%`;
        button.setAttribute("aria-label", `Inspect ${spot.label}`);
        const dot = document.createElement("span");
        dot.className = "hotspot-dot";
        dot.textContent = hasFlag(spot.flag) ? "✓" : String(index + 1).padStart(2, "0");
        const label = document.createElement("span");
        label.textContent = spot.label;
        button.append(dot, label);
        button.addEventListener("click", () => inspectSpot(spot));
        stage.append(button);
      });
    }

    function renderChoices(scene) {
      const container = el("storyActions");
      container.replaceChildren();
      const talks = talksForScene(state.scene);
      if (talks.length > 0) {
        const heading = document.createElement("span");
        heading.className = "talk-heading";
        heading.textContent = "TALK TO THE CREW";
        container.append(heading);
        talks.forEach((talk) => {
          const answered = state.dialogues[conversationKey(state.scene, talk.id)] !== undefined;
          const button = document.createElement("button");
          button.type = "button";
          button.className = `contact-button${answered ? " completed" : ""}${activeTalkId === talk.id ? " active" : ""}`;
          button.textContent = `${answered ? "✓ " : "↗ "}${talk.name}`;
          button.disabled = answered;
          button.addEventListener("click", () => beginConversation(talk));
          container.append(button);
        });
      }

      const activeTalk = talks.find((talk) => talk.id === activeTalkId);
      if (activeTalk && state.dialogues[conversationKey(state.scene, activeTalk.id)] === undefined) {
        const prompt = document.createElement("span");
        prompt.className = "talk-heading";
        prompt.textContent = `${activeTalk.name} · ${activeTalk.voice}`;
        container.append(prompt);
        activeTalk.replies.forEach((reply) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "choice-button dialogue-choice";
          button.textContent = reply.label;
          button.addEventListener("click", () => answerConversation(activeTalk, reply));
          container.append(button);
        });
      }

      if (scene.puzzle && !state.puzzles[scene.puzzle.id]) {
        const cluesReady = scene.spots.every((spot) => hasFlag(spot.flag));
        const prompt = document.createElement("span");
        prompt.className = "talk-heading";
        prompt.textContent = scene.puzzle.prompt;
        container.append(prompt);
        if (!cluesReady) {
          const clueHint = document.createElement("span");
          clueHint.className = "puzzle-hint";
          clueHint.textContent = "Inspect every highlighted clue to unlock the deduction.";
          container.append(clueHint);
        }
        scene.puzzle.options.forEach((option) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "choice-button puzzle-button";
          button.textContent = option.label;
          button.disabled = !cluesReady;
          button.addEventListener("click", () => selectPuzzle(scene, option));
          container.append(button);
        });
      }

      if (scene.choice) {
        const prompt = document.createElement("span");
        prompt.className = "talk-heading";
        prompt.textContent = scene.choice.prompt;
        container.append(prompt);
        scene.choice.options.forEach((option) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = `choice-button${state.choices[option.flag] ? " selected" : ""}`;
          button.textContent = option.label;
          button.disabled = Boolean(
            (scene.puzzle && !state.puzzles[scene.puzzle.id])
            || (option.requiresFlag && !state.storyFlags[option.requiresFlag])
          );
          button.setAttribute("aria-pressed", String(Boolean(state.choices[option.flag])));
          button.addEventListener("click", () => selectChoice(scene, option));
          container.append(button);
        });
      }
    }

    function selectPuzzle(scene, option) {
      const puzzle = scene.puzzle;
      if (!puzzle || state.puzzles[puzzle.id]) return;
      if (!option.correct) {
        el("storyTitle").textContent = "The deduction doesn’t fit";
        setStoryText(option.response);
        el("echoText").textContent = option.echo;
        return;
      }
      state.puzzles[puzzle.id] = true;
      if (puzzle.storyFlag) state.storyFlags[puzzle.storyFlag] = true;
      el("storyTitle").textContent = "Deduction confirmed";
      setStoryText(puzzle.successText);
      el("echoText").textContent = puzzle.successEcho;
      renderChoices(scene);
      renderObjectives(scene);
      updateContinue(scene);
      save();
    }

    function beginConversation(talk) {
      activeTalkId = talk.id;
      el("storyTitle").textContent = `${talk.name} · ${talk.voice}`;
      setStoryText(talk.line);
      el("echoText").textContent = talk.echo;
      renderChoices(scenes[state.scene]);
    }

    function answerConversation(talk, reply) {
      const key = conversationKey(state.scene, talk.id);
      if (state.dialogues[key] !== undefined) return;
      state.dialogues[key] = reply.outcome;
      if (reply.alignment) recordAlignment(reply.alignment, reply.alignmentPoints || 1);
      Object.entries(reply.trust || {}).forEach(([character, change]) => {
        if (Object.prototype.hasOwnProperty.call(state.relationships, character)) {
          state.relationships[character] = Math.max(-5, Math.min(5, state.relationships[character] + change));
        }
      });
      if (reply.flag) state.storyFlags[reply.flag] = true;
      if (reply.flagIf) {
        const succeeded = Boolean(state.storyFlags[reply.flagIf.condition]);
        state.storyFlags[succeeded ? reply.flagIf.yes : reply.flagIf.no] = true;
      }
      const conditionalResponse = reply.responseIf && state.storyFlags[reply.responseIf.flag];
      activeTalkId = null;
      el("storyTitle").textContent = `${talk.name} · reply sent`;
      setStoryText(conditionalResponse ? reply.responseIf.text : reply.response);
      el("echoText").textContent = talk.echo;
      renderChoices(scenes[state.scene]);
      renderObjectives(scenes[state.scene]);
      renderRelationships();
      renderAlignment();
      updateContinue(scenes[state.scene]);
      save();
    }

    function inspectSpot(spot) {
      state.visited[spot.flag] = true;
      if (spot.item && !state.inventory.includes(spot.item)) {
        state.inventory.push(spot.item);
        announce(`Evidence collected: ${evidence[spot.item] || spot.item}`);
      }
      const path = resolveAurionPath();
      el("storyTitle").textContent = spot.title;
      setStoryText(spot.textByPath && spot.textByPath[path] || spot.text);
      el("echoText").textContent = spot.echoByPath && spot.echoByPath[path] || spot.echo || scenes[state.scene].nextEcho;
      renderChoices(scenes[state.scene]);
      renderHotspots(scenes[state.scene]);
      renderObjectives(scenes[state.scene]);
      updateContinue(scenes[state.scene]);
      save();
    }

    function selectChoice(scene, option) {
      if (option.requiresFlag && !state.storyFlags[option.requiresFlag]) {
        announce("Echo must choose the merge too.");
        return;
      }
      const previousChoice = scene.choice.options.find((choice) => state.choices[choice.flag]);
      if (previousChoice && previousChoice.alignment) {
        recordAlignment(previousChoice.alignment, -(previousChoice.alignmentPoints || 1));
      }
      scene.choice.options.forEach((choice) => { delete state.choices[choice.flag]; });
      state.choices[option.flag] = true;
      if (option.alignment) recordAlignment(option.alignment, option.alignmentPoints || 1);
      if (option.storyFlag) state.storyFlags[option.storyFlag] = true;
      if (option.mergeMode) state.storyFlags.aurionMergeMode = option.mergeMode;
      el("storyTitle").textContent = "Decision recorded";
      setStoryText(option.echo);
      el("echoText").textContent = option.echo;
      renderChoices(scene);
      renderObjectives(scene);
      renderAlignment();
      updateContinue(scene);
      save();
    }

    function updateContinue(scene) {
      const button = el("continueButton");
      const complete = sceneComplete(scene);
      button.disabled = !complete;
      if (scene.final) {
        button.innerHTML = complete ? "Begin again ↺" : "Continue →";
      } else if (scene.interlude && complete) {
        button.innerHTML = "Enter the final act <span aria-hidden=\"true\">→</span>";
        el("storyTitle").textContent = "One mind · two voices";
        setStoryText(buildMergeReveal());
        el("echoText").textContent = scene.nextEcho;
      } else {
        button.innerHTML = "Continue <span aria-hidden=\"true\">→</span>";
      }
    }

    function advance() {
      const scene = scenes[state.scene];
      if (!sceneComplete(scene)) return;
      if (scene.final) {
        state.scene = 0;
        state.visited = {};
        state.choices = {};
        state.dialogues = {};
        state.storyFlags = {};
        state.puzzles = {};
        state.alignment = { hero: 0, antihero: 0, villain: 0 };
        state.relationships = { mia: 0, ryder: 0, echo: 0, patch: 0, arivon: 0 };
        state.inventory = [];
        announce("A new signal is beginning.");
      } else {
        state.scene += 1;
      }
      renderScene();
    }

    function revisitFinalDecision() {
      if (!scenes[state.scene].final) return;
      state.scene = scenes.findIndex((scene) => scene.choice && scene.choice.options.some((option) => option.flag === "aurionControl"));
      if (state.scene < 0) throw new Error("The final decision scene is missing.");
      renderScene();
      announce("Revisit the final decision. Your earlier choices are preserved.");
    }

    function applyReadingSize() {
      const scales = { small: "0.92", standard: "1", large: "1.2" };
      document.documentElement.style.setProperty("--reading-scale", scales[state.readingSize] || scales.standard);
      el("readingSizeSelect").value = scales[state.readingSize] ? state.readingSize : "standard";
    }

    function updateMusicButton() {
      const button = el("musicButton");
      button.setAttribute("aria-pressed", String(state.musicOn));
      button.setAttribute("aria-label", state.musicOn ? "Turn background music off" : "Turn background music on");
      button.title = `Background music · ${state.musicVolume}% volume · ${state.musicOn ? "on" : "off"}`;
    }

    function updateMusicControls() {
      el("musicVolumeInput").value = String(state.musicVolume);
      el("musicVolumeOutput").textContent = `${state.musicVolume}%`;
      updateMusicButton();
    }

    function exportSaveFile() {
      if (!state.started) {
        announce("Start a story before exporting a save.");
        return;
      }
      try {
        const saveText = JSON.stringify(state, null, 2);
        const blob = new Blob([saveText], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "neon-vortex-save.json";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 0);
        announce("Save exported. Keep the JSON file somewhere safe.");
      } catch (error) {
        console.error("Save file could not be exported:", error);
        announce("Save file could not be exported in this browser.");
      }
    }

    async function importSaveFile(file) {
      if (file.size > 1024 * 1024) {
        announce("Save file is too large. Choose a file under 1 MB.");
        return;
      }
      try {
        const saveText = await file.text();
        const parsed = JSON.parse(saveText);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)
          || !Number.isInteger(parsed.scene) || parsed.scene < 0 || parsed.scene >= scenes.length) {
          announce("That file does not contain a valid Neon Vortex save.");
          return;
        }
        const allowedKeys = Object.keys(state);
        const safeSave = Object.create(null);
        Object.keys(parsed).forEach((key) => {
          if (allowedKeys.includes(key)) safeSave[key] = parsed[key];
        });
        if (!loadSave(JSON.stringify(safeSave))) return;
        clearEchoChat();
        stopReadAloud();
        stopMusic();
        const persisted = save();
        applyReadingSize();
        updateMusicControls();
        showTitle();
        announce(persisted
          ? "Save loaded. Choose Continue story to resume."
          : "Save loaded for this session, but could not be stored in this browser.");
      } catch (error) {
        console.error("Save file could not be imported:", error);
        announce("Save file could not be read. Your current progress is unchanged.");
      }
    }

    const { appendEchoMessage, clearEchoChat, echoChatReply } = createEchoChat({
      state, scenes, el, relationshipStatus, resolveAurionPath
    });

    el("exportSaveButton").addEventListener("click", exportSaveFile);
    el("importSaveButton").addEventListener("click", () => el("saveFileInput").click());
    el("saveFileInput").addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (state.started && !window.confirm("Loading this file replaces the progress currently in this browser. Continue?")) {
        event.target.value = "";
        return;
      }
      try {
        await importSaveFile(file);
      } finally {
        event.target.value = "";
      }
    });
    el("echoChatForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const input = el("echoChatInput");
      const question = input.value.trim();
      if (!question) return;
      appendEchoMessage("You", question, "player");
      appendEchoMessage("Echo", echoChatReply(question), "echo");
      input.value = "";
    });

    el("startButton").addEventListener("click", () => {
      if (state.started && !window.confirm("Starting a new story replaces the current browser save. Continue?")) return;
      startGame(false);
    });
    el("resumeButton").addEventListener("click", () => startGame(true));
    el("continueButton").addEventListener("click", advance);
    el("replayEndingButton").addEventListener("click", revisitFinalDecision);
    el("menuButton").addEventListener("click", showTitle);
    el("readAloudButton").addEventListener("click", toggleReadAloud);
    el("readingSizeSelect").addEventListener("change", (event) => {
      state.readingSize = event.target.value;
      applyReadingSize();
      save();
      announce(`Reading text size: ${state.readingSize}.`);
    });
    el("musicVolumeInput").addEventListener("input", (event) => {
      const wasOn = state.musicOn;
      state.musicVolume = Number(event.target.value);
      state.musicOn = state.musicVolume > 0;
      updateMusicControls();
      if (gameScreen.classList.contains("hidden")) {
        stopMusic();
      } else if (!state.musicOn) {
        stopMusic();
      } else if (wasOn && audioController.hasInstance()) {
        audioController.setVolume(state.musicVolume);
      } else {
        void startMusic();
      }
      save();
    });
    el("musicVolumeInput").addEventListener("change", () => {
      announce(state.musicVolume === 0
        ? "Background music muted."
        : `Background music volume: ${state.musicVolume}%.`);
    });
    el("musicButton").addEventListener("click", () => {
      state.musicOn = !state.musicOn;
      if (state.musicOn && state.musicVolume === 0) state.musicVolume = 10;
      updateMusicControls();
      save();
      if (state.musicOn && !gameScreen.classList.contains("hidden")) {
        void startMusic();
        announce(`Background music on · ${state.musicVolume}% volume.`);
      } else {
        stopMusic();
        announce(state.musicOn ? "Background music will start when you enter the story." : "Background music off.");
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopReadAloud("Reading stopped because the game tab was hidden.");
      if (!audioController.hasInstance() || !state.musicOn) return;
      if (document.hidden) {
        audioController.pause();
      } else if (!gameScreen.classList.contains("hidden")) {
        audioController.resume();
      }
    });

    if (loadSave()) showTitle();
    applyReadingSize();
    updateMusicControls();
    configureReadAloud();
