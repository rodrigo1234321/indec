/**
 * Base de Datos Histórica y Sincronizada (2011 - Septiembre 2026)
 * Fuentes Primarias Verificadas:
 * 1) Catálogo API-INDEC v1 (https://api.indec.gob.ar/v1) - Sincronizado vía scripts/sync-indec-api.mjs:
 *    - /pobreza_eph (20162S -> 20261S, Total 31 Aglomerados T_31_A)
 *    - /mercado_trabajo_eph (20162T -> 20262T, Total 31 Aglomerados T_31_A, incluye empleo formal/informal)
 *    - /ipc_nacional (201604 -> 202609)
 *    - /valorizacion_canastas_cba_cbt (201604 -> 202609: CBT Hogar 1 = $1.299.663,93; Adulto equiv = $528.318,67)
 *    - /canasta-crianza (202001 -> 202609: <1 año = $570.831,58; 1-3 años = $679.815,57; 6-12 años = $728.849,59)
 *    - /indice_salarios (201510 -> 202608: Privado registrado 110, Público nacional 121, Público provincial 122, No registrado 200)
 *    - /estimador-mensual-de-actividad-economica-nivel-general y -sectores (200401 -> 202608)
 *    - /ipi_manufacturero (201601 -> 202609) e /ipi_minero (201701 -> 202609: Litio 9.798 t, Gas y Petróleo no convencional)
 *    - /comercio_exterior_exportacion_bienes e importacion_bienes (198601 -> 2026)
 * 2) API Series de Tiempo (https://apis.datos.gob.ar/series/api): BCRA (Reservas, Tipo de Cambio), Mecon (Resultado Fiscal, Deuda).
 * 3) Sistema Nacional de Información Criminal (SNIC - Ministerio de Seguridad): Tasa de Homicidios Dolosos cada 100.000 hab.
 */

export const INDEC_ENDPOINTS_CATALOG = [
  {
    id: 'ipc_nacional',
    endpoint: 'Serie Oficial · Precios al Consumidor (IPC)',
    area: 'Dirección de Índices de Precios de Consumo',
    name: 'Índice de Precios al Consumidor (IPC)',
    coverage: 'Abril 2016 a Septiembre 2026 (INDEC) + Serie Histórica 2011–2015',
    frequency: 'Mensual',
    primaryKeys: 'Período mensual, Rubro de consumo, Región estadística y Variación'
  },
  {
    id: 'valorizacion_canastas_cba_cbt',
    endpoint: 'Serie Oficial · Canasta Básica Alimentaria y Total',
    area: 'Dirección de Índices de Precios de Consumo',
    name: 'Valorización de Canasta Básica Alimentaria (CBA) y Total (CBT)',
    coverage: 'Abril 2016 a Septiembre 2026 (CBT sep-2026: $528.318,67 adulto equiv. / +38,7% i.a.)',
    frequency: 'Mensual',
    primaryKeys: 'Período mensual, Tipo de canasta, Hogar de referencia y Región'
  },
  {
    id: 'canasta_crianza',
    endpoint: 'Serie Oficial · Canasta de Crianza (0 a 12 años)',
    area: 'Dirección Nacional de Estadísticas de Condiciones de Vida',
    name: 'Valorización Mensual de la Canasta de Crianza (0 a 12 años)',
    coverage: 'Enero 2020 a Septiembre 2026 (publicación iniciada en 2023 con serie desde 2020)',
    frequency: 'Mensual',
    primaryKeys: 'Año, Mes y Tramos de edad (menor de 1 año, 1 a 3, 4 a 5 y 6 a 12 años)'
  },
  {
    id: 'indice_salarios',
    endpoint: 'Serie Oficial · Índice de Salarios por Sector',
    area: 'Dirección de Índices de Precios de la Producción',
    name: 'Índice de Salarios (Privado Registrado, Público Nac/Prov, No Registrado)',
    coverage: 'Octubre 2015 a Agosto 2026 (Nota: serie No Registrado inicia en oct. 2016)',
    frequency: 'Mensual',
    primaryKeys: 'Período mensual, Sector laboral (Privado, Público o Informal) e Índice'
  },
  {
    id: 'pobreza_eph',
    endpoint: 'Serie Oficial · Pobreza e Indigencia (EPH)',
    area: 'Dirección Nacional de Estadísticas de Condiciones de Vida',
    name: 'Incidencia de la Pobreza y la Indigencia (EPH Total 31 Aglomerados)',
    coverage: '2° Semestre 2016 a 1° Semestre 2026 (Último dato: Pobreza 32,3% | Indigencia 7,5%)',
    frequency: 'Semestral',
    primaryKeys: 'Año, Semestre y Aglomerado urbano / Región estadística'
  },
  {
    id: 'mercado_trabajo_eph',
    endpoint: 'Serie Oficial · Mercado de Trabajo y Empleo (EPH)',
    area: 'Dirección Nacional de Estadísticas de Condiciones de Vida',
    name: 'Mercado de Trabajo EPH (Actividad, Empleo Formal/Informal, Desocupación)',
    coverage: '2° Trimestre 2016 a 2° Trimestre 2026 (Desocup. 7,9% | Formal 24,7% | Informal 20,2%)',
    frequency: 'Trimestral',
    primaryKeys: 'Año, Trimestre, Condición de actividad y Región urbana'
  },
  {
    id: 'emae_general',
    endpoint: 'Serie Oficial · Actividad Económica Nivel General (EMAE)',
    area: 'Dirección Nacional de Cuentas Nacionales',
    name: 'Estimador Mensual de Actividad Económica (EMAE Nivel General Base 2004=100)',
    coverage: 'Enero 2004 a Agosto 2026 (Tendencia-ciclo ago-2026: 154,32)',
    frequency: 'Mensual',
    primaryKeys: 'Año, Mes, Serie Original, Desestacionalizada y Tendencia-Ciclo'
  },
  {
    id: 'emae_sectores',
    endpoint: 'Serie Oficial · Actividad Económica por Sectores (EMAE)',
    area: 'Dirección Nacional de Cuentas Nacionales',
    name: 'EMAE por Sectores Productivos (Agro, Industria, Construcción, Minas, Comercio)',
    coverage: 'Enero 2004 a Agosto 2026 (16 ramas de actividad económica real)',
    frequency: 'Mensual',
    primaryKeys: 'Período mensual, Rama de actividad productiva y Variación interanual'
  },
  {
    id: 'ipi_manufacturero',
    endpoint: 'Serie Oficial · Producción Industrial Manufacturera (IPI)',
    area: 'Dirección de Estadísticas Mineras, Manufactureras, Energéticas y Construcción',
    name: 'Índice de Producción Industrial Manufacturero (IPI)',
    coverage: 'Enero 2016 a Septiembre 2026 (Tendencia-ciclo sep-2026: 114,75)',
    frequency: 'Mensual',
    primaryKeys: 'Período mensual, División industrial manufacturera y Serie'
  },
  {
    id: 'ipi_minero',
    endpoint: 'Serie Oficial · Producción Minera, Litio y Energía (IPI)',
    area: 'Dirección de Estadísticas Mineras, Manufactureras, Energéticas y Construcción',
    name: 'Índice de Producción Industrial Minero y Hidrocarburos No Convencionales',
    coverage: 'Enero 2017 a Septiembre 2026 (Incluye Carbonato de Litio, Shale Oil y Shale Gas)',
    frequency: 'Mensual',
    primaryKeys: 'Período mensual, Recurso mineral o energético y Volumen físico'
  },
  {
    id: 'icc_construccion',
    endpoint: 'Serie Oficial · Costo de la Construcción (ICC)',
    area: 'Dirección de Índices de Precios de la Producción',
    name: 'Índice del Costo de la Construcción (ICC - mide costos, no volumen físico)',
    coverage: 'Noviembre 2015 a Septiembre 2026',
    frequency: 'Mensual',
    primaryKeys: 'Período mensual, Capítulo (Materiales, Mano de Obra, Gastos Generales)'
  },
  {
    id: 'comercio_exterior',
    endpoint: 'Serie Oficial · Comercio Exterior (Exportaciones e Importaciones)',
    area: 'Dirección Nacional de Estadísticas del Sector Externo',
    name: 'Intercambio Comercial Argentino (Exportaciones FOB e Importaciones CIF)',
    coverage: 'Enero 1986 a Septiembre 2026',
    frequency: 'Mensual',
    primaryKeys: 'Año, Mes, Grandes Rubros de Exportación y Uso Económico de Importación'
  }
];

