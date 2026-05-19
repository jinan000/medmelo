class Slider {
  constructor(sliderElement) {
    this.slider = sliderElement;
    this.sliderId = sliderElement.dataset.sliderId;
    this.slides = sliderElement.querySelectorAll('.slide');
    this.titles = sliderElement.querySelectorAll('.text-content h2');
    this.dots = sliderElement.querySelectorAll('.dot');
    this.prevArrow = sliderElement.querySelector('.prev-arrow');
    this.nextArrow = sliderElement.querySelector('.next-arrow');
    this.container = sliderElement.querySelector('.slide-container');
    this.slideIndex = Array.from(this.slides).findIndex(slide => slide.classList.contains('active')) + 1 || 1;
    this.isSingleSlide = this.slides.length === 1;
    this.isAutoSliding = !this.isSingleSlide;

    this.initialize();
  }

  initialize() {
    try {
      if (this.isSingleSlide) {
        if (this.prevArrow) this.prevArrow.classList.add('hidden');
        if (this.nextArrow) this.nextArrow.classList.add('hidden');
      } else {
        if (this.prevArrow) this.prevArrow.addEventListener('click', () => this.plusSlides(-1));
        if (this.nextArrow) this.nextArrow.addEventListener('click', () => this.plusSlides(1));
        this.dots.forEach((dot, index) => {
          dot.addEventListener('click', () => this.currentSlide(index + 1));
        });

        this.slider.addEventListener('mouseenter', () => this.pauseAutoSlide());
        this.slider.addEventListener('mouseleave', () => this.resumeAutoSlide());
        this.slider.addEventListener('touchstart', () => this.pauseAutoSlide());
        this.slider.addEventListener('touchend', () => this.resumeAutoSlide());

        this.startAutoSlide();
      }

      this.showSlides(this.slideIndex);
      this.updateDots();
      this.updateArrowVisibility();
      window.addEventListener('resize', () => this.updateSlidePosition());
    } catch (error) {
      console.error(`Slider ${this.sliderId} initialization failed:`, error);
    }
  }

  plusSlides(n) {
    try {
      this.showSlides(this.slideIndex += n);
      this.updateDots();
      this.updateArrowVisibility();
    } catch (error) {
      console.error(`Slider ${this.sliderId} plusSlides failed:`, error);
    }
  }

  currentSlide(n) {
    try {
      this.showSlides(this.slideIndex = n);
      this.updateDots();
      this.updateArrowVisibility();
    } catch (error) {
      console.error(`Slider ${this.sliderId} currentSlide failed:`, error);
    }
  }

  updateDots() {
    try {
      this.dots.forEach(dot => dot.classList.remove('active'));
      if (this.dots[this.slideIndex - 1]) {
        this.dots[this.slideIndex - 1].classList.add('active');
      }
    } catch (error) {
      console.error(`Slider ${this.sliderId} updateDots failed:`, error);
    }
  }

  updateArrowVisibility() {
    if (this.isSingleSlide) return;
    if (this.prevArrow) {
      this.prevArrow.classList.toggle('hidden', this.slideIndex === 1);
    }
    if (this.nextArrow) {
      this.nextArrow.classList.toggle('hidden', this.slideIndex === this.slides.length);
    }
  }

  showSlides(n) {
    try {
      if (this.isSingleSlide) {
        this.slideIndex = 1;
      } else {
        if (n > this.slides.length) this.slideIndex = 1;
        if (n < 1) this.slideIndex = this.slides.length;
      }

      this.slides.forEach(slide => slide.classList.remove('active'));
      this.titles.forEach(title => title.classList.remove('active'));

      if (this.slides[this.slideIndex - 1]) {
        this.slides[this.slideIndex - 1].classList.add('active');
      }
      if (this.titles[this.slideIndex - 1]) {
        this.titles[this.slideIndex - 1].classList.add('active');
      }

      this.updateSlidePosition();
    } catch (error) {
      console.error(`Slider ${this.sliderId} showSlides failed:`, error);
    }
  }

 updateSlidePosition() {
  try {
    const isMobile = window.innerWidth <= 600;
    console.log(`Slider ${this.sliderId}: isMobile=${isMobile}, slideIndex=${this.slideIndex}`);
    if (isMobile) {
      this.container.style.transform = 'translateX(0px)';
      return;
    }

    const slide = this.slides[0];
    const slideRect = slide.getBoundingClientRect();
    const slideWidth = slideRect.width;
    const marginLeft = parseFloat(getComputedStyle(slide).marginLeft) || 35;
    const marginRight = parseFloat(getComputedStyle(slide).marginRight) || 35;
    const totalSlideWidth = slideWidth + marginLeft + marginRight;
    console.log(`Slider ${this.sliderId}: slideWidth=${slideWidth}, totalSlideWidth=${totalSlideWidth}`);

    const centerIndex = Math.ceil(this.slides.length / 2);
    const translateX = (this.slideIndex - centerIndex) * -totalSlideWidth;
    console.log(`Slider ${this.sliderId}: translateX=${translateX}`);
    this.container.style.transform = `translateX(${translateX}px)`;
  } catch (error) {
    console.error(`Slider ${this.sliderId} updateSlidePosition failed:`, error);
  }
}

  startAutoSlide() {
    if (this.isSingleSlide || !this.isAutoSliding) return;
    this.stopAutoSlide();
    this.autoSlideTimeout = setTimeout(() => {
      this.plusSlides(1);
      this.startAutoSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideTimeout) {
      clearTimeout(this.autoSlideTimeout);
      this.autoSlideTimeout = null;
    }
  }

  pauseAutoSlide() {
    if (this.isSingleSlide) return;
    this.isAutoSliding = false;
    this.stopAutoSlide();
  }

  resumeAutoSlide() {
    if (this.isSingleSlide) return;
    this.isAutoSliding = true;
    this.startAutoSlide();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  try {
    document.querySelectorAll('.slider').forEach(slider => {
      // Only initialize sliders with data-slider-id
      if (slider.dataset.sliderId) {
        new Slider(slider);
      }
    });
  } catch (error) {
    console.error('Slider initialization failed:', error);
  }
});