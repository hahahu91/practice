import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATION_DURATION, ANIMATE_DY, RADIUS_CHART}  from '/modules/constants.js';
import {Animation} from '/modules/Animation.js';
import {arctg360, mouseCoordinates, inRad, inDeg, getItemRect} from '/modules/functions.js';

export class Item {
    constructor(value, color, index) {
        this.id = 'Item' + index;
        this.index = index;
        this.value = value;
        this._color = color;
        this._animation = new Animation(this, EaseOut);
        this.start = null;
        this.finish = null;
        this._isActive = false;
    }
    
    isActive() {
        return this._isActive;
    }
    
    setActive(isActive) {
        this._isActive = isActive;
    }
    
    setColor(color) {
        this._color = color;
    }
    
    getColor() {
        return this._color;
    }
    
    draw(canvasContext, rotationDegree, totalValue) {
        const itemRect = getItemRect(this, rotationDegree, totalValue);
        canvasContext.fillStyle = this._color;
        canvasContext.strokeStyle = '#000';
        canvasContext.beginPath();
        canvasContext.arc(itemRect.x, itemRect.y, RADIUS_CHART, rotationDegree, rotationDegree + itemRect.rad, false);
        canvasContext.lineTo(itemRect.x, itemRect.y);
        canvasContext.closePath();
        canvasContext.stroke();
        canvasContext.fill();
        const text = `${Math.round(100 * this.value / totalValue)}%`;
        writePercentages(canvasContext, text, itemRect.cx, itemRect.cy);
    }

    animation() {
        return this._animation;
    }
    
    activate() {
        this._animation.activate();
        this._isActive = true;
    }
    
    deactivate() {
        this._animation.deactivate();
        this._isActive = false;
    }
    
    check(distance, totalValue, mousePos) {
        const angle = inRad(arctg360(mousePos.x, mousePos.y));
        if ((angle >= this.start && angle < this.finish) || ((this.start > this.finish) && (angle >= this.start || angle < this.finish) )) {
            if (this._isActive) {
                return activElementCheck(this, totalValue, mousePos);
            }
            else return (distance <= RADIUS_CHART)
        }
        return false;
    }
};

function activElementCheck(item, totalValue, mousePos) {
    const rect = getItemRect(item, item.start, totalValue);
    const activeX = mousePos.x - rect.x + CANVAS_WIDTH / 2;
    const activeY = mousePos.y - rect.y + CANVAS_HEIGHT / 2;
    const distance = Math.hypot(activeX, activeY);
    const angle = inRad(arctg360(activeX, activeY));
    
    return (((item.start <= angle && angle < item.finish) || (item.start > item.finish) && (item.start <= angle || angle < item.finish)) && distance <= RADIUS_CHART)
}

function writePercentages(ctx, text, x, y) {
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
}

function EaseOut(progress) {
  return Math.pow(progress, 1/3)
}

function bounce(timeFraction) {
  for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
    if (timeFraction >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
    }
  }
}