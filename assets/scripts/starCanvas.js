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

let starFrameNumber = 0;

function initStarFrame(){
    stars.length = 0;
    for(let i=0; i<250; ++i)
        stars.push(new Star(Math.random()*canvas.clientWidth,Math.random()*canvas.clientHeight,Math.random()*10 +1, Math.random()*.6 + .4));

    // do quasar stuffs
    if(drawQuasar){
        let quasarSize = Math.sqrt((canvas.clientWidth*canvas.clientHeight)/4);
        let quasarX = Math.min(50, main.clientWidth/2 - quasarSize/2);
        stars.push(new Quasar(quasarX,50, quasarSize,.1));
    }

    // do galaxy stuffs
    if(galaxy !== null){
        let galaxySize = Math.sqrt((canvas.clientWidth*canvas.clientHeight)/3);

        galaxy.style.width = galaxySize+"px";
        // 1/3 is white space
        galaxy.style.bottom = (-galaxySize/4)+canvas.clientWidth/50 + "px";
    }

    renderStarFrame();
}

function renderStarFrame(){

    starFrameNumber++;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    g.imageSmoothingEnabled = false;

    g.fillStyle = "rgba(0,0,0,0)";
    g.fillRect(0,0,cw,ch);

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
        let starX = (canvas.clientWidth/2 + Math.random() * 500 - 250) - 1000 * Math.cos(angle);
        let starY =  (canvas.clientHeight/2 + Math.random() * 500 - 250) - 1000 * Math.sin(angle);
        stars.push(new ShootingStar(starX,starY,Math.random() * 150 + 100,Math.cos(angle) * speed, Math.sin(angle) * speed))
    }

    // g.drawImage(quasarImg, 10,10,200,200);

    g.fillStyle="red";
    g.font="20px sans-serif";
    // g.fillText("w: "+canvas.clientWidth + ", h: "+canvas.clientHeight,1000,100);
}

class Star{
    constructor(x,y,w,o){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=w+1;
        this.o=o;
        this.increasingOpacity = true;
        this.hue = Math.random() * 360;
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

        g.save();
        g.filter = "hue-rotate(" + this.hue +"deg)";
        g.globalAlpha = this.o;
        g.drawImage(starImg,this.x,this.y,this.w,this.h);
        g.restore();
    }

    animate(){

    }

    outOfBounds(){
        return this.x<-1000 || this.y<-1000 || this.x>canvas.clientWidth+1000 || this.y > canvas.clientHeight+1000;
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
        // g.fillStyle = "red";
        // g.fillRect(this.x,this.y,this.w,this.h);
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