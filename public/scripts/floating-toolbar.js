// Floating toolbar initialization (runs on every page)
import { auth, logout } from './auth.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

const initFloatingToolbar = () => {
  const toolbar = document.getElementById('floatingToolbar');
  if (!toolbar) return; // Toolbar not present on this page

  const btnAddEmployee = toolbar.querySelector('#ft-add-employee');
  const btnLogout = toolbar.querySelector('#ft-logout');
  const btnMyEmployees = toolbar.querySelector('#ft-my-employees');
  const btnAllEmployees = toolbar.querySelector('#ft-all-employees');

  // Show/hide toolbar based on auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      toolbar.style.display = 'flex';
    } else {
      toolbar.style.display = 'none';
    }
  });

  // Attach event listeners
  if (btnAddEmployee) {
    btnAddEmployee.addEventListener('click', () => {
      // Call the modal open function from AddEmployeeModal.astro
      if (window.openAddEmployeeModal) {
        window.openAddEmployeeModal();
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await logout();
    });
  }

  if (btnMyEmployees) {
    btnMyEmployees.addEventListener('click', () => {
      window.location.href = '/dashboard';
    });
  }

  if (btnAllEmployees) {
    btnAllEmployees.addEventListener('click', () => {
      window.location.href = '/public-employees';
    });
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFloatingToolbar);
} else {
  initFloatingToolbar();
}