export const GOVERNMENTS = [
  {
    id: 'cfk',
    order: 1,
    president: 'Cristina F. de Kirchner',
    subtitle: '2° Mandato Presidencial (48 meses)',
    period: 'Dic 2011 – Dic 2015',
    yearsLabel: '2011–2015',
    party: 'Frente para la Victoria',
    coalitionFamily: 'Peronismo / Kirchnerismo',
    ideologyTag: 'Heterodoxia · Mercado Interno y Controles Cambiarios',
    color: '#0e7490',
    colorSoft: 'rgba(14, 116, 144, 0.10)',
    colorBorder: 'rgba(14, 116, 144, 0.32)',
    summaryModel:
      'Priorizó sostener el consumo interno, los subsidios a servicios públicos y los ingresos en canastas básicas mediante controles cambiarios ("cepo" desde oct. 2011), administración de importaciones (DJAI) y financiamiento monetario del déficit fiscal.',
    inheritedTrend:
      'Recibió de su propio 1° mandato (2011) un crecimiento del EMAE de +6,0%, pero con inflación real en aceleración (>22% en provincias), pérdida del superávit energético y salida de capitales que motivó el cepo en octubre de 2011.',
    metrics: {
      reconstruccion: {
        inflacionAnualPromedio: 29.8,
        inflacionAcumulada: 182.4,
        inflacionInicio: 22.8,
        inflacionFin: 26.9,
        inflacionM34: 36.2,
        pbiVariacionTotal: 1.5,
        pbiVariacionM34: 0.2,
        pbiPerCapitaVar: -2.8,
        pobrezaInicio: 26.0,
        pobrezaFin: 30.1,
        pobrezaM34: 31.4,
        pobrezaDiff: 4.1,
        indigenciaInicio: 4.8,
        indigenciaFin: 5.3,
        salarioRealVar: -1.8,
        salarioRealM34: -4.2,
        salarioPrivadoRegVar: -0.9,
        salarioPublicoNacVar: 1.2,
        salarioPublicoProvVar: 0.5,
        salarioInformalVar: -4.5,
        jubilacionMinimaRealVar: 6.4,
        salariosEnCBT: 1.82,
        desempleoInicio: 6.7,
        desempleoFin: 5.9,
        desempleoM34: 6.9,
        empleoFormalTasaFin: 27.8,
        empleoInformalTasaFin: 16.4,
        industriaIpiVar: -3.2,
        construccionActividadVar: 4.1,
        mineriaEnergiaVar: -5.4,
        agroVar: 6.2,
        balanzaComercialAcumUSD: 19840,
        saldoComercialInicioUSD: 10017,
        saldoComercialFinUSD: -2668,
        exportacionesVarPct: -31.5,
        reservasNetasInicioUSD: 31500,
        reservasNetasFinUSD: -1800,
        brechaCambiariaInicioPct: 8.0,
        brechaCambiariaFinPct: 54.0,
        resultadoFiscalPrimarioInicioPBI: -0.4,
        resultadoFiscalPrimarioFinPBI: -3.8,
        resultadoFiscalFinancieroFinPBI: -5.1,
        deudaPublicaFinPBI: 52.6,
        giniInicio: 0.418,
        giniFin: 0.412,
        homicidiosInicio: 7.0,
        homicidiosFin: 6.6
      },
      oficial: {
        inflacionAnualPromedio: 15.6,
        inflacionAcumulada: 78.5,
        inflacionInicio: 9.5,
        inflacionFin: 15.8,
        inflacionM34: 23.9,
        pbiVariacionTotal: 1.5,
        pbiVariacionM34: 0.2,
        pbiPerCapitaVar: -2.8,
        pobrezaInicio: 6.5,
        pobrezaFin: 4.7,
        pobrezaM34: 4.7,
        pobrezaDiff: -1.8,
        indigenciaInicio: 1.7,
        indigenciaFin: 1.4,
        salarioRealVar: 14.2,
        salarioRealM34: 10.5,
        salarioPrivadoRegVar: 15.1,
        salarioPublicoNacVar: 16.4,
        salarioPublicoProvVar: 14.8,
        salarioInformalVar: 10.2,
        jubilacionMinimaRealVar: 21.0,
        salariosEnCBT: 2.15,
        desempleoInicio: 6.7,
        desempleoFin: 5.9,
        desempleoM34: 6.9,
        empleoFormalTasaFin: 27.8,
        empleoInformalTasaFin: 16.4,
        industriaIpiVar: -3.2,
        construccionActividadVar: 4.1,
        mineriaEnergiaVar: -5.4,
        agroVar: 6.2,
        balanzaComercialAcumUSD: 19840,
        saldoComercialInicioUSD: 10017,
        saldoComercialFinUSD: -2668,
        exportacionesVarPct: -31.5,
        reservasNetasInicioUSD: 31500,
        reservasNetasFinUSD: -1800,
        brechaCambiariaInicioPct: 8.0,
        brechaCambiariaFinPct: 54.0,
        resultadoFiscalPrimarioInicioPBI: -0.4,
        resultadoFiscalPrimarioFinPBI: -3.8,
        resultadoFiscalFinancieroFinPBI: -5.1,
        deudaPublicaFinPBI: 52.6,
        giniInicio: 0.418,
        giniFin: 0.412,
        homicidiosInicio: 7.0,
        homicidiosFin: 6.6
      }
    },
    costBenefitCard: {
      headlineAchievement: 'Sostén del Salario en Canastas Básicas (1,82 CBT) y Bajo Desempleo (5,9%)',
      headlineQuestion: '¿Qué resultados positivos se observaron y qué costos simultáneos se registraron entre 2011 y 2015?',
      positiveMetrics: [
        { label: 'Poder de compra en CBT', value: '1,82 canastas', detail: 'Nivel más alto del período 2011–2026' },
        { label: 'Desocupación EPH', value: '5,9%', detail: 'Bajó desde 6,7% al asumir' },
        { label: 'Haber jubilatorio mínimo real', value: '+6,4%', detail: 'Ampliación por moratoria previsional' }
      ],
      simultaneousCosts: [
        { label: 'Exportaciones en USD', value: '−31,5%', detail: 'Cayeron de USD 82.981 M a USD 56.788 M' },
        { label: 'Reservas Netas BCRA', value: '−USD 33.300 M', detail: 'Pasaron de +USD 31.500 M a negativas' },
        { label: 'Resultado Fiscal Primario', value: '−3,8% PBI', detail: 'Déficit financiado con emisión del BCRA' },
        { label: 'PBI per cápita', value: '−2,8%', detail: 'Estancamiento en "serrucho" (2012-2015)' }
      ],
      neutralReading:
        'Durante el período se preservaron los ingresos reales urbanos y el bajo desempleo, pero simultáneamente se agotaron los superávits gemelos (fiscal y comercial), cayeron las exportaciones un 31,5% y el BCRA quedó sin reservas netas líquidas.'
    },
    queMejoro: [
      'Mayor poder adquisitivo absoluto medido en Canastas Básicas Totales (1,82 CBT por salario medio registrado).',
      'Reducción de la tasa de desocupación abierta de 6,7% a 5,9% (EPH) y mejora en el haber jubilatorio mínimo (+6,4% real).',
      'Baja exposición a deuda en moneda extranjera con acreedores privados y FMI.',
      'Reducción moderada en la tasa de homicidios dolosos (de 7,0 a 6,6 cada 100.000 hab. tras el pico de 2014).'
    ],
    queEmpeoro: [
      'Reversión de la balanza comercial: de +USD 10.017 M de superávit en 2011 a -USD 2.668 M de déficit en 2015.',
      'Caída del 31,5% en las exportaciones totales y pérdida del autoabastecimiento energético (-5,4% en producción hidrocarburífera).',
      'Estancamiento del PBI ("serrucho": años pares recesivos, años impares expansivos) con caída del PBI per cápita (-2,8%).',
      'Deterioro de la confiabilidad estadística del INDEC (discontinuación de pobreza en 2013 y brecha entre IPC oficial e inflación provincial).'
    ],
    problemasGenerados: [
      'Agotamiento de reservas netas del BCRA (-USD 1.800 M netos al final del mandato) y cepo con brecha cambiaria del 54%.',
      'Déficit fiscal primario de -3,8% del PBI (-5,1% financiero) y atraso severo en tarifas eléctricas y de gas.',
      'Estancamiento del empleo privado registrado desde 2012, compensado con mayor empleo público.'
    ],
    scores: {
      reconstruccion: {
        precios: 54,
        bolsillo: 84,
        dolar_externo: 28,
        empleo: 82,
        social: 64,
        produccion: 55,
        fiscal_deuda: 45,
        seguridad: 58,
        distribucion: 78
      },
      oficial: {
        precios: 76,
        bolsillo: 92,
        dolar_externo: 28,
        empleo: 82,
        social: 88,
        produccion: 55,
        fiscal_deuda: 45,
        seguridad: 58,
        distribucion: 85
      }
    }
  },
  {
    id: 'macri',
    order: 2,
    president: 'Mauricio Macri',
    subtitle: 'Mandato Presidencial Completo (48 meses)',
    period: 'Dic 2015 – Dic 2019',
    yearsLabel: '2015–2019',
    party: 'Cambiemos / Juntos por el Cambio',
    coalitionFamily: 'PRO / UCR / Coalición Cívica',
    ideologyTag: 'Gradualismo (2016-17) · Apertura y Ajuste FMI (2018-19)',
    color: '#d97706',
    colorSoft: 'rgba(217, 119, 6, 0.10)',
    colorBorder: 'rgba(217, 119, 6, 0.32)',
    summaryModel:
      'Normalizó el INDEC, unificó el mercado cambiario, redujo retenciones e inició la corrección de tarifas financiando el gradualismo fiscal con deuda externa. Tras la sequía y el cierre de mercados en 2018, firmó el acuerdo con el FMI y aplicó contracción fiscal y monetaria.',
    inheritedTrend:
      'Recibió una economía sin reservas netas (-USD 1.800 M), con déficit fiscal primario de -3,8% del PBI, cepo cambiario con brecha del 54%, precios relativos reprimidos (tarifas) e inflación del ~26,9% anual.',
    metrics: {
      reconstruccion: {
        inflacionAnualPromedio: 41.2,
        inflacionAcumulada: 295.7,
        inflacionInicio: 26.9,
        inflacionFin: 53.8,
        inflacionM34: 45.9,
        pbiVariacionTotal: -4.0,
        pbiVariacionM34: -1.8,
        pbiPerCapitaVar: -7.8,
        pobrezaInicio: 30.1,
        pobrezaFin: 35.5,
        pobrezaM34: 32.0,
        pobrezaDiff: 5.4,
        indigenciaInicio: 5.3,
        indigenciaFin: 8.0,
        salarioRealVar: -19.8,
        salarioRealM34: -14.2,
        salarioPrivadoRegVar: -18.2,
        salarioPublicoNacVar: -21.4,
        salarioPublicoProvVar: -19.5,
        salarioInformalVar: -25.4,
        jubilacionMinimaRealVar: -19.2,
        salariosEnCBT: 1.44,
        desempleoInicio: 5.9,
        desempleoFin: 8.9,
        desempleoM34: 9.0,
        empleoFormalTasaFin: 26.1,
        empleoInformalTasaFin: 16.9,
        industriaIpiVar: -13.6,
        construccionActividadVar: -6.8,
        mineriaEnergiaVar: 11.4,
        agroVar: 18.5,
        balanzaComercialAcumUSD: 9810,
        saldoComercialInicioUSD: -2668,
        saldoComercialFinUSD: 15990,
        exportacionesVarPct: 14.6,
        reservasNetasInicioUSD: -1800,
        reservasNetasFinUSD: 12400,
        brechaCambiariaInicioPct: 54.0,
        brechaCambiariaFinPct: 24.0,
        resultadoFiscalPrimarioInicioPBI: -3.8,
        resultadoFiscalPrimarioFinPBI: -0.4,
        resultadoFiscalFinancieroFinPBI: -3.8,
        deudaPublicaFinPBI: 89.8,
        giniInicio: 0.412,
        giniFin: 0.439,
        homicidiosInicio: 6.6,
        homicidiosFin: 5.1
      },
      oficial: {
        inflacionAnualPromedio: 41.2,
        inflacionAcumulada: 295.7,
        inflacionInicio: 15.8,
        inflacionFin: 53.8,
        inflacionM34: 45.9,
        pbiVariacionTotal: -4.0,
        pbiVariacionM34: -1.8,
        pbiPerCapitaVar: -7.8,
        pobrezaInicio: 30.3,
        pobrezaFin: 35.5,
        pobrezaM34: 32.0,
        pobrezaDiff: 5.2,
        indigenciaInicio: 6.1,
        indigenciaFin: 8.0,
        salarioRealVar: -19.8,
        salarioRealM34: -14.2,
        salarioPrivadoRegVar: -18.2,
        salarioPublicoNacVar: -21.4,
        salarioPublicoProvVar: -19.5,
        salarioInformalVar: -25.4,
        jubilacionMinimaRealVar: -19.2,
        salariosEnCBT: 1.44,
        desempleoInicio: 5.9,
        desempleoFin: 8.9,
        desempleoM34: 9.0,
        empleoFormalTasaFin: 26.1,
        empleoInformalTasaFin: 16.9,
        industriaIpiVar: -13.6,
        construccionActividadVar: -6.8,
        mineriaEnergiaVar: 11.4,
        agroVar: 18.5,
        balanzaComercialAcumUSD: 9810,
        saldoComercialInicioUSD: -2668,
        saldoComercialFinUSD: 15990,
        exportacionesVarPct: 14.6,
        reservasNetasInicioUSD: -1800,
        reservasNetasFinUSD: 12400,
        brechaCambiariaInicioPct: 54.0,
        brechaCambiariaFinPct: 24.0,
        resultadoFiscalPrimarioInicioPBI: -3.8,
        resultadoFiscalPrimarioFinPBI: -0.4,
        resultadoFiscalFinancieroFinPBI: -3.8,
        deudaPublicaFinPBI: 89.8,
        giniInicio: 0.412,
        giniFin: 0.439,
        homicidiosInicio: 6.6,
        homicidiosFin: 5.1
      }
    },
    costBenefitCard: {
      headlineAchievement: 'Normalización Estadística, Reducción de Homicidios (−22,7%) y Giro Comercial (+USD 15.990 M)',
      headlineQuestion: '¿Qué resultados positivos se observaron y qué costos simultáneos se registraron entre 2015 y 2019?',
      positiveMetrics: [
        { label: 'Déficit Fiscal Primario', value: '−0,4% PBI', detail: 'Redujo 3,4 puntos desde el −3,8% recibido' },
        { label: 'Balanza Comercial 2019', value: '+USD 15.990 M', detail: 'Exportaciones crecieron +14,6% en el mandato' },
        { label: 'Tasa de Homicidios (SNIC)', value: '5,1 c/100k', detail: 'Bajó desde 6,6 cada 100.000 hab. en 2015' }
      ],
      simultaneousCosts: [
        { label: 'Salario Real Promedio', value: '−19,8%', detail: 'Caída generalizada en formales e informales' },
        { label: 'Inflación Anual', value: '53,8%', detail: 'Duplicó el ritmo inflacionario de 2015' },
        { label: 'Deuda Pública / PBI', value: '89,8% PBI', detail: 'Salto por endeudamiento externo y devaluación' },
        { label: 'Industria Manufacturera', value: '−13,6%', detail: 'Tres años recesivos de cuatro (2016, 2018, 2019)' }
      ],
      neutralReading:
        'Se corrigió el déficit primario, bajó la tasa de homicidios y se revirtió el déficit comercial hacia 2019, pero las corridas cambiarias de 2018–2019 duplicaron la inflación, contrajeron el PBI (-4,0%) y el salario real (-19,8%) y elevaron la deuda al 89,8% del PBI.'
    },
    queMejoro: [
      'Normalización institucional del INDEC (2016) y publicación transparente de IPC Nacional, EPH y Canastas.',
      'Reducción sostenida de la tasa de homicidios dolosos de 6,6 a 5,1 cada 100.000 habitantes (SNIC).',
      'Reversión del saldo comercial externo (de -USD 2.668 M a +USD 15.990 M en 2019) con +14,6% en exportaciones y +18,5% en el agro.',
      'Reducción del déficit fiscal primario de -3,8% a -0,4% del PBI y recomposición de reservas netas (+USD 12.400 M).'
    ],
    queEmpeoro: [
      'Duplicación de la inflación anual (de 26,9% en 2015 a 53,8% en 2019, acumulando 295,7%).',
      'Caída del salario real de -19,8% y de las jubilaciones mínimas de -19,2%.',
      'Contracción del PBI (-4,0% total y -7,8% per cápita) y de la industria manufacturera (-13,6% en IPI INDEC).',
      'Aumento de la pobreza de 30,1% a 35,5% (tras haber tocado un piso de 25,7% en 2S 2017) y suba del desempleo de 5,9% a 8,9%.'
    ],
    problemasGenerados: [
      'Endeudamiento público que escaló de 52,6% a 89,8% del PBI, incluyendo el préstamo Stand-By récord con el FMI (USD 44.500 M).',
      'Peso de los intereses de la deuda que mantuvo el déficit financiero total en -3,8% del PBI pese al ajuste primario.',
      'Reimposición de controles cambiarios ("cepo") y reperfilamiento de deuda en pesos en el tramo final de 2019.'
    ],
    scores: {
      reconstruccion: {
        precios: 36,
        bolsillo: 30,
        dolar_externo: 56,
        empleo: 45,
        social: 42,
        produccion: 32,
        fiscal_deuda: 38,
        seguridad: 78,
        distribucion: 40
      },
      oficial: {
        precios: 36,
        bolsillo: 30,
        dolar_externo: 56,
        empleo: 45,
        social: 42,
        produccion: 32,
        fiscal_deuda: 38,
        seguridad: 78,
        distribucion: 40
      }
    }
  },
  {
    id: 'alberto',
    order: 3,
    president: 'Alberto Fernández',
    subtitle: 'Mandato Presidencial Completo (48 meses)',
    period: 'Dic 2019 – Dic 2023',
    yearsLabel: '2019–2023',
    party: 'Frente de Todos / Unión por la Patria',
    coalitionFamily: 'Peronismo / Kirchnerismo / Frente Renovador',
    ideologyTag: 'Asistencia en Pandemia · Emisión y Brecha Cambiaria',
    color: '#1d4ed8',
    colorSoft: 'rgba(29, 78, 216, 0.10)',
    colorBorder: 'rgba(29, 78, 216, 0.32)',
    summaryModel:
      'Enfrentó la pandemia (2020) y la sequía (2023) apelando a transferencias de emergencia (IFE, ATP), congelamiento de tarifas, controles de importaciones (SIRA), tipos de cambio diferenciales y fuerte emisión monetaria del BCRA.',
    inheritedTrend:
      'Recibió el país en recesión (-2,0% en 2019), con inflación en 53,8% anual, pobreza en 35,5%, deuda en 89,8% del PBI, pero con superávit comercial (+USD 15.990 M), reservas netas positivas (+USD 12.400 M) y déficit primario casi equilibrado (-0,4% PBI).',
    metrics: {
      reconstruccion: {
        inflacionAnualPromedio: 88.0,
        inflacionAcumulada: 1146.2,
        inflacionInicio: 53.8,
        inflacionFin: 211.4,
        inflacionM34: 83.0,
        pbiVariacionTotal: 2.8,
        pbiVariacionM34: 4.5,
        pbiPerCapitaVar: -0.6,
        pobrezaInicio: 35.5,
        pobrezaFin: 41.7,
        pobrezaM34: 39.2,
        pobrezaDiff: 6.2,
        indigenciaInicio: 8.0,
        indigenciaFin: 11.9,
        salarioRealVar: -15.4,
        salarioRealM34: -6.0,
        salarioPrivadoRegVar: -6.8,
        salarioPublicoNacVar: -14.2,
        salarioPublicoProvVar: -12.8,
        salarioInformalVar: -34.6,
        jubilacionMinimaRealVar: -28.5,
        salariosEnCBT: 1.21,
        desempleoInicio: 8.9,
        desempleoFin: 5.7,
        desempleoM34: 6.3,
        empleoFormalTasaFin: 26.7,
        empleoInformalTasaFin: 18.9,
        industriaIpiVar: 7.2,
        construccionActividadVar: 9.8,
        mineriaEnergiaVar: 14.2,
        agroVar: -19.4,
        balanzaComercialAcumUSD: 27420,
        saldoComercialInicioUSD: 15990,
        saldoComercialFinUSD: -6925,
        exportacionesVarPct: 2.6,
        reservasNetasInicioUSD: 12400,
        reservasNetasFinUSD: -11500,
        brechaCambiariaInicioPct: 24.0,
        brechaCambiariaFinPct: 158.0,
        resultadoFiscalPrimarioInicioPBI: -0.4,
        resultadoFiscalPrimarioFinPBI: -2.9,
        resultadoFiscalFinancieroFinPBI: -6.1,
        deudaPublicaFinPBI: 85.4,
        giniInicio: 0.439,
        giniFin: 0.435,
        homicidiosInicio: 5.1,
        homicidiosFin: 4.4
      },
      oficial: {
        inflacionAnualPromedio: 88.0,
        inflacionAcumulada: 1146.2,
        inflacionInicio: 53.8,
        inflacionFin: 211.4,
        inflacionM34: 83.0,
        pbiVariacionTotal: 2.8,
        pbiVariacionM34: 4.5,
        pbiPerCapitaVar: -0.6,
        pobrezaInicio: 35.5,
        pobrezaFin: 41.7,
        pobrezaM34: 39.2,
        pobrezaDiff: 6.2,
        indigenciaInicio: 8.0,
        indigenciaFin: 11.9,
        salarioRealVar: -15.4,
        salarioRealM34: -6.0,
        salarioPrivadoRegVar: -6.8,
        salarioPublicoNacVar: -14.2,
        salarioPublicoProvVar: -12.8,
        salarioInformalVar: -34.6,
        jubilacionMinimaRealVar: -28.5,
        salariosEnCBT: 1.21,
        desempleoInicio: 8.9,
        desempleoFin: 5.7,
        desempleoM34: 6.3,
        empleoFormalTasaFin: 26.7,
        empleoInformalTasaFin: 18.9,
        industriaIpiVar: 7.2,
        construccionActividadVar: 9.8,
        mineriaEnergiaVar: 14.2,
        agroVar: -19.4,
        balanzaComercialAcumUSD: 27420,
        saldoComercialInicioUSD: 15990,
        saldoComercialFinUSD: -6925,
        exportacionesVarPct: 2.6,
        reservasNetasInicioUSD: 12400,
        reservasNetasFinUSD: -11500,
        brechaCambiariaInicioPct: 24.0,
        brechaCambiariaFinPct: 158.0,
        resultadoFiscalPrimarioInicioPBI: -0.4,
        resultadoFiscalPrimarioFinPBI: -2.9,
        resultadoFiscalFinancieroFinPBI: -6.1,
        deudaPublicaFinPBI: 85.4,
        giniInicio: 0.439,
        giniFin: 0.435,
        homicidiosInicio: 5.1,
        homicidiosFin: 4.4
      }
    },
    costBenefitCard: {
      headlineAchievement: 'Desempleo en Mínimo Histórico (5,7%) y Expansión de Industria (+7,2%) y Construcción (+9,8%)',
      headlineQuestion: '¿Qué resultados positivos se observaron y qué costos simultáneos se registraron entre 2019 y 2023?',
      positiveMetrics: [
        { label: 'Tasa de Desocupación (4T 2023)', value: '5,7%', detail: 'Bajó 3,2 pp respecto al 8,9% de fin de 2019' },
        { label: 'Industria y Construcción', value: '+7,2% / +9,8%', detail: 'Recuperación superior al nivel pre-pandemia' },
        { label: 'Tasa de Homicidios (SNIC)', value: '4,4 c/100k', detail: 'Reducción desde 5,1 cada 100.000 hab.' }
      ],
      simultaneousCosts: [
        { label: 'Inflación Anual (2023)', value: '211,4%', detail: 'Cuadruplicó la inflación recibida (1.146% acum.)' },
        { label: 'Salario Informal No Registrado', value: '−34,6%', detail: 'Desplome de ingresos fuera de convenio' },
        { label: 'Pobreza (2S 2023) e Indigencia', value: '41,7% / 11,9%', detail: 'Subió +6,2 pp pese al menor desempleo' },
        { label: 'Reservas Netas y Brecha', value: '−USD 11.500 M', detail: 'Brecha cambiaria del 158% y deuda comercial' }
      ],
      neutralReading:
        'La economía recuperó rápido el nivel de empleo (desocupación en 5,7%) y la actividad industrial/construcción tras la pandemia, pero a costa de una aceleración inflacionaria al 211,4%, pérdida de reservas netas (-USD 11.500 M) y una caída del 34,6% en el salario informal que llevó la pobreza al 41,7%.'
    },
    queMejoro: [
      'Reducción de la desocupación abierta al 5,7% en 4T 2023 (con tasa de empleo récord de 45,8% en EPH).',
      'Expansión de la industria manufacturera (+7,2% vs. 2019), la construcción (+9,8%) y la producción en Vaca Muerta (+14,2% e inicio del Gasoducto).',
      'Baja de la tasa nacional de homicidios dolosos de 5,1 a 4,4 cada 100.000 habitantes (SNIC).',
      'Reestructuración de la deuda privada en moneda extranjera en 2020 reduciendo cupones de interés.'
    ],
    queEmpeoro: [
      'Salto del régimen inflacionario: de 53,8% anual (2019) a 211,4% anual (2023), acumulando 1.146% en 4 años.',
      'Aumento de la pobreza de 35,5% a 41,7% (2S 2023) y de la indigencia de 8,0% a 11,9% en simultáneo con el bajo desempleo.',
      'Caída del 34,6% real en el salario del sector privado no registrado y del 28,5% en el haber jubilatorio base.',
      'Agotamiento total de reservas del BCRA (de +USD 12.400 M a -USD 11.500 M netos) y déficit comercial de -USD 6.925 M en 2023.'
    ],
    problemasGenerados: [
      'Brecha cambiaria del 158% y deuda comercial con importadores superior a USD 40.000 M.',
      'Déficit fiscal financiero de -6,1% del PBI (-2,9% primario) y pasivos remunerados del BCRA por 3 bases monetarias.',
      'Atraso extremo de tarifas energéticas y de transporte que cubrían menos del 20% del costo de provisión.'
    ],
    scores: {
      reconstruccion: {
        precios: 8,
        bolsillo: 34,
        dolar_externo: 18,
        empleo: 86,
        social: 26,
        produccion: 74,
        fiscal_deuda: 22,
        seguridad: 84,
        distribucion: 42
      },
      oficial: {
        precios: 8,
        bolsillo: 34,
        dolar_externo: 18,
        empleo: 86,
        social: 26,
        produccion: 74,
        fiscal_deuda: 22,
        seguridad: 84,
        distribucion: 42
      }
    }
  },
  {
    id: 'milei',
    order: 4,
    president: 'Javier Milei',
    subtitle: 'Mandato en Curso (34 meses · Datos a Sep 2026)',
    period: 'Dic 2023 – Actualidad (Sep 2026)',
    yearsLabel: '2023–2026',
    party: 'La Libertad Avanza',
    coalitionFamily: 'Libertarismo + Aliados PRO',
    ideologyTag: 'Superávit Fiscal de Shock · Desinflación y Desregulación',
    color: '#9f1239',
    colorSoft: 'rgba(159, 18, 57, 0.10)',
    colorBorder: 'rgba(159, 18, 57, 0.32)',
    summaryModel:
      'Aplicó un ajuste fiscal de shock de 5 puntos del PBI en el primer mes logrando superávit financiero, eliminó el financiamiento monetario del BCRA al Tesoro, sinceró tipo de cambio y tarifas, abrió el comercio y promovió inversiones en energía y minería (RIGI).',
    inheritedTrend:
      'Recibió una inflación corriendo al 12,8% mensual (211,4% anual en 2023), reservas netas negativas en -USD 11.500 M, brecha cambiaria del 158%, déficit financiero de -6,1% del PBI y pobreza en 41,7% (escalando en dic. 2023).',
    metrics: {
      reconstruccion: {
        inflacionAnualPromedio: 52.4,
        inflacionAcumulada: 248.0,
        inflacionInicio: 211.4,
        inflacionFin: 38.7,
        inflacionM34: 38.7,
        pbiVariacionTotal: 3.8,
        pbiVariacionM34: 3.8,
        pbiPerCapitaVar: 1.4,
        pobrezaInicio: 41.7,
        pobrezaFin: 32.3,
        pobrezaM34: 32.3,
        pobrezaDiff: -9.4,
        indigenciaInicio: 11.9,
        indigenciaFin: 7.5,
        salarioRealVar: -2.1,
        salarioRealM34: -2.1,
        salarioPrivadoRegVar: 3.4,
        salarioPublicoNacVar: -18.5,
        salarioPublicoProvVar: -11.2,
        salarioInformalVar: -1.2,
        jubilacionMinimaRealVar: -8.4,
        salariosEnCBT: 1.38,
        desempleoInicio: 5.7,
        desempleoFin: 7.9,
        desempleoM34: 7.9,
        empleoFormalTasaFin: 24.7,
        empleoInformalTasaFin: 20.2,
        industriaIpiVar: -3.1,
        construccionActividadVar: -14.8,
        mineriaEnergiaVar: 21.4,
        agroVar: 31.2,
        balanzaComercialAcumUSD: 46850,
        saldoComercialInicioUSD: -6925,
        saldoComercialFinUSD: 15400,
        exportacionesVarPct: 24.8,
        reservasNetasInicioUSD: -11500,
        reservasNetasFinUSD: 6800,
        brechaCambiariaInicioPct: 158.0,
        brechaCambiariaFinPct: 6.5,
        resultadoFiscalPrimarioInicioPBI: -2.9,
        resultadoFiscalPrimarioFinPBI: 1.8,
        resultadoFiscalFinancieroFinPBI: 0.4,
        deudaPublicaFinPBI: 74.2,
        giniInicio: 0.435,
        giniFin: 0.441,
        homicidiosInicio: 4.4,
        homicidiosFin: 3.8
      },
      oficial: {
        inflacionAnualPromedio: 52.4,
        inflacionAcumulada: 248.0,
        inflacionInicio: 211.4,
        inflacionFin: 38.7,
        inflacionM34: 38.7,
        pbiVariacionTotal: 3.8,
        pbiVariacionM34: 3.8,
        pbiPerCapitaVar: 1.4,
        pobrezaInicio: 41.7,
        pobrezaFin: 32.3,
        pobrezaM34: 32.3,
        pobrezaDiff: -9.4,
        indigenciaInicio: 11.9,
        indigenciaFin: 7.5,
        salarioRealVar: -2.1,
        salarioRealM34: -2.1,
        salarioPrivadoRegVar: 3.4,
        salarioPublicoNacVar: -18.5,
        salarioPublicoProvVar: -11.2,
        salarioInformalVar: -1.2,
        jubilacionMinimaRealVar: -8.4,
        salariosEnCBT: 1.38,
        desempleoInicio: 5.7,
        desempleoFin: 7.9,
        desempleoM34: 7.9,
        empleoFormalTasaFin: 24.7,
        empleoInformalTasaFin: 20.2,
        industriaIpiVar: -3.1,
        construccionActividadVar: -14.8,
        mineriaEnergiaVar: 21.4,
        agroVar: 31.2,
        balanzaComercialAcumUSD: 46850,
        saldoComercialInicioUSD: -6925,
        saldoComercialFinUSD: 15400,
        exportacionesVarPct: 24.8,
        reservasNetasInicioUSD: -11500,
        reservasNetasFinUSD: 6800,
        brechaCambiariaInicioPct: 158.0,
        brechaCambiariaFinPct: 6.5,
        resultadoFiscalPrimarioInicioPBI: -2.9,
        resultadoFiscalPrimarioFinPBI: 1.8,
        resultadoFiscalFinancieroFinPBI: 0.4,
        deudaPublicaFinPBI: 74.2,
        giniInicio: 0.435,
        giniFin: 0.441,
        homicidiosInicio: 4.4,
        homicidiosFin: 3.8
      }
    },
    costBenefitCard: {
      headlineAchievement: 'Superávit Fiscal (+0,4% Financiero), Desinflación (−172 pp) y Baja de Pobreza a 32,3% (1S 2026)',
      headlineQuestion: '¿Qué resultados positivos se observaron y qué costos simultáneos se registraron entre dic. 2023 y sep. 2026?',
      positiveMetrics: [
        { label: 'Pobreza EPH (1S 2026)', value: '32,3%', detail: 'Bajó −9,4 pp vs. 2S 2023 (tras pico de 52,9% en 1S 2024)' },
        { label: 'Superávit Fiscal y Brecha', value: '+1,8% Prim.', detail: 'Brecha cambiaria bajó de 158% a 6,5%' },
        { label: 'Balanza Comercial y Energía', value: '+USD 46.850 M', detail: 'Auge en Litio, Petróleo y Gas no convencional (+21,4%)' }
      ],
      simultaneousCosts: [
        { label: 'Desocupación y Empleo Formal', value: '7,9% desoc.', detail: 'Empleo formal EPH bajó de 26,7% a 24,7% (2T 2026)' },
        { label: 'Construcción y Obra Pública', value: '−14,8%', detail: 'Fuerte contracción tras el freno de obra pública nacional' },
        { label: 'Salario Público Nacional', value: '−18,5%', detail: 'Recorte real en administración central y universidades' },
        { label: 'Empleo Informal EPH', value: '20,2%', detail: 'Subió desde 18,9% en 4T 2023 (API-INDEC v1)' }
      ],
      neutralReading:
        'El shock fiscal y monetario redujo drásticamente la inflación, cerró la brecha cambiaria y bajó la pobreza a 32,3% en 1S 2026 (y 28,2% en 2S 2025), pero durante el mismo período la desocupación subió de 5,7% a 7,9% (2T 2026), la tasa de empleo formal cayó 2 puntos (de 26,7% a 24,7%) y se contrajeron la construcción (-14,8%) y el salario público (-18,5%).'
    },
    queMejoro: [
      'Fuerte desinflación: tras el pico inicial de 25,5% mensual en dic. 2023 (211,4% anual), la variación interanual de la CBT bajó a 38,7% en sep. 2026 (1,7% mensual).',
      'Reducción de la pobreza e indigencia tras el shock de 2024: según la Encuesta Permanente de Hogares (INDEC), pasó de 41,7% (2S 2023) y 52,9% (1S 2024) a 38,1% (2S 2024), 28,2% (2S 2025) y 32,3% en 1S 2026 (-9,4 pp vs. 2023).',
      'Primer superávit fiscal financiero sostenido (+1,8% primario / +0,4% financiero), cierre de la brecha cambiaria (de 158% a 6,5%) y recomposición de reservas netas (+USD 18.300 M).',
      'Récord en producción de hidrocarburos no convencionales y litio (+21,4% en Índice Minero y Energético INDEC) y baja de la tasa de homicidios a 3,8 cada 100.000 hab. (Plan Bandera / SNIC).'
    ],
    queEmpeoro: [
      'Deterioro de indicadores laborales en la Encuesta Permanente de Hogares (INDEC): entre 4T 2023 y 2T 2026 la desocupación subió de 5,7% a 7,9%, la tasa de empleo formal bajó de 26,7% a 24,7% y el empleo informal subió de 18,9% a 20,2%.',
      'Contracción de la construcción (-14,8% respecto a 2023) y rezago en ramas manufactureras mercado-internistas (-3,1% en IPI Manufacturero).',
      'Caída del poder adquisitivo en el subsector público nacional (-18,5%) y provincial (-11,2%), junto con jubilaciones con bono congelado (-8,4%).',
      'Aumento del peso de servicios regulados (luz, gas, agua, transporte) sobre el ingreso disponible del hogar.'
    ],
    problemasGenerados: [
      'Crecimiento heterogéneo ("en K"): fuerte expansión en energía, minería y agro, pero pérdida de empleo asalariado formal urbano (-2,0 pp en EPH).',
      'Freno de inversión en infraestructura vial y obra pública nacional.',
      'Tensión competitiva en sectores industriales y turismo receptivo por apreciación cambiaria real.'
    ],
    scores: {
      reconstruccion: {
        precios: 86,
        bolsillo: 56,
        dolar_externo: 92,
        empleo: 52,
        social: 78,
        produccion: 58,
        fiscal_deuda: 94,
        seguridad: 92,
        distribucion: 50
      },
      oficial: {
        precios: 86,
        bolsillo: 56,
        dolar_externo: 92,
        empleo: 52,
        social: 78,
        produccion: 58,
        fiscal_deuda: 94,
        seguridad: 92,
        distribucion: 50
      }
    }
  }
];

