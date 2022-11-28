function Jogador(nomeArq, inicioX, posicaoY, riverRaid) {
  'use strict'
  this.imagem = new Image()
  this.imagem.src = nomeArq
  this.imagem.onload = RiverRaid.desenharTudo
  this.x = inicioX
  this.y = posicaoY
  this.esquerda = false
  this.direita = false
  this.velocidade = 0.15
  this.riverRaid = riverRaid

  this.desenhar = function (ctx) {
    ctx.drawImage(this.imagem, this.x, this.y, Jogador.largura, Jogador.largura)
  }

  this.setMoverEsquerda = function (booleano) {
    this.esquerda = booleano
    if (this.esquerda) {
      this.direita = false
    }
  }

  this.setMoverDireita = function (booleano) {
    this.direita = booleano
    if (this.direita) {
      this.esquerda = false
    }
  }

  this.mover = function () {
    if (this.esquerda) {
      this.x -= 4
    } else if (this.direita) {
      this.x += 4
    } else {
      this.velocidade = 0.15
    }
    this.riverRaid.cenario.andar(this.velocidade)
  }
}
Jogador.largura = 35
