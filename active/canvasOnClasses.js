import {PieChart}  from '/modules/PieChart.js';
import {CANVAS_WIDTH, CANVAS_HEIGHT} from '/modules/constants.js';
import {mouseCoordinates, inRad, arctg360} from '/modules/functions.js';

var buttonNext = document.getElementsByClassName('next')[0];
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('height', CANVAS_HEIGHT);
canvas.setAttribute('width', CANVAS_WIDTH);
ctx.font = '10px Arial';

// TODO: beautify
const pieChart = new PieChart();
for (let i = 0; i < 7; i++){
    let x = parseInt(getRandom(30, 300));
    pieChart.addItem(x);
};
pieChart.draw(ctx);
animate();
buttonClick();

canvas.addEventListener('mousedown', startRecalculation, false);
document.addEventListener('mouseup', stopRecalculation, false);
document.addEventListener('mousemove', recalculation, false);

function buttonClick() {
    let next = document.getElementsByClassName('next')[0];
    let prev = document.getElementsByClassName('prev')[0];
    
    next.addEventListener('click', function(event) {
        event.preventDefault();
        pieChart.nextElem();
    });
    prev.addEventListener('click', function(event) {
        event.preventDefault();
        pieChart.prevElem();
    });
}


function startRecalculation(event) {
    pieChart.isRecalculation = true;
    let mousePos = mouseCoordinates(canvas, event);
    const angle = arctg360(mousePos.x, mousePos.y);
    pieChart.setCurRotation(angle);
}

function recalculation(event) {
    if (pieChart.isRecalculation == true) {
        const mousePos = mouseCoordinates(canvas, event);
        const angle = arctg360(mousePos.x, mousePos.y);
        const prevCur = pieChart.getCurRotation();
        let currentAngle = angle - prevCur;
        if (currentAngle < 0)
            currentAngle += 360;
        pieChart.setRotation(inRad(currentAngle));
    }
}

function stopRecalculation(even) {
    const mouseMotion = 0.1;
    pieChart.isRecalculation = false;
    let mousePos = mouseCoordinates(canvas, even);
    let rotation = pieChart.getRotationDegree();
    if (rotation < mouseMotion || rotation > Math.PI * 2 - mouseMotion) {
        pieChart.activateElement(even, mousePos);
    };
    pieChart.resetRotation();
}

function animate() {
    pieChart.animate(ctx);
    requestAnimationFrame(animate);
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}