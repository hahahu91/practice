import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATION_DURATION, ANIMATE_DY, RADIUS_CHART}  from '/modules/constants.js';
import {Animation} from '/modules/Animation.js';
import {arctg360, mousecoordinates, inRad, inDeg, getItemRect} from '/modules/functions.js';

export class Item {
    constructor(value, color, index) {
        this.id = 'Item' + index;
        this.index = index;
        this.value = value;
        this._color = color;
        this._animation = new Animation(this);
        this.start = null;
        this.finish = null;
        this._isActive = false;
    }
    
    isActive(){
        return this._isActive;
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
            canvasContext.arc(itemRect.x, itemRect.y, RADIUS_CHART, rotationDegree, rotationDegree + itemRect.rad, false);
            canvasContext.lineTo(itemRect.x, itemRect.y);
        canvasContext.fill();
        const text = Math.round(this.value / totalValue * 100) + '%';
        writePercentages(canvasContext, text, itemRect.cx, itemRect.cy);
    }

    animation() {
        return this._animation;
    }
    
    activate(){
        this._animation.activate();
    }
    
    deactivate() {
        this._animation.deactivate();
    }
    
    check(deg, hypotenuse, total, mousePos) {
        if ((deg >= this.start && deg < this.finish) || ((this.start > this.finish) && (deg >= this.start || deg < this.finish) )) {
            if (this._isActive) {
                let isActive = activElementCheck(this, total, mousePos);
                if (isActive) return true;
            }
            else if (hypotenuse <= RADIUS_CHART) {
                return true;
            }
        }
    }
};

function activElementCheck(item, total, mousePos) {
    const rect = getItemRect(item, item.start, total);
    const activeX = mousePos.x - rect.x + CANVAS_WIDTH / 2;
    const activeY = mousePos.y - rect.y + CANVAS_HEIGHT / 2;
    const hypo = Math.sqrt(activeX * activeX + activeY * activeY);
    const Deg = inRad(arctg360(activeX, activeY));
    if ((Deg >= item.start && Deg < item.finish && hypo <= RADIUS_CHART)|| ((item.start > item.finish) && ((Deg >= item.start || Deg < item.finish) && hypo <= RADIUS_CHART))) {
        return true;
    }
}

function writePercentages(ctx, text, x, y) {
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
}