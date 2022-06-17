
export default class AudioSettings extends FormApplication {
    constructor(audio, resolve, reject) {
        super({}, {title: game.i18n.localize('introduceMe.audioSettings.title')});
        this.resolve = resolve;
        this.reject = reject;
    
        this.audio = audio ?? getDefaultSettings();
        this.playingSound = null;
    }

    static get defaultOptions() {
      const defaults = super.defaultOptions;
      const overrides = {
        height: 'auto',
        width: 450,
        id: 'audio-settings',
        template: 'modules/introduce-me/templates/audioSettings.hbs',
        closeOnSubmit: false,
        submitOnChange: true,
        classes: ["introduce-me", "audio-settings"],
      };
      
      const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
      
      return mergedOptions;
    }

    getData() {
        return { 
            audio: this.audio.sounds[0],
            playingSound: this.playingSound,
        };
    }

    async _updateObject(event, formData) {
        Object.keys(formData).forEach(key => {
            setProperty(this, key, formData[key]);
        });
        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);

        $(html).find('#src').change(event => {
            this.audio.sounds[0].src = event.currentTarget.value;
            this.render();
        });

        $(html).find('.remove-audio').click(event => {
            this.audio.sounds[0].src = '';
            this.render();
        });

        $(html).find('#play').click(async event => {
            if(this.playingSound){
                this.playingSound.stop();
                this.playingSound = null;
            }
            else {
                this.playingSound = await AudioHelper.play(this.audio.sounds[0], false);
                this.playingSound._onEnd = (event) => {
                    this.playingSound = null;
                    this.render();
                };
            }

            this.render();
        });

        $(html).find('#save').click(event => {
            this.resolve?.(this.audio.sounds[0].src ? this.audio : undefined);
            this.close();
        });
    }

    close(options) {
        super.close(options);
        this.reject?.();
    }

    static generate = async (audio) => {
        return new Promise((resolve, reject) => {
            return new AudioSettings(audio, resolve, reject).render(true);
        });
    };
}

const getDefaultSettings = () => ({
    sounds: [{
        src: '',
        volume: 0.8,
        loop: false,
    }]
});