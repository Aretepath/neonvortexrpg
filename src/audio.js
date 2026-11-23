"use strict";

export function createAudioController({ state, musicThemes, announce }) {
  const Tone = window.Tone;
  let musicMaster;
  let padSynth;
  let bassSynth;
  let leadSynth;
  let musicParts = [];

  async function startMusic() {
    if (!state.musicOn) return;
    try {
      if (!window.Tone) throw new Error("Tone.js did not load");
      await Tone.start();
      if (!musicMaster) {
        musicMaster = new Tone.Gain(state.musicVolume / 100).toDestination();
        padSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "sine" },
          envelope: { attack: 1.4, decay: 0.2, sustain: 0.65, release: 2.8 }
        }).connect(musicMaster);
        bassSynth = new Tone.Synth({
          oscillator: { type: "triangle" },
          envelope: { attack: 0.08, decay: 0.4, sustain: 0.3, release: 0.7 }
        }).connect(musicMaster);
        leadSynth = new Tone.Synth({
          oscillator: { type: "sine" },
          envelope: { attack: 0.18, decay: 0.3, sustain: 0.2, release: 0.8 }
        }).connect(musicMaster);
      } else {
        musicMaster.gain.rampTo(state.musicVolume / 100, 0.08);
      }
      setSceneMusic(state.scene);
    } catch (error) {
      console.error("Background music could not start:", error);
      announce("Music could not start. Check your connection or browser audio settings.");
    }
  }

  function setSceneMusic(sceneIndex) {
    if (!state.musicOn || !musicMaster || !window.Tone) return;
    try {
      musicParts.forEach((part) => {
        part.stop();
        part.dispose();
      });
      musicParts = [];
      Tone.Transport.stop();
      Tone.Transport.cancel(0);

      const theme = musicThemes[sceneIndex];
      Tone.Transport.bpm.value = theme.bpm;
      musicParts.push(
        new Tone.Sequence((time, chord) => {
          if (chord) padSynth.triggerAttackRelease(chord, "1m", time, 0.24);
        }, theme.chords, "1m").start(0),
        new Tone.Sequence((time, note) => {
          if (note) bassSynth.triggerAttackRelease(note, "2n", time, 0.42);
        }, theme.bass, "2n").start(0),
        new Tone.Sequence((time, note) => {
          if (note) leadSynth.triggerAttackRelease(note, "8n", time, 0.3);
        }, theme.lead, "8n").start(0)
      );
      Tone.Transport.start();
    } catch (error) {
      console.error("Scene music could not be played:", error);
      announce("Scene music could not be played. Try toggling music off and on.");
    }
  }

  function stopMusic() {
    if (!musicMaster || !window.Tone) return;
    Tone.Transport.stop();
  }

  function hasInstance() {
    return Boolean(musicMaster);
  }

  function setVolume(volume) {
    if (!musicMaster) return false;
    musicMaster.gain.rampTo(volume / 100, 0.08);
    return true;
  }

  function pause() {
    if (musicMaster && Tone) Tone.Transport.pause();
  }

  function resume() {
    if (musicMaster && Tone) Tone.Transport.start();
  }

  return { startMusic, setSceneMusic, stopMusic, hasInstance, setVolume, pause, resume };
}