/**
 * Serie Real Semestral de Pobreza e Indigencia oficial de EPH INDEC (20162S - 20261S)
 * más empalme histórico 2011-2015 (Reconstrucción CEDLAS vs. Oficial INDEC)
 */
export const REAL_POBREZA_SEMESTRAL = [
  { periodo: '2011-2S', govId: 'cfk', pobReconstruccion: 26.0, pobOficial: 6.5, indReconstruccion: 4.8, indOficial: 1.7 },
  { periodo: '2012-2S', govId: 'cfk', pobReconstruccion: 26.9, pobOficial: 5.4, indReconstruccion: 5.0, indOficial: 1.5 },
  { periodo: '2013-1S', govId: 'cfk', pobReconstruccion: 27.5, pobOficial: 4.7, indReconstruccion: 5.1, indOficial: 1.4 },
  { periodo: '2014-2S', govId: 'cfk', pobReconstruccion: 31.4, pobOficial: null, indReconstruccion: 5.9, indOficial: null },
  { periodo: '2015-2S', govId: 'cfk', pobReconstruccion: 30.1, pobOficial: null, indReconstruccion: 5.3, indOficial: null },
  { periodo: '2016-2S', govId: 'macri', pobReconstruccion: 30.3, pobOficial: 30.3, indReconstruccion: 6.1, indOficial: 6.1 },
  { periodo: '2017-1S', govId: 'macri', pobReconstruccion: 28.6, pobOficial: 28.6, indReconstruccion: 6.2, indOficial: 6.2 },
  { periodo: '2017-2S', govId: 'macri', pobReconstruccion: 25.7, pobOficial: 25.7, indReconstruccion: 4.8, indOficial: 4.8 },
  { periodo: '2018-1S', govId: 'macri', pobReconstruccion: 27.3, pobOficial: 27.3, indReconstruccion: 4.9, indOficial: 4.9 },
  { periodo: '2018-2S', govId: 'macri', pobReconstruccion: 32.0, pobOficial: 32.0, indReconstruccion: 6.7, indOficial: 6.7 },
  { periodo: '2019-1S', govId: 'macri', pobReconstruccion: 35.4, pobOficial: 35.4, indReconstruccion: 7.7, indOficial: 7.7 },
  { periodo: '2019-2S', govId: 'macri', pobReconstruccion: 35.5, pobOficial: 35.5, indReconstruccion: 8.0, indOficial: 8.0 },
  { periodo: '2020-1S', govId: 'alberto', pobReconstruccion: 40.9, pobOficial: 40.9, indReconstruccion: 10.5, indOficial: 10.5 },
  { periodo: '2020-2S', govId: 'alberto', pobReconstruccion: 42.0, pobOficial: 42.0, indReconstruccion: 10.5, indOficial: 10.5 },
  { periodo: '2021-1S', govId: 'alberto', pobReconstruccion: 40.6, pobOficial: 40.6, indReconstruccion: 10.7, indOficial: 10.7 },
  { periodo: '2021-2S', govId: 'alberto', pobReconstruccion: 37.3, pobOficial: 37.3, indReconstruccion: 8.2, indOficial: 8.2 },
  { periodo: '2022-1S', govId: 'alberto', pobReconstruccion: 36.5, pobOficial: 36.5, indReconstruccion: 8.8, indOficial: 8.8 },
  { periodo: '2022-2S', govId: 'alberto', pobReconstruccion: 39.2, pobOficial: 39.2, indReconstruccion: 8.1, indOficial: 8.1 },
  { periodo: '2023-1S', govId: 'alberto', pobReconstruccion: 40.1, pobOficial: 40.1, indReconstruccion: 9.3, indOficial: 9.3 },
  { periodo: '2023-2S', govId: 'alberto', pobReconstruccion: 41.7, pobOficial: 41.7, indReconstruccion: 11.9, indOficial: 11.9 },
  { periodo: '2024-1S', govId: 'milei', pobReconstruccion: 52.9, pobOficial: 52.9, indReconstruccion: 18.1, indOficial: 18.1 },
  { periodo: '2024-2S', govId: 'milei', pobReconstruccion: 38.1, pobOficial: 38.1, indReconstruccion: 8.2, indOficial: 8.2 },
  { periodo: '2025-1S', govId: 'milei', pobReconstruccion: 31.6, pobOficial: 31.6, indReconstruccion: 6.9, indOficial: 6.9 },
  { periodo: '2025-2S', govId: 'milei', pobReconstruccion: 28.2, pobOficial: 28.2, indReconstruccion: 6.3, indOficial: 6.3 },
  { periodo: '2026-1S', govId: 'milei', pobReconstruccion: 32.3, pobOficial: 32.3, indReconstruccion: 7.5, indOficial: 7.5 }
];

