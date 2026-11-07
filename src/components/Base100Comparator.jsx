import React, { useState } from 'react';
import { BASE100_TRAJECTORIES, GOVERNMENTS } from '../data/indecData';

export default function Base100Comparator() {
  const indicatorKeys = Object.keys(BASE100_TRAJECTORIES.indicators);
  const [selectedIndicatorKey, setSelectedIndicatorKey] = useState(indicatorKeys[0]);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(6); // M34/M36 por defecto para comparar los 4 mandatos

  const currentIndicator = BASE100_TRAJECTORIES.indicators[selectedIndicatorKey];
  const months = BASE100_TRAJECTORIES.months;

  const allValues = Object.values(currentIndicator.series)
    .flat()
    .filter((v) => v !== null && v !== undefined);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const padding = (maxVal - minVal) * 0.15 || 5;
  const yMin = minVal - padding;
  const yMax = maxVal + padding;

  const width = 820;
  const height = 300;
  const padLeft = 56;
  const padRight = 28;
  const padTop = 24;
  const padBottom = 38;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const getX = (idx) => padLeft + (idx / (months.length - 1)) * plotW;
  const getY = (val) => padTop + plotH - ((val - yMin) / (yMax - yMin)) * plotH;

  const baselineVal = selectedIndicatorKey === 'pobrezaVariacion' ? 0 : 100;
  const showBaseline =
    baselineVal >= yMin &&
    baselineVal <= yMax &&
    selectedIndicatorKey !== 'inflacionMensual';

  return (
    <section className="section-block" id="comparador-base100">
      <div className="section-header">
        <div>
          <p className="section-kicker">04 · Trayectorias Comparadas por Avance del Mandato</p>
          <h2 className="section-title">
            Comparación a Igual Tiempo de Gestión (Inicio = Base 100)
          </h2>
          <p className="section-subtitle">
            Contrasta los primeros 6, 12, 24 y 34/36 meses de cada presidente sin penalizar ni beneficiar a un gobierno por tener el mandato en curso, documentando la frecuencia real de cada serie.
          </p>
        </div>
      </div>

      <div className="base100-controls">
        {[
          { key: 'salarioReal', label: 'Salario Real (Mensual · Base 100)' },
          { key: 'actividadEmae', label: 'Actividad EMAE (Mensual · Base 100)' },
          { key: 'inflacionMensual', label: 'Inflación Mensual (%)' },
          { key: 'pobrezaVariacion', label: 'Variación de Pobreza EPH (Semestral · pp)' }
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            className={`indicator-pill-btn ${selectedIndicatorKey === item.key ? 'active' : ''}`}
            onClick={() => setSelectedIndicatorKey(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="base100-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '0.85rem'
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem' }}>
              {currentIndicator.title}
            </h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              {currentIndicator.description}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.2rem', fontWeight: 600 }}>
              Periodicidad y criterio técnico: {currentIndicator.frequencyNote}
            </p>
          </div>
          <span className="endpoint-pill">{currentIndicator.unit}</span>
        </div>

        <div className="chart-legend-row">
          {GOVERNMENTS.map((g) => (
            <div key={g.id} className="legend-item">
              <span className="legend-swatch" style={{ backgroundColor: g.color }} />
              <span>
                {g.order}° {g.president} ({g.yearsLabel})
              </span>
            </div>
          ))}
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: 'auto', minWidth: '580px', display: 'block' }}
            role="img"
            aria-label={currentIndicator.title}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const val = yMin + t * (yMax - yMin);
              const y = getY(val);
              return (
                <g key={t}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="#ded8c8"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                    fill="#64748b"
                  >
                    {val.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {showBaseline && (
              <line
                x1={padLeft}
                y1={getY(baselineVal)}
                x2={width - padRight}
                y2={getY(baselineVal)}
                stroke="#1e293b"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
            )}

            <line
              x1={getX(selectedMonthIdx)}
              y1={padTop}
              x2={getX(selectedMonthIdx)}
              y2={height - padBottom}
              stroke="#0f172a"
              strokeWidth="1.5"
            />

            {GOVERNMENTS.map((gov) => {
              const pts = currentIndicator.series[gov.id] || [];
              const validPoints = pts
                .map((v, idx) =>
                  v !== null && v !== undefined
                    ? { x: getX(idx), y: getY(v), v, idx }
                    : null
                )
                .filter(Boolean);

              const pathD = validPoints
                .map(
                  (pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`
                )
                .join(' ');

              return (
                <g key={gov.id}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={gov.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {validPoints.map((pt) => (
                    <circle
                      key={pt.idx}
                      cx={pt.x}
                      cy={pt.y}
                      r={pt.idx === selectedMonthIdx ? 6 : 4}
                      fill={gov.color}
                      stroke="#ffffff"
                      strokeWidth="1.8"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedMonthIdx(pt.idx)}
                    />
                  ))}
                </g>
              );
            })}

            {months.map((mLabel, idx) => (
              <text
                key={mLabel}
                x={getX(idx)}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
                fontWeight={idx === selectedMonthIdx ? '700' : '500'}
                fill={idx === selectedMonthIdx ? '#0f172a' : '#64748b'}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedMonthIdx(idx)}
              >
                {mLabel.split(' ')[0]}
              </text>
            ))}
          </svg>
        </div>

        <div
          style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
              Tramo seleccionado para comparación simultánea:
            </span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {months.map((mLabel, idx) => (
                <button
                  key={mLabel}
                  type="button"
                  className={`preset-btn ${selectedMonthIdx === idx ? 'active' : ''}`}
                  onClick={() => setSelectedMonthIdx(idx)}
                >
                  {mLabel}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '0.75rem'
            }}
          >
            {GOVERNMENTS.map((gov) => {
              const val = currentIndicator.series[gov.id][selectedMonthIdx];
              return (
                <div
                  key={gov.id}
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-page)',
                    borderLeft: `4px solid ${gov.color}`
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {gov.order}° {gov.president} · {months[selectedMonthIdx]}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.08rem',
                      fontWeight: 700,
                      marginTop: '0.15rem'
                    }}
                  >
                    {val !== null && val !== undefined
                      ? `${val.toFixed(1).replace('.', ',')} (${currentIndicator.unit})`
                      : 'Mandato en curso (aún no alcanzó este mes)'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
