const elem = document.createElement("div");
elem.id = 'loader-container';
elem.classList.add('loader-container');
elem.innerHTML = '<div class="spinner"></div>'

document.body.insertBefore(elem,document.body.childNodes[0]);

document.head.innerHTML += '<link rel=\"stylesheet\" href=\"/assets/styles/loader.css\" type=\"text/css\">'

const loaderContainer = document.getElementById("loader-container");

window.addEventListener('load', () => {
    document.getElementById('main').style.visibility = 'visible';
    loaderContainer.style.display = 'none';
    if(document.getElementById('galaxy')!==null) document.getElementById('galaxy').style.visibility="visible";
});