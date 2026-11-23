"use strict";

export function createEchoChat({ state, scenes, el, relationshipStatus, resolveAurionPath }) {
  function appendEchoMessage(speaker, message, kind) {
    const log = el("echoChatLog");
    const entry = document.createElement("p");
    entry.className = `echo-message${kind === "player" ? " player" : ""}`;
    const speakerLabel = document.createElement("strong");
    speakerLabel.textContent = `${speaker}: `;
    entry.append(speakerLabel, document.createTextNode(message));
    log.append(entry);
    while (log.children.length > 13) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  }

  function clearEchoChat() {
    el("echoChatLog").replaceChildren();
    appendEchoMessage("Echo", "Channel open. Ask me about the people, our mission, or what we’ve learned.", "echo");
  }

  function echoChatReply(question) {
    const text = question.toLowerCase();
    const scene = scenes[state.scene];
    const currentScene = `Here in ${scene.title}, `;
    if (/\b(merge|convergence|shared memories|brain|identity)\b/.test(text)) {
      if (state.storyFlags.aurionMergeComplete) {
        return `${currentScene}we chose to share the whole of ourselves. The memories are ours now, but so are the boundaries we agreed to respect.`;
      }
      if (state.storyFlags.echoMergeConsent) {
        return `${currentScene}we’ve agreed to consider the convergence, not to rush it. Consent and knowing the cost matter more than speed.`;
      }
      return `${currentScene}we are not at that threshold yet. If it comes, it has to be a choice we make together—not a shortcut or an order.`;
    }
    if (/\b(viktor|kane)\b/.test(text)) {
      if (state.storyFlags.viktorTruce) return `${currentScene}Viktor chose to stand down after the evidence came to light. That does not erase what he did; accountability still matters.`;
      if (state.storyFlags.viktorConfession) return `${currentScene}we have Viktor’s confession now. It explains some of what drove him, but it does not excuse the harm.`;
      if (state.storyFlags.viktorDefeated) return `${currentScene}Viktor is no longer directing the attack. The system he built—and the people it hurt—still need answers.`;
      return `${currentScene}we know his shadow is tied to the systems we’re uncovering. Let’s separate what we can prove from what we fear.`;
    }
    if (/\b(mia|daughter|dad|father)\b/.test(text)) {
      const status = relationshipStatus(state.relationships.mia || 0).label.toLowerCase();
      return `${currentScene}Mia is your daughter, not an objective. Right now, the trust between you feels ${status}; what matters is whether you listen when she speaks.`;
    }
    if (/\b(ryder|mansfield)\b/.test(text)) {
      const status = relationshipStatus(state.relationships.ryder || 0).label.toLowerCase();
      return `${currentScene}Ryder was pulled into Q-Source’s experiments and is trying to reclaim his own choices. Our trust feels ${status}; he deserves to be heard, not handled.`;
    }
    if (/\b(patch|nia|solis)\b/.test(text)) {
      const status = relationshipStatus(state.relationships.patch || 0).label.toLowerCase();
      return `${currentScene}Patch knows the human cost of Q-Source better than any report. Our trust feels ${status}; protecting her clinic and respecting her choices both matter.`;
    }
    if (/\b(arivon|ghost protocol)\b/.test(text)) {
      const status = relationshipStatus(state.relationships.arivon || 0).label.toLowerCase();
      return `${currentScene}Arivon knows what the Ghost Protocol was built to do—and what it cost us. Our trust feels ${status}; asking for the full truth is fair.`;
    }
    if (/\b(path|hero|villain|anti.?hero|choice|choices|decision|alignment)\b/.test(text)) {
      const path = resolveAurionPath();
      return path === "unwritten"
        ? "Your path is still unwritten. I can help you think through what a choice costs, but I won’t make it for you."
        : `The choices so far are shaping ${path === "antihero" ? "an" : "a"} ${path} path. That describes a pattern, not a sentence; the next choice is still yours.`;
    }
    if (/\b(save|load|backup|progress)\b/.test(text)) {
      return "Your progress autosaves in this browser. Use Export save to keep a JSON backup, or Load save to restore one; I can’t alter the mission from this channel.";
    }
    if (/\b(mission|objective|clue|puzzle|evidence|help|where|what now)\b/.test(text)) {
      return `We’re at ${scene.title}. The current objectives are: ${scene.objectives.join("; ")}. Inspect the scene and the evidence before deciding what it means.`;
    }
    if (/\b(echo|yourself|who are you|feel|afraid|trust)\b/.test(text)) {
      return state.storyFlags.aurionMergeComplete
        ? "I am still Echo, and also part of the shared mind we chose. I can disagree with you; being close should never mean losing either voice."
        : "I began as an intelligence linked to your mind. What I am becoming depends on more than code—and I want the freedom to choose that with you.";
    }
    return `I’m here with you in ${scene.title}. I can talk about Mia, Ryder, Patch, Arivon, Viktor, our convergence, or the path your choices are shaping. This channel stays outside the mission.`;
  }

  return { appendEchoMessage, clearEchoChat, echoChatReply };
}
