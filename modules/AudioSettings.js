
export default class AudioSettings extends FormApplication {
    constructor(audio, tracks, resolve, reject) {
        super({}, {title: game.i18n.localize('introduceMe.audioSettings.title')});
        this.resolve = resolve;
        this.reject = reject;
    
        this.audio = audio ?? getDefaultSettings();
        this.tracks = tracks;
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
            duration: Math.floor(this.tracks[0]?.duration)
        };
    }

    async _updateObject(event, formData) { 
        const offsetChanged = formData['audio.sounds.0.options.offset'] !== this.audio.sounds[0].options.offset;
        const endOffsetChanged = formData['audio.sounds.0.endOffset'] !== this.audio.sounds[0].endOffset
        Object.keys(formData).forEach(key => {
            setProperty(this, key, formData[key]);
        });

        this.scrubAudio(offsetChanged, endOffsetChanged);
        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);

        $(html).find('#src').change(async event => {
            const track = await new Sound(event.currentTarget.value).load();
            this.tracks = [track];

            this.audio.sounds[0].src = event.currentTarget.value;
            this.audio.sounds[0].endOffset = Math.floor(track.duration);
            this.render();
        });

        $(html).find('.remove-audio').click(event => {
            this.audio.sounds[0].src = '';
            this.tracks = [];
            this.render();
        });

        $(html).find('#play').click(async event => {
            event.preventDefault();
            if(this.playingSound){
                this.playingSound._scheduledEvents.forEach(clearTimeout);
                this.playingSound.stop();
                this.playingSound = null;
            }
            else {
                const onEnd = () => {
                    if(!this.audio.sounds[0].loop) {
                        this.playingSound = null;
                        this.render();
                    }
                };
                this.playingSound = await playIntroductionAudio(this.audio, onEnd);
            }

            this.render();
        });

        $(html).find('#save').click(event => {
            this.resolve?.(this.audio.sounds[0].src ? this.audio : undefined);
            this.close();
        });
    }

    close(options) {
        this.playingSound?.stop();
        super.close(options);
        this.reject?.();
    }

    async scrubAudio(offsetChanged, endOffsetChanged) {
        if(this.playingSound && (offsetChanged || endOffsetChanged)) {
            const schedule = () => {
            };
            const onEnd = () => {
                if(!this.audio.sounds[0].loop){
                    this.playingSound = null;
                    this.render();
                }
            }

            this.playingSound.stop();
            this.playingSound = await playIntroductionAudio(this.audio, onEnd, schedule);
        }
    }

    static generate = async (audio) => {
        const tracks = audio ? [await new Sound(audio.sounds[0].src).load()] : [];
        return new Promise((resolve, reject) => {
            return new AudioSettings(audio, tracks, resolve, reject).render(true);
        });
    };
}

export const playIntroductionAudio = async (audio, onEnd, schedule) => {
    if(audio?.sounds.length > 0){
        const sound = await new Sound(audio.sounds[0].src).load();
        sound._onEnd = () => {
            sound._scheduledEvents.forEach(clearTimeout);
            onEnd?.();
        };
        sound._onStop = () => {
            sound._scheduledEvents.forEach(clearTimeout);
            onEnd?.();
        };
        
        playAudio(sound, audio.sounds[0], schedule);
        return sound;
    }

    return null;
}

const playAudio = async (sound, soundData, schedule) => {
    const { src, options, loop, endOffset } = soundData;
    const { volume, ...rest } = options;
    sound.play({ ...rest, volume: 0 });
        sound.fade(volume);
        sound.schedule(() => {
            schedule?.();
            if(loop){
                playAudio(sound, soundData);
            }
            else {
                sound.stop();
            }
        }, endOffset);
        
};

const getDefaultSettings = () => ({
    sounds: [{
        src: '',
        options: {
            volume: 0.8,
            offset: 0,
        },
        loop: false,
        endOffset: 0,
    }]
});