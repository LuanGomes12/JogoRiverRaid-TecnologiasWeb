function RiverRaid(canvasID) {
  'use strict'
  this.canvas = document.getElementById(canvasID)
  // Novo
  this.jogador = new Jogador(
    'img/nave2.png',
    this.canvas.width / (200 / 91),
    this.canvas.height - this.canvas.height / 8,
    this
  )
  this.ctx = this.canvas.getContext('2d')
  this.temporizador = null
  this.emPausa = true
  this.gameOver = false
  this.cenario = new Cenario(this)

  this.desenharTudo = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.jogador.desenhar(this.ctx)
    this.cenario.desenhar(this.ctx)
  }
  this.desenharTudo()

  this.atualizarJogo = function () {
    this.jogador.mover()
    this.desenharTudo()
  }
  this.pausar = function () {
    this.emPausa = !this.emPausa
    if (this.emPausa) {
      clearInterval(this.temporizador)
      this.temporizador = null
    } else if (!this.gameOver) {
      this.temporizador = setInterval(RiverRaid.atualizar, RiverRaid.intervalo)
    }
  }

  this.pressionarTecla = function (evt) {
    switch (evt.keyCode) {
      case RiverRaid.teclaEsquerda:
        this.jogador.setMoverEsquerda(true)
        if (this.emPausa) {
          this.pausar()
        }
        evt.preventDefault()
        break
      case RiverRaid.teclaDireita:
        this.jogador.setMoverDireita(true)
        if (this.emPausa) {
          this.pausar()
        }
        evt.preventDefault()
        break
    }
  }

  this.liberarTecla = function (evt) {
    switch (evt.keyCode) {
      case RiverRaid.teclaEsquerda:
        this.jogador.setMoverEsquerda(false)
        evt.preventDefault()
        break
      case RiverRaid.teclaDireita:
        this.jogador.setMoverDireita(false)
        evt.preventDefault()
        break
    }
  }
}

// Desenha o personagem
RiverRaid.desenharTudo = function () {
  RiverRaid.instancia.desenharTudo()
}

RiverRaid.teclaEsquerda = 65 //A
RiverRaid.teclaDireita = 68 //D

// 37 - esquerda
// 39 - direita
// document.onkeydown = function (evt) {
//   document.getElementById('tecla').innerHTML = evt.keyCode
// }

RiverRaid.instancia = new RiverRaid('tela')

// Interação usuário
document.onkeydown = function (evt) {
  'use strict'
  RiverRaid.instancia.pressionarTecla(evt)
}
document.onkeyup = function (evt) {
  'use strict'
  RiverRaid.instancia.liberarTecla(evt)
}

//
RiverRaid.novoJogo = function (canvasID) {
  'use strict'
  if (!RiverRaid.instancia.emPausa) {
    RiverRaid.instancia.pausar()
  }
  RiverRaid.instancia = new RiverRaid(canvasID)
}
RiverRaid.pausar = function () {
  'use strict'
  RiverRaid.instancia.pausar()
}
RiverRaid.atualizar = function () {
  'use strict'
  RiverRaid.instancia.atualizarJogo()
}
RiverRaid.intervalo = 25 //ms
