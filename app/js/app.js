// const activePage = window.location.pathname;
// const navlinks = document.querySelectorAll("nav a");
// navlinks.forEach((link) => {
//   if (link.href.includes(`${activePage}`)) {
//     link.classList.add("function");
//   } else {
//     $(document).on("click", "ul li", function () {
//       $(this).addClass("function").siblings().removeClass("function");
//     });
//   }
// });

$(function () {
  $("body").css("background", "#e2e2e2");
});

$(document).on("click", ".header__items", function () {
  $(this).addClass("function").siblings().removeClass("function");
});

// window.onscroll = () => {
//   const header = document.querySelector(".header");
//   header.classList.toggle("sticky", window.scrollY > 0);
//   if (window.scrollY > 100) {
//     document.getElementById("scroller").classList.add("scroll");
//   } else {
//     document.getElementById("scroller").classList.remove("scroll");
//   }
// };
