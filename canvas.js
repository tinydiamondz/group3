const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d")

canvas.width = 608
canvas.height = 460
context.imageSmoothingEnabled = false;

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 40){
    collisionsMap.push(collisions.slice(i, i + 40))
}

const templeZoneMap = []
for (let i = 0; i < templeZoneData.length; i += 40){
    templeZoneMap.push(templeZoneData.slice(i, i + 40))
}

const houseZoneMap = []
for (let i = 0; i < houseZoneData.length; i += 40){
    houseZoneMap.push(houseZoneData.slice(i, i + 40))
}

const lakeZoneMap = []
for (let i = 0; i < lakeZoneData.length; i += 40){
    lakeZoneMap.push(lakeZoneData.slice(i, i + 40))
}

const marketZoneMap = []
for (let i = 0; i < marketZoneData.length; i += 40){
    marketZoneMap.push(marketZoneData.slice(i, i + 40))
}

const forestZoneMap = []
for (let i = 0; i < forestZoneData.length; i += 40){
    forestZoneMap.push(forestZoneData.slice(i, i + 40))
}

//UKURAN X DAN Y
const offset = {
    x: 0,
    y: -570
}
   
class Boundary {
    static width = 40
    static height = 40
    constructor({position}){
        this.position = position
        this.width = 40
        this.height = 40
    }

    draw() { 
        context.fillStyle = 'rgba(255,0,0,0)'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
const boundaries = []
collisionsMap.forEach((row, i) => {
    row.forEach((symbol,j) => {
        if (symbol === 2601 || symbol === 3319)
            boundaries.push(new Boundary({
                position :{
                    x: j * Boundary.width + offset.x ,
                    y: i * Boundary.height + offset.y
                } 
            }))
    })
})

const templeZone = []
templeZoneMap.forEach((row, i) => {
    row.forEach((symbol,j) => {
        if (symbol === 2544)
            templeZone.push(new Boundary({
                position :{
                    x: j * Boundary.width + offset.x ,
                    y: i * Boundary.height + offset.y
                } 
            }))
    })
})

const houseZone  = []
houseZoneMap.forEach((row, i) => {
    row.forEach((symbol,j) => {
        if (symbol === 2544)
            houseZone.push(new Boundary({
                position :{
                    x: j * Boundary.width + offset.x ,
                    y: i * Boundary.height + offset.y
                } 
            }))
    })
})

const lakeZone   = []
lakeZoneMap.forEach((row, i) => {
    row.forEach((symbol,j) => {
        if (symbol === 2544)
            lakeZone.push(new Boundary({
                position :{
                    x: j * Boundary.width + offset.x ,
                    y: i * Boundary.height + offset.y
                } 
            }))
    })
})

const marketZone = []
marketZoneMap.forEach((row, i) => {
    row.forEach((symbol,j) => {
        if (symbol === 2544)
            marketZone.push(new Boundary({
                position :{
                    x: j * Boundary.width + offset.x ,
                    y: i * Boundary.height + offset.y
                } 
            }))
    })
})

const forestZone = []
forestZoneMap.forEach((row, i) => {
    row.forEach((symbol,j) => {
        if (symbol === 2544)
            forestZone.push(new Boundary({
                position :{
                    x: j * Boundary.width + offset.x ,
                    y: i * Boundary.height + offset.y
                } 
            }))
    })
})


const image = new Image()
image.src = "./img/Map Zoom.png"
console.log(image)

const savedAvatar = localStorage.getItem('playerAvatar');
const avatarImage = new Image();
avatarImage.src = savedAvatar;


//STRUCT UNTUK GAMBAR KAYAK BACKGROUND
class Sprite {
    constructor({position, velocity, image,frames_h = { max: 1}, frames_v = { max: 1}, size_h = {max: 1}, size_v = {max: 1}}) {
        this.position = position
        this.image = image
        this.frames_h = {...frames_h, val: 0, elapsed: 0}
        this.frames_v = {...frames_v, val: 0, elapsed: 0}
        this.size_h = size_h  
        this.size_v = size_v

        this.image.onload = () => {
            this.width = this.image.width / this.frames_h.max
            this.height = this.image.height / this. frames_v.max
            console.log(this.width)
            console.log(this.height)
        }
        this.moving = false
    }

    draw(){
        const frameWidth = this.image.width / this.frames_h.max;
        const frameHeight = this.image.height / this.frames_v.max;

        context.drawImage(
            this.image, 
            0,
            this.frames_v.val * this.width,
            frameWidth,
            frameHeight ,
            this.position.x,
            this.position.y,
            this.image.width / this.size_h.max,
            this.image.height / this.size_v.max, 
        )
        if (this.moving){
            if (this.frames_v.max > 1){
                this.frames_v.elapsed++
            }

            if (this.frames_v.elapsed % 10 === 0){
                if (this.frames_v.val < this.frames_v.max - 1) {
                    this.frames_v.val++
                } else {
                        this.frames_v.val = 0
                    }
            }
        }

    }
}

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 64 / 2,
        y: canvas.height / 2 - 64 / 2,
    },
    image: avatarImage,
    frames_h: {
        max: 4
    },
    frames_v: {
        max: 4
    },
    size_h: {
        max: 1.25
    },
    size_v: {
        max: 1.25
    }
})

