import Introduction from "./scripts/Introduction.js";
// import gsap, { SplitText } from "/scripts/greensock/esm/all.js";
import { registerSettings, registerHandlebars } from "./scripts/settings.js";
// import { setupSockets } from "./scripts/SocketHandler.js";
import IntroduceDialog from "./scripts/IntroduceDialog.js";
import API from "./scripts/API/api.js";
import { registerSocket } from "./scripts/socket.js";
import CONSTANTS from "./scripts/constants/constants.js";
import { i18n } from "./scripts/lib/lib.js";

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once("init", async () => {
  // console.log(`${CONSTANTS.MODULE_ID} | Initializing ${CONSTANTS.MODULE_ID}`);
  // Register custom module settings
  registerSettings();

  gsap.registerPlugin(SplitText);

  registerHandlebars();

  // Preload Handlebars templates
  //await preloadTemplates();

  Hooks.once("socketlib.ready", registerSocket);
  registerSocket();
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once("setup", function () {
  // Do anything after initialization but before ready
  game.modules.get(CONSTANTS.MODULE_ID).api = API;
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once("ready", async () => {
  // Do anything once the module is ready
  // if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
  //   let word = 'install and activate';
  //   if (game.modules.get('lib-wrapper')) word = 'activate';
  //   throw error(`Requires the 'libWrapper' module. Please ${word} it.`);
  // }
  if (!game.modules.get("socketlib")?.active && game.user?.isGM) {
    let word = "install and activate";
    if (game.modules.get("socketlib")) word = "activate";
    throw error(`Requires the 'socketlib' module. Please ${word} it.`);
  }
  // await setupSockets();
});

/* ------------------------------------ */
/* Other Hooks							*/
/* ------------------------------------ */

Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(CONSTANTS.MODULE_ID);
});

Hooks.on("renderTokenHUD", async (data, html) => {
  if (game.user.isGM && game.settings.get(CONSTANTS.MODULE_ID, "show-hud")) {
    await new Introduction().renderHUD(data, html);
  }
});

Hooks.on("renderTokenConfig", async (data, html) => {
  if ($(html).parent("section").length === 0) {
    const configButton = $(html).find(".window-header > .configure-sheet").first();
    const closeButton = $(html).find(".window-header > .header-button.close").first();
    const insertPoint = configButton.length > 0 ? configButton : closeButton;
    $(insertPoint).before(
      `<a class="introduce-me-button"><i class="fas fa-handshake"></i>${i18n(
        `${CONSTANTS.MODULE_ID}.actorSettings.introduceButton`
      )}</>`
    );
    $(".window-header > .introduce-me-button").click((event) => {
      new IntroduceDialog(data.token, data.token.actor).render(true);
    });
  }
});

Hooks.on("getActorDirectoryEntryContext", (_, entryOptions) => {
  entryOptions.push({
    name: i18n(`${CONSTANTS.MODULE_ID}.actorSettings.introduceButton`),
    callback: (li) => {
      const docId = $(li).attr("data-document-id")
        ? $(li).attr("data-document-id")
        : $(li).attr("data-actor-id")
        ? $(li).attr("data-actor-id")
        : $(li).attr("data-entity-id");

      if (docId) {
        const actor = game.actors.get(docId);
        new IntroduceDialog(actor._source.token, actor).render(true);
      }
    },
    icon: '<i class="fas fa-handshake"></i>',
    condition: () => game.user.isGM,
  });
});
