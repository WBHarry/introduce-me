import Introduction from './Introduction.js';

export const setupSockets = async () => {
    game.socket.on(`module.introduce-me`, async request => {
        switch(request.type){
            case RequestType.introduce:
                const entity = await fromUuid(request.data.uuid);
                const token = entity.documentName === "Actor" ? entity.prototypeToken : entity;
                const actor = entity.documentName === "Actor" ? entity : entity.actor;
                break;
        }
    });
}

export const RequestType = {
    introduce: 'introduce',
    close: 'close',
    toggleAudio: 'toggleAudio',
};
