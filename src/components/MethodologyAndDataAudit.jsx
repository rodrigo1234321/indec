import React, { useState } from 'react';
import { INDEC_ENDPOINTS_CATALOG } from '../data/indecData';

export default function MethodologyAndDataAudit({ methodMode, readingLevel }) {
  const [selectedEndpointKey, setSelectedEndpointKey] = useState(INDEC_ENDPOINTS_CATALOG[0].id);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState('');

  const currentEndpoint =
    INDEC_ENDPOINTS_CATALOG.find((ep) => ep.id === selectedEndpointKey) ||
    INDEC_ENDPOINTS_CATALOG[0];

  const handleDownload = async (epId, format) => {
    setIsExporting(true);
    setDownloadNotice('Cargando registros oficiales...');
    try {
      const fullModule = await import('../data/indecFullSyncedData.json');
      const allSeries = fullModule.default.series || {};

      let rows = [];
      if (epId === 'ipc_nacional') {
        rows = allSeries.ipc_general?.variacion_interanual || [];
      } else if (epId === 'valorizacion_canastas_cba_cbt') {
        rows = allSeries.canastas_cba_cbt || [];
      } else if (epId === 'canasta_crianza') {
        rows = allSeries.canasta_crianza || [];
      } else if (epId === 'indice_salarios') {
        rows = allSeries.indice_salarios || [];
      } else if (epId === 'pobreza_eph') {
        rows = allSeries.pobreza_eph || [];
      } else if (epId === 'mercado_trabajo_eph') {
        rows = allSeries.mercado_trabajo_eph || [];
      } else if (epId === 'emae_general') {
        rows = allSeries.emae_general || [];
      } else if (epId === 'emae_sectores') {
        rows = allSeries.emae_sectores || [];
      } else if (epId === 'ipi_manufacturero') {
        rows = allSeries.ipi_manufacturero_general || [];
      } else if (epId === 'ipi_minero') {
        rows = allSeries.ipi_minero || [];
      } else if (epId === 'icc_construccion') {
        rows = allSeries.icc_construccion || [];
      } else if (epId === 'sipm_mayoristas') {
        rows = allSeries.sipm_mayoristas || [];
      }

      const filename = `observatorio_indec_${epId}_${new Date().toISOString().slice(0, 10)}.${format}`;
      let content = '';

      if (format === 'json') {
        const exportObj = {
          endpoint: currentEndpoint.endpoint,
          name: currentEndpoint.name,
          area: currentEndpoint.area,
          frequency: currentEndpoint.frequency,
          coverage: currentEndpoint.coverage,
          primaryKeys: currentEndpoint.primaryKeys,
          totalRows: rows.length,
          exportedAt: new Date().toISOString(),
          citation: 'Fuente primaria: Catálogo API-INDEC v1 (https://api.indec.gob.ar/v1)',
          methodologicalMode: methodMode,
          data: rows
        };
        content = JSON.stringify(exportObj, null, 2);
      } else {
        if (rows.length > 0) {
          const keys = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
          const header = keys.join(',');
          const csvLines = rows.map((r) =>
            keys
              .map((k) => {
                const val = r[k];
                if (val === null || val === undefined) return '';
                const str = String(val);
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                  return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
              })
              .join(',')
          );
          content = [header, ...csvLines].join('\n');
        } else {
          content = `endpoint,name,area,frequency,coverage,primaryKeys,methodologicalMode\n"${currentEndpoint.endpoint}","${currentEndpoint.name}","${currentEndpoint.area}","${currentEndpoint.frequency}","${currentEndpoint.coverage}","${currentEndpoint.primaryKeys}","${methodMode}"\n`;
        }
      }

      const blob = new Blob([content], {
        type: format === 'json' ? 'application/json;charset=utf-8;' : 'text/csv;charset=utf-8;'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadNotice(`✓ Exportados ${rows.length} registros en formato ${format.toUpperCase()}`);
      setTimeout(() => setDownloadNotice(''), 4500);
    } catch (err) {
      console.error(err);
      setDownloadNotice('Error al exportar registros del dataset');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="section-block" id="seccion-metodologia-auditoria">
      <div className="section-header">
        <div>
          <p className="section-kicker">06 · Transparencia Metodológica, Fórmulas y Auditoría de Datos</p>
          <h2 className="section-title">
            Auditoría de Fuentes, Fórmulas Matemáticas y Descarga de Datos Abiertos
          </h2>
          <p className="section-subtitle">
            Cualquier ciudadano, periodista o economista puede auditar el origen primario de cada cifra, comprobar las fórmulas de normalización, consultar las advertencias técnicas oficiales y exportar los datasets en <strong>CSV</strong> o <strong>JSON</strong>.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) 2fr',
          gap: '1.5rem',
          alignItems: 'start'
        }}
      >
        {/* Left: Endpoint Catalog Selector */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.75rem' }}>
            Catálogo Oficial INDEC v1
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Seleccioná un endpoint para auditar sus metadatos, periodicidad, cobertura y clave primaria:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {INDEC_ENDPOINTS_CATALOG.map((ep) => (
              <button
                key={ep.id}
                type="button"
                className={`indicator-pill-btn ${selectedEndpointKey === ep.id ? 'active' : ''}`}
                style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}
                onClick={() => setSelectedEndpointKey(ep.id)}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
                  {ep.endpoint}
                </span>
                <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>{ep.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Technical Sheet & Formula Audit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.4rem',
              boxShadow: 'var(--shadow-sm)'
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
                marginBottom: '1rem'
              }}
            >
              <div>
                <span className="endpoint-pill">{currentEndpoint.endpoint}</span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.4rem',
                    marginTop: '0.35rem'
                  }}
                >
                  {currentEndpoint.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Área responsable: {currentEndpoint.area}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="preset-btn"
                    disabled={isExporting}
                    onClick={() => handleDownload(currentEndpoint.id, 'csv')}
                  >
                    {isExporting ? 'Exportando...' : 'Descargar CSV ⭳'}
                  </button>
                  <button
                    type="button"
                    className="preset-btn active"
                    disabled={isExporting}
                    onClick={() => handleDownload(currentEndpoint.id, 'json')}
                  >
                    {isExporting ? 'Exportando...' : 'Descargar JSON ⭳'}
                  </button>
                </div>
                {downloadNotice && (
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      color: downloadNotice.startsWith('✓') ? 'var(--positive)' : 'var(--accent)'
                    }}
                  >
                    {downloadNotice}
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.9rem',
                fontSize: '0.8rem'
              }}
            >
              <div>
                <strong style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  FRECUENCIA DE PUBLICACIÓN
                </strong>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {currentEndpoint.frequency}
                </span>
              </div>

              <div>
                <strong style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  COBERTURA TEMPORAL OFICIAL
                </strong>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {currentEndpoint.coverage}
                </span>
              </div>

              <div>
                <strong style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  APERTURA Y DESAGREGACIÓN
                </strong>
                <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>
                  {currentEndpoint.primaryKeys}
                </span>
              </div>
            </div>
          </div>

          {/* Core Formulas & Normalization Logic */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.4rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '0.85rem' }}>
              Fórmulas Estadísticas Aplicadas en el Observatorio
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="visual-formula-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.35rem' }}>🛒</span>
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}>
                    1. ¿Cómo se mide el poder de compra real en Canastas Básicas?
                  </strong>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  En vez de usar fórmulas matemáticas complejas o enredarse con qué índice de inflación elegir, medimos lo más concreto de la vida cotidiana: <strong>¿cuántas canastas completas de alimentos, servicios y transporte puede comprar un sueldo medio?</strong>
                </p>

                <div className="visual-formula-flow">
                  <div className="visual-formula-box">
                    <span className="visual-formula-box-icon">💵</span>
                    <span className="visual-formula-box-label">Tu Sueldo de Bolsillo</span>
                    <span className="visual-formula-box-value">Sueldo medio: ~$1.050.000</span>
                  </div>

                  <span className="visual-formula-operator">÷</span>

                  <div className="visual-formula-box">
                    <span className="visual-formula-box-icon">🛒</span>
                    <span className="visual-formula-box-label">Costo Canasta INDEC</span>
                    <span className="visual-formula-box-value">CBT sep-2026: $528.318</span>
                  </div>

                  <span className="visual-formula-operator">=</span>

                  <div className="visual-formula-box result">
                    <span className="visual-formula-box-icon">📦</span>
                    <span className="visual-formula-box-label">Canastas que Llenás</span>
                    <span className="visual-formula-box-value" style={{ fontWeight: 800, color: 'var(--positive)', fontSize: '0.95rem' }}>
                      1,98 Canastas Reales
                    </span>
                  </div>
                </div>

                <div className="visual-formula-example-box">
                  <strong>💡 Ejemplo simple que cualquiera entiende:</strong> Si tu sueldo sube de $500.000 a $800.000 (+60%), pero la canasta del supermercado y servicios sube de $250.000 a $600.000 (+140%), antes comprabas 2 canastas completas y ahora solo 1,33. <strong>Perdiste poder adquisitivo real aunque cobres más billetes nominales.</strong> Por eso medimos a los 4 gobiernos en canastas completas del INDEC.
                </div>
              </div>

              <div className="visual-formula-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.35rem' }}>⏱️</span>
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}>
                    2. ¿Cómo funciona la comparación a Igual Tiempo (Base 100)?
                  </strong>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Cada presidente asumió con un punto de partida diferente y durante una cantidad distinta de meses. Para no favorecer ni perjudicar a nadie, <strong>ponemos el contador en 100 el día que asume cada presidente</strong> y medimos quién mejoró o empeoró más rápido al mismo mes de gestión (Mes 6, 12, 24, 34).
                </p>

                <div className="visual-formula-flow">
                  <div className="visual-formula-box">
                    <span className="visual-formula-box-icon">🏁</span>
                    <span className="visual-formula-box-label">Día de Asunción</span>
                    <span className="visual-formula-box-value" style={{ fontWeight: 800 }}>Punto de partida = 100</span>
                  </div>

                  <span className="visual-formula-operator">➔</span>

                  <div className="visual-formula-box result">
                    <span className="visual-formula-box-icon">📈</span>
                    <span className="visual-formula-box-label">Si sube a 105</span>
                    <span className="visual-formula-box-value" style={{ color: 'var(--positive)', fontWeight: 700 }}>
                      🟢 Mejoró +5%
                    </span>
                  </div>

                  <span className="visual-formula-operator">o</span>

                  <div className="visual-formula-box" style={{ borderColor: 'var(--negative)', background: '#fff5f5' }}>
                    <span className="visual-formula-box-icon">📉</span>
                    <span className="visual-formula-box-label">Si baja a 85</span>
                    <span className="visual-formula-box-value" style={{ color: 'var(--negative)', fontWeight: 700 }}>
                      🔴 Empeoró −15%
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-page)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '4px solid var(--warning)'
                }}
              >
                <strong>3. Advertencias Metodológicas Oficiales del INDEC:</strong>
                <ul style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', paddingLeft: '1.1rem', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>
                    <strong>Período 2007–2015:</strong> El INDEC advierte institucionalmente que las series no revisadas correspondientes a ese período deben considerarse con reserva. Por ello, la plataforma ofrece el selector entre <em>Reconstrucción Histórica Comparable</em>, <em>Serie Oficial Publicada</em> y <em>Comparación entre Fuentes</em>.
                  </li>
                  <li>
                    <strong>Índice de Salarios No Registrado:</strong> Su serie oficial continua en el INDEC comienza en octubre de 2016. Las comparaciones anteriores utilizan microdatos EPH y no forman parte de una misma serie homogénea.
                  </li>
                  <li>
                    <strong>Construcción Física vs. Costos:</strong> La actividad física de construcción se mide mediante el Estimador Mensual de Actividad Económica (EMAE Sector Construcción) / ISAC. El Índice del Costo de la Construcción (ICC) mide costos de materiales y mano de obra por m², no nivel de producción física.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
