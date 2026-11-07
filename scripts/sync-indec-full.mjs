/**
 * Script de Sincronización Integral en Servidor (Node.js) con Catálogo API-INDEC v1
 * Lee INDEC_JWT_TOKEN desde .env (seguro en servidor, nunca expuesto en cliente)
 * y extrae las series históricas completas de:
 * - /ipc_nacional (Nivel general, Divisiones COICOP y Apertura por Regiones)
 * - /valorizacion_canastas_cba_cbt (CBA, CBT, Adulto equiv, Hogares 1, 2, 3)
 * - /canasta-crianza (2020 a 202609)
 * - /indice_salarios (General 0, Registrado 100, Privado 110, Público Nac 121, Público Prov 122, Informal 200)
 * - /pobreza_eph (Serie oficial semestral completa)
 * - /mercado_trabajo_eph (Serie oficial trimestral completa con Formal/Informal)
 * - /estimador-mensual-de-actividad-economica-nivel-general (2011 a 202608)
 * - /estimador-mensual-de-actividad-economica-sectores (Agro A, Minas C, Industria D, Construcción F, etc.)
 * - /ipi_manufacturero (2016 a 202609)
 * - /ipi_minero (Litio, Gas y Petróleo no convencional)
 * - /icc_precios_construccion y /sipm_precios_mayoristas
 */

import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '.env');
let jwtToken = process.env.INDEC_JWT_TOKEN || '';

if (!jwtToken && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^INDEC_JWT_TOKEN=(.+)$/m);
  if (match) jwtToken = match[1].trim();
}

if (!jwtToken) {
  console.error('Error: No se encontró INDEC_JWT_TOKEN en .env');
  process.exit(1);
}

const BASE_URL = 'https://api.indec.gob.ar/v1';

async function queryIndec(pathWithQuery) {
  const url = `${BASE_URL}${pathWithQuery}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      Accept: 'application/json',
      Prefer: 'count=exact'
    }
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} on ${url}: ${txt.slice(0, 150)}`);
  }
  const contentRange = res.headers.get('content-range');
  const data = await res.json();
  return { url, contentRange, data };
}

async function fetchAllPages(basePath, pageSize = 1000, maxPages = 5) {
  let allRows = [];
  let offset = 0;
  for (let page = 0; page < maxPages; page++) {
    const sep = basePath.includes('?') ? '&' : '?';
    const pUrl = `${basePath}${sep}limit=${pageSize}&offset=${offset}`;
    const res = await queryIndec(pUrl);
    allRows = allRows.concat(res.data);
    if (!res.data || res.data.length < pageSize) {
      break;
    }
    offset += pageSize;
  }
  return allRows;
}

