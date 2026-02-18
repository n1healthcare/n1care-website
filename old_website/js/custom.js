// slick carousel ///////////////
$(".bios_slick").slick({
  dots: true,
  arrows: false,
  infinite: true,
  autoplay: false,
  speed: 1100,
  autoplaySpeed: 3300,
  cssEase: "ease",
  easing: "linear",
  fade: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  // centerMode: false,
  // variableWidth: false,
});

// mobile navigatino....................
let toggeBtn = document.getElementById("nav_togge_btn");
let mobileNav = document.querySelector(".nav_menu");
toggeBtn.addEventListener("click", () => {
  mobileNav.classList.toggle("show");
});
