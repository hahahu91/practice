var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
canvas.setAttribute("height", CANVAS_HEIGHT);
canvas.setAttribute("width", CANVAS_WIDTH);
ctx.font = '10px Arial';

const ANIMATION_DURATION = 1000;
const DX = 100;
const DY = 100;
const ANIMATE_DY = 200;
const ITEM_WIDTH = 200;
const ITEM_HEIGHT = 200;
const COLORS =["red", "blue", "green", "darkgrey", "brown", "grey", "yellow", "pink"];
var model = {
    addItem: function(val) {
        this.items.push({
            id: "item" + this.items.length,
            value: val,
            active: false,
            color: COLORS[this.items.length%COLORS.length],
        });
        model.total += val;
    },
    items: [],
    total: 0,
    start: (Math.PI*3)/2,
    oldStart: (Math.PI*3)/2,
    isRecalculation: false,
    prevCur: 0,
    degCur: 0,
    curent: (Math.PI*3)/2,
}
animate();
model.addItem(10);
model.addItem(30);
model.addItem(50);
model.addItem(60);
model.addItem(100);
model.addItem(100);
model.addItem(100);
model.addItem(100);
model.addItem(100);

function getItemRect(item, model) {
    let radiant = (Math.PI * 2) * (item.value / model.total)
    return {
        rad: radiant,
        cx: CANVAS_WIDTH / 2 + CANVAS_HEIGHT / 2.8*Math.cos((model.start + model.start + radiant)/2),
        cy: CANVAS_WIDTH / 2 + CANVAS_HEIGHT / 2.8*Math.sin((model.start + model.start + radiant)/2),
        x: !item.active ? CANVAS_WIDTH / 2 : CANVAS_WIDTH / 2 + 20,
        y: !item.active ? CANVAS_HEIGHT / 2 : CANVAS_HEIGHT / 2 + 20,
    };
}
function  drawOneElem(ctx, objData, model, index) {
    const itemRect = getItemRect(objData, model);
    (index == model.items.length-1 && index%COLORS.length == 0) ? ctx.fillStyle = COLORS[1] :ctx.fillStyle = objData.color;
    ctx.beginPath();
        ctx.arc(itemRect.x, itemRect.y, CANVAS_HEIGHT / 3, model.start, model.start+itemRect.rad, false);
        ctx.lineTo(itemRect.x, itemRect.y);
    ctx.fill();
    const text = Math.round(objData.value / model.total*100) + '%';
    writeProcents(text, itemRect.cx, itemRect.cy);
    //добавляем в модель данные
        //objData.start = model.start;
       // objData.proc = text;
    //
    model.start += itemRect.rad;
    model.start = model.start%(Math.PI*2);
}

function printChart(ctx, model){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        model.items.forEach((item, index) => {
        drawOneElem(ctx, item, model, index);
    });
}
printChart(ctx, model);

function writeProcents(text, x, y){
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
}

canvas.addEventListener("mousedown", startRecalculation, false);
document.addEventListener("mouseup", stopRecalculation, false);
document.addEventListener("mousemove", recalculation, false);

function startRecalculation(event) {
    model.isRecalculation = true;
    let mousePos = mousecoordinates(canvas, event);
    model.degCur = inDeg(model.curent);
    model.curent = inRad(mousePos.deg);
    model.oldStart = model.start%(Math.PI*2);
    let requestId = window.requestAnimationFrame(animate);
    console.log('x', mousePos.x);
    console.log('y', mousePos.y);
    console.log('deg', mousePos.deg);
}

function recalculation(event) {
    if (model.isRecalculation == true)
    {
        let mousePos = mousecoordinates(canvas, event);
        model.degCur = inDeg(model.curent);
        let cur = mousePos.deg - model.degCur;
        if (cur < 0) {cur += 360};
        model.start = model.oldStart + inRad(cur);
    }
}

function animate() {
    if (model.prevCur != model.degCur) {
        printChart(ctx, model);
    };
    requestAnimationFrame(animate);
}


function stopRecalculation() {
    model.isRecalculation = false;
    model.prevCur = model.degCur;
}

function arctg360(xs, ys) {
    var temp;
    if (ys >= 0 && xs >= 0) {
        temp = Math.atan(ys/xs)* 180 / Math.PI
    }
    else if (ys >= 0 && xs < 0 || ys < 0 && xs < 0) {
        temp = 180 + Math.atan(ys/xs)* 180 / Math.PI
    }
    else {
        temp = 360 + Math.atan(ys/xs)* 180 / Math.PI
    };
    return temp;
} 

function mousecoordinates(canvas, event){
    let tempX = event.pageX - canvas.offsetLeft;
    let tempY = event.pageY - canvas.offsetTop;
    let x = tempX - CANVAS_WIDTH/2;
    let y = tempY - CANVAS_HEIGHT/2;
    return {
        deg: arctg360(x, y),
        x: x,
        y: y,
    }
}


function initHandlers(canvasEl, model) {
    canvasEl.addEventListener("click", (event) => {
        let mousePos = mousecoordinates(canvasEl, event);
        model.items.forEach((item, index) => {
            const rect = getItemRect(item, model);
            if (mousePos.x >= rect.x && mousePos.x <= rect.x+rect.width && 
               mousePos.y >= rect.y && mousePos.y <= rect.y+rect.height)
                {
                    processElementClick(model.items, item);
                    console.log('!');
                }
        });
    }, false);
}
initHandlers(canvas, model);

function processElementClick(items, clickedItem) {
    items.forEach((item) => {
        if (item == clickedItem) {
            activate(item, !item.active);
        }
        else if (item.active) {
            activate(item, false);
        }
    });
}


function inRad(degrees){
    return degrees*Math.PI/180;
}

function inDeg(radians){
    return radians*180/Math.PI;
}

function getMousePos(canvas, even) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: even.clientX - rect.left,
        y: even.clientY - rect.top
    };
}
