var express = require('express');
var app = express();
var routes = require('./routes');

app.use(express.json());

// Inline error handler — global, but no types or structure
app.use(function(err, req, res, next) {
  console.log('error:', err.message);
  res.status(500).send({ msg: 'Something broke', err: err.message });
});

app.use('/', routes);

var PORT = 4000;
app.listen(PORT, function() {
  console.log('Gym API running on port ' + PORT);
});

module.exports = app;
