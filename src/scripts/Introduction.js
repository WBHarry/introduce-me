// import gsap, { SplitText } from "/scripts/greensock/esm/all.js";
import IntroduceDialog from "./IntroduceDialog.js";
import { getActorIntroductionColors } from "./ColorSettings.js";
import { playIntroductionAudio } from "./AudioSettings.js";
import CONSTANTS from "./constants/constants.js";
import { introduceMeSocket } from "./socket.js";
import API from "./API/api.js";
import { i18n } from "./lib/lib.js";
// import { RequestType } from "./SocketHandler.js";

export default class Introduction {
  constructor() {
    if (!Introduction._instance) {
      Introduction._instance = this;
    }

    return Introduction._instance;
  }

  introduceMe = async (token, actor) => {
    if (game.user.isGM && token) {
      // await game.socket.emit(`module.${CONSTANTS.MODULE_ID}`, {
      //   type: CONSTANTS.API.REQUEST_TYPE.introduce,
      //   data: { uuid: token.document?.uuid ?? token.uuid ?? actor.uuid },
      // });
      const args = [
        {
          type: CONSTANTS.API.REQUEST_TYPE.introduce,
          data: { uuid: token.document?.uuid ?? token.uuid ?? actor.uuid },
        },
        null,
        null,
        null,
      ];
      await introduceMeSocket.executeForOthers("introduceMe", ...args);

      await this.introductionDisplay(token, actor);
    }
  };