/**
 * Genera el Semáforo Rápido y Veredicto Visual para cada gobierno
 * Permite que cualquier ciudadano entienda en 2 segundos qué mejoró (verde), qué empeoró (rojo) y qué no cambió (gris).
 */
export function getGovernmentQuickScorecard(gov, effectiveKey = 'reconstruccion') {
  const m = gov.metrics[effectiveKey] || gov.metrics.reconstruccion;

  if (gov.id === 'cfk') {
    return {
      mainHeadline: 'Máximo poder de compra en canastas y bajo desempleo, con cepo y pérdida de reservas',
      takeaway:
        'El salario formal alcanzó su techo histórico en canastas básicas (1,82 CBT) y el desempleo se redujo al 5,9%, pero el país perdió el superávit comercial y energético, y el BCRA agotó todas sus reservas netas líquidas.',
      pillars: [
        {
          id: 'inflacion',
          label: 'Inflación Anual',
          statusText: effectiveKey === 'oficial' ? '15,6% anual oficial' : 'Empeoró (+4,1 pp)',
          tone: effectiveKey === 'oficial' ? 'neutral' : 'negative',
          icon: effectiveKey === 'oficial' ? '⚪' : '🔴',
          metric: `${m.inflacionInicio}% → ${m.inflacionFin}%`,
          explanation: 'Se mantuvo alta y persistente, motivando la fijación del cepo cambiario en 2011.'
        },
        {
          id: 'salario',
          label: 'Poder de Compra (Sueldo)',
          statusText: 'Récord: 1,82 Canastas',
          tone: 'positive',
          icon: '🟢',
          metric: `${m.salariosEnCBT} Canastas Totales`,
          explanation: 'Mayor cantidad de canastas familiares que pudo comprar un salario en los 16 años.'
        },
        {
          id: 'pobreza',
          label: 'Pobreza e Indigencia',
          statusText: effectiveKey === 'oficial' ? '4,7% oficial (2013)' : 'Aumentó a 30,1%',
          tone: effectiveKey === 'oficial' ? 'positive' : 'negative',
          icon: effectiveKey === 'oficial' ? '🟢' : '🔴',
          metric: effectiveKey === 'oficial' ? '6,5% → 4,7%' : '26,0% → 30,1%',
          explanation:
            effectiveKey === 'oficial'
              ? 'Serie oficial interrumpida por INDEC en 2013.'
              : 'Aumentó +4,1 pp según serie histórica homogénea CEDLAS/UCA.'
        },
        {
          id: 'reservas',
          label: 'Reservas y Solvencia',
          statusText: 'Agotó Reservas Netas',
          tone: 'negative',
          icon: '🔴',
          metric: '+USD 31.500 M → -USD 1.800 M',
          explanation: 'Se perdieron más de USD 33.000 millones y la brecha del dólar blue llegó al 54%.'
        }
      ]
    };
  }

  if (gov.id === 'macri') {
    return {
      mainHeadline: 'Apertura inicial y recuperación del INDEC, seguida de crisis cambiaria y deuda con FMI',
      takeaway:
        'Se unificó el tipo de cambio y se normalizó la estadística oficial, pero tras las devaluaciones de 2018-2019 la inflación trepó al 54%, el salario perdió 18% de poder de compra y la deuda trepó al 90% del PBI.',
      pillars: [
        {
          id: 'inflacion',
          label: 'Inflación Anual',
          statusText: 'Se duplicó (+28,4 pp)',
          tone: 'negative',
          icon: '🔴',
          metric: `${m.inflacionInicio}% → ${m.inflacionFin}%`,
          explanation: 'Promedió 40,2% anual y cerró en 53,8% tras las corridas contra el peso.'
        },
        {
          id: 'salario',
          label: 'Poder de Compra (Sueldo)',
          statusText: 'Cayó −18,2% real',
          tone: 'negative',
          icon: '🔴',
          metric: '1,82 → 1,51 Canastas',
          explanation: 'Fuerte pérdida de poder adquisitivo que afectó a registrados e informales.'
        },
        {
          id: 'pobreza',
          label: 'Pobreza e Indigencia',
          statusText: 'Subió a 35,5% (+5,4 pp)',
          tone: 'negative',
          icon: '🔴',
          metric: `${m.pobrezaInicio}% → ${m.pobrezaFin}%`,
          explanation: 'Bajó al 25,7% en 2017, pero la crisis 2018-2019 sumó 3,5 millones de nuevos pobres.'
        },
        {
          id: 'reservas',
          label: 'Reservas y Deuda',
          statusText: 'Deuda récord (+FMI)',
          tone: 'negative',
          icon: '🔴',
          metric: 'Deuda 52,6% → 89,8% PBI',
          explanation: 'Préstamo de USD 44.000 M con el FMI y restablecimiento del cepo cambiario en 2019.'
        }
      ]
    };
  }

  if (gov.id === 'alberto') {
    return {
      mainHeadline: 'Bajo desempleo formal, con inflación récord (211%) y derrumbe del sueldo informal',
      takeaway:
        'El desempleo bajó al 5,7%, pero la fuerte emisión monetaria llevó la inflación al 211%, los salarios no registrados se desplomaron -35%, la pobreza subió al 41,7% y el BCRA quedó con reservas netas en -USD 11.200 M.',
      pillars: [
        {
          id: 'inflacion',
          label: 'Inflación Anual',
          statusText: 'Se cuadruplicó (+157,6 pp)',
          tone: 'negative',
          icon: '🔴',
          metric: `${m.inflacionInicio}% → ${m.inflacionFin}%`,
          explanation: 'Pasó del 53,8% al 211,4% anual, el registro más elevado en 33 años.'
        },
        {
          id: 'salario',
          label: 'Poder de Compra (Sueldo)',
          statusText: 'Desplome informal (−34,6%)',
          tone: 'negative',
          icon: '🔴',
          metric: 'Formal −6,8% | Inf −34,6%',
          explanation: 'Inédita brecha de desigualdad salarial entre trabajadores formales e informales.'
        },
        {
          id: 'pobreza',
          label: 'Pobreza e Indigencia',
          statusText: 'Subió a 41,7% (+6,2 pp)',
          tone: 'negative',
          icon: '🔴',
          metric: `${m.pobrezaInicio}% → ${m.pobrezaFin}%`,
          explanation: 'La pobreza afectó a 4 de cada 10 argentinos y la indigencia trepó al 11,9%.'
        },
        {
          id: 'reservas',
          label: 'Reservas y Brecha',
          statusText: 'Reservas en −USD 11.200 M',
          tone: 'negative',
          icon: '🔴',
          metric: 'Brecha del 155% con cepo',
          explanation: 'El BCRA agotó sus dólares líquidos y se multiplicaron las cotizaciones paralelas.'
        }
      ]
    };
  }

  // Milei
  return {
    mainHeadline: 'Fuerte desinflación y equilibrio fiscal, con suba del desempleo y ajuste en jubilaciones',
    takeaway:
      'La inflación mensual bajó del 25,5% al 1,9% (33,4% i.a.), se logró superávit fiscal y la pobreza bajó al 32,3% tras el pico de 52,9%, pero la desocupación subió al 7,9% y el bono jubilatorio congelado redujo ingresos reales de la mínima.',
    pillars: [
      {
        id: 'inflacion',
        label: 'Inflación Anual',
        statusText: 'Fuerte baja (−178,0 pp)',
        tone: 'positive',
        icon: '🟢',
        metric: '211,4% → 33,4% anual',
        explanation: 'Fuerte freno al ritmo mensual de suba de precios (de 25,5% mensual a 1,9%).'
      },
      {
        id: 'salario',
        label: 'Poder de Compra (Sueldo)',
        statusText: 'Mixto: Privado +3,4%',
        tone: 'neutral',
        icon: '⚪',
        metric: 'Privado +3,4% | Público −18,5%',
        explanation: 'El asalariado formal recuperó poder de compra, pero estatales y bono sufrieron recorte.'
      },
      {
        id: 'pobreza',
        label: 'Pobreza e Indigencia',
        statusText: 'Bajó a 32,3% (−9,4 pp)',
        tone: 'positive',
        icon: '🟢',
        metric: '41,7% → 32,3% (Pico 52,9%)',
        explanation: 'Retrocedió 20 puntos respecto al pico de 1S 2024 impulsada por la desinflación y la suba de AUH.'
      },
      {
        id: 'reservas',
        label: 'Fiscal y Reservas',
        statusText: 'Superávit Primario (+1,6%)',
        tone: 'positive',
        icon: '🟢',
        metric: '+USD 15.000 M recomprados',
        explanation: 'Primer superávit fiscal sostenido en 16 años y brecha cambiaria reducida al 15%.'
      }
    ]
  };
}

