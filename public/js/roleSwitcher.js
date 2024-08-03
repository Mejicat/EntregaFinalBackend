const form = document.getElementById('role-switch-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('role').dataset.userId;
  const newRole = document.getElementById('role').value;
  try {
    const response = await fetch(`/api/users/premium/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (response.ok) {
      Swal.fire({
        title: 'Role updated successfully',
        icon: 'success',
      });
    } else {
      Swal.fire({
        title: 'Error updating role',
        text: 'Please try again',
        icon: 'error',
      });
    }
  } catch (error) {
    console.error(error);
  }
});

const deleteUserButton = document.getElementById('delete-user-button');
deleteUserButton.addEventListener('click', async () => {
  const userId = deleteUserButton.dataset.userId;
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      Swal.fire({
        title: 'User deleted successfully',
        icon: 'success',
      }).then(() => {
        window.location.href = '/api/users'; 
      });
    } else {
      Swal.fire({
        title: 'Error deleting user',
        text: 'Please try again',
        icon: 'error',
      });
    }
  } catch (error) {
    console.error(error);
  }
});
