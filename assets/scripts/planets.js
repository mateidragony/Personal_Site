const planets = []
const PLANET_NAMES = ["Sun", "Earth", "Mars", "Snow", "Gas", "Crater"];
// const collisionCD = {}

const MAX_SPEED = 1;
const HITBOX_LEEWAY = 0;
const STABLE_ENERGY = MAX_SPEED * MAX_SPEED * PLANET_NAMES.length;

class Planet{
    constructor(x,y, div, id, name){
        this.x=x;
        this.y=y;

        let angle = Math.random() * 2 * Math.PI;
        this.xVel = MAX_SPEED * Math.cos(angle);
        this.yVel = MAX_SPEED * Math.sin(angle);

        this.div = div;
        this.banner = this.div.getElementsByClassName("banner")[0];
        this.id = id;

        this.isPressed = false;
        this.timePressed = 0;
    }

    animate(){

        if(this.isPressed){
            this.timePressed++;

            this.x = mouseX - this.div.clientWidth/2;
            this.y = mouseY - this.div.clientHeight/2;

            this.xVel = mouseX - prevMouseX;
            this.yVel = mouseY - prevMouseY;
        } else
            this.timePressed = 0;

        // this.handleCollisionCD();

        this.div.style.left = this.x+"px";
        this.div.style.top = this.y+"px";

        if(this.banner !== undefined){
            this.banner.style.top = this.div.clientHeight* (3/4) - this.banner.clientHeight/2 + "px";
        }


        // Collisions between planets .2, .15, .36

        // Collisions with waLLs
        if(this.x < 0){
            this.x = 0;
            this.xVel *= -1;
        }
        if(this.y < 0){
            this.y = 0;
            this.yVel *= -1;
        }
        if(this.x + this.div.clientWidth >  main.clientWidth){
            this.x = main.clientWidth - this.div.clientWidth;
            this.xVel *= -1;
        }
        if(this.y + this.div.clientHeight > main.clientHeight){
            this.y = main.clientHeight - this.div.clientHeight;
            this.yVel *= -1;
        }


        let oldX = this.x;
        let oldY = this.y;
        this.x += this.xVel;
        this.y += this.yVel;

        let collisionPlanets = this.detectCollisions(planets);

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

            let radialCollision = dist(this.x+this.div.clientWidth/2, this.y+this.div.clientHeight/2,
                                    planet.x+planet.div.clientWidth/2, planet.y+planet.div.clientHeight/2) < planet.div.clientWidth/2 + this.div.clientWidth/2;

            if(this != planet && radialCollision && !planet.isPressed){
                collisions.push(planet)
            }
        }

