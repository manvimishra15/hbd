/* ==========================================================================
   HAPPY BIRTHDAY AMAN - DIGITAL BIRTHDAY CARD JAVASCRIPT
   Stack: Pure Vanilla JavaScript (No React, No jQuery, No External Libraries)
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. EASY CUSTOMIZATION CONFIG
// --------------------------------------------------------------------------
const birthdayConfig = {
  name: "Aman",
  age: "21",
  signature: "your favourite headache, obviously 😂"
};

// --------------------------------------------------------------------------
// 2. DOM INITIALIZATION & CONFIG INJECTION
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initDynamicConfig();
  initScrollObserver();
  initProgressBar();
  initSmoothScroll();
  initCandleInteraction();
  initGiftBoxes();
  initStatsObserver();
  initConfettiCanvas();
  initSparkleCanvas();
  initEasterEggs();
});

// Update dynamic signature if edited in config
function initDynamicConfig() {
  const sigEl = document.getElementById("config-signature");
  if (sigEl && birthdayConfig.signature) {
    sigEl.textContent = `— ${birthdayConfig.signature}`;
  }
}

// --------------------------------------------------------------------------
// 3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
// --------------------------------------------------------------------------
function initScrollObserver() {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.15
  });

  reveals.forEach((el) => observer.observe(el));
}

// --------------------------------------------------------------------------
// 4. TOP PROGRESS INDICATOR
// --------------------------------------------------------------------------
function initProgressBar() {
  const progressBar = document.getElementById("progress-bar");
  const icons = document.querySelectorAll(".icon-dot");
  const sections = document.querySelectorAll(".section");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    // Highlight corresponding section icon
    let currentIdx = 0;
    sections.forEach((sec, idx) => {
      const top = sec.offsetTop - 200;
      if (scrollTop >= top) {
        currentIdx = idx;
      }
    });

    icons.forEach((icon, idx) => {
      if (idx === currentIdx) {
        icon.classList.add("active");
      } else {
        icon.classList.remove("active");
      }
    });
  });
}

// --------------------------------------------------------------------------
// 5. SMOOTH SCROLLING BUTTON HANDLERS
// --------------------------------------------------------------------------
function initSmoothScroll() {
  const btnHero = document.getElementById("btn-hero-present");
  const btnNote = document.getElementById("btn-note-continue");

  if (btnHero) {
    btnHero.addEventListener("click", () => {
      const target = document.getElementById("note");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (btnNote) {
    btnNote.addEventListener("click", () => {
      const target = document.getElementById("traits");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }
}

// --------------------------------------------------------------------------
// 6. SECTION 5: INTERACTIVE CAKE & CANDLES
// --------------------------------------------------------------------------
function initCandleInteraction() {
  const candles = document.querySelectorAll(".candle");
  const wishResult = document.getElementById("wish-result");
  const btnRelight = document.getElementById("btn-relight");
  let candlesBlown = false;

  candles.forEach((candle) => {
    candle.addEventListener("click", blowOutCandles);
  });

  function blowOutCandles() {
    if (candlesBlown) return;
    candlesBlown = true;

    // Extinguish candles
    candles.forEach((c) => c.classList.add("extinguished"));

    // Burst confetti near cake
    triggerMiniConfetti();

    // Show Wish Sent Message
    setTimeout(() => {
      if (wishResult) {
        wishResult.classList.remove("hidden");
      }
    }, 400);
  }

  if (btnRelight) {
    btnRelight.addEventListener("click", () => {
      candlesBlown = false;
      candles.forEach((c) => c.classList.remove("extinguished"));
      if (wishResult) wishResult.classList.add("hidden");
      showToast("🔥 Candles relit! Make another wish!");
    });
  }
}

// --------------------------------------------------------------------------
// 7. SECTION 6: LITTLE SURPRISE BOXES & MODAL
// --------------------------------------------------------------------------
function initGiftBoxes() {
  const giftItems = document.querySelectorAll(".gift-box-item");
  const modal = document.getElementById("gift-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMsg = document.getElementById("modal-message");
  const modalClose = document.getElementById("modal-close");
  const modalOk = document.getElementById("modal-ok-btn");

  const surpriseMessages = {
    1: {
      title: "SURPRISE #1 🏆",
      message: "happy birthday idiottt 😭\nbas itna yaad rakh ki you're stuck with me now."
    },
    2: {
      title: "SURPRISE #2 💪",
      message: "just a reminder ki tu actually bht acha kar raha hai.\neven if it doesn't feel like it sometimes."
    },
    3: {
      title: "SURPRISE #3 🫶",
      message: "you mean a lot to me.\nprobably more than I say out loud.\nso yeah... don't forget that, okay?"
    }
  };

  giftItems.forEach((item) => {
    item.addEventListener("click", () => {
      const boxId = item.getAttribute("data-box");
      item.classList.add("opened");

      const data = surpriseMessages[boxId] || surpriseMessages[1];
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalMsg) modalMsg.innerHTML = data.message.replace(/\n/g, "<br>");

      if (modal) modal.classList.remove("hidden");

      triggerMiniConfetti();
    });
  });

  function closeModal() {
    if (modal) modal.classList.add("hidden");
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalOk) modalOk.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

// --------------------------------------------------------------------------
// 8. SECTION 7: ANIMATED BIRTHDAY STATS
// --------------------------------------------------------------------------
function initStatsObserver() {
  const statsSection = document.getElementById("stats");
  const statItems = document.querySelectorAll(".stat-item");
  let animated = false;

  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateStats();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);

  function animateStats() {
    statItems.forEach((item) => {
      const valueEl = item.querySelector(".stat-value");
      const fillEl = item.querySelector(".stat-bar-fill");
      if (!valueEl || !fillEl) return;

      const targetVal = parseInt(valueEl.getAttribute("data-target") || "100", 10);
      
      // Animate Bar Fill Width (cap visually at 100% unless bestfriend level)
      const visualFillWidth = Math.min(100, targetVal > 100 ? 100 : targetVal);
      fillEl.style.width = `${visualFillWidth}%`;

      // Animate Counter Text
      let current = 0;
      const duration = 1200;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = targetVal / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetVal) {
          current = targetVal;
          clearInterval(timer);
        }
        valueEl.textContent = `${Math.floor(current)}%`;
      }, stepTime);
    });
  }
}

// --------------------------------------------------------------------------
// 9. SECTION 9 & FULLSCREEN CONFETTI CANVAS ENGINE
// --------------------------------------------------------------------------
let confettiParticles = [];
let confettiCtx = null;
let confettiCanvas = null;
let animFrameId = null;

function initConfettiCanvas() {
  confettiCanvas = document.getElementById("confetti-canvas");
  if (!confettiCanvas) return;

  confettiCtx = confettiCanvas.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const btnChaos = document.getElementById("btn-chaos");
  const chaosReveal = document.getElementById("chaos-reveal");

  if (btnChaos) {
    btnChaos.addEventListener("click", () => {
      launchFullConfetti();
      if (chaosReveal) {
        chaosReveal.classList.remove("hidden");
        chaosReveal.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
}

function resizeCanvas() {
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
}

function launchFullConfetti() {
  const colors = ["#3b82f6", "#bae6fd", "#c084fc", "#fef08a", "#fb7185", "#6ee7b7"];
  const particleCount = 140;

  for (let i = 0; i < particleCount; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2 + (Math.random() * 200 - 100),
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      shape: Math.random() > 0.4 ? "rect" : "circle"
    });
  }

  if (!animFrameId) {
    updateConfetti();
  }
}

function triggerMiniConfetti() {
  const colors = ["#3b82f6", "#c084fc", "#fef08a", "#fb7185"];
  for (let i = 0; i < 40; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.6,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.6) * 12,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
      shape: "rect"
    });
  }

  if (!animFrameId) {
    updateConfetti();
  }
}

function updateConfetti() {
  if (!confettiCtx || !confettiCanvas) return;

  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35; // Gravity
    p.vx *= 0.98; // Air Resistance
    p.rotation += p.rSpeed;
    p.opacity -= 0.008;

    if (p.opacity <= 0 || p.y > confettiCanvas.height + 50) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.globalAlpha = p.opacity;
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.fillStyle = p.color;

    if (p.shape === "rect") {
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
    } else {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      confettiCtx.fill();
    }

    confettiCtx.restore();
  }

  if (confettiParticles.length > 0) {
    animFrameId = requestAnimationFrame(updateConfetti);
  } else {
    animFrameId = null;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

// --------------------------------------------------------------------------
// 10. DESKTOP SPARKLE CURSOR EFFECT
// --------------------------------------------------------------------------
function initSparkleCanvas() {
  const canvas = document.getElementById("sparkle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let sparkles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (e) => {
    // Add small sparkles occasionally on cursor move
    if (Math.random() < 0.35) {
      sparkles.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.5 ? "#3b82f6" : "#c084fc",
        alpha: 1,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5
      });
    }
  });

  function renderSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 0.03;

      if (s.alpha <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(renderSparkles);
  }

  renderSparkles();
}

// --------------------------------------------------------------------------
// 11. EASTER EGGS & TOAST MESSAGES
// --------------------------------------------------------------------------
function initEasterEggs() {
  // Easter Egg 1: Repeatedly clicking "AMAN" in hero heading
  const nameClickEl = document.getElementById("hero-name-click");
  let nameClickCount = 0;

  if (nameClickEl) {
    nameClickEl.addEventListener("click", () => {
      nameClickCount++;
      if (nameClickCount === 5) {
        showToast("okay bro why are you repeatedly clicking your own name 😭");
        triggerMiniConfetti();
        nameClickCount = 0;
      } else if (nameClickCount > 1) {
        nameClickEl.style.transform = `scale(${1 + nameClickCount * 0.05}) rotate(${nameClickCount * 2}deg)`;
      }
    });
  }

  // Easter Egg 2: Secret "psst..." in footer
  const psstEl = document.getElementById("easter-egg-psst");
  if (psstEl) {
    psstEl.addEventListener("click", () => {
      showToast("you found the secret corner. you're officially too curious. 🤫✨");
      triggerMiniConfetti();
    });
  }
}

// Helper: Show Toast Notification
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
