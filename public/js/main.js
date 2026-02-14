"use strict";

import form from "./form.js";
import skillbar from "./skillbar.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS only if loaded
  if (typeof AOS !== "undefined") {
    AOS.init({
      once: true,
    });
  }

  const themeToggle = document.querySelector("#theme-toggle");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("theme");

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    document.body.classList.toggle("theme-dark", isDark);

    if (themeToggle) {
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }
  };

  const initialTheme = storedTheme ? storedTheme : prefersDark ? "dark" : "light";
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      applyTheme(nextTheme);
    });
  }

  form();
  skillbar();

  const circles = document.querySelectorAll(".skills-premium .circle");
  if (circles.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const percent = Number(entry.target.getAttribute("data-percent"));
            const progress = entry.target.querySelector(".progress");
            if (progress && Number.isFinite(percent)) {
              const radius = 50;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (circumference * percent) / 100;
              progress.style.strokeDasharray = String(circumference);
              progress.style.strokeDashoffset = String(offset);
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    circles.forEach((circle) => observer.observe(circle));
  }

  const nav = document.querySelector("#nav");
  const navBtn = document.querySelector("#nav-btn");
  const navBtnImg = document.querySelector("#nav-btn-img");
  const goToTop = document.querySelector(".goToTop"); // FIXED

  // Hamburger menu
  navBtn.onclick = () => {
    if (nav.classList.toggle("open")) {
      navBtnImg.src = "/img/icons/close.svg";
    } else {
      navBtnImg.src = "/img/icons/open.svg";
    }
  };

  window.addEventListener("scroll", function () {
    const header = document.querySelector("#header");
    const hero = document.querySelector("#home");
    let triggerHeight = hero.offsetHeight - 170;

    if (window.scrollY > triggerHeight) {
      header.classList.add("header-sticky");
      goToTop.classList.add("reveal");
    } else {
      header.classList.remove("header-sticky");
      goToTop.classList.remove("reveal");
    }
  });

  let sections = document.querySelectorAll("section");
  let navLinks = document.querySelectorAll("header nav a");

  window.onscroll = () => {
    sections.forEach((sec) => {
      let top = window.scrollY;
      let offset = sec.offsetTop - 170;
      let height = sec.offsetHeight;
      let id = sec.getAttribute("id");

      if (top >= offset && top < offset + height) {
        navLinks.forEach((links) => {
          links.classList.remove("active");
          const activeLink = document.querySelector("header nav a[href*=" + id + "]");
          if (activeLink) {
            activeLink.classList.add("active");
          }
        });
      }
    });
  };
});
