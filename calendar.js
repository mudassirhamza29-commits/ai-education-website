/* ── Storage helpers ─────────────────────────────────────────────── */
const STORAGE_KEY = 'calendar_events';

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

/* ── State ───────────────────────────────────────────────────────── */
let currentDate = new Date();
let events = loadFromStorage();
let editingId = null; // null = creating new, string = editing existing

/* ── DOM refs ────────────────────────────────────────────────────── */
const calGrid    = document.getElementById('cal-grid');
const monthLabel = document.getElementById('month-label');
const overlay    = document.getElementById('modal-overlay');
const form       = document.getElementById('event-form');
const fId        = document.getElementById('event-id');
const fTitle     = document.getElementById('event-title');
const fDate      = document.getElementById('event-date');
const fStart     = document.getElementById('event-start');
const fEnd       = document.getElementById('event-end');
const fDesc      = document.getElementById('event-desc');
const errTitle   = document.getElementById('error-title');
const errDate    = document.getElementById('error-date');
const errTime    = document.getElementById('error-time');
const modalHead  = document.getElementById('modal-heading');
const btnDelete  = document.getElementById('btn-delete');

/* ── Render calendar ─────────────────────────────────────────────── */
function renderCalendar() {
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based

  // Update header label
  monthLabel.textContent = new Date(year, month, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Remove old day cells (keep the 7 weekday header divs)
  const cells = calGrid.querySelectorAll('.cal-day');
  cells.forEach(c => c.remove());

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();

  const todayStr = toDateString(new Date());

  // Leading days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const dateStr = toDateString(new Date(year, month - 1, d));
    calGrid.appendChild(createCell(d, dateStr, true));
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = toDateString(new Date(year, month, d));
    const cell = createCell(d, dateStr, false);
    if (dateStr === todayStr) cell.classList.add('today');
    calGrid.appendChild(cell);
  }

  // Trailing days from next month (fill to complete the last row)
  const total = firstDay + daysInMonth;
  const trailing = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= trailing; d++) {
    const dateStr = toDateString(new Date(year, month + 1, d));
    calGrid.appendChild(createCell(d, dateStr, true));
  }
}

function createCell(dayNum, dateStr, isOtherMonth) {
  const cell = document.createElement('div');
  cell.className = 'cal-day' + (isOtherMonth ? ' other-month' : '');
  cell.dataset.date = dateStr;

  const numEl = document.createElement('span');
  numEl.className = 'day-num';
  numEl.textContent = dayNum;
  cell.appendChild(numEl);

  // Add event chips
  const dayEvents = events.filter(e => e.date === dateStr);
  dayEvents.forEach(ev => {
    const chip = document.createElement('span');
    chip.className = 'event-chip';
    chip.textContent = ev.startTime ? `${ev.startTime} ${ev.title}` : ev.title;
    chip.dataset.id = ev.id;
    chip.addEventListener('click', e => {
      e.stopPropagation(); // don't also trigger cell click
      openModal(dateStr, ev.id);
    });
    cell.appendChild(chip);
  });

  cell.addEventListener('click', () => openModal(dateStr, null));
  return cell;
}

/* ── Navigation ──────────────────────────────────────────────────── */
document.getElementById('btn-prev').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById('btn-next').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

document.getElementById('btn-today').addEventListener('click', () => {
  currentDate = new Date();
  renderCalendar();
});

/* ── Modal open / close ──────────────────────────────────────────── */
function openModal(dateStr, eventId) {
  clearErrors();
  editingId = eventId;

  if (eventId) {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;
    modalHead.textContent = 'Edit Event';
    fId.value    = ev.id;
    fTitle.value = ev.title;
    fDate.value  = ev.date;
    fStart.value = ev.startTime || '';
    fEnd.value   = ev.endTime || '';
    fDesc.value  = ev.description || '';
    btnDelete.style.display = 'inline-flex';
  } else {
    modalHead.textContent = 'Add Event';
    form.reset();
    fDate.value = dateStr;
    btnDelete.style.display = 'none';
  }

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  fTitle.focus();
}

function closeModal() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  editingId = null;
  clearErrors();
}

document.getElementById('btn-cancel').addEventListener('click', closeModal);

// Close on overlay backdrop click
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
});

/* ── Validation ──────────────────────────────────────────────────── */
function clearErrors() {
  errTitle.textContent = '';
  errDate.textContent  = '';
  errTime.textContent  = '';
  fTitle.classList.remove('invalid');
  fDate.classList.remove('invalid');
  fEnd.classList.remove('invalid');
}

function validateForm(data) {
  let valid = true;

  if (!data.title.trim()) {
    errTitle.textContent = 'Title is required.';
    fTitle.classList.add('invalid');
    valid = false;
  }

  if (!data.date) {
    errDate.textContent = 'Date is required.';
    fDate.classList.add('invalid');
    valid = false;
  }

  if (data.startTime && data.endTime && data.endTime < data.startTime) {
    errTime.textContent = 'End time must be after start time.';
    fEnd.classList.add('invalid');
    valid = false;
  }

  return valid;
}

/* ── Save / Delete ───────────────────────────────────────────────── */
form.addEventListener('submit', e => {
  e.preventDefault();
  clearErrors();

  const data = {
    title:       fTitle.value,
    date:        fDate.value,
    startTime:   fStart.value,
    endTime:     fEnd.value,
    description: fDesc.value.trim(),
  };

  if (!validateForm(data)) return;

  if (editingId) {
    // Update existing
    const idx = events.findIndex(ev => ev.id === editingId);
    if (idx !== -1) events[idx] = { id: editingId, ...data };
  } else {
    // Create new
    events.push({ id: generateId(), ...data });
  }

  saveToStorage();
  closeModal();
  renderCalendar();
});

btnDelete.addEventListener('click', () => {
  if (!editingId) return;
  events = events.filter(ev => ev.id !== editingId);
  saveToStorage();
  closeModal();
  renderCalendar();
});

/* ── Utility ─────────────────────────────────────────────────────── */
function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ── Init ────────────────────────────────────────────────────────── */
renderCalendar();
