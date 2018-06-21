var canvas = document.getElementById("canvas");
const CANVAS_WIDTH = 4000;
const CANVAS_HEIGHT = 4000;
const DX = 100;
const DY = 100;
const ANIMATE_DY = 200;
const ANIMATION_DURATION = 1000;
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


//
//var arrObjects = []; // объявление массива
//for (i = 0; i < 6; i++) {
//    arrObjects[i] = {
//        id: i,
//        width: 30,
//        height: 40,
//        x: 5+i*45,
//        y: 35,
//        active: false,
//        color: 2
//    };
//}

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
    //obj.active && console.log(obj.dY);
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
        const arrObjects = model.items;
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
    item.activeTime = performance.now();
//    console.log("direction", isActive ? "down" : "up");
//    console.log("dY", item.dY);
//    console.log("baseProgress", baseProgress);
//    console.log("duration", 400 * (1 - baseProgress));
}

function animate() {
    let start = performance.now();
    
    model.items.forEach((item, index) => {
        if (item.duration > 0) {
            let timeFraction = (start - item.activeTime ) / ANIMATION_DURATION;
            if (timeFraction > 1) timeFraction = 1;
            timeFraction => timeFraction;
            let progresstemp = timeFraction;
            console.log(progresstemp);
            //item.duration -= 
            item.duration = ANIMATION_DURATION-timeFraction*ANIMATION_DURATION;
            //console.log(timeFraction, item.duration);
            const progress = (ANIMATION_DURATION-item.duration)/ANIMATION_DURATION * (1 - item.baseProgress) + item.baseProgress;
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

/*
function activate_temp(item, isActive){
    const ANIMATE_DY = 20;
    const baseProgress = item.active ? (1 - item.dY / ANIMATE_DY) : (item.dY / ANIMATE_DY);
    item.active = isActive;
    console.log("direction", isActive ? "down" : "up");
    console.log("dY", item.dY);
    console.log("baseProgress", baseProgress);
    console.log("duration", 400 * (1 - baseProgress));
    animate({
        duration: 400 * (1 - baseProgress),
        timing: timeFraction => timeFraction,
        draw: (progress) => {
            progress = progress * (1 - baseProgress) + baseProgress;
            item.dY = isActive 
                ? 0 + progress * ANIMATE_DY
                : ANIMATE_DY - progress * ANIMATE_DY;
            }
    });
}
function animate_temp(options) {

  let start = performance.now();
    
  requestAnimationFrame(function animate(time) {
    // timeFraction от 0 до 1
    let timeFraction = (time - start) / options.duration;
    if (timeFraction > 1) timeFraction = 1;

    // текущее состояние анимации
    let progress = options.timing(timeFraction)
    
    options.draw(progress);
    drawing(ctx, model);
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}
*/

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
/*

function addElement(value){
    data.push(value);
    total += value;
    printChart();
}
function  printPieChart(index, val) {
    var radiant = (Math.PI * 2) * (val / total);
    var cx = canvas.height/2+canvas.height/2.8*Math.cos((start + start + radiant)/2);
    var cy = canvas.height / 2+ canvas.height / 2.8*Math.sin((start + start + radiant)/2);
    ctx.fillStyle = colors[index];
    ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 3, start, start+radiant, false);
        ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();
    var text = Math.round(val/total*100) + '%';
    writeProcents(text, cx, cy);
    start += radiant;
    start = start%(Math.PI*2); 
}

function printChart(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var j = 0;
    for (i = 0; i < data.length; i++) {
        if (j >= colors.length) j = 0;
        if (i == data.length-1 && j == 1) j++;
        printPieChart(j, data[i]);
        j++;
    }
}

function writeProcents(text, x, y){
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
}

addElement(10);
addElement(240);
addElement(340);
addElement(40);
addElement(140);
addElement(240);
addElement(340);
addElement(240);

canvas.addEventListener("mousedown", startRecalculation, false);
canvas.addEventListener("mouseup", stopRecalculation, false);
canvas.addEventListener("mousemove", recalculation, false);

var isRecalculation;
function startRecalculation(event) {
    var x,y;
	isRecalculation = true;
	curent = start;
    mousecoordinates(x,y);
    
}
function recalculation(event) {
    if (isRecalculation == true)
    {
        // Определяем текущие координаты указателя мыши
        var x, y;
        mousecoordinates(x,y);
        //curent = arctg360(xs, ys)*Math.PI/180;
        console.log(arctg360(xs, ys)*Math.PI/180)
        console.log('st', start, curent);
        function asdd (){
            var asd =  (arctg360(xs, ys)*Math.PI/180);
            return asd;
        }
        start = asdd();
        console.log(start, asdd());
        printChart();
    }
}

function stopRecalculation() {
    isRecalculation = false;
}

function arctg360(xs, ys) {
    var temp;
    if (ys >= 0 && xs >= 0) {temp = Math.atan(ys/xs)* 180 / Math.PI}
    else if (ys >= 0 && xs < 0 || ys < 0 && xs < 0) {temp = 180 + Math.atan(ys/xs)* 180 / Math.PI}
    else {temp = 360 + Math.atan(ys/xs)* 180 / Math.PI};
    return temp;
} 

function mouseCoordinates(x, y){
    var tempX = event.pageX - canvas.offsetLeft;
    var tempY = event.pageY - canvas.offsetTop;
   return{
       x: tempX - canvas.weight/2,
       y: tempY - canvas.height/2
   }
}
*/
