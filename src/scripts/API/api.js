import gsap, { SplitText } from "/scripts/greensock/esm/all.js";
import Introduction from "../Introduction.js";
import CONSTANTS from "../constants/constants.js";
import { error } from "../lib/lib.js";

const API = {
  async introduceMe(token, actor) {
    return await new Introduction().introduceMe(token, actor ?? token.actor);
  },

  async introduceDialog(token) {
    await new Introduction().introduceMeDialog(token);
  },

  // =====================================
  // SOCKET UTILITY
  // =====================================

  async toggleAudio(node, sound, audio) {
    const audioButton = $(node).find(".audio-button > i");
    audioButton.removeClass();
    if (sound.pausedTime) {
      const baseVolume = game.settings.get("core", "globalPlaylistVolume");
      const { volume } = audio.sounds[0].options;
      await sound.load();
      sound.play({
        volume: baseVolume * volume,
        offset: sound.pausedTime,
        fade: audio.sounds[0].fadeIn,
      });

      audioButton.addClass("fas fa-pause");
    } else {
      sound.pause();
      audioButton.addClass("fas fa-play");
    }
  },

  manualClose(node, sound) {
    gsap.to(node, { opacity: 0, duration: 0.5 });
    sound?.fade(0, { duration: 2000 });
    setTimeout(() => {
      sound?.stop();
      $(node).remove();
    }, 2000);
  },

  /**
   * @param {Object[]} inAttributes - An object configuration object for the hook
   * @param {('introduce'|'close'|'toggleAudio')} inAttributes.type
   * @param {Object} inAttributes.data
   * @param {string} inAttributes.data.uuid
   * @returns {Promise<void>} Promise object
   */
  async introduceMeArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error("introduceMeArr | inAttributes must be of type array");
    }
    const [request, node, sound, audio] = inAttributes;
    // if (typeof inAttributes !== "object") {
    //   throw error("introduceMeArr | inAttributes must be of type object");
    // }
    // const request = inAttributes;

    switch (request.type) {
      case CONSTANTS.API.REQUEST_TYPE.introduce: {
        const entity = await fromUuid(request.data.uuid);
        const token = entity.documentName === "Actor" ? entity.prototypeToken : entity;
        const actor = entity.documentName === "Actor" ? entity : entity.actor;
        await new Introduction().introductionDisplay(token, actor);
        break;
      }
      case CONSTANTS.API.REQUEST_TYPE.close: {
        this.manualClose(node, sound);
        break;
      }
      case CONSTANTS.API.REQUEST_TYPE.toggleAudio: {
        await this.toggleAudio(node, sound, audio);
        break;
      }
    }
  },
};

export default API;
