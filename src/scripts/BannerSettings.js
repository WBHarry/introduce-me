import Scalable from "./Scalable.js";
import { cleanupDOM } from "./Introduction.js";
import { i18n } from "./lib/lib.js";
import CONSTANTS from "./constants/constants.js";

export default class BannerSettings extends FormApplication {
  constructor(token, actor) {
    const position = game.settings.get(CONSTANTS.MODULE_ID, "position");
    super(
      {},
      {
        title: i18n(`${CONSTANTS.MODULE_ID}.bannerSettings.label`),
        width: position.width,
        top: position.top,
        left: position.left,
        scale: position.scale,
      }
    );
    const introductionColors = game.settings.get(CONSTANTS.MODULE_ID, "introduction-colors");
    const introductionColorsArray = Object.keys(introductionColors).reduce((acc, key) => {
      acc.push({
        ...introductionColors[key],
        id: key,
        label: key,
      });
      return acc;
    }, []);
    const templates = game.settings.get(CONSTANTS.MODULE_ID, "color-templates");
    this.colors = introductionColorsArray.concat(templates);
    this.color = {
      ...introductionColors.friendly,
      id: "friendly",
      label: "friendly",
    };

    this.token = token;
    this.actor = actor;
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;
    const overrides = {
      id: "banner-settings",
      template: `modules/${CONSTANTS.MODULE_ID}/templates/introductionInner.hbs`,
      closeOnSubmit: false,
      submitOnChange: true,
      resizable: true,
      classes: [CONSTANTS.MODULE_ID, "banner-settings"],
    };

    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

    return mergedOptions;
  }

  getData() {
    return {
      colors: this.color,
      editing: true,
      img: "icons/svg/cowled.svg",
      name: i18n(`${CONSTANTS.MODULE_ID}.colorSettings.tester`),
      flavor: i18n(`${CONSTANTS.MODULE_ID}.introduceDialog.flavorTitle`), // Flavor parse?
      showSettings: 2,
    };
  }

  async _updateObject(event, formData) {
    this.color = this.colors.find((x) => x.id === formData.color);
    this.render();
  }

  async _renderOuter() {
    const outer = $(await renderTemplate(`modules/${CONSTANTS.MODULE_ID}/templates/bannerSettings.hbs`));
    outer[0].style.height = "auto";
    const header = $(outer).find(".position-anchor")[0];
    new Scalable(this, outer, header, true);
    return outer;
  }

  render(force, options) {
    cleanupDOM();
    super.render(force, options);
  }

  activateListeners(html) {
    super.activateListeners(html);

    $(html)
      .find(".close-button")
      .click((event) => {
        this.close();
      });

    $(html)
      .find(".check-button")
      .click((event) => {
        game.settings.set(CONSTANTS.MODULE_ID, "position", this.position);
        this.close();
      });

    $(html)
      .find(".default-button")
      .click((event) => {
        this.setPosition(defaultPosition);
        this.render();
      });
  }
}

export const defaultPosition = {
  height: 125,
  left: window.innerWidth * 0.5 - 358,
  scale: 1,
  top: 100,
  width: 716,
  zIndex: 0,
};
