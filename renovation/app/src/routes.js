var express = require('express');
var router = express.Router();
var members = require('./members');
var checkins = require('./checkins');
var billing = require('./billing');

// GET /members — no pagination, no filtering
router.get('/members', function(req, res) {
  res.json(members.getAll());
});

// GET /members/:id — no 404 handling if member doesn't exist
router.get('/members/:id', function(req, res) {
  var member = members.getById(req.params.id);
  res.json(member); // returns null if not found — no error response
});

// POST /members — no validation
router.post('/members', function(req, res) {
  var m = members.add(req.body);
  res.status(201).json(m);
});

// POST /members/:id/checkin — check in a member
// BUG: doesn't validate that member exists or is active
// BUG: doesn't check plan limits
router.post('/members/:id/checkin', function(req, res) {
  var result = checkins.checkIn(req.params.id, req.body.date);
  res.json(result);
});

// GET /members/:id/checkins — get checkin history
router.get('/members/:id/checkins', function(req, res) {
  res.json(checkins.getHistory(req.params.id));
});

// GET /members/:id/billing — billing summary
// Mixed business logic in route handler — should be in service layer
router.get('/members/:id/billing', function(req, res) {
  var member = members.getById(req.params.id);
  if (!member) {
    // Inconsistent error format — one place uses {error}, another uses {msg}
    return res.status(404).json({ error: 'Member not found' });
  }

  var plan = members.getPlan(member.plan);
  if (!plan) {
    return res.status(400).json({ error: 'Unknown plan: ' + member.plan });
  }

  var monthly = billing.getMonthlyFee(member.plan, { basic: plan.price ? { price: plan.price } : null, premium: plan.price ? { price: plan.price } : null });
  // BUG: passing a broken plans object to getMonthlyFee — should pass the real plans map
  // This accidentally works because getMonthlyFee checks for the plan name directly, but it's fragile

  var fee = billing.getMonthlyFee(member.plan, { basic: { price: 299 }, premium: { price: 499 } });
  // DUPLICATE: hardcoded plan prices here too

  var annual = billing.getAnnualCost(member.plan, { basic: { price: 299 }, premium: { price: 499 } });

  // Pro-rated fee for join date
  var proRated = billing.getProRatedFee(member.plan, { basic: { price: 299 }, premium: { price: 499 } }, member.joinDate);

  res.json({
    member: member.name,
    plan: plan.name,
    monthlyFee: fee,
    annualCost: annual,
    proRatedFirstMonth: proRated,
    active: member.active,
  });
});

module.exports = router;
