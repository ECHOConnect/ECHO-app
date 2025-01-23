var swiper = new Swiper(".mySwiper", {
    pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
    },
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    }
});

var swiper = new Swiper(".mySwiperLP", {
    grabCursor: true,
    effect: "creative",
    creativeEffect: {
      prev: {
        shadow: true,
        translate: [0, 0, -400],
      },
      next: {
        translate: ["100%", 0, 0],
      },
    },
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    }
  });
  
