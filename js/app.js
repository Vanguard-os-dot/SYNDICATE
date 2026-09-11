// Close Modals when tapping outside the modal sheet (on the dimmed overlay background)
document.getElementById('transferModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeTransferModal();
  }
});

document.getElementById('profileModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeProfileModal();
  }
});

// Initial boot sequence: Render state onto the screen
updateUI();