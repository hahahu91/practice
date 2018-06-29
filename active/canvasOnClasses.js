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
class Item {
    constructor(value, color, index) {
        this.id = "Item" + index;
        this.index = index;
        this.value = value;
        this._isActive = false;
        this._color = color;
        this._animation = null;
        this.start = null;
        model.total += value;
    }
    setColor(c) {
        this._color = c;
    }
    getColor() {
        return this._color;
    }
    draw(canvasContext, rotationDegree, totalValue) {
        const itemRect = getItemRect(this, rotationDegree, totalValue);
        canvasContext.fillStyle = this._color;
       // console.log(this);
        canvasContext.beginPath();
            canvasContext.arc(itemRect.x, itemRect.y, CANVAS_HEIGHT / 3, rotationDegree, rotationDegree+itemRect.rad, false);
            canvasContext.lineTo(itemRect.x, itemRect.y);
        canvasContext.fill();
        const text = Math.round(this.value /totalValue*100) + '%';
        writeProcents(canvasContext, text, itemRect.cx, itemRect.cy);
        rotationDegree += itemRect.rad;
        rotationDegree = rotationDegree%(Math.PI*2);
    }

    animation() {
        return this._animation;
    }

    activate() {
        this._isActive = true;
        this._animation = createAnimation();
    }

    deactivate() {
        this._isActive = false;
        this._animation = createAnimation();
    }
}

class PieChart {

    constructor() {
        this._items = [];
        this._colors = ["red", "blue", "green"];//, "darkgrey", "brown", "grey", "yellow", "pink"];
        this._rotationDegree = (Math.PI*3)/2;
        this.total = 0;
        this.isRecalculation = false;
    }

    addItem(value) {
        this._items.push(new Item(value, this._colors[this._items.length%this._colors.length], this._items.length));
        this.total += value;
    }
    
    rotateAt(degree) {
        this._rotationDegree = degree;
    }

    draw(canvasContext) {
        canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this._items.forEach((items, index) => {
            const itemRect = getItemRect(items, this._rotationDegree, this.total);
            let color = items.getColor();
            if (color == this._colors[0] && index == this._items.length-1) { 
                items.setColor(this._colors[1]);
            }
            items.draw(canvasContext, this._rotationDegree, this.total);
            this._rotationDegree += itemRect.rad;
            this._rotationDegree = this._rotationDegree%(Math.PI*2);
        });
    }
}
const pieChart = new PieChart();
pieChart.addItem(120);
pieChart.addItem(110);
pieChart.addItem(20);
pieChart.addItem(101);
pieChart.addItem(120);
pieChart.addItem(180);

pieChart.addItem(180);
pieChart.draw(ctx);

//animate();

function getItemRect(item, start, total) {
    let radiant = (Math.PI * 2) * (item.value / total);
    return {
        rad: radiant,
        cx: CANVAS_WIDTH / 2 + (CANVAS_HEIGHT / 2.8 + item._animation)*Math.cos((start + start + radiant)/2),
        cy: CANVAS_WIDTH / 2 + (CANVAS_HEIGHT / 2.8 + item._animation)*Math.sin((start + start + radiant)/2),
        x: CANVAS_WIDTH / 2 + item._animation*Math.cos((start + start + radiant)/2),
        y: CANVAS_WIDTH / 2 + item._animation*Math.sin((start + start + radiant)/2),
    };
}

function writeProcents(ctx, text, x, y){
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
    pieChart.isRecalculation = true;
    let mousePos = mousecoordinates(canvas, event);
    //pieChart.rotateAt = 
    model.degCur = inDeg(model.curent);
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
    if (pieChart.isRecalculation == true) {
        let mousePos = mousecoordinates(canvas, event);
        
        model.degCur = inDeg(model.curent);
        let cur = mousePos.deg - model.degCur;
        if (cur < 0) {cur += 360};
        model.start = model.oldStart + inRad(cur);
    }
}

//printChart(ctx, model);
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
            
            pieChart.draw(ctx);
            //printChart(ctx, model);
            let time = performance.now();
        }
        else item.duration = 0;
    });
    if (model.prevCur != model.degCur) pieChart.draw(ctx);
    requestAnimationFrame(animate);
}
animate();

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

