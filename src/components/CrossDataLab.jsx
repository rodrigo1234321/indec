import React, { useState } from 'react';
import {
  CROSS_DATA_ANALYSES,
  GOVERNMENTS,
  REAL_POBREZA_SEMESTRAL
} from '../data/indecData';

export default function CrossDataLab({ methodMode, readingLevel }) {
  const [activeCrossId, setActiveCrossId] = useState(CROSS_DATA_ANALYSES[0].id);
  const effectiveKey = methodMode === 'oficial' ? 'oficial' : 'reconstruccion';

  const activeCross =
    CROSS_DATA_ANALYSES.find((c) => c.id === activeCrossId) || CROSS_DATA_ANALYSES[0];

  const getGovColor = (govId) => {
    const g = GOVERNMENTS.find((item) => item.id === govId);
    return g ? g.color : '#334155';
  };

  const handleDownloadCrossData = (format) => {
    const filename = `cruce_${activeCross.id}_${new Date().toISOString().slice(0, 10)}.${format}`;
    let content = '';

    if (format === 'json') {
      const dataPayload = {
        id: activeCross.id,
        title: activeCross.title,
        formula: activeCross.formula,
        endpointsUsed: activeCross.endpointsUsed,
        conclusion: activeCross.keyConclusion,
        methodologicalCaveat: activeCross.methodologicalCaveat,
        dataByGov: GOVERNMENTS.map((g) => ({
          govId: g.id,
          president: g.president,
          years: g.yearsLabel,
          metrics: g.metrics[effectiveKey]
        }))
      };
      content = JSON.stringify(dataPayload, null, 2);
    } else {
      content = `Gobierno,Periodo,PBI_Var,Inflacion_Fin,Pobreza_Fin,Desempleo_Fin,SalarioReal_Var\n` +
        GOVERNMENTS.map((g) => {
          const m = g.metrics[effectiveKey];
          return `"${g.president}","${g.yearsLabel}",${m.pbiVariacionTotal},${m.inflacionFin},${m.pobrezaFin},${m.desempleoFin},${m.salarioRealVar}`;
        }).join('\n');
    }

    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCrossVisualization = () => {
    switch (activeCross.id) {
      case 'cruce_1_bolsillo': {
        return (
          <div>
            <div style={{ marginBottom: '0.85rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>
                Variación Real por Sector Laboral (INDEC), Jubilación Mínima y Cantidad de Canastas Básicas Totales (CBT)
              </strong>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '0.9rem'
              }}
            >
              {GOVERNMENTS.map((gov) => {
                const m = gov.metrics[effectiveKey];
                const rows = [
                  { label: 'Privado Registrado', val: m.salarioPrivadoRegVar },
                  { label: 'Público Nacional', val: m.salarioPublicoNacVar },
                  { label: 'Informal No Registrado', val: m.salarioInformalVar },
                  { label: 'Jubilación Mínima + Bono', val: m.jubilacionMinimaRealVar }
                ];
                return (
                  <div
                    key={gov.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderTop: `4px solid ${gov.color}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.95rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                      {gov.order}° {gov.president} ({gov.yearsLabel})
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.73rem',
                        color: 'var(--text-muted)',
                        marginBottom: '0.75rem'
                      }}
                    >
                      Sueldo medio = <strong>{m.salariosEnCBT.toFixed(2).replace('.', ',')} CBT</strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {rows.map((r) => {
                        const isPos = r.val >= 0;
                        const w = Math.min(100, Math.abs(r.val) * 2.5);
                        return (
                          <div key={r.label}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.74rem',
                                marginBottom: '0.15rem'
                              }}
                            >
                              <span>{r.label}</span>
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 700,
                                  color: isPos ? 'var(--positive)' : 'var(--negative)'
                                }}
                              >
                                {isPos ? '+' : ''}
                                {r.val.toFixed(1).replace('.', ',')}%
                              </span>
                            </div>
                            <div
                              style={{
                                height: '7px',
                                background: 'var(--bg-muted)',
                                borderRadius: '4px',
                                overflow: 'hidden'
                              }}
                            >
                              <div
                                style={{
                                  width: `${w}%`,
                                  height: '100%',
                                  background: isPos ? 'var(--positive)' : 'var(--negative)'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'cruce_2_trabajadores_pobres': {
        return (
          <div>
            <div style={{ marginBottom: '0.85rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>
                Serie Semestral Oficial de Pobreza EPH (2011 a 1S 2026) y Cruce con Empleo Formal e Informal (INDEC)
              </strong>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${REAL_POBREZA_SEMESTRAL.length}, minmax(26px, 1fr))`,
                gap: '0.25rem',
                alignItems: 'end',
                height: '210px',
                paddingTop: '1.2rem',
                borderBottom: '1px solid var(--border-strong)',
                overflowX: 'auto'
              }}
            >
              {REAL_POBREZA_SEMESTRAL.map((pt) => {
                const val =
                  effectiveKey === 'oficial' && pt.pobOficial !== null
                    ? pt.pobOficial
                    : pt.pobReconstruccion;
                const h = Math.max(10, (val / 55) * 165);
                return (
                  <div
                    key={pt.periodo}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      height: '100%'
                    }}
                    title={`${pt.periodo}: Pobreza ${val}%`}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        marginBottom: '0.15rem'
                      }}
                    >
                      {val.toFixed(0)}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        height: `${h}px`,
                        backgroundColor: getGovColor(pt.govId),
                        borderRadius: '3px 3px 0 0'
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.55rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.2rem',
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)'
                      }}
                    >
                      {pt.periodo.replace('20', '')}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '0.75rem',
                marginTop: '1rem'
              }}
            >
              {GOVERNMENTS.map((g) => {
                const m = g.metrics[effectiveKey];
                return (
                  <div
                    key={g.id}
                    style={{
                      padding: '0.7rem 0.85rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderLeft: `4px solid ${g.color}`,
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.76rem'
                    }}
                  >
                    <strong>{g.order}° {g.president}</strong>
                    <div style={{ fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                      Pobreza fin: <strong>{m.pobrezaFin}%</strong> | Desocup: <strong>{m.desempleoFin}%</strong>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      Empleo Formal: {m.empleoFormalTasaFin}% | Informal: {m.empleoInformalTasaFin}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'cruce_3_modelo_productivo': {
        return (
          <div>
            <div style={{ marginBottom: '0.85rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>
                Cruce de Actividad por Sectores (EMAE INDEC), Producción Industrial Manufacturera y Minería/Energía
              </strong>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '0.9rem'
              }}
            >
              {GOVERNMENTS.map((gov) => {
                const m = gov.metrics[effectiveKey];
                const sectors = [
                  { label: 'Industria Manufacturera (IPI)', val: m.industriaIpiVar },
                  { label: 'Construcción (Volumen Real EMAE)', val: m.construccionActividadVar },
                  { label: 'Minería, Litio y Petróleo/Gas', val: m.mineriaEnergiaVar },
                  { label: 'Agropecuario (EMAE Letra A)', val: m.agroVar }
                ];
                return (
                  <div
                    key={gov.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderTop: `4px solid ${gov.color}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.95rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.65rem' }}>
                      {gov.order}° {gov.president} ({gov.yearsLabel})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {sectors.map((s) => {
                        const isPos = s.val >= 0;
                        const w = Math.min(100, Math.abs(s.val) * 2.6);
                        return (
                          <div key={s.label}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.74rem',
                                marginBottom: '0.15rem'
                              }}
                            >
                              <span>{s.label}</span>
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 700,
                                  color: isPos ? 'var(--positive)' : 'var(--negative)'
                                }}
                              >
                                {isPos ? '+' : ''}
                                {s.val.toFixed(1).replace('.', ',')}%
                              </span>
                            </div>
                            <div
                              style={{
                                height: '7px',
                                background: 'var(--bg-muted)',
                                borderRadius: '4px',
                                overflow: 'hidden'
                              }}
                            >
                              <div
                                style={{
                                  width: `${w}%`,
                                  height: '100%',
                                  background: isPos ? 'var(--positive)' : 'var(--negative)'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'cruce_4_superavit_comercial': {
        return (
          <div className="comparison-table-wrapper" style={{ marginTop: 0 }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Gobierno</th>
                  <th>Exportaciones FOB (Inicio → Fin)</th>
                  <th>Variación Expo (%)</th>
                  <th>Saldo Comercial Final</th>
                  <th>Saldo Comercial Acumulado</th>
                  <th>Diagnóstico Analítico</th>
                </tr>
              </thead>
              <tbody>
                {GOVERNMENTS.map((g) => {
                  const m = g.metrics[effectiveKey];
                  return (
                    <tr key={g.id}>
                      <td>
                        <strong style={{ color: g.color }}>
                          {g.order}° {g.president} ({g.yearsLabel})
                        </strong>
                      </td>
                      <td className="mono-cell">
                        {g.id === 'cfk' && 'USD 82.981 M → 56.788 M'}
                        {g.id === 'macri' && 'USD 56.788 M → 65.115 M'}
                        {g.id === 'alberto' && 'USD 65.115 M → 66.788 M'}
                        {g.id === 'milei' && 'USD 66.788 M → 83.350 M'}
                      </td>
                      <td className={`mono-cell ${m.exportacionesVarPct >= 0 ? 'val-pos' : 'val-neg'}`}>
                        {m.exportacionesVarPct >= 0 ? '+' : ''}{m.exportacionesVarPct.toFixed(1)}%
                      </td>
                      <td className={`mono-cell ${m.saldoComercialFinUSD >= 0 ? 'val-pos' : 'val-neg'}`}>
                        {m.saldoComercialFinUSD >= 0 ? '+' : ''}USD {m.saldoComercialFinUSD.toLocaleString('es-AR')} M
                      </td>
                      <td className="mono-cell val-pos">
                        +USD {m.balanzaComercialAcumUSD.toLocaleString('es-AR')} M
                      </td>
                      <td style={{ fontSize: '0.78rem' }}>
                        {g.id === 'cfk' && 'Déficit por caída de expo (-31,5%) e importación de energía.'}
                        {g.id === 'macri' && 'Superávit en 2019 mayormente por desplome de impo durante recesión.'}
                        {g.id === 'alberto' && 'Récord de precios en 2021-22, pero déficit en 2023 por sequía.'}
                        {g.id === 'milei' && 'Superávit récord por salto exportador (+24,8%) y reversión energética.'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }

      case 'cruce_5_vulnerabilidad_crianza': {
        return (
          <div>
            <div style={{ marginBottom: '0.85rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>
                Valores Oficiales Sincronizados (Septiembre 2026 - API-INDEC v1): Canasta Básica y Canasta de Crianza
              </strong>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}
            >
              {[
                { title: 'CBT Adulto Equivalente (202609)', val: '$528.318,67', sub: '+1,7% mensual | +38,7% i.a.' },
                { title: 'CBT Hogar 1 (3 integrantes)', val: '$1.299.663,93', sub: 'Línea de Pobreza Hogar' },
                { title: 'Canasta Crianza (< 1 año)', val: '$570.831,58', sub: 'Bienes: $184.911 + Cuidado: $385.920' },
                { title: 'Canasta Crianza (6 a 12 años)', val: '$728.849,59', sub: 'Bienes: $377.230 + Cuidado: $351.618' }
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem'
                  }}
                >
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{card.title}</div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.08rem',
                      fontWeight: 700,
                      marginTop: '0.2rem',
                      color: 'var(--accent)'
                    }}
                  >
                    {card.val}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {card.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'cruce_7_estado_sostenibilidad': {
        return (
          <div className="comparison-table-wrapper" style={{ marginTop: 0 }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Presidencia</th>
                  <th>Resultado Primario (% PBI)</th>
                  <th>Resultado Financiero (% PBI)</th>
                  <th>Reservas Netas BCRA (USD)</th>
                  <th>Brecha Cambiaria al Cierre</th>
                  <th>Deuda Pública / PBI</th>
                </tr>
              </thead>
              <tbody>
                {GOVERNMENTS.map((g) => {
                  const m = g.metrics[effectiveKey];
                  return (
                    <tr key={g.id}>
                      <td>
                        <strong style={{ color: g.color }}>
                          {g.order}° {g.president} ({g.yearsLabel})
                        </strong>
                      </td>
                      <td className={`mono-cell ${m.resultadoFiscalPrimarioFinPBI >= 0 ? 'val-pos' : 'val-neg'}`}>
                        {m.resultadoFiscalPrimarioFinPBI > 0 ? '+' : ''}{m.resultadoFiscalPrimarioFinPBI.toFixed(1)}% PBI
                      </td>
                      <td className={`mono-cell ${m.resultadoFiscalFinancieroFinPBI >= 0 ? 'val-pos' : 'val-neg'}`}>
                        {m.resultadoFiscalFinancieroFinPBI > 0 ? '+' : ''}{m.resultadoFiscalFinancieroFinPBI.toFixed(1)}% PBI
                      </td>
                      <td className={`mono-cell ${m.reservasNetasFinUSD >= 0 ? 'val-pos' : 'val-neg'}`}>
                        {m.reservasNetasFinUSD >= 0 ? '+' : ''}USD {m.reservasNetasFinUSD.toLocaleString('es-AR')} M
                      </td>
                      <td className="mono-cell">
                        {m.brechaCambiariaFinPct.toFixed(1)}%
                      </td>
                      <td className="mono-cell">
                        {m.deudaPublicaFinPBI.toFixed(1)}% PBI
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }

      case 'cruce_9_tarifas_vs_alimentos': {
        return (
          <div>
            <div style={{ marginBottom: '0.85rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>
                Apertura Oficial COICOP (Septiembre 2026 - API-INDEC v1): Servicios Regulados y Vivienda vs. Bienes y Alimentos
              </strong>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}
            >
              {[
                { division: 'Vivienda, Agua, Luz y Gas (04)', ia: '+49,1% i.a.', tag: 'Servicio Regulado' },
                { division: 'Servicios Regulados (R)', ia: '+43,3% i.a.', tag: 'Precios Administrados' },
                { division: 'Servicios Totales (S)', ia: '+41,9% i.a.', tag: 'Sector Servicios' },
                { division: 'Alimentos y Bebidas (01)', ia: '+35,1% i.a.', tag: 'Consumo Masivo' },
                { division: 'IPC Nivel General (0)', ia: '+33,4% i.a.', tag: 'Promedio País' },
                { division: 'Bienes Totales (B)', ia: '+29,2% i.a.', tag: 'Bienes Transables' },
                { division: 'Prendas de Vestir y Calzado (03)', ia: '+10,3% i.a.', tag: 'Apertura Textil' }
              ].map((item) => (
                <div
                  key={item.division}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem'
                  }}
                >
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {item.tag}
                  </span>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', marginTop: '0.15rem' }}>
                    {item.division}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      marginTop: '0.25rem',
                      color: item.ia.includes('49') || item.ia.includes('43') ? 'var(--negative)' : 'var(--accent)'
                    }}
                  >
                    {item.ia}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default: {
        return (
          <div className="comparison-table-wrapper" style={{ marginTop: 0 }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Presidencia</th>
                  <th>PBI Total / Per Cápita</th>
                  <th>Inflación (Inicio → Fin)</th>
                  <th>Resultado Financiero (% PBI)</th>
                  <th>Reservas Netas Fin</th>
                  <th>Gini / Pobreza Fin</th>
                </tr>
              </thead>
              <tbody>
                {GOVERNMENTS.map((g) => {
                  const m = g.metrics[effectiveKey];
                  return (
                    <tr key={g.id}>
                      <td>
                        <strong style={{ color: g.color }}>
                          {g.order}° {g.president} ({g.yearsLabel})
                        </strong>
                      </td>
                      <td className="mono-cell">
                        {m.pbiVariacionTotal > 0 ? '+' : ''}
                        {m.pbiVariacionTotal}% ({m.pbiPerCapitaVar > 0 ? '+' : ''}
                        {m.pbiPerCapitaVar}% p/c)
                      </td>
                      <td className="mono-cell">
                        {m.inflacionInicio}% → <strong>{m.inflacionFin}%</strong>
                      </td>
                      <td
                        className={`mono-cell ${
                          m.resultadoFiscalFinancieroFinPBI >= 0 ? 'val-pos' : 'val-neg'
                        }`}
                      >
                        {m.resultadoFiscalFinancieroFinPBI > 0 ? '+' : ''}
                        {m.resultadoFiscalFinancieroFinPBI}% PBI
                      </td>
                      <td
                        className={`mono-cell ${
                          m.reservasNetasFinUSD >= 0 ? 'val-pos' : 'val-neg'
                        }`}
                      >
                        {m.reservasNetasFinUSD >= 0 ? '+' : ''}USD{' '}
                        {m.reservasNetasFinUSD.toLocaleString('es-AR')} M
                      </td>
                      <td className="mono-cell">
                        Gini {m.giniFin.toFixed(3).replace('.', ',')} | Pob {m.pobrezaFin}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }
  };

  return (
    <section className="section-block" id="laboratorio-cruces">
      <div className="section-header">
        <div>
          <p className="section-kicker">03 · Laboratorio Económico (Los 9 Cruces de Datos)</p>
          <h2 className="section-title">
            Relaciones entre Indicadores, Fórmulas y Limitaciones Metodológicas
          </h2>
          <p className="section-subtitle">
            Seleccioná cualquiera de los <strong>9 cruces estadísticos</strong> para auditar cómo interactuaron precios, salarios, empleo formal/informal, actividad sectorial, comercio exterior, solvencia fiscal y el peso relativo de las tarifas frente a la comida.
          </p>
        </div>
      </div>

      <div className="cross-lab-layout">
        {/* Left: 9 Crosses Selector */}
        <div className="cross-selector-list">
          {CROSS_DATA_ANALYSES.map((item) => (
            <button
              key={item.id}
              type="button"
              id={`select-cross-${item.id}`}
              className={`cross-selector-card ${activeCrossId === item.id ? 'active' : ''}`}
              onClick={() => setActiveCrossId(item.id)}
            >
              <span className="cross-selector-num">Cruce Estadístico {item.number} / 09</span>
              <span className="cross-selector-title">{item.title}</span>
              <span className="cross-selector-q">{item.question}</span>
            </button>
          ))}
        </div>

        {/* Right: Stage */}
        <div className="cross-stage-panel">
          <div className="cross-stage-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.65rem' }}>
              <div className="cross-endpoints-row">
                {activeCross.endpointsUsed.map((ep) => (
                  <span key={ep} className="endpoint-pill">
                    {ep}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => handleDownloadCrossData('csv')}
                  title="Descargar datos de este cruce en CSV"
                >
                  Exportar CSV ⭳
                </button>
                <button
                  type="button"
                  className="preset-btn active"
                  onClick={() => handleDownloadCrossData('json')}
                  title="Descargar datos de este cruce en JSON"
                >
                  Exportar JSON ⭳
                </button>
              </div>
            </div>

            <h3 className="cross-stage-title" style={{ marginTop: '0.45rem' }}>{activeCross.title}</h3>
            <div className="cross-formula-bar">Fórmula: {activeCross.formula}</div>
          </div>

          <div className="cross-chart-box">{renderCrossVisualization()}</div>

          <div className="cross-conclusion-box">
            <h4>Evidencia Observada en el Cruce de Series</h4>
            <p>{activeCross.keyConclusion}</p>
          </div>

          {readingLevel === 'avanzada' && (
            <div
              style={{
                marginTop: '0.9rem',
                padding: '0.8rem 1rem',
                background: 'var(--warning-bg)',
                borderLeft: '4px solid var(--warning)',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                fontSize: '0.8rem'
              }}
            >
              <strong>Nota Metodológica y Alcance Estadístico: </strong>
              {activeCross.methodologicalCaveat}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
