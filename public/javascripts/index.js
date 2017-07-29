var NAME;
var ID;
var PID;
var loop;
var DATA;
var changed = false;
var changes = {'players':[], 'hp':0};

window.onload = function() {
  document.getElementById('create_button').addEventListener('click', function() {
    NAME = document.getElementById('name_field').value;
    if (NAME == ''){
      alert('Please enter a name');
      return;
    }
    $.get('/create/' + NAME, function(data) {
      ID = data.id;
      PID = data.pid;
      status(function() {
        loop = setInterval(status, 1000);
      });
    });
  });

  document.getElementById('join_button').addEventListener('click', function() {
    NAME = document.getElementById('name_field').value;
    if (NAME == ''){
      alert('Please enter a name');
      return;
    }
    document.getElementById('menu').hidden = true;
    document.getElementById('join-menu').hidden = false;
  });

  document.getElementById('id_submit').addEventListener('click', function() {
    sID = document.getElementById('id_field').value;
    if (sID == ''){
      alert('Please enter an ID');
      return;
    }
    ID = parseInt(sID);
    $.get('/join/' + NAME + '/' + ID, function(data) {
      ID = data.id;
      PID = data.pid;
      status(function() {
        loop = setInterval(status, 1000);
      });
    });
  });
};

function status(callback) {
  $.get('/status/' + ID, function(data) {
    if (data.started == true) {
      setUpdateLoop();
      return;
    }
    if (DATA == data)
      return;
    DATA = data;
    $('#body').html(data);
  });
  if (callback != null) callback();
}

function update(callback) {
  if (changed) {
    $.ajax({
      type: "POST",
      url: '/change/' + ID + '/' + PID,
      data: JSON.stringify(changes),
      success: function(data, status) {
          resetChanges();
      },
      contentType: 'application/json'
    });
  }
  $.get('/update/' + ID + '/' + PID, function(data, status) {
    if (DATA == data)
      return;
    DATA = data;
    $('#body').html(data);
    if (callback != null) callback();
    $('.player-left').on('tap', function() {
      changes.hp -= 1;
      changed = true;
      $(this).parent().find('#hp').text(function (i, text) {
        return parseInt(text)-1;
      });
    });
    $('.player-right').on('tap', function() {
      changes.hp += 1;
      changed = true;
      $(this).parent().find('#hp').text(function (i, text) {
        return parseInt(text)+1;
      });
    });
    $('.op-left').on('tap', function() {
      var player = getPlayer($(this).attr('data-pid'));
      player.damage -= 1;
      changes.players.push(player);
      changed = true;
      $(this).parent().find('#damage').text(function (i, text) {
        return parseInt(text)-1;
      });
    });
    $('.op-right').on('tap', function() {
      var player = getPlayer($(this).attr('data-pid'));
      player.damage += 1;
      changes.players.push(player);
      changed = true;
      $(this).parent().find('#damage').text(function (i, text) {
        return parseInt(text)+1;
      });
    });
    $('.player-left').on('click', function() {
      changes.hp -= 1;
      changed = true;
      $(this).parent().find('#hp').text(function (i, text) {
        return parseInt(text)-1;
      });
    });
    $('.player-right').on('click', function() {
      changes.hp += 1;
      changed = true;
      $(this).parent().find('#hp').text(function (i, text) {
        return parseInt(text)+1;
      });
    });
    $('.op-left').on('click', function() {
      var player = getPlayer($(this).attr('data-pid'));
      player.damage -= 1;
      changes.players.push(player);
      changed = true;
      console.log("clicked");
      $(this).parent().find('#damage').text(function (i, text) {
        return parseInt(text)-1;
      });
    });
    $('.op-right').on('click', function() {
      var player = getPlayer($(this).attr('data-pid'));
      player.damage += 1;
      changes.players.push(player);
      changed = true;
      $(this).parent().find('#damage').text(function (i, text) {
        return parseInt(text)+1;
      });
    });
  });
}

function start() {
  $.get('/start/' + ID, function(data) {
    setUpdateLoop();
  });
};

function setUpdateLoop(){
  $.get('/stylesheets/tracker.css', function(data) {
    $('#local_style').text(data);
  });
  clearInterval(loop);
  update(function() {
    loop = setInterval(update, 1000);
  });
}

function getPlayer(pid) {
  pid = parseInt(pid);
  for (var player in changes.players)
    if (player.pid == pid) {
      changes.players.splice(player, 1);
      return player;
    }
  return {'pid':pid, 'damage':0};
}

function resetChanges(){
  changed = false;
  changes.players = [];
  changes.hp = 0;
}
