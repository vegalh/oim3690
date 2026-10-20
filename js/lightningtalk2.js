// ============================================================
// LIGHTNING TALK 2 — deck navigation, fullscreen, presenter
// notes, and the RootMap iframe embed/fallback check.
// Vanilla JS only — no dependencies.
// ============================================================
(function () {
  'use strict';

  var deck = document.getElementById('deck');
  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.dot'));
  var notesPanel = document.getElementById('notes-panel');
  var notesBodies = Array.prototype.slice.call(document.querySelectorAll('.notes-body'));
  var fullscreenBtn = document.getElementById('fullscreen-btn');
  var revealBtn = document.getElementById('reveal-q2-btn');
  var qOverlay = document.getElementById('q-overlay');
  var qClose = document.getElementById('q-close-btn');
  var rootmapIframe = document.getElementById('rootmap-iframe');
  var embedFallback = document.getElementById('embed-fallback');
  var phoneScreen = document.querySelector('.phone-screen');
  var phoneViewport = document.getElementById('phone-viewport');

  var current = 0;
  var total = screens.length;

  // ------------------------------------------------------------
  // Slide navigation
  // ------------------------------------------------------------
  function goTo(index) {
    index = Math.max(0, Math.min(total - 1, index));
    if (index === current) return;

    screens[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = index;
    var nextScreen = screens[current];

    // Force a synchronous reflow before adding 'active' again so
    // CSS reveal animations restart every time a screen becomes
    // visible. (Avoid requestAnimationFrame here — it can be
    // throttled or skipped entirely on a backgrounded/minimized
    // window, which would leave no screen active at all.)
    void nextScreen.offsetWidth;
    nextScreen.classList.add('active');
    if (dots[current]) dots[current].classList.add('active');

    updateNotes();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); });
  });

  // ------------------------------------------------------------
  // Presenter notes (toggle with "N")
  // ------------------------------------------------------------
  function updateNotes() {
    notesBodies.forEach(function (body) {
      var forScreen = parseInt(body.getAttribute('data-screen'), 10) - 1;
      body.classList.toggle('current', forScreen === current);
    });
  }

  function toggleNotes() {
    notesPanel.classList.toggle('visible');
  }

  // ------------------------------------------------------------
  // Fullscreen
  // ------------------------------------------------------------
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      (deck.requestFullscreen || deck.webkitRequestFullscreen || function () {}).call(deck);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || function () {}).call(document);
    }
  }

  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

  // ------------------------------------------------------------
  // Second discussion question reveal overlay (Screen 3)
  // ------------------------------------------------------------
  function openOverlay() {
    qOverlay.classList.add('open');
    qOverlay.setAttribute('aria-hidden', 'false');
    qClose.focus();
  }
  function closeOverlay() {
    qOverlay.classList.remove('open');
    qOverlay.setAttribute('aria-hidden', 'true');
  }

  if (revealBtn) revealBtn.addEventListener('click', openOverlay);
  if (qClose) qClose.addEventListener('click', closeOverlay);

  // ------------------------------------------------------------
  // Keyboard navigation
  // ArrowRight / Space -> next, ArrowLeft -> prev, N -> notes,
  // Escape -> close overlay / notes / exit fullscreen (priority order).
  // Keys are ignored while focus is inside the embedded RootMap
  // iframe so the live demo stays fully interactive.
  // ------------------------------------------------------------
  document.addEventListener('keydown', function (e) {
    if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
      return; // let the embedded RootMap app handle its own keys
    }

    if (e.key === 'Escape') {
      if (qOverlay.classList.contains('open')) {
        closeOverlay();
        return;
      }
      if (notesPanel.classList.contains('visible')) {
        notesPanel.classList.remove('visible');
        return;
      }
      if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
      }
      return;
    }

    if (e.key === 'n' || e.key === 'N') {
      toggleNotes();
      return;
    }

    if (qOverlay.classList.contains('open')) return; // don't navigate behind the overlay

    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  });

  // ------------------------------------------------------------
  // Scale RootMap to fit the phone screen
  // RootMap's own CSS assumes a real mobile viewport (min-width
  // 320px). Rendering the iframe at a fixed 390x844 "device" size
  // and scaling that whole viewport down with a CSS transform
  // guarantees its layout is always complete and never clipped,
  // no matter how big or small the phone frame itself is.
  // ------------------------------------------------------------
  function scalePhoneToFit() {
    if (!phoneScreen || !phoneViewport) return;
    var width = phoneScreen.clientWidth;
    if (!width) return;
    var scale = width / 390;
    phoneViewport.style.transform = 'scale(' + scale + ')';
  }

  window.addEventListener('resize', scalePhoneToFit);
  window.addEventListener('load', scalePhoneToFit);
  scalePhoneToFit();
  // Re-check shortly after load in case fonts/layout shift the frame size.
  setTimeout(scalePhoneToFit, 300);

  // ------------------------------------------------------------
  // RootMap iframe embed check — if it fails to signal a load
  // within a few seconds (blocked by the host, offline, etc.)
  // reveal the "open in new tab" fallback link.
  // ------------------------------------------------------------
  if (rootmapIframe) {
    var loaded = false;
    rootmapIframe.addEventListener('load', function () { loaded = true; });
    rootmapIframe.addEventListener('error', function () {
      embedFallback.classList.add('show');
    });
    setTimeout(function () {
      if (!loaded) embedFallback.classList.add('show');
    }, 6000);
  }

  // ------------------------------------------------------------
  // Init
  // ------------------------------------------------------------
  updateNotes();
})();
