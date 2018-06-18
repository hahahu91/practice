var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var colors =["red", "blue", "green", "darkgrey","brown", "grey", "yellow", "pink"];
ctx.font = '10px Arial';

function draw(index){
    
    ctx.fillStyle = colors[2];
    ctx.fillRect(5+index*45, 35, 30, 40);
}
   
function drawing() {
    for (i = 1; i < 6; i++) draw(i);
}
drawing();

canvas.addEventListener("click", function(event){
    var mousePos = getMousePos(canvas, event);
    for (index = 1; index < 6; index++) {
        if ((mousePos.x >= 5+index*45) && (mousePos.x <= 35+index*45) && (mousePos.y >= 35) && (mousePos.y <= 75) ) changeElem(5+index*45, 35, index);//console.log('!');
    }
    //&& (mousePos.x <= 40+index*45) && (mousePos.у >= 35) && (mousePos.у <= 75)
    //console.log(mousePos.x, mousePos.y);
}, false);
function changeElem(x,y, index) {
    console.log(x,y,index);
    ctx.clearRect(x,y, 30, 40);
    ctx.fillStyle = colors[3];
    ctx.fillRect(5+index*45, 35-20, 30, 40);
}

function getMousePos(canvas, even) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: even.clientX - rect.left,
        y: even.clientY - rect.top
    };
}
      
/*function hittest(event) {
  // Получить размеры и координаты холста 
var bb = canvas.getBoundingClientRect();
  // Преобразовать координаты указателя мыши в координаты холста
  var х = (event.clientX-bb.left)*(canvas.width/bb.width);
  var у = (event.clientY-bb.top)*(canvas.height/bb.height);
  // Залить контур, если пользователь щелкнул в его пределах
    ctx.fillStyle[3];
  if (сtx.isPointInPath(x,у)) сtx.fill();
} */
//void lineTo(double x, double y)
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
*/

function mousecoordinates(x, y){
    var tempX = event.pageX - canvas.offsetLeft;
    var tempY = event.pageY - canvas.offsetTop;
    var x = tempX - canvas.weight/2;
    var y = tempY - canvas.height/2;
}

function inRad(degrees){
    return degrees*Math.PI/180;
}