/**
 * Script de Sincronización en Servidor (Node.js) con Catálogo API-INDEC v1
 * Lee INDEC_JWT_TOKEN desde .env (jamás se expone en el cliente navegador)
 * y genera src/data/indecRealApiSnapshot.json con series reales verificadas,
 * fechas de corte, unidades y metadatos completos.
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
    throw new Error(`HTTP ${res.status} on ${url}`);
  }
  const contentRange = res.headers.get('content-range');
  const data = await res.json();
  return { url, contentRange, data };
}

async function main() {
  console.log('Sincronizando datos oficiales desde https://api.indec.gob.ar/v1 ...');

  // 1. Pobreza e Indigencia EPH (Total 31 Aglomerados: T_31_A)
  const pobrezaRes = await queryIndec(
    '/pobreza_eph?area_geografica_nom=eq.T_31_A&order=anio.asc,semestre.asc&limit=100'
  );

  // 2. Mercado de Trabajo EPH (Total 31 Aglomerados: T_31_A)
  const trabajoRes = await queryIndec(
    '/mercado_trabajo_eph?area_geografica_nom=eq.T_31_A&order=anio.asc,trimestre.asc&limit=100'
  );

  // 3. EMAE Nivel General (últimos registros e hitos desde 2011)
  const emaeRes = await queryIndec(
    '/estimador-mensual-de-actividad-economica-nivel-general?anio=gte.2011&order=periodo.desc&limit=300'
  );

  // 4. Canasta Crianza (últimos registros disponibles)
  const crianzaRes = await queryIndec(
    '/canasta-crianza?order=Periodo.desc&limit=24'
  );

  // 5. Valorización Canastas CBA y CBT
  const canastasRes = await queryIndec(
    '/valorizacion_canastas_cba_cbt?order=periodo.desc&limit=36'
  );

  // 6. IPC Nacional (Nivel General Nacional variación mensual e interanual reciente)
  const ipcRes = await queryIndec(
    '/ipc_nacional?region=eq.Nacional&codigo=eq.00&order=periodo.desc&limit=60'
  );

  // 7. Índice de Salarios
  const salariosRes = await queryIndec(
    '/indice_salarios?order=periodo.desc&limit=60'
  );

  const snapshot = {
    syncedAt: new Date().toISOString(),
    sourceServer: BASE_URL,
    authenticationMode: 'Server-side JWT (.env protegido, no expuesto en cliente)',
    endpointsSynced: {
      pobreza_eph: {
        totalRows: pobrezaRes.data.length,
        contentRange: pobrezaRes.contentRange,
        series: pobrezaRes.data
      },
      mercado_trabajo_eph: {
        totalRows: trabajoRes.data.length,
        contentRange: trabajoRes.contentRange,
        series: trabajoRes.data
      },
      canasta_crianza: {
        totalRows: crianzaRes.data.length,
        contentRange: crianzaRes.contentRange,
        latest: crianzaRes.data.slice(0, 12)
      },
      valorizacion_canastas_cba_cbt: {
        totalRows: canastasRes.data.length,
        contentRange: canastasRes.contentRange,
        latest: canastasRes.data.slice(0, 12)
      },
      ipc_nacional: {
        totalRows: ipcRes.data.length,
        contentRange: ipcRes.contentRange,
        latest: ipcRes.data.slice(0, 24)
      },
      emae_nivel_general: {
        totalRows: emaeRes.data.length,
        contentRange: emaeRes.contentRange,
        latest: emaeRes.data.slice(0, 24)
      },
      indice_salarios: {
        totalRows: salariosRes.data.length,
        contentRange: salariosRes.contentRange,
        latest: salariosRes.data.slice(0, 24)
      }
    }
  };

  const outPath = path.resolve(process.cwd(), 'src/data/indecRealApiSnapshot.json');
  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2), 'utf8');
  console.log(`Snapshot guardado en ${outPath}`);
  console.log(
    `Resumen: Pobreza EPH (${pobrezaRes.data.length} semestres), Mercado Trabajo EPH (${trabajoRes.data.length} trimestres), IPC Nacional (${ipcRes.data.length} registros)`
  );
}

main().catch((err) => {
  console.error('Error en sincronización:', err);
  process.exit(1);
});
