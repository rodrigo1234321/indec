import React, { useEffect, useState } from 'react';
import { GOVERNMENTS } from './data/indecData';
import ChronologicalComparison from './components/ChronologicalComparison';
import DistributiveAndSustainability from './components/DistributiveAndSustainability';
import CrossDataLab from './components/CrossDataLab';
import Base100Comparator from './components/Base100Comparator';
import ElectoralSimulator from './components/ElectoralSimulator';
import MethodologyAndDataAudit from './components/MethodologyAndDataAudit';
import ApiInspectorModal from './components/ApiInspectorModal';
import { fetchPublicSeriesTime } from './services/indecApi';

export default function App() {
  const [methodMode, setMethodMode] = useState('reconstruccion'); // 'reconstruccion' | 'oficial' | 'comparacion'
  const [readingLevel, setReadingLevel] = useState('sencilla'); // 'sencilla' (predeterminada) | 'avanzada'
  const [activeSection, setActiveSection] = useState('comparacion-cronologica');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [jwtToken, setJwtToken] = useState('');
  const [apiSyncLabel, setApiSyncLabel] = useState('API-INDEC v1 · Sincronizado (Sep 2026)');

  useEffect(() => {
    let mounted = true;
    fetchPublicSeriesTime(['143.3_NO_PR_2004_A_21'], 1)
      .then((res) => {
        if (mounted && res.data && res.data.length > 0) {
          setApiSyncLabel('API-INDEC v1 + Series de Tiempo · Activo');
        }
      })
      .catch(() => {
        // Fallback to local synced snapshot
      });
    return () => {
      mounted = false;
    };
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* Top Institutional Bar */}
      <header className="top-institutional-bar">
        <div className="top-bar-inner">
          <div className="top-bar-left">
            <span className="indec-tag">Catálogo API-INDEC v1 · Sincronizado</span>
            <span>
              Observatorio de Resultados, Costos y Consecuencias (2011 – 2026)
            </span>
          </div>

          <div className="top-bar-actions">
            {/* 3 Historical Methodology Modes for 2011-2015 */}
            <div className="methodology-switch" role="group" aria-label="Criterio histórico 2011-2015">
              <span className="methodology-switch-label">2011–2015:</span>
              <button
                type="button"
                className={`method-btn ${methodMode === 'reconstruccion' ? 'active' : ''}`}
                onClick={() => setMethodMode('reconstruccion')}
              >
                Reconstrucción Comparable
              </button>
              <button
                type="button"
                className={`method-btn ${methodMode === 'oficial' ? 'active' : ''}`}
                onClick={() => setMethodMode('oficial')}
              >
                Serie Oficial Publicada
              </button>
              <button
                type="button"
                className={`method-btn ${methodMode === 'comparacion' ? 'active' : ''}`}
                onClick={() => setMethodMode('comparacion')}
              >
                Comparar Fuentes
              </button>
            </div>

            {/* Simple vs Advanced Reading Mode */}
            <div className="methodology-switch" role="group" aria-label="Nivel de lectura">
              <button
                type="button"
                className={`method-btn ${readingLevel === 'sencilla' ? 'active' : ''}`}
                onClick={() => setReadingLevel('sencilla')}
              >
                Lectura Sencilla
              </button>
              <button
                type="button"
                className={`method-btn ${readingLevel === 'avanzada' ? 'active' : ''}`}
                onClick={() => setReadingLevel('avanzada')}
              >
                Lectura Avanzada
              </button>
            </div>

            <button
              type="button"
              id="btn-open-api-inspector"
              className="api-status-btn"
              onClick={() => setIsApiModalOpen(true)}
            >
              <span className="status-dot" />
              <span>{apiSyncLabel}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="container">
        <section className="masthead">
          <div className="masthead-grid">
            <div>
              <p className="masthead-kicker">
                16 Años de Gobiernos Argentinos, sus Resultados, sus Costos y sus Consecuencias
              </p>
              <h1>
                Compará los Datos. Sacá tus Conclusiones.
              </h1>
              <p className="masthead-lead">
                Evaluá en orden cronológico los gobiernos de{' '}
                <strong>Cristina Kirchner (2011–2015)</strong>, <strong>Mauricio Macri (2015–2019)</strong>,{' '}
                <strong>Alberto Fernández (2019–2023)</strong> y <strong>Javier Milei (2023–2026)</strong>.
                No nos quedamos con un dato suelto: cruzamos cómo recibió el país cada presidente, cómo lo dejó, a qué costo consiguió cada mejora, qué grupos sociales mejoraron o empeoraron, y qué resultados coinciden con tus prioridades del 1 al 10.
              </p>
            </div>

            <div className="masthead-summary-box">
              <div className="masthead-summary-title">
                Orden Cronológico (Clic para inspeccionar cada mandato)
              </div>
              <div className="chronology-mini-strip">
                {GOVERNMENTS.map((gov) => (
                  <button
                    key={gov.id}
                    type="button"
                    className="chrono-pill"
                    style={{ borderTopColor: gov.color }}
                    onClick={() => scrollToSection(`gov-card-${gov.id}`)}
                  >
                    <span className="chrono-pill-order">{gov.order}° Mandato</span>
                    <span className="chrono-pill-name">
                      {gov.president.split(' ').slice(-1)[0]}
                    </span>
                    <span className="chrono-pill-years">{gov.yearsLabel}</span>
                  </button>
                ))}
              </div>
              <div
                style={{
                  marginTop: '0.85rem',
                  paddingTop: '0.7rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.77rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <span>¿Querés responder las 9 preguntas del 1 al 10?</span>
                <button
                  type="button"
                  className="preset-btn active"
                  onClick={() => scrollToSection('simulador-electoral')}
                >
                  Ir a Mis Prioridades (1 a 10) →
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Section Navigation (5 Core Sections) */}
      <nav className="section-nav-bar" aria-label="Secciones principales">
        <div className="container section-nav-inner">
          <div className="nav-tabs">
            {[
              {
                id: 'comparacion-cronologica',
                num: '01',
                label: 'Comparar Gobiernos (3 Perspectivas y Costos)'
              },
              {
                id: 'quien-mejoro-y-sostenibilidad',
                num: '02',
                label: '¿Quién Mejoró? y Sostenibilidad (5 Ejes)'
              },
              {
                id: 'laboratorio-cruces',
                num: '03',
                label: 'Laboratorio Económico (8 Cruces)'
              },
              {
                id: 'comparador-base100',
                num: '04',
                label: 'Trayectorias a Igual Tiempo'
              },
              {
                id: 'simulador-electoral',
                num: '05',
                label: 'Mis Prioridades (Cuestionario 1 al 10)'
              },
              {
                id: 'seccion-metodologia-auditoria',
                num: '06',
                label: 'Metodología y Datos Abiertos'
              }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab-btn ${activeSection === tab.id ? 'active' : ''}`}
                onClick={() => scrollToSection(tab.id)}
              >
                <span className="nav-tab-num">{tab.num}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container">
        {/* Methodological Banner */}
        <div className="methodology-banner" style={{ marginTop: '1.75rem', marginBottom: 0 }}>
          <div>
            <strong>Criterio Estadístico 2011–2015 activo: </strong>
            {methodMode === 'reconstruccion' && (
              <span>
                <strong>Reconstrucción Histórica Comparable</strong> (utiliza IPC de direcciones provinciales / Congreso y serie de pobreza CEDLAS/UCA con metodología INDEC 2016 debido a la advertencia institucional del INDEC sobre las series 2007–2015).
              </span>
            )}
            {methodMode === 'oficial' && (
              <span>
                <strong>Serie Oficial Publicada</strong> (muestra los valores difundidos en su momento por el INDEC intervenido: IPC-GBA/IPCNu ~15,6% anual y pobreza 4,7% hasta su discontinuación en 2013).
              </span>
            )}
            {methodMode === 'comparacion' && (
              <span>
                <strong>Comparación entre Fuentes</strong> (contrasta simultáneamente la Serie Oficial Publicada y la Reconstrucción Histórica Comparable en las tarjetas de 2011–2015).
              </span>
            )}
          </div>
        </div>

        {/* Guía Visual del Semáforo ("¿Cómo leer los colores?") */}
        <div className="traffic-guide-banner">
          <div className="traffic-guide-title">
            <span>Guía Rápida de Colores (Objetiva y Matemática):</span>
          </div>
          <div className="traffic-pills-row">
            <span className="traffic-pill pos">
              <span>🟢</span>
              <span><strong>Verde:</strong> Mejoró / Favorable (Baja inflación o pobreza, sube salario, aumentan reservas)</span>
            </span>
            <span className="traffic-pill neg">
              <span>🔴</span>
              <span><strong>Rojo:</strong> Empeoró / Alerta (Sube inflación o pobreza, cae salario, caen reservas)</span>
            </span>
            <span className="traffic-pill neutral">
              <span>⚪</span>
              <span><strong>Gris:</strong> Neutro / Estable (Sin cambios significativos)</span>
            </span>
          </div>
        </div>

        {/* 01. Chronological Comparison with 3 Perspectives & Cost-Benefit Cards */}
        <ChronologicalComparison methodMode={methodMode} readingLevel={readingLevel} />

        {/* 02. Distributive Module & 5 Sustainability Dimensions */}
        <DistributiveAndSustainability methodMode={methodMode} />

        {/* 03. Economic Lab: 8 Crosses */}
        <CrossDataLab methodMode={methodMode} readingLevel={readingLevel} />

        {/* 04. Equal-Time Trajectory Comparator */}
        <Base100Comparator />

        {/* 05. Citizen Priority Questionnaire (1 to 10) */}
        <ElectoralSimulator methodMode={methodMode} />

        {/* 06. Methodology, Formulas and Open Data Audit */}
        <MethodologyAndDataAudit methodMode={methodMode} readingLevel={readingLevel} />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1.5rem',
              borderTop: '2px solid var(--text-primary)',
              paddingTop: '1.5rem'
            }}
          >
            <div style={{ maxWidth: '70ch' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                Observatorio de Resultados, Costos y Consecuencias · Basado en Catálogo API-INDEC v1
              </strong>
              <p style={{ marginTop: '0.4rem', lineHeight: 1.5 }}>
                Datos sincronizados de forma segura en servidor (<code>scripts/sync-indec-api.mjs</code>) desde{' '}
                <code>https://api.indec.gob.ar/v1</code> (corte septiembre 2026 / 1S 2026 / 2T 2026), API Series de Tiempo (BCRA / Ministerio de Economía) y SNIC (Ministerio de Seguridad). La credencial JWT nunca se expone en el navegador público.
              </p>
            </div>
            <div>
              <button
                type="button"
                className="action-primary-btn"
                onClick={() => setIsApiModalOpen(true)}
              >
                Fuentes, Metadatos y Conector Avanzado API
              </button>
            </div>
          </div>
        </div>
      </footer>

      <ApiInspectorModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        jwtToken={jwtToken}
        setJwtToken={setJwtToken}
      />
    </div>
  );
}
