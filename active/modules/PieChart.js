import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATION_DURATION, ANIMATE_DY, RADIUS_CHART}  from '/modules/constants.js';
import {Item} from '/modules/Item.js';
import {arctg360, inRad, inDeg, getItemRect, showDescription, closeDescription} from '/modules/functions.js';

export class PieChart {
    constructor() {
        this._items = [];
        this._colors = ['red', 'blue', 'green', 'darkgrey', 'brown', 'grey', 'yellow', 'pink'];
        this._rotationDegree = 0;
        this.total = 0;
        this.isRecalculation = false;
        this._currentState = 1.5 * Math.PI;
        this._curRotation = 0;
    }

    addItem(value) {
        this._items.push(new Item(
            value, this._colors[this._items.length % this._colors.length], this._items.length
        ));
        this.total += value;
    }
    
    setRotation(degree) {
        this._rotationDegree = degree;
    }
    
    getRotationDegree() {
        return this._rotationDegree;
    } 
    
    resetRotation(){
        this._currentState += this._rotationDegree;
        this._rotationDegree = 0;
    }
    
    setCurRotation(position){
        this._curRotation = position;
    }
    
    getCurRotation(){
        return this._curRotation;
    }
    
    draw(canvasContext) {
        canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this._items.forEach((item, index) => {
            const itemRect = getItemRect(item, this._currentState + this._rotationDegree, this.total);
            let color = item.getColor();
            if (color == this._colors[0] && index == this._items.length - 1) { 
                item.setColor(this._colors[1]);
            }
            item.draw(canvasContext, this._currentState + this._rotationDegree, this.total);
            item.start = this._currentState;
            this._currentState += itemRect.rad;
            this._currentState = this._currentState % (2 * Math.PI);
            item.finish = this._currentState;
        });
    }
    
    animate(canvasContext){
        this._items.forEach((item) => {
            let curAnimation = item.animation();
            if (curAnimation.isAnimation) {
                curAnimation.animate();
                this.draw(canvasContext);
            }
        });
        this.setRotation && this.draw(canvasContext);
    }
    
    activateElement(event, mousePos) { // TODO: Math.hypo
        const distance = Math.hypot(mousePos.x, mousePos.y);
        if (distance <= (RADIUS_CHART + ANIMATE_DY)) {
            this.activateEl(distance, mousePos);
        }
    }
    
    activateEl(distance, mousePos){
        this._items.forEach((item) => {
            const click = item.check(distance, this.total, mousePos);
            click && processElementClick(this._items, item);
        });
    }
    
    nextElem(){
        let isActiveIndex = 0;
        this._items.forEach((item, index) => {
            if (item.isActive()) isActiveIndex = index + 1;
        });
        processElementClick(this._items, this._items[isActiveIndex]);
    }
    
    prevElem(){
        let isActiveIndex = this._items.length - 1;
        this._items.forEach((item, index) => {
            if (item.isActive()) isActiveIndex = index - 1;
        });
        processElementClick(this._items, this._items[isActiveIndex]);
    }
}

function processElementClick(items, clickedItem) {
    items.forEach((item, index) => {
        let curAnimation = item.animation();
            
        const isActive = item.isActive();
        if (item == clickedItem) {
            if (isActive) {
                item.deactivate();
                closeDescription();
                disableButtons(1, items.length - 1);
            }
            else  {
                item.activate();
                showDescription(item);
                disableButtons(index, items.length - 1);
            }
        }
        else if (isActive) {
            item.deactivate();
        }
    });
     
}

function disableButtons(isActiveIndex, maxIndex){
    let prev = document.getElementsByClassName('prev')[0];
    let next = document.getElementsByClassName('next')[0];
    
    if (isActiveIndex == 0) {
        prev.setAttribute('disabled', 'disabled');
        next.hasAttribute('disabled') && next.removeAttribute('disabled');
    }
    else if (isActiveIndex == maxIndex) {
        next.setAttribute('disabled', 'disabled');
        prev.hasAttribute('disabled') && prev.removeAttribute('disabled');
    }
    else {
        next.hasAttribute('disabled') && next.removeAttribute('disabled');
        prev.hasAttribute('disabled') && prev.removeAttribute('disabled');
    }

}
