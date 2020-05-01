let G = {}

const ctx = document.getElementById("GameCanvas").getContext("2d")
const height = 480
const width = 480

const fps = 60

const initialWidth = width / 8

const blockHeight = height / 8
function init() {
    G = {}

    G.Blocks = []

    for (var i = 0; i < 3; i++) {

        var b = {}
        b.x = width / 2 - initialWidth / 2
        b.y = height - (height / 8) * i
        b.width = initialWidth
        G.Blocks.push(b)
    }

    G.Bits = []

    G.Score = 0
    G.CurrentBlock = {}
    G.CurrentBlock.x = width / 4
    G.CurrentBlock.width = initialWidth
    G.CurrentBlock.Direction = 1

    G.Camera = {}
    G.Camera.Offset = 0
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

    cb.x += cb.Direction * Math.pow(G.Score + 2, 2) * delta * Math.max(1, 10 - 2 * G.Score)

    if ((cb.x + cb.width / 2) < width / 4)
        cb.Direction = 1
    else if ((cb.x + cb.width / 2) > width * 3 / 4)
        cb.Direction = -1

    const bitLength = G.Bits.length
    let bitRemove = 0
    for (var i = 0; i < bitLength; i++) {
        var b = G.Bits[i]
        b.x += b.xSpeed
        b.ySpeed += 100 * dt
        b.y += b.ySpeed * dt
        if (b.y > height - G.Camera.Offset)
            bitRemove = i
    }
    G.Bits.splice(0, bitRemove)

    if (isSpace() && !G.Buttons.SpacePressed) {
        //Time to place the block
        G.Buttons.SpacePressed = true
        const last = G.Blocks[G.Blocks.length - 1]
        const newBlock = {}
        const cb = G.CurrentBlock

        //Check if they placed the block right
        //Check if the left is *outside* range
        //Check if right is outside range

        if ((cb.x - last.x) > last.width || (cb.x + cb.width - last.x) < 0) {
            restart()
            return
        }


        if (Math.floor(cb.x) < Math.floor(last.x)) {
            const bit = {}

            bit.x = cb.x
            bit.width = last.x - cb.x
            bit.y = last.y - blockHeight
            bit.xSpeed = -1
            bit.ySpeed = 0

            G.Bits.push(bit)
        }

        if (Math.floor(cb.x + cb.width) > Math.floor(last.x + last.width)) {
            const bit = {}

            bit.x = last.x + last.width
            bit.width = (cb.x + cb.width) - (last.x + last.width)
            bit.y = last.y - blockHeight
            bit.xSpeed = 1
            bit.ySpeed = 0

            G.Bits.push(bit)
        }


        newBlock.x = Math.floor(Math.max(cb.x, last.x))
        newBlock.y = Math.floor(last.y - blockHeight)
        newBlock.width = Math.ceil(Math.min((last.x + last.width) - cb.x, cb.x - last.x + last.width))

        G.Blocks.push(newBlock)

        G.CurrentBlock.x = width / 4
        G.CurrentBlock.width = newBlock.width

        G.Score++

        return

    }
    if (!isSpace()) {
        G.Buttons.SpacePressed = false
    }

    G.Camera.Offset += Math.floor((Math.min(G.Blocks[G.Blocks.length - 1].y - height / 2, 0) - G.Camera.Offset) * 0.1)


}

function draw() {

    drawNumber(G.Score, 0, 0, width, height, "black", 0.3)

    const blocksLength = G.Blocks.length

    drawBatchStart()
    for (let i = 0; i < blocksLength; i++) {
        const b = G.Blocks[i]
        drawRectangle(b.x, b.y - G.Camera.Offset, b.width, blockHeight, "black")
    }
    drawBatchEnd()

    drawBatchStart()
    const bitLength = G.Bits.length
    for (let i = 0; i < bitLength; i++) {
        const b = G.Bits[i]
        drawRectangle(b.x, b.y - G.Camera.Offset, b.width, blockHeight)
    }
    drawBatchEnd()

    const cb = G.CurrentBlock
    drawRectangle(cb.x, G.Blocks[blocksLength - 1].y - blockHeight - G.Camera.Offset, cb.width, blockHeight)
}