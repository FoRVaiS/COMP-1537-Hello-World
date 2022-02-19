function calculateArea() {
  const radius = parseInt($('#radius').val(), 10);

  const area = Math.PI * (radius ** 2);

  $('#out').html(area);
}

function setup() {
  $('#submit').click(calculateArea);
}

$(document).ready(setup);
