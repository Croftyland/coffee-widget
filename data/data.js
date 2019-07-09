// Bring in the room class
const Namespace =  require('../classes/Namespace');
const Room =  require('../classes/Room');

// Set up the workspaces
let workspaces = [];
let bikeNs = new Namespace(0,'Bike','https://designmodo.com/wp-content/uploads/2015/08/bike.jpg','/bike');
let coffeeNs = new Namespace(1,'Coffee','https://www.lerche-werbemittel.de/wAssets/img/referenzen/hochwertige-cappuccinotasse-aus-porzellan-mit-hydroglasur-und-logogravur-als-werbemittel/weblication/wThumbnails/2003_form563_cappuccinotasse_peerigon_01-4e7383b0a311424gc0b02c89fc3e11b6@2x.jpg','/coffee');
let gameNs = new Namespace(2,'Games','https://png.pngtree.com/element_origin_min_pic/16/07/25/125795958617308.jpg','/game');

workspaces.push(bikeNs,coffeeNs,gameNs);

// Make the main room and add it to rooms. it will ALWAYS be 0
bikeNs.addRoom(new Room(0,'Parking','Bike'));
bikeNs.addRoom(new Room(1,'Hiking','Bike'));
bikeNs.addRoom(new Room(2,'Other','Bike'));

coffeeNs.addRoom(new Room(0,'Cafe','Coffee'));
coffeeNs.addRoom(new Room(1,'Some coffee?','Coffee'));
coffeeNs.addRoom(new Room(2,'Fun facts','Coffee'));

gameNs.addRoom(new Room(0,'PS','Games'));
gameNs.addRoom(new Room(1,'Board Game','Games'));
gameNs.addRoom(new Room(2,'Party Fun','Games'));
gameNs.addRoom(new Room(3,'Discussing','Games'));

module.exports = workspaces;
