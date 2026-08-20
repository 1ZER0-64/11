(() => {
  "use strict";


  /* =======================================================
     ELEMENTS
     ======================================================= */

  const app =
    document.getElementById("app");

  const intro =
    document.getElementById("intro");

  const experience =
    document.getElementById("experience");

  const enterButton =
    document.getElementById("enterButton");

  const music =
    document.getElementById("music");

  const musicButton =
    document.getElementById("musicButton");

  const musicLabel =
    document.getElementById("musicLabel");

  const homeButton =
    document.getElementById("homeButton");

  const restartButton =
    document.getElementById("restartButton");

  const endButton =
    document.getElementById("endButton");

  const chapter =
    document.getElementById("chapter");

  const pages =
    Array.from(
      document.querySelectorAll(
        ".chapter-page"
      )
    );

  const dots =
    Array.from(
      document.querySelectorAll(
        "#chapterDots button"
      )
    );

  const previousButton =
    document.getElementById(
      "previousButton"
    );

  const nextButton =
    document.getElementById(
      "nextButton"
    );

  const progressBar =
    document.getElementById(
      "progressBar"
    );


  /* =======================================================
     STATE
     ======================================================= */

  let currentChapter = 0;

  let isExperienceOpen = false;

  let isMusicOn = true;

  let touchStartX = 0;

  let touchStartY = 0;

  const totalChapters =
    pages.length;


  /* =======================================================
     HELPERS
     ======================================================= */

  function clamp(
    value,
    min,
    max
  ) {

    return Math.min(
      Math.max(
        value,
        min
      ),
      max
    );

  }


  /* =======================================================
     MUSIC
     ======================================================= */

  function updateMusicButton() {

    musicLabel.textContent =
      isMusicOn
        ? "Music On"
        : "Music Off";

    musicButton.setAttribute(
      "aria-label",
      isMusicOn
        ? "Turn music off"
        : "Turn music on"
    );

    musicButton.classList.toggle(
      "muted",
      !isMusicOn
    );

  }


  async function playMusic() {

    if (!music) {
      return;
    }

    try {

      await music.play();

      isMusicOn = true;

      updateMusicButton();

    } catch (error) {

      isMusicOn = false;

      updateMusicButton();

    }

  }


  function pauseMusic() {

    if (!music) {
      return;
    }

    music.pause();

    isMusicOn = false;

    updateMusicButton();

  }


  async function toggleMusic() {

    if (!music) {
      return;
    }

    if (music.paused) {

      await playMusic();

    } else {

      pauseMusic();

    }

  }


  /* =======================================================
     NAVIGATION UI
     ======================================================= */

  function updateNavigation() {

    const isFirst =
      currentChapter === 0;

    const isLast =
      currentChapter ===
      totalChapters - 1;


    previousButton.disabled =
      isFirst;

    nextButton.disabled =
      isLast;


    previousButton.setAttribute(
      "aria-disabled",
      String(isFirst)
    );

    nextButton.setAttribute(
      "aria-disabled",
      String(isLast)
    );


    dots.forEach(
      (dot, index) => {

        const active =
          index === currentChapter;

        dot.classList.toggle(
          "active",
          active
        );

        if (active) {

          dot.setAttribute(
            "aria-current",
            "step"
          );

        } else {

          dot.removeAttribute(
            "aria-current"
          );

        }

      }
    );


    const progress =
      totalChapters <= 1
        ? 100
        : (
            currentChapter /
            (totalChapters - 1)
          ) * 100;


    progressBar.style.width =
      `${progress}%`;

  }


  /* =======================================================
     CHAPTER DISPLAY
     ======================================================= */

  function showChapter(
    index,
    direction = "forward"
  ) {

    if (!isExperienceOpen) {
      return;
    }


    const nextIndex =
      clamp(
        index,
        0,
        totalChapters - 1
      );


    if (
      nextIndex ===
      currentChapter
    ) {

      updateNavigation();

      return;

    }


    const oldPage =
      pages[currentChapter];

    const newPage =
      pages[nextIndex];


    oldPage.classList.remove(
      "active"
    );

    oldPage.classList.remove(
      "enter-forward",
      "enter-backward"
    );


    newPage.classList.remove(
      "active",
      "enter-forward",
      "enter-backward"
    );


    newPage.classList.add(
      direction === "backward"
        ? "enter-backward"
        : "enter-forward"
    );


    void newPage.offsetWidth;


    newPage.classList.add(
      "active"
    );


    currentChapter =
      nextIndex;


    updateNavigation();


    chapter.focus({
      preventScroll: true
    });


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });


    setTimeout(() => {

      newPage.classList.remove(
        "enter-forward",
        "enter-backward"
      );

    }, 700);

  }


  function nextChapter() {

    if (
      currentChapter <
      totalChapters - 1
    ) {

      showChapter(
        currentChapter + 1,
        "forward"
      );

    }

  }


  function previousChapter() {

    if (
      currentChapter > 0
    ) {

      showChapter(
        currentChapter - 1,
        "backward"
      );

    }

  }


  /* =======================================================
     ENTER EXPERIENCE
     ======================================================= */

  async function enterExperience() {

    if (isExperienceOpen) {
      return;
    }


    isExperienceOpen = true;


    intro.classList.add(
      "leaving"
    );


    setTimeout(() => {

      intro.hidden = true;

      experience.hidden = false;


      requestAnimationFrame(() => {

        experience.classList.add(
          "visible"
        );

        chapter.focus({
          preventScroll: true
        });

      });

    }, 550);


    await playMusic();

  }


  /* =======================================================
     RETURN HOME
     ======================================================= */

  function returnHome() {

    if (
      app.classList.contains(
        "ending"
      )
    ) {

      return;

    }


    isExperienceOpen = false;


    experience.classList.remove(
      "visible"
    );


    setTimeout(() => {

      experience.hidden = true;


      currentChapter = 0;


      pages.forEach(
        (page, index) => {

          page.classList.toggle(
            "active",
            index === 0
          );

          page.classList.remove(
            "enter-forward",
            "enter-backward"
          );

        }
      );


      updateNavigation();


      intro.hidden = false;


      requestAnimationFrame(() => {

        intro.classList.remove(
          "leaving"
        );


        enterButton.focus({
          preventScroll: true
        });

      });

    }, 500);

  }


  /* =======================================================
     READ AGAIN
     ======================================================= */

  function restartExperience() {

    currentChapter = 0;


    pages.forEach(
      (page, index) => {

        page.classList.toggle(
          "active",
          index === 0
        );

        page.classList.remove(
          "enter-forward",
          "enter-backward"
        );

      }
    );


    updateNavigation();


    chapter.focus({
      preventScroll: true
    });


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });


    if (
      music.paused &&
      isMusicOn
    ) {

      playMusic();

    }

  }


  /* =======================================================
     THE END
     ======================================================= */

  function endExperience() {

    if (!isExperienceOpen) {
      return;
    }


    /*
      Prevent another click.
    */

    endButton.disabled = true;


    /*
      Stop the music.
    */

    if (music) {

      music.pause();

    }


    /*
      The experience is now ending.
    */

    isExperienceOpen = false;


    /*
      Slowly blur, dim and vanish
      into complete darkness.
    */

    app.classList.add(
      "ending"
    );


    /*
      After the 4-second disappearance,
      ask the browser to close the page.
    */

    setTimeout(() => {

      /*
        Browsers normally allow window.close()
        only for windows/tabs opened by script.
      */

      window.close();


      /*
        If Chrome refuses to close the tab,
        leave it completely black rather than
        bringing the story back.
      */

      document.documentElement.style.background =
        "#000000";

      document.body.style.background =
        "#000000";

      document.body.innerHTML =
        "";

    }, 4000);

  }


  /* =======================================================
     KEYBOARD
     ======================================================= */

  function handleKeyboard(event) {

    if (!isExperienceOpen) {
      return;
    }


    switch (event.key) {

      case "ArrowRight":

      case "ArrowDown":

      case " ":

        event.preventDefault();

        nextChapter();

        break;


      case "ArrowLeft":

      case "ArrowUp":

        event.preventDefault();

        previousChapter();

        break;


      case "Home":

        event.preventDefault();

        showChapter(
          0,
          "backward"
        );

        break;


      case "End":

        event.preventDefault();

        showChapter(
          totalChapters - 1,
          "forward"
        );

        break;


      case "Escape":

        event.preventDefault();

        returnHome();

        break;

    }

  }


  /* =======================================================
     TOUCH / SWIPE
     ======================================================= */

  function handleTouchStart(
    event
  ) {

    if (!isExperienceOpen) {
      return;
    }


    const touch =
      event.changedTouches[0];


    touchStartX =
      touch.clientX;

    touchStartY =
      touch.clientY;

  }


  function handleTouchEnd(
    event
  ) {

    if (!isExperienceOpen) {
      return;
    }


    const touch =
      event.changedTouches[0];


    const deltaX =
      touch.clientX -
      touchStartX;


    const deltaY =
      touch.clientY -
      touchStartY;


    const minimumSwipe = 55;


    if (
      Math.abs(deltaX) <
      minimumSwipe
    ) {

      return;

    }


    if (
      Math.abs(deltaX) <
      Math.abs(deltaY)
    ) {

      return;

    }


    if (deltaX < 0) {

      nextChapter();

    } else {

      previousChapter();

    }

  }


  /* =======================================================
     EVENT LISTENERS
     ======================================================= */

  enterButton.addEventListener(
    "click",
    enterExperience
  );


  musicButton.addEventListener(
    "click",
    toggleMusic
  );


  homeButton.addEventListener(
    "click",
    returnHome
  );


  restartButton.addEventListener(
    "click",
    restartExperience
  );


  endButton.addEventListener(
    "click",
    endExperience
  );


  previousButton.addEventListener(
    "click",
    previousChapter
  );


  nextButton.addEventListener(
    "click",
    nextChapter
  );


  dots.forEach(
    (dot) => {

      dot.addEventListener(
        "click",
        () => {

          const target =
            Number(
              dot.dataset.index
            );


          if (
            !Number.isInteger(
              target
            )
          ) {

            return;

          }


          const direction =
            target <
            currentChapter
              ? "backward"
              : "forward";


          showChapter(
            target,
            direction
          );

        }
      );

    }
  );


  document.addEventListener(
    "keydown",
    handleKeyboard
  );


  document.addEventListener(
    "touchstart",
    handleTouchStart,
    {
      passive: true
    }
  );


  document.addEventListener(
    "touchend",
    handleTouchEnd,
    {
      passive: true
    }
  );


  music.addEventListener(
    "play",
    () => {

      isMusicOn = true;

      updateMusicButton();

    }
  );


  music.addEventListener(
    "pause",
    () => {

      isMusicOn = false;

      updateMusicButton();

    }
  );


  music.addEventListener(
    "error",
    () => {

      isMusicOn = false;

      updateMusicButton();

    }
  );


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  updateMusicButton();

  updateNavigation();

})();
