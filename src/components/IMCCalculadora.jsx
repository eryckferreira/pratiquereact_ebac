import { useState } from 'react'
import styles from './IMCCalculadora.module.css'

const CLASSIFICACOES = [
  { label: 'Abaixo do peso',     min: 0,        max: 18.5,    cor: '#378ADD' },
  { label: 'Peso normal',        min: 18.5,     max: 25,      cor: '#1D9E75' },
  { label: 'Sobrepeso',          min: 25,       max: 30,      cor: '#EF9F27' },
  { label: 'Obesidade grau I',   min: 30,       max: 35,      cor: '#D85A30' },
  { label: 'Obesidade grau II',  min: 35,       max: 40,      cor: '#E24B4A' },
  { label: 'Obesidade grau III', min: 40,       max: Infinity, cor: '#A32D2D' },
]

function getClassificacao(imc) {
  return CLASSIFICACOES.find((c) => imc >= c.min && imc < c.max)
}

// ─── Régua visual (SVG puro, sem JSX dinâmico no HTML) ────────────────────────
function Gauge({ imc }) {
  const IMC_MIN = 10
  const IMC_MAX = 60
  const LARGURA = 320
  const ALTURA_BARRA = 16
  const Y_BARRA = 10
  const RAIO = 8
  const total = IMC_MAX - IMC_MIN

  const segmentos = [
    { lo: 10,   hi: 18.5, cor: '#378ADD' },
    { lo: 18.5, hi: 25,   cor: '#1D9E75' },
    { lo: 25,   hi: 30,   cor: '#EF9F27' },
    { lo: 30,   hi: 35,   cor: '#D85A30' },
    { lo: 35,   hi: 40,   cor: '#E24B4A' },
    { lo: 40,   hi: 60,   cor: '#A32D2D' },
  ]

  // Calcula posição X de cada segmento
  let cursorX = 0
  const retangulos = segmentos.map((seg, idx) => {
    const largSeg = ((seg.hi - seg.lo) / total) * LARGURA
    const x = cursorX
    cursorX += largSeg

    const primeiroSeg = idx === 0
    const ultimoSeg = idx === segmentos.length - 1

    // Arredondamento manual nas extremidades
    if (primeiroSeg) {
      return (
        <rect
          key={seg.cor}
          x={x}
          y={Y_BARRA}
          width={largSeg}
          height={ALTURA_BARRA}
          fill={seg.cor}
          rx={RAIO}
          ry={RAIO}
        />
      )
    }
    if (ultimoSeg) {
      return (
        <g key={seg.cor}>
          <rect x={x} y={Y_BARRA} width={largSeg} height={ALTURA_BARRA} fill={seg.cor} />
          <rect
            x={x + largSeg / 2}
            y={Y_BARRA}
            width={largSeg / 2}
            height={ALTURA_BARRA}
            fill={seg.cor}
            rx={RAIO}
            ry={RAIO}
          />
        </g>
      )
    }
    return (
      <rect
        key={seg.cor}
        x={x}
        y={Y_BARRA}
        width={largSeg}
        height={ALTURA_BARRA}
        fill={seg.cor}
      />
    )
  })

  // Posição da seta indicadora
  const imcClamp = Math.max(IMC_MIN, Math.min(IMC_MAX - 0.01, imc))
  const seta_x = ((imcClamp - IMC_MIN) / total) * LARGURA
  const seta_y = Y_BARRA + ALTURA_BARRA + 6
  const cls = getClassificacao(imc)
  const corSeta = cls ? cls.cor : '#888'

  return (
    <svg
      viewBox={`0 0 ${LARGURA} 75`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', display: 'block', margin: '1rem auto' }}
      aria-label={`Régua de IMC indicando ${imc.toFixed(1)}`}
    >
      {retangulos}

      {/* Seta indicadora */}
      <polygon
        points={`${seta_x},${seta_y} ${seta_x - 7},${seta_y + 14} ${seta_x + 7},${seta_y + 14}`}
        fill={corSeta}
      />
      <circle cx={seta_x} cy={seta_y} r={5} fill={corSeta} />

      {/* Rótulos da escala */}
      <text x={0} y={seta_y + 28} fontSize={11} fill="#888">
        {IMC_MIN}
      </text>
      <text x={LARGURA / 2} y={seta_y + 28} textAnchor="middle" fontSize={11} fill="#888">
        35
      </text>
      <text x={LARGURA} y={seta_y + 28} textAnchor="end" fontSize={11} fill="#888">
        {IMC_MAX}+
      </text>
    </svg>
  )
}

// ─── Tabela de classificação ──────────────────────────────────────────────────
function TabelaClassificacao({ imcAtual }) {
  return (
    <table className={styles.tabela}>
      <thead>
        <tr>
          <th></th>
          <th>Classificação</th>
          <th>IMC (kg/m²)</th>
        </tr>
      </thead>
      <tbody>
        {CLASSIFICACOES.map((c) => {
          const ativa = imcAtual !== null && imcAtual >= c.min && imcAtual < c.max
          const faixa = c.max === Infinity ? `≥ ${c.min}` : `${c.min} – ${c.max}`

          return (
            <tr key={c.label} className={ativa ? styles.linhaAtiva : ''}>
              <td>
                <span
                  className={styles.bolinha}
                  style={{ backgroundColor: c.cor }}
                />
              </td>
              <td>{c.label}</td>
              <td>{faixa}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function IMCCalculadora() {
  const [altura, setAltura] = useState('')
  const [peso, setPeso] = useState('')
  const [imc, setImc] = useState(null)
  const [erro, setErro] = useState('')

  function calcular() {
    setErro('')
    const h = parseFloat(altura)
    const p = parseFloat(peso)

    if (!h || !p) {
      setErro('Preencha os dois campos.')
      return
    }
    if (h < 0.5 || h > 2.5) {
      setErro('Altura deve estar entre 0,5 m e 2,5 m.')
      return
    }
    if (p <= 0 || p > 500) {
      setErro('Peso inválido.')
      return
    }

    const resultado = p / (h * h)
    setImc(resultado)
  }

  function resetar() {
    setImc(null)
    setAltura('')
    setPeso('')
    setErro('')
  }

  const cls = imc !== null ? getClassificacao(imc) : null

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Calculadora de IMC</h1>
        <p>Índice de Massa Corporal</p>
      </header>

      {/* ── Formulário ── */}
      {imc === null && (
        <div className={styles.card}>
          <div className={styles.campo}>
            <label htmlFor="altura">Altura (m)</label>
            <input
              id="altura"
              type="number"
              placeholder="ex: 1.70"
              step="0.01"
              min="0.5"
              max="2.5"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') document.getElementById('peso').focus()
              }}
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="peso">Peso (kg)</label>
            <input
              id="peso"
              type="number"
              placeholder="ex: 70"
              step="0.1"
              min="1"
              max="500"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') calcular()
              }}
            />
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <button className={styles.botaoPrimario} onClick={calcular}>
            Calcular IMC
          </button>
        </div>
      )}

      {/* ── Resultado ── */}
      {imc !== null && cls && (
        <div className={styles.card}>
          <div className={styles.resultado}>
            <span className={styles.imcValor} style={{ color: cls.cor }}>
              {imc.toFixed(1)}
            </span>
            <span className={styles.imcSubtitulo}>kg/m²</span>
            <span className={styles.imcClasse} style={{ color: cls.cor }}>
              {cls.label}
            </span>
          </div>

          <Gauge imc={imc} />

          <div className={styles.tabelaSecao}>
            <p className={styles.tabelaTitulo}>Tabela de classificação (OMS)</p>
            <TabelaClassificacao imcAtual={imc} />
          </div>

          <button className={styles.botaoSecundario} onClick={resetar}>
            ↺ Calcular novamente
          </button>
        </div>
      )}
    </div>
  )
}
