import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATION_DURATION, ANIMATE_DY, RADIUS_CHART}  from '/modules/constants.js';

function getItemRect(item, start, total) {
    const radians = (Math.PI * 2) * (item.value / total); // TODO: translate radiant
    const center = CANVAS_WIDTH / 2;
    const middle = (start + start + radians) / 2;
    const curAnimation = item._animation.currentAnimation;
    const distanceText = RADIUS_CHART + 10 + curAnimation;
    
    return { // TODO: remove duplicated code
        rad: radians,
        cx: center + (distanceText) * Math.cos(middle),
        cy: center + (distanceText) * Math.sin(middle),
        x: center + curAnimation * Math.cos(middle),
        y: center + curAnimation * Math.sin(middle),
    };
}

function arctg360(x, y) { // TODO: what means `s`? no-s
    // TODO: switch, no-var
    if (y >= 0 && x >= 0) {
        return Math.atan(y / x) * 180 / Math.PI;
    }
    else if (y >= 0 &&  x < 0 || y < 0 && x < 0) {
        return 180 + Math.atan(y / x) * 180 / Math.PI;
    }
    else {
        return 360 + Math.atan(y / x) * 180 / Math.PI;
    };
} 

function mouseCoordinates(canvas, event){
    let margin = canvas.getBoundingClientRect();
    let tempX = event.pageX - canvas.offsetLeft - margin.left;
    let tempY = event.pageY - canvas.offsetTop;
    return {
        x: tempX - CANVAS_WIDTH / 2,
        y: tempY - CANVAS_HEIGHT / 2,
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
    let title = document.getElementsByClassName('title')[0];
    let paragraph = document.getElementsByClassName('about_item')[0];
    let color = item.getColor();
    
    if (decrDiv.classList.contains('active')) {
        decrDiv.classList.add('hidden');
        setTimeout(function(){
            decrDiv.classList.remove('hidden');
            decrDiv.style.borderTopColor = color;
            title.innerHTML = item.id;
            paragraph.innerHTML = item.value;
        },1000)
    }
    else {
        decrDiv.classList.add('active');
        decrDiv.style.borderTopColor = color;
        title.innerHTML = item.id;
        paragraph.innerHTML = item.value;
    }
}

function closeDescription() {
    let decrDiv = document.getElementById('decription');
    decrDiv.classList.remove('active');
}


export {
    arctg360,
    mouseCoordinates,
    inRad,
    inDeg,
    getItemRect,
    showDescription,
    closeDescription,
};