const gameOverImage = new Image()
gameOverImage.src = '/img/game_over.png'

var pontuacao = 0
var energia = 100
var cont = 0

function RiverRaid(canvasID) {
  'use strict'
  this.canvas = document.getElementById(canvasID)
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
    document.getElementById('pontuacao').innerText = pontuacao
    document.getElementById('energia').innerText = energia

    this.gameOver = this.cenario.detectarColisaoTerra(
      this.jogador.x,
      this.jogador.y,
      Jogador.largura,
      Jogador.largura
    )

    if (this.gameOver || energia == 0) {
      this.pausar()
      console.log('Game Over!')
      setTimeout(() => {
        this.ctx.drawImage(
          gameOverImage,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        )
      }, 10)
      document.getElementById('qtdEnergia').innerText =
        'Energia coletada: ' + Math.floor(cont / 10)
    }

    this.aumentarPontos = this.cenario.detectarColisaoAtributos(
      this.jogador.x,
      this.jogador.y
    )
    if (this.aumentarPontos) {
      this.array = this.cenario.colisaoAtributos()
      this.px = this.array[0]
      this.py = this.array[1]
      this.tipo = this.array[2]
      if (this.tipo == 'Combustivel') {
        cont += 1
        this.ctx.fillStyle = '#f9ff55'
        this.ctx.fillRect(this.px, this.py, Cenario.largura, Cenario.largura)
        if (energia != 100) {
          energia += 1
        }
      } else if (this.tipo == 'Moeda') {
        this.ctx.fillStyle = '#31f845'
        this.ctx.fillRect(this.px, this.py, Cenario.largura, Cenario.largura)
        pontuacao += 1
      }
    }
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

// Chamda da função principal
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

// Intervalo de incrementação da pontação e energia
setInterval(() => {
  pontuacao++
}, 5000)

setInterval(() => {
  energia--
}, 300)

// Chamada das funções
RiverRaid.novoJogo = function (canvasID) {
  'use strict'
  if (!RiverRaid.instancia.emPausa) {
    RiverRaid.instancia.pausar()
  }
  pontuacao = 0
  document.getElementById('pontuacao').innerText = pontuacao
  window.location.reload(true)
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
