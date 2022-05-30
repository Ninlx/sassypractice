const body = (document.querySelector("body").style.background = "#282828");
$(document).ready(function () {
  $("body").css("color", "#282828");
});

$(document).on('click', '.header .navbar .navbar-nav .nav-item', function(){
  $(this).addClass('function').siblings().removeClass('function');
})