const background =  new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image,
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const movable = [background, ...boundaries, ...templeZone, ...lakeZone,...houseZone, ...forestZone, ...marketZone]

function rectangularCollision({rectangle1, rectangle2}){
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height && 
        rectangle1.position.y + player.height >= rectangle2.position.y
    )
}
function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    templeZone.forEach(templeZone =>{
        templeZone.draw()
    })
    houseZone.forEach(houseZone =>{
        houseZone.draw()
    })
    lakeZone.forEach(lakeZone =>{
        lakeZone.draw()
    })
    marketZone.forEach(marketZone =>{
        marketZone.draw()
    })
    forestZone.forEach(forestZone =>{
        forestZone.draw()
    })
    player.draw()

    templeZone.forEach(zone => {
        if (rectangularCollision({ rectangle1: player, rectangle2: zone })) {
            showActivity("temple");
        }
    });
    
    houseZone.forEach(zone => {
        if (rectangularCollision({ rectangle1: player, rectangle2: zone })) {
            showActivity("house");
        }
    });
    lakeZone.forEach(zone => {
        if (rectangularCollision({ rectangle1: player, rectangle2: zone })) {
            showActivity("lake");
        }
    });
    forestZone.forEach(zone => {
        if (rectangularCollision({ rectangle1: player, rectangle2: zone })) {
            showActivity("forest");
        }
    });
    marketZone.forEach(zone => {
        if (rectangularCollision({ rectangle1: player, rectangle2: zone })) {
            showActivity("forest");
        }
    });


    //Movement
    let moving = true; // ✅ default = bisa bergerak
    player.moving = false; // ✅ reset animasi
    if (keys.w.pressed && lastkey === "w"){
        player.moving = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
              rectangularCollision({
                rectangle1: player,
                rectangle2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 5
                  }
                }
              })
            ) {
                console.log("colliding")
                moving = false
                break
            }
        }

        if (moving) {
            movable.forEach((movable) => {
              movable.position.y += 5;
            });
          }
    } 

    else if (keys.a.pressed && lastkey === "a"){
        player.moving = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
              rectangularCollision({
                rectangle1: player,
                rectangle2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x + 5,
                    y: boundary.position.y 
                  }
                }
              })
            ) {
                console.log("colliding")
                moving = false
                break
            }
        }
        if (moving) {
            movable.forEach((movable) => {
                movable.position.x += 5
            })
        }
    }

    else if (keys.s.pressed && lastkey === "s"){
        player.moving = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
              rectangularCollision({
                rectangle1: player,
                rectangle2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x ,
                    y: boundary.position.y - 5
                  }
                }
              })
            ) {
                console.log("colliding")
                moving = false
                break
            }
        }
        if (moving){
            movable.forEach((movable) => {
                movable.position.y -= 5
            })
        }
    }

    else if (keys.d.pressed && lastkey === "d"){
        player.moving = true
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
              rectangularCollision({
                rectangle1: player,
                rectangle2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x - 5,
                    y: boundary.position.y 
                  }
                }
              })
            ) {
                console.log("colliding")
                moving = false
                break
                

            }
        }
        if (moving){
            movable.forEach((movable) => {
                movable.position.x -= 5
            })
        }
    }
}
animate()

let lastkey = ''
window.addEventListener("keydown", (e) => {
    switch (e.key){
    case "w":
        keys.w.pressed = true
        lastkey = "w"
        break

    case "a":
        keys.a.pressed = true
        lastkey = "a"
        break

    case "s":
        keys.s.pressed = true
        lastkey = "s"
        break

    case "d":
        keys.d.pressed = true
        lastkey = "d"
        break 
    }
})

window.addEventListener("keyup", (e) => {
    switch (e.key){
    case "w":
        keys.w.pressed = false
        break

    case "a":
        keys.a.pressed = false
        break

    case "s":
        keys.s.pressed = false
        break

    case "d":
        keys.d.pressed = false
        break 
    }
})

canvas.addEventListener('click', function(e){
    // koordinat klik
    const x = e.offsetX;
    const y = e.offsetY;
    if (x >= rumahX && x <= rumahX + lebar && y >= rumahY && y <= rumahY + tinggi) {
        showActivity('house');
    }
});

