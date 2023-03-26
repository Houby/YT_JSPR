//Переменные

let rightPosition = 0
let imgBlockPosition = 0
let direction = 'right'
let hit = false
let jump = false
let fall = false
let timer = null
let x = 0
let halfWidth = window.screen.width / 2
let tileArray = []
let maxLives = 6
let lives = 3

let jumpBlock = window.document.querySelector('#jump-block')
let hitBlock = window.document.querySelector('#hit-block')
let heroImg = window.document.querySelector('#hero-img')
let imgBlock = window.document.querySelector('#img-block')
let canvas = window.document.querySelector('#canvas')
let fsBtn = window.document.querySelector('#fsBtn')
let info = window.document.querySelector('#info')

let heroX = Math.floor((Number.parseInt(imgBlock.style.left)+32)/32)
let heroY = Math.floor(Number.parseInt(imgBlock.style.bottom)/32)

console.log(heroX, heroY)

jumpBlock.style.top = `${window.screen.height/2 - 144/2}px`
hitBlock.style.top = `${window.screen.height/2 - 144/2}px`

heroImg.onclick = () => {
    event.preventDefault()
}

fsBtn.onclick = () => {
    if (window.document.fullscreenElement) {
        fsBtn.src = 'img/fullscreen.png'
        window.document.exitFullscreen()
    } else {
        canvas.requestFullscreen() 
        fsBtn.src = 'img/cancel.png'
    }
}

jumpBlock.onclick = () => {
    jump = true
}
hitBlock.onclick = () => {
    hit = true
}

//Функции

