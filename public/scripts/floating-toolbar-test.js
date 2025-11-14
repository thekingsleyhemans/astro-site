// Floating toolbar initialization — TEST VERSION (no Firebase dependency)
// This helps debug if the HTML/CSS/JS is working before Firebase is configured

const initFloatingToolbar = () => {
  const toolbar = document.getElementById('floatingToolbar');
  if (!toolbar) {
    console.warn('Toolbar element not found in DOM');
    return;
  }

  console.log('Toolbar found, showing it for testing...');
  toolbar.style.display = 'flex'; // Show immediately for testing

  const btnAddEmployee = toolbar.querySelector('#ft-add-employee');
  const btnLogout = toolbar.querySelector('#ft-logout');
  const btnMyEmployees = toolbar.querySelector('#ft-my-employees');
  const btnAllEmployees = toolbar.querySelector('#ft-all-employees');

  // Attach event listeners
  if (btnAddEmployee) {
    console.log('Add Employee button found, attaching handler');
    btnAddEmployee.addEventListener('click', () => {
      alert('Add Employee clicked (test mode)');
      // In real mode, this would open a modal or navigate to a form
    });
  } else {
    console.warn('Add Employee button not found');
  }

  if (btnLogout) {
    console.log('Logout button found, attaching handler');
    btnLogout.addEventListener('click', async () => {
      alert('Logout clicked (test mode)');
      // In real mode, this would call: await logout();
    });
  } else {
    console.warn('Logout button not found');
  }

  if (btnMyEmployees) {
    console.log('My Employees button found, attaching handler');
    btnMyEmployees.addEventListener('click', () => {
      alert('My Employees clicked (test mode)');
      // window.location.href = '/dashboard';
    });
  } else {
    console.warn('My Employees button not found');
  }

  if (btnAllEmployees) {
    console.log('All Employees button found, attaching handler');
    btnAllEmployees.addEventListener('click', () => {
      alert('All Employees clicked (test mode)');
      // window.location.href = '/public-employees';
    });
  } else {
    console.warn('All Employees button not found');
  }

  console.log('Floating toolbar initialized (TEST MODE - no Firebase)');
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFloatingToolbar);
} else {
  initFloatingToolbar();
}
