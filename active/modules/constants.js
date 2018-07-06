const CANVAS_WIDTH = 340;
const CANVAS_HEIGHT = 340;
const ANIMATION_DURATION = 150;
const ANIMATE_DY = CANVAS_HEIGHT/9;
const RADIUS_CHART = RadiusPieChart();
export {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    ANIMATION_DURATION,
    ANIMATE_DY,
    RADIUS_CHART
};

function RadiusPieChart(){
    if (CANVAS_WIDTH < CANVAS_HEIGHT) return CANVAS_WIDTH / 3;
    else return CANVAS_HEIGHT / 3;
}