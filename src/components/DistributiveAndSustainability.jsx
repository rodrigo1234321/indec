import React, { useState } from 'react';
import { DISTRIBUTIVE_GROUPS, GOVERNMENTS, REGIONAL_STATISTICS } from '../data/indecData';

export default function DistributiveAndSustainability({ methodMode }) {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const effectiveKey = methodMode === 'oficial' ? 'oficial' : 'reconstruccion';

  const groupsToShow =
    selectedGroup === 'all'
      ? DISTRIBUTIVE_GROUPS
      : DISTRIBUTIVE_GROUPS.filter((g) => g.id === selectedGroup);

  return (
    <section className="section-block" id="quien-mejoro-y-sostenibilidad">
      <div className="section-header">
        <div>
          <p className="section-kicker">
            02 · Dimensión Distributiva y Sostenibilidad Macroeconómica
          </p>
          <h2 className="section-title">
            ¿Quién Mejoró Realmente su Situación y Qué Herencia Dejó Cada Gestión?
          </h2>
          <p className="section-subtitle">
            Un promedio nacional puede ocultar que un sector mejore mientras otro se desploma, o que una mejora de corto plazo se financie agotando reservas o acumulando deuda. Acá desagregamos los datos por grupo social y medimos las 5 dimensiones de sostenibilidad.
          </p>
        </div>
      </div>

      {/* Filter by Social / Labor Group */}
      <div
        style={{
          display: 'flex',
          gap: '0.45rem',
          flexWrap: 'wrap',
          marginBottom: '1.2rem'
        }}
      >
        <button
          type="button"
          className={`indicator-pill-btn ${selectedGroup === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedGroup('all')}
        >
          Todos los sectores sociales (5)
        </button>
        {DISTRIBUTIVE_GROUPS.map((grp) => (
          <button
            key={grp.id}
            type="button"
            className={`indicator-pill-btn ${selectedGroup === grp.id ? 'active' : ''}`}
            onClick={() => setSelectedGroup(grp.id)}
          >
            {grp.groupName.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Distributive Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.25rem' }}>
        {groupsToShow.map((grp) => (
          <div
            key={grp.id}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem 1.3rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.6rem'
              }}
            >
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.18rem' }}>
                  {grp.groupName}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {grp.limitationNote}
                </span>
              </div>
              <span className="endpoint-pill">{grp.sourceEndpoint}</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.85rem'
              }}
            >
              {GOVERNMENTS.map((gov) => {
                const entry = grp.byGov[gov.id];
                const isAuh = grp.id === 'hogares_vulnerables_auh';
                const valFormatted = isAuh
                  ? `${entry.varReal.toFixed(0)}% de la CBA`
                  : `${entry.varReal > 0 ? '+' : ''}${entry.varReal.toFixed(1).replace('.', ',')}% real`;

                return (
                  <div
                    key={gov.id}
                    style={{
                      background: 'var(--bg-page)',
                      borderLeft: `4px solid ${gov.color}`,
                      padding: '0.75rem 0.9rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                        {gov.order}° {gov.president.split(' ').slice(-1)[0]} ({gov.yearsLabel})
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          color:
                            entry.dir === 'pos'
                              ? 'var(--positive)'
                              : entry.dir === 'neg'
                              ? 'var(--negative)'
                              : 'var(--text-primary)'
                        }}
                      >
                        {valFormatted}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '0.76rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.3rem',
                        lineHeight: 1.4
                      }}
                    >
                      {entry.status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Regional Disaggregation Module (6 Statistical Regions INDEC) */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.4rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.25rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.85rem',
            marginBottom: '1.15rem'
          }}
        >
          <div>
            <span className="section-kicker">Desagregación Territorial Oficial</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginTop: '0.2rem' }}>
              Impacto en las 6 Regiones Estadísticas del INDEC
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Los promedios nacionales ocultan realidades dispares. Compará la inflación interanual (/v1/ipc_nacional regional), la pobreza (/v1/pobreza_eph) y la valorización de canastas en cada territorio.
            </p>
          </div>
          <span className="endpoint-pill">/v1/ipc_nacional + /v1/pobreza_eph</span>
        </div>

        {/* Region selector buttons */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <button
            type="button"
            className={`indicator-pill-btn ${selectedRegion === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedRegion('all')}
          >
            Vista Comparativa (Todas las Regiones)
          </button>
          {REGIONAL_STATISTICS.map((reg) => (
            <button
              key={reg.id}
              type="button"
              className={`indicator-pill-btn ${selectedRegion === reg.id ? 'active' : ''}`}
              onClick={() => setSelectedRegion(reg.id)}
            >
              {reg.shortName}
            </button>
          ))}
        </div>

        {/* Selected Region Detailed Card or All Matrix */}
        {selectedRegion !== 'all' ? (
          (() => {
            const reg = REGIONAL_STATISTICS.find((r) => r.id === selectedRegion);
            if (!reg) return null;
            return (
              <div
                style={{
                  background: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '0.75rem'
                  }}
                >
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', margin: 0 }}>
                    {reg.regionName}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {reg.coberturaEPH}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                      INFLACIÓN INTERANUAL (SEP 2026)
                    </span>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: 'var(--accent)' }}>
                      {reg.ipcInteranualSep2026.toFixed(1).replace('.', ',')}%
                    </strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      vs. 33,4% promedio nacional (Fin Alberto: {reg.ipcFinAlberto.toFixed(1).replace('.', ',')}%)
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                      POBREZA EPH (1S 2026)
                    </span>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                      {reg.pobreza1S2026.toFixed(1).replace('.', ',')}%
                    </strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Pico 2024: {reg.pobrezaPico2024.toFixed(1).replace('.', ',')}% | Fin Alberto: {reg.pobrezaFinAlberto.toFixed(1).replace('.', ',')}%
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                      CBT ADULTO EQUIVALENTE
                    </span>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                      ${Math.round(reg.cbtAdultoEquiv).toLocaleString('es-AR')}
                    </strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Valor normativo mensual INDEC (corte sep-2026)
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--bg-surface)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '4px solid var(--accent)',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    color: 'var(--text-secondary)'
                  }}
                >
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>
                    Dinámica socioeconómica regional:
                  </strong>
                  {reg.caracteristicaClave}
                </div>
              </div>
            );
          })()
        ) : (
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Región Estadística (INDEC)</th>
                  <th>Inflación i.a. (Sep 2026)</th>
                  <th>Inflación Fin Alberto (2023)</th>
                  <th>Pobreza EPH (1S 2026)</th>
                  <th>Pobreza Fin Alberto</th>
                  <th>CBT Adulto Equiv.</th>
                </tr>
              </thead>
              <tbody>
                {REGIONAL_STATISTICS.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <strong>{reg.regionName}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {reg.coberturaEPH}
                      </div>
                    </td>
                    <td className="mono-cell" style={{ fontWeight: 700, color: 'var(--accent)' }}>
                      {reg.ipcInteranualSep2026.toFixed(1).replace('.', ',')}%
                    </td>
                    <td className="mono-cell">{reg.ipcFinAlberto.toFixed(1).replace('.', ',')}%</td>
                    <td className="mono-cell" style={{ fontWeight: 700 }}>
                      {reg.pobreza1S2026.toFixed(1).replace('.', ',')}%
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                        Pico 2024: {reg.pobrezaPico2024.toFixed(1).replace('.', ',')}%
                      </span>
                    </td>
                    <td className="mono-cell">{reg.pobrezaFinAlberto.toFixed(1).replace('.', ',')}%</td>
                    <td className="mono-cell">
                      ${Math.round(reg.cbtAdultoEquiv).toLocaleString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5 Dimensions of Sustainability & Inherited State */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.4rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <span className="section-kicker">Auditoría de Sostenibilidad y Herencia Macroeconómica</span>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', marginTop: '0.2rem' }}>
            Las 5 Dimensiones de Solvencia al Finalizar cada Mandato (o Presente)
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Distingue entre resultado fiscal primario y financiero (con intereses), y entre reservas brutas y reservas netas de libre disponibilidad del BCRA.
          </p>
        </div>

        <div className="comparison-table-wrapper" style={{ marginTop: '0.75rem' }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Dimensión de Sostenibilidad</th>
                {GOVERNMENTS.map((g) => (
                  <th key={g.id} style={{ borderTop: `3px solid ${g.color}` }}>
                    {g.order}° {g.president} ({g.yearsLabel})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>1. Fiscal y Deuda</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Resultado Primario, Financiero y Deuda / PBI
                  </div>
                </td>
                {GOVERNMENTS.map((g) => {
                  const m = g.metrics[effectiveKey];
                  return (
                    <td key={g.id} className="mono-cell">
                      Primario: {m.resultadoFiscalPrimarioFinPBI > 0 ? '+' : ''}
                      {m.resultadoFiscalPrimarioFinPBI.toFixed(1).replace('.', ',')}% PBI
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Financiero: {m.resultadoFiscalFinancieroFinPBI > 0 ? '+' : ''}
                        {m.resultadoFiscalFinancieroFinPBI.toFixed(1).replace('.', ',')}% | Deuda: {m.deudaPublicaFinPBI.toFixed(1).replace('.', ',')}%
                      </div>
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td>
                  <strong>2. Externa y Reservas Netas BCRA</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Reservas Netas (Inicio → Fin) y Saldo Comercial
                  </div>
                </td>
                {GOVERNMENTS.map((g) => {
                  const m = g.metrics[effectiveKey];
                  return (
                    <td key={g.id} className="mono-cell">
                      Netas Fin:{' '}
                      <strong className={m.reservasNetasFinUSD >= 0 ? 'val-pos' : 'val-neg'}>
                        {m.reservasNetasFinUSD >= 0 ? '+' : ''}USD {m.reservasNetasFinUSD.toLocaleString('es-AR')} M
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Recibió: {m.reservasNetasInicioUSD >= 0 ? '+' : ''}USD {m.reservasNetasInicioUSD.toLocaleString('es-AR')} M
                      </div>
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td>
                  <strong>3. Monetaria y Cambiaria</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Brecha Cambiaria (%) e Inflación al Cierre
                  </div>
                </td>
                {GOVERNMENTS.map((g) => {
                  const m = g.metrics[effectiveKey];
                  return (
                    <td key={g.id} className="mono-cell">
                      Brecha: {m.brechaCambiariaInicioPct.toFixed(0)}% →{' '}
                      <strong>{m.brechaCambiariaFinPct.toFixed(1).replace('.', ',')}%</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        IPC fin/actual: {m.inflacionFin.toFixed(1).replace('.', ',')}% anual
                      </div>
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td>
                  <strong>4. Productiva y Sectorial</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    EMAE, Industria, Construcción y Energía/Minería
                  </div>
                </td>
                {GOVERNMENTS.map((g) => {
                  const m = g.metrics[effectiveKey];
                  return (
                    <td key={g.id} className="mono-cell">
                      PBI: {m.pbiVariacionTotal > 0 ? '+' : ''}
                      {m.pbiVariacionTotal.toFixed(1).replace('.', ',')}%
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Ind: {m.industriaIpiVar > 0 ? '+' : ''}{m.industriaIpiVar}% | Min/En: {m.mineriaEnergiaVar > 0 ? '+' : ''}{m.mineriaEnergiaVar}%
                      </div>
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td>
                  <strong>5. Social, Desigualdad y Seguridad</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Pobreza EPH, Coeficiente de Gini y Homicidios SNIC
                  </div>
                </td>
                {GOVERNMENTS.map((g) => {
                  const m = g.metrics[effectiveKey];
                  return (
                    <td key={g.id} className="mono-cell">
                      Pobreza: <strong>{m.pobrezaFin.toFixed(1).replace('.', ',')}%</strong> | Gini: {m.giniFin.toFixed(3).replace('.', ',')}
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Homicidios: {m.homicidiosFin.toFixed(1).replace('.', ',')} c/100k hab.
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