const updateHeroXY = () => {
    heroX = Math.ceil((Number.parseInt(imgBlock.style.left)+32)/32)
    heroY = Math.ceil(Number.parseInt(imgBlock.style.bottom)/32)

    info.innerText = `heroX = ${heroX}, heroY = ${heroY}`
}
const checkFalling = () => {
    updateHeroXY()
    let isFalling = true
    for (let i = 0; i < tileArray.length; i++) {
        if ((tileArray[i][0] === heroX) && ((tileArray[i][1]+1) === heroY)) {
            isFalling = false
        }
    }
    if (isFalling) {
        info.innerText = info.innerText + ', Falling'
        fall = true
    } else {
        info.innerText = info.innerText + ', not Falling'
        fall = false
    }
}
const fallHandler = () => {
    heroImg.style.top = '-96px'
    imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)-40}px`
    checkFalling()
}
const rightHandler = () => {
    heroImg.style.transform = 'scale(-1,1)'
    rightPosition = rightPosition + 1
    imgBlockPosition = imgBlockPosition + 1 
    if (rightPosition > 5) {
        rightPosition = 0
    }
    heroImg.style.left = `-${rightPosition*96}px`
    heroImg.style.top = `-192px`
    imgBlock.style.left = `${imgBlockPosition*20}px`

    checkFalling()
}
const leftHandler = () => {
    heroImg.style.transform = 'scale(1,1)'
    rightPosition = rightPosition + 1
    imgBlockPosition = imgBlockPosition - 1 
    if (rightPosition > 5) {
        rightPosition = 0
    }
    heroImg.style.left = `-${rightPosition*96}px`
    heroImg.style.top = `-192px`
    imgBlock.style.left = `${imgBlockPosition*20}px`

    checkFalling()
}
const standHandler = () => {
    switch (direction) {
        case 'right' : {
            heroImg.style.transform = 'scale(-1,1)'
            if (rightPosition > 4) {
                rightPosition = 1
            }
            break
        }
        case 'left' : {
            heroImg.style.transform = 'scale(1,1)'
            if (rightPosition > 3) {
                rightPosition = 0
            }
            break
        }
        default : break
    }
    rightPosition = rightPosition + 1
    heroImg.style.left = `-${rightPosition*96}px`
    heroImg.style.top = `0px`

    checkFalling()
}
const hitHandler = () => {
    switch (direction) {
        case 'right' : {
            heroImg.style.transform = 'scale(-1,1)'
            if (rightPosition > 4) {
                rightPosition = 1
                hit = false
            }
            break
        }
        case 'left' : {
            heroImg.style.transform = 'scale(1,1)'
            if (rightPosition > 3) {
                rightPosition = 0
                hit = false
            }
            break
        }
        default : break
    }
    rightPosition = rightPosition + 1
    heroImg.style.left = `-${rightPosition*96}px`
    heroImg.style.top = `-288px`
}
const jumpHandler = () => {
    switch (direction) {
        case 'right' : {
            heroImg.style.transform = 'scale(-1,1)'
            if (rightPosition > 4) {
                rightPosition = 1
                jump = false
                imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)+160}px`
                imgBlockPosition = imgBlockPosition + 10
                imgBlock.style.left = `${imgBlockPosition*20}px`
            }
            break
        }
        case 'left' : {
            heroImg.style.transform = 'scale(1,1)'
            if (rightPosition > 3) {
                rightPosition = 0
                jump = false
                imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)+160}px`
                imgBlockPosition = imgBlockPosition - 10
                imgBlock.style.left = `${imgBlockPosition*20}px`
            }
            break
        }
        default : break
    }
    rightPosition = rightPosition + 1
    heroImg.style.left = `-${rightPosition*96}px`
    heroImg.style.top = `-96px`
}

//Обработчики событий

let onTouchStart = (event) => {
    clearInterval(timer)
    x = (event.type === 'mousedown') ? event.screenX : event.touches[0].screenX
    timer = setInterval(()=>{
        if (x > halfWidth) {
            direction = 'right'
            rightHandler()
        } else {
            direction = 'left'
            leftHandler()
        }
    }, 130)
}
let onTouchEnd = (event) => {
    clearInterval(timer)
    lifeCycle()
}

window.onmousedown = onTouchStart
window.ontouchstart = onTouchStart
window.onmouseup = onTouchEnd
window.ontouchend = onTouchEnd

const lifeCycle = () => {
    timer = setInterval(()=>{
        if (hit) {
            hitHandler()
        } else if (jump) {
            jumpHandler()
        } else if (fall) {
            fallHandler()
        } else {
            standHandler()
        }
    }, 150)
}

const createTile = (x, y = 1) => {
    let tile = window.document.createElement('img')

    tile.src = 'img/assets/1 Tiles/Tile_02.png'
    tile.style.position = 'absolute'
    tile.style.left = x*32
    tile.style.bottom = y*32
    canvas.appendChild(tile)

    tileArray.push([x, y])
}

const createTilesPlatform = (startX, startY, length) => {
    for (i = 0; i < length; i++) {
        createTile(startX+i, startY)
    }
}

const addTiles = (i) => {
    createTile(i)
    let tileBlack = window.document.createElement('img')
    tileBlack.src = 'img/assets/1 Tiles/Tile_04.png'
    tileBlack.style.position = 'absolute'
    tileBlack.style.left = i*32
    tileBlack.style.bottom = 0
    canvas.appendChild(tileBlack)
}

class Enemy {
    ATTACK = 'attack'
    DEATH = 'death'
    HURT = 'hurt'
    IDLE = 'idle'
    WALK = 'walk'

    state
    animateWasChanged
    startX
    posX
    posY
    img
    block
    blockSize
    spritePos
    spriteMaxPos
    timer
    dir
    stop

    sourcePath

    constructor(x, y) {
        this.posX = x
        this.startX = this.posX
        this.posY = y
        this.blockSize = 96
        this.spritePos = 0
        this.spriteMaxPos = 3
        this.sourcePath = 'img/assets/Enemies/1/'
        this.dir = 1
        this.stop = false

        this.state = this.IDLE
        this.animateWasChanged = false

        this.createImg()
        this.changeAnimate(this.WALK)
        this.lifeCycle()
    }
    createImg() {
        this.block = window.document.createElement('div')
        this.block.style.position = 'absolute'
        this.block.style.left = this.posX*32
        this.block.style.bottom = this.posY*32
        this.block.style.width = this.blockSize
        this.block.style.height = this.blockSize
        this.block.style.overflow = 'hidden'

        this.img = window.document.createElement('img')
        this.img.src = this.sourcePath + 'Idle.png'
        this.img.style.position = 'absolute'
        this.img.style.left = 0
        this.img.style.bottom = 0
        this.img.style.height = this.blockSize

        this.block.appendChild(this.img)
        canvas.appendChild(this.block)
    }
    lifeCycle() {
        this.timer = setInterval(() => {
            if (this.animateWasChanged) {
                this.animateWasChanged = false
                switch (this.state) {
                    case this.ATTACK: {
                        this.setAttack()
                        break;
                    }
                    case this.DEATH: {
                        this.setDeath()
                        break;
                    }
                    case this.HURT: {
                        this.setHurt()
                        break;
                    }
                    case this.IDLE: {
                        this.setIdle()
                        break;
                    }
                    case this.WALK: {
                        this.setWalk()
                        break;
                    }
                    default: break;
                }
            }
            this.spritePos++
            this.checkCollide()
            if (!this.stop) {
                this.move()
            } else {
                this.changeAnimate(this.ATTACK)
            }
            this.animate()
        }, 150)

    }
    animate() {
        if (this.spritePos > this.spriteMaxPos) {
            this.spritePos = 0
        }
        this.img.style.left = -(this.spritePos * this.blockSize)
    }
    setAttack() {
        this.img.src = this.sourcePath + 'Attack.png'
        this.spriteMaxPos = 5
        this.img.style.width = this.blockSize * (this.spriteMaxPos + 1)
    }
    setDeath() {
        this.img.src = this.sourcePath + 'Death.png'
        this.spriteMaxPos = 5
        this.img.style.width = this.blockSize * (this.spriteMaxPos + 1)
    }
    setHurt() {
        this.img.src = this.sourcePath + 'Hurt.png'
        this.spriteMaxPos = 1
        this.img.style.width = this.blockSize * (this.spriteMaxPos + 1)
    }
    setIdle() {
        this.img.src = this.sourcePath + 'Idle.png'
        this.spriteMaxPos = 3
        this.img.style.width = this.blockSize * (this.spriteMaxPos + 1)
    }
    setWalk() {
        this.img.src = this.sourcePath + 'Walk.png'
        this.spriteMaxPos = 5
        this.img.style.width = this.blockSize * (this.spriteMaxPos + 1)
    }
    changeAnimate(stateStr) {
        this.state = stateStr
        this.animateWasChanged = true
    }
    move() {
        if (this.posX > (this.startX +10)) {
            this.dir *= -1
            this.img.style.transform = "scale(-1, 1)"
        } else if (this.posX < this.startX) {
            this.dir = Math.abs(this.dir)
            this.img.style.transform = "scale(1, 1)"
        }
        this.posX += this.dir
        this.block.style.left = this.posX * 32
    }
    checkCollide(){
        if (heroY == this.posY) {
            if (heroX == this.posX) {
                // left attack
                this.stop = true
            } else if (heroX == (this.posX + 2)) {
                // right attack
                this.stop = true
            } else {
                this.stop = false
                this.changeAnimate(this.WALK)
            }
        } else {
            this.stop = false
            this.changeAnimate(this.WALK)
        }
    }
}

class Heart {
    img
    x
    constructor(x, src) {
        this.x = x
        this.img = window.document.createElement('img')
        this.img.src = src
        this.img.style.position = 'absolute'
        this.img.style.left = this.x * 32
        this.img.style.bottom = ((window.screen.height / 32) - 13)*32
        this.img.style.width = 32
        this.img.style.height = 32

        canvas.appendChild(this.img)
    }
}

class HeartEmpty extends Heart {
    constructor(x) {
        super(x, 'img/assets/Hearts/heart_empty.png')
    }
}

class HeartRed extends Heart {
    constructor(x) {
        super(x, 'img/assets/Hearts/heart_red.png')
    }
}

const addHearts = () => {
    // let heartEmpty = new HeartEmpty(0)
    // let heartRed = new HeartRed(1)
    // maxLives = 6
    // lives = 3

    for (let i = 1; i <= lives; i++) {
        let heartRed = new HeartRed(i)
    }

    for (let i = lives; i <= maxLives; i++) {
        let heartEmpty = new HeartEmpty(i)
    }
}

const start = () => {
    lifeCycle()
    for (let i = 0; i < 100; i++) {
        // if ((i > 10) && (i < 17)) {
        //     continue
        // }
        addTiles(i)

    }
    createTilesPlatform(10, 10, 10)
    createTilesPlatform(15, 5, 10)

    let enemy = new Enemy(10, 2)

    addHearts()
}

start()