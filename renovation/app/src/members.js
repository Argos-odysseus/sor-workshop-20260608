// In-memory member store. No types, no validation, no structure.
// Members are just objects in an array. Subscriptions are strings.
var members = [
  { id: 'm1', name: 'Alice', email: 'alice@example.com', plan: 'premium', joinDate: '2025-01-15', active: true },
  { id: 'm2', name: 'Bob', email: 'bob@example.com', plan: 'basic', joinDate: '2025-03-10', active: true },
  { id: 'm3', name: 'Charlie', email: 'charlie@example.com', plan: 'premium', joinDate: '2024-11-01', active: false },
  { id: 'm4', name: 'Diana', email: 'diana@example.com', plan: 'basic', joinDate: '2025-06-01', active: true },
];

// Plans stored as a separate map — easy to get out of sync with actual member plans
var plans = {
  basic: { price: 299, maxCheckins: 4, name: 'Basic' },
  premium: { price: 499, maxCheckins: 999, name: 'Premium' },
};

function getAll() {
  return members;
}

function getById(id) {
  for (var i = 0; i < members.length; i++) {
    if (members[i].id === id) return members[i];
  }
  return null;
}

// Adds a member but doesn't validate email format or duplicate IDs
function add(data) {
  var newMember = {
    id: data.id || 'm' + (members.length + 1),
    name: data.name,
    email: data.email,
    plan: data.plan || 'basic',
    joinDate: data.joinDate || new Date().toISOString().slice(0, 10),
    active: true,
  };
  members.push(newMember);
  return newMember;
}

function getPlan(planName) {
  return plans[planName] || null;
}

module.exports = { getAll, getById, add, getPlan };
