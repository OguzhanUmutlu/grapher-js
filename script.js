const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const fpsDiv = document.querySelector(".fps");

const formulas = [];
const cache = new Map();
const factorial = n => {
    if (n < 0) return NaN;
    if (Math.floor(n) === 0) return 1;
    return factorial(n - 1) * n;
}

let scale = 1;
const translate = [innerWidth / 2, innerHeight / 2];

let _fps = [];

const fixNumber = n => Math.round(n * 100) / 100;

const animate = () => {
    _fps.push(Date.now());
    _fps = _fps.filter(i => i + 1000 > Date.now());
    fpsDiv.innerHTML = `FPS: ${_fps.length}`;
    canvas.width = innerWidth - canvas.getBoundingClientRect().left;
    canvas.height = innerHeight;
    ctx.save();
    ctx.translate(translate[0], translate[1]);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#5656e3";
    ctx.fillRect(-1, -translate[1] / scale, 2 / scale, canvas.height / scale);
    ctx.fillStyle = "#f55d5d";
    ctx.fillRect(-translate[0] / scale, -1, canvas.width / scale, 2 / scale);
    ctx.lineCap = "round";
    ctx.lineWidth = 1 / scale;
    ctx.strokeStyle = "white";
    formulas.forEach(f => {
        ctx.beginPath();
        const minX = -translate[0] / scale;
        const maxX = (canvas.width - translate[0]) / scale;
        for (let x = minX; x < maxX; x += 0.1) {
            if (!cache.has(f)) cache.set(f, {});
            const k = cache.get(f);
            k[x] = k[x] || f(x);
            const y = k[x];
            if (!isNaN(y)) ctx[x === minX ? "moveTo" : "lineTo"](x, -y);
        }
        ctx.stroke();
        ctx.closePath();
    });
    ctx.restore();
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    for (let x = 0; x <= canvas.width; x += 60) ctx.fillText(fixNumber((x - translate[0]) / scale) + "", x, translate[1]);
    for (let y = 0; y <= canvas.height; y += 60) ctx.fillText(fixNumber(-(y - translate[1]) / scale) + "", translate[0], y);
    requestAnimationFrame(animate);
};
animate();

let mouseDown = false;
addEventListener("mousedown", () => mouseDown = true);
addEventListener("mousemove", ev => {
    if (!mouseDown) return;
    translate[0] += ev.movementX;
    translate[1] += ev.movementY;
});
addEventListener("mouseup", () => mouseDown = false);
addEventListener("blur", () => mouseDown = false);
addEventListener("wheel", ev => {
    const delta = -ev.deltaY / 1000;
    scale += delta;
    if (scale <= 0.1) return scale = 0.1;
    translate[0] -= delta * (ev.offsetX - canvas.width / 2);
    translate[1] -= delta * (ev.offsetY - canvas.height / 2);
});
addEventListener("contextmenu", ev => ev.preventDefault());