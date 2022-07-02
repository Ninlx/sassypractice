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
    damping: 1.75,
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
      this.mouseLast.x = lerp(this.mouseLast.x, this.mouseCurrent.x, 0.95);
      this.mouseLast.y = lerp(this.mouseLast.y, this.mouseCurrent.y, 0.95);
      this.mouseLast.x = Math.floor(this.mouseLast.x * 100) / 100;
      this.mouseLast.y = Math.floor(this.mouseLast.y * 100) / 100;
      this.cursor.style.transform = `translate3d(${this.mouseLast.x}px, ${this.mouseLast.y}px, 0)`;
      this.rAF = requestAnimationFrame(this.run);
    }
    requestAnimationFrame() {
      this.rAF = requestAnimationFrame(this.run);
    }
    addEvents() {
      window.addEventListener("mousemove", this.getMousePosition, true);
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

  let renderer,
    scene,
    camera,
    sphereBg,
    nucleus,
    stars,
    controls,
    container = document.getElementById("cnvscntnr"),
    timeout_Debounce,
    noise = new SimplexNoise(),
    cameraSpeed = 0,
    blobScale = 3;

  init();
  animate();

  function init() {
    const cnvscntnr = document.getElementById("cnvscntnr");

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      55,
      cnvscntnr.offsetWidth / cnvscntnr.offsetHeight,
      0.01,
      1000
    );
    camera.position.set(0, 0, 230);

    const directionalLight = new THREE.DirectionalLight("#fff", 2);
    directionalLight.position.set(0, 50, -20);
    scene.add(directionalLight);

    let ambientLight = new THREE.AmbientLight("#ffffff", 1);
    ambientLight.position.set(0, 20, 20);
    scene.add(ambientLight);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: document.querySelector("canvas"),
      alpha: true,
    });

    renderer.setSize(cnvscntnr.offsetWidth, cnvscntnr.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    //OrbitControl
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;
    controls.minDistance = 410.95;
    controls.maxDistance = 410.95;
    controls.enablePan = true;

    const loader = new THREE.TextureLoader();
    const textureSphereBg = loader.load(
      "https://i.ibb.co/4gHcRZD/bg3-je3ddz.jpg"
    );
    const texturenucleus = loader.load(
      "https://i.ibb.co/hcN2qXk/star-nc8wkw.jpg"
    );
    const textureStar = loader.load("https://i.ibb.co/ZKsdYSz/p1-g3zb2a.png");
    const texture1 = loader.load("https://i.ibb.co/F8by6wW/p2-b3gnym.png");
    const texture2 = loader.load("https://i.ibb.co/yYS2yx5/p3-ttfn70.png");
    const texture4 = loader.load("https://i.ibb.co/yWfKkHh/p4-avirap.png");

    /*  Nucleus  */
    texturenucleus.anisotropy = 16;
    let icosahedronGeometry = new THREE.IcosahedronGeometry(30, 10);
    let lambertMaterial = new THREE.MeshPhongMaterial({ map: texturenucleus });
    nucleus = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    scene.add(nucleus);

    /*    Sphere  Background   */
    textureSphereBg.anisotropy = 16;
    let geometrySphereBg = new THREE.SphereBufferGeometry(150, 40, 40);
    let materialSphereBg = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      map: textureSphereBg,
    });
    sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
    scene.add(sphereBg);

    /*    Moving Stars   */
    let starsGeometry = new THREE.Geometry();

    for (let i = 0; i < 50; i++) {
      let particleStar = randomPointSphere(150);

      particleStar.velocity = THREE.MathUtils.randInt(50, 200);

      particleStar.startX = particleStar.x;
      particleStar.startY = particleStar.y;
      particleStar.startZ = particleStar.z;

      starsGeometry.vertices.push(particleStar);
    }
    let starsMaterial = new THREE.PointsMaterial({
      size: 5,
      color: "#ffffff",
      transparent: true,
      opacity: 0.8,
      map: textureStar,
      blending: THREE.AdditiveBlending,
    });
    starsMaterial.depthWrite = false;
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    /*    Fixed Stars   */
    function createStars(texture, size, total) {
      let pointGeometry = new THREE.Geometry();
      let pointMaterial = new THREE.PointsMaterial({
        size: size,
        map: texture,
        blending: THREE.AdditiveBlending,
      });

      for (let i = 0; i < total; i++) {
        let radius = THREE.MathUtils.randInt(149, 70);
        let particles = randomPointSphere(radius);
        pointGeometry.vertices.push(particles);
      }
      return new THREE.Points(pointGeometry, pointMaterial);
    }
    scene.add(createStars(texture1, 15, 20));
    scene.add(createStars(texture2, 5, 5));
    scene.add(createStars(texture4, 7, 5));

    function randomPointSphere(radius) {
      let theta = 2 * Math.PI * Math.random();
      let phi = Math.acos(2 * Math.random() - 1);
      let dx = 0 + radius * Math.sin(phi) * Math.cos(theta);
      let dy = 0 + radius * Math.sin(phi) * Math.sin(theta);
      let dz = 0 + radius * Math.cos(phi);
      return new THREE.Vector3(dx, dy, dz);
    }
  }

  function animate() {
    //Stars  Animation
    stars.geometry.vertices.forEach(function (v) {
      v.x += (0 - v.x) / v.velocity;
      v.y += (0 - v.y) / v.velocity;
      v.z += (0 - v.z) / v.velocity;

      v.velocity -= 0.3;

      if (v.x <= 5 && v.x >= -5 && v.z <= 5 && v.z >= -5) {
        v.x = v.startX;
        v.y = v.startY;
        v.z = v.startZ;
        v.velocity = THREE.MathUtils.randInt(50, 300);
      }
    });

    //Nucleus Animation
    nucleus.geometry.vertices.forEach(function (v) {
      let time = Date.now();
      v.normalize();
      let distance =
        nucleus.geometry.parameters.radius +
        noise.noise3D(
          v.x + time * 0.0005,
          v.y + time * 0.0003,
          v.z + time * 0.0008
        ) *
          blobScale;
      v.multiplyScalar(distance);
    });
    nucleus.geometry.verticesNeedUpdate = true;
    nucleus.geometry.normalsNeedUpdate = true;
    nucleus.geometry.computeVertexNormals();
    nucleus.geometry.computeFaceNormals();
    nucleus.rotation.y += 0.002;

    //Sphere Beckground Animation
    sphereBg.rotation.x += 0.002;
    sphereBg.rotation.y += 0.002;
    sphereBg.rotation.z += 0.002;

    controls.update();
    stars.geometry.verticesNeedUpdate = true;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  /*     Resize     */
  window.addEventListener("resize", () => {
    clearTimeout(timeout_Debounce);
    timeout_Debounce = setTimeout(onWindowResize, 70);
  });
  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  /*     Fullscreen btn     */
  // let fullscreen;
  // let fsEnter = document.getElementById('fullscr');
  // fsEnter.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     if (!fullscreen) {
  //         fullscreen = true;
  //         document.documentElement.requestFullscreen();
  //         fsEnter.innerHTML = "Exit Fullscreen";
  //     }
  //     else {
  //         fullscreen = false;
  //         document.exitFullscreen();
  //         fsEnter.innerHTML = "Go Fullscreen";
  //     }
  // });

  // particlesJS.load("particles-js", "particles.json", function () {});
})(jQuery);
