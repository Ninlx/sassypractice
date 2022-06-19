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

$(".hamburger-menu").on("click", function (e) {
  if ($("body").hasClass("hamburger-navigation-active")) {
    $("body .hamburger-navigation").css("transition", "");
    $("body .hamburger-navigation").css("transition-delay", "0.6s");
    $("body .hamburger-navigation .nav-menu").css("transition-delay", "0s");
    $("body .hamburger-navigation .info-box").css("transition-delay", "0.2s");
    $("body .navbar .logo").css("transition-delay", "1.2s");
    $("body .navbar .navbar-text").css("transition-delay", "1.2s");
    $("body .navbar .site-menu").css("transition-delay", "1.2s");

    window.setTimeout(function () {
      $("body .hamburger-navigation").css("top", "0");
      $("body .hamburger-navigation").css("transition", "none");
    }, 2000);

    $("body.hamburger-navigation-active .hamburger-navigation").css(
      "top",
      "100vh"
    );
  } else {
    $("body .hamburger-navigation").css("transition", "");
    $("body .hamburger-navigation").css("transition-delay", "0s");
    $("body .hamburger-navigation .nav-menu").css("transition-delay", "1.5s");
    $("body .hamburger-navigation .info-box").css("transition-delay", "1.7s");
    $("body .navbar .logo").css("transition-delay", "0s");
    $("body .navbar .navbar-text").css("transition-delay", "0s");
    $("body .navbar .site-menu").css("transition-delay", "0s");
  }
  $(".hamburger-menu svg").toggleClass("opened");
  $("body").toggleClass("hamburger-navigation-active");
});

/* MAGNET CURSOR*/
var cerchio = document.querySelectorAll(".header__menu");
cerchio.forEach(function (elem) {
  $(document).on("mousemove touch", function (e) {
    magnetize(elem, e);
  });
});

function magnetize(el, e) {
  var mX = e.pageX,
    mY = e.pageY;
  const item = $(el);

  const customDist = item.data("dist") * 20 || 80;
  const centerX = item.offset().left + item.width() / 2;
  const centerY = item.offset().top + item.height() / 2;

  var deltaX = Math.floor(centerX - mX) * -0.35;
  var deltaY = Math.floor(centerY - mY) * -0.35;

  var distance = calculateDistance(item, mX, mY);

  if (distance < customDist) {
    TweenMax.to(item, 0.5, {
      y: deltaY,
      x: deltaX,
      scale: 1,
    });
    item.addClass("magnet");
  } else {
    TweenMax.to(item, 0.6, {
      y: 0,
      x: 0,
      scale: 1,
    });
    item.removeClass("magnet");
  }
}

function calculateDistance(elem, mouseX, mouseY) {
  return Math.floor(
    Math.sqrt(
      Math.pow(mouseX - (elem.offset().left + elem.width() / 2), 2) +
        Math.pow(mouseY - (elem.offset().top + elem.height() / 2), 2)
    )
  );
}

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

class Cursor {
  constructor() {
    this.bind();
    this.cursor = document.querySelector(".cursor__conn");
    this.mouseCurrent = {
      x: 0,
      y: 0,
    };
    this.mouseLast = {
      x: this.mouseCurrent.x,
      y: this.mouseCurrent.y,
    };
    this.rAF = undefined;
  }

  bind() {
    ["getMousePosition", "run"].forEach(
      (fn) => (this[fn] = this[fn].bind(this))
    );
  }

  getMousePosition(e) {
    this.mouseCurrent = {
      x: e.clientX,
      y: e.clientY,
    };
  }

  run() {
    this.mouseLast.x = lerp(this.mouseLast.x, this.mouseCurrent.x, 0.2);
    this.mouseLast.y = lerp(this.mouseLast.y, this.mouseCurrent.y, 0.2);
    this.mouseLast.x = Math.floor(this.mouseLast.x * 100) / 100;
    this.mouseLast.y = Math.floor(this.mouseLast.y * 100) / 100;
    this.cursor.style.transform = `translate3d(${this.mouseLast.x}px, ${this.mouseLast.y}px, 0)`;
    this.rAF = requestAnimationFrame(this.run);
  }

  requestAnimationFrame() {
    this.rAF = requestAnimationFrame(this.run);
  }

  addEvents() {
    window.addEventListener("mousemove", this.getMousePosition, false);
  }

  on() {
    this.addEvents();
    this.requestAnimationFrame();
  }

  init() {
    this.on();
  }
}

if ($(".cursor__conn").length > 0) {
  const cursor = new Cursor();
  cursor.init();

  /* conditions */
  $(".carousel-image-box").hover(function () {
    $(".cursor").toggleClass("drag");
  });

  $(
    "button, .header__brand, .header__links, .header__menu, .header__feature-wrapper, .branding__single"
  ).hover(function () {
    $(".cursor").toggleClass("light");
  });
}
