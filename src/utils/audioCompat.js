/**
 * audioCompat — expo-av shaped façade over expo-audio.
 *
 * expo-av was removed after SDK 53. Its native library (libexpo-av.so) is built
 * against an older JSI ABI and RN 0.86 no longer exports the symbols it needs,
 * so the module crashes the process during TurboModule registration — before
 * any JavaScript runs, which is why the try/catch around require('expo-av')
 * could not prevent it:
 *
 *   UnsatisfiedLinkError: cannot locate symbol
 *   "facebook::jsi::Value::asObject(jsi::Runtime&)" referenced by libexpo-av.so
 *
 * expo-audio (already used for recording) provides the same capabilities under
 * a different API. This module keeps the old call shape so the playback logic
 * in the screens stays as it was.
 *
 * Unit note: expo-av reported milliseconds, expo-audio reports seconds. The
 * conversion happens here so callers keep working in milliseconds.
 */
import { createAudioPlayer, setAudioModeAsync as setNativeAudioMode } from 'expo-audio';

const toMillis = (seconds) => Math.max(0, Math.round((seconds || 0) * 1000));

function wrapPlayer(player, onPlaybackStatusUpdate) {
  let subscription = null;

  if (typeof onPlaybackStatusUpdate === 'function') {
    subscription = player.addListener('playbackStatusUpdate', (s) => {
      onPlaybackStatusUpdate({
        isLoaded: true,
        isPlaying: !!s.playing,
        positionMillis: toMillis(s.currentTime),
        durationMillis: toMillis(s.duration),
        didJustFinish: !!s.didJustFinish,
      });
    });
  }

  return {
    async playAsync() { player.play(); },
    async pauseAsync() { player.pause(); },
    async stopAsync() {
      try { player.pause(); } catch {}
      try { player.seekTo(0); } catch {}
    },
    async setPositionAsync(millis) { player.seekTo((millis || 0) / 1000); },
    async unloadAsync() {
      try { subscription?.remove(); } catch {}
      subscription = null;
      try { player.remove(); } catch {}
    },
    async getStatusAsync() {
      return {
        isLoaded: !!player.isLoaded,
        isPlaying: !!player.playing,
        positionMillis: toMillis(player.currentTime),
        durationMillis: toMillis(player.duration),
      };
    },
  };
}

export const Audio = {
  Sound: {
    /** Mirrors expo-av's Audio.Sound.createAsync(source, options, onStatus). */
    async createAsync(source, options = {}, onPlaybackStatusUpdate) {
      const player = createAudioPlayer(source);
      const sound = wrapPlayer(player, onPlaybackStatusUpdate);
      if (options.shouldPlay) player.play();
      return { sound, status: { isLoaded: true, isPlaying: !!options.shouldPlay } };
    },
  },

  /** Translates expo-av's audio-mode keys onto expo-audio's. */
  async setAudioModeAsync(mode = {}) {
    await setNativeAudioMode({
      playsInSilentMode: mode.playsInSilentModeIOS ?? true,
      allowsRecording: mode.allowsRecordingIOS ?? false,
      shouldPlayInBackground: mode.staysActiveInBackground ?? false,
      interruptionMode: mode.shouldDuckAndroid ? 'duckOthers' : 'mixWithOthers',
    });
  },
};

export default Audio;
