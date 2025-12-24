document.getElementById("year").textContent = new Date().getFullYear();

// Animasi XP bar
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("xpFill").style.width = "72%";
  }, 300);
});

// Fade-in scroll animation
const sections = document.querySelectorAll(".section, .hero");

const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.12 });

sections.forEach(s => {
  s.classList.add("hidden");
  obs.observe(s);
});