/**
 * Módulo Distributivo: "¿Quién mejoró realmente su situación en cada período?"
 */
export const DISTRIBUTIVE_GROUPS = [
  {
    id: 'privado_registrado',
    groupName: 'Asalariados Privados Registrados (Con Convenio / Paritaria)',
    sourceEndpoint: 'INDEC · Índice de Salarios (Sector Privado Registrado)',
    limitationNote: 'Serie continua comparable desde oct. 2015 en INDEC y SIPA previo.',
    byGov: {
      cfk: { varReal: -0.9, status: 'Estable en techo histórico (1,82 CBT)', dir: 'neutral' },
      macri: { varReal: -18.2, status: 'Fuerte pérdida en crisis 2018-2019', dir: 'neg' },
      alberto: { varReal: -6.8, status: 'Defendió mejor que informales pero perdió contra IPC 2023', dir: 'neg' },
      milei: { varReal: 3.4, status: 'Recuperó el nivel de nov. 2023 gracias a la desinflación', dir: 'pos' }
    }
  },
  {
    id: 'publico_nacional',
    groupName: 'Sector Público Nacional (Administración Central, Universidades, Organismos)',
    sourceEndpoint: 'INDEC · Índice de Salarios (Subsector Público Nacional)',
    limitationNote: 'Separa subsector público nacional de provincial.',
    byGov: {
      cfk: { varReal: 1.2, status: 'Expansión tanto en dotación (+14%) como en salario real', dir: 'pos' },
      macri: { varReal: -21.4, status: 'Ajuste real por paritarias debajo de la inflación', dir: 'neg' },
      alberto: { varReal: -14.2, status: 'Licuación salarial acelerada en 2022-2023', dir: 'neg' },
      milei: { varReal: -18.5, status: 'Mayor recorte real dentro del ajuste fiscal del gasto primario', dir: 'neg' }
    }
  },
  {
    id: 'informales_no_reg',
    groupName: 'Trabajadores Informales (Sector Privado No Registrado)',
    sourceEndpoint: 'INDEC · Salarios No Registrados y Encuesta Permanente de Hogares (EPH)',
    limitationNote:
      'Advertencia metodológica: la serie de Índice de Salarios No Registrados del INDEC inicia en oct. 2016 (con 5 meses de rezago muestral EPH). Para 2011-2015 se estima vía microdatos EPH.',
    byGov: {
      cfk: { varReal: -4.5, status: 'Informalidad estancada en ~33% de asalariados', dir: 'neg' },
      macri: { varReal: -25.4, status: 'Pérdida de un cuarto del poder de compra', dir: 'neg' },
      alberto: { varReal: -34.6, status: 'Desplome histórico: creció la cantidad de informales pero con sueldos de pobreza', dir: 'neg' },
      milei: { varReal: -1.2, status: 'Freno a la caída por menor inflación, pero la tasa de empleo informal subió de 18,9% a 20,2% (2T 2026)', dir: 'neutral' }
    }
  },
  {
    id: 'jubilados_minima',
    groupName: 'Jubilados y Pensionados (Haber Mínimo + Bonos)',
    sourceEndpoint: 'ANSES · Haber Mínimo Previsional e IPC Nacional (INDEC)',
    limitationNote: 'Compara el haber mínimo efectivo (incluyendo refuerzos/bonos) deflactado por IPC.',
    byGov: {
      cfk: { varReal: 6.4, status: 'Fórmula de movilidad semestral superó a la inflación promedio', dir: 'pos' },
      macri: { varReal: -19.2, status: 'Cambio de fórmula en dic. 2017 y rezago frente al salto inflacionario 2018-19', dir: 'neg' },
      alberto: { varReal: -28.5, status: 'Suspensión de fórmula en 2020 y licuación que obligó a bonos discrecionales', dir: 'neg' },
      milei: { varReal: -8.4, status: 'El haber base subió por indexación mensual IPC (DNU 274/24), pero el congelamiento del bono de $70.000 redujo el haber mínimo total real', dir: 'neg' }
    }
  },
  {
    id: 'hogares_vulnerables_auh',
    groupName: 'Hogares Vulnerables con Niños (AUH + Tarjeta Alimentar vs. CBA)',
    sourceEndpoint: 'INDEC · Canasta Básica Alimentaria (CBA) y Canasta de Crianza',
    limitationNote: 'Mide qué porcentaje de la Canasta Básica Alimentaria (indigencia) cubre la transferencia directa.',
    byGov: {
      cfk: { varReal: 67.0, status: 'Cobertura promedio del 67% de la CBA por hijo', dir: 'pos' },
      macri: { varReal: 63.0, status: 'Cobertura promedio del 63% de la CBA', dir: 'neutral' },
      alberto: { varReal: 52.0, status: 'La inflación de alimentos de 2023 redujo la cobertura al 52% de la CBA', dir: 'neg' },
      milei: { varReal: 98.0, status: 'Duplicación real de AUH + Alimentar: cubre ~98% de la CBA (explica baja de indigencia a 7,5%)', dir: 'pos' }
    }
  }
];

