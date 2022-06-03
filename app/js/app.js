$(function () {
  $("body").css("background", "#e2e2e2");
});

const activePage = window.location.pathname;
const navlinks = document.querySelectorAll("nav a");
navlinks.forEach((link) => {
  if (link.href.includes(`${activePage}`)) {
    link.classList.add("function");
  }
});
