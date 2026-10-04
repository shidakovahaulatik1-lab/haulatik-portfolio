const projects = {
  webinar: {
    label: "Для экспертов и онлайн-школ",
    title: "Вебинар, который ведёт аудиторию к покупке",
    task: "Выстроить материал вебинара так, чтобы аудитория последовательно понимала ценность продукта и логику предложения.",
    result: "За 3 дня выстроена цельная система из 18 слайдов — от 3 дизайн-концепций до финальной подачи, которая последовательно раскрывает ценность продукта и поддерживает продающий сценарий вебинара.",
    cover: "assetsprojectswebinar-cover.png.png",
    gallery: [
      "webinar-support-1.png.png",
      "webinar-support-2.png.png",
      "assetsprojectswebinar-support-3.png.png",
      "assetsprojectswebinar-support-4.png.png"
    ]
  },
  vibe: {
    label: "VIBE · Инвестиционная презентация",
    title: "Как показать потенциал идеи инвестору",
    task: "Показать концепцию проекта, его преимущества и потенциал так, чтобы ключевая идея быстро считывалась инвестором.",
    result: "Выстроен визуальный сценарий, в котором идея проекта раскрывается через композицию и анимацию, а ключевые преимущества получают собственные смысловые акценты.",
    cover: "assetsprojectsvibe-cover.png.png",
    animation: "vibe-animation.mp4.mp4",
    gallery: ["vibe-support-1.png.png","vibe-support-2.png.png","vibe-support-3.png.png","vibe-support-4.png.png"]
  },
  investors: {
    label: "Для стартапов и команд",
    title: "Презентация, с которой понятно выходить к инвесторам",
    task: "Собрать продукт и команду в понятную историю, чтобы инвестор быстро видел суть предложения и ценность проекта.",
    result: "За 24 часа разрозненная информация о продукте и команде собрана в компактную презентацию из 6 слайдов с ясной структурой, согласованными текстами и единым визуальным направлением.",
    cover: "assetsprojectsinvestors-cover.png.png",
    gallery: ["investors-support-1.png.png","investors-support-2.png.png","investors-support-3.png.png"]
  },
  detox: {
    label: "Для экспертов и wellness-проектов",
    title: "Вебинар, который удерживает внимание",
    task: "Адаптировать материал о цифровом детоксе под выступление: выстроить логику, выделить ключевые смыслы и сделать подачу удобной для спикера.",
    result: "За 3 дня переработаны 15 слайдов: усилена структура, создана новая визуальная система и добавлена анимация с Morph-переходами — презентация стала работать как полноценное визуальное сопровождение вебинара, а не просто набор слайдов.",
    cover: "assetsprojectsdigital-detox-cover.png.png",
    animation: "digital-detox-animation.gif",
    gallery: ["digital-detox-support-1.png.png","digital-detox-support-2.png.png","- digital-detox-support-3.png.png","- digital-detox-support-4.png.png"]
  },
  "alyi-put": {
    label: "Концептуальная презентация",
    title: "Алый Путь",
    task: "",
    result: "",
    coverVideo: "alyi-put.mp4.mp4",
    gallery: []
  },
  animated: {
    label: "Анимационный проект",
    title: "Анимационный проект",
    task: "",
    result: "",
    coverVideo: "animated-project.mp4.mp4",
    gallery: []
  }
};

