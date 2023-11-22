const stars = [];

const starImg = new Image();
starImg.src = "/assets/Images/star.webp";
const shootingStarImg = new Image();
shootingStarImg.src = "/assets/Images/shooting_star.webp";
const quasarImg = new Image();
quasarImg.src = "/assets/Images/quasar.webp";

const MAX_STAR_SPEED = 40;
const MIN_STAR_SPEED = 25;
const FRAMES_BETWEEN_SHOOTING_STARS = 150;
const STAR_TWINKLE_SPEED = 0.4;
const QUASAR_TWINKLE_SPEED = 0.02;
const NUM_STARS = 150;

const STAR_COLORS = ["#F8FFC1", "#D9FFC1", "#FFD8C1", "#FFC1C1", "#C1FFED", "#C1CEFF", "#E2C1FF", "#C7FFC1"];

let starFrameNumber = 0;

function initStarFrame(){
    stars.length = 0;
    for(let i=0; i<NUM_STARS; ++i)
        stars.push(new Star(Math.random()*canvasW,Math.random()*canvasH,Math.random()*10 +1, Math.random()*.6 + .4));

    // do quasar stuffs
    if(drawQuasar){
        let quasarSize = Math.sqrt((canvasW*canvasH)/4);
        let quasarX = Math.min(50, canvasW/2 - quasarSize/2);
        stars.push(new Quasar(quasarX,50, quasarSize,.1));
    }

    // do galaxy stuffs
    // if(galaxy != undefined){
    //     let galaxySize = Math.sqrt((canvasW*canvasH)/3);

    //     galaxy.style.width = galaxySize+"px";
    //     // 1/3 is white space
    //     galaxy.style.bottom = (-galaxySize/4)+canvasW/50 + "px";
    // }

    renderStarFrame();
}

function renderStarFrame(){

    starFrameNumber++;

    const cw = canvasW;
    const ch = canvasH;

    g.imageSmoothingEnabled = false;

    g.fillStyle = "#000";
    g.fillRect(0,0,cw,ch);

    if(!starAnimateSetting.checked) return;

    for(let i=0; i<stars.length; ++i){
        stars[i].animate();
        stars[i].draw(g);
        if(stars[i].outOfBounds()){
            stars.splice(i, 1);
            i--;
        }
    }


    // Launch shooting stars
    if(starFrameNumber % FRAMES_BETWEEN_SHOOTING_STARS == 0){
        let angle = Math.random() * 2 * Math.PI;
        let speed = Math.random() * (MAX_STAR_SPEED - MIN_STAR_SPEED) + MIN_STAR_SPEED;
        let starX = (canvasW/2 + Math.random() * 500 - 250) - 1000 * Math.cos(angle);
        let starY =  (canvasH/2 + Math.random() * 500 - 250) - 1000 * Math.sin(angle);
        stars.push(new ShootingStar(starX,starY,Math.random() * 150 + 100,Math.cos(angle) * speed, Math.sin(angle) * speed))
    }

    // g.drawImage(quasarImg, 10,10,200,200);
    // g.fillText("w: "+canvasW + ", h: "+canvasH,1000,100);
    // g.fillStyle = "white";
    // g.fillRect(0,0,100000,1000000);
}

class Star{
    constructor(x,y,w,o){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=w+1;
        this.o=o;
        this.increasingOpacity = true;
        this.color = STAR_COLORS[~~(Math.random() * STAR_COLORS.length)];
    }

    draw(g){
        if(this.increasingOpacity){
            this.o += STAR_TWINKLE_SPEED*(Math.random()*STAR_TWINKLE_SPEED/10+STAR_TWINKLE_SPEED/10);
            if(this.o >= 1){
                this.o = 1;
                this.increasingOpacity = false;
            }
        } else {
            this.o -= STAR_TWINKLE_SPEED*(Math.random()*STAR_TWINKLE_SPEED/10+STAR_TWINKLE_SPEED/10);
            if(this.o <= .2){
                this.o = .2;
                this.increasingOpacity = true;
            }
        }

        g.fillStyle = this.color;

        g.globalAlpha = this.o;
        g.fillRect(this.x + this.w/2 - this.w/10, this.y, this.w/5 , this.h); // top to bottom
        g.fillRect(this.x, this.y+this.h/2 - this.h/14, this.w, this.h/7) // left to right
        g.fillRect(this.x + this.w/5, this.y + this.h * 2 / 7, this.w * 3 / 5, this.h * 3 / 7); // center rect
        g.globalAlpha = 1;
    }

    animate(){

    }

    outOfBounds(){
        return this.x<-1000 || this.y<-1000 || this.x>canvasW+1000 || this.y > canvasH+1000;
    }

    hslaToRgba(h, s, l){
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
}

class ShootingStar extends Star{
    constructor(x,y,w,xVel, yVel){
        super(x,y,w,1);
        this.h = 8/85 * this.w;
        this.xVel = xVel;
        this.yVel = yVel;
    }

    draw(g){
        g.save(); // save current state
        g.translate(this.x + this.w/2, this.y + this.h/2); // change origin
        g.rotate(Math.atan(this.yVel/this.xVel)+ (this.xVel >= 0 ? 0 : Math.PI)); // rotate
        g.translate(-(this.x + this.w/2), -(this.y + this.h/2)); // reset origin
        g.drawImage(shootingStarImg,this.x,this.y,this.w,this.h); // draws a chain link or dagger
        g.restore(); // restore original states (no rotation etc)
    }

    animate(){
        this.x += this.xVel;
        this.y += this.yVel;
    }
}

class Quasar extends Star{
    constructor(x,y,w,o){
        super(x,y,w,0);
    }

    draw(g){
        if(this.increasingOpacity){
            this.o += QUASAR_TWINKLE_SPEED*(Math.random()*QUASAR_TWINKLE_SPEED+QUASAR_TWINKLE_SPEED);
            if(this.o >= .2){
                this.o = .2;
                this.increasingOpacity = false;
            }
        } else {
            this.o -= QUASAR_TWINKLE_SPEED*(Math.random()*QUASAR_TWINKLE_SPEED+QUASAR_TWINKLE_SPEED);
            if(this.o <= .1){
                this.o = .1;
                this.increasingOpacity = true;
            }
        }

        g.save();
        g.globalAlpha = this.o;
        g.drawImage(quasarImg,this.x,this.y,this.w,this.h);
        g.restore();
    }
}
