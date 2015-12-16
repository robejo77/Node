/**
 * Particleground 
 * @author Jonathan Nicol - @mrjnicol
 */

document.addEventListener('DOMContentLoaded', function () {
  particleground(document.getElementById('particles'), {
    dotColor: '#FFF',
    lineColor: '#FFF'
  });
  
}, false);


/*
// jQuery plugin example:
$(document).ready(function() {
  $('#particles').particleground({
    dotColor: '#5cbdaa',
    lineColor: '#5cbdaa'
  });
  $('.stage').css({
    'margin-top': -($('.stage').height() / 2)
  });
});
*/