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
          const mRec = gov.metrics.reconstruccion;
          const mOfi = gov.metrics.oficial;
          const cb = gov.costBenefitCard;

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
              </div>

              {/* Veredicto Visual Rápido (Semáforo de Gestión de 4 Pilares) */}
              {(() => {
                const sc = getGovernmentQuickScorecard(gov, effectiveKey);
                return (
                  <div className="quick-scorecard">
                    <div className="scorecard-headline-box">
                      <h4 className="scorecard-headline">{sc.mainHeadline}</h4>
                      <p className="scorecard-takeaway">{sc.takeaway}</p>
                    </div>

                    <div className="scorecard-pillars-grid">
                      {sc.pillars.map((pil) => (
                        <div key={pil.id} className="scorecard-pillar-card">
                          <div className="scorecard-pillar-header">
                            <span className="scorecard-pillar-label">{pil.label}</span>
                            <span
                              className={`status-badge ${
                                pil.tone === 'positive'
                                  ? 'pos'
                                  : pil.tone === 'negative'
                                  ? 'neg'
                                  : 'neutral'
                              }`}
                            >
                              <span>{pil.icon}</span>
                              <span>{pil.statusText}</span>
                            </span>
                          </div>
                          <div>
                            <div className="scorecard-pillar-metric">{pil.metric}</div>
                            <div className="visual-meter-track">
                              <div
                                className={`visual-meter-fill ${
                                  pil.tone === 'positive'
                                    ? 'pos'
                                    : pil.tone === 'negative'
                                    ? 'neg'
                                    : 'neutral'
                                }`}
                                style={{
                                  width:
                                    pil.tone === 'positive'
                                      ? '85%'
                                      : pil.tone === 'negative'
                                      ? '35%'
                                      : '55%'
                                }}
                              />
                            </div>
                          </div>
                          <p className="scorecard-pillar-explanation">{pil.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* KPI Grid adapts to the selected perspective */}
              {perspective === 'igual_tiempo' ? (
                <div className="gov-kpi-grid">
                  <div className="gov-kpi-cell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="gov-kpi-label">Inflación al Mes 34</span>
                      <span className={`status-badge ${m.inflacionM34 < m.inflacionInicio ? 'pos' : 'neg'}`}>
                        {m.inflacionM34 < m.inflacionInicio ? '🟢 Bajó' : '🔴 Subió'}
                      </span>
                    </div>
                    <span className="gov-kpi-value">
                      {formatNum(m.inflacionM34)} i.a.
                    </span>
                    <span className="gov-kpi-sub">
                      Recibió en: {formatNum(m.inflacionInicio)}
                    </span>
                  </div>
                  <div className="gov-kpi-cell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="gov-kpi-label">Pobreza al Mes 34</span>
                      <span className={`status-badge ${m.pobrezaM34 <= m.pobrezaInicio ? 'pos' : 'neg'}`}>
                        {m.pobrezaM34 <= m.pobrezaInicio ? '🟢 Bajó' : '🔴 Subió'}
                      </span>
                    </div>
                    <span className="gov-kpi-value">
                      {formatNum(m.pobrezaM34)}
                    </span>
                    <span className="gov-kpi-sub">
                      Recibió en: {formatNum(m.pobrezaInicio)}
                    </span>
                  </div>
                  <div className="gov-kpi-cell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="gov-kpi-label">Salario Real (34m)</span>
                      <span className={`status-badge ${m.salarioRealM34 >= 0 ? 'pos' : 'neg'}`}>
                        {m.salarioRealM34 >= 0 ? '🟢 Creció' : '🔴 Cayó'}
                      </span>
                    </div>
                    <span
                      className={`gov-kpi-value ${
                        m.salarioRealM34 >= 0 ? 'val-pos' : 'val-neg'
                      }`}
                    >
                      {formatSigned(m.salarioRealM34)}
                    </span>
                    <span className="gov-kpi-sub">Acumulado primeros 34 meses</span>
                  </div>
                  <div className="gov-kpi-cell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="gov-kpi-label">Actividad EMAE (34m)</span>
                      <span className={`status-badge ${m.pbiVariacionM34 >= 0 ? 'pos' : 'neg'}`}>
                        {m.pbiVariacionM34 >= 0 ? '🟢 Creció' : '🔴 Cayó'}
                      </span>
                    </div>
                    <span
                      className={`gov-kpi-value ${
                        m.pbiVariacionM34 >= 0 ? 'val-pos' : 'val-neg'
                      }`}
                    >
                      {formatSigned(m.pbiVariacionM34)}
                    </span>
                    <span className="gov-kpi-sub">Desempleo M34: {formatNum(m.desempleoM34)}</span>
                  </div>
                </div>
              ) : (
                <div className="gov-kpi-grid">
                  <div className="gov-kpi-cell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="gov-kpi-label">Inflación (Inicio → Fin)</span>
                      <span className={`status-badge ${m.inflacionFin < m.inflacionInicio ? 'pos' : 'neg'}`}>
                        {m.inflacionFin < m.inflacionInicio
                          ? `🟢 Bajó ${formatSigned(m.inflacionFin - m.inflacionInicio, ' pp')}`
                          : `🔴 Subió ${formatSigned(m.inflacionFin - m.inflacionInicio, ' pp')}`}
                      </span>
                    </div>
                    <span
                      className={`gov-kpi-value ${
                        m.inflacionFin < m.inflacionInicio ? 'val-pos' : 'val-neg'
                      }`}
                    >
                      {formatNum(m.inflacionInicio)} → {formatNum(m.inflacionFin)}
                    </span>
                    <span className="gov-kpi-sub">
                      {methodMode === 'comparacion' && gov.id === 'cfk'
                        ? `Rec: 29,8% | Ofi: 15,6% prom.`
                        : `Promedio: ${formatNum(m.inflacionAnualPromedio)}/año`}
                    </span>
                  </div>

                  <div className="gov-kpi-cell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="gov-kpi-label">Pobreza EPH</span>
                      <span className={`status-badge ${m.pobrezaDiff <= 0 ? 'pos' : 'neg'}`}>
                        {m.pobrezaDiff <= 0
                          ? `🟢 Bajó ${formatSigned(m.pobrezaDiff, ' pp')}`
                          : `🔴 Subió ${formatSigned(m.pobrezaDiff, ' pp')}`}
                      </span>
                    </div>
                    <span
                      className={`gov-kpi-value ${
                        m.pobrezaDiff <= 0 ? 'val-pos' : 'val-neg'
                      }`}
                    >
                      {formatNum(m.pobrezaInicio)} → {formatNum(m.pobrezaFin)}
                    </span>
                    <span className="gov-kpi-sub">
                      {methodMode === 'comparacion' && gov.id === 'cfk'
                        ? `Rec: 30,1% | Ofi 2013: 4,7%`
                        : `Dif: ${formatSigned(m.pobrezaDiff, ' pp')} · Indig: ${formatNum(m.indigenciaFin)}`}
                    </span>
                  </div>

                  <div className="gov-kpi-cell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="gov-kpi-label">Salario en Canastas</span>
                      <span className={`status-badge ${m.salarioRealVar >= 0 ? 'pos' : 'neg'}`}>
                        {m.salarioRealVar >= 0
                          ? `🟢 Subió ${formatSigned(m.salarioRealVar)}`
                          : `🔴 Cayó ${formatSigned(m.salarioRealVar)}`}
                      </span>
                    </div>
                    <span
                      className={`gov-kpi-value ${
                        m.salarioRealVar >= 0 ? 'val-pos' : 'val-neg'
                      }`}
                    >
                      {formatSigned(m.salarioRealVar)} ({m.salariosEnCBT.toFixed(2).replace('.', ',')} CBT)
                    </span>
                    <span className="gov-kpi-sub">
                      Reg: {formatSigned(m.salarioPrivadoRegVar)} · Inf: {formatSigned(m.salarioInformalVar)}
                    </span>
                  </div>

                  <div className="gov-kpi-cell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="gov-kpi-label">Desempleo EPH</span>
                      <span className={`status-badge ${m.desempleoFin <= m.desempleoInicio ? 'pos' : 'neg'}`}>
                        {m.desempleoFin <= m.desempleoInicio ? '🟢 Bajó' : '🔴 Subió'}
                      </span>
                    </div>
                    <span
                      className={`gov-kpi-value ${
                        m.desempleoFin <= m.desempleoInicio ? 'val-pos' : 'val-neg'
                      }`}
                    >
                      {formatNum(m.desempleoInicio)} → {formatNum(m.desempleoFin)}
                    </span>
                    <span className="gov-kpi-sub">
                      Formal: {formatNum(m.empleoFormalTasaFin)} · Inf: {formatNum(m.empleoInformalTasaFin)}
                    </span>
                  </div>

                  <div className="gov-kpi-cell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="gov-kpi-label">Fiscal y Reservas</span>
                      <span className={`status-badge ${m.resultadoFiscalFinancieroFinPBI >= 0 ? 'pos' : 'neg'}`}>
                        {m.resultadoFiscalFinancieroFinPBI >= 0 ? '🟢 Superávit' : '🔴 Déficit'}
                      </span>
                    </div>
                    <span
                      className={`gov-kpi-value ${
                        m.resultadoFiscalFinancieroFinPBI >= 0 ? 'val-pos' : 'val-neg'
                      }`}
                    >
                      {formatSigned(m.resultadoFiscalFinancieroFinPBI, '% PBI')} fin.
                    </span>
                    <span className="gov-kpi-sub">
                      Res. Netas: {m.reservasNetasFinUSD >= 0 ? '+' : ''}USD {m.reservasNetasFinUSD.toLocaleString('es-AR')} M
                    </span>
                  </div>

                  <div className="gov-kpi-cell">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="gov-kpi-label">Seguridad (SNIC)</span>
                      <span className={`status-badge ${m.homicidiosFin <= m.homicidiosInicio ? 'pos' : 'neg'}`}>
                        {m.homicidiosFin <= m.homicidiosInicio ? '🟢 Bajó' : '🔴 Subió'}
                      </span>
                    </div>
                    <span
                      className={`gov-kpi-value ${
                        m.homicidiosFin <= m.homicidiosInicio ? 'val-pos' : 'val-neg'
                      }`}
                    >
                      {m.homicidiosInicio.toFixed(1).replace('.', ',')} → {m.homicidiosFin.toFixed(1).replace('.', ',')}
                    </span>
                    <span className="gov-kpi-sub">Cada 100.000 habitantes</span>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="gov-card-body">
                {perspective === 'costo_beneficio' ? (
                  <>
                    <div
                      style={{
                        background: 'var(--bg-elevated)',
                        padding: '0.7rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      {cb.headlineQuestion}
                    </div>

                    <div>
                      <h4 className="balance-group-title improved">
                        ▲ Resultados Positivos Registrados
                      </h4>
                      <ul className="balance-list improved">
                        {cb.positiveMetrics.map((pm, i) => (
                          <li key={i}>
                            <strong>{pm.label}: {pm.value}</strong> — {pm.detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="balance-group-title worsened">
                        ▼ Costos Simultáneos Observados en el Mismo Período
                      </h4>
                      <ul className="balance-list worsened">
                        {cb.simultaneousCosts.map((sc, i) => (
                          <li key={i}>
                            <strong>{sc.label}: {sc.value}</strong> — {sc.detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      style={{
                        fontSize: '0.79rem',
                        color: 'var(--text-secondary)',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '0.65rem',
                        lineHeight: 1.48
                      }}
                    >
                      <strong>Lectura integrada (sin atribuir causalidad única):</strong> {cb.neutralReading}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        background: 'var(--bg-elevated)',
                        padding: '0.65rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <strong style={{ color: 'var(--text-primary)' }}>
                        Contexto e inercia heredada (12m previos):
                      </strong>{' '}
                      {gov.inheritedTrend}
                    </div>

                    {methodMode === 'comparacion' && gov.id === 'cfk' && (
                      <div
                        style={{
                          background: 'var(--warning-bg)',
                          border: '1px solid var(--warning)',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.76rem'
                        }}
                      >
                        <strong>Comparación de fuentes 2011–2015:</strong> IPC Oficial informó 15,6% anual prom. vs. 29,8% en Reconstrucción Provincial/Congreso. Pobreza oficial informó 4,7% (1S 2013) vs. 30,1% en serie comparable CEDLAS.
                      </div>
                    )}

                    <div>
                      <h4 className="balance-group-title improved">
                        ▲ Indicadores que mejoraron en el período
                      </h4>
                      <ul className="balance-list improved">
                        {gov.queMejoro.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="balance-group-title worsened">
                        ▼ Indicadores que empeoraron en el período
                      </h4>
                      <ul className="balance-list worsened">
                        {gov.queEmpeoro.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {readingLevel === 'avanzada' && (
                      <div>
                        <h4 className="balance-group-title problems">
                          ◆ Desequilibrios acumulados al cierre / presente
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
              <th>Indicador Verificado (Fuente y Periodicidad)</th>
              {GOVERNMENTS.map((g) => (
                <th key={g.id} style={{ borderTop: `3px solid ${g.color}` }}>
                  {g.order}° {g.president} ({g.yearsLabel})
                </th>
              ))}
              <th>Lectura Metodológica Comparada</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>1. Inflación Anual (Recibió → Dejó/Actual)</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  /v1/ipc_nacional y /v1/valorizacion_canastas_cba_cbt (Mensual)
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
                <strong>Magnitud de baja:</strong> Milei (−172,7 pp desde 211,4%).{' '}
                <strong>Menor nivel nominal inicial/prom:</strong> CFK ({formatNum(GOVERNMENTS[0].metrics[effectiveKey].inflacionAnualPromedio)}).
              </td>
            </tr>

            <tr>
              <td>
                <strong>2. Pobreza e Indigencia en Personas (EPH)</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  /v1/pobreza_eph · Total 31 Aglomerados (Semestral: 20162S a 20261S)
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
                <strong>3. Salario Real y Poder de Compra en CBT</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  /v1/indice_salarios ÷ /v1/valorizacion_canastas_cba_cbt
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
                <strong>Nivel absoluto en canastas:</strong> CFK (1,82 CBT).{' '}
                <strong>Recuperación privado reg.:</strong> Milei (+3,4% vs 2023, con caída estatal −18,5%).
              </td>
            </tr>

            <tr>
              <td>
                <strong>4. Desocupación y Empleo Formal vs. Informal</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  /v1/mercado_trabajo_eph (Trimestral hasta 2T 2026)
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
                  /v1/estimador-mensual-de-actividad-economica-sectores e /v1/ipi_minero
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
                  Ministerio de Economía / BCRA / ICA INDEC
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
