const canvas = document.getElementById("stars-bg");
const g = canvas.getContext("2d");

const main = document.getElementById("main");
const planetDivs = document.getElementsByClassName("planet");

const galaxy = document.getElementById("galaxy");

const planetDescs = document.getElementsByClassName("planet-desc");
const sunDesc = document.getElementById("sun-planet-desc");
const plutoDesc = document.getElementById("pluto-desc");

const dancingTexts = document.getElementsByClassName("dancing-text");

let mouseX, mouseY, prevMouseX, prevMouseY;

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

    // Start Sun desc animation
    // setTimeout(() => writeNewMsg(sunDesc), INIT_DELAY);

    addPlanetOnClick();
    initFrame();
    for(let i=0; i<planetDescs.length; ++i){
        planetDescs[i].setAttribute("ondragstart", "return false;")
    }

}

function initFrame(){
    initStarFrame();
    initPlanets();
}

function renderFrame(){
    renderStarFrame();
    animatePlanets();
    calculateAge();

    // if(plutoDesc != null)
    //     plutoDesc.innerHTML = "I am<br>" + calculateAge().toFixed(9) + "<br>years old.";
}

