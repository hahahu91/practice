
import {PieChart}  from '/modules/PieChart.js';
import {CANVAS_WIDTH, CANVAS_HEIGHT} from '/modules/constants.js';
import {mousecoordinates, inRad} from '/modules/functions.js';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.setAttribute('height', CANVAS_HEIGHT);
canvas.setAttribute('width', CANVAS_WIDTH);
ctx.font = '10px Arial';

canvas.addEventListener('mousedown', startRecalculation, false);
document.addEventListener('mouseup', stopRecalculation, false);
document.addEventListener('mousemove', recalculation, false);

const pieChart = new PieChart();
pieChart.addItem(120);
pieChart.addItem(110);
pieChart.addItem(20);
pieChart.addItem(101);
pieChart.addItem(120);
pieChart.addItem(180);
pieChart.addItem(180);
pieChart.draw(ctx);

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
        if (cur < 0)
            cur += 360;
        pieChart.rotateAt(inRad(cur));
    }
}

function stopRecalculation(even) {
    pieChart.isRecalculation = false;
    let mousePos = mousecoordinates(canvas, even);
    let rotation = pieChart.getRotationDegree();
    if (rotation < 0.2 || rotation > Math.PI * 2 - 0.2) {
        pieChart.activateElement(even, mousePos);
    };
    pieChart.resetRotation();
}

function animate() {
    pieChart.animate(ctx);
    requestAnimationFrame(animate);
}
animate();


