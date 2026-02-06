const ИМЕ_НА_ГАДЖЕТО = "Любов";
const ТВОЕТО_ИМЕ = "Пети";
const ВАША_ШЕГА = "когато ми крадеш суичъра 😄";
const ВЪПРОС = "Ще бъдеш ли моята половинка за Свети Валентин?";
const ДОПЪЛНИТЕЛНО = "И… искаш ли да излезем на сладка среща следващия уикенд?";

const lines = [
  `Хей, ${ИМЕ_НА_ГАДЖЕТО} ❤️`,
  "",
  "Можех просто да ти пиша…",
  "ама съм \"програмист\" — и реших да направя нещо по-различно 🙂",
  "",
  "Истината е:",
  "С теб всичко ми става по-леко.",
  `Дори най-малките неща — като ${ВАША_ШЕГА} — са ми любими.`,
  "",
  "Искам да те питам нещо просто, но много важно:",
  "",
  `👉 ${ВЪПРОС}`,
  "",
  ДОПЪЛНИТЕЛНО
];

const typeEl = document.getElementById("typewriter");
const headline = document.getElementById("headline");
const subtitle = document.getElementById("subtitle");
const yesBtn = document.getElementById("yesBtn");
const dodgeZone = document.getElementById("dodgeZone");
const hearts = document.getElementById("hearts");
const confetti = document.getElementById("confetti");
const final = document.getElementById("final");
const status = document.getElementById("status");

const whenChip = document.querySelector("#whenChip span");
const timeChip = document.querySelector("#timeChip span");
const placeChip = document.querySelector("#placeChip span");

headline.textContent = `Хей, ${ИМЕ_НА_ГАДЖЕТО} ❤️`;
subtitle.textContent = `Направих тази малка страница, защото искам да те питам нещо, ${ИМЕ_НА_ГАДЖЕТО}…`;

const fullText = lines.join("\n");
let idx = 0;

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
    .replaceAll("\n", "<br/>");
}

function typeNext() {
  typeEl.innerHTML = escapeHtml(fullText.slice(0, idx)) + `<span class="caret">▍</span>`;
  idx++;
  if (idx <= fullText.length) {
    const ch = fullText[idx - 1] || "";
    const delay = ch === "\n" ? 260 : (ch === "." ? 120 : 24);
    setTimeout(typeNext, delay);
  } else {
    typeEl.innerHTML = escapeHtml(fullText);
  }
}
typeNext();

const heartChars = ["💗", "💖", "💘", "💞", "💓", "💕"];
function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = (14 + Math.random() * 18) + "px";
  h.style.setProperty("--drift", ((Math.random() * 2 - 1) * 160) + "px");
  h.style.setProperty("--rot", ((Math.random() * 2 - 1) * 110) + "deg");
  const dur = 6 + Math.random() * 6;
  h.style.animationDuration = dur + "s";
  hearts.appendChild(h);
  setTimeout(() => h.remove(), dur * 1000 + 600);
}
setInterval(spawnHeart, 520);

function burstConfetti() {
  confetti.innerHTML = "";
  confetti.classList.add("show");
  const count = 130;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = (3.8 + Math.random() * 3.6) + "s";
    p.style.animationDelay = (Math.random() * 0.15) + "s";
    p.style.background = `rgba(255,255,255,${0.35 + Math.random() * 0.55})`;
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    p.style.width = (6 + Math.random() * 10) + "px";
    p.style.height = (10 + Math.random() * 16) + "px";
    confetti.appendChild(p);
  }

  setTimeout(() => confetti.classList.remove("show"), 7200);
}