  introductionDisplay = async (syntheticToken, syntheticActor, preview, overrideFlavor, overrideDuration) => {
    const token = syntheticToken.document ?? syntheticToken;
    if (token) {
      const actor = game.actors.get(syntheticActor.id);
      // Store the already presented people for portrait-box
      actor.setFlag(CONSTANTS.MODULE_ID, "introduced", true);
      if (!preview && game.user.isGM) {
        const usePermission = await game.settings.get(CONSTANTS.MODULE_ID, "use-introduce-permission");
        const permissionUpdate = usePermission
          ? {
              permission: {
                ...actor.permission,
                default: actor.permission.default > 1 ? actor.permission.default : 1,
              },
            }
          : {};

        const setDisplayName = await game.settings.get(CONSTANTS.MODULE_ID, "set-display-name");
        if (setDisplayName) {
          await actor.update({ "token.displayName": 30, ...permissionUpdate });
          const scenes = Array.from(game.scenes);
          for (let i = 0; i < scenes.length; i++) {
            const tokens = Array.from(scenes[i].tokens);
            for (let j = 0; j < tokens.length; j++) {
              const token = tokens[j];
              if (token.actorId ?? token.actorId === actor.id) {
                await token.update({ displayName: 30 });
              }
            }
          }
        }
      }

      // game.socket.on(`module.${CONSTANTS.MODULE_ID}`, async (request) => {
      //   switch (request.type) {
      //     case CONSTANTS.API.REQUEST_TYPE.close:
      //       this.manualClose(node, sound);
      //       break;
      //     case CONSTANTS.API.REQUEST_TYPE.toggleAudio:
      //       await this.toggleAudio(node, sound, colors.audio);
      //       break;
      //   }
      // });

      const defaultIntroductionDuration = game.settings.get(CONSTANTS.MODULE_ID, "introduction-duration");
      const actorIntroductionDuration = actor.getFlag(CONSTANTS.MODULE_ID, "introduction-duration");
      const introductionDuration = overrideDuration
        ? overrideDuration
        : actorIntroductionDuration !== undefined
        ? actorIntroductionDuration
        : defaultIntroductionDuration;

      cleanupDOM();
      const useActorName = game.settings.get(CONSTANTS.MODULE_ID, "use-actor-name");
      const flavor = this.flavorParse(
        overrideFlavor ??
          (await actor.getFlag(CONSTANTS.MODULE_ID, "flavor")) ??
          String.fromCharCode(parseInt("00A0", 16)),
        actor
      );
      const colors = getActorIntroductionColors(token, actor);

      const sound = await playIntroductionAudio(colors.audio);

      Hooks.on("globalPlaylistVolumeChanged", async (volume) => {
        await sound.fade(volume * colors.audio.sounds[0].options.volume);
      });

      $(document.body).append(
        $(
          await renderTemplate(`modules/${CONSTANTS.MODULE_ID}/templates/introduction.hbs`, {
            name: useActorName ? actor.name : token.name,
            img: this.getIntroductionImage(token, actor),
            flavor: flavor,
            colors: colors,
            showSettings: !game.user.isGM || introductionDuration > 0 ? undefined : 1,
            audio: colors.audio?.sounds[0].loop ? sound : null,
          })
        )
      );

      const node = $(document.body).find(".introduce-me.introduction");
      this.setIntroductionPosition(node);

      const container = $(node).find(".introduction-container");
      const settings = $(node).find(".settings-ui");
      const image = $(container).find("img#actorImage");
      const label = $(container).find("label#name");
      const citation = $(container).find("label#citation");
      const splitLabel = new SplitText(label, { type: "words,chars" });
      const splitCitation = new SplitText(citation, { type: "words,chars" });

      const animationTimeline = gsap.timeline();
      animationTimeline
        .from(container, { width: 0, height: "auto", duration: 1 })
        .to(image, { opacity: 1, duration: 1 })
        .from(image, { left: -100, duration: 1 }, "<+=0.2");

      if (splitLabel.chars.length > 0) {
        animationTimeline.to(label, { opacity: 1, duration: 0.2 }).from(
          splitLabel.chars,
          0.8,
          {
            opacity: 0,
            scale: 0,
            y: 80,
            rotationX: 180,
            transformOrigin: "0% 50% -50",
          },
          "<"
        );
      }

      if (splitCitation.chars.length > 0) {
        animationTimeline.to(citation, { opacity: 1, duration: 0.2 }).from(
          splitCitation.chars,
          0.8,
          {
            opacity: 0,
            scale: 0,
            y: 80,
            rotationX: 180,
            transformOrigin: "0% 50% -50",
          },
          "<"
        );
      }

      if (settings.length === 1) {
        animationTimeline.from(settings, { opacity: 0, duration: 0.5 }, ">");
      }

      if (introductionDuration > 0) {
        animationTimeline.to(node, { opacity: 0, duration: 0.5 }, `>${introductionDuration}`);
        if (introductionDuration)
          setTimeout(() => {
            sound?.fade(0, { duration: 2000 });
          }, 4000 + Math.max(introductionDuration - 2000, 0));
        setTimeout(() => {
          sound?.stop();
          $(node).remove();
        }, 4000 + introductionDuration * 1000);
      }

      $(node)
        .find(".close-button")
        .click(async (event) => {
          // await game.socket.emit(`module.${CONSTANTS.MODULE_ID}`, { type: CONSTANTS.API.REQUEST_TYPE.close });
          const args = [
            {
              type: CONSTANTS.API.REQUEST_TYPE.close,
              data: null,
            },
            node,
            sound,
            colors.audio,
          ];
          await introduceMeSocket.executeForOthers("introduceMe", ...args);

          this.manualClose(node, sound);
        });

      $(node)
        .find(".audio-button")
        .click(async (event) => {
          // await game.socket.emit(`module.${CONSTANTS.MODULE_ID}`, { type: CONSTANTS.API.REQUEST_TYPE.toggleAudio });
          const args = [
            {
              type: CONSTANTS.API.REQUEST_TYPE.toggleAudio,
              data: null,
            },
            node,
            sound,
            colors.audio,
          ];
          await introduceMeSocket.executeForOthers("introduceMe", ...args);

          await this.toggleAudio(node, sound, colors.audio);
        });
    }
  };