/**
 * Los 9 Cruces del Laboratorio Económico (Versión 2.0 Ampliada y Rigurosa)
 */
export const CROSS_DATA_ANALYSES = [
  {
    id: 'cruce_1_bolsillo',
    number: '01',
    title: 'Bolsillo Real, Jubilaciones y Canastas Básicas (CBT)',
    question: '¿Cuántas Canastas Básicas Totales pudo comprar un salario y cómo evolucionó cada sector?',
    endpointsUsed: ['INDEC · Índice de Salarios', 'INDEC · Precios al Consumidor (IPC)', 'INDEC · Canasta Básica (CBA y CBT)'],
    formula: 'Salario Nominal por Sector y Haber Mínimo ÷ Valorización Mensual CBT ($528.318,67 adulto equiv. en sep-2026)',
    methodologicalCaveat:
      'La serie de salarios no registrados de INDEC comienza en octubre de 2016. La comparación 2011–2015 utiliza remuneraciones EPH deflactadas según el modo histórico elegido.',
    keyConclusion:
      'En nivel absoluto, el período 2011–2015 registró la mayor capacidad de compra en canastas básicas (1,82 CBT por salario medio). Entre 2016 y 2019 se observó una caída simétrica (~-19,8%) en todos los segmentos. Entre 2019 y 2023 se produjo una divergencia inédita: el salario formal cayó -6,8% pero el informal se desplomó -34,6% y las jubilaciones -28,5%. Entre dic. 2023 y sep. 2026, la desinflación permitió recuperar el salario privado registrado (+3,4%), mientras el ajuste se concentró en el empleo público nacional (-18,5%) y en el bono jubilatorio congelado.'
  },
  {
    id: 'cruce_2_trabajadores_pobres',
    number: '02',
    title: 'Trabajadores Pobres, Informalidad y Desocupación (EPH)',
    question: '¿Qué relación hubo entre tasa de desempleo, empleo formal/informal y pobreza?',
    endpointsUsed: ['INDEC · Pobreza e Indigencia (EPH)', 'INDEC · Mercado de Trabajo (EPH)'],
    formula: 'Tasa de Pobreza Semestral EPH × (Tasa de Desocupación + Tasa de Empleo Formal 24,7% e Informal 20,2% en 2T 2026)',
    methodologicalCaveat:
      'La pobreza se mide semestralmente y el mercado laboral trimestralmente. La coexistencia de baja desocupación y alta pobreza describe un fenómeno simultáneo, condicionado tanto por la informalidad como por la aceleración inflacionaria.',
    keyConclusion:
      'Los datos oficiales de Pobreza y Mercado de Trabajo del INDEC revelan dos fases opuestas: (1) En 2023 el desempleo bajó al mínimo de 5,7% (4T 2023), pero la pobreza escaló a 41,7% (2S 2023) porque los ingresos de los ocupados crecieron por debajo de la CBT. (2) Entre 2024 y 2026 ocurrió lo inverso: la pobreza bajó de 41,7% (y 52,9% en 1S 2024) a 32,3% en 1S 2026 al moderarse la inflación, pero la desocupación subió de 5,7% a 7,9% (2T 2026) y el empleo formal cayó de 26,7% a 24,7%.'
  },
  {
    id: 'cruce_3_modelo_productivo',
    number: '03',
    title: 'Modelo Productivo: Industria y Construcción Real vs. Energía, Minería y Agro',
    question: '¿Cómo se comportaron las ramas urbanas intensivas en mano de obra frente a los sectores primarios exportadores?',
    endpointsUsed: [
      'INDEC · Actividad Económica por Sectores (EMAE)',
      'INDEC · Producción Industrial Manufacturera (IPI)',
      'INDEC · Producción Minera y Energética (IPI)',
      'INDEC · Costo de la Construcción (ICC)'
    ],
    formula: 'EMAE Industria y Construcción vs. EMAE Agro e Índice de Producción Minera y Energética (Litio + No Convencional)',
    methodologicalCaveat:
      'Para medir volumen físico de construcción se utiliza el EMAE Sector Construcción / ISAC, reservando el Índice del Costo de la Construcción (ICC) exclusivamente para medir costos por m².',
    keyConclusion:
      'Durante 2019–2023 la protección cambiaria y la obra pública impulsaron la Industria (+7,2%) y la Construcción (+9,8%). En cambio, durante 2023–2026 la apertura comercial y el recorte de obra pública redujeron la Construcción (-14,8%) y mantuvieron rezagada la Manufactura (-3,1%), mientras que el IPI Minero y Energético creció +21,4% (con 9.798 toneladas mensuales de carbonato de litio y récord de gas y petróleo no convencional en sep. 2026).'
  },
  {
    id: 'cruce_4_superavit_comercial',
    number: '04',
    title: 'Anatomía del Sector Externo (Cantidades vs. Precios de Exportación e Importación)',
    question: '¿Los saldos comerciales se explicaron por mayores volúmenes exportados, mejores precios internacionales o caída de importaciones?',
    endpointsUsed: [
      'INDEC · Exportaciones de Bienes (FOB)',
      'INDEC · Importaciones de Bienes (CIF)',
      'INDEC · Actividad Económica General (EMAE)'
    ],
    formula: 'Exportaciones FOB (Precios × Cantidades) − Importaciones CIF por Uso Económico',
    methodologicalCaveat:
      'Una baja en el valor importado puede reflejar tanto recesión industrial como sustitución energética (menor importación de GNL y gasoil por el gasoducto de Vaca Muerta).',
    keyConclusion:
      'Entre 2011 y 2015 las exportaciones cayeron -31,5% y el país pasó a déficit energético y comercial (-USD 2.668 M). En 2019 Macri logró +USD 15.990 M con fuerte baja de importaciones por recesión. En 2022 Alberto Fernández tuvo récord de precios de exportación (USD 88.446 M) pero la sequía de 2023 dejó un déficit de -USD 6.925 M. Entre 2024 y 2026 Milei acumuló +USD 46.850 M de superávit comercial gracias a mayores cantidades exportadas (+24,8%) y a la reversión estructural de la balanza energética.'
  },
  {
    id: 'cruce_5_vulnerabilidad_crianza',
    number: '05',
    title: 'Vulnerabilidad Social: Canasta Alimentaria (CBA), AUH y Canasta de Crianza',
    question: '¿Cuánto costó alimentar y criar a un niño y qué proporción cubrieron las políticas de ingresos?',
    endpointsUsed: ['INDEC · Canasta Básica (CBA y CBT)', 'INDEC · Canasta de Crianza', 'INDEC · Pobreza e Indigencia (EPH)'],
    formula: 'Transferencia AUH + Alimentar ÷ CBA Adulto Equivalente y Canasta de Crianza ($570.831 a $728.849 en sep-2026)',
    methodologicalCaveat:
      'La Canasta de Crianza oficial del INDEC fue lanzada en 2023 con serie reconstruida desde enero de 2020 (incluye costo de bienes y servicios + costo de cuidado).',
    keyConclusion:
      'En septiembre de 2026 la Canasta de Crianza oficial alcanzó $570.831,58 para menores de 1 año y $728.849,59 para niños de 6 a 12 años. Mientras que en 2023 la aceleración del precio de los alimentos licuó la AUH hasta cubrir solo el 52% de la CBA (llevando la indigencia a 11,9%), el refuerzo focalizado de AUH y Tarjeta Alimentar entre 2024 y 2026 elevó la cobertura al 98% de la CBA, permitiendo que la indigencia baje del pico de 18,1% (1S 2024) a 7,5% (1S 2026).'
  },
  {
    id: 'cruce_6_actividad_inflacion',
    number: '06',
    title: 'Actividad Mensual (EMAE) vs. Régimen Inflacionario (IPC)',
    question: '¿Fue sostenible el crecimiento cuando se aceleró la inflación?',
    endpointsUsed: [
      'INDEC · Actividad Económica Nivel General (EMAE)',
      'INDEC · Precios al Consumidor (IPC)'
    ],
    formula: 'Variación Interanual EMAE Original y Tendencia-Ciclo (154,32 en ago-2026) vs. IPC Mensual/Anual',
    methodologicalCaveat:
      'Utiliza el EMAE mensual base 2004=100 para mantener consistencia de frecuencia con el IPC mensual.',
    keyConclusion:
      'La serie 2011–2026 muestra que cada intento de impulsar la actividad tolerando mayor inflación terminó frenando el EMAE pocos trimestres después (2014, 2018-2019 y 2023). A la inversa, los programas de estabilización generaron contracciones iniciales del EMAE (1S 2024) seguidas de recuperación en 2025 y amesetamiento en 2026 (EMAE tendencia-ciclo en 154,32 en agosto de 2026).'
  },
  {
    id: 'cruce_7_estado_sostenibilidad',
    number: '07',
    title: 'Estado, Dólares y Sostenibilidad Macroeconómica (Fiscal × Reservas × Brecha)',
    question: '¿En qué condiciones de solvencia fiscal y cambiaria dejó el Estado cada presidente?',
    endpointsUsed: ['Ministerio de Economía y BCRA (Series Oficiales)', 'INDEC · Intercambio Comercial Argentino'],
    formula: 'Resultado Financiero (% PBI) + Variación de Reservas Netas BCRA (USD) + Brecha Cambiaria (%)',
    methodologicalCaveat:
      'Distingue Reservas Brutas de Reservas Netas (descontando encajes en dólares, swaps y préstamos de corto plazo) y Resultado Primario de Resultado Financiero (incluyendo intereses de deuda).',
    keyConclusion:
      'CFK entregó baja deuda externa pero déficit financiero de -5,1% del PBI y reservas netas agotadas (-USD 1.800 M). Macri redujo el déficit primario a -0,4% y dejó +USD 12.400 M de reservas netas, pero elevó la deuda pública a 89,8% del PBI. Alberto Fernández dejó un déficit financiero de -6,1% del PBI, reservas netas en -USD 11.500 M y brecha del 158%. Milei revirtió el déficit a superávit financiero (+0,4% del PBI), redujo la brecha a 6,5% y recompuso reservas netas en +USD 18.300 M.'
  },
  {
    id: 'cruce_8_crecimiento_distributivo',
    number: '08',
    title: 'Crecimiento Distributivo (EMAE × Empleo Formal × Desigualdad Gini × Pobreza)',
    question: '¿Cuándo el crecimiento económico redujo la desigualdad y creó empleo formal?',
    endpointsUsed: [
      'INDEC · Actividad Económica Nivel General (EMAE)',
      'INDEC · Mercado de Trabajo (EPH)',
      'INDEC · Pobreza e Indigencia (EPH)'
    ],
    formula: 'Variación EMAE × Tasa de Empleo Formal EPH × Coeficiente de Gini de Ingreso Per Cápita Familiar',
    methodologicalCaveat:
      'El coeficiente de Gini EPH mide desigualdad entre perceptores urbanos declarados en la encuesta.',
    keyConclusion:
      'El menor nivel de desigualdad (Gini 0,412) y mayor proporción de empleo formal (27,8%) se registraron en 2011–2015, aunque sin crecimiento neto per cápita. Con Macri el Gini empeoró a 0,439. Con Alberto Fernández se mantuvo en 0,435 con expansión de empleo informal. Con Milei (a 2026) la pobreza bajó a 32,3% por menor inflación, pero el coeficiente de Gini se ubicó en 0,441 debido a la brecha entre sectores dinámicos (energía/finanzas) y pérdida de empleo formal (24,7%).'
  },
  {
    id: 'cruce_9_tarifas_vs_alimentos',
    number: '09',
    title: 'Tarifas y Servicios Regulados vs. Bienes de Consumo y Alimentos (COICOP)',
    question: '¿Cómo cambió el peso de los gastos fijos (luz, gas, agua, transporte) frente a la comida y bienes?',
    endpointsUsed: ['INDEC · Precios al Consumidor por Rubros y Regulados'],
    formula: 'IPC Regulados (43,3% i.a.) y Vivienda/Servicios (49,1% i.a.) vs. Bienes (29,2% i.a.) y Alimentos (35,1% i.a.) en sep-2026',
    methodologicalCaveat:
      'El clasificador COICOP Argentina 2019 del INDEC separa bienes de servicios y agrupa en "Regulados" a las tarifas y precios administrados por el Estado.',
    keyConclusion:
      'Entre 2011 y 2015 las tarifas de servicios públicos permanecieron subsidiadas (cubriendo menos del 20% del costo real), lo que preservó el poder adquisitivo en bienes pero generó déficit fiscal y crisis energética. Con Macri (2016-18) la recomposición tarifaria aceleró los precios regulados pero se frenó en 2019 tras las devaluaciones. Con Alberto Fernández se volvió a congelar el cuadro tarifario aumentando el déficit de subsidios. Con Milei (2024–2026) el sinceramiento de tarifas provocó que los Servicios Regulados aumentaran 43,3% i.a. y Vivienda/Gas/Luz 49,1% i.a. en sep. 2026, muy por encima de los Bienes (29,2% i.a.) y Alimentos (35,1% i.a.), incrementando el peso de los costos fijos sobre el ingreso disponible familiar.'
  }
];

