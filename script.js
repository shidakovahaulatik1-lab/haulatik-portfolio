const projects = {
  webinar: {
    label: "Для экспертов и онлайн-школ",
    title: "Вебинар, который ведёт аудиторию к покупке",
    task: "Выстроить материал вебинара так, чтобы аудитория последовательно понимала ценность продукта и логику предложения.",
    result: "За 3 дня выстроена цельная система из 18 слайдов — от 3 дизайн-концепций до финальной подачи, которая последовательно раскрывает ценность продукта и поддерживает продающий сценарий вебинара.",
    cover: "assets/projects/webinar-cover.png",
    gallery: [
      "assets/projects/webinar-support-1.png",
      "assets/projects/webinar-support-2.png",
      "assets/projects/webinar-speaker-1.png",
      "assets/projects/webinar-speaker-2.png"
    ]
  },
  vibe: {
    label: "VIBE · Инвестиционная презентация",
    title: "Как показать потенциал идеи инвестору",
    task: "Показать концепцию проекта, его преимущества и потенциал так, чтобы ключевая идея быстро считывалась инвестором.",
    result: "Выстроен визуальный сценарий, в котором идея проекта раскрывается через композицию и анимацию, а ключевые преимущества получают собственные смысловые акценты.",
    cover: "assets/projects/vibe-cover.png",
    animation: "assets/animations/vibe.gif",
    gallery: ["assets/projects/vibe-support-1.png","assets/projects/vibe-support-2.png"]
  },
  investors: {
    label: "Для стартапов и команд",
    title: "Презентация, с которой понятно выходить к инвесторам",
    task: "Собрать продукт и команду в понятную историю, чтобы инвестор быстро видел суть предложения и ценность проекта.",
    result: "За 24 часа разрозненная информация о продукте и команде собрана в компактную презентацию из 6 слайдов с ясной структурой, согласованными текстами и единым визуальным направлением.",
    cover: "assets/projects/investors-cover.png",
    gallery: ["assets/projects/investors-support-1.png","assets/projects/investors-support-2.png"]
  },
  detox: {
    label: "Для экспертов и wellness-проектов",
    title: "Вебинар, который удерживает внимание",
    task: "Адаптировать материал о цифровом детоксе под выступление: выстроить логику, выделить ключевые смыслы и сделать подачу удобной для спикера.",
    result: "За 3 дня переработаны 15 слайдов: усилена структура, создана новая визуальная система и добавлена анимация с Morph-переходами — презентация стала работать как полноценное визуальное сопровождение вебинара, а не просто набор слайдов.",
    cover: "assets/projects/digital-detox-cover.png",
    animation: "assets/animations/digital-detox.gif",
    gallery: ["assets/projects/digital-detox-support-1.png","assets/projects/digital-detox-support-2.png"]
  },
  "alyi-put": {
    label: "Концептуальная презентация",
    title: "Алый Путь",
    task: "",
    result: "",
    cover: "assets/animations/alyi-put-cover.gif",
    gallery: []
  },
  animated: {
    label: "Анимационный проект",
    title: "Анимационный проект",
    task: "",
    result: "",
    cover: "assets/projects/animated-cover.png",
    animation: "assets/animations/animated-project.gif",
    gallery: []
  }
};

const q = (s, ctx = document) => ctx.querySelector(s);
const qa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

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

qa(".project-stage").forEach((stage, index) => {
  const card = q(".project-card", stage);
  card.style.zIndex = index + 2;
});


const projectStages = qa(".project-stage");
const projectCards = projectStages.map(stage => q(".project-card", stage));

function updateProjectStackMotion() {
  const vh = Math.max(window.innerHeight, 1);
  projectStages.forEach((stage, index) => {
    const card = projectCards[index];
    if (!card) return;

    const rect = stage.getBoundingClientRect();
    const local = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height - vh, 1)));
    const nextStage = projectStages[index + 1];
    let coverProgress = 0;

    if (nextStage) {
      const nextRect = nextStage.getBoundingClientRect();
      coverProgress = Math.min(1, Math.max(0, 1 - nextRect.top / vh));
    }

    const scale = 1 - coverProgress * 0.032;
    const lift = -coverProgress * 18;
    const mediaY = (local - 0.5) * -30;
    const ghostX = (local - 0.5) * 180;

    card.style.setProperty("--stack-scale", scale.toFixed(4));
    card.style.setProperty("--stack-y", lift.toFixed(1) + "px");
    card.style.setProperty("--media-y", mediaY.toFixed(1) + "px");
    card.style.setProperty("--ghost-x", ghostX.toFixed(1) + "px");
    card.style.filter = coverProgress > 0 ? "brightness(" + (1 - coverProgress * 0.08).toFixed(3) + ")" : "";
  });
}

let stackTicking = false;
window.addEventListener("scroll", () => {
  if (stackTicking) return;
  stackTicking = true;
  requestAnimationFrame(() => {
    updateProjectStackMotion();
    stackTicking = false;
  });
}, { passive: true });
window.addEventListener("resize", updateProjectStackMotion);
updateProjectStackMotion();

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
  drawerPreview.src = p.cover || "";
  drawerPreview.alt = p.title || "Проект";
  drawerAnimationBtn.hidden = true;
  drawerAnimationBtn.textContent = "Смотреть анимацию ▶";
  if (p.animation) {
    fetch(p.animation, { method: "HEAD" })
      .then(r => { drawerAnimationBtn.hidden = !r.ok; })
      .catch(() => { drawerAnimationBtn.hidden = true; });
  }

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

  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (playAnimation && p.animation) toggleAnimation();
}

function closeProject() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  activeProject = null;
  showingAnimation = false;
}

function toggleAnimation() {
  if (!activeProject) return;
  const p = projects[activeProject];
  if (!p?.animation) return;
  showingAnimation = !showingAnimation;
  drawerPreview.src = showingAnimation ? p.animation : p.cover;
  drawerAnimationBtn.textContent = showingAnimation ? "Вернуться к превью ←" : "Смотреть анимацию ▶";
}

qa(".open-project").forEach(btn => btn.addEventListener("click", () => openProject(btn.dataset.project)));
qa(".play-preview").forEach(btn => btn.addEventListener("click", () => openProject(btn.dataset.project, true)));
qa("[data-close-drawer]").forEach(btn => btn.addEventListener("click", closeProject));
drawerAnimationBtn.addEventListener("click", toggleAnimation);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && drawer.classList.contains("is-open")) closeProject();
});

const contactForm = q("#contactForm");
contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const fd = new FormData(contactForm);
  const lines = [
    "Новая заявка с сайта",
    "",
    "Имя: " + (fd.get("name") || ""),
    "Контакт: " + (fd.get("contact") || ""),
    "Тип проекта: " + (fd.get("type") || ""),
    "Количество слайдов: " + (fd.get("slides") || ""),
    "Срок: " + (fd.get("deadline") || ""),
    "",
    "Задача:",
    fd.get("message") || ""
  ];
  const subject = encodeURIComponent("Заявка с сайта-портфолио");
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = "mailto:shidakova.haulatik1@mail.ru?subject=" + subject + "&body=" + body;
});