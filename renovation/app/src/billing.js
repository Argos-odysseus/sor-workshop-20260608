// Billing logic. Calculates monthly fees, handles overdue detection.
// DUPLICATION: date parsing logic duplicated across multiple functions.
// MAGIC NUMBERS: 30-day month assumption, 5-day grace period hardcoded.

function getMonthlyFee(planName, plans) {
  var plan = plans[planName];
  if (!plan) return 0;
  return plan.price;
}

// Calculate pro-rated fee for partial month (e.g. mid-month join)
function getProRatedFee(planName, plans, joinDate) {
  var plan = plans[planName];
  if (!plan) return 0;

  var joined = new Date(joinDate);
  var now = new Date();
  var daysInMonth = 30; // BUG: hardcoded 30-day month

  var dayOfMonth = joined.getDate();
  var remaining = daysInMonth - dayOfMonth;
  if (remaining < 0) remaining = 0;

  return Math.round((plan.price / daysInMonth) * remaining);
}

function isOverdue(lastPaymentDate) {
  var last = new Date(lastPaymentDate);
  var now = new Date();
  var diffMs = now - last;
  var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays > 35; // BUG: magic number 35 = 30 days + 5 day grace period, but not explained
}

// DUPLICATE LOGIC: same date-diff math as isOverdue but different threshold
function daysSinceLastPayment(lastPaymentDate) {
  var last = new Date(lastPaymentDate);
  var now = new Date();
  var diffMs = now - last;
  var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Calculate annual cost — doesn't account for pro-rating or plan changes
function getAnnualCost(planName, plans) {
  var monthly = getMonthlyFee(planName, plans);
  return monthly * 12; // BUG: no discount for annual plans, just 12x monthly
}

module.exports = { getMonthlyFee, getProRatedFee, isOverdue, daysSinceLastPayment, getAnnualCost };
