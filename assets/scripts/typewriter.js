const messages = ["Hi! I'm Matéi Cloteaux", "Welcome to my super cool site!", "Try throwing the planets around :)", "Isn't this so exciting!"];
let cur = 0;

const WORD_DELAY = 3000;
const CHAR_DELAY = 50;
const INIT_DELAY = 700;

const delay = ms => new Promise(res => setTimeout(res, ms));

async function writeNewMsg(sunDesc){

    if(sunDesc == null) return;

    //write it out
    let i=0;
    while(sunDesc.innerText.length < messages[cur].length){
        if(messages[cur][i] === " "){
            sunDesc.innerText += (messages[cur][i++] + messages[cur][i++]);
        } else {
            sunDesc.innerText += messages[cur][i++];
        }
        await delay(CHAR_DELAY);
    }

    // wait a bit
    await delay(WORD_DELAY);

    // delete that mofo
    while(sunDesc.innerText.length > 0){
        sunDesc.innerText = sunDesc.innerText.slice(0, -1);
        await delay(CHAR_DELAY);
    }

    // wait a bit
    await delay(CHAR_DELAY * 5);

    cur = (cur + 1) % messages.length;
    writeNewMsg(sunDesc); // recursive call :)
}