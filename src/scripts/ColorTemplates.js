import Introduction from "./Introduction.js";
import { DefaultColors } from "./ColorSettings.js";
import AudioSettings from "./AudioSettings.js";
import { i18n } from "./lib/lib.js";
import CONSTANTS from "./constants/constants.js";

export default class ColorTemplates extends FormApplication {
  constructor() {
    super({}, { title: i18n(`${CONSTANTS.MODULE_ID}.colorTemplates.label`) });
    this.colorTemplates = game.settings.get(CONSTANTS.MODULE_ID, "color-templates");
    this.selected = {};
    this.newTemplateName = "";
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;
    const overrides = {
      height: "auto",
      width: 600,
      id: "color-templates",
      template: `modules/${CONSTANTS.MODULE_ID}/templates/colorTemplates.hbs`,
      closeOnSubmit: false,
      submitOnChange: true,
      classes: [CONSTANTS.MODULE_ID, "color-templates"],
    };

    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

    return mergedOptions;
  }

  getData() {
    const createTemplateDisabled =
      !this.newTemplateName || this.colorTemplates.some((template) => template.label === this.newTemplateName);

    return {
      templates: this.colorTemplates,
      selected: this.selected,
      newTemplateName: this.newTemplateName,
      createTemplateDisabled: createTemplateDisabled,
    };
  }

  async _updateObject(event, formData) {
    Object.keys(formData).forEach((key) => {
      setProperty(this, key, formData[key]);
    });
    this.render();
  }

  activateListeners(html) {
    super.activateListeners(html);

    $(html)
      .find(".color-template-create")
      .click((event) => {
        this.colorTemplates.push({
          id: this.newTemplateName,
          label: this.newTemplateName,
          ...DefaultColors.players,
        });
        this.newTemplateName = "";
        this.render();
      });

    $(html)
      .find(".template-toggle")
      .click((event) => {
        const index = event.currentTarget.id;
        if (this.selected[index]) {
          const { [index]: removed, ...rest } = this.selected;
          this.selected = rest;
        } else {
          this.selected[index] = true;
        }

        this.render();
      });

    $(html)
      .find(".delete-template")
      .click((event) => {
        event.stopPropagation();
        this.colorTemplates = this.colorTemplates.filter((x) => x.id !== event.currentTarget.id);
        this.render();
      });

    $(html)
      .find("button.preview-button")
      .click(async (event) => {
        const index = event.currentTarget.attributes.getNamedItem("[data-id]").value;
        await new Introduction().editDisplay(this.colorTemplates[index]);
      });

    $(html)
      .find("button.audio-button")
      .click(async (event) => {
        const id = event.currentTarget.attributes.getNamedItem("[data-id]").value;
        try {
          const audio = await AudioSettings.generate(this.colorTemplates[id].audio);
          this.colorTemplates[id].audio = audio;
          this.render();
        } catch (e) {}
      });

    $(html)
      .find("button#save")
      .click((event) => {
        const removedTemplates = game.settings
          .get(CONSTANTS.MODULE_ID, "color-templates")
          .filter((x) => !this.colorTemplates.some((colorTemplate) => colorTemplate.id == x.id));
        removeTemplateFromActors(removedTemplates);

        game.settings.set(CONSTANTS.MODULE_ID, "color-templates", this.colorTemplates);
        this.close();
      });
  }
}

const removeTemplateFromActors = (removedTemplates) => {
  const dispositionColors = game.settings.get(CONSTANTS.MODULE_ID, "introduction-colors");
  removedTemplates.forEach((template) => {
    template.actors?.forEach((actorId) => {
      const actor = game.actors.get(actorId);
      actor.unsetFlag(CONSTANTS.MODULE_ID, "introduction-colors");
    });

    Object.keys(dispositionColors).forEach((key) => {
      if (dispositionColors[key].template === template.id) {
        dispositionColors[key] = DefaultColors[key];
      }
    });
  });

  game.settings.set(CONSTANTS.MODULE_ID, "introduction-colors", dispositionColors);
};
