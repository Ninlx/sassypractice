(function ($) {
  $(function () {
    "use strict";
    $(".hamburger-menu").on("click", function (e) {
      $(this).toggleClass("opened");
      $(".header__navbar").toggleClass("show");
    });
  });

  Scrollbar.use(OverscrollPlugin);
  var scrlbr = Scrollbar.init(document.querySelector("#main"), custom);

  const custom = {
    damping: 0.95,
  };

  var hdrfx = document.querySelector(".header");
  scrlbr.addListener(function (status) {
    var offset = status.offset;
    hdrfx.style.top = offset.y + "px";
    hdrfx.style.left = offset.x + "px";
  });

  /* --------------------------- cursor magnet --------------------------- */
  var cerchio = document.querySelectorAll(
    ".header__brand, .header__items, .link__button, .custom__button, .hamburger-menu"
  );
  cerchio.forEach(function (elem) {
    $(document).on("mousemove touch", function (e) {
      magnetize(elem, e);
    });
  });
  function magnetize(el, e) {
    var mX = e.pageX,
      mY = e.pageY;
    const item = $(el);
    const customDist = item.data("dist") * 70 || 120;
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
      TweenMax.to(item, 0.7, {
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

  /* --------------------------- cursor init --------------------------- */
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

    /* --------------------------- cursor conditions --------------------------- */
    $(".carousel-image-box").hover(function () {
      $(".cursor").toggleClass("drag");
    });
    $(".header__brand, .header__items").hover(function () {
      $(".cursor").toggleClass("navlinks");
    });
    $(".link__button, .custom__button").hover(function () {
      $(".cursor").toggleClass("button");
    });
    $(".header__brand").hover(function () {
      $(".cursor").toggleClass("brand");
    });
    $(".hamburger-menu").hover(function () {
      $(".cursor").toggleClass("hamburger");
    });
  }

  /* --------------------------- preloader --------------------------- */
  var width = 100,
    perfData = window.performance.timing, // The PerformanceTiming interface represents timing-related performance information for the given page.
    EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
    time = parseInt((EstimatedTime / 1000) % 60) * 60;
  $(".loadbar").animate(
    {
      width: width + "%",
    },
    time
  );
  function animateValue(id, start, end, duration) {
    var range = end - start,
      current = start,
      increment = end > start ? 1 : -1,
      stepTime = Math.abs(Math.floor(duration / range)),
      obj = $(id);
    var timer = setInterval(function () {
      current += increment;
      $(obj).text(current + "%");
      if (current == end) {
        clearInterval(timer);
      }
    }, stepTime);
  }
  setTimeout(function () {
    $("body").addClass("page-loaded");
  }, time);
})(jQuery);

particlesJS.load("particles-js", "particles.json", function () {});
