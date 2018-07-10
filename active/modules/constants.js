const CANVAS_WIDTH = 340;
const CANVAS_HEIGHT = 340;
const ANIMATION_DURATION = 1000;
const ANIMATE_DY = CANVAS_HEIGHT / 9;
const RADIUS_CHART = setRadiusPieChart();

export {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    ANIMATION_DURATION,
    ANIMATE_DY,
    RADIUS_CHART
};

function setRadiusPieChart(){
    return CANVAS_WIDTH < CANVAS_HEIGHT
        ? CANVAS_WIDTH / 3
        : CANVAS_HEIGHT / 3;
}