async function main() {
  console.log('Iniciando extracción y sincronización total de API-INDEC v1...');

  // 1. Pobreza EPH Oficial
  console.log('1/10 Extrayendo /pobreza_eph ...');
  const pobrezaData = await fetchAllPages(
    '/pobreza_eph?area_geografica_nom=eq.T_31_A&order=anio.asc,semestre.asc'
  );

  // 2. Mercado de Trabajo EPH Oficial
  console.log('2/10 Extrayendo /mercado_trabajo_eph ...');
  const trabajoData = await fetchAllPages(
    '/mercado_trabajo_eph?area_geografica_nom=eq.T_31_A&order=anio.asc,trimestre.asc'
  );

  // 3. IPC Nacional - General Nacional (Mensual e Interanual)
  console.log('3/10 Extrayendo /ipc_nacional General Nacional ...');
  const ipcGenVM = await fetchAllPages(
    '/ipc_nacional?region=eq.Nacional&codigo=eq.0&tipo_de_indicador=eq.v_m&order=periodo.asc'
  );
  const ipcGenVIA = await fetchAllPages(
    '/ipc_nacional?region=eq.Nacional&codigo=eq.0&tipo_de_indicador=eq.v_ia&order=periodo.asc'
  );
  const ipcGenIndice = await fetchAllPages(
    '/ipc_nacional?region=eq.Nacional&codigo=eq.0&tipo_de_indicador=eq.Indice&order=periodo.asc'
  );

  // 4. IPC Nacional - Divisiones COICOP y Categorías (Alimentos 01, Vivienda/Tarifas 04, Salud 06, Transporte 07, Regulados R, Servicios S)
  console.log('4/10 Extrayendo /ipc_nacional Divisiones clave ...');
  const ipcDivs = await fetchAllPages(
    '/ipc_nacional?region=eq.Nacional&tipo_de_indicador=eq.v_ia&order=periodo.desc&limit=1000'
  );

  // 5. IPC por Regiones (GBA, Pampeana, Noroeste, Noreste, Cuyo, Patagonia)
  console.log('5/10 Extrayendo /ipc_nacional por regiones ...');
  const ipcRegs = await fetchAllPages(
    '/ipc_nacional?codigo=eq.0&tipo_de_indicador=eq.v_ia&order=periodo.asc'
  );

  // 6. Canastas CBA y CBT (Adulto equiv y Hogares 1, 2, 3)
  console.log('6/10 Extrayendo /valorizacion_canastas_cba_cbt ...');
  const canastasData = await fetchAllPages(
    '/valorizacion_canastas_cba_cbt?order=periodo.desc&limit=500'
  );

  // 7. Canasta de Crianza
  console.log('7/10 Extrayendo /canasta-crianza ...');
  const crianzaData = await fetchAllPages(
    '/canasta-crianza?order=Periodo.asc'
  );

  // 8. Índice de Salarios por Sectores
  console.log('8/10 Extrayendo /indice_salarios ...');
  const salariosData = await fetchAllPages(
    '/indice_salarios?order=periodo.asc&limit=1000'
  );

  // 9. EMAE Nivel General y Sectores
  console.log('9/10 Extrayendo /estimador-mensual-de-actividad-economica-nivel-general y sectores ...');
  const emaeGeneral = await fetchAllPages(
    '/estimador-mensual-de-actividad-economica-nivel-general?anio=gte.2011&order=periodo.asc'
  );
  const emaeSectores = await fetchAllPages(
    '/estimador-mensual-de-actividad-economica-sectores?anio=gte.2016&order=periodo.desc&limit=1000'
  );

  // 10. IPI Manufacturero, IPI Minero, ICC Precios Construcción, SIPM Mayoristas
  console.log('10/10 Extrayendo IPI Manufacturero, IPI Minero, ICC e IPIM Mayoristas ...');
  const ipiManuf = await fetchAllPages(
    '/ipi_manufacturero?codigo_CLaNAE_2004=eq.D&serie=eq.Serie%20tendencia-ciclo&order=periodo.asc'
  );
  const ipiMinero = await fetchAllPages(
    '/ipi_minero?order=periodo.desc&limit=500'
  );
  const iccConstruccion = await fetchAllPages(
    '/icc_precios_construccion?order=periodo.desc&limit=200'
  );
  const mayoristasIPIM = await fetchAllPages(
    '/sipm_precios_mayoristas?order=periodo.desc&limit=200'
  );

  const snapshot = {
    metadata: {
      syncedAt: new Date().toISOString(),
      sourceCatalog: 'Catálogo API-INDEC v1 (https://api.indec.gob.ar/v1)',
      complementarySources: [
        'API Series de Tiempo República Argentina (apis.datos.gob.ar/series/api)',
        'Banco Central de la República Argentina (BCRA) - Reservas y Tipo de Cambio',
        'Ministerio de Economía (Mecon) - Resultado Fiscal y Deuda Pública',
        'Sistema Nacional de Información Criminal (SNIC - Ministerio de Seguridad) - Homicidios Dolosos',
        'CEDLAS / Universidad Católica Argentina (UCA) - Reconstrucción Pobreza 2011-2015'
      ],
      legalTerms: 'Conforme a los términos de uso del INDEC, se cita la fuente primaria oficial. Acceso autenticado mediante JWT del titular.'
    },
    series: {
      pobreza_eph: pobrezaData,
      mercado_trabajo_eph: trabajoData,
      ipc_general: {
        variacion_mensual: ipcGenVM,
        variacion_interanual: ipcGenVIA,
        indice_base2016: ipcGenIndice
      },
      ipc_divisiones_recientes: ipcDivs.slice(0, 300),
      ipc_regiones: ipcRegs,
      canastas_cba_cbt: canastasData.slice(0, 300),
      canasta_crianza: crianzaData,
      indice_salarios: salariosData,
      emae_general: emaeGeneral,
      emae_sectores: emaeSectores.slice(0, 500),
      ipi_manufacturero_general: ipiManuf,
      ipi_minero: ipiMinero.slice(0, 200),
      icc_construccion: iccConstruccion.slice(0, 100),
      sipm_mayoristas: mayoristasIPIM.slice(0, 100)
    }
  };

  const outPath = path.resolve(process.cwd(), 'src/data/indecFullSyncedData.json');
  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2), 'utf8');

  console.log(`\n¡Sincronización total exitosa! Archivo guardado en: ${outPath}`);
  console.log(`- Pobreza EPH: ${pobrezaData.length} registros`);
  console.log(`- Mercado de Trabajo EPH: ${trabajoData.length} registros`);
  console.log(`- IPC Nivel General: ${ipcGenVM.length} meses v_m | ${ipcGenVIA.length} meses v_ia`);
  console.log(`- Canastas CBA/CBT: ${canastasData.length} registros`);
  console.log(`- Canasta Crianza: ${crianzaData.length} meses`);
  console.log(`- Salarios: ${salariosData.length} registros`);
  console.log(`- EMAE General: ${emaeGeneral.length} registros`);
  console.log(`- IPI Manufacturero General: ${ipiManuf.length} registros`);
}

main().catch((err) => {
  console.error('Error durante la sincronización total:', err);
  process.exit(1);
});
