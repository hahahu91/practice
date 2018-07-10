import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATION_DURATION, ANIMATE_DY, RADIUS_CHART}  from '/modules/constants.js';

export class Animation {
    constructor(item, fn = (x) => x) {
        this._item = item;
        this.currentAnimation = null;
        this._baseProgress = null;
        this._activationTimestamp = null;
        this._duration = null;
        this.isAnimation = false;
        this._fnAnimate = fn;
    }
    
    activate() {
        this.createAnimation(true);
    }
    
    deactivate() {
        this.createAnimation(false);
    }
    
    createAnimation(isActive) {
       this._baseProgress = this._item.isActive()
           ? (1 - this.currentAnimation / ANIMATE_DY)
           : (this.currentAnimation / ANIMATE_DY);
        this._duration = ANIMATION_DURATION * (1 - this._baseProgress);
        this._activationTimestamp = performance.now(); 
        this.isAnimation = true;
    }
    
    animate() { // TODO: ease-in, f.e.
        const start = performance.now();
        if (this._duration > 0) {
            let timeFraction = (start - this._activationTimestamp ) / ANIMATION_DURATION;
            
            this._duration = ANIMATION_DURATION * ((1 - this._baseProgress) - timeFraction); 
            const progress = timeFraction + this._baseProgress; 
            const prog = (ANIMATION_DURATION - this._duration) / (ANIMATION_DURATION * (1 -this._baseProgress));
            this.currentAnimation = this._item.isActive()
                ? this._fnAnimate(progress) * ANIMATE_DY
                : ANIMATE_DY - this._fnAnimate(progress)  * ANIMATE_DY;
        }
        else {
            this._duration = 0;
            this.isAnimation = false;
        }
    }
}
