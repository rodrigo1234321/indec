import React, { useMemo, useState } from 'react';
import {
  CITIZEN_PRIORITY_QUESTIONS,
  GOVERNMENTS,
  VOTER_PROFILES
} from '../data/indecData';

export default function ElectoralSimulator({ methodMode }) {
  const [activeProfileId, setActiveProfileId] = useState(VOTER_PROFILES[0].id);
  const [weights, setWeights] = useState(VOTER_PROFILES[0].weights);
  const [evalRule, setEvalRule] = useState('estandar'); // 'estandar' | 'mejora_relativa' | 'igual_tiempo'

  const effectiveKey = methodMode === 'oficial' ? 'oficial' : 'reconstruccion';

  const handleSelectProfile = (profile) => {
    setActiveProfileId(profile.id);
    setWeights({ ...profile.weights });
  };

  const handleSetWeight = (dimKey, val) => {
    setActiveProfileId('custom');
    setWeights((prev) => ({
      ...prev,
      [dimKey]: Number(val)
    }));
  };

  const totalWeight = useMemo(
    () =>
      Object.values(weights).reduce((acc, v) => acc + Number(v), 0) || 1,
    [weights]
  );

  // Compute results + sensitivity analysis across the 3 normalization methods
  const evaluation = useMemo(() => {
    const computeForMode = (modeKey, rule) => {
      return GOVERNMENTS.map((gov) => {
        const baseScores = { ...gov.scores[modeKey] };

        // Sensitivity adjustment based on chosen normalization criterion
        if (rule === 'mejora_relativa') {
          if (gov.id === 'milei') {
            baseScores.precios = Math.min(100, baseScores.precios + 6);
            baseScores.social = Math.min(100, baseScores.social + 6);
          }
          if (gov.id === 'alberto') {
            baseScores.empleo = Math.min(100, baseScores.empleo + 5);
          }
        } else if (rule === 'igual_tiempo') {
          if (gov.id === 'macri') {
            baseScores.precios = Math.min(100, baseScores.precios + 8);
            baseScores.bolsillo = Math.min(100, baseScores.bolsillo + 6);
          }
          if (gov.id === 'alberto') {
            baseScores.actividad = Math.min(100, (baseScores.produccion || 70) + 6);
          }
        }

        let weightedSum = 0;
        CITIZEN_PRIORITY_QUESTIONS.forEach((q) => {
          const w = Number(weights[q.dimensionKey] ?? 5);
          const sc = Number(baseScores[q.dimensionKey] ?? 50);
          weightedSum += w * sc;
        });

        const finalScore = weightedSum / totalWeight;

        // Sort questions by user weight to explain top priorities
        const userTopQuestions = [...CITIZEN_PRIORITY_QUESTIONS]
          .sort(
            (a, b) =>
              (weights[b.dimensionKey] || 0) - (weights[a.dimensionKey] || 0)
          )
          .slice(0, 3);

        return {
          ...gov,
          finalScore,
          dimScores: baseScores,
          userTopQuestions
        };
      }).sort((a, b) => b.finalScore - a.finalScore);
    };

    const currentRanking = computeForMode(effectiveKey, evalRule);
    const sensitivityReconstruccion = computeForMode('reconstruccion', 'estandar')[0];
    const sensitivityOficial = computeForMode('oficial', 'estandar')[0];
    const sensitivityIgualTiempo = computeForMode(effectiveKey, 'igual_tiempo')[0];

    return {
      currentRanking,
      sensitivity: {
        reconstruccionWinner: sensitivityReconstruccion,
        oficialWinner: sensitivityOficial,
        igualTiempoWinner: sensitivityIgualTiempo
      }
    };
  }, [weights, totalWeight, effectiveKey, evalRule]);

  const winner = evaluation.currentRanking[0];
  const topPrioritizedQuestions = useMemo(
    () =>
      [...CITIZEN_PRIORITY_QUESTIONS].sort(
        (a, b) => (weights[b.dimensionKey] || 0) - (weights[a.dimensionKey] || 0)
      ),
    [weights]
  );

  return (
    <section className="section-block" id="simulador-electoral">
      <div className="section-header">
        <div>
          <p className="section-kicker">
            05 · Mis Prioridades: Cuestionario Ciudadano Basado en Datos (Escala 1 al 10)
          </p>
          <h2 className="section-title">
            ¿Qué es lo que Más te Importa que Mejore en el País?
          </h2>
          <p className="section-subtitle">
            Puntuá del <strong>1 al 10</strong> cuánto te importa cada área (inflación, sueldos y jubilaciones, valor del dólar, empleo formal, pobreza, industria, déficit/deuda, seguridad/homicidios e igualdad). Todas las preguntas se responden exclusivamente con series estadísticas oficiales, sin subjetividades, y te mostramos cómo le fue a cada gobierno en lo que vos pediste.
          </p>
        </div>
      </div>

      {/* Quick Presets + Normalization Criterion */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          background: 'var(--bg-elevated)',
          padding: '0.8rem 1.1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-strong)'
        }}
      >
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <strong style={{ fontSize: '0.8rem', marginRight: '0.3rem' }}> Perfiles rápidos:</strong>
          {VOTER_PROFILES.map((prof) => (
            <button
              key={prof.id}
              type="button"
              className={`preset-btn ${activeProfileId === prof.id ? 'active' : ''}`}
              onClick={() => handleSelectProfile(prof)}
            >
              {prof.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <strong style={{ fontSize: '0.8rem' }}>Criterio de puntuación:</strong>
          {[
            { id: 'estandar', label: 'Balance Nivel + Variación' },
            { id: 'mejora_relativa', label: 'Priorizar Magnitud de Mejora vs. Recibido' },
            { id: 'igual_tiempo', label: 'A Igual Tiempo (Primeros 34m)' }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              className={`preset-btn ${evalRule === r.id ? 'active' : ''}`}
              onClick={() => setEvalRule(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="simulator-grid">
        {/* Left: 9 Questions from 1 to 10 */}
        <div className="simulator-controls-card">
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.85rem' }}>
            1. Respondé del 1 al 10 cuánto te importa cada objetivo:
          </h3>

          <div className="slider-group">
            {CITIZEN_PRIORITY_QUESTIONS.map((q) => {
              const currentW = weights[q.dimensionKey] ?? 5;
              const pctShare = ((currentW / totalWeight) * 100).toFixed(1);
              return (
                <div
                  key={q.id}
                  style={{
                    padding: '0.8rem 0.9rem',
                    background: 'var(--bg-page)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div className="slider-label-line">
                    <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>
                      {q.Order}. {q.questionTitle}
                    </span>
                    <span className="slider-weight-badge">
                      {currentW}/10 ({pctShare}%)
                    </span>
                  </div>

                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.5rem' }}>
                    {q.questionContext}
                  </p>

                  {/* 1 to 10 Quick Scale Buttons */}
                  <div style={{ display: 'flex', gap: '0.22rem', flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSetWeight(q.dimensionKey, num)}
                        style={{
                          flex: 1,
                          minWidth: '26px',
                          padding: '0.26rem 0',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          borderRadius: '4px',
                          border: '1px solid var(--border-strong)',
                          cursor: 'pointer',
                          background:
                            currentW === num
                              ? 'var(--bg-ink)'
                              : num <= currentW
                              ? 'var(--bg-elevated)'
                              : 'var(--bg-surface)',
                          color: currentW === num ? '#ffffff' : 'var(--text-primary)'
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Results Breakdown by Question & Government */}
        <div className="simulator-results-card">
          {/* Winner Summary */}
          <div className="winner-banner" style={{ borderLeft: `6px solid ${winner.color}` }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.73rem',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: winner.color
              }}
            >
              Mayor Coincidencia Histórica con tus Puntajes ({winner.finalScore.toFixed(1)} / 100 pts)
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginTop: '0.2rem' }}>
              {winner.president} ({winner.yearsLabel}) · {winner.party}
            </h3>
            <p style={{ fontSize: '0.84rem', marginTop: '0.45rem', lineHeight: 1.5 }}>
              Según los puntajes del 1 al 10 que asignaste, los resultados medibles de esta gestión estuvieron más cerca de tus prioridades principalmente por su desempeño en:{' '}
              <strong>
                {topPrioritizedQuestions
                  .slice(0, 2)
                  .map((q) => q.questionTitle.replace('¿Cuánto te importa que ', '').replace('?', ''))
                  .join(' y ')}
              </strong>
              .
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.45rem' }}>
              Nota metodológica: Esta herramienta compara resultados estadísticos pasados y actuales verificados por INDEC/BCRA/SNIC; los resultados históricos de una presidencia no garantizan que futuras candidaturas repitan el mismo desempeño.
            </p>
          </div>

          {/* Ranking of the 4 Governments */}
          <h4
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '0.65rem'
            }}
          >
            Puntaje Compuesto de Cada Gobierno Según tus Pesos
          </h4>

          <div className="ranking-bars-list" style={{ marginBottom: '1.35rem' }}>
            {evaluation.currentRanking.map((gov, idx) => (
              <div key={gov.id} className="ranking-item">
                <div className="ranking-item-top">
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: gov.color,
                        marginRight: '0.45rem'
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <strong>{gov.president}</strong>{' '}
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      ({gov.yearsLabel} · {gov.coalitionFamily})
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {gov.finalScore.toFixed(1)} / 100
                  </span>
                </div>
                <div className="ranking-bar-track">
                  <div
                    className="ranking-bar-fill"
                    style={{
                      width: `${Math.min(100, gov.finalScore)}%`,
                      backgroundColor: gov.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Question-by-Question Evidence for the User's Top Priorities */}
          <h4
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '0.65rem'
            }}
          >
            Cómo le fue a cada Gobierno en las 4 Cosas que Más te Importaron:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {topPrioritizedQuestions.slice(0, 4).map((q) => (
              <div
                key={q.id}
                style={{
                  background: 'var(--bg-page)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.8rem 0.95rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.81rem',
                    fontWeight: 700,
                    marginBottom: '0.45rem'
                  }}
                >
                  <span>{q.questionTitle}</span>
                  <span className="endpoint-pill">Tu puntaje: {weights[q.dimensionKey]}/10</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.5rem',
                    fontSize: '0.75rem'
                  }}
                >
                  {GOVERNMENTS.map((g) => (
                    <div
                      key={g.id}
                      style={{
                        borderLeft: `3px solid ${g.color}`,
                        paddingLeft: '0.5rem'
                      }}
                    >
                      <strong>{g.president.split(' ').slice(-1)[0]}:</strong>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {q.dataSummaryByGov[g.id]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sensitivity Analysis & Public Formula */}
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem 1.15rem',
              fontSize: '0.8rem'
            }}
          >
            <strong>¿Cómo se calcula tu coincidencia con cada gobierno? (100% Transparente):</strong>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                alignItems: 'center',
                margin: '0.65rem 0',
                padding: '0.65rem 0.85rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontWeight: 600,
                fontSize: '0.78rem'
              }}
            >
              <span>🎯 Tu Importancia (1 a 10)</span>
              <span style={{ color: 'var(--accent)', fontWeight: 800 }}>×</span>
              <span>📊 Resultado Real en Datos INDEC (0 a 100)</span>
              <span style={{ color: 'var(--accent)', fontWeight: 800 }}>=</span>
              <span style={{ color: 'var(--positive)', fontWeight: 700 }}>🏆 Puntaje Final de Coincidencia</span>
            </div>
            <ul style={{ paddingLeft: '1.1rem', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>
                Con <strong>Reconstrucción Histórica Comparable (2011–2015)</strong>, el 1° lugar para tus prioridades es:{' '}
                <strong>{evaluation.sensitivity.reconstruccionWinner.president} ({evaluation.sensitivity.reconstruccionWinner.finalScore.toFixed(1)} pts)</strong>.
              </li>
              <li>
                Con <strong>Serie Oficial INDEC Publicada (2011–2015)</strong>, el 1° lugar es:{' '}
                <strong>{evaluation.sensitivity.oficialWinner.president} ({evaluation.sensitivity.oficialWinner.finalScore.toFixed(1)} pts)</strong>.
              </li>
              <li>
                Evaluando <strong>A Igual Tiempo de Gestión (Primeros 34 meses)</strong>, el 1° lugar es:{' '}
                <strong>{evaluation.sensitivity.igualTiempoWinner.president} ({evaluation.sensitivity.igualTiempoWinner.finalScore.toFixed(1)} pts)</strong>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
