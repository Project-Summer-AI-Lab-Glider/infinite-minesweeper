let mode = 1;

function setup() {
    const canvas = createCanvas(400, 400);
    canvas.parent('canvas');
    rectMode(CENTER);
}

function draw() {
    if (mouseIsPressed) {
        if (mode === 1) {
            drawDiamond(mouseX, mouseY, 50, 36);
            fill('blue');
        } else {
            translate(mouseX, mouseY);
            rotate(PI / 8);
            drawDiamond(0, 0, 50, 72);
            fill('green');
        }
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        mode = 1;
    } else if (keyCode === RIGHT_ARROW) {
        mode = 2;
    }
}

function drawDiamond(x, y, size, angle) {
    // d is equal to the half of the diagonal
    const d1 = size * Math.sin(angle * 0.5);
    const d2 = size * Math.cos(angle * 0.5);
    quad(x, y - d1, x + d2, y, x, y + d1, x - d2, y)
}
