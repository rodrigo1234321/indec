import React, { useState } from 'react';
import { GOVERNMENTS, getGovernmentQuickScorecard } from '../data/indecData';

export default function ChronologicalComparison({ methodMode, readingLevel }) {
  const [selectedGovFilter, setSelectedGovFilter] = useState('all');
  const [perspective, setPerspective] = useState('recibido_entregado'); // 'recibido_entregado' | 'igual_tiempo' | 'costo_beneficio'

  const effectiveKey = methodMode === 'oficial' ? 'oficial' : 'reconstruccion';

  const filteredGovernments =
    selectedGovFilter === 'all'
      ? GOVERNMENTS
      : GOVERNMENTS.filter((g) => g.id === selectedGovFilter);

  const formatSigned = (num, suffix = '%') => {
    if (num === null || num === undefined) return '—';
    const sign = num > 0 ? '+' : '';
    return `${sign}${num.toFixed(1).replace('.', ',')}${suffix}`;
  };

  const formatNum = (num, suffix = '%') => {
    if (num === null || num === undefined) return '—';
    return `${num.toFixed(1).replace('.', ',')}${suffix}`;
  };

  return (
    <section className="section-block" id="comparacion-cronologica">
      <div className="section-header">
        <div>
          <p className="section-kicker">01 · Comparar Gobiernos en Orden Cronológico (2011 – 2026)</p>
          <h2 className="section-title">
            Cómo Recibió el País Cada Gobierno, Cómo lo Dejó y a Qué Costo
          </h2>
          <p className="section-subtitle">
            Evaluación en el orden histórico: <strong>1° Cristina Kirchner (2011–2015)</strong>,{' '}
            <strong>2° Mauricio Macri (2015–2019)</strong>, <strong>3° Alberto Fernández (2019–2023)</strong> y{' '}
            <strong>4° Javier Milei (2023–Actualidad)</strong>. Alterná entre las <strong>3 perspectivas metodológicas</strong> para evitar sesgos de punto de partida o duración del mandato.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`indicator-pill-btn ${selectedGovFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedGovFilter('all')}
          >
            Los 4 gobiernos
          </button>
          {GOVERNMENTS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`indicator-pill-btn ${selectedGovFilter === g.id ? 'active' : ''}`}
              onClick={() => setSelectedGovFilter(g.id)}
            >
              {g.order}° {g.president.split(' ').slice(-1)[0]} ({g.yearsLabel})
            </button>
          ))}
        </div>
      </div>

      {/* 3 Perspectives Switcher */}
      <div
        style={{
          display: 'flex',
          gap: '0.55rem',
          marginBottom: '1.4rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          background: 'var(--bg-elevated)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-strong)'
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
          Perspectiva de Evaluación:
        </span>
        {[
          {
            id: 'recibido_entregado',
            label: '1. Resultado Recibido vs. Entregado (+ Inercia Heredada)'
          },
          {
            id: 'igual_tiempo',
            label: '2. Comparación a Igual Tiempo de Gestión (Primeros 34 Meses)'
          },
          {
            id: 'costo_beneficio',
            label: '3. ¿A Qué Costo? (Resultados Positivos vs. Costos Simultáneos)'
          }
        ].map((p) => (
          <button
            key={p.id}
            type="button"
            id={`perspective-btn-${p.id}`}
            className={`preset-btn ${perspective === p.id ? 'active' : ''}`}
            onClick={() => setPerspective(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 4 Chronological Cards */}
      <div
        className="gov-cards-grid"
        style={{
          gridTemplateColumns:
            selectedGovFilter === 'all' ? undefined : 'minmax(320px, 820px)'
        }}
      >
        {filteredGovernments.map((gov) => {
          const m = gov.metrics[effectiveKey];
          const cb = gov.costBenefitCard;
          const sc = getGovernmentQuickScorecard(gov, effectiveKey);

          const inflImproved = m.inflacionFin < m.inflacionInicio;
          const pobImproved = m.pobrezaDiff <= 0;
          const salImproved = m.salarioRealVar >= 0;
          const desImproved = m.desempleoFin <= m.desempleoInicio;
          const fiscImproved = m.resultadoFiscalFinancieroFinPBI >= 0;
          const segImproved = m.homicidiosFin <= m.homicidiosInicio;

          return (
            <article key={gov.id} className="gov-card" id={`gov-card-${gov.id}`}>
              <div className="gov-card-top-bar" style={{ backgroundColor: gov.color }} />

              <div className="gov-card-header">
                <div className="gov-order-row">
                  <span
                    className="gov-order-badge"
                    style={{
                      backgroundColor: gov.colorSoft,
                      color: gov.color,
                      border: `1px solid ${gov.colorBorder}`
                    }}
                  >
                    {gov.order}° Mandato
                  </span>
                  <span className="gov-period-label">{gov.period}</span>
                </div>

                <h3 className="gov-president-name">{gov.president}</h3>
                <p className="gov-party-name">{gov.party}</p>
                <span className="gov-ideology-chip">{gov.ideologyTag}</span>

                <div className="gov-executive-summary" style={{ borderLeftColor: gov.color }}>
                  <h4 className="gov-executive-headline">{sc.mainHeadline}</h4>
                  <p className="gov-executive-takeaway">{sc.takeaway}</p>
                </div>
              </div>

              {/* Tablero Unificado de Indicadores Clave (Sin duplicaciones y con barras visuales) */}
              {perspective === 'igual_tiempo' ? (
                <div className="gov-kpi-grid">
                  <div className="gov-kpi-cell">
                    <div className="gov-kpi-top">
                      <span className="gov-kpi-label">Inflación al Mes 34</span>
                      <span className={`status-badge ${m.inflacionM34 < m.inflacionInicio ? 'pos' : 'neg'}`}>
                        {m.inflacionM34 < m.inflacionInicio ? '🟢 Bajó' : '🔴 Subió'}
                      </span>
                    </div>
                    <span className={`gov-kpi-value ${m.inflacionM34 < m.inflacionInicio ? 'val-pos' : 'val-neg'}`}>
                      {formatNum(m.inflacionInicio)} → {formatNum(m.inflacionM34)}
                    </span>
                    <div className="visual-meter-track">
                      <div
                        className={`visual-meter-fill ${m.inflacionM34 < m.inflacionInicio ? 'pos' : 'neg'}`}
                        style={{ width: m.inflacionM34 < m.inflacionInicio ? '82%' : '38%' }}
                      />
                    </div>
                    <span className="gov-kpi-sub">
                      Ritmo anual al mes 34 de gestión
                    </span>
                  </div>

                  <div className="gov-kpi-cell">
                    <div className="gov-kpi-top">
                      <span className="gov-kpi-label">Pobreza al Mes 34</span>
                      <span className={`status-badge ${m.pobrezaM34 <= m.pobrezaInicio ? 'pos' : 'neg'}`}>
                        {m.pobrezaM34 <= m.pobrezaInicio ? '🟢 Bajó' : '🔴 Subió'}
                      </span>
                    </div>
                    <span className={`gov-kpi-value ${m.pobrezaM34 <= m.pobrezaInicio ? 'val-pos' : 'val-neg'}`}>
                      {formatNum(m.pobrezaInicio)} → {formatNum(m.pobrezaM34)}
                    </span>
                    <div className="visual-meter-track">
                      <div
                        className={`visual-meter-fill ${m.pobrezaM34 <= m.pobrezaInicio ? 'pos' : 'neg'}`}
                        style={{ width: m.pobrezaM34 <= m.pobrezaInicio ? '80%' : '38%' }}
                      />
                    </div>
                    <span className="gov-kpi-sub">
                      Porcentaje de población urbana (EPH)
                    </span>
                  </div>

                  <div className="gov-kpi-cell">
                    <div className="gov-kpi-top">
                      <span className="gov-kpi-label">Salario Real (Mes 34)</span>
                      <span className={`status-badge ${m.salarioRealM34 >= 0 ? 'pos' : 'neg'}`}>
                        {m.salarioRealM34 >= 0 ? '🟢 Ganó' : '🔴 Perdió'}
                      </span>
                    </div>
                    <span className={`gov-kpi-value ${m.salarioRealM34 >= 0 ? 'val-pos' : 'val-neg'}`}>
                      {formatSigned(m.salarioRealM34)}
                    </span>
                    <div className="visual-meter-track">
                      <div
                        className={`visual-meter-fill ${m.salarioRealM34 >= 0 ? 'pos' : 'neg'}`}
                        style={{ width: m.salarioRealM34 >= 0 ? '78%' : '36%' }}
                      />
                    </div>
                    <span className="gov-kpi-sub">Poder de compra en primeros 34 meses</span>
                  </div>

                  <div className="gov-kpi-cell">
                    <div className="gov-kpi-top">
                      <span className="gov-kpi-label">Actividad EMAE (Mes 34)</span>
                      <span className={`status-badge ${m.pbiVariacionM34 >= 0 ? 'pos' : 'neg'}`}>
                        {m.pbiVariacionM34 >= 0 ? '🟢 Creció' : '🔴 Cayó'}
                      </span>
                    </div>
                    <span className={`gov-kpi-value ${m.pbiVariacionM34 >= 0 ? 'val-pos' : 'val-neg'}`}>
                      {formatSigned(m.pbiVariacionM34)}
                    </span>
                    <div className="visual-meter-track">
                      <div
                        className={`visual-meter-fill ${m.pbiVariacionM34 >= 0 ? 'pos' : 'neg'}`}
                        style={{ width: m.pbiVariacionM34 >= 0 ? '78%' : '35%' }}
                      />
                    </div>
                    <span className="gov-kpi-sub">Desempleo al mes 34: {formatNum(m.desempleoM34)}</span>
                  </div>
                </div>
              ) : (
                <div className="gov-kpi-grid">
                  {/* 1. Inflación */}
                  <div className="gov-kpi-cell">
                    <div className="gov-kpi-top">
                      <span className="gov-kpi-label">Inflación Anual</span>
                      <span className={`status-badge ${inflImproved ? 'pos' : 'neg'}`}>
                        {inflImproved
                          ? `🟢 Bajó ${formatSigned(m.inflacionFin - m.inflacionInicio, ' pp')}`
                          : `🔴 Subió ${formatSigned(m.inflacionFin - m.inflacionInicio, ' pp')}`}
                      </span>
                    </div>
                    <span className={`gov-kpi-value ${inflImproved ? 'val-pos' : 'val-neg'}`}>
                      {formatNum(m.inflacionInicio)} → {formatNum(m.inflacionFin)}
                    </span>
                    <div className="visual-meter-track">
                      <div
                        className={`visual-meter-fill ${inflImproved ? 'pos' : 'neg'}`}
                        style={{ width: inflImproved ? '85%' : '35%' }}
                      />
                    </div>
                    <span className="gov-kpi-sub">
                      {methodMode === 'comparacion' && gov.id === 'cfk'
                        ? `Reconstrucción: 29,8% | Oficial: 15,6% anual`
                        : `Promedio del mandato: ${formatNum(m.inflacionAnualPromedio)} anual`}
                    </span>
                  </div>

                  {/* 2. Pobreza */}
                  <div className="gov-kpi-cell">
                    <div className="gov-kpi-top">
                      <span className="gov-kpi-label">Pobreza (INDEC)</span>
                      <span className={`status-badge ${pobImproved ? 'pos' : 'neg'}`}>
                        {pobImproved
                          ? `🟢 Bajó ${formatSigned(m.pobrezaDiff, ' pp')}`
                          : `🔴 Subió ${formatSigned(m.pobrezaDiff, ' pp')}`}
                      </span>
                    </div>
                    <span className={`gov-kpi-value ${pobImproved ? 'val-pos' : 'val-neg'}`}>
                      {formatNum(m.pobrezaInicio)} → {formatNum(m.pobrezaFin)}
                    </span>
                    <div className="visual-meter-track">
                      <div
                        className={`visual-meter-fill ${pobImproved ? 'pos' : 'neg'}`}
                        style={{ width: pobImproved ? '84%' : '36%' }}
                      />
                    </div>
                    <span className="gov-kpi-sub">
                      {methodMode === 'comparacion' && gov.id === 'cfk'
                        ? `Homogénea: 30,1% | Oficial 2013: 4,7%`
                        : `Indigencia al cierre: ${formatNum(m.indigenciaFin)}`}
                    </span>
                  </div>

                  {/* 3. Poder de Compra */}
                  <div className="gov-kpi-cell">
                    <div className="gov-kpi-top">
                      <span className="gov-kpi-label">Poder de Compra</span>
                      <span className={`status-badge ${salImproved ? 'pos' : gov.id === 'cfk' ? 'pos' : 'neg'}`}>
                        {gov.id === 'cfk'
                          ? '🟢 Récord: 1,82 CBT'
                          : salImproved
                          ? `🟢 Subió ${formatSigned(m.salarioRealVar)}`
                          : `🔴 Cayó ${formatSigned(m.salarioRealVar)}`}
                      </span>
                    </div>
                    <span className={`gov-kpi-value ${salImproved || gov.id === 'cfk' ? 'val-pos' : 'val-neg'}`}>
                      {m.salariosEnCBT.toFixed(2).replace('.', ',')} Canastas ({formatSigned(m.salarioRealVar)})
                    </span>
                    <div className="visual-meter-track">
                      <div
                        className={`visual-meter-fill ${salImproved || gov.id === 'cfk' ? 'pos' : 'neg'}`}
                        style={{ width: salImproved || gov.id === 'cfk' ? '85%' : '38%' }}
                      />
                    </div>
                    <span className="gov-kpi-sub">
                      Formal: {formatSigned(m.salarioPrivadoRegVar)} · Informal: {formatSigned(m.salarioInformalVar)}
                    </span>
                  </div>

                  {/* 4. Desempleo y Trabajo */}
                  <div className="gov-kpi-cell">
                    <div className="gov-kpi-top">
                      <span className="gov-kpi-label">Desempleo Urbano</span>
                      <span className={`status-badge ${desImproved ? 'pos' : 'neg'}`}>
                        {desImproved
                          ? `🟢 Bajó a ${formatNum(m.desempleoFin)}`
                          : `🔴 Subió a ${formatNum(m.desempleoFin)}`}
                      </span>
                    </div>
                    <span className={`gov-kpi-value ${desImproved ? 'val-pos' : 'val-neg'}`}>
                      {formatNum(m.desempleoInicio)} → {formatNum(m.desempleoFin)}
                    </span>
                    <div className="visual-meter-track">
                      <div
                        className={`visual-meter-fill ${desImproved ? 'pos' : 'neg'}`}
                        style={{ width: desImproved ? '82%' : '38%' }}
                      />
                    </div>
                    <span className="gov-kpi-sub">
                      Empleo formal: {formatNum(m.empleoFormalTasaFin)} · Informal: {formatNum(m.empleoInformalTasaFin)}
                    </span>
                  </div>

                  {/* 5. Cuentas Públicas y Reservas */}
                  <div className="gov-kpi-cell">
                    <div className="gov-kpi-top">
                      <span className="gov-kpi-label">Cuentas y Reservas</span>
                      <span className={`status-badge ${fiscImproved ? 'pos' : 'neg'}`}>
                        {fiscImproved ? '🟢 Superávit Fiscal' : '🔴 Déficit Fiscal'}
                      </span>
                    </div>
                    <span className={`gov-kpi-value ${fiscImproved ? 'val-pos' : 'val-neg'}`}>
                      {formatSigned(m.resultadoFiscalFinancieroFinPBI, '% PBI')}
                    </span>
                    <div className="visual-meter-track">
                      <div
                        className={`visual-meter-fill ${fiscImproved ? 'pos' : 'neg'}`}
                        style={{ width: fiscImproved ? '88%' : '32%' }}
                      />
                    </div>
                    <span className="gov-kpi-sub">
                      Reservas Netas BCRA: {m.reservasNetasFinUSD >= 0 ? '+' : ''}USD {m.reservasNetasFinUSD.toLocaleString('es-AR')} M
                    </span>
                  </div>

                  {/* 6. Seguridad Ciudadana */}
                  <div className="gov-kpi-cell">
                    <div className="gov-kpi-top">
                      <span className="gov-kpi-label">Tasa de Homicidios</span>
                      <span className={`status-badge ${segImproved ? 'pos' : 'neg'}`}>
                        {segImproved ? '🟢 Bajó en el período' : '🔴 Subió en el período'}
                      </span>
                    </div>
                    <span className={`gov-kpi-value ${segImproved ? 'val-pos' : 'val-neg'}`}>
                      {m.homicidiosInicio.toFixed(1).replace('.', ',')} → {m.homicidiosFin.toFixed(1).replace('.', ',')}
                    </span>
                    <div className="visual-meter-track">
                      <div
                        className={`visual-meter-fill ${segImproved ? 'pos' : 'neg'}`}
                        style={{ width: segImproved ? '82%' : '35%' }}
                      />
                    </div>
                    <span className="gov-kpi-sub">Homicidios cada 100.000 habitantes (SNIC)</span>
                  </div>
                </div>
              )}

              {/* Card Body: Herencia + Balance Lado a Lado (Verde vs. Rojo) */}
              <div className="gov-card-body">
                {perspective === 'costo_beneficio' ? (
                  <>
                    <div
                      style={{
                        background: 'var(--bg-elevated)',
                        padding: '0.75rem 0.95rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      {cb.headlineQuestion}
                    </div>

                    <div className="gov-pros-cons-grid">
                      <div className="gov-balance-box improved">
                        <h4 className="balance-group-title improved">
                          🟢 Resultados Positivos Logrados
                        </h4>
                        <ul className="balance-list improved">
                          {cb.positiveMetrics.map((pm, i) => (
                            <li key={i}>
                              <strong>{pm.label}: {pm.value}</strong> — {pm.detail}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="gov-balance-box worsened">
                        <h4 className="balance-group-title worsened">
                          🔴 Costos Simultáneos en el Período
                        </h4>
                        <ul className="balance-list worsened">
                          {cb.simultaneousCosts.map((scItem, i) => (
                            <li key={i}>
                              <strong>{scItem.label}: {scItem.value}</strong> — {scItem.detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '0.75rem',
                        lineHeight: 1.5
                      }}
                    >
                      <strong>Síntesis de resultados y costos:</strong> {cb.neutralReading}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        background: 'var(--bg-elevated)',
                        padding: '0.75rem 0.95rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.48
                      }}
                    >
                      <strong style={{ color: 'var(--text-primary)' }}>
                        Punto de partida (Qué recibió al asumir):
                      </strong>{' '}
                      {gov.inheritedTrend}
                    </div>

                    {methodMode === 'comparacion' && gov.id === 'cfk' && (
                      <div
                        style={{
                          background: 'var(--warning-bg)',
                          border: '1px solid var(--warning)',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem'
                        }}
                      >
                        <strong>Comparación de fuentes 2011–2015:</strong> IPC Oficial informó 15,6% anual prom. vs. 29,8% en Reconstrucción Provincial/Congreso. Pobreza oficial informó 4,7% (1S 2013) vs. 30,1% en serie comparable CEDLAS.
                      </div>
                    )}

                    <div className="gov-pros-cons-grid">
                      <div className="gov-balance-box improved">
                        <h4 className="balance-group-title improved">
                          🟢 Lo que mejoró en su gestión
                        </h4>
                        <ul className="balance-list improved">
                          {gov.queMejoro.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="gov-balance-box worsened">
                        <h4 className="balance-group-title worsened">
                          🔴 Lo que empeoró en su gestión
                        </h4>
                        <ul className="balance-list worsened">
                          {gov.queEmpeoro.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {readingLevel === 'avanzada' && (
                      <div className="gov-balance-box problems">
                        <h4 className="balance-group-title problems">
                          ⚠️ Problemas y desequilibrios acumulados al final del período
                        </h4>
                        <ul className="balance-list problems">
                          {gov.problemasGenerados.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Complete Auditable Matrix */}
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Indicador Oficial Verificado (Fuente y Frecuencia)</th>
              {GOVERNMENTS.map((g) => (
                <th key={g.id} style={{ borderTop: `3px solid ${g.color}` }}>
                  {g.order}° {g.president} ({g.yearsLabel})
                </th>
              ))}
              <th>Conclusión Comparada</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>1. Inflación Anual (Recibió → Dejó/Actual)</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  INDEC · Índice de Precios al Consumidor y Canastas (Mensual)
                </div>
              </td>
              {GOVERNMENTS.map((g) => {
                const m = g.metrics[effectiveKey];
                return (
                  <td key={g.id} className="mono-cell">
                    {formatNum(m.inflacionInicio)} → <strong>{formatNum(m.inflacionFin)}</strong>
                    <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)' }}>
                      Al Mes 34: {formatNum(m.inflacionM34)} | Prom: {formatNum(m.inflacionAnualPromedio)}
                    </div>
                  </td>
                );
              })}
              <td style={{ fontSize: '0.78rem' }}>
                <strong>Mayor desaceleración:</strong> Milei (−172,7 pp desde 211,4%).{' '}
                <strong>Menor nivel promedio:</strong> CFK ({formatNum(GOVERNMENTS[0].metrics[effectiveKey].inflacionAnualPromedio)}).
              </td>
            </tr>

            <tr>
              <td>
                <strong>2. Pobreza e Indigencia en Personas (EPH)</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  INDEC · Encuesta Permanente de Hogares · 31 Aglomerados (Semestral)
                </div>
              </td>
              {GOVERNMENTS.map((g) => {
                const m = g.metrics[effectiveKey];
                return (
                  <td key={g.id} className="mono-cell">
                    {formatNum(m.pobrezaInicio)} → <strong>{formatNum(m.pobrezaFin)}</strong>
                    <div
                      style={{
                        fontSize: '0.71rem',
                        color: m.pobrezaDiff <= 0 ? 'var(--positive)' : 'var(--negative)'
                      }}
                    >
                      Dif: {formatSigned(m.pobrezaDiff, ' pp')} | Indig: {formatNum(m.indigenciaFin)}
                    </div>
                  </td>
                );
              })}
              <td style={{ fontSize: '0.78rem' }}>
                <strong>Variación neta:</strong> Milei redujo −9,4 pp vs. 2S 2023 (32,3% en 1S 2026 tras pico de 52,9% en 1S 2024).
              </td>
            </tr>

            <tr>
              <td>
                <strong>3. Salario Real y Poder de Compra en Canastas</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  INDEC · Índice de Salarios vs. Canasta Básica Total (Mensual)
                </div>
              </td>
              {GOVERNMENTS.map((g) => {
                const m = g.metrics[effectiveKey];
                return (
                  <td key={g.id} className="mono-cell">
                    {formatSigned(m.salarioRealVar)}
                    <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)' }}>
                      Nivel: <strong>{m.salariosEnCBT.toFixed(2).replace('.', ',')} CBT</strong> | Jub: {formatSigned(m.jubilacionMinimaRealVar)}
                    </div>
                  </td>
                );
              })}
              <td style={{ fontSize: '0.78rem' }}>
                <strong>Mayor poder de compra en canastas:</strong> CFK (1,82 CBT).{' '}
                <strong>Recuperación privado reg.:</strong> Milei (+3,4% vs 2023, con caída estatal −18,5%).
              </td>
            </tr>

            <tr>
              <td>
                <strong>4. Desocupación y Empleo Formal vs. Informal</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  INDEC · Mercado de Trabajo EPH (Trimestral hasta 2T 2026)
                </div>
              </td>
              {GOVERNMENTS.map((g) => {
                const m = g.metrics[effectiveKey];
                return (
                  <td key={g.id} className="mono-cell">
                    Desoc: {formatNum(m.desempleoInicio)} → <strong>{formatNum(m.desempleoFin)}</strong>
                    <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)' }}>
                      Formal: {formatNum(m.empleoFormalTasaFin)} | Inf: {formatNum(m.empleoInformalTasaFin)}
                    </div>
                  </td>
                );
              })}
              <td style={{ fontSize: '0.78rem' }}>
                <strong>Menor desocupación:</strong> Alberto (5,7% en 4T 2023).{' '}
                <strong>Mayor tasa empleo formal:</strong> CFK (27,8%) y Alberto (26,7% vs 24,7% en 2T 2026).
              </td>
            </tr>

            <tr>
              <td>
                <strong>5. Actividad (EMAE), Industria, Construcción y Energía</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  INDEC · Actividad por Sectores (EMAE) e Índice Minero y Energético
                </div>
              </td>
              {GOVERNMENTS.map((g) => {
                const m = g.metrics[effectiveKey];
                return (
                  <td key={g.id} className="mono-cell">
                    PBI: {formatSigned(m.pbiVariacionTotal)} (Per cáp: {formatSigned(m.pbiPerCapitaVar)})
                    <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)' }}>
                      Ind: {formatSigned(m.industriaIpiVar)} | Const: {formatSigned(m.construccionActividadVar)} | Min/En: {formatSigned(m.mineriaEnergiaVar)}
                    </div>
                  </td>
                );
              })}
              <td style={{ fontSize: '0.78rem' }}>
                <strong>Industria y Construcción:</strong> Alberto (+7,2% / +9,8%).{' '}
                <strong>Energía, Minería y PBI per cápita:</strong> Milei (+21,4% Min/En y +1,4% per cáp.).
              </td>
            </tr>

            <tr>
              <td>
                <strong>6. Resultado Fiscal Financiero, Deuda y Reservas Netas</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Ministerio de Economía / BCRA / Intercambio Comercial INDEC
                </div>
              </td>
              {GOVERNMENTS.map((g) => {
                const m = g.metrics[effectiveKey];
                return (
                  <td key={g.id} className="mono-cell">
                    Fiscal Fin: <strong>{formatSigned(m.resultadoFiscalFinancieroFinPBI, '% PBI')}</strong>
                    <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)' }}>
                      Res Netas: {m.reservasNetasFinUSD >= 0 ? '+' : ''}USD {m.reservasNetasFinUSD.toLocaleString('es-AR')} M | Brecha: {formatNum(m.brechaCambiariaFinPct)}
                    </div>
                  </td>
                );
              })}
              <td style={{ fontSize: '0.78rem' }}>
                <strong>Equilibrio fiscal y brecha:</strong> Milei (+0,4% financiero, brecha 6,5%).{' '}
                <strong>Menor ratio Deuda/PBI:</strong> CFK (52,6% PBI).
              </td>
            </tr>

            <tr>
              <td>
                <strong>7. Seguridad (Homicidios SNIC) y Desigualdad (Gini EPH)</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Ministerio de Seguridad (SNIC) / EPH Distribución del Ingreso
                </div>
              </td>
              {GOVERNMENTS.map((g) => {
                const m = g.metrics[effectiveKey];
                return (
                  <td key={g.id} className="mono-cell">
                    Homicidios: {m.homicidiosInicio.toFixed(1).replace('.', ',')} → <strong>{m.homicidiosFin.toFixed(1).replace('.', ',')}</strong>
                    <div style={{ fontSize: '0.71rem', color: 'var(--text-muted)' }}>
                      Coef. Gini EPH: {m.giniFin.toFixed(3).replace('.', ',')}
                    </div>
                  </td>
                );
              })}
              <td style={{ fontSize: '0.78rem' }}>
                <strong>Menor tasa de homicidios:</strong> Milei (3,8 c/100k hab.) y mayor baja % con Macri (−22,7%).{' '}
                <strong>Menor desigualdad Gini:</strong> CFK (0,412).
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
