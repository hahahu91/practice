var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
canvas.setAttribute("height", CANVAS_HEIGHT);
canvas.setAttribute("width", CANVAS_WIDTH);
ctx.font = '10px Arial';

const ANIMATION_DURATION = 1000;
const ANIMATE_DY = CANVAS_HEIGHT/9;
const COLORS =["red", "blue", "green", "darkgrey", "brown", "grey", "yellow", "pink"];
var model = {
    addItem: function(val) {
        this.items.push({
            id: "item" + this.items.length,
            value: val,
            dY: 0,
            active: false,
            start: 0,
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
    let radiant = (Math.PI * 2) * (item.value / model.total);
    return {
        rad: radiant,
        cx: CANVAS_WIDTH / 2 + (CANVAS_HEIGHT / 2.8 + item.dY)*Math.cos((model.start + model.start + radiant)/2),
        cy: CANVAS_WIDTH / 2 + (CANVAS_HEIGHT / 2.8 + item.dY)*Math.sin((model.start + model.start + radiant)/2),
        x: CANVAS_WIDTH / 2 + item.dY*Math.cos((item.start + item.start + radiant)/2),
        y: CANVAS_WIDTH / 2 + item.dY*Math.sin((item.start + item.start + radiant)/2),
    };
}
function  drawOneElem(ctx, objData, model, index) {
    const itemRect = getItemRect(objData, model);
    (index == model.items.length-1 && index%COLORS.length == 0) ? ctx.fillStyle = COLORS[1] :ctx.fillStyle = objData.color;
    objData.start = model.start;
    objData.rect = itemRect;
    ctx.beginPath();
        ctx.arc(itemRect.x, itemRect.y, CANVAS_HEIGHT / 3, model.start, model.start+itemRect.rad, false);
        ctx.lineTo(itemRect.x, itemRect.y);
    ctx.fill();
    const text = Math.round(objData.value / model.total*100) + '%';
    writeProcents(text, itemRect.cx, itemRect.cy);
    //добавляем в модель данные
    model.start += itemRect.rad;
    model.start = model.start%(Math.PI*2);
    //добавляем в модель данные
        objData.finish = model.start;
    //console.log(model);
}

function printChart(ctx, model){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        model.items.forEach((item, index) => {
        drawOneElem(ctx, item, model, index);
    });
}


function writeProcents(text, x, y){
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
}

canvas.addEventListener("mousedown", startRecalculation, false);
//canvas.addEventListener("click", activateElement, false);
document.addEventListener("mouseup", stopRecalculation, false);
document.addEventListener("mousemove", recalculation, false);

function startRecalculation(event) {
    model.isRecalculation = true;
    let mousePos = mousecoordinates(canvas, event);
    //model.degCur = inDeg(model.curent);
    model.curent = inRad(mousePos.deg);
    model.oldStart = model.start%(Math.PI*2);
    //let requestId = window.requestAnimationFrame(animate);
}

function activateElement(event) {
    let mousePos = mousecoordinates(canvas, event);
    let hypo = Math.sqrt(mousePos.x*mousePos.x+mousePos.y*mousePos.y);
    if (hypo <= (CANVAS_HEIGHT / 3 + CANVAS_HEIGHT / 9)) {
        activateEl(model, inRad(mousePos.deg), hypo, mousePos);
    }
    //let requestId = window.requestAnimationFrame(animate);
}
function activElementCheck(item, model, mousePos) {
    const rect = getItemRect(item, model);
    const activeX = mousePos.x-rect.x+CANVAS_WIDTH/2;
    const activeY = mousePos.y-rect.y+CANVAS_HEIGHT/2;
    const hypo = Math.sqrt(activeX*activeX+activeY*activeY);
    const Deg = inRad(arctg360(activeX, activeY));
    if (Deg >= item.start && Deg < item.finish && hypo <= CANVAS_HEIGHT/3) {
        processElementClick(model.items, item);
    }
    else if (item.start > item.finish) {
        if ((Deg >= item.start || Deg < item.finish)&&hypo <= CANVAS_HEIGHT/3)
            processElementClick(model.items, item);
    }
}

function activateEl(modelEl, deg, hypotenuse, mousePos){
    modelEl.items.forEach((item) => {
        if (deg >= item.start && deg < item.finish ) {
                if (item.active)
                    activElementCheck(item, model, mousePos);
                else if (hypotenuse <= CANVAS_HEIGHT / 3)
                    processElementClick(model.items, item);
            }
        else if (item.start > item.finish) {
            if (deg >= item.start || deg < item.finish) {
                if (item.active)
                    activElementCheck(item, model, mousePos);
                else if (hypotenuse <= CANVAS_HEIGHT / 3)
                    processElementClick(model.items, item);
            }
        }
    });
}

function recalculation(event) {
    if (model.isRecalculation == true) {
        let mousePos = mousecoordinates(canvas, event);
        //model.degCur = inDeg(model.curent);
//        let cur = mousePos.deg - model.degCur;
         let cur = mousePos.deg - inDeg(model.curent);
        if (cur < 0) {cur += 360};
        model.start = model.oldStart + inRad(cur);
    }
}

printChart(ctx, model);
function animate() {
    let start = performance.now();
    model.items.forEach((item, index) => {
        if (item.duration > 0) {
            let timeFraction = (start - item.activeTime ) / ANIMATION_DURATION;
            if (timeFraction > 1) timeFraction = 1;
            item.duration = ANIMATION_DURATION * (1 - item.baseProgress)-timeFraction*ANIMATION_DURATION;
            const progress = timeFraction*ANIMATION_DURATION/ANIMATION_DURATION + item.baseProgress;
            const prog = (ANIMATION_DURATION-item.duration)/(ANIMATION_DURATION * (1-item.baseProgress));
            item.dY = item.active 
                ? 0 + progress * ANIMATE_DY
                : ANIMATE_DY - progress * ANIMATE_DY;
            printChart(ctx, model);
            let time = performance.now();
        }
        else item.duration = 0;
    });
    if (model.start != model.oldStart) printChart(ctx, model);
    requestAnimationFrame(animate);
}
animate();

function stopRecalculation(even) {
    model.isRecalculation = false;
    if (model.start == model.oldStart) activateElement(even);
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


/*
function initHandlers(canvasEl, model) {
    canvasEl.addEventListener("click", (event) => {
        let mousePos = mousecoordinates(canvasEl, event);
        model.items.forEach((item, index) => {
            const rect = getItemRect(item, model);
            if (mousePos.x >= rect.x && mousePos.x <= rect.x+rect.width && 
               mousePos.y >= rect.y && mousePos.y <= rect.y+rect.height)
                {
                    let rect = getItemRect(item, model);
                    processElementClick(model.items, item);
                    console.log('atan' , rect.atan);
                    
                }
        });
    }, false);
}
//initHandlers(canvas, model);
*/

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
function activate(item, isActive){
    item.baseProgress = item.active ? (1 - item.dY / ANIMATE_DY) : (item.dY / ANIMATE_DY);
    item.active = isActive;
    item.duration = ANIMATION_DURATION * (1 - item.baseProgress);
    item.activeTime = performance.now();
}


function inRad(degrees){
    return degrees*Math.PI/180;
}

function inDeg(radians){
    return radians*180/Math.PI;
}