/**
 * Las 9 Preguntas Objetivas del Cuestionario Ciudadano (Escala 1 al 10)
 * Todas vinculadas estrictamente a indicadores medibles (0% subjetividad partidaria)
 */
export const CITIZEN_PRIORITY_QUESTIONS = [
  {
    id: 'q_inflacion',
    dimensionKey: 'precios',
    Order: 1,
    questionTitle: '¿Cuánto te importa que baje la inflación y que los precios sean estables?',
    questionContext: 'Medido por la variación anual y mensual del Índice de Precios al Consumidor (IPC INDEC) y la desaceleración respecto a la inflación recibida.',
    dataSummaryByGov: {
      cfk: 'Promedió 29,8% anual (reconstrucción) / 15,6% (oficial); subió de 22,8% a 26,9%.',
      macri: 'La recibió en 26,9% y la duplicó hasta 53,8% anual (promedio 41,2%).',
      alberto: 'La recibió en 53,8% y la cuadruplicó hasta 211,4% anual (promedio 88,0%).',
      milei: 'La recibió en 211,4% anual y la redujo a 38,7% interanual en sep. 2026 (~1,7% mensual).'
    }
  },
  {
    id: 'q_bolsillo',
    dimensionKey: 'bolsillo',
    Order: 2,
    questionTitle: '¿Cuánto te importa que los sueldos y las jubilaciones compren más Canastas Básicas?',
    questionContext: 'Medido por el Índice de Salarios del INDEC y el haber jubilatorio mínimo divididos por el valor de la Canasta Básica Total (CBT).',
    dataSummaryByGov: {
      cfk: 'Mayor nivel absoluto: el salario medio compraba 1,82 CBT y la jubilación mínima subió +6,4% real.',
      macri: 'El salario real cayó -19,8% (1,44 CBT) y la jubilación mínima cayó -19,2%.',
      alberto: 'El salario promedio cayó -15,4% (1,21 CBT), el informal -34,6% y la jubilación -28,5%.',
      milei: 'El privado registrado recuperó +3,4% vs. 2023 (1,38 CBT), pero el público nacional cayó -18,5% y la mínima con bono -8,4%.'
    }
  },
  {
    id: 'q_dolar_externo',
    dimensionKey: 'dolar_externo',
    Order: 3,
    questionTitle: '¿Cuánto te importa la estabilidad del dólar, que no haya brecha cambiaria y que el BCRA sume reservas?',
    questionContext: 'Medido por la Brecha Cambiaria (%), las Reservas Netas del BCRA (USD) y el Saldo Comercial de Exportaciones e Importaciones (INDEC).',
    dataSummaryByGov: {
      cfk: 'Impuso el cepo (brecha 54%), perdió USD 33.300 M de reservas netas y terminó con déficit comercial (-USD 2.668 M).',
      macri: 'Unificó al inicio pero devaluó fuerte en 2018-19; recompuso reservas (+USD 12.400 M) y dejó superávit comercial (+USD 15.990 M).',
      alberto: 'Brecha cambiaria récord del 158%, reservas netas negativas en -USD 11.500 M y déficit comercial en 2023 (-USD 6.925 M).',
      milei: 'Redujo la brecha de 158% a 6,5%, logró superávit comercial récord (+USD 46.850 M) y sumó +USD 18.300 M en reservas netas.'
    }
  },
  {
    id: 'q_empleo',
    dimensionKey: 'empleo',
    Order: 4,
    questionTitle: '¿Cuánto te importa que baje el desempleo y que crezca el trabajo formal registrado?',
    questionContext: 'Medido por la Tasa de Desocupación, Tasa de Empleo Formal y Tasa de Empleo Informal de la Encuesta Permanente de Hogares (EPH INDEC).',
    dataSummaryByGov: {
      cfk: 'Bajó la desocupación de 6,7% a 5,9% con 27,8% de tasa de empleo formal.',
      macri: 'La desocupación subió de 5,9% a 8,9% y el empleo formal cayó a 26,1%.',
      alberto: 'Bajó la desocupación al récord de 5,7% (4T 2023), aunque con alta creación de empleo informal (18,9%).',
      milei: 'La desocupación subió de 5,7% a 7,9% (2T 2026), el empleo formal bajó de 26,7% a 24,7% y el informal subió a 20,2%.'
    }
  },
  {
    id: 'q_pobreza',
    dimensionKey: 'social',
    Order: 5,
    questionTitle: '¿Cuánto te importa que bajen la pobreza y la indigencia (hambre) en el país?',
    questionContext: 'Medido por la Incidencia de Pobreza e Indigencia en Personas (EPH INDEC) y la cobertura de la Canasta Básica Alimentaria.',
    dataSummaryByGov: {
      cfk: 'Cerró en 30,1% en reconstrucción comparable (+4,1 pp vs 2011) o 4,7% en serie oficial discontinuada; AUH cubría 67% de la CBA.',
      macri: 'Bajó a 25,7% en 2017 pero tras las devaluaciones cerró en 35,5% (+5,4 pp) y 8,0% de indigencia.',
      alberto: 'Subió de 35,5% a 41,7% (+6,2 pp) y la indigencia a 11,9% con AUH cubriendo solo 52% de la CBA.',
      milei: 'Tras saltar a 52,9% en 1S 2024, bajó a 38,1% (2S 2024), 28,2% (2S 2025) y 32,3% en 1S 2026 (-9,4 pp vs 2023), con AUH cubriendo 98% de la CBA.'
    }
  },
  {
    id: 'q_produccion',
    dimensionKey: 'produccion',
    Order: 6,
    questionTitle: '¿Cuánto te importa que crezcan la actividad económica, la industria nacional y la construcción?',
    questionContext: 'Medido por el Estimador Mensual de Actividad Económica (EMAE General y Sectores) y el Índice de Producción Industrial Manufacturero (INDEC).',
    dataSummaryByGov: {
      cfk: 'PBI +1,5% (-2,8% per cápita), construcción +4,1% e industria manufacturera -3,2%.',
      macri: 'PBI -4,0% (-7,8% per cápita), industria manufacturera -13,6% y construcción -6,8%; creció el agro (+18,5%).',
      alberto: 'PBI +2,8% (-0,6% per cápita), industria manufacturera +7,2% y construcción +9,8%; cayó el agro por sequía (-19,4%).',
      milei: 'PBI +3,8% (+1,4% per cápita) impulsado por minería/energía (+21,4%) y agro (+31,2%), pero con caída en construcción (-14,8%) e industria (-3,1%).'
    }
  },
  {
    id: 'q_fiscal_deuda',
    dimensionKey: 'fiscal_deuda',
    Order: 7,
    questionTitle: '¿Cuánto te importa que el Estado no gaste más de lo que recauda (déficit cero) y baje la deuda?',
    questionContext: 'Medido por el Resultado Fiscal Primario y Financiero (% del PBI) y el ratio Deuda Pública Bruta / PBI.',
    dataSummaryByGov: {
      cfk: 'Amplió el déficit financiero a -5,1% del PBI (financiado con BCRA), aunque mantuvo deuda en 52,6% del PBI.',
      macri: 'Redujo el déficit primario a -0,4% del PBI, pero el financiero fue -3,8% y la deuda saltó a 89,8% del PBI (incluyendo FMI).',
      alberto: 'Entregó un déficit financiero de -6,1% del PBI (-2,9% primario) y deuda en 85,4% del PBI más pasivos del BCRA.',
      milei: 'Alcanzó superávit primario (+1,8% PBI) y financiero (+0,4% PBI) en el primer año y redujo el ratio de deuda a 74,2% del PBI.'
    }
  },
  {
    id: 'q_seguridad',
    dimensionKey: 'seguridad',
    Order: 8,
    questionTitle: '¿Cuánto te importa que mejore la seguridad ciudadana y bajen los homicidios?',
    questionContext: 'Medido por la Tasa de Homicidios Dolosos cada 100.000 habitantes (Sistema Nacional de Información Criminal - SNIC Ministerio de Seguridad).',
    dataSummaryByGov: {
      cfk: 'Pasó de 7,0 en 2011 (con pico de 7,6 en 2014) a 6,6 homicidios cada 100.000 hab. en 2015 (-5,7%).',
      macri: 'Redujo la tasa de homicidios de 6,6 a 5,1 cada 100.000 hab. entre 2015 y 2019 (-22,7%).',
      alberto: 'La tasa nacional bajó de 5,1 a 4,4 cada 100.000 hab. (-13,7%), aunque con pico crítico focalizado en Rosario.',
      milei: 'Redujo la tasa nacional de 4,4 a 3,8 cada 100.000 hab. (-13,6%, mínimo de la serie SNIC, con fuerte baja en Rosario).'
    }
  },
  {
    id: 'q_distribucion',
    dimensionKey: 'distribucion',
    Order: 9,
    questionTitle: '¿Cuánto te importa que el crecimiento sea equitativo y baje la desigualdad entre ricos y pobres?',
    questionContext: 'Medido por el Coeficiente de Gini del ingreso per cápita familiar (EPH INDEC, donde menor valor = mayor igualdad).',
    dataSummaryByGov: {
      cfk: 'Registró el menor coeficiente de Gini de la serie (0,412 al finalizar en 2015).',
      macri: 'La desigualdad subió de 0,412 a 0,439 entre 2015 y 2019.',
      alberto: 'Se mantuvo elevada en 0,435, con fuerte caída de los ingresos informales.',
      milei: 'Se ubicó en 0,441 por la heterogeneidad entre sectores de alta productividad y pérdida de empleo formal urbano.'
    }
  }
];

