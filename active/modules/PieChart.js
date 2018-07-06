import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATION_DURATION, ANIMATE_DY, RADIUS_CHART}  from '/modules/constants.js';
import {Item} from '/modules/Item.js';
import {arctg360, mousecoordinates, inRad, inDeg, getItemRect, showDescription, closeDescription} from '/modules/functions.js';

export class PieChart {
    constructor() {
        this._items = [];
        this._colors = ['red', 'blue', 'green', 'darkgrey', 'brown', 'grey', 'yellow', 'pink'];
        this._rotationDegree = 0;
        this.total = 0;
        this.isRecalculation = false;
        this._currentState = (Math.PI * 3) / 2;
        this._curRotation = 0;
    }

    addItem(value) {
        this._items.push(new Item(value, this._colors[this._items.length % this._colors.length], this._items.length));
        this.total += value;
    }
    
    rotateAt(degree) {
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
            this._currentState = this._currentState % (Math.PI * 2);
            item.finish = this._currentState;
        });
    }
    
    animate(canvasContext){
        let start = performance.now();
        this._items.forEach((item) => {
            let curAnimation = item.animation();
            if (curAnimation.isAnimation) {
                curAnimation.animate();
                this.draw(canvasContext);
            }
        });
        if (this.rotateAt) this.draw(canvasContext);
    }
    
    activateElement(event, mousePos) {
        let hypo = Math.sqrt(mousePos.x  * mousePos.x + mousePos.y * mousePos.y);
        if (hypo <= (RADIUS_CHART + ANIMATE_DY)){
            this.activateEl(inRad(mousePos.deg), hypo, mousePos);
        }
    }
    
    activateEl(deg, hypotenuse, mousePos){
        this._items.forEach((item) => {
            let click = item.check(deg, hypotenuse, this.total, mousePos);
            if (click) {
                processElementClick(this._items, item);
            }
        });
    }
}

function processElementClick(items, clickedItem) {
    items.forEach((item) => {
        let isActive = item.isActive();
        if (item == clickedItem) {
            if (isActive) {
                item.deactivate();
                closeDescription();
            }
            else  {
                item.activate();
                showDescription(item);
            }
        }
        else {
            if (isActive) 
                item.deactivate();
        }
    });
}

