import ColorSettings from './ColorSettings.js';
import Introduction from './Introduction.js';

export default class IntroduceDialog extends FormApplication {
    constructor(token) {
        super({}, {title: game.i18n.localize('introduceMe.introduceDialog.title')});
        this.defaultDuration = game.settings.get('introduce-me', 'introduction-duration');
        this.token = token;
        this.flavor = token.actor.getFlag('introduce-me', 'flavor');
        this.duration = token.actor.getFlag('introduce-me', 'introduction-duration');
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
        const duration = this.duration !== undefined ? this.duration : this.defaultDuration;
        return { 
            flavor: this.flavor, 
            duration: duration, 
        };
    }

    async _updateObject(event, formData) {
        this.flavor = formData.flavor;
        this.duration = formData.duration;
        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);
        const actor = game.actors.get(this.token.actor.id);

        $(html).find('button.default-button').click(async event => {
            await actor.unsetFlag('introduce-me', 'introduction-duration');
            this.duration = undefined;
            this.render();
        });

        $(html).find('button#color-setting').click(event => {
            new ColorSettings(this.token, actor).render(true);
        });

        $(html).find('#preview').click(async () => {
            await new Introduction().introductionDisplay(this.token, this.token.actor, true, this.flavor, this.duration);
        });

        $(html).find('#save').click(async () => {
            await actor.setFlag('introduce-me', 'flavor', this.flavor);
            if(this.duration !== this.defaultDuration){
                await actor.setFlag('introduce-me', 'introduction-duration', this.duration);
            }

            this.close();
        });

        $(html).find('#introduce').click(async () => {
            await actor.setFlag('introduce-me', 'flavor', this.flavor);
            if(this.duration !== this.defaultDuration){
                await actor.setFlag('introduce-me', 'introduction-duration', this.duration);
            }
            
            await new Introduction().introduceMe(this.token);
            this.close();
        });
    }
}