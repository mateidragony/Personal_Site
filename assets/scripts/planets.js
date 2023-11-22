const planets = []

const PLANET_NAMES = ["Sun", "Earth", "Mars", "Snow", "Gas", "Crater"];

const PLANET_TOOLTIPS = ["About Me", "My Projects", "My Professional Information", "My Geometry Dash Statistics", "My Spotify Information", "Very Very Important..."];
const PLANET_HREF = ["/assets/home-subpages/about.html", "/assets/home-subpages/projects.html", "/assets/home-subpages/professional.html",
                     "/assets/home-subpages/gd.html", "/assets/home-subpages/music.html", "/assets/home-subpages/age.html"];

const PLANET_IMAGES = [new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
PLANET_IMAGES[0].src = "/assets/Images/sun.webp";
PLANET_IMAGES[1].src = "/assets/Images/earth_planet.webp";
PLANET_IMAGES[2].src = "/assets/Images/mars_planet.webp";
PLANET_IMAGES[3].src = "/assets/Images/snow_planet.webp";
PLANET_IMAGES[4].src = "/assets/Images/ring_planet.webp";
PLANET_IMAGES[5].src = "/assets/Images/crater_planet.webp";

const BANNER_IMAGES = [new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
BANNER_IMAGES[0].src = "/assets/Images/banners/about-banner.webp";
BANNER_IMAGES[1].src = "/assets/Images/banners/projects-banner.webp";
BANNER_IMAGES[2].src = "/assets/Images/banners/professional-banner.webp";
BANNER_IMAGES[3].src = "/assets/Images/banners/gd-banner.webp";
BANNER_IMAGES[4].src = "/assets/Images/banners/music-banner.webp";
BANNER_IMAGES[5].src = "/assets/Images/banners/important-banner.webp";

let MAX_SPEED = 1;
let STABLE_ENERGY = MAX_SPEED * MAX_SPEED * PLANET_NAMES.length;

const HITBOX_LEEWAY = 0;

let selectedPlanet = -1;
let prevSelected = -1;
let prevTimePressed = 0;

class Planet{
    constructor(x,y,w,h, id){
        this.x=x;
        this.y=y;
        this.w = w;
        this.h = h;

        this.initRandVel();

        this.id = id;
        this.zIndex = id;

        this.isPressed = false;
        this.timePressed = 0;
        this.timeHovered = 0;

    }

    initRandVel(){
        let angle = Math.random() * 2 * Math.PI;
        this.xVel = MAX_SPEED * Math.cos(angle);
        this.yVel = MAX_SPEED * Math.sin(angle);
    }

    draw(g){
        g.drawImage(PLANET_IMAGES[this.id], this.x, this.y, this.w, this.h);
        g.drawImage(BANNER_IMAGES[this.id], this.x, this.y + this.h * (3/4) - (this.w * 387 / 1843)/2, this.w, this.w * 387 / 1843);

        // Draw tooltip
        if(dist([mouseX, mouseY], [this.x+this.w/2, this.y+this.h/2]) <= this.w/2){
            this.timeHovered++;
            if(this.timeHovered >= 20){
                let tooltipMeasure = g.measureText(PLANET_TOOLTIPS[this.id]);
                let hrefMeasure = g.measureText(PLANET_HREF[this.id]);

                g.globalAlpha = (this.timeHovered - 20) / 5;
                g.font = "normal 12px arial";

                g.fillStyle = "black";
                g.fillRect(mouseX, mouseY - 15, tooltipMeasure.width + 10, 20);
                g.fillRect(0, canvasH-20, hrefMeasure.width + 10, 20);

                g.strokeStyle = "#999999";
                g.strokeRect(mouseX, mouseY - 15, tooltipMeasure.width + 10, 20);
                
                g.fillStyle = "#FFD8C1";
                g.fillText(PLANET_TOOLTIPS[this.id], mouseX+5, mouseY);
                g.fillText(PLANET_HREF[this.id], 5, canvasH-5);
                
                g.globalAlpha = 1;
            }
        } else{
            this.timeHovered = 0;
        }
    }

    animate(){

        if(this.isPressed){
            this.timePressed++;

            this.x = mouseX - this.w/2;
            this.y = mouseY - this.h/2;

            if(motionSetting.checked){
                this.xVel = mouseX - prevMouseX;
                this.yVel = mouseY - prevMouseY;
            }
            return;
        } else
            this.timePressed = 0;

        if(!motionSetting.checked){
            return;
        }


        // Collisions with waLLs
        if(this.x < 0){
            this.x = 0;
            this.xVel *= -1;
        }
        if(this.y < 0){
            this.y = 0;
            this.yVel *= -1;
        }
        if(this.x + this.w >  mainW){
            this.x = mainW - this.w;
            this.xVel *= -1;
        }
        if(this.y + this.w > mainH){
            this.y = mainH - this.w;
            this.yVel *= -1;
        }


        let oldX = this.x;
        let oldY = this.y;
        this.x += this.xVel;
        this.y += this.yVel;

        let collisionPlanets = this.detectCollisions(planets);

        if(!motionSetting.checked) collisionPlanets.length = 0;

        if(collisionPlanets.length != 0){
            this.x = oldX;
            this.y = oldY;

            for(let i=0; i<collisionPlanets.length; ++i){
                let collisionPlanet = collisionPlanets[i];

                let newVel = this.getNewVelocity(collisionPlanet);
                this.xVel = newVel[0][0];
                this.yVel = newVel[0][1];
                collisionPlanet.xVel = newVel[1][0];
                collisionPlanet.yVel = newVel[1][1];

                this.x = oldX + this.xVel// / this.normSquared(newVel[0]);
                this.y = oldY + this.yVel// / this.normSquared(newVel[0]);

                collisionPlanet.x += collisionPlanet.xVel /// this.normSquared(newVel[1]);
                collisionPlanet.y += collisionPlanet.yVel /// this.normSquared(newVel[1]);

            }
        }
    }

    detectCollisions(planets){

        let collisions = []

        if(this.isPressed)
            return [];

        for(let i=0; i<planets.length; ++i){

            let planet = planets[i];

            let radialCollision = dist([this.x+this.w/2, this.y+this.h/2],
                                    [planet.x+planet.w/2, planet.y+planet.h/2]) < planet.w/2 + this.w/2;
            // console.log("(" + this.id + ","+planet.id+"): "+radialCollision);
            if(this != planet && radialCollision && !planet.isPressed){
                collisions.push(planet)
            }
        }

        return collisions;

    }

    getNewVelocity(planet){

        let x1 = [this.x+this.w/2, this.y+this.h/2]
        let x2 = [planet.x+planet.w/2, planet.y+planet.h/2]
        let v1 = [this.xVel, this.yVel];
        let v2 = [planet.xVel, planet.yVel];
    
        let scalar1 = dotProduct(subVectors(v1,v2), subVectors(x1,x2)) / dotProduct(subVectors(x1,x2), subVectors(x1,x2));
        let newVel1 = subVectors(v1, vectorScale(subVectors(x1,x2), scalar1));
    
        let scalar2 = dotProduct(subVectors(v2,v1), subVectors(x2,x1)) / dotProduct(subVectors(x2,x1), subVectors(x2,x1));
        let newVel2 = subVectors(v2, vectorScale(subVectors(x2,x1), scalar2));
    
        let sysEnergy = calculateSystemEnergy();
        let collisionDampening;


        if(sysEnergy > 500)
            collisionDampening = Math.pow(.9999, -(STABLE_ENERGY - sysEnergy));
        else if(sysEnergy > 100)
            collisionDampening = Math.pow(.999, -(STABLE_ENERGY - sysEnergy));
        else if(sysEnergy > 35)
            collisionDampening = Math.pow(.995, -(STABLE_ENERGY - sysEnergy));
        else if (sysEnergy > 10)
            collisionDampening = Math.pow(.99, -(STABLE_ENERGY - sysEnergy));
        else
            collisionDampening = Math.pow(.95, -(STABLE_ENERGY - sysEnergy));

        return [vectorScale(newVel1, collisionDampening), vectorScale(newVel2, collisionDampening)];
    }
}

function initPlanets(){

    // if(planetDivs.length === 0)
    //     return;

    planets.length = 0;

    const w = mainW, h = mainH;
    const totalArea = w * h;
    const planetSizes = [];

    planetSizes.push([Math.sqrt((totalArea * .25) / Math.PI) * 2 , Math.sqrt((totalArea * .25) / Math.PI) * 2 ]);

    planetSizes.push([Math.sqrt((totalArea * .066) / Math.PI) * 2 , Math.sqrt((totalArea * .066) / Math.PI) * 2 ]);

    planetSizes.push([Math.sqrt((totalArea * .066) / Math.PI) * 2 , Math.sqrt((totalArea * .066) / Math.PI) * 2 ]);

    planetSizes.push([Math.sqrt((totalArea * .026) / Math.PI) * 2 , Math.sqrt((totalArea * .026) / Math.PI) * 2 ]);

    planetSizes.push([Math.sqrt((totalArea * .026) / Math.PI) * 2 , Math.sqrt((totalArea * .026) / Math.PI) * 2]);

    planetSizes.push([Math.sqrt((totalArea * .016) / Math.PI) * 2 , Math.sqrt((totalArea * .016) / Math.PI) * 2 ]);

    const planetLocs = [];
    if(mainW > mainH){
        planetLocs.push([w/2 - planetSizes[0][0]/2,h/2 - planetSizes[0][1]/2]); // Matei Planet
        planetLocs.push([w/7 - planetSizes[1][0]/2, 3*h/4 - planetSizes[1][1]/2]); // Projects Planet
        planetLocs.push([6*w/7 - planetSizes[2][0]/2, h/4 - planetSizes[2][1]/2]); // Lame Planet
        planetLocs.push([7*w/9 - planetSizes[3][0]/2, 4*h/5 - planetSizes[3][1]/2]); // 4 Planet
        planetLocs.push([1*w/7 - planetSizes[4][0]/2, h/6 - planetSizes[4][1]/2]); // 5 Planet
        planetLocs.push([9*w/10 - planetSizes[5][0]/2, 3*h/5 - planetSizes[5][1]/2]); // 6 Planet
    } else {
        planetLocs.push([w/2 - planetSizes[0][0]/2,h/2 - planetSizes[0][1]/2]); // Matei Planet
        planetLocs.push([w/7 - planetSizes[1][0]/2, 5*h/6 - planetSizes[1][1]/2]); // Projects Planet (earth)
        planetLocs.push([6*w/7 - planetSizes[2][0]/2, h/6 - planetSizes[2][1]/2]); // Lame Planet (mars)
        planetLocs.push([7*w/9 - planetSizes[3][0]/2, 4*h/5 - planetSizes[3][1]/2]); // 4 Planet (snow)
        planetLocs.push([1*w/7 - planetSizes[4][0]/2, h/6 - planetSizes[4][1]/2]); // 5 Planet (ring)
        planetLocs.push([7*w/11 - planetSizes[5][0]/2, 11*h/12 - planetSizes[5][1]/2]); // 6 Planet (crater)
    }


    for(let i=0; i<6; i++){
        planets.push(new Planet(planetLocs[i][0], planetLocs[i][1],planetSizes[i][0], planetSizes[i][1], i));
        // banners[i].style.width = planetSizes[i][0]+"px";
    }

}

function changePlanetVels(){

    let speedUp = false;

    if(MAX_SPEED == 1){
        MAX_SPEED = 50;
        speedUp = true;
    } else 
        MAX_SPEED = 1;
    STABLE_ENERGY = MAX_SPEED * MAX_SPEED * PLANET_NAMES.length;

    for(let i=0; i<planets.length; ++i){
        let p = planets[i];

        let speed = Math.sqrt(p.xVel * p.xVel + p.yVel * p.yVel);

        let mult = speedUp ? 50 : 1;

        p.xVel = p.xVel / speed * mult;
        p.yVel = p.yVel / speed * mult;
    }
}



function animatePlanets(g){

    planets.sort((a,b) => a.zIndex - b.zIndex);

    for(let i=0; i<planets.length; ++i){
        let p = planets[i];
        p.animate();
        p.draw(g);
    }

    if(anyPlanetHovered()) canvas.style.cursor = "pointer";
    else canvas.style.cursor = "initial";
}

function planetMouseDown(e){

    if(selectedPlanet != -1) return;

    for(let i=planets.length - 1; i>=0; --i){
        if(dist([mouseX-planets[i].w/2, mouseY-planets[i].h/2],[planets[i].x, planets[i].y]) <= planets[i].w/2){
            selectedPlanet = planets[i].id;
            e.preventDefault();
            planets[i].isPressed = true;
            planets[i].zIndex = 10;
            break;
        }
    }
}
function planetMouseUp(e){
    if(selectedPlanet == -1) return;
    let p = getPlanetById(selectedPlanet);
    p.zIndex = p.id;
    p.isPressed = false;
    prevTimePressed = p.timePressed;
    prevSelected = selectedPlanet;
    selectedPlanet = -1;
}
function planetOnClick(e){
    // console.log(prevTimePressed);
    if(prevTimePressed <= 4){
        window.location.href = PLANET_HREF[getPlanetById(prevSelected).id];
    }
}


function noPlanetPressed(){
    for(let i=0; i<planets.length; i++) if(planets[i].isPressed) return false;
    return true;
}

function anyPlanetHovered(){
    for(let i=0; i<planets.length; ++i) if(planets[i].timeHovered > 0) return true;
    return false;
}

function unPressAllPlanets(){
    for(let i=0; i<planets.length; i++){
        planets[i].isPressed = false;
        planets[i].zIndex = planets[i].id;
    }
    selectedPlanet = -1;
}

function getPlanetById(id){
    for(let i=0; i<planets.length; ++i) if(planets[i].id == id) return planets[i];
    return null;
}


function calculateSystemMomentum(){
    const pVec = [0,0];
    planets.forEach(p => {pVec[0] += p.xVel; pVec[1] += p.yVel;});
    return Math.sqrt(normSquared(pVec));
}
function calculateSystemEnergy(){
    return planets.reduce((sum, planet) => sum += planet.isPressed ? 0 : (normSquared([planet.xVel, planet.yVel])), 0);
}


// Physics Stuff
function dotProduct(v1, v2){
    let sum = 0;
    for(let i=0; i<Math.min(v1.length, v2.length); ++i)
        sum+= v1[i] * v2[i];
    return sum;
}
function subVectors(v1, v2){
    let newVec = [];
    for(let i=0; i<Math.min(v1.length, v2.length); ++i)
        newVec[i] = v1[i] - v2[i];
    return newVec;
}
function vectorScale(v, a){
    let newVec = [];
    for(let i=0; i<v.length; ++i)
        newVec[i] = v[i] * a;
    return newVec;
}
function normSquared(v){
    return dotProduct(v,v);
}
function dist(v1, v2){
    let sum = 0;
    for(let i=0; i<Math.min(v1.length, v2.length); ++i){
        sum += Math.pow(v1[i] - v2[i], 2);
    }
    return Math.sqrt(sum);
}
