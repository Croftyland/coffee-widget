class Namespace{
    constructor(id, wsTitle, img, endpoint){
        this.id = id;
        this.img = img;
        this.wsTitle = wsTitle;
        this.endpoint = endpoint;
        this.rooms = [];
    }

    addRoom(roomObj){
        this.rooms.push(roomObj);
    }

}

module.exports = Namespace;
