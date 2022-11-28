function novoElemento(tagName, className) {
  const elemento = document.createElement(tagName)
  elemento.className = className
  return elemento
}

function Obstaculo() {
  this.elemento = novoElemento('div', 'obstaculo')
}

function moverNave() {
  dx = 0
  px = 0
  vel = 10
  obj = document.getElementById('nave')
  document.addEventListener('keydown', teclaDw)
  document.addEventListener('keyup', teclaUp)
  tmp = setInterval(enterFrame, 20)

  function teclaDw(event) {
    var tecla = event.keyCode
    if (tecla == 37) {
      dx = -1
    } else if (tecla == 39) {
      dx = 1
    }
  }

  function teclaUp(event) {
    var tecla = event.keyCode
    if (tecla == 37) {
      dx = 0
    } else if (tecla == 39) {
      dx = 0
    }
  }

  function enterFrame() {
    px += dx * vel
    obj.style.left = px + 'px'
  }
}

window.addEventListener('load', moverNave)
