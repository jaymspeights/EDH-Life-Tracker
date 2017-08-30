var lobbies = [];
var games = [];

function getLobby(id){
  for (var i = 0; i < lobbies.length; i += 1) {
    if (lobbies[i].id == id) {
      return lobbies[i];
    }
  }
  return null;
}

function assignColor(lobby){
  var colors = ["maroon", "orange", "olive", "green", "blue", "yellow", "teal", "lime", "aqua", "gray", "purple"];
  for (var i = 0; i < lobby.players.length; i += 1) {
    var index = Math.floor(Math.random()*colors.length);
    lobby.players[i].color = colors.splice(index, 1);
  }
}

function assignHP(lobby){
  for (var i = 0; i < lobby.players.length; i += 1) {
    lobby.players[i].hp = 40;
    lobby.players[i].damage = [];
    for (var j = 0; j < lobby.players.length; j += 1) {
      if (lobby.players[i].pid != lobby.players[j].pid) {
        var temp = {"damage":0, "color":lobby.players[j].color, "pid":lobby.players[j].pid};
        lobby.players[i].damage.push(temp);
      }
    }
  }
}

function getPlayer(lobby, pid){
  for (var i = 0; i < lobby.players.length; i++) {
    if (lobby.players[i].pid == pid)
    return lobby.players[i];
  }
}

function getDamage(player, pid) {
  for (var i = 0; i < player.damage.length; i += 1) {
    if (player.damage[i].pid == pid) {
      return player.damage[i];
    }
  }
}

function generateID(id){
  if (id == null)
    var id = Math.floor(Math.random()*89999) + 10001;
  lobbies.forEach(function (lobby) {
    if (lobby.id == id)
      return generateID(id + 1);
  });
  return id;
}

function generatePID(lobby, pid){
  if (pid == null)
    var pid = Math.floor(Math.random()*89999) + 10001;
  lobby.players.forEach(function (player) {
    if (player.pid == pid)
      return generatePID(pid + 1, lobby);
  });
  return pid;
}

module.exports = {
  createLobby: function (name, callback){
    var id = generateID();
    var lobby = {"size":1, "id": id, "players":[]};
    var player = {"name":name, "host":true};
    player.pid = generatePID(lobby);
    lobby.players.push(player);
    lobbies.push(lobby);
    callback(lobby.id, player.pid);
  },
  joinLobby: function(name, id, callback){
    var lobby = getLobby(id);
    if (lobby == null) {
      console.log("Error joining lobby: lobby does not exist");
      callback();
      return;
    }
    var player = {"name":name};
    player.pid = generatePID(lobby);
    lobby.players.push(player);
    callback(lobby.id, player.pid);
  },
  status: function(id, callback) {
    callback(getLobby(id));
  },
  startGame: function (id, callback) {
    var lobby = getLobby(id);
    assignColor(lobby);
    var data = assignHP(lobby)
    for (var game in games) {
      if (game == lobby) {
        console.log("Error starting game: game already started");
        callback(false);
        return;
      }
    }
    games.push(data);
    lobby.started = true;
    callback(true);
  },
  update: function(id, pid, callback) {
    var lobby = getLobby(id);
    var data = {'players':[], 'you':{}};
    for (var i = 0; i < lobby.players.length; i += 1) {
      if (lobby.players[i].pid == pid) {
        data.you = lobby.players[i];
        data.lobbyColor = lobby.players[i].color;
      }
      else {
        var temp = {};
        temp.damage = getDamage(lobby.players[i], pid).damage;
        temp.hp = lobby.players[i].hp;
        temp.pid = lobby.players[i].pid;
        temp.name = lobby.players[i].name;
        temp.color = lobby.players[i].color;
        data.players.push(temp);
      }
    }
    callback(data);
  },
  change: function(id, pid, data, callback){
    var lobby = getLobby(id);
    var player = getPlayer(lobby, pid);
    player.hp += parseInt(data.hp);
    for (var i = 0; i < data.players.length; i++) {
      player = getDamage(getPlayer(lobby, data.players[i].pid), pid);
      player.damage += parseInt(data.players[i].damage);
    }
    callback();
  }
};
