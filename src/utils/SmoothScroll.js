// src/utils/SmoothScroll.js
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

class SmoothScroll {
  constructor() {
    this.gsap = gsap;
  }

  scrollTo(target, duration = 1) {
    this.gsap.to(window, { duration: duration, scrollTo: { y: target, autoKill: false } });
  }

  scrollToTop(duration = 1) {
    this.scrollTo(0, duration);
  }
}

export default SmoothScroll;
