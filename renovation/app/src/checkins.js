// Check-in logic. Tracks how many times a member has checked in this week.
// BUG: Week calculation is wrong — it counts Monday as the first day but uses Sunday-based logic inconsistently.
// BUG: No validation that the member exists or is active.

var checkins = {}; // keyed by memberId, value is array of ISO date strings

function getWeekKey(date) {
  // BUG: This says Monday but the math doesn't actually compute Monday correctly for all dates
  var d = new Date(date);
  var day = d.getDay(); // 0=Sun, 1=Mon, ...
  // Subtract (day - 1) to get to Monday... but for Sunday (0) this goes to day -6, which is wrong
  var diff = d.getDate() - day + (day === 0 ? -6 : 1);
  var monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function checkIn(memberId, dateStr) {
  var date = dateStr || new Date().toISOString();
  var week = getWeekKey(date);

  if (!checkins[memberId]) {
    checkins[memberId] = [];
  }

  // BUG: No check whether the same checkin already exists (duplicate prevention)
  checkins[memberId].push(date);
  return { memberId: memberId, week: week, count: countForWeek(memberId, date) };
}

function countForWeek(memberId, date) {
  if (!checkins[memberId]) return 0;
  var week = getWeekKey(date);
  var cnt = 0;
  for (var i = 0; i < checkins[memberId].length; i++) {
    if (getWeekKey(checkins[memberId][i]) === week) cnt++;
  }
  return cnt;
}

function getHistory(memberId) {
  return checkins[memberId] || [];
}

function clearAll() {
  checkins = {};
}

module.exports = { checkIn, countForWeek, getHistory, clearAll, getWeekKey };
