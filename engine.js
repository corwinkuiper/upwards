//Javascript Game Helpers

const __GInternals = {};

(function () {

    let __OldTime;
    if (typeof (init) != "undefined") init();
    function step(NewTime) {
        let deltaTime = (NewTime - __OldTime) / 1000;
        if (!__OldTime) deltaTime = 0;
        __OldTime = NewTime;
        if (typeof (update) != "undefined") update(deltaTime);
        ctx.clearRect(0, 0, width, height);
        if (typeof (draw) != "undefined") draw();
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);


    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    ctx.canvas.addEventListener('mousemove', function (evt) {
        __GInternals.mousePos = getMousePos(ctx.canvas, evt);
    }, false);


    __GInternals.KeysDown = [];
    window.onkeyup = function (e) {
        __GInternals.KeysDown[e.keyCode] = {};
        __GInternals.KeysDown[e.keyCode].down = false;
        const d = new Date();
        __GInternals.KeysDown[e.keyCode].time = d.getTime()

    }
    window.onkeydown = function (e) {
        __GInternals.KeysDown[e.keyCode] = {};
        __GInternals.KeysDown[e.keyCode].down = true;
        const d = new Date();
        __GInternals.KeysDown[e.keyCode].time = d.getTime()
    }

    __GInternals.mouse = { click: false, time: 0 }
    window.onpointerdown = function (e) {
        __GInternals.mouse.click = true
        __GInternals.mouse.time = milliseconds()
    }
    window.onpointerup = function (e) {
        __GInternals.mouse.click = false
        __GInternals.mouse.time = milliseconds()
    }
    window.ontouchstart = function (e) {
        __GInternals.mouse.click = true
        __GInternals.mouse.time = milliseconds()
    }
    window.ontouchend = function (e) {
        __GInternals.mouse.click = true
        __GInternals.mouse.time = milliseconds()
    }

    __GInternals.batch = false
})();

function getMouseX() {
    return __GInternals.mousePos.x
}
function getMouseY() {
    return __GInternals.mousePos.y
}
function mouseClick() {
    return __GInternals.mouse.click
}
function mouseTime() {
    return __GInternals.mouse.time
}


function keyDown(key) {
    if (__GInternals.KeysDown[key])
        return __GInternals.KeysDown[key].down
    return false
}
function keyTime(key) {
    if (__GInternals.KeysDown[key])
        return __GInternals.KeysDown[key].time
    return 0
}

function drawBatchStart() {
    __GInternals.batch = true
    ctx.beginPath()
}
function drawBatchEnd() {
    __GInternals.batch = false
    ctx.fill()
}

function drawCircle(x, y, r, c) {

    if (!__GInternals.batch)
        ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = c || "blue"
    if (!__GInternals.batch)
        ctx.fill()

}

function drawRectangle(x, y, w, h, c, a, n) {

    if (!__GInternals.batch)
        ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.fillStyle = c || "blue"
    ctx.globalAlpha = a || 1
    if (!__GInternals.batch)
        ctx.fill()


}

function milliseconds() {
    const d = new Date()
    return d.getTime()
}