function rectsOverlap(a, b) {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

function expandRect(r, m) {
  return { left: r.left - m, top: r.top - m, right: r.right + m, bottom: r.bottom + m };
}

let noClicks = 0;
let noArmed = false;

function removeNoButton() {
  const btn = document.getElementById("noBtn");
  if (!btn) return;
  btn.remove();
  status.innerHTML = `<span>😄</span><span>Хайде… и двамата знаем отговора. Натисни „Да“ ❤️</span>`;
}

function armNoButton() {
  const btn = document.getElementById("noBtn");
  if (!btn || noArmed) return;

  noArmed = true;

  const yesW = Math.round(yesBtn.getBoundingClientRect().width);
  btn.style.width = yesW + "px";

  const zoneRect = dodgeZone.getBoundingClientRect();
  const noRect = btn.getBoundingClientRect();

  const left = noRect.left - zoneRect.left;
  const top = noRect.top - zoneRect.top;

  btn.style.position = "absolute";
  btn.style.left = left + "px";
  btn.style.top = top + "px";
}

function moveNoButton(fromClick) {
  const btn = document.getElementById("noBtn");
  if (!btn) return;

  if (!noArmed) return;

  if (fromClick) {
    noClicks++;
    if (noClicks >= 10) {
      removeNoButton();
      return;
    }
  }

  const zone = dodgeZone.getBoundingClientRect();
  const yesR = yesBtn.getBoundingClientRect();
  const noR = btn.getBoundingClientRect();

  const w = noR.width;
  const h = noR.height;

  const isPhone = window.matchMedia("(max-width:520px)").matches;
  const margin = isPhone ? 18 : 14;
  const forbidden = expandRect(yesR, margin);

  const pad = 8;
  const minX = pad;
  const minY = pad;
  const maxX = Math.max(minX, zone.width - w - pad);
  const maxY = Math.max(minY, zone.height - h - pad);

  const yesCx = (forbidden.left + forbidden.right) / 2;
  const yesCy = (forbidden.top + forbidden.bottom) / 2;

  const minDist = isPhone ? 130 : 110;
  const maxDist = isPhone ? 220 : 200;

  let best = null;
  let bestScore = -Infinity;

  const tries = 140;

  for (let i = 0; i < tries; i++) {
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    const cand = {
      left: zone.left + x,
      top: zone.top + y,
      right: zone.left + x + w,
      bottom: zone.top + y + h
    };

    if (rectsOverlap(cand, forbidden)) continue;

    const cx = (cand.left + cand.right) / 2;
    const cy = (cand.top + cand.bottom) / 2;
    const d = Math.hypot(cx - yesCx, cy - yesCy);

    if (d < minDist) continue;

    const target = (minDist + maxDist) / 2;
    const score = -Math.abs(d - target);

    if (score > bestScore) {
      bestScore = score;
      best = { x, y };
    }
  }

  if (!best) {
    for (let i = 0; i < 200; i++) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);

      const cand = {
        left: zone.left + x,
        top: zone.top + y,
        right: zone.left + x + w,
        bottom: zone.top + y + h
      };

      if (!rectsOverlap(cand, forbidden)) {
        best = { x, y };
        break;
      }
    }
  }

  if (!best) best = { x: maxX, y: maxY };

  btn.style.left = best.x + "px";
  btn.style.top = best.y + "px";

  status.innerHTML = `<span>😄</span><span>Мм… не. Натисни „Да“. 😄</span>`;
}

const noBtn = document.getElementById("noBtn");

noBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (!noArmed) armNoButton();

  moveNoButton(true);
});

noBtn.addEventListener("pointerenter", () => {
  if (noArmed) moveNoButton(false);
});

yesBtn.addEventListener("click", () => {
  burstConfetti();
  final.classList.add("show");
  status.innerHTML = `<span>💖</span><span>Най-правилният избор 😄</span>`;

  const now = new Date();
  const dateFmt = new Intl.DateTimeFormat("bg-BG", { year: "numeric", month: "long", day: "2-digit" });
  const timeFmt = new Intl.DateTimeFormat("bg-BG", { hour: "2-digit", minute: "2-digit" });
  whenChip.textContent = dateFmt.format(now);
  timeChip.textContent = timeFmt.format(now);

  removeNoButton();

  for (let i = 0; i < 18; i++) setTimeout(spawnHeart, i * 60);
});

window.addEventListener("resize", () => {
  const btn = document.getElementById("noBtn");
  if (!btn) return;

  if (noArmed) moveNoButton(false);
});