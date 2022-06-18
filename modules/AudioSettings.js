
export default class AudioSettings extends FormApplication {
    constructor(audio, tracks, resolve, reject) {
        super({}, {title: game.i18n.localize('introduceMe.audioSettings.title')});
        this.resolve = resolve;
        this.reject = reject;
    
        this.audio = audio ?? getDefaultSettings();
        this.tracks = tracks;
        this.playingSound = null;
        this.timestampUpdate = null;
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
            currentTime: this.playingSound ? Math.floor(this.playingSound.currentTime) : 0,
            duration: this.tracks[0]?.duration ? Math.floor(this.tracks[0].duration) : 0,
        };
    }

    async _updateObject(event, formData) { 
        const offsetChanged = formData['audio.sounds.0.options.offset'] !== this.audio.sounds[0].options.offset;
        const endOffsetChanged = formData['audio.sounds.0.endOffset'] !== this.audio.sounds[0].endOffset;
        const volumeChanged = formData['audio.sounds.0.options.volume'] !== this.audio.sounds[0].options.volume;
        Object.keys(formData).forEach(key => {
            setProperty(this, key, formData[key]);
        });

        this.scrubAudio(offsetChanged, endOffsetChanged, volumeChanged);
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
                clearInterval(this.timestampUpdate);
                this.timestampUpdate = null;
            }
            else {
                const onEnd = () => {
                    if(!this.audio.sounds[0].loop) {
                        this.playingSound = null;
                        this.render();
                    }
                };
                this.playingSound = await playIntroductionAudio(this.audio, onEnd);
                this.timestampUpdate = setInterval(() => {
                    this.render();
                }, 1000);
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
        this.tracks = [];
        clearInterval(this.timestampUpdate);

        super.close(options);
        this.reject?.();
    }

    async scrubAudio(offsetChanged, endOffsetChanged, volumeChanged) {
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
        else if(this.playingSound && volumeChanged) {
            this.playingSound.fade(this.audio.sounds[0].options.volume, { duration: 0 });
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
    const { options, loop, endOffset, fadeIn } = soundData;
    const { volume, ...rest } = options;
    sound.play({ ...rest, volume: 0 });
    sound.fade(volume, { duration: fadeIn*1000 });
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
        fadeIn: 1,
    }]
});