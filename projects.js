// projects.js
const MAX_KEY_PROJECTS = 3;

/* ------------------ Shared helpers (used on both pages) ------------------ */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[s]));
}
function escapeAttr(str) { return escapeHtml(str); }

function projectToCardHTML(p) {
  const tags = (p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");

  const links = (p.links || []).map(l => {
    const safeUrl = l.url || "#";
    const icon = l.icon ? l.icon : "fa-link";
    const isExternal = /^https?:\/\//i.test(safeUrl);
    const rel = isExternal ? `rel="noopener"` : "";
    const target = isExternal ? `target="_blank"` : "";

    const primary = ["view", "live", "demo"].includes((l.label || "").toLowerCase());
    const cls = primary ? "btn-primary" : "btn-ghost";

    return `
      <a class="${cls}" href="${safeUrl}" ${target} ${rel}>
        <i class="fa-solid ${escapeAttr(icon)}"></i> ${escapeHtml(l.label || "Link")}
      </a>
    `;
  }).join("");

  return `
    <article class="project-card">
      <div class="project-thumb">
        <img src="${escapeAttr(p.image || "images/latestprojects.jpg")}"
             alt="${escapeAttr(p.title || "Project")}" loading="lazy">
      </div>

      <div class="project-body">
        <h3 class="project-title">${escapeHtml(p.title || "")}</h3>
        <p class="project-desc">${escapeHtml(p.desc || "")}</p>

        <div class="project-tags">${tags}</div>
        <div class="project-actions">${links}</div>
      </div>
    </article>
  `;
}

/* ------------------ Data load ------------------ */
async function fetchProjects() {
  const res = await fetch("projects.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load projects.json");
  const projects = await res.json();

  // newest first
  return [...projects].sort((a, b) => {
    const da = new Date(a.date || a.createdAt || 0).getTime();
    const db = new Date(b.date || b.createdAt || 0).getTime();
    return db - da;
  });
}

/* ------------------ Homepage: show only 3 ------------------ */
async function loadKeyProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  try {
    const sorted = await fetchProjects();
    const keyProjects = sorted.slice(0, MAX_KEY_PROJECTS);
    grid.innerHTML = keyProjects.map(projectToCardHTML).join("");
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="opacity:.8">Could not load projects. Check <b>projects.json</b>.</p>`;
  }
}

/* ------------------ Projects page: show ALL ------------------ */
async function loadAllProjects() {
  const grid = document.getElementById("allProjectsGrid");
  if (!grid) return;

  try {
    const sorted = await fetchProjects();
    grid.innerHTML = sorted.map(projectToCardHTML).join("");
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="opacity:.8">Could not load projects. Check <b>projects.json</b>.</p>`;
  }
}

/* ------------------ Auto-run the right loader on each page ------------------ */
document.addEventListener("DOMContentLoaded", () => {
  loadKeyProjects();   // runs only if #projectsGrid exists
  loadAllProjects();   // runs only if #allProjectsGrid exists
});
