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
  effect: "cards",
  grabCursor: true,
  autoplay: {
      delay: 3500,
      disableOnInteraction: false,
  }
});