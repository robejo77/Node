var userScore = 0,
  userMark;
var compScore = 0,
  compMark;
var state, filled;
var fx, fy;






function play(index) {
  var x = Math.floor(index / 3);
  var y = index % 3;

  if (state[x][y] !== -1) {
    return;
  }

  state[x][y] = 1;
  $(".cell-" + index).html(userMark);

  if (check(0) === 1) {
    compScore++;
    endGame(0);
    return;
  }
  if (check(1) === 1) {
    userScore++;
    endGame(1);
    return;
  }
  if (filled === 8) {
    endGame(2);
    return;
  }

  minmax(filled + 1, 0, filled + 1);
  state[fx][fy] = 0;
  var compIndex = (fx * 3 + fy);
  $(".cell-" + compIndex).html(compMark);
  if (check(0) === 1) {
    compScore++;
    endGame(0);
    return;
  }
  if (check(1) === 1) {
    userScore++;
    endGame(1);
    return;
  }
}

$(document).ready(function() {
  for (var i = 0; i <= 8; i++) {
    addTo(i);
  }

  $(".gameName").hide();
  $(".board").hide();
  $(".result").hide();
  $(".furtherPlay").hide();

  $(".continue").on("click", playMore);
  $(".reset").on("click", reset);

  $(".cross").on("click", function() {
    startGame(1);
  });

  $(".circle").on("click", function() {
    startGame(0);
  });
});

function playMore() {
  $(".result").hide();
  $(".furtherPlay").hide();
  $(".question").show();
}

function reset() {
  $(".result").hide();
  $(".furtherPlay").hide();
  $('#progressbar').progressbar('reset');
  userScore = 0;
  compScore = 0;
    
  $(".question").show();
}

function endGame(winId) {
  var result;
  if (winId === 0) {
    result = "You have been infected.";
          $('#progressbar').progressbar('stepIt');
  } else if (winId === 1) {
    result = "You sent a tracer";
  } else {
    result = "You blocked the attack.";
  }
    


  window.setTimeout(function() {
    $(".gameName").hide();
    $(".board").hide();
    $(".scores").hide();
    $(".result").html(result);
    $(".result").show();
    $(".furtherPlay").show();
  }, 1000);
}


  
        
        


function minmax(idx, player, root) {
  if (check(0) === 1) return -1;
  if (check(1) === 1) return 1;
  if (idx === 9) return 0;

  var ans, temp;
  if (player === 0) ans = 2;
  if (player === 1) ans = -2;

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (state[i][j] === -1) {
        if (player === 0) {
          state[i][j] = 0;
          temp = minmax(idx + 1, (player + 1) % 2, root);

          if (temp < ans) {
            ans = temp;
            if (idx === root) fx = i;
            if (idx === root) fy = j;
          }
          state[i][j] = -1;
        } else {
          state[i][j] = 1;
          temp = minmax(idx + 1, (player + 1) % 2, root);

          if (temp > ans) {
            ans = temp;
            if (idx === root) fx = i;
            if (idx === root) fy = j;
          }
          state[i][j] = -1;
        }
      }
    }
  }

  return ans;
}

function check(k) {
  var c;

  for (var i = 0; i < 3; i++) {
    c = 0;
    for (var j = 0; j < 3; j++)
      if (state[i][j] === k) c++;
    if (c === 3) return 1;
  }

  for (var i = 0; i < 3; i++) {
    c = 0;
    for (var j = 0; j < 3; j++)
      if (state[j][i] === k) c++;
    if (c === 3) return 1;
  }

  c = 0;
  for (var i = 0; i < 3; i++) {
    if (state[i][i] === k) c++;
  }
  if (c === 3) return 1;

  c = 0;
  for (var i = 0; i < 3; i++) {
    if (state[i][2 - i] === k) c++;
  }
  if (c === 3) return 1;

  return 0;
}

function startGame(userSymbol) {
  filled = 0;
  state = [];
  var row = [-1, -1, -1];
  state.push(row);
  row = [-1, -1, -1];
  state.push(row);
  row = [-1, -1, -1];
  state.push(row);
  for (var i = 0; i <= 8; i++) {
    $(".cell-" + i).html("&nbsp;");
  }
  $(".question").hide();
  $(".gameName").show();
  $(".board").show();
  $(".userScore").html('<span class="bmd-icon flaticon-apple70"></span> ' + userScore);
  $(".compScore").html('<span class="bmd-icon flaticon-screen44"></span> ' + compScore);
  $(".scores").show();
  userMark = userSymbol === 0 ? '<a href="#" class="btn btn-success bmd-ripple bmd-fab"><span class="bmd-icon flaticon-locked57"></span></a>' : '<a href="#" class="btn btn-danger bmd-ripple bmd-fab"><span class="bmd-icon flaticon-bug18"></span></a>';
  compMark = userSymbol === 1 ? '<a href="#" class="btn btn-success bmd-ripple bmd-fab"><span class="bmd-icon flaticon-locked57"></span></a>' : '<a href="#" class="btn btn-danger bmd-ripple bmd-fab"><span class="bmd-icon flaticon-bug18"></span></a>';
}

function move(id) {
  play(id);
  filled += 2;
  return;
}

function addTo(id) {
  var select = ".cell-" + id;
  $(select).on("click", function() {
    move(id);
    $(select).addClass("animated bounceIn");
    var waitId = window.setTimeout(function() {
      $(select).removeClass("animated bounceIn");
    }, 1000);
  });
}