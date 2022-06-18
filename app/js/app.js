$(function () {
  $("body").css("background", "#e2e2e2");
});

$(document).on("click", ".header__items", function () {
  $(this).addClass("function").siblings().removeClass("function");
});

$(".header__hamburger").on("click", function (e) {
  $(this).toggleClass("opened");
  $(".header__navbar").toggleClass("function");
});
