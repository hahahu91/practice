import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATION_DURATION, ANIMATE_DY}  from '/modules/constants.js';

function getItemRect(item, start, total) {
    let radiant = (Math.PI * 2) * (item.value / total);
    return {
        rad: radiant,
        cx: CANVAS_WIDTH / 2 + (CANVAS_HEIGHT / 2.8 + item._animation.currentAnimation) * Math.cos((start + start + radiant)/2),
        cy: CANVAS_WIDTH / 2 + (CANVAS_HEIGHT / 2.8 + item._animation.currentAnimation) * Math.sin((start + start + radiant)/2),
        x: CANVAS_WIDTH / 2 + item._animation.currentAnimation * Math.cos((start + start + radiant) / 2),
        y: CANVAS_WIDTH / 2 + item._animation.currentAnimation * Math.sin((start + start + radiant) / 2),
    };
}

function arctg360(xs, ys) {
    var temp;
    if (ys >= 0 && xs >= 0) {
        temp = Math.atan(ys/xs) * 180 / Math.PI
    }
    else if (ys >= 0 && xs < 0 || ys < 0 && xs < 0) {
        temp = 180 + Math.atan(ys/xs) * 180 / Math.PI
    }
    else {
        temp = 360 + Math.atan(ys/xs) * 180 / Math.PI
    };
    return temp;
} 

function mousecoordinates(canvas, event){
    let margin = canvas.getBoundingClientRect();
    let tempX = event.pageX - canvas.offsetLeft - margin.left;
    let tempY = event.pageY - canvas.offsetTop - - margin.top;
    let x = tempX - CANVAS_WIDTH / 2;
    let y = tempY - CANVAS_HEIGHT / 2;
    return {
        deg: arctg360(x, y),
        x: x,
        y: y,
    }
}

function inRad(degrees){
    return degrees * Math.PI / 180;
}

function inDeg(radians){
    return radians * 180 / Math.PI;
}

function showDescription(item){
    let decrDiv = document.getElementById('decription'); 
    let title = document.getElementsByTagName('h3')[0];
    let paragraph = document.getElementsByClassName('about_item')[0];
    decrDiv.classList.add('active');
    title.innerHTML = item.id;
    paragraph.innerHTML = item.value;
}

function closeDescription() {
    let decrDiv = document.getElementById('decription'); 
    decrDiv.classList.remove('active');
}

export {
    arctg360,
    mousecoordinates,
    inRad,
    inDeg,
    getItemRect,
    showDescription,
    closeDescription
};