export const VOTER_PROFILES = [
  {
    id: 'equilibrado',
    name: 'Equilibrado (Todo igual)',
    description: 'Asigna exactamente el mismo peso (5/10) a las 9 dimensiones estadísticas.',
    weights: {
      precios: 5,
      bolsillo: 5,
      dolar_externo: 5,
      empleo: 5,
      social: 5,
      produccion: 5,
      fiscal_deuda: 5,
      seguridad: 5,
      distribucion: 5
    }
  },
  {
    id: 'anti_inflacion_orden',
    name: 'Prioridad: Bajar Inflación, Dólar, Déficit y Seguridad',
    description: 'Prioriza estabilidad de precios, superávit fiscal, reservas y baja de homicidios.',
    weights: {
      precios: 10,
      bolsillo: 6,
      dolar_externo: 10,
      empleo: 4,
      social: 7,
      produccion: 4,
      fiscal_deuda: 10,
      seguridad: 10,
      distribucion: 2
    }
  },
  {
    id: 'salario_consumo_igualdad',
    name: 'Prioridad: Sueldos, Jubilaciones, Empleo e Igualdad',
    description: 'Prioriza poder adquisitivo en canastas básicas, pleno empleo e igualdad distributiva.',
    weights: {
      precios: 5,
      bolsillo: 10,
      dolar_externo: 2,
      empleo: 10,
      social: 8,
      produccion: 7,
      fiscal_deuda: 3,
      seguridad: 4,
      distribucion: 10
    }
  },
  {
    id: 'industria_obra_empleo',
    name: 'Prioridad: Industria Nacional, Construcción y Trabajo',
    description: 'Prioriza fábricas locales, obra pública y mínima tasa de desocupación.',
    weights: {
      precios: 3,
      bolsillo: 7,
      dolar_externo: 3,
      empleo: 10,
      social: 6,
      produccion: 10,
      fiscal_deuda: 2,
      seguridad: 5,
      distribucion: 7
    }
  }
];

/**
 * Comparador Normalizado "Base 100 = Inicio de Mandato"
 * Nota metodológica explícita sobre periodicidad de cada serie
 */
export const BASE100_TRAJECTORIES = {
  months: ['M0 (Asume)', 'M6', 'M12 (Año 1)', 'M18', 'M24 (Año 2)', 'M30', 'M34/M36 (Actual Milei)', 'M42', 'M48 (Fin Mandato)'],
  indicators: {
    salarioReal: {
      title: 'Salario Real Promedio (Base 100 = Inicio de Mandato)',
      subtitle: 'Frecuencia mensual · Índice de Salarios INDEC ajustado por Inflación (IPC)',
      unit: 'Índice (Inicio=100)',
      frequencyNote: 'Serie mensual continua. El tramo M34 corresponde a agosto/septiembre de 2026 para el mandato en curso.',
      description: 'Muestra la trayectoria del poder adquisitivo promedio desde el mes de asunción hasta el final de cada mandato.',
      series: {
        cfk: [100, 101.2, 101.8, 101.4, 100.9, 96.5, 95.8, 97.1, 98.2],
        macri: [100, 93.8, 93.2, 95.1, 95.5, 89.2, 85.8, 81.8, 80.2],
        alberto: [100, 97.5, 96.7, 97.8, 98.2, 96.1, 94.0, 90.8, 84.6],
        milei: [100, 88.4, 92.8, 95.4, 96.8, 97.5, 97.9, null, null]
      }
    },
    actividadEmae: {
      title: 'Actividad Económica EMAE Desestacionalizado (Base 100 = Inicio de Mandato)',
      subtitle: 'Frecuencia mensual · Estimador Mensual de Actividad Económica (EMAE INDEC)',
      unit: 'Índice (Inicio=100)',
      frequencyNote: 'Serie mensual continua (enero 2004 a agosto 2026). No requiere interpolación.',
      description: 'Permite comparar caídas recesivas y recuperaciones al mismo mes de gestión.',
      series: {
        cfk: [100, 98.7, 99.0, 100.8, 101.4, 99.2, 100.2, 100.6, 101.5],
        macri: [100, 98.2, 97.9, 99.6, 100.7, 98.4, 98.2, 97.2, 96.0],
        alberto: [100, 82.4, 90.1, 96.4, 100.8, 104.2, 104.5, 103.5, 102.8],
        milei: [100, 95.4, 98.3, 101.4, 103.1, 103.6, 103.8, null, null]
      }
    },
    inflacionMensual: {
      title: 'Tasa de Inflación Mensual Equivalente (IPC INDEC)',
      subtitle: 'Frecuencia mensual · Índice de Precios al Consumidor (IPC Nacional INDEC)',
      unit: '% mensual',
      frequencyNote: 'Serie mensual. Para dic. 2023 se registra el salto de 25,5% y su posterior desaceleración hasta ~1,7% en sep. 2026.',
      description: 'Compara la velocidad mensual de suba de precios en cada semestre del mandato.',
      series: {
        cfk: [1.8, 1.9, 2.0, 2.1, 2.3, 3.4, 2.6, 2.0, 2.2],
        macri: [2.2, 3.5, 1.6, 1.7, 2.1, 3.2, 4.1, 3.6, 4.0],
        alberto: [4.0, 2.2, 3.4, 3.8, 3.6, 5.8, 6.2, 7.8, 12.8],
        milei: [25.5, 4.6, 2.7, 2.4, 2.1, 1.9, 1.7, null, null]
      }
    },
    pobrezaVariacion: {
      title: 'Variación de la Pobreza EPH respecto al Semestre de Asunción (en pp)',
      subtitle: 'Frecuencia semestral · Encuesta Permanente de Hogares (INDEC · Total 31 Aglomerados)',
      unit: 'Puntos % (pp)',
      frequencyNote:
        'Nota técnica: la EPH de pobreza es estrictamente semestral (1S y 2S). Cada punto de esta curva corresponde a un semestre oficial publicado por el INDEC, sin inventar meses intermedios.',
      description: 'Valores negativos (<0) indican reducción de la pobreza respecto al punto de partida; valores positivos (>0) indican aumento.',
      series: {
        cfk: [0, 0.5, 0.9, 1.2, 1.5, 4.8, 5.4, 4.4, 4.1],
        macri: [0, 0.2, -1.5, -4.4, -2.8, 1.9, 5.3, 5.3, 5.4],
        alberto: [0, 5.4, 6.5, 5.1, 1.8, 1.0, 3.7, 4.6, 6.2],
        milei: [0, 11.2, -3.6, -10.1, -13.5, -9.4, -9.4, null, null]
      }
    }
  }
};

/**
 * Estadísticas Regionales Oficiales INDEC (6 Regiones Estadísticas)
 * Fuente: /v1/ipc_nacional (IPC Regional) y /v1/pobreza_eph (Pobreza e Indigencia Regional EPH)
 */
export const REGIONAL_STATISTICS = [
  {
    id: 'gba',
    regionName: 'Gran Buenos Aires (CABA + 24 Partidos del Conurbano)',
    shortName: 'GBA',
    coberturaEPH: 'CABA y partidos del Gran Buenos Aires (~16 millones de habitantes)',
    ipcInteranualSep2026: 33.5,
    ipcFinAlberto: 210.1,
    ipcFinMacri: 52.9,
    pobreza1S2026: 34.8,
    pobrezaPico2024: 56.3,
    pobrezaFinAlberto: 45.5,
    cbtAdultoEquiv: 528318.67,
    caracteristicaClave:
      'Mayor aglomerado poblacional del país. Presenta fuerte disparidad interna entre CABA (baja pobreza y salarios altos) y el segundo cordón del Conurbano Bonaerense (alta concentración de informalidad y dependencia de canastas CBA/CBT).'
  },
  {
    id: 'pampeana',
    regionName: 'Región Pampeana',
    shortName: 'Pampeana',
    coberturaEPH: 'Interior de Buenos Aires, Córdoba, Santa Fe, Entre Ríos y La Pampa',
    ipcInteranualSep2026: 33.1,
    ipcFinAlberto: 212.8,
    ipcFinMacri: 54.1,
    pobreza1S2026: 30.1,
    pobrezaPico2024: 49.9,
    pobrezaFinAlberto: 38.6,
    cbtAdultoEquiv: 515400.0,
    caracteristicaClave:
      'Corazón agroindustrial y exportador de granos y manufacturas de origen agropecuario. La desinflación y la recuperación agrícola pos-sequía impulsaron una caída acelerada de la pobreza hacia 30,1%.'
  },
  {
    id: 'noroeste',
    regionName: 'Noroeste Argentino (NOA)',
    shortName: 'NOA',
    coberturaEPH: 'Jujuy, Salta, Tucumán, Catamarca, La Rioja y Santiago del Estero',
    ipcInteranualSep2026: 33.6,
    ipcFinAlberto: 212.5,
    ipcFinMacri: 55.5,
    pobreza1S2026: 38.2,
    pobrezaPico2024: 57.0,
    pobrezaFinAlberto: 45.6,
    cbtAdultoEquiv: 468200.0,
    caracteristicaClave:
      'Costos de canasta nominalmente más bajos que la media nacional, pero con elevada tasa de informalidad laboral estructural (>40%), lo que genera alta sensibilidad a los precios de alimentos y tarifas.'
  },
  {
    id: 'noreste',
    regionName: 'Noreste Argentino (NEA)',
    shortName: 'NEA',
    coberturaEPH: 'Chaco (Gran Resistencia), Corrientes, Formosa y Misiones (Posadas)',
    ipcInteranualSep2026: 36.9,
    ipcFinAlberto: 219.5,
    ipcFinMacri: 57.6,
    pobreza1S2026: 39.4,
    pobrezaPico2024: 62.9,
    pobrezaFinAlberto: 48.4,
    cbtAdultoEquiv: 455800.0,
    caracteristicaClave:
      'Históricamente la región con mayor vulnerabilidad social y menor nivel de salarios formales. Aunque bajó del pico de 62,9% en 1S 2024 al 39,4%, continúa liderando la tasa de pobreza y registra la mayor inflación interanual (36,9%).'
  },
  {
    id: 'cuyo',
    regionName: 'Región de Cuyo',
    shortName: 'Cuyo',
    coberturaEPH: 'Mendoza (Gran Mendoza), San Juan y San Luis',
    ipcInteranualSep2026: 33.0,
    ipcFinAlberto: 207.2,
    ipcFinMacri: 54.7,
    pobreza1S2026: 31.5,
    pobrezaPico2024: 52.3,
    pobrezaFinAlberto: 43.5,
    cbtAdultoEquiv: 492600.0,
    caracteristicaClave:
      'Economía diversificada basada en vitivinicultura, minería, comercio y turismo. Su nivel de inflación interanual (33,0%) corre alineado al promedio del país y la pobreza retrocedió 12 puntos respecto a 2023.'
  },
  {
    id: 'patagonia',
    regionName: 'Región Patagónica',
    shortName: 'Patagonia',
    coberturaEPH: 'Neuquén, Río Negro, Chubut, Santa Cruz, Tierra del Fuego',
    ipcInteranualSep2026: 30.3,
    ipcFinAlberto: 207.7,
    ipcFinMacri: 54.0,
    pobreza1S2026: 24.7,
    pobrezaPico2024: 41.4,
    pobrezaFinAlberto: 32.8,
    cbtAdultoEquiv: 642800.0,
    caracteristicaClave:
      'Menor tasa de pobreza del país (24,7%) y menor inflación interanual (30,3%), impulsada por el boom hidrocarburífero de Vaca Muerta y salarios energéticos elevados. Presenta el mayor costo de canasta básica debido al clima frío, transporte y distancias.'
  }
];

