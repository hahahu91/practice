import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATION_DURATION, ANIMATE_DY}  from '/modules/constants.js';

export class Animation {
    constructor (item) {
        this._item = item;
        this.currentAnimation = null;
        this._baseProgress = null;
        this._activationTimestamp = null;
        this._duration = null;
        this.isAnimation = false;
    }
    
    activate(){
        this.createAnimation(true);
    }
    
    deactivate() {
        this.createAnimation(false);
    }
    
    createAnimation(isActive){
       this._baseProgress = this._item._isActive ? (1 - this.currentAnimation / ANIMATE_DY) : (this.currentAnimation / ANIMATE_DY);
        this._item._isActive = isActive;
        this._duration = ANIMATION_DURATION * (1 - this._baseProgress);
        this._activationTimestamp = performance.now(); 
        this.animate();
    }
    
    animate() {
        let start = performance.now();
        if (this._duration > 0) {
            let timeFraction = (start - this._activationTimestamp ) / ANIMATION_DURATION;
            if (timeFraction > 1) timeFraction = 1;
            this._duration = ANIMATION_DURATION * (1 - this._baseProgress) - timeFraction * ANIMATION_DURATION;
            const progress = timeFraction * ANIMATION_DURATION / ANIMATION_DURATION + this._baseProgress;
            const prog = (ANIMATION_DURATION - this._duration) / (ANIMATION_DURATION * (1 -this._baseProgress));
            this.currentAnimation = this._item._isActive
                ? 0 + progress * ANIMATE_DY
                : ANIMATE_DY - progress * ANIMATE_DY;
        }
        else this._duration = 0;
        (this._duration == 0) ? this.isAnimation = false :  this.isAnimation = true;
    }
}
