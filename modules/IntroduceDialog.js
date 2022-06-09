import Introduction from './Introduction.js';

export default class IntroduceDialog extends FormApplication {
    constructor(token) {
        super({}, {title: game.i18n.localize('introduceMe.introduceDialog.title')});
        this.token = token;
        this.flavor = token.document._actor.getFlag('introduce-me', 'flavor');
    }

    static get defaultOptions() {
      const defaults = super.defaultOptions;
      const overrides = {
        height: 'auto',
        width: 400,
        id: 'flavor-dialog',
        template: 'modules/introduce-me/templates/introduceDialog.hbs',
        closeOnSubmit: false,
        submitOnChange: true,
        classes: ["introduce-me", "introduce-dialog"],
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
            await Introduction.introductionDisplay(this.token, this.token.document._actor, this.flavor);
        });

        $(html).find('#update').click(async () => {
            await this.token.document._actor.setFlag('introduce-me', 'flavor', this.flavor);
            this.close();
        });

        $(html).find('#introduce').click(async () => {
            await this.token.document._actor.setFlag('introduce-me', 'flavor', this.flavor);
            await Introduction.introduceMe(this.token);
            this.close();
        });
    }
}