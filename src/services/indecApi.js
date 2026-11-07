/**
 * Conector Híbrido API-INDEC v1 (https://api.indec.gob.ar/v1)
 * y API Series de Tiempo (https://apis.datos.gob.ar/series/api)
 */

const INDEC_V1_BASE = 'https://api.indec.gob.ar/v1';
const DATOS_GOB_SERIES_BASE = 'https://apis.datos.gob.ar/series/api/series';

/**
 * Consulta un endpoint del nuevo Catálogo API-INDEC v1 (PostgREST)
 * @param {string} resource - ej: 'ipc_nacional', 'pobreza_eph', 'ipi_manufacturero'
 * @param {string} jwtToken - Bearer JWT token obtenido en https://api.indec.gob.ar
 * @param {Object} params - Parámetros PostgREST (limit, offset, order, select, filtros)
 */
export async function fetchIndecCatalogV1(resource, jwtToken, params = {}) {
  const cleanResource = resource.replace(/^\/v1\//, '').replace(/^\//, '');
  const searchParams = new URLSearchParams();

  if (params.select) searchParams.set('select', params.select);
  if (params.order) searchParams.set('order', params.order);
  searchParams.set('limit', String(params.limit || 25));
  searchParams.set('offset', String(params.offset || 0));

  if (params.filters && typeof params.filters === 'object') {
    Object.entries(params.filters).forEach(([col, expr]) => {
      if (expr) searchParams.set(col, expr);
    });
  }

  const url = `${INDEC_V1_BASE}/${cleanResource}?${searchParams.toString()}`;
  const headers = {
    Accept: 'application/json',
    Prefer: 'count=exact'
  };

  if (jwtToken && jwtToken.trim()) {
    headers.Authorization = `Bearer ${jwtToken.trim()}`;
  }

  const response = await fetch(url, { headers });
  const contentRange = response.headers.get('Content-Range');

  if (!response.ok) {
    let errDetail = `HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      errDetail = errJson.message || errJson.hint || errDetail;
    } catch {
      // ignore parse error
    }
    throw new Error(errDetail);
  }

  const data = await response.json();
  return {
    url,
    status: response.status,
    contentRange,
    count: Array.isArray(data) ? data.length : 0,
    rows: data
  };
}

/**
 * Consulta la API pública de Series de Tiempo de Datos Argentina (sin token)
 * para validar conectividad en vivo con series oficiales del INDEC.
 */
export async function fetchPublicSeriesTime(ids = ['143.3_NO_PR_2004_A_21', '148.3_INIVELNAL_DICI_M_26'], limit = 24) {
  const url = `${DATOS_GOB_SERIES_BASE}/?ids=${ids.join(',')}&limit=${limit}&sort=desc&format=json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al conectar con apis.datos.gob.ar`);
  }
  const json = await response.json();
  return {
    url,
    updatedAt: new Date().toISOString(),
    data: json.data || [],
    meta: json.meta || []
  };
}

/**
 * Genera el snippet de consulta real para copiar y usar con el Catálogo API-INDEC v1
 */
export function buildIndecCurlSnippet(endpoint, tokenPlaceholder = 'TU_TOKEN_JWT_INDEC') {
  const clean = endpoint.replace(/^\/v1\//, '').replace(/^\//, '');
  return `curl -X GET "${INDEC_V1_BASE}/${clean}?limit=100&offset=0" \\
  -H "Authorization: Bearer ${tokenPlaceholder}" \\
  -H "Prefer: count=exact"`;
}
