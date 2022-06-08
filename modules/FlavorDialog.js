import Introduction from './Introduction.js';

export default class FlavorDialog extends FormApplication {
    constructor(token) {
        super({}, {title: game.i18n.localize('introduceMe.flavorDialog.title')});
        this.token = token;
        this.flavor = token.document._actor.getFlag('introduce-me', 'flavor');
    }

    static get defaultOptions() {
      const defaults = super.defaultOptions;
      const overrides = {
        height: 'auto',
        width: 400,
        id: 'flavor-dialog',
        template: 'modules/introduce-me/templates/flavorDialog.hbs',
        closeOnSubmit: false,
        submitOnChange: true,
        classes: ["introduce-me", "flavor_dialog"],
      };
      
      const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
      
      return mergedOptions;
    }

    getData() {
        return { flavor: this.flavor };
    }

    async _updateObject(event, formData) {
        this.flavor = formData.flavor;
        this.render();
    }


    activateListeners(html) {
        super.activateListeners(html);
    
        $(html).find('#preview').click(async () => {
            await Introduction.introductionDisplay(this.token, this.flavor);
        });

        $(html).find('#update').click(async () => {
            await this.token.document._actor.setFlag('introduce-me', 'flavor', this.flavor);
            this.close();
        });
    }
}