const q = (s, ctx = document) => ctx.querySelector(s);
const qa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// Keep short Russian prepositions/conjunctions attached to the following word.
function fixHangingPrepositions(root = document.body) {
  const shortWords = /(^|[\s(«„"—–-])((?:в|во|на|к|ко|с|со|у|о|об|обо|от|до|по|за|из|изо|для|при|под|подо|над|надо|без|через|между|и|а|но|да|или|либо|не|ни|что|как|же|бы|ли|то))\s+(?=\S)/giu;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);

  nodes.forEach(textNode => {
    const parent = textNode.parentElement;
    if (!parent || parent.closest("script,style,pre,code,input,textarea,select,option,[contenteditable='true']")) return;
    const value = textNode.nodeValue;
    if (!value || !value.trim()) return;
    textNode.nodeValue = value.replace(shortWords, "$1$2\u00A0");
  });
}

fixHangingPrepositions();

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  qa(".hero .reveal").forEach(el => el.classList.add("is-visible"));
});

const header = q(".site-header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.14 });
qa(".reveal:not(.hero .reveal)").forEach(el => revealObserver.observe(el));

const projectStages = qa(".project-stage");
projectStages.forEach((stage, index) => {
  stage.style.zIndex = String(index + 2);
});

function markMissingAssets() {
  qa("img").forEach(img => {
    img.addEventListener("error", () => {
      const wrap = img.closest("figure");
      if (wrap) wrap.classList.add("asset-missing");
      img.style.opacity = "0";
    });
    img.addEventListener("load", () => {
      const wrap = img.closest("figure");
      if (wrap) wrap.classList.remove("asset-missing");
      img.style.opacity = "1";
    });
  });
}
markMissingAssets();

const drawer = q("#projectDrawer");
const drawerTitle = q("#drawerTitle");
const drawerLabel = q("#drawerLabel");
const drawerTask = q("#drawerTask");
const drawerResult = q("#drawerResult");
const drawerPreview = q("#drawerPreview");
const drawerVideo = q("#drawerVideo");
const drawerGallery = q("#drawerGallery");
const drawerAnimationBtn = q("#drawerAnimationBtn");
let activeProject = null;
let showingAnimation = false;

function openProject(id, playAnimation = false) {
  const p = projects[id];
  if (!p) return;
  activeProject = id;
  showingAnimation = false;
  drawerLabel.textContent = p.label || "";
  drawerTitle.textContent = p.title || "";
  drawerTask.textContent = p.task || "В этом проекте основной акцент сделан на визуальной концепции.";
  drawerResult.textContent = p.result || "Кейс представлен как визуальная история без выдуманных метрик и результатов.";
  if (p.coverVideo) {
    drawerPreview.hidden = true;
    drawerPreview.removeAttribute("src");
    drawerVideo.hidden = false;
    drawerVideo.src = p.coverVideo;
    drawerVideo.autoplay = true;
    drawerVideo.muted = true;
    drawerVideo.loop = true;
    drawerVideo.play().catch(() => {});
  } else {
    drawerVideo.pause();
    drawerVideo.hidden = true;
    drawerVideo.removeAttribute("src");
    drawerPreview.hidden = false;
    drawerPreview.src = p.cover || "";
    drawerPreview.alt = p.title || "Проект";
  }
  drawerAnimationBtn.hidden = !p.animation;
  drawerAnimationBtn.textContent = "Смотреть анимацию ▶";

  drawerGallery.innerHTML = "";
  (p.gallery || []).forEach((src, i) => {
    const fig = document.createElement("figure");
    const img = document.createElement("img");
    img.src = src;
    img.alt = (p.title || "Проект") + " — дополнительный слайд " + (i + 1);
    img.addEventListener("error", () => fig.remove());
    fig.appendChild(img);
    drawerGallery.appendChild(fig);
  });

  fixHangingPrepositions(drawer);
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (playAnimation && p.animation) toggleAnimation();
}

function closeProject() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  drawerVideo.pause();
  drawerVideo.removeAttribute("src");
  activeProject = null;
  showingAnimation = false;
}

function toggleAnimation() {
  if (!activeProject) return;
  const p = projects[activeProject];
  if (!p?.animation) return;

  showingAnimation = !showingAnimation;
  const isVideoAnimation = /\.mp4($|\?)/i.test(p.animation);

  if (showingAnimation && isVideoAnimation) {
    drawerPreview.hidden = true;
    drawerPreview.removeAttribute("src");
    drawerVideo.hidden = false;
    drawerVideo.src = p.animation;
    drawerVideo.autoplay = true;
    drawerVideo.muted = false;
    drawerVideo.loop = false;
    drawerVideo.controls = true;
    drawerVideo.play().catch(() => {});
  } else if (showingAnimation) {
    drawerVideo.pause();
    drawerVideo.hidden = true;
    drawerVideo.removeAttribute("src");
    drawerPreview.hidden = false;
    drawerPreview.src = p.animation;
    drawerPreview.alt = (p.title || "Проект") + " — анимация";
  } else {
    drawerVideo.pause();
    drawerVideo.hidden = true;
    drawerVideo.removeAttribute("src");
    drawerVideo.controls = false;
    drawerPreview.hidden = false;
    drawerPreview.src = p.cover || "";
    drawerPreview.alt = p.title || "Проект";
  }

  drawerAnimationBtn.textContent = showingAnimation ? "Вернуться к превью ←" : "Смотреть анимацию ▶";
}

qa(".open-project").forEach(btn => btn.addEventListener("click", () => openProject(btn.dataset.project)));
qa(".project-media.open-project").forEach(el => el.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openProject(el.dataset.project);
  }
}));
qa(".play-preview").forEach(btn => btn.addEventListener("click", () => openProject(btn.dataset.project, true)));
qa("[data-close-drawer]").forEach(btn => btn.addEventListener("click", closeProject));
drawerAnimationBtn.addEventListener("click", toggleAnimation);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && drawer.classList.contains("is-open")) closeProject();
});


const projectVideoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting && entry.intersectionRatio > 0.18) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: [0, .18, .5] });
qa(".project-video").forEach(video => projectVideoObserver.observe(video));

const contactForm = q("#contactForm");
const formStatus = q("#formStatus");
const formSubmitBtn = contactForm?.querySelector(".submit-btn");

contactForm?.addEventListener("submit", async e => {
  e.preventDefault();
  if (!contactForm.reportValidity()) return;

  const fd = new FormData(contactForm);
  fd.append("_subject", "Новая заявка с сайта-портфолио");
  fd.append("_template", "table");
  fd.append("_captcha", "false");
  fd.append("_honey", "");

  formStatus.className = "form-status";
  formStatus.textContent = "Отправляю заявку…";
  formSubmitBtn.disabled = true;

  try {
    const response = await fetch("https://formsubmit.co/ajax/shidakova.haulatik1@mail.ru", {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: fd
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) throw new Error("send_failed");

    formStatus.classList.add("is-success");
    formStatus.textContent = "Спасибо! Заявка отправлена. Я свяжусь с вами в ближайшее время.";
    contactForm.reset();
  } catch (error) {
    formStatus.classList.add("is-error");
    formStatus.textContent = "Не удалось отправить заявку. Напишите мне в Telegram, WhatsApp или на e-mail ниже.";
  } finally {
    formSubmitBtn.disabled = false;
  }
});
const projectHoverMedia = qa(".project-media");
projectHoverMedia.forEach(media => {
  media.addEventListener("pointermove", e => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    const r = media.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 14;
    const y = ((e.clientY - r.top) / r.height - .5) * 10;
    media.style.setProperty("--move-x", x.toFixed(2) + "px");
    media.style.setProperty("--move-y", y.toFixed(2) + "px");
  });
  media.addEventListener("pointerleave", () => {
    media.style.setProperty("--move-x", "0px");
    media.style.setProperty("--move-y", "0px");
  });
});
