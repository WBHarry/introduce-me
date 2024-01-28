import ColorSettings, { DefaultColors } from "./ColorSettings.js";
import ColorTemplates from "./ColorTemplates.js";
import BannerSettings, { defaultPosition } from "./BannerSettings.js";
import CONSTANTS from "./constants/constants.js";

export const registerSettings = () => {
  game.settings.registerMenu(CONSTANTS.MODULE_ID, "color-settings", {
    name: `${CONSTANTS.MODULE_ID}.colorSettings.showHud.title`,
    label: `${CONSTANTS.MODULE_ID}.colorSettings.showHud.label`,
    hint: `${CONSTANTS.MODULE_ID}.colorSettings.showHud.hint`,
    icon: "fas fa-palette",
    type: ColorSettings,
    restricted: true,
  });

  game.settings.registerMenu(CONSTANTS.MODULE_ID, "color-templates", {
    name: `${CONSTANTS.MODULE_ID}.colorTemplates.showHud.title`,
    label: `${CONSTANTS.MODULE_ID}.colorTemplates.showHud.label`,
    hint: `${CONSTANTS.MODULE_ID}.colorTemplates.showHud.hint`,
    icon: "fas fa-book",
    type: ColorTemplates,
    restricted: true,
  });

  game.settings.registerMenu(CONSTANTS.MODULE_ID, "banner-settings", {
    name: `${CONSTANTS.MODULE_ID}.bannerSettings.showHud.title`,
    label: `${CONSTANTS.MODULE_ID}.bannerSettings.showHud.label`,
    hint: `${CONSTANTS.MODULE_ID}.bannerSettings.showHud.hint`,
    icon: "far fa-image",
    type: BannerSettings,
    restricted: false,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "show-hud", {
    name: `${CONSTANTS.MODULE_ID}.gameSettings.showHud.title`,
    hint: `${CONSTANTS.MODULE_ID}.gameSettings.showHud.hint`,
    scope: "world",
    default: true,
    config: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "use-token", {
    name: `${CONSTANTS.MODULE_ID}.gameSettings.useToken.title`,
    hint: `${CONSTANTS.MODULE_ID}.gameSettings.useToken.hint`,
    scope: "world",
    default: false,
    config: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "use-actor-name", {
    name: `${CONSTANTS.MODULE_ID}.gameSettings.useActorName.title`,
    hint: `${CONSTANTS.MODULE_ID}.gameSettings.useActorName.hint`,
    scope: "world",
    default: false,
    config: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "set-display-name", {
    name: `${CONSTANTS.MODULE_ID}.gameSettings.setDisplayName.title`,
    hint: `${CONSTANTS.MODULE_ID}.gameSettings.setDisplayName.hint`,
    scope: "world",
    default: false,
    config: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "use-introduce-permission", {
    name: `${CONSTANTS.MODULE_ID}.gameSettings.useIntroducePermission.title`,
    hint: `${CONSTANTS.MODULE_ID}.gameSettings.useIntroducePermission.hint`,
    scope: "world",
    default: false,
    config: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "introduction-duration", {
    name: `${CONSTANTS.MODULE_ID}.gameSettings.introductionDuration.title`,
    hint: `${CONSTANTS.MODULE_ID}.gameSettings.introductionDuration.hint`,
    scope: "world",
    default: 2,
    config: true,
    type: Number,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "introduction-colors", {
    name: `${CONSTANTS.MODULE_ID}.gameSettings.introductionColors.title`,
    hint: `${CONSTANTS.MODULE_ID}.gameSettings.introductionColors.hint`,
    scope: "world",
    default: DefaultColors,
    config: false,
    type: Object,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "color-templates", {
    name: `${CONSTANTS.MODULE_ID}.gameSettings.color-templates.title`,
    hint: `${CONSTANTS.MODULE_ID}.gameSettings.color-templates.hint`,
    scope: "world",
    default: [],
    config: false,
    type: Object,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "position", {
    name: `${CONSTANTS.MODULE_ID}.gameSettings.position.title`,
    hint: `${CONSTANTS.MODULE_ID}.gameSettings.position.hint`,
    scope: "client",
    default: defaultPosition,
    config: false,
    type: Object,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "debug", {
    name: `${CONSTANTS.MODULE_ID}.gameSettings.debug.title`,
    hint: `${CONSTANTS.MODULE_ID}.gameSettings.debug.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });
};

export const registerHandlebars = () => {
  loadTemplates([
    `modules/${CONSTANTS.MODULE_ID}/templates/introduction.hbs`,
    `modules/${CONSTANTS.MODULE_ID}/templates/partials/colorSetting.hbs`,
    `modules/${CONSTANTS.MODULE_ID}/templates/partials/colorTemplate.hbs`,
    `modules/${CONSTANTS.MODULE_ID}/templates/partials/colorSettingHeader.hbs`,
  ]);
};
