const input = document.getElementById("longUrl");
const output = document.getElementById("shortUrl");
const enter = document.getElementById("submit");

enter.onclick = function(e){

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/api/url/shorten", true);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.withCredentials = 'true';
    const body = JSON.stringify({
        longUrl: input.value
    });
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 201 || xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            output.innerHTML = response.shortUrl;
            output.setAttribute("href", response.shortUrl);
        } else {
            console.log(`Error : ${xhr.status}`);
            console.log(xhr.responseText);
            output.innerHTML = "Invalid URL Entered";
      }
    };
    xhr.send(body);

}