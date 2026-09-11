// UI Render Helpers
function formatCurrency(val) {
  return 'R ' + val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}

function updateUI() {
  document.getElementById('displayUsername').textContent = state.user.name;
  document.getElementById('displayUserId').textContent = state.user.id;

  const total = state.checking + state.vault;
  document.getElementById('totalBalance').textContent = formatCurrency(total);
  document.getElementById('checkingBalance').textContent = formatCurrency(state.checking);
  document.getElementById('vaultBalance').textContent = formatCurrency(state.vault);
  document.getElementById('staticVaultVal').textContent = formatCurrency(state.vault);

  // Render History
  const dashHistory = document.getElementById('dashboardHistory');
  const fullHistory = document.getElementById('fullLedgerHistory');
  
  let html = '';
  state.transactions.forEach(tx => {
    html += `
      <div class="tx-item">
        <div class="tx-info">
          <div class="desc">${tx.desc}</div>
          <div class="meta">${tx.meta}</div>
        </div>
        <div class="tx-val">
          <div class="amount ${tx.type}">${tx.type === 'credit' ? '+' : '-'}${formatCurrency(tx.amount)}</div>
          <div class="status">${tx.status}</div>
        </div>
      </div>
    `;
  });

  dashHistory.innerHTML = html;
  fullHistory.innerHTML = html;

  // Render Batch Pending Sum
  const batchSum = state.pendingBatch.reduce((sum, item) => sum + item.amount, 0);
  document.getElementById('batchQueueVal').textContent = formatCurrency(batchSum);
}

// View Controller
function switchView(viewId) {
  document.querySelectorAll('.view-page').forEach(el => el.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
}

function switchNav(navEl, viewId) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  navEl.classList.add('active');
  switchView(viewId);
}

// Modals & Notifications
function openProfileModal() {
  document.getElementById('modalUsername').value = state.user.name;
  document.getElementById('modalUserIdPreview').textContent = state.user.id;
  document.getElementById('profileModal').classList.add('active');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('active');
}

function openTransferModal() {
  document.getElementById('transferModal').classList.add('active');
}

function closeTransferModal() {
  document.getElementById('transferModal').classList.remove('active');
}

function showToast(msg) {
  const toast = document.getElementById('toastBar');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 3000);
}

function regenerateAnonId() {
  const newId = generateRandomHexId();
  document.getElementById('modalUserIdPreview').textContent = newId;
}

function saveProfile() {
  const customName = document.getElementById('modalUsername').value.trim().toUpperCase();
  const selectedId = document.getElementById('modalUserIdPreview').textContent;

  if (!customName) {
    showToast('Username cannot be empty');
    return;
  }

  state.user.name = customName;
  state.user.id = selectedId;

  updateUI();
  closeProfileModal();
  showToast('Identity Updated');
}

function submitTransfer() {
  const recipient = document.getElementById('modalRecipient').value.trim();
  const amount = parseFloat(document.getElementById('modalAmount').value);

  if (!recipient || isNaN(amount) || amount <= 0) {
    showToast('Invalid recipient or amount');
    return;
  }

  if (amount > state.checking) {
    showToast('Insufficient checking funds');
    return;
  }

  state.checking -= amount;
  
  const newTx = {
    id: Date.now(),
    desc: `Transfer to ${recipient}`,
    meta: `P2P Express • ${state.user.name} ${state.user.id}`,
    amount: amount,
    type: "debit",
    status: "Pending Batch"
  };

  state.transactions.unshift(newTx);
  state.pendingBatch.push(newTx);

  document.getElementById('modalRecipient').value = '';
  document.getElementById('modalAmount').value = '';
  closeTransferModal();

  updateUI();
  showToast('Payment Queued for Batch');
}

function processBatch() {
  if (state.pendingBatch.length === 0) {
    showToast('Queue is empty');
    return;
  }

  state.transactions.forEach(tx => {
    if (tx.status === "Pending Batch") {
      tx.status = "Settled";
    }
  });

  state.pendingBatch = [];
  updateUI();
  showToast('Batch Settlement Completed');
}