  toggleAudio = async (node, sound, audio) => {
    // const audioButton = $(node).find(".audio-button > i");
    // audioButton.removeClass();
    // if (sound.pausedTime) {
    //   const baseVolume = game.settings.get("core", "globalPlaylistVolume");
    //   const { volume } = audio.sounds[0].options;
    //   await sound.load();
    //   sound.play({
    //     volume: baseVolume * volume,
    //     offset: sound.pausedTime,
    //     fade: audio.sounds[0].fadeIn,
    //   });

    //   audioButton.addClass("fas fa-pause");
    // } else {
    //   sound.pause();
    //   audioButton.addClass("fas fa-play");
    // }
    return await API.toggleAudio(node, sound, audio);
  };

  manualClose = (node, sound) => {
    // gsap.to(node, { opacity: 0, duration: 0.5 });
    // sound?.fade(0, { duration: 2000 });
    // setTimeout(() => {
    //   sound?.stop();
    //   $(node).remove();
    // }, 2000);
    return API.manualClose(node, sound);
  };

  editDisplay = async (colors, localToken, localActor) => {
    cleanupDOM();
    const useActorName = game.settings.get(CONSTANTS.MODULE_ID, "use-actor-name");
    const flavor = this.flavorParse(
      localActor?.getFlag(CONSTANTS.MODULE_ID, "flavor") ?? i18n(`${CONSTANTS.MODULE_ID}.introduceDialog.flavorTitle`),
      localActor
    );
    const sound = await playIntroductionAudio(colors.audio);

    Hooks.on("globalPlaylistVolumeChanged", async (volume) => {
      await sound.fade(volume * colors.audio.sounds[0].options.volume);
    });

    $(document.body).append(
      $(
        await renderTemplate(`modules/${CONSTANTS.MODULE_ID}/templates/introduction.hbs`, {
          name: localToken
            ? useActorName
              ? localActor.name
              : localToken.name
            : i18n(`${CONSTANTS.MODULE_ID}.colorSettings.tester`),
          img: localActor ? this.getIntroductionImage(localToken, localActor) : "icons/svg/cowled.svg",
          flavor: flavor,
          colors: colors,
          editing: true,
          showSettings: 1,
        })
      )
    );

    this.setIntroductionPosition($(document.body).find(".introduce-me.introduction"));

    $(document.body)
      .find(".close-button")
      .click((event) => {
        sound?.stop();
        $(document.body).find(".introduce-me.introduction").remove();
      });
  };

  introduceMeDialog = async (token) => {
    if (game.user.isGM && token) {
      await new IntroduceDialog(token, token.actor).render(true);
    }
  };

  renderHUD = async (data, html) => {
    const rightColumn = $(html).find(".col.right");
    $(rightColumn).append(await renderTemplate(`modules/${CONSTANTS.MODULE_ID}/templates/introductionInteract.hbs`));

    $(rightColumn)
      .find(".introduce-me.introduction-interact")
      .click(async () => {
        this.introduceMe(data.object, data.object.actor);
        data.clear();
      });
  };

  getIntroductionImage = (token, actor) => {
    const useToken = game.settings.get(CONSTANTS.MODULE_ID, "use-token");
    return useToken ? token.texture.src : actor.img;
  };

  flavorParse = (flavor, actor) => {
    return Roll.replaceFormulaData(flavor, actor) ?? flavor;
  };

  setIntroductionPosition = (node) => {
    const { left, top, width, scale } = game.settings.get(CONSTANTS.MODULE_ID, "position");
    node[0].style.left = `${left}px`;
    node[0].style.top = `${top}px`;
    node[0].style.width = `${width}px`;
    node[0].style.transform = `scale(${scale})`;
  };
}

export const cleanupDOM = () => {
  const bannerSettings = $(document.body).find(".introduce-me.banner-settings");
  const introduction = $(document.body).find(".introduce-me.introduction");
  if (bannerSettings.length > 0) {
    $(bannerSettings).remove();
  } else if (introduction.length > 0) {
    $(introduction).remove();
  }
};
