Cenario.todosMapas = [mapa01, mapa02, mapa03, mapa04, mapa05]
Cenario.agua = 0
Cenario.terra = 1
Cenario.casa = 2
Cenario.combustivel = 3
Cenario.moeda = 4

const casa = new Image()
casa.src = '/img/house.png'
const combustivel = new Image()
combustivel.src = '/img/combustivel.png'
const moeda = new Image()
moeda.src = '/img/score.png'

function Cenario(riverRaid) {
  'use strict'
  this.listaMapas = []
  this.listaMapas.push(mapa01)
  this.mapaAtual = 0
  this.posicao = 0
  this.riverRaid = riverRaid
  this.colunasPorTela = mapa01[0].length
  Cenario.largura = Math.floor(riverRaid.canvas.width / this.colunasPorTela)
  riverRaid.canvas.height =
    Math.floor(riverRaid.canvas.height / Cenario.largura) * Cenario.largura
  riverRaid.canvas.width =
    Math.floor(riverRaid.canvas.width / Cenario.largura) * Cenario.largura
  this.linhasPorTela = Math.floor(riverRaid.canvas.height / Cenario.largura)
  this.totalLinhasMatriz = mapa01.length

  this.desenhar = function (ctx) {
    for (var ym = 0; ym < this.linhasPorTela; ym++) {
      for (var xm = 0; xm < this.colunasPorTela; xm++) {
        switch (this.getPosicaoMapa(xm, ym)) {
          case Cenario.terra:
            ctx.fillStyle = '#33AA33'
            ctx.fillRect(
              this.matrizParaPixelX(xm),
              this.matrizParaPixelY(ym, true),
              Cenario.largura,
              Cenario.largura
            )
            break
          case Cenario.casa:
            ctx.fillStyle = '#33AA33'
            ctx.fillRect(
              this.matrizParaPixelX(xm),
              this.matrizParaPixelY(ym, true),
              Cenario.largura,
              Cenario.largura
            )
            ctx.drawImage(
              casa,
              this.matrizParaPixelX(xm),
              this.matrizParaPixelY(ym, true),
              Cenario.largura,
              Cenario.largura
            )
            break
          case Cenario.moeda:
            ctx.drawImage(
              moeda,
              this.matrizParaPixelX(xm),
              this.matrizParaPixelY(ym, true),
              Cenario.largura,
              Cenario.largura
            )
            break
          case Cenario.combustivel:
            ctx.drawImage(
              combustivel,
              this.matrizParaPixelX(xm),
              this.matrizParaPixelY(ym, true),
              Cenario.largura,
              Cenario.largura
            )
            break
        }
      }
    }
  }

  this.matrizParaPixelX = function (mx) {
    // Distância horizontal do retângulo
    return Math.floor(mx * Cenario.largura)
  }
  this.matrizParaPixelY = function (my, calcDif) {
    // Distância vertical do retângulo
    var dif = 0
    if (calcDif) {
      dif = this.posicao - Math.floor(this.posicao)
    }
    return (
      (this.linhasPorTela - 1 - my) * Cenario.largura + dif * Cenario.largura
    )
  }

  this.pixelParaMatrizX = function (px) {
    return Math.floor(px / Cenario.largura)
  }
  this.pixelParaMatrizY = function (py) {
    return this.linhasPorTela - 1 - Math.floor(py / Cenario.largura)
  }

  this.getPosicaoMapa = function (x, y) {
    var mapa = Math.floor((this.posicao + y) / this.totalLinhasMatriz)
    var sobra = Math.floor(this.posicao + y) % this.totalLinhasMatriz
    if (mapa >= this.listaMapas.length) {
      this.incluirNovoMapa()
    }
    return this.listaMapas[mapa][sobra][x]
  }

  this.incluirNovoMapa = function () {
    var n = Math.floor(Math.random() * Cenario.todosMapas.length)
    var proximoMapa = Cenario.todosMapas[n]

    this.sortearPosicao = function () {
      let linha = Math.floor(Math.random() * 13)
      let coluna = Math.floor(Math.random() * 10)
      return [linha, coluna]
    }
    this.construirAtributo = function () {
      let array = this.sortearPosicao()
      let px = array[0]
      let py = array[1]
      if (proximoMapa[px][py] == 1) {
        proximoMapa[px][py] = 1
      } else if (proximoMapa[px][py] == 2) {
        proximoMapa[px][py] = 2
      } else {
        let prob = Math.floor(Math.random() * 2)
        if (prob == 0) {
          proximoMapa[px][py] = 3
        } else {
          proximoMapa[px][py] = 4
        }
      }
    }

    for (let i = 0; i < 5; i++) {
      this.construirAtributo()
    }
    this.listaMapas.push(proximoMapa)
  }

  this.andar = function (espaco) {
    this.posicao += espaco
  }

  // Verificar se houve colisão com o Cenario.terra
  this.detectarColisaoTerraXY = function (x, y) {
    if (
      this.getPosicaoMapa(this.pixelParaMatrizX(x), this.pixelParaMatrizY(y)) ==
      Cenario.terra
    ) {
      return true
    }
    return false
  }

  this.detectarColisaoTerra = function (x, y, lar, alt) {
    return (
      this.detectarColisaoTerraXY(x, y) ||
      this.detectarColisaoTerraXY(x + lar, y) ||
      this.detectarColisaoTerraXY(x, y + alt) ||
      this.detectarColisaoTerraXY(x + lar, y + alt) ||
      this.detectarColisaoTerraXY(
        Math.round(x + lar / 2),
        Math.round(y + alt / 2)
      )
    )
  }

  // Detectar colisão atributos (combustivel ou moeda)
  this.detectarColisaoAtributos = function (x, y) {
    if (
      this.getPosicaoMapa(this.pixelParaMatrizX(x), this.pixelParaMatrizY(y)) ==
        Cenario.moeda ||
      this.getPosicaoMapa(this.pixelParaMatrizX(x), this.pixelParaMatrizY(y)) ==
        Cenario.combustivel
    ) {
      return true
    }
    return false
  }

  // Colisão atributos
  this.colisaoAtributos = function () {
    for (var ym = 0; ym < this.linhasPorTela; ym++) {
      for (var xm = 0; xm < this.colunasPorTela; xm++) {
        switch (this.getPosicaoMapa(xm, ym)) {
          case Cenario.moeda:
            return [
              this.matrizParaPixelX(xm),
              this.matrizParaPixelY(ym, true),
              'Moeda'
            ]
          case Cenario.combustivel:
            return [
              this.matrizParaPixelX(xm),
              this.matrizParaPixelY(ym, true),
              'Combustivel'
            ]
        }
      }
    }
  }
}
