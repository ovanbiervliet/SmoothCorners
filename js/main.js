const canvas = document.querySelector('#playground');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;

const halfWidth = canvas.width / 2;
const halfHeight = canvas.height / 2;

var imgOnLoad = false; // Remove image handling
var scaleRatio = 1 / 3;

window.addEventListener("load", drawDefault, true);

function drawDefault() {
    // Removed image loading logic
    imgOnLoad = true; // Set to true since we are not handling images
}

// ################################## Dat GUI ##################################

var isControl = false;

const options = {
    n: 4,
    r: 60,
    percentage: 53,
    smoothness: 50,
    width: 300,
    height: 300,
    round_position_x: 0,
    round_position_y: 0,
    tl: true,
    tr: true,
    bl: true,
    br: true,
    open_figma_smooth: true,
    is_fill: false,
    is_show_point: true // Removed is_img option
};

const gui = new dat.GUI({ autoPlace: true, width: 300 });
gui.close();

const guiControls = [
    gui.add(options, 'open_figma_smooth').name("Figma Squircles"),
    gui.add(options, 'percentage', 0, 100).step(.01).name("Percentage"),
    gui.add(options, 'smoothness', 0, 100).step(1).name("Smoothness"),
    gui.add(options, 'is_show_point').name("Show Point"),
    gui.add(options, 'tl').name("Top-Left"),
    gui.add(options, 'tr').name("Top-Right"),
    gui.add(options, 'bl').name("Bottom-Left"),
    gui.add(options, 'br').name("Bottom-Right"),
    gui.add(options, 'is_fill').name("Fill"),
    gui.add(options, 'width', 0, 1080).step(.1).name("Width(px)"),
    gui.add(options, 'height', 0, 1080).step(.1).name("Height(px)"),
    gui.add(options, 'round_position_x', -1200, 1200).step(.1).name("PosX(px)"),
    gui.add(options, 'round_position_y', -1200, 1200).step(.1).name("PosY(px)")
];

// Loop through the controls to add event listeners
guiControls.forEach(control => {
    control.onChange(function (value) {
        isControl = true;
        rendering();
    });

    control.onFinishChange(function (value) {
        isControl = false;
    });
});

// ################################## Rendering ##################################

const rendering = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (options.open_figma_smooth) {
        if (options.percentage == 100 || options.smoothness == 0) {
            drawRoundCorners(ctx,
                { width: options.width / scaleRatio, height: options.height / scaleRatio },
                options.percentage / 100 * Math.min(options.width / 2, options.height / 2) / scaleRatio,
                halfWidth + options.round_position_x / scaleRatio,
                halfHeight + options.round_position_y / scaleRatio,
                options.tl, options.tr, options.bl, options.br,
                options.is_fill);
        } else {
            drawFigmaSmoothCorners(ctx,
                { width: options.width / scaleRatio, height: options.height / scaleRatio },
                options.percentage / 100 * Math.min(options.width / 2, options.height / 2) / scaleRatio, // real radius
                options.smoothness, // smoothness
                halfWidth + options.round_position_x / scaleRatio, // posX
                halfHeight + options.round_position_y / scaleRatio, // posY
                options.tl, options.tr, options.bl, options.br,
                options.is_fill);
        }

        if (options.is_show_point) {
            drawFigmaSmoothCornersPoint(ctx,
                { width: options.width / scaleRatio, height: options.height / scaleRatio },
                options.percentage / 100 * Math.min(options.width / 2, options.height / 2) / scaleRatio, // real radius
                options.smoothness, // smoothness
                halfWidth + options.round_position_x / scaleRatio, // posX
                halfHeight + options.round_position_y / scaleRatio, // posY
                options.tl, options.tr, options.bl, options.br);
        }

        var realRadius = options.percentage / 100 * Math.min(options.width / 2, options.height / 2) / scaleRatio;
        ctx.font = "48px PingFang serif";

        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.beginPath();
        ctx.fillText("Round Radius - " + Math.round(realRadius / 3).toString(), 200, 200);
        ctx.fillText("Corner Smoothing - " + options.smoothness.toString(), 200, 300);
        ctx.closePath();
        ctx.fill();
    }
}

rendering();
