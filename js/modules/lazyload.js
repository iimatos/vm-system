export default function lazyLoad() {
  const lazyLoad = () => {
    const lazyImages = document.querySelectorAll("img[data-src]");
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2,
    };
    const show = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    };
    const observer = new IntersectionObserver(show, options);
    lazyImages.forEach((img) => [observer.observe(img)]);
  };

  window.addEventListener("load", lazyLoad);
}
