let G = {}

const ctx = document.getElementById("GameCanvas").getContext("2d")

const initialGameWidth = 480

let height = 480
let width = initialGameWidth

const initialBlockWidth = width / 8
const blockHeight = height / 8

const leftBoundary = - initialBlockWidth * 2
const rightBoundary = + initialBlockWidth * 2

function onResize() {
    console.log("Running Resize")
    const browserWidth = screen.width;
    if (initialGameWidth > browserWidth) {
        width = browserWidth;
        height = window.innerHeight || document.body.clientHeight;
        const canvas = document.getElementById("GameCanvas");
        canvas.width = width;
        canvas.height = height;
    }
}

onResize();
window.addEventListener("resize", onResize);

function init() {
    G = {}

    G.Blocks = []

    for (var i = 0; i < 10; i++) {
        var b = {}
        b.x = -initialBlockWidth / 2
        b.y = - blockHeight * i
        b.width = initialBlockWidth
        G.Blocks.push(b)
    }

    G.Bits = []

    G.Score = 0
    G.CurrentBlock = {}
    G.CurrentBlock.x = leftBoundary
    G.CurrentBlock.width = initialBlockWidth
    G.CurrentBlock.Direction = 1

    G.Restart = false

    G.Camera = {}
    G.Camera.Offset = G.Blocks[G.Blocks.length - 1].y;
    G.Camera.New = 0

    G.Buttons = {}
    G.Buttons.SpacePressed = true

    G.Time = milliseconds()
}


function restart() {

    console.log("Game Restarting")
    init()

}


function isSpace() {
    if (keyDown(32))
        return keyTime(32)
    else if (mouseClick())
        return mouseTime()
}

function update(dt) {

    const cb = G.CurrentBlock

    let delta = dt

    if (isSpace() && !G.Buttons.SpacePressed) {
        delta = (isSpace() - G.Time) / 1000
    }

    G.Time = milliseconds()

    const bitLength = G.Bits.length
    let bitRemove = 0
    for (var i = 0; i < bitLength; i++) {
        var b = G.Bits[i]
        b.x += b.xSpeed
        b.ySpeed += 200 * dt
        b.y += b.ySpeed * dt
        if (b.y > - G.Camera.Offset)
            bitRemove = i + 1
    }
    G.Bits.splice(0, bitRemove)

    if (G.Restart) {
        if (G.Bits.length == 0) {
            restart()
        }
        if (isSpace() && !G.Buttons.SpacePressed) {
            G.Buttons.SpacePressed = true
            restart()
        } else if (!isSpace()) {
            G.Buttons.SpacePressed = false
        }
        return
    }

    cb.x += cb.Direction * Math.pow(G.Score + 2, 2) * delta * Math.max(1, 10 - 2 * G.Score)

    if ((cb.x + cb.width / 2) <= leftBoundary) {
        cb.Direction = 1
        if (cb.x + cb.width / 2 <= leftBoundary * 2) {
            cb.x = leftBoundary - cb.width / 2
        }
    } else if ((cb.x + cb.width / 2) >= rightBoundary) {
        cb.Direction = -1
        if (cb.x + cb.width / 2 >= rightBoundary * 2) {
            cb.x = rightBoundary - cb.width / 2
        }
    }


    if (isSpace() && !G.Buttons.SpacePressed) {
        //Time to place the block
        G.Buttons.SpacePressed = true
        const last = G.Blocks[G.Blocks.length - 1]
        const newBlock = {}
        const cb = G.CurrentBlock

        if (Math.floor(cb.x) < Math.floor(last.x)) {
            const bit = {}

            bit.x = cb.x
            bit.width = Math.min(last.x - cb.x, cb.width)
            bit.y = last.y - blockHeight
            bit.xSpeed = -1
            bit.ySpeed = 0

            G.Bits.push(bit)
        }

        if (Math.floor(cb.x + cb.width) > Math.floor(last.x + last.width)) {
            const bit = {}

            bit.x = Math.max(last.x + last.width, cb.x)
            bit.width = Math.min((cb.x + cb.width) - (last.x + last.width), cb.width)
            bit.y = last.y - blockHeight
            bit.xSpeed = 1
            bit.ySpeed = 0

            G.Bits.push(bit)
        }

        //Check if they placed the block right
        //Check if the left is *outside* range
        //Check if right is outside range

        if ((cb.x - last.x) > last.width || (cb.x + cb.width - last.x) < 0) {
            G.Restart = true;
        } else {
            newBlock.x = Math.floor(Math.max(cb.x, last.x))
            newBlock.y = Math.floor(last.y - blockHeight)
            newBlock.width = Math.ceil(Math.min((last.x + last.width) - cb.x, cb.x - last.x + last.width))

            G.Blocks.push(newBlock)

            G.CurrentBlock.x = leftBoundary
            G.CurrentBlock.width = newBlock.width
            G.Score++
        }

    }
    if (!isSpace()) {
        G.Buttons.SpacePressed = false
    }

    G.Camera.Offset += Math.floor((Math.min(G.Blocks[G.Blocks.length - 1].y, 0) - G.Camera.Offset) * 0.1)


}

function draw() {

    drawNumber(G.Score, 0, 0, width, height, "#b2b2b2", 1)

    const blocksLength = G.Blocks.length

    drawBatchStart()
    for (let i = 0; i < blocksLength; i++) {
        const b = G.Blocks[i]
        drawRectangle(b.x + width / 2, b.y - G.Camera.Offset + height / 2, b.width, blockHeight, "black")
    }
    drawBatchEnd()

    drawBatchStart()
    const bitLength = G.Bits.length
    for (let i = 0; i < bitLength; i++) {
        const b = G.Bits[i]
        drawRectangle(b.x + width / 2, b.y - G.Camera.Offset + height / 2, b.width, blockHeight)
    }
    drawBatchEnd()

    if (!G.Restart) {
        const cb = G.CurrentBlock
        drawRectangle(cb.x + width / 2, G.Blocks[blocksLength - 1].y - blockHeight - G.Camera.Offset + height / 2, cb.width, blockHeight)
    }
}