var canvas = document.getElementById("canvas");
const CANVAS_WIDTH = 4000;
const CANVAS_HEIGHT = 4000;
const DX = 100;
const DY = 100;
const ANIMATE_DY = 200;
const ANIMATION_DURATION = 4000;
canvas.setAttribute("height", CANVAS_HEIGHT);
canvas.setAttribute("width", CANVAS_WIDTH);

var ctx = canvas.getContext("2d");
const ITEM_WIDTH = 200;
const ITEM_HEIGHT = 200;

ctx.font = '10px Arial';
const ACTIVE_COLOR = "#00FF00";
const INACTIVE_COLOR = "#FF0000";
var model = {
    addItem: function() {
        this.items.push({
            id: "item" + this.items.length,
            dY: 0,
            active: false,
        });
    },
    items: [],
}

model.addItem();
model.addItem();
model.addItem();
model.addItem();
model.addItem();

function getItemRect(item, itemIndex) {
    return {
        x: DX + itemIndex * (ITEM_HEIGHT + 20),
        y: DY + item.dY,
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        baseProgress: 0,
    };
}

function drawOneElem(ctx, obj, objIndex){
    ctx.fillStyle = obj.active ? ACTIVE_COLOR : INACTIVE_COLOR;
    const itemRect = getItemRect(obj, objIndex);
    ctx.fillRect(itemRect.x, itemRect.y, itemRect.width, itemRect.height);
}
   
function drawing(ctx, model) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    model.items.forEach((item, index) => {
        drawOneElem(ctx, item, index)
    });
}
drawing(ctx, model);

function initHandlers(canvasEl, model) {
    canvasEl.addEventListener("click", (event) => {
       // const arrObjects = model.items;
        let mousePos = getMousePos(canvasEl, event);
        model.items.forEach((item, index) => {
            const rect = getItemRect(item, index);
            if (mousePos.x >= rect.x && mousePos.x <= rect.x+rect.width && 
               mousePos.y >= rect.y && mousePos.y <= rect.y+rect.height)
                {
                    processElementClick(model.items, item);
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

function activate(item, isActive){
    item.baseProgress = item.active ? (1 - item.dY / ANIMATE_DY) : (item.dY / ANIMATE_DY);
    item.active = isActive;
    item.duration = ANIMATION_DURATION * (1 - item.baseProgress);
    console.log('baseProg', item.baseProgress);
    console.log('duration', item.duration);
//    console.log('dY', item.dY);
    item.activeTime = performance.now();
}

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
            drawing(ctx, model);
            let time = performance.now();
        }
        else item.duration = 0;
    });
    requestAnimationFrame(animate);
}
animate();


function getMousePos(canvas, even) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: even.clientX - rect.left,
        y: even.clientY - rect.top
    };
}

function inRad(degrees){
    return degrees*Math.PI/180;
}

