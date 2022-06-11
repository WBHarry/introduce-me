import Introduction from "./Introduction.js";

export default class ColorSettings extends FormApplication {
    constructor(localToken, localActor) {
        super({}, {title: game.i18n.localize('introduceMe.colorSettings.label')});
        this.localToken = localToken;
        this.localActor = localActor;
        if(localActor){
            this.colors = localActor?.getFlag('introduce-me', 'introduction-colors') ?? {
                actor: getActorIntroductionColors(localToken, localActor)
            }
        }
        else {
           this.colors = game.settings.get('introduce-me', 'introduction-colors'); 
        }
    }

    static get defaultOptions() {
      const defaults = super.defaultOptions;
      const overrides = {
        height: 'auto',
        width: 600,
        id: 'color-settings',
        template: 'modules/introduce-me/templates/colorSettings.hbs',
        closeOnSubmit: false,
        submitOnChange: true,
        classes: ["introduce-me", "color-settings"],
      };
      
      const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
      
      return mergedOptions;
    }

    getData() {
        return { 
            colors: this.colors
        };
    }

    async _updateObject(event, formData){
        const expandedData = foundry.utils.expandObject(formData);
        Object.keys(expandedData).forEach(key => {
            this[key] = expandedData[key];
        });
        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);

        $(html).find('button#save').click(event => {
            if(this.localActor){
                if(areColorsEqual(this.colors.actor, this.localToken, this.localActor)){
                    this.localActor.unsetFlag('introduce-me', 'introduction-colors');
                }
                else {
                    this.localActor.setFlag('introduce-me', 'introduction-colors', this.colors);
                }
            }
            else {
                game.settings.set('introduce-me', 'introduction-colors', this.colors);
            }

            this.close();
        });

        $(html).find('button.preview-button').click(async event => {
            const type = event.currentTarget.attributes.getNamedItem('[data-id]').value;
            await new Introduction().editDisplay(this.colors[type], this.localToken, this.localActor);
        });

        $(html).find('button.default-button').click(event => {
            const type = event.currentTarget.attributes.getNamedItem('[data-id]').value;

            const defaultColor = type === 'actor' ? getActorIntroductionColorsByData(this.localToken, this.localActor) : DefaultColors[type];
            this.colors[type] = defaultColor;
            this.render();
        });
    }
}

export const DefaultColors = {
    players: {
        background: '#2f4f4f',
        text: '#ffe4c4',
        clip: true,
    },
    friendly: {
        background: '#2f4f4f',
        text: '#ffe4c4',
        clip: true,
    },
    neutral: {
        background: '#2f4f4f',
        text: '#ffe4c4',
        clip: true,
    },
    hostile: {
        background: '#2f4f4f',
        text: '#ffe4c4',
        clip: true,
    }
};

export const getActorIntroductionColors = (token, actor) => {
    const localIntroductionColors = actor.getFlag('introduce-me', 'introduction-colors');
    if(localIntroductionColors){
        return localIntroductionColors.actor;
    }
    
    return getActorIntroductionColorsByData(token, actor);
};

const getActorIntroductionColorsByData = (token, actor) => {
    const introductionColors = game.settings.get('introduce-me', 'introduction-colors');
    if(actor.data.type === 'character'){
        return introductionColors.players;
    }

    switch(token.data.disposition){
        case -1:
            return introductionColors.hostile;
        case 0:
            return introductionColors.neutral;
        default:
            return introductionColors.friendly;
    }
}

const areColorsEqual = (colors, token, actor) => {
    const defaultColor = getActorIntroductionColorsByData(token, actor);

    return (
        colors.background === defaultColor.background &&
        colors.text === defaultColor.text &&
        colors.clip === defaultColor.clip
    );
};