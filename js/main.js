
import data from "./data.js";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function safeHref(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^[./]/.test(url))
    return url;
  return "https://" + url;
}

function renderHeader() {
  $("#name").textContent = data.name || "Your Name";
  $("#title").textContent = data.title || "";
}

function renderHero() {
  const avatar = $("#avatar");
  const heroSection = $(".hero");

  if (data.avatarUrl && data.avatarUrl.trim() !== "") {
    avatar.src = data.avatarUrl;
    avatar.alt = `${data.name}'s avatar`;
    // Ensure hero has grid layout for avatar + content
    heroSection.classList.remove("no-avatar");
  } else {
    // No avatar provided: remove the element and add class for styling
    if (avatar) {
      avatar.remove();
    }
    heroSection.classList.add("no-avatar");
  }
  const about = $("#about-text");
  if (data.about) about.textContent = data.about;

  const emailBtn = $("#emailLink");
  if (data.contact?.email) emailBtn.href = `mailto:${data.contact.email}`;
  else emailBtn.style.display = "none";

  const social = $("#socialLinks");
  social.innerHTML = "";
  const entries = Object.entries(data.social || {}).filter(([, v]) => v);
  entries.forEach(([key, url]) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = safeHref(url);
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    li.appendChild(a);
    social.appendChild(li);
  });
}

function renderSkills() {
  const list = $("#skillsList");
  list.innerHTML = "";
  (data.skills || []).forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    list.appendChild(li);
  });
  if (!(data.skills || []).length) $("#skills").style.display = "none";
}

function renderProjects() {
  const container = $("#project-list");
  container.innerHTML = "";

  (data.projects || []).forEach((p) => {
    const card = document.createElement("article");
    card.className = "project";

    if (p.image) {
      const img = document.createElement("img");
      img.src = p.image;
      img.alt = `${p.title} screenshot`;
      card.appendChild(img);
    }

    const h4 = document.createElement("h4");
    h4.textContent = p.title;
    card.appendChild(h4);

    const desc = document.createElement("p");
    desc.textContent = p.description;
    card.appendChild(desc);

    if (p.tags?.length) {
      const tags = document.createElement("div");
      tags.className = "tags";
      p.tags.forEach((t) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = t;
        tags.appendChild(span);
      });
      card.appendChild(tags);
    }

    const links = document.createElement("div");
    if (p.repo) {
      const code = document.createElement("a");
      code.href = safeHref(p.repo);
      code.target = "_blank";
      code.rel = "noopener";
      code.className = "btn secondary";
      code.textContent = "Code";
      links.appendChild(code);
    }
    if (p.link) {
      const demo = document.createElement("a");
      demo.href = safeHref(p.link);
      demo.target = "_blank";
      demo.rel = "noopener";
      demo.className = "btn";
      demo.textContent = "Live Demo";
      links.appendChild(demo);
    }
    if (links.childElementCount) card.appendChild(links);

    container.appendChild(card);
  });
}

function renderExperience() {
  const list = $("#experienceList");
  const section = $("#experience");

  list.innerHTML = "";

  // Check if experience data exists and has content
  if (!data.experience || data.experience.length === 0) {
    section.style.display = "none";
    return;
  }

  // Show section if we have experience data
  section.style.display = "block";

  data.experience.forEach((e) => {
    const div = document.createElement("div");
    div.className = "item";
    const h4 = document.createElement("h4");
    if (e.url) {
      const a = document.createElement("a");
      a.href = safeHref(e.url);
      a.textContent = `${e.role} · ${e.company}`;
      a.target = "_blank";
      a.rel = "noopener";
      h4.appendChild(a);
    } else {
      h4.textContent = `${e.role} · ${e.company}`;
    }
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${e.start} – ${e.end}${
      e.location ? " · " + e.location : ""
    }`;
    div.appendChild(h4);
    div.appendChild(meta);
    if (e.description) {
      const p = document.createElement("p");
      p.textContent = e.description;
      div.appendChild(p);
    }
    if (e.highlights?.length) {
      const ul = document.createElement("ul");
      e.highlights.forEach((h) => {
        const li = document.createElement("li");
        li.textContent = h;
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }
    list.appendChild(div);
  });
}

function renderEducation() {
  const list = $("#educationList");
  list.innerHTML = "";
  (data.education || []).forEach((ed) => {
    const div = document.createElement("div");
    div.className = "item";
    const h4 = document.createElement("h4");
    h4.textContent = `${ed.degree} · ${ed.school}`;
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${ed.start} – ${ed.end}${
      ed.location ? " · " + ed.location : ""
    }`;
    div.appendChild(h4);
    div.appendChild(meta);
    if (ed.gpa) {
      const p = document.createElement("p");
      p.textContent = `GPA: ${ed.gpa}`;
      div.appendChild(p);
    }
    if (ed.highlights?.length) {
      const ul = document.createElement("ul");
      ed.highlights.forEach((h) => {
        const li = document.createElement("li");
        li.textContent = h;
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }
    list.appendChild(div);
  });
  if (!(data.education || []).length) $("#education").style.display = "none";
}

function renderContactFooter() {
  const year = new Date().getFullYear();
  $("#year").textContent = String(year);
  $("#footerName").textContent = data.name || "";

  const email = $("#email");
  if (data.contact?.email) {
    email.textContent = data.contact.email;
    email.href = `mailto:${data.contact.email}`;
  }

  const phone = $("#phone");
  const phoneSection = $("#phoneSection");
  if (data.contact?.phone && data.contact.phone.trim() !== "") {
    phone.textContent = data.contact.phone;
    // Create tel: link by removing non-numeric characters except +
    const telHref = `tel:${data.contact.phone.replace(/[^\d+]/g, "")}`;
    phone.href = telHref;
    phoneSection.style.display = "block";
  } else {
    phoneSection.style.display = "none";
  }

  const linked = $("#linkedin");
  if (data.contact?.linkedin) linked.href = safeHref(data.contact.linkedin);
}

function setTheme(pref) {
  const root = document.documentElement;
  const valid = ["light", "dark", "auto"].includes(pref) ? pref : "auto";
  if (valid === "auto") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", valid);
  }
  try {
    localStorage.setItem("theme", valid);
  } catch {}
}

function initTheme() {
  const saved = (() => {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  })();
  setTheme(saved || "auto");
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const current = localStorage.getItem("theme") || "auto";
      const next =
        current === "light" ? "dark" : current === "dark" ? "auto" : "light";
      setTheme(next);
      btn.title = `Theme: ${next}`;
    });
  }
}

function init() {
  initTheme();
  renderHeader();
  renderHero();
  renderSkills();
  renderProjects();
  renderExperience();
  renderEducation();
  renderContactFooter();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}



