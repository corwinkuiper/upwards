const N = [];
N[0] = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1]
];

N[1] = [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1]
];

N[2] = [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1]
];

N[3] = [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
];

N[4] = [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1]
];

N[5] = [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
];

N[6] = [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
];

N[7] = [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1]
];

N[8] = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
];

N[9] = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
];

function drawNumber(n, x, y, w, h, c, a) {
    const digits = n.toString(10).split("").map(function (t) { return parseInt(t) });
    const len = digits.length;
    const blockWidth = (w / (len * 4 - 1));
    const blockHeight = (h / 5);

    drawBatchStart();
    for (let digit = 0; digit < len; digit++) {
        for (let xSegment = 0; xSegment < 3; xSegment++) {
            for (let ySegment = 0; ySegment < 5; ySegment++) {
                if (N[digits[digit]][ySegment][xSegment] == 1) {
                    drawRectangle(Math.floor(x + xSegment * blockWidth + digit * 4 * blockWidth), Math.floor(y + ySegment * blockHeight), Math.ceil(blockWidth), Math.ceil(blockHeight), c, a);
                }
            }
        }
    }
    drawBatchEnd();
}