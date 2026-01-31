document.addEventListener("DOMContentLoaded", () => {
  const DOM = {
    panels: document.querySelectorAll(".color-panel"),
    generateBtn: document.getElementById("generate-btn"),
    toast: document.getElementById("copy-toast"),
    controls: {
      l: {
        check: document.getElementById("check-l"),
        range: document.getElementById("range-l"),
        display: document.getElementById("val-l"),
      },
      c: {
        check: document.getElementById("check-c"),
        range: document.getElementById("range-c"),
        display: document.getElementById("val-c"),
      },
      h: {
        check: document.getElementById("check-h"),
        range: document.getElementById("range-h"),
        display: document.getElementById("val-h"),
      },
    },
  };

  const state = {
    palette: [],
    toastTimeout: null,
  };

  const utils = {
    random: (min, max) => Math.random() * (max - min) + min,

    getContrastColor: (oklchString) => {
      const match = oklchString.match(/oklch\(([\d.]+)/);
      const lightness = match ? parseFloat(match[1]) : 0.5;
      return lightness < 0.6 ? "#ffffff" : "#000000";
    },

    parseOklch: (str) => {
      const match = str.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/);
      if (!match) return null;
      return { l: match[1], c: match[2], h: match[3] };
    },
  };

  const App = {
    init() {
      DOM.panels.forEach(() => {
        state.palette.push({ color: "", locked: false });
      });

      this.bindEvents();
      this.updateSliderDisplays();
      this.toggleSliders();
      this.generatePalette();
    },

    bindEvents() {
      DOM.generateBtn.addEventListener("click", () => this.generatePalette());

      document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
          e.preventDefault();
          this.generatePalette();
        }
      });

      ["l", "c", "h"].forEach((key) => {
        const control = DOM.controls[key];

        control.check.addEventListener("change", () => {
          if (control.check.checked) {
            this.syncControlWithCurrentState(key);
          }
          this.toggleSliders();
          this.generatePalette(true);
        });

        control.range.addEventListener("input", () => {
          this.updateSliderDisplays();
          this.generatePalette(true);
        });
      });

      DOM.panels.forEach((panel, index) => {
        const lockBtn = panel.querySelector(".lock-btn");
        const colorCode = panel.querySelector(".color-code");

        lockBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleLock(index, lockBtn);
        });

        colorCode.addEventListener("click", () => {
          this.copyToClipboard(colorCode.textContent);
        });
      });
    },

    syncControlWithCurrentState(key) {
      const lockedItem = state.palette.find(
        (item) => item.locked && item.color !== "waiting...",
      );

      if (lockedItem) {
        const parsed = utils.parseOklch(lockedItem.color);
        if (parsed) {
          DOM.controls[key].range.value = parsed[key];
          DOM.controls[key].display.textContent = parsed[key];
        }
      } else {
        let randomVal;

        if (key === "l") {
          randomVal = utils.random(0.3, 0.95).toFixed(2);
        } else if (key === "c") {
          randomVal = utils.random(0.05, 0.25).toFixed(2);
        } else if (key === "h") {
          randomVal = utils.random(0, 360).toFixed(0);
        }

        DOM.controls[key].range.value = randomVal;
        DOM.controls[key].display.textContent = randomVal;
      }
    },

    getCurrentSettings() {
      return {
        l: {
          locked: DOM.controls.l.check.checked,
          val: DOM.controls.l.range.value,
        },
        c: {
          locked: DOM.controls.c.check.checked,
          val: DOM.controls.c.range.value,
        },
        h: {
          locked: DOM.controls.h.check.checked,
          val: DOM.controls.h.range.value,
        },
      };
    },

    generatePalette(preserveRandomness = false) {
      const settings = this.getCurrentSettings();

      state.palette.forEach((item, index) => {
        if (item.locked) return;

        let currentL, currentC, currentH;

        if (preserveRandomness && item.color && item.color !== "waiting...") {
          const parsed = utils.parseOklch(item.color);
          if (parsed) {
            currentL = parsed.l;
            currentC = parsed.c;
            currentH = parsed.h;
          }
        }

        const l = settings.l.locked
          ? settings.l.val
          : preserveRandomness && currentL
            ? currentL
            : utils.random(0.3, 0.95).toFixed(3);

        const c = settings.c.locked
          ? settings.c.val
          : preserveRandomness && currentC
            ? currentC
            : utils.random(0.05, 0.25).toFixed(3);

        const h = settings.h.locked
          ? settings.h.val
          : preserveRandomness && currentH
            ? currentH
            : utils.random(0, 360).toFixed(1);

        const newColor = `oklch(${l} ${c} ${h})`;
        item.color = newColor;

        this.updatePanelUI(index, newColor);
      });
    },

    updatePanelUI(index, color) {
      const panel = DOM.panels[index];
      const codeSpan = panel.querySelector(".color-code");

      panel.style.backgroundColor = color;
      panel.style.color = utils.getContrastColor(color);

      if (codeSpan) {
        codeSpan.textContent = color;
        panel.setAttribute("aria-label", `Color: ${color}`);
      }
    },

    toggleLock(index, btn) {
      state.palette[index].locked = !state.palette[index].locked;
      const isLocked = state.palette[index].locked;

      const icon = btn.querySelector(".material-symbols-outlined");
      icon.textContent = isLocked ? "lock" : "lock_open";

      btn.classList.toggle("is-locked", isLocked);
      btn.setAttribute("aria-pressed", isLocked);
      btn.blur();
    },

    updateSliderDisplays() {
      ["l", "c", "h"].forEach((key) => {
        DOM.controls[key].display.textContent = DOM.controls[key].range.value;
      });
    },

    toggleSliders() {
      ["l", "c", "h"].forEach((key) => {
        const control = DOM.controls[key];
        control.range.disabled = !control.check.checked;
      });
    },

    copyToClipboard(text) {
      if (!text || text === "waiting...") return;

      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.showToast(text);
        })
        .catch((err) => console.error(err));
    },

    showToast(text) {
      const toast = DOM.toast;
      toast.textContent = `Copied: ${text}`;
      toast.style.display = "block";
      toast.classList.add("visible");

      if (state.toastTimeout) clearTimeout(state.toastTimeout);

      state.toastTimeout = setTimeout(() => {
        toast.style.display = "none";
        toast.classList.remove("visible");
      }, 1500);
    },
  };

  App.init();
});
