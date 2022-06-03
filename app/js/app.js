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

$(document).on("click", ".header__item", function () {
  $(this).addClass("function").siblings().removeClass("function");
});
