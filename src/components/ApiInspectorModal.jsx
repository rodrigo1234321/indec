import React, { useState } from 'react';
import { INDEC_ENDPOINTS_CATALOG } from '../data/indecData';
import {
  buildIndecCurlSnippet,
  fetchIndecCatalogV1,
  fetchPublicSeriesTime
} from '../services/indecApi';

export default function ApiInspectorModal({ isOpen, onClose, jwtToken, setJwtToken }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(INDEC_ENDPOINTS_CATALOG[0].endpoint);
  const [liveStatus, setLiveStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTestIndecV1 = async () => {
    setLoading(true);
    setLiveStatus(null);
    try {
      const res = await fetchIndecCatalogV1(selectedEndpoint, jwtToken, { limit: 5 });
      setLiveStatus({
        ok: true,
        source: `Catálogo API-INDEC (${res.url})`,
        summary: `Estado HTTP ${res.status} · Filas recibidas: ${res.count} · Rango: ${res.contentRange || 'N/A'}`,
        sample: res.rows.slice(0, 3)
      });
    } catch (err) {
      setLiveStatus({
        ok: false,
        source: `https://api.indec.gob.ar${selectedEndpoint}`,
        summary: `Aviso (${err.message}): Recordá que api.indec.gob.ar/v1 requiere un token JWT activo en Authorization: Bearer <token>. Mientras tanto, la web utiliza la base verificada + API abierta de Series de Tiempo.`,
        sample: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestPublicSeries = async () => {
    setLoading(true);
    setLiveStatus(null);
    try {
      const res = await fetchPublicSeriesTime(['143.3_NO_PR_2004_A_21'], 6);
      setLiveStatus({
        ok: true,
        source: 'API Series de Tiempo (apis.datos.gob.ar - Sin Token)',
        summary: `Conexión exitosa (${res.data.length} períodos recientes del EMAE INDEC recibidos)`,
        sample: res.data
      });
    } catch (err) {
      setLiveStatus({
        ok: false,
        source: 'apis.datos.gob.ar',
        summary: `Modo sin conexión externa activa (${err.message}). Sirviendo dataset INDEC verificado local.`,
        sample: null
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-kicker">Arquitectura Híbrida de Datos Oficiales</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
              Conector Catálogo API-INDEC v1 & Series de Tiempo
            </h3>
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            Cerrar ✕
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          Esta plataforma implementa el <strong>Modo Híbrido Recomendado</strong>: incluye la serie histórica 2011–2026 pre-verificada y empalmada (para que cualquier ciudadano navegue al instante sin necesidad de token) y permite conectarse en vivo tanto a la API pública de Series de Tiempo (<code>apis.datos.gob.ar</code>) como al nuevo Catálogo PostgREST del INDEC (<code>https://api.indec.gob.ar/v1</code>).
        </p>

        {/* JWT Token input for api.indec.gob.ar/v1 */}
        <div style={{ marginTop: '1rem' }}>
          <label
            htmlFor="indec-jwt-input"
            style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block' }}
          >
            Token JWT Opcional para consultas directas a <code>https://api.indec.gob.ar/v1</code>:
          </label>
          <div className="token-input-row">
            <input
              id="indec-jwt-input"
              type="password"
              className="token-input"
              placeholder="Pegá aquí tu Bearer Token JWT de api.indec.gob.ar (opcional)..."
              value={jwtToken}
              onChange={(e) => setJwtToken(e.target.value)}
            />
            <button
              type="button"
              className="action-primary-btn"
              onClick={handleTestIndecV1}
              disabled={loading}
            >
              {loading ? 'Consultando...' : 'Probar API-INDEC v1'}
            </button>
            <button
              type="button"
              className="close-modal-btn"
              onClick={handleTestPublicSeries}
              disabled={loading}
            >
              Probar Series Abiertas
            </button>
          </div>
        </div>

        {/* Endpoint selector and cURL snippet */}
        <div style={{ marginBottom: '1.1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.45rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Seleccioná un endpoint oficial para ver su esquema y consulta PostgREST:
            </span>
            <select
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              style={{
                padding: '0.35rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid var(--border-strong)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem'
              }}
            >
              {INDEC_ENDPOINTS_CATALOG.map((ep) => (
                <option key={ep.id} value={ep.endpoint}>
                  {ep.endpoint} — {ep.name}
                </option>
              ))}
            </select>
          </div>

          <pre className="code-pre">
            {buildIndecCurlSnippet(selectedEndpoint, jwtToken ? '***TOKEN_ACTIVO***' : 'TU_TOKEN_JWT')}
          </pre>
        </div>

        {liveStatus && (
          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.15rem',
              background: liveStatus.ok ? 'var(--positive-bg)' : 'var(--warning-bg)',
              border: `1px solid ${liveStatus.ok ? 'var(--positive)' : 'var(--warning)'}`,
              fontSize: '0.82rem'
            }}
          >
            <strong>{liveStatus.source}</strong>
            <p style={{ marginTop: '0.25rem' }}>{liveStatus.summary}</p>
            {liveStatus.sample && (
              <pre className="code-pre" style={{ marginTop: '0.5rem', maxHeight: '140px' }}>
                {JSON.stringify(liveStatus.sample, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Catalog Table */}
        <div className="comparison-table-wrapper" style={{ marginTop: '0.5rem' }}>
          <table className="comparison-table" style={{ minWidth: '640px' }}>
            <thead>
              <tr>
                <th>Endpoint API-INDEC v1</th>
                <th>Dirección / Indicador</th>
                <th>Cobertura y Clave Primaria</th>
              </tr>
            </thead>
            <tbody>
              {INDEC_ENDPOINTS_CATALOG.map((item) => (
                <tr key={item.id}>
                  <td className="mono-cell" style={{ color: 'var(--accent)' }}>
                    {item.endpoint}
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {item.area}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.76rem' }}>
                    <div>{item.coverage}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      PK: {item.primaryKeys}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
