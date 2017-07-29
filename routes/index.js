var express = require('express');
var router = express.Router();
var engine = require('../engine.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {"title": "Murder Mystery"});
});

router.get('/create/:name', function(req, res, next) {
  var name = req.params.name;
  engine.createLobby(name, function(id, pid) {
    var data = {};
    data.id = id;
    data.pid = pid;
    res.send(data);
  });
});

router.get('/join/:name/:id', function(req, res, next) {
  var name = req.params.name;
  var gid = parseInt(req.params.id);
  engine.joinLobby(name, gid, function(id, pid) {
    if (id == null) {
      res.status(400);
      return;
    }
    var data = {};
    data.id = id;
    data.pid = pid;
    res.send(data);
  });
});

router.get('/status/:id', function(req, res, next) {
  var id = parseInt(req.params.id);
  engine.status(id, function(lobby) {
    if (lobby.started == true) {
      res.send(lobby);
    }
    res.render('lobby', lobby);
  });
});

router.get('/start/:id', function(req, res, next) {
  var id = parseInt(req.params.id);
  engine.startGame(id, function(status) {
    if (status) res.send(id);
    else res.sendStatus(500);
  });
});

router.get('/update/:id/:pid', function(req, res, next) {
  var id = parseInt(req.params.id);
  var pid = parseInt(req.params.pid);
  engine.update(id, pid, function(lobby) {
    res.render('tracker', lobby);
  });
});

router.post('/change/:id/:pid', function(req, res, next) {
  var id = parseInt(req.params.id);
  var pid = parseInt(req.params.pid);
  engine.change(id, pid, req.body, function() {
    res.sendStatus(200);
  });
});

module.exports = router;