        return collisions;

    }

    getNewVelocity(planet){
        let x1 = [this.x+this.div.clientWidth/2, this.y+this.div.clientHeight/2]
        let x2 = [planet.x+planet.div.clientWidth/2, planet.y+planet.div.clientHeight/2]
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

    if(planetDivs.length === 0)
        return;

    planets.length = 0;

    const w = main.clientWidth, h = main.clientHeight;
    const totalArea = w * h;

    planetDivs[0].style.width = Math.sqrt((totalArea * .25) / Math.PI) * 2 + "px";
    planetDivs[0].style.height = Math.sqrt((totalArea * .25) / Math.PI) * 2 + "px";

    planetDivs[1].style.width = Math.sqrt((totalArea * .066) / Math.PI) * 2 + "px";
    planetDivs[1].style.height = Math.sqrt((totalArea * .066) / Math.PI) * 2 + "px";

    planetDivs[2].style.width = Math.sqrt((totalArea * .066) / Math.PI) * 2 + "px";
    planetDivs[2].style.height = Math.sqrt((totalArea * .066) / Math.PI) * 2 + "px";

    planetDivs[3].style.width = Math.sqrt((totalArea * .026) / Math.PI) * 2 + "px";
    planetDivs[3].style.height = Math.sqrt((totalArea * .026) / Math.PI) * 2 + "px";

    planetDivs[4].style.width = Math.sqrt((totalArea * .026) / Math.PI) * 2 + "px";
    planetDivs[4].style.height = Math.sqrt((totalArea * .026) / Math.PI) * 2 + "px";

    planetDivs[5].style.width = Math.sqrt((totalArea * .016) / Math.PI) * 2 + "px";
    planetDivs[5].style.height = Math.sqrt((totalArea * .016) / Math.PI) * 2 + "px";

    const planetLocs = [];
    if(main.clientWidth > main.clientHeight){
        planetLocs.push([w/2 - planetDivs[0].clientWidth/2,h/2 - planetDivs[0].clientHeight/2]); // Matei Planet
        planetLocs.push([w/7 - planetDivs[1].clientWidth/2, 3*h/4 - planetDivs[1].clientHeight/2]); // Projects Planet
        planetLocs.push([6*w/7 - planetDivs[2].clientWidth/2, h/4 - planetDivs[2].clientHeight/2]); // Lame Planet
        planetLocs.push([7*w/9 - planetDivs[3].clientWidth/2, 4*h/5 - planetDivs[3].clientHeight/2]); // 4 Planet
        planetLocs.push([1*w/7 - planetDivs[4].clientWidth/2, h/6 - planetDivs[4].clientHeight/2]); // 5 Planet
        planetLocs.push([9*w/10 - planetDivs[5].clientWidth/2, 3*h/5 - planetDivs[5].clientHeight/2]); // 6 Planet
    } else {
        planetLocs.push([w/2 - planetDivs[0].clientWidth/2,h/2 - planetDivs[0].clientHeight/2]); // Matei Planet
        planetLocs.push([w/7 - planetDivs[1].clientWidth/2, 5*h/6 - planetDivs[1].clientHeight/2]); // Projects Planet (earth)
        planetLocs.push([6*w/7 - planetDivs[2].clientWidth/2, h/6 - planetDivs[2].clientHeight/2]); // Lame Planet (mars)
        planetLocs.push([7*w/9 - planetDivs[3].clientWidth/2, 4*h/5 - planetDivs[3].clientHeight/2]); // 4 Planet (snow)
        planetLocs.push([1*w/7 - planetDivs[4].clientWidth/2, h/6 - planetDivs[4].clientHeight/2]); // 5 Planet (ring)
        planetLocs.push([7*w/11 - planetDivs[5].clientWidth/2, 11*h/12 - planetDivs[5].clientHeight/2]); // 6 Planet (crater)
    }


    for(let i=0; i<planetDivs.length; i++){
        planets.push(new Planet(planetLocs[i][0], planetLocs[i][1],planetDivs[i], i));
        // let fontSize =  Math.sqrt(planetDivs[i].clientWidth * planetDivs[i].clientHeight)/(i===0 ? 13 : 11);
        // planetDivs[i].getElementsByClassName("planet-inner-div")[0].getElementsByClassName("planet-desc")[0].style.fontSize = fontSize+"px";
    }

}

function animatePlanets(){
    planets.forEach(p => p.animate());
}


function addPlanetOnClick(){
    for(let i=0; i<planetDivs.length; i++){
        let p = planetDivs[i];
        p.onmousedown = (e) => {
            if(noPlanetPressed()){
                e.preventDefault();
                planets[i].isPressed = true;
                p.style.zIndex = "10";
            }
            console.log(planets[i].timePressed);
        };

        p.onmouseup = (e) => {
            planets[i].isPressed = false;
            p.style.zIndex = "auto";
        };

        p.onclick = (e) => {if(planets[i].timePressed > 4) e.preventDefault();}; // prevent link from redirecting if users want to fuck around
    }
}


function noPlanetPressed(){
    for(let i=0; i<planets.length; i++)
        if(planets[i].isPressed)
            return false;
    return true;
}

function unPressAllPlanets(){
    for(let i=0; i<planets.length; i++){
        planets[i].isPressed = false;
        planetDivs[i].style.zIndex = "auto";
    }
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
function dist(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2, 2));
}
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