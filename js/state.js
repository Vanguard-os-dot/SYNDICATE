function generateRandomHexId() {
  const hex = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return `#${hex}-OS`;
}

// Application State
let state = {
  user: {
    name: "DEVFORGE",
    id: generateRandomHexId()
  },
  checking: 28450.00,
  vault: 45000.00,
  pendingBatch: [],
  transactions: [
    { id: 101, desc: "Mobile App Milestone 2", meta: "Direct Deposit • Client Payout • 10 Sep", amount: 18500.00, type: "credit", status: "Settled" },
    { id: 102, desc: "Mantech Electronics", meta: "Components & Enclosures • 08 Sep", amount: 645.50, type: "debit", status: "Settled" },
    { id: 103, desc: "Web Hosting & VPS Cluster", meta: "Cloud Infrastructure • 05 Sep", amount: 1250.00, type: "debit", status: "Settled" },
    { id: 104, desc: "Automation Workflow Setup", meta: "Inbound Wire • Client Payment • 01 Sep", amount: 8200.00, type: "credit", status: "Settled" },
    { id: 105, desc: "Domain Registrations", meta: "DNS & SSL Certificates • 28 Aug", amount: 420.00, type: "debit", status: "Settled" },
    { id: 106, desc: "Custom API Integration", meta: "E-Commerce Client • 22 Aug", amount: 6500.00, type: "credit", status: "Settled" }
  ]
};