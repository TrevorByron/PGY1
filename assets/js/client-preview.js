(function () {
  const body = document.body;
  const layoutEmbedded = document.getElementById("layout-embedded");
  const layoutModal = document.getElementById("layout-modal");
  const dialog = document.getElementById("questionnaire-modal");
  const hostInline = document.getElementById("questionnaire-embed-host-inline");
  const hostModal = document.getElementById("questionnaire-embed-host-modal");
  const ziteRoot = document.getElementById("zite-embed-root");
  const btnEmbedded = document.getElementById("btn-layout-embedded");
  const btnModal = document.getElementById("btn-layout-modal");

  if (!layoutEmbedded || !layoutModal || !dialog || !hostInline || !hostModal || !ziteRoot) return;

  function dispatchResize() {
    window.dispatchEvent(new Event("resize"));
  }

  function moveZiteTo(targetHost) {
    if (!targetHost || ziteRoot.parentElement === targetHost) return;
    targetHost.appendChild(ziteRoot);
    dispatchResize();
  }

  function setLayout(mode) {
    const isModal = mode === "modal";
    body.dataset.demoLayout = isModal ? "modal" : "embedded";

    if (isModal) {
      layoutEmbedded.hidden = true;
      layoutModal.hidden = false;
      /* Keep the embed in inline host until the user opens the dialog (avoids a closed dialog subtree). */
    } else {
      layoutModal.hidden = true;
      layoutEmbedded.hidden = false;
      moveZiteTo(hostInline);
      if (dialog.open) dialog.close();
    }

    if (btnEmbedded && btnModal) {
      btnEmbedded.classList.toggle("client-preview-bar__btn--active", !isModal);
      btnModal.classList.toggle("client-preview-bar__btn--active", isModal);
    }

    dispatchResize();
  }

  function openQuestionnaireModal() {
    moveZiteTo(hostModal);
    if (!dialog.open) dialog.showModal();
    dispatchResize();
  }

  document.querySelectorAll(".js-open-q-modal").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openQuestionnaireModal();
    });
  });

  if (btnEmbedded) {
    btnEmbedded.addEventListener("click", function () {
      setLayout("embedded");
    });
  }
  if (btnModal) {
    btnModal.addEventListener("click", function () {
      setLayout("modal");
    });
  }

  const closeBtn = dialog.querySelector(".questionnaire-modal__close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      dialog.close();
    });
  }

  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", function () {
    dispatchResize();
  });

  setLayout("embedded");
})();
