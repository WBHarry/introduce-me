import Introduction from './Introduction.js';

export default class IntroduceDialog extends FormApplication {
    constructor(token) {
        super({}, {title: game.i18n.localize('introduceMe.introduceDialog.title')});
        this.token = token;
        this.flavor = token.actor.getFlag('introduce-me', 'flavor');
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
            await new Introduction().introductionDisplay(this.token, this.token.actor, true, this.flavor);
        });

        $(html).find('#save').click(async () => {
            await game.actors.get(this.token.actor.id).setFlag('introduce-me', 'flavor', this.flavor);
            this.close();
        });

        $(html).find('#introduce').click(async () => {
            await game.actors.get(this.token.actor.id).setFlag('introduce-me', 'flavor', this.flavor);
            await new Introduction().introduceMe(this.token);
            this.close();
        });
    }
}