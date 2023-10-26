

function spanEachCharInP(p){
    let text = p.innerText;
    let newHTML = "";
    p.innerHTML = "";

    for(let i=0; i<text.length; ++i){
        newHTML += "<span style=\"--i:"+i+"\">"+text.charAt(i)+"</span>";
    }

    p.innerHTML = newHTML;
}

function calculateAge(){
    return (Date.now() - 1095375065000) / 31536000000;   
}