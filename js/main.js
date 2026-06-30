const menuButton = document.querySelector(".header__menu");
const globalMenu = document.querySelector(".global-menu");
const menuOverlay = document.querySelector(".menu-overlay");
const menuLinks = document.querySelectorAll(".global-menu__link");
const darkSections = document.querySelectorAll(".menu-color-dark");

if (menuButton && globalMenu && menuOverlay) {
  const firstMenuLink = menuLinks[0];
  let focusTimeoutId = null;

  const setMenuState = (isOpen, restoreFocus = true) => {
    menuButton.classList.toggle("is-open", isOpen);
    globalMenu.classList.toggle("is-open", isOpen);
    menuOverlay.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("is-menu-open", isOpen);

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    globalMenu.setAttribute("aria-hidden", String(!isOpen));

    if (isOpen) {
      focusTimeoutId = setTimeout(() => {
        firstMenuLink?.focus();
      }, 120);
    } else {
      clearTimeout(focusTimeoutId);
      if (restoreFocus) {
        menuButton.focus();
      }
    }
  };

  const updateMenuButtonColor = () => {
    const buttonRect = menuButton.getBoundingClientRect();
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    const isOnDarkTarget = Array.from(darkSections).some((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= buttonCenterY && rect.bottom >= buttonCenterY;
    });

    menuButton.classList.toggle("is-dark", isOnDarkTarget);
  };

  menuButton.addEventListener("click", () => {
    const isOpen = !globalMenu.classList.contains("is-open");
    setMenuState(isOpen);
  });

  menuOverlay.addEventListener("click", () => {
    setMenuState(false);
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false, false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!globalMenu.classList.contains("is-open")) return;

    setMenuState(false);
  });

  window.addEventListener("scroll", updateMenuButtonColor);
  window.addEventListener("resize", updateMenuButtonColor);
  updateMenuButtonColor();
}

const profileSlot = document.getElementById("profileSlot");
const profileSlotStart = document.getElementById("profileSlotStart");
const profileSlotMessage = document.getElementById("profileSlotMessage");
const profileSlotReels = [...document.querySelectorAll(".profile-slot__reel")];

const profileSlotSymbols = ["🍒", "🔔", "🍇", "7️⃣", "⭐"];

let isProfileSlotPlaying = false;
let profileSlotStoppedCount = 0;

const shuffleArray = (array) => {
  const copiedArray = [...array];

  for (let i = copiedArray.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copiedArray[i], copiedArray[randomIndex]] = [copiedArray[randomIndex], copiedArray[i]];
  }

  return copiedArray;
};

const setProfileSlotStopButtons = (disabled) => {
  profileSlotReels.forEach((reel) => {
    const stopButton = reel.querySelector(".profile-slot__stop");
    if (!stopButton) return;

    stopButton.disabled = disabled;
  });
};

const resetProfileSlotReel = (reel) => {
  reel.classList.remove("is-spinning", "is-stopping");

  const track = reel.querySelector(".profile-slot__track");
  if (!track) return;

  track.style.animation = "none";
  track.offsetHeight;
  track.style.animation = "";
};

const shuffleProfileSlotSymbols = (reel) => {
  const track = reel.querySelector(".profile-slot__track");
  if (!track) return;

  const shuffledSymbols = shuffleArray(profileSlotSymbols);

  track.innerHTML = shuffledSymbols
    .map((symbol) => `<div class="profile-slot__symbol">${symbol}</div>`)
    .join("");
};

const startProfileSlot = () => {
  if (isProfileSlotPlaying) return;

  isProfileSlotPlaying = true;
  profileSlotStoppedCount = 0;
  profileSlotStart.disabled = true;
  setProfileSlotStopButtons(false);
  profileSlotMessage.textContent = "好きな順番でSTOPを押して止める";

  profileSlotReels.forEach((reel, index) => {
    resetProfileSlotReel(reel);
    shuffleProfileSlotSymbols(reel);
    reel.classList.add("is-spinning");

    const track = reel.querySelector(".profile-slot__track");
    if (!track) return;

    track.style.animationDuration = `${0.28 + index * 0.04}s`;
  });
};

const stopProfileSlotReel = (reel) => {
  if (!isProfileSlotPlaying || !reel.classList.contains("is-spinning")) return;

  const stopButton = reel.querySelector(".profile-slot__stop");
  if (stopButton) {
    stopButton.disabled = true;
  }

  shuffleProfileSlotSymbols(reel);
  reel.classList.remove("is-spinning");
  reel.classList.add("is-stopping");
  profileSlotStoppedCount += 1;

  if (profileSlotStoppedCount >= profileSlotReels.length) {
    isProfileSlotPlaying = false;
    profileSlotMessage.textContent = "もう一度遊ぶならSTART";

    setTimeout(() => {
      profileSlotStart.disabled = false;
    }, 360);
  }
};

if (profileSlot && profileSlotStart && profileSlotMessage && profileSlotReels.length > 0) {
  profileSlotStart.addEventListener("click", startProfileSlot);

  profileSlotReels.forEach((reel) => {
    const stopButton = reel.querySelector(".profile-slot__stop");
    if (!stopButton) return;

    stopButton.addEventListener("click", () => stopProfileSlotReel(reel));
  });
}

const revealTargets = document.querySelectorAll(".js-reveal");

if (revealTargets.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-show");
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((target) => {
    revealObserver.observe(target);
  });
}