document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('employee-search');
  const profileWrap = document.querySelector('.profile-wrap');
  if (!input || !profileWrap) return;

  // Improve keyboard/accessibility
  input.setAttribute('role', 'searchbox');
  input.setAttribute('aria-label', 'Search employees by name or role');

  // "No results" element
  const noResults = document.createElement('div');
  noResults.className = 'no-results';
  noResults.setAttribute('role', 'status');
  noResults.setAttribute('aria-live', 'polite');
  noResults.textContent = 'No employees found matching your search.';

  let employees = [];
  let cards = [];
  const countStrong = document.querySelector('.employee-count h3 strong');

  // Fetch employee data and render cards
  fetch('/data/employees.json')
    .then(res => res.json())
    .then(data => {
      employees = Array.isArray(data) ? data : [];
      renderCards(employees);
      // Update the employee count (total only)
      if (countStrong) countStrong.textContent = String(employees.length);
      profileWrap.appendChild(noResults);
    })
    .catch(err => {
      console.error('Failed to load employees.json', err);
      if (countStrong) countStrong.textContent = '0';
      profileWrap.appendChild(noResults);
    });

  // Attach search handlers
  input.addEventListener('search', (e) => {
    filterCards(e.target.value || '');
    input.focus();
  });
  input.addEventListener('input', (e) => filterCards(e.target.value || ''));

  function renderCards(list) {
    profileWrap.innerHTML = '';
    cards = list.map(emp => {
      const card = document.createElement('div');
      card.className = 'profile-card';

      card.innerHTML = `
        <div class="photo">
          <img src="${emp.image || '/assets/bave-pictures-aqWtuTUMiu4-unsplash.jpg'}" alt="${escapeHtml(emp.name)}">
        </div>
        <div class="info">
          <div class="flex-two-col">
            <h3>${escapeHtml(emp.name)}</h3>
            <h4>${escapeHtml(emp.role || '')}</h4>
          </div>
          <div class="menu">
            <div class="dots"></div>
            <div class="dots"></div>
            <div class="dots"></div>
          </div>
        </div>
        <div class="details">
          <div class="left">
            <p>Hired Date</p>
            <p>${escapeHtml(emp.hiredDate || '')}</p>
          </div>
          <div class="right">
            <p>Status</p>
            <p>${escapeHtml(emp.status || '')}</p>
          </div>
        </div>
        <div class="button">
          <a href="#" data-id="${emp.id}" class="view-details">VIEW DETAILED INFO</a>
        </div>
      `;

      profileWrap.appendChild(card);
      // attach click handler for the details button
      const btn = card.querySelector('.button');
      if (btn) btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        openModal(emp);
      });
      return card;
    });
  }

  // --- Modal implementation ---
  const modal = document.createElement('div');
  modal.className = 'employee-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="employee-modal__overlay"></div>
    <div class="employee-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="emp-modal-title">
      <button class="employee-modal__close" aria-label="Close">×</button>
      <div class="employee-modal__content">
        <!-- populated dynamically -->
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalOverlay = modal.querySelector('.employee-modal__overlay');
  const modalDialog = modal.querySelector('.employee-modal__dialog');
  const modalClose = modal.querySelector('.employee-modal__close');
  const modalContent = modal.querySelector('.employee-modal__content');

  function openModal(emp) {
    modalContent.innerHTML = `
      <h2 id="emp-modal-title">${escapeHtml(emp.name)} — ${escapeHtml(emp.role)}</h2>
      <p><strong>Status:</strong> ${escapeHtml(emp.status)}</p>
      <p><strong>Hired:</strong> ${escapeHtml(emp.hiredDate)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(emp.email)}">${escapeHtml(emp.email)}</a></p>
      <p><strong>Phone:</strong> <a href="tel:${escapeHtml(emp.phone)}">${escapeHtml(emp.phone)}</a></p>
      <p><strong>Salary:</strong> ${escapeHtml(emp.salary || '')}</p>
      <p>${escapeHtml(emp.bio || '')}</p>
      ${emp.incidents && emp.incidents.length ? `<h3>Incidents</h3><ul>${emp.incidents.map(i => `<li><strong>${escapeHtml(i.date)}</strong>: ${escapeHtml(i.reason)}${i.notes ? ' — ' + escapeHtml(i.notes) : ''}</li>`).join('')}</ul>` : ''}
    `;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    // trap focus loosely by focusing close button
    modalClose.focus();
    document.addEventListener('keydown', handleKeyDown);
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    document.removeEventListener('keydown', handleKeyDown);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') closeModal();
  }

  modalOverlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);

  function filterCards(value) {
    const q = (value || '').trim().toLowerCase();
    let visibleCount = 0;
    profileWrap.classList.toggle('searching', q !== '');

    cards.forEach(card => {
      const nameEl = card.querySelector('.info h3');
      const roleEl = card.querySelector('.info h4');
      const text = ((nameEl?.textContent || '') + ' ' + (roleEl?.textContent || '')).toLowerCase();
      const visible = q === '' || text.includes(q);
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });

  // keep the employee count displaying the total number (do not change on filter)

    if (q === '') {
      noResults.textContent = 'No employees found matching your search.';
    } else {
      noResults.textContent = visibleCount === 0
        ? 'No employees found matching your search.'
        : `Found ${visibleCount} matching employee${visibleCount === 1 ? '' : 's'}.`;
    }
  }

  // Basic HTML escaping for injected strings
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
});
