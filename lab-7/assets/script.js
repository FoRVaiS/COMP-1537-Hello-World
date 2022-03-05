// @ts-check

function getValueFromId(id) {
  return parseInt($(`#${id}`).val(), 10);
}

function appendToHistory(opString, className) {
  const elHideBtn = document.createElement('button');
  elHideBtn.className = 'history__hide';
  elHideBtn.textContent = 'Hide';
  elHideBtn.type = 'submit';

  const elOpString = document.createElement('p');
  elOpString.className = `history ${className}`;
  elOpString.textContent = opString;
  elOpString.appendChild(elHideBtn);

  $('#history').append(elOpString);

  elHideBtn.onclick = function () {
    $(this).parent().remove();
  };
}

function printResult(opString) {
  $('#result').text(`Result of ${opString}`);
}

function executeOperation(operationClass, operationSymbol, operationFn) {
  const lhs = getValueFromId('lhs');
  const rhs = getValueFromId('rhs');
  
  const opString = `${lhs} ${operationSymbol} ${rhs} = ${operationFn(lhs, rhs)}`;

  printResult(opString);
  appendToHistory(opString, operationClass);
}

function setup() {
  $('#add').click(executeOperation.bind(null, 'history__add', '+', (lhs, rhs) => lhs + rhs));
  $('#subtract').click(executeOperation.bind(null, 'history__subtract', '-', (lhs, rhs) => lhs - rhs));
  $('#multiply').click(executeOperation.bind(null, 'history__multiply', '*', (lhs, rhs) => lhs * rhs));
  $('#divide').click(executeOperation.bind(null, 'history__divide', '/', (lhs, rhs) => lhs / rhs));
}

$(document).ready(setup);
