const canvas = document.getElementById("stars-bg");
const g = canvas.getContext("2d");

const main = document.getElementById("main");
const planetDivs = document.getElementsByClassName("planet");

const galaxy = document.getElementById("galaxy");

const planetDescs = document.getElementsByClassName("planet-desc");
const sunDesc = document.getElementById("sun-planet-desc");
const plutoDesc = document.getElementById("pluto-desc");

const dancingTexts = document.getElementsByClassName("dancing-text");

// Settings
const settings = document.getElementsByClassName("setting-check");
const motionSetting = document.getElementById("planet-motion");
const sonicSetting = document.getElementById("planet-speed");

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

    addPlanetOnClick();
    initFrame();
    for(let i=0; i<planetDescs.length; ++i){
        planetDescs[i].setAttribute("ondragstart", "return false;")
    }
    for(let i=0; i<settings.length; ++i){
        settings[i].checked = false;
    }
    motionSetting.checked = true;

}

function initFrame(){

    mainW = main.clientWidth;
    mainH = main.clientHeight;
    canvasW = canvas.clientWidth;
    canvasH = canvas.clientHeight;

    initStarFrame();
    initPlanets();
}

function renderFrame(){
    renderStarFrame();
    animatePlanets();
}

motionSetting.onclick = resetPlanetVels;
sonicSetting.onclick = changePlanetVels;
