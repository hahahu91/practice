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

class Item {
    constructor(value, color, index) {
        this.id = "Item" + index;
        this.index = index;
        this.value = value;
        this._isActive = false;
        this._color = color;
        this._animation = null;
        this.start = null;
        this.finish = null;
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
        canvasContext.beginPath();
            canvasContext.arc(itemRect.x, itemRect.y, CANVAS_HEIGHT / 3, rotationDegree, rotationDegree+itemRect.rad, false);
            canvasContext.lineTo(itemRect.x, itemRect.y);
        canvasContext.fill();
        const text = Math.round(this.value /totalValue*100) + '%';
        writeProcents(canvasContext, text, itemRect.cx, itemRect.cy);
    }

    animation() {
        return this._animation;
    }

    activate(isActive){
        this.baseProgress = this.active ? (1 - this._animation / ANIMATE_DY) : (this._animation / ANIMATE_DY);
        this.active = isActive;
        this.duration = ANIMATION_DURATION * (1 - this.baseProgress);
        this.activeTime = performance.now();
    }

    deactivate() {
        this._isActive = false;
        this._animation = createAnimation();
    }
}

class PieChart {

    constructor() {
        this._items = [];
        this._colors = ["red", "blue", "green", "darkgrey", "brown", "grey", "yellow", "pink"];
        this._rotationDegree = 0;
        this.total = 0;
        this.isRecalculation = false;
        this._currentState = (Math.PI*3)/2;
        this._curRotation = 0;
    }

    addItem(value) {
        this._items.push(new Item(value, this._colors[this._items.length%this._colors.length], this._items.length));
        this.total += value;
    }
    
    rotateAt(degree) {
        this._rotationDegree = degree;
        //pieChart.draw(ctx);
    }
    
    getRotationDegree() {
        return this._rotationDegree;
    } 
    
    resetRotation(){
        this._currentState += this._rotationDegree;
        this._rotationDegree = 0;
    }
    
    setCurRotation(pos){
        this._curRotation = pos;
    }
    
    getCurRotation(){
        return this._curRotation;
    }
    
    draw(canvasContext) {
        canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this._items.forEach((item, index) => {
            const itemRect = getItemRect(item, this._currentState+this._rotationDegree, this.total);
            let color = item.getColor();
            if (color == this._colors[0] && index == this._items.length-1) { 
                item.setColor(this._colors[1]);
            }
            item.draw(canvasContext, this._currentState+this._rotationDegree, this.total);
            item.start = this._currentState;
            this._currentState += itemRect.rad;
            this._currentState = this._currentState%(Math.PI*2);
            item.finish = this._currentState;
        });
    }
    
    animate(){
        let start = performance.now();
        this._items.forEach((item, index) => {
            if (item.duration > 0) {
                let timeFraction = (start - item.activeTime ) / ANIMATION_DURATION;
                if (timeFraction > 1) timeFraction = 1;
                item.duration = ANIMATION_DURATION * (1 - item.baseProgress)-timeFraction*ANIMATION_DURATION;
                const progress = timeFraction*ANIMATION_DURATION/ANIMATION_DURATION + item.baseProgress;
                const prog = (ANIMATION_DURATION-item.duration)/(ANIMATION_DURATION * (1-item.baseProgress));
                item._animation = item.active 
                    ? 0 + progress * ANIMATE_DY
                    : ANIMATE_DY - progress * ANIMATE_DY;
                this.draw(ctx);
            }
            else item.duration = 0;
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
    pieChart.setCurRotation(mousePos.deg);
}

function recalculation(event) {
    if (pieChart.isRecalculation == true) {
        let mousePos = mousecoordinates(canvas, event);
        let prevCur = pieChart.getCurRotation();
        let cur = mousePos.deg - prevCur;
        if (cur < 0) {cur += 360};
        pieChart.rotateAt(inRad(cur));
    }
}

//printChart(ctx, model);
function activateElement(event) {
    let mousePos = mousecoordinates(canvas, event);
    let hypo = Math.sqrt(mousePos.x*mousePos.x+mousePos.y*mousePos.y);
    if (hypo <= (CANVAS_HEIGHT / 3 + CANVAS_HEIGHT / 9))
        activateEl(pieChart, inRad(mousePos.deg), hypo, mousePos);

}
function activElementCheck(item, classElements, total, mousePos) {
    const rect = getItemRect(item, item.start, total);
    const activeX = mousePos.x-rect.x+CANVAS_WIDTH/2;
    const activeY = mousePos.y-rect.y+CANVAS_HEIGHT/2;
    const hypo = Math.sqrt(activeX*activeX+activeY*activeY);
    const Deg = inRad(arctg360(activeX, activeY));
    if (Deg >= item.start && Deg < item.finish && hypo <= CANVAS_HEIGHT/3)
        processElementClick(classElements, item);
    else if (item.start > item.finish) {
        if ((Deg >= item.start || Deg < item.finish)&&hypo <= CANVAS_HEIGHT/3)
            processElementClick(classElements, item);
    }
}
function activateEl(modelEl, deg, hypotenuse, mousePos){
    modelEl._items.forEach((item) => {
        if (deg >= item.start && deg < item.finish ) {
                if (item.active)
                    activElementCheck(item, modelEl._items, modelEl.total, mousePos);
                else if (hypotenuse <= CANVAS_HEIGHT / 3)
                    processElementClick(modelEl._items, item);
            }
        else if (item.start > item.finish) {
            if (deg >= item.start || deg < item.finish) {
                if (item.active)
                    activElementCheck(item, modelEl._items, modelEl.total, mousePos);
                else if (hypotenuse <= CANVAS_HEIGHT / 3)
                    processElementClick(modelEl._items, item);
            }
        }
    });
}
function animate() {
    pieChart.animate();
    if (pieChart.rotateAt) pieChart.draw(ctx);
    requestAnimationFrame(animate);
}
animate();

function stopRecalculation(even) {
    pieChart.isRecalculation = false;
    rotation = pieChart.getRotationDegree();
    if (!rotation) {
        activateElement(even);
    }
    pieChart.resetRotation();
    
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
            item.activate(!item.active);
        }
        else if (item.active) {
            item.activate(false);
        }
    });
}

function activate1(item, isActive){
    item.baseProgress = item.active ? (1 - item._animation / ANIMATE_DY) : (item._animation / ANIMATE_DY);
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

