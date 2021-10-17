/******************************************************************/
/*        Soulbox | The simplistic & lightweight lightbox!        */
/******************************************************************/
/* Copyright © 2021                                               */
/* Author: Hifumi-Sec => https://github.com/Hifumi-Sec            */
/* Open-Source Project => https://github.com/Hifumi-Sec/soulbox   */
/******************************************************************/

/* Welcome to Soulbox! */
class Soulbox {
  constructor() {

    let _this = this;

    // This array will contain all of the photos with the class "soulbox"
    this.soulArray = [];

    // Current image being displayed in a lightbox
    this.currentImage;

    // Checks to see if the image is being displayed or not
    this.isSoulBox = false;

    // Handles the 3 buttons for transitioning between images
    let controlsHtml = `
    <div class="soulbox-controls">
      <span class="soul-prev">&#10094;</span>
      <span class="soul-next">&#10095;</span>
      <span class="soul-close">&times;</span>
    </div>
  `;

    // It's rendering time!
    this.render = () => {
      this.soulArray = [];
      this.currentImage = null;
      this.isSoulBox = false;

      document.querySelectorAll('img.soulbox').forEach((img_display, index) => {
        _this.soulArray.push(img_display);
        img_display.setAttribute("data-soulbox-index", index);
        img_display.addEventListener('click', () => {
          _this.soulbox(img_display);
        });
      });
      addKeyListeners();
    };

    // Mainly handles the class information for css
    this.soulbox = _display => {
      this.hideSoulbox();
      this.currentImage = _display;
      this.isSoulBox = true;
      let overlay = document.createElement('div');
      overlay.classList.add('soulbox-overlay');
      let imageContainer = document.createElement('div');
      imageContainer.classList.add('soulbox-image');
      let image = document.createElement('img');
      image.src = _display.src;
      imageContainer.appendChild(image);
      document.querySelector('body').appendChild(overlay);
      document.querySelector('body').appendChild(imageContainer);

      prepareControls(_display);
    };

    // Next button
    this.next = () => {
      let imgIndex = getCurrentImageIndex();
      if (imgIndex === _this.soulArray.length - 1) return;
      _this.soulbox(_this.soulArray[getCurrentImageIndex() + 1]);
    };

    // Previous button
    this.prev = () => {
      let imgIndex = getCurrentImageIndex();
      if (imgIndex === 0) return;
      _this.soulbox(_this.soulArray[getCurrentImageIndex() - 1]);
    };

    // Close button
    this.hideSoulbox = () => {
      let overlay = document.querySelector('.soulbox-overlay');
      let image = document.querySelector('.soulbox-image');
      let controls = document.querySelector('.soulbox-controls');
      if (overlay) document.querySelector('body').removeChild(overlay);
      if (image) document.querySelector('body').removeChild(image);
      if (controls) document.querySelector('body').removeChild(controls);

      this.isSoulBox = false;
    };

    // Handles the controls for when soulbox is active
    const prepareControls = () => {
      let controls = document.createElement('div');
      controls.innerHTML += controlsHtml;

      document.querySelector('body').appendChild(controls.querySelector('.soulbox-controls'));

      let imgIndex = getCurrentImageIndex();

      if (imgIndex > 0) {
        document.querySelector('.soul-prev').addEventListener('click', () => {
          _this.prev();
        });
      } else {
        document.querySelector('.soul-prev').classList.add(['soul-disabled']);
      }

      if (imgIndex < _this.soulArray.length - 1) {
        document.querySelector('.soul-next').addEventListener('click', () => {
          _this.next();
        });
      } else {
        document.querySelector('.soul-next').classList.add(['soul-disabled']);
      }

      document.querySelector('.soul-close').addEventListener('click', () => {
        _this.hideSoulbox();
      });

      document.querySelector('.soulbox-overlay').addEventListener('click', () => {
        _this.hideSoulbox();
      });

      metaInfo();
    };

    /* Adds alt as image title and img counter */
    const metaInfo = () => {
      let imgIndex = getCurrentImageIndex();
      let counter = document.createElement("span");
      let counterHtml = `<br/><div>${imgIndex + 1} of ${_this.soulArray.length}`;

      // Handles title
      // if (_this.currentImage.alt) {
      //   counterHtml += `<br/><p>${_this.currentImage.alt}</p></div>`;
      // }

      // Meta counter for photo number
      counter.innerHTML = counterHtml;
      document.querySelector('.soulbox-image').appendChild(counter);
    };

    const getCurrentImageIndex = () => {
      return +_this.currentImage.getAttribute('data-soulbox-index');
    };

    /* KeyListeners - nothing interesting */
    const addKeyListeners = () => {
      document.removeEventListener('keydown', bindKeys);
      document.addEventListener('keydown', bindKeys);
    };

    const bindKeys = (e) => {
      if (e.keyCode === 37 && _this.isSoulBox) {
        _this.prev();
        return;
      } else if (e.keyCode === 39 && _this.isSoulBox) {
        _this.next();
        return;
      } else if (e.keyCode === 27 && _this.isSoulBox) {
        _this.hideSoulbox();
        return;
      }
    };
  }
}

let soulBox = new Soulbox;
soulBox.render();