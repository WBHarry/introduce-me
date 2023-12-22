import { areDispositionSettingsEqual, ActorColorSettings } from './ColorSettings.js';
import Introduction from './Introduction.js';

export default class IntroduceDialog extends FormApplication {
    constructor(token, actor) {
        const useActorName = game.settings.get('introduce-me', 'use-actor-name');
        super({}, {title: `${game.i18n.localize('introduceMe.introduceDialog.title')}: ${useActorName ? actor.name : token.name}`});
        this.defaultDuration = game.settings.get('introduce-me', 'introduction-duration');
        this.token = token;
        this.actor = actor;
        this.flavor = actor.getFlag('introduce-me', 'flavor');
        this.duration = actor.getFlag('introduce-me', 'introduction-duration');
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
        const actorColor = this.actor.getFlag('introduce-me', 'introduction-colors');
        const isDefaultColor = !actorColor ? true : areDispositionSettingsEqual(actorColor, this.token, this.actor);
        return { 
            flavor: this.flavor, 
            duration: duration,
            isDefaultColor: isDefaultColor, 
        };
    }

    async _updateObject(event, formData) {
        this.flavor = formData.flavor;
        this.duration = formData.duration;
        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);
        const actor = game.actors.get(this.actor.id);

        $(html).find('button.default-button').click(async event => {
            this.duration = undefined;
            this.render();
        });

        $(html).find('button#color-setting').click(async event => {
            await ActorColorSettings.generate(this.token, actor);
            this.render();
        });

        $(html).find('#preview').click(async () => {
            await new Introduction().introductionDisplay(this.token, this.actor, true, this.flavor, this.duration);
        });

        $(html).find('#save').click(async () => {
            await actor.setFlag('introduce-me', 'flavor', this.flavor);

            if(this.duration === undefined){
                await actor.unsetFlag('introduce-me', 'introduction-duration');
            }
            else{
                await actor.setFlag('introduce-me', 'introduction-duration', this.duration);
            }

            this.close();
        });

        $(html).find('#introduce').click(async () => {
            await actor.setFlag('introduce-me', 'flavor', this.flavor);

            if(this.duration === undefined){
                await actor.unsetFlag('introduce-me', 'introduction-duration');
            }
            else{
                await actor.setFlag('introduce-me', 'introduction-duration', this.duration);
            }
            
            await new Introduction().introduceMe(this.token, actor);
            this.close();
        });
    }
}