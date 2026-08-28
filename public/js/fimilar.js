const params = new URLSearchParams(window.location.search);
const page = params.get("page");

document.querySelectorAll(".fimilar section").forEach(section => {
    section.classList.remove("active");
});

const section = document.getElementById(page);

if(section) {
    section.classList.add("active");
}
else{
    document.getElementById("about").classList.add("active");
}