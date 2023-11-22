const canvas = document.getElementById("stars-bg");
const g = canvas.getContext("2d");

const main = document.getElementById("main");

// Settings
const settings = document.getElementsByClassName("setting-check");
const motionSetting = document.getElementById("planet-motion");
const sonicSetting = document.getElementById("planet-speed");
const starAnimateSetting = document.getElementById("stars-animate");

let mouseX, mouseY, prevMouseX, prevMouseY;
let mainW, mainH, canvasW, canvasH;

onmousemove = (e) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.x;
    mouseY = e.y;
};

main.onmouseleave = onmouseup = unPressAllPlanets;

onload = loadIn;
onresize = initFrame;
setInterval(renderFrame, 30);


function loadIn(){

    initFrame();

    for(let i=0; i<settings.length; ++i){
        settings[i].checked = false;
    }
    motionSetting.checked = true;
    starAnimateSetting.checked = true;

}

function initFrame(){

    mainW = main.clientWidth;
    mainH = main.clientHeight;
    canvasW = canvas.clientWidth;
    canvasH = canvas.clientHeight;

    canvas.width = canvasW;
    canvas.height = canvasH;

    initStarFrame();
    initPlanets();
}

function renderFrame(){
    renderStarFrame();
    animatePlanets(g);

    // g.fillStyle = "red";
    // g.font = "bold 40px Arial";
    // g.fillText("S: "+ selectedPlanet, 10,100);
}

sonicSetting.onclick = changePlanetVels;


canvas.onmousedown = planetMouseDown;
canvas.onclick = planetOnClick;
canvas.onmouseup = planetMouseUp;