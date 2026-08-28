function load(file, id) {
    fetch(file)
        .then(res => res.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}

load('header.html', 'header');
load('footer.html', 'footer');


