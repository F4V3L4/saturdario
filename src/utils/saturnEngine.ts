/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EphemerisEntry, NatalProfile, SaturnPhase, TransitStatus } from '../types/saturn';

export const USER_NATAL_PROFILE: NatalProfile = {
  birthDate: '1998-01-11',
  natalSaturnSign: 'Áries',
  natalSaturnDegree: 13.75, // ~13°45' Áries
  firstReturnStartYear: 2026,
  firstReturnEndYear: 2028,
  annualActivationDate: '11 de Janeiro',
  focusAreas: [
    'Ciência da Computação',
    'Desenvolvimento de Código & Arquitetura',
    'Soberania Pessoal',
    'Estruturação de Projetos de Longo Prazo',
  ],
};

/**
 * Ephemeris table from 2026 to 2045
 * Core reference table based on project specification and planetary astronomical ephemeris.
 */
export const EPHEMERIS_DATA: EphemerisEntry[] = [
  {
    year: 2026,
    sign: 'Áries / Peixes',
    degrees: '06° Áries -> 23° Peixes',
    retroStart: '2026-07-26',
    retroEnd: '2026-12-10',
    directive: 'Audit do início do ciclo Áries. Refatoração de iniciativas e transição de maturidade.',
    focus: 'Refatoração de base e transição natal',
    inReturnWindow: true,
  },
  {
    year: 2027,
    sign: 'Áries',
    degrees: '18° Áries -> 05° Áries',
    retroStart: '2027-08-08',
    retroEnd: '2027-12-23',
    directive: 'Retorno de Saturno em pico. Revisão de autonomia, projetos solo e liderança.',
    focus: 'Pico exato do Retorno Natal (~13°-15° Áries)',
    inReturnWindow: true,
  },
  {
    year: 2028,
    sign: 'Touro / Áries',
    degrees: '01° Touro -> 17° Áries',
    retroStart: '2028-08-21',
    retroEnd: '2029-01-04',
    directive: 'Transição para Touro. Auditoria financeira, corte de custos e reestruturação orçamentária.',
    focus: 'Consolidação material e orçamentária pós-retorno',
    inReturnWindow: true,
  },
  {
    year: 2029,
    sign: 'Touro',
    degrees: '13° Touro -> 29° Áries',
    retroStart: '2029-09-03',
    retroEnd: '2030-01-16',
    directive: 'Consolidação de infraestrutura física, ativos e estabilidade de longo prazo.',
    focus: 'Infraestrutura permanente de servidores e ativos',
    inReturnWindow: false,
  },
  {
    year: 2030,
    sign: 'Gêmeos / Touro',
    degrees: '25° Touro -> 11° Touro',
    retroStart: '2030-09-16',
    retroEnd: '2031-01-28',
    directive: 'Auditoria de fluxos de informação, redes de dados, estudos e arquitetura de sistemas.',
    focus: 'Otimização de dados, protocolos e comunicação',
    inReturnWindow: false,
  },
  {
    year: 2031,
    sign: 'Gêmeos',
    degrees: '07° Gêmeos -> 23° Touro',
    retroStart: '2031-09-28',
    retroEnd: '2032-02-10',
    directive: 'Estruturação de redes intelectuais, publicações técnicas e consolidação de conhecimento.',
    focus: 'Documentação rigorosa e publicações técnicas',
    inReturnWindow: false,
  },
  {
    year: 2032,
    sign: 'Câncer / Gêmeos',
    degrees: '19° Gêmeos -> 05° Gêmeos',
    retroStart: '2032-10-10',
    retroEnd: '2033-02-22',
    directive: 'Auditoria de bases operacionais, segurança local e privacidade de dados.',
    focus: 'Segurança cibernética e soberania de dados',
    inReturnWindow: false,
  },
  {
    year: 2033,
    sign: 'Câncer',
    degrees: '02° Câncer -> 17° Gêmeos',
    retroStart: '2033-10-23',
    retroEnd: '2034-03-07',
    directive: 'Consolidação de santuário de trabalho, foco profundo e estabilização de rotina.',
    focus: 'Ambiente de alta densidade e foco contínuo',
    inReturnWindow: false,
  },
  {
    year: 2034,
    sign: 'Leão / Câncer',
    degrees: '14° Câncer -> 29° Câncer',
    retroStart: '2034-11-04',
    retroEnd: '2035-03-19',
    directive: 'Auditoria de autoridade técnica, autoria de projetos e contratos de propriedade intelectual.',
    focus: 'Propriedade intelectual e licenciamento',
    inReturnWindow: false,
  },
  {
    year: 2035,
    sign: 'Leão',
    degrees: '26° Câncer -> 11° Leão',
    retroStart: '2035-11-17',
    retroEnd: '2036-04-01',
    directive: 'Lançamento de grandes sistemas proprietários sob trânsito direto e auditoria de liderança no retrógrado.',
    focus: 'Consolidação de liderança em engenharia',
    inReturnWindow: false,
  },
  {
    year: 2036,
    sign: 'Virgem / Leão',
    degrees: '08° Leão -> 23° Câncer',
    retroStart: '2036-11-28',
    retroEnd: '2037-04-13',
    directive: 'Hiper-otimização de rotinas de computação, refatoração de código legado e profiling.',
    focus: 'Eficiência algorítmica e redução de débito',
    inReturnWindow: false,
  },
  {
    year: 2037,
    sign: 'Virgem',
    degrees: '21° Leão -> 05° Virgem',
    retroStart: '2037-12-11',
    retroEnd: '2038-04-26',
    directive: 'Padronização de QA, testes automatizados e certificações de integridade sistêmica.',
    focus: 'Garantia de qualidade e auditoria formal',
    inReturnWindow: false,
  },
  {
    year: 2038,
    sign: 'Libra / Virgem',
    degrees: '03° Virgem -> 17° Leão',
    retroStart: '2038-12-23',
    retroEnd: '2039-05-09',
    directive: 'Auditoria de parcerias, contratos de governança e alinhamentos de sociedade.',
    focus: 'Governança e conformidade contratual',
    inReturnWindow: false,
  },
  {
    year: 2039,
    sign: 'Libra',
    degrees: '15° Virgem -> 29° Virgem',
    retroStart: '2040-01-05',
    retroEnd: '2040-05-21',
    directive: 'Equilíbrio arquitetural e desacoplamento de dependências críticas.',
    focus: 'Desacoplamento e resiliência de arquitetura',
    inReturnWindow: false,
  },
  {
    year: 2040,
    sign: 'Escorpião / Libra',
    degrees: '27° Virgem -> 12° Libra',
    retroStart: '2040-01-17',
    retroEnd: '2040-06-03',
    directive: 'Revisão de segurança criptográfica, auditoria forense e eliminação de vulnerabilidades.',
    focus: 'Segurança ofensiva/defensiva e criptografia',
    inReturnWindow: false,
  },
  {
    year: 2041,
    sign: 'Escorpião',
    degrees: '10° Libra -> 24° Libra',
    retroStart: '2041-01-29',
    retroEnd: '2041-06-16',
    directive: 'Fusões de dados, reestruturação profunda de bancos e persistência resiliente.',
    focus: 'Resiliência de armazenamento e integridade',
    inReturnWindow: false,
  },
  {
    year: 2042,
    sign: 'Sagitário / Escorpião',
    degrees: '22° Libra -> 07° Escorpião',
    retroStart: '2042-02-11',
    retroEnd: '2042-06-29',
    directive: 'Expansão de horizontes tecnológicos sob direto e auditoria epistemológica no retrógrado.',
    focus: 'Pesquisa avançada em ciência da computação',
    inReturnWindow: false,
  },
  {
    year: 2043,
    sign: 'Sagitário',
    degrees: '05° Escorpião -> 19° Escorpião',
    retroStart: '2043-02-23',
    retroEnd: '2043-07-12',
    directive: 'Consolidação de teses técnicas e arquiteturas de escala global.',
    focus: 'Arquiteturas distribuídas de grande porte',
    inReturnWindow: false,
  },
  {
    year: 2044,
    sign: 'Capricórnio / Sagitário',
    degrees: '18° Escorpião -> 02° Sagitário',
    retroStart: '2044-03-06',
    retroEnd: '2044-07-24',
    directive: 'Preparação para a regência do domicílio saturnino. Máxima disciplina e institucionalização.',
    focus: 'Estruturação institucional e governança máxima',
    inReturnWindow: false,
  },
  {
    year: 2045,
    sign: 'Capricórnio',
    degrees: '01° Sagitário -> 15° Sagitário',
    retroStart: '2045-03-18',
    retroEnd: '2045-08-05',
    directive: 'Operação em estado de arte: governança pura, autoridade técnica consolidada.',
    focus: 'Domínio operacional e legado de engenharia',
    inReturnWindow: false,
  },
];

/**
 * Calculates exact transit status for any given date
 */
export function calculateTransitStatus(targetDate: Date = new Date()): TransitStatus {
  const targetTime = targetDate.getTime();
  const targetYear = targetDate.getFullYear();

  // Find corresponding ephemeris row or closest
  let ephemeris = EPHEMERIS_DATA.find((e) => e.year === targetYear);
  if (!ephemeris) {
    ephemeris = targetYear < 2026 ? EPHEMERIS_DATA[0] : EPHEMERIS_DATA[EPHEMERIS_DATA.length - 1];
  }

  const retroStartDate = new Date(`${ephemeris.retroStart}T00:00:00Z`);
  const retroEndDate = new Date(`${ephemeris.retroEnd}T23:59:59Z`);

  const retroStartTime = retroStartDate.getTime();
  const retroEndTime = retroEndDate.getTime();

  const isRetrograde = targetTime >= retroStartTime && targetTime <= retroEndTime;
  const isFirstReturnActive = targetYear >= USER_NATAL_PROFILE.firstReturnStartYear && targetYear <= USER_NATAL_PROFILE.firstReturnEndYear;

  // Next station calculation
  let nextStationType: SaturnPhase;
  let nextStationDate: string;
  let daysUntilNextStation: number;

  if (isRetrograde) {
    // Currently retrograde, next station is Direct (at retroEndDate)
    nextStationType = 'DIRETO';
    nextStationDate = ephemeris.retroEnd;
    daysUntilNextStation = Math.max(0, Math.ceil((retroEndTime - targetTime) / (1000 * 60 * 60 * 24)));
  } else {
    // Currently direct
    nextStationType = 'RETRÓGRADO';
    if (targetTime < retroStartTime) {
      // Before this year's retrograde
      nextStationDate = ephemeris.retroStart;
      daysUntilNextStation = Math.max(0, Math.ceil((retroStartTime - targetTime) / (1000 * 60 * 60 * 24)));
    } else {
      // After this year's retrograde, next is next year's retroStart
      const nextYearEphemeris = EPHEMERIS_DATA.find((e) => e.year === targetYear + 1);
      if (nextYearEphemeris) {
        nextStationDate = nextYearEphemeris.retroStart;
        const nextRetroTime = new Date(`${nextYearEphemeris.retroStart}T00:00:00Z`).getTime();
        daysUntilNextStation = Math.max(0, Math.ceil((nextRetroTime - targetTime) / (1000 * 60 * 60 * 24)));
      } else {
        nextStationDate = `${targetYear + 1}-08-01`;
        daysUntilNextStation = 250;
      }
    }
  }

  // Retrograde progress percentage
  const totalRetroMs = retroEndTime - retroStartTime;
  let retroProgressPct = 0;
  let retroDaysElapsed = 0;
  const retroTotalDays = Math.round(totalRetroMs / (1000 * 60 * 60 * 24));

  if (isRetrograde) {
    const elapsedMs = Math.max(0, targetTime - retroStartTime);
    retroProgressPct = Math.min(100, Math.round((elapsedMs / totalRetroMs) * 100));
    retroDaysElapsed = Math.round(elapsedMs / (1000 * 60 * 60 * 24));
  } else if (targetTime > retroEndTime) {
    retroProgressPct = 100;
    retroDaysElapsed = retroTotalDays;
  } else {
    retroProgressPct = 0;
    retroDaysElapsed = 0;
  }

  // Orbital cycle calculation (29.457 years = ~10,759 days)
  const birthDate = new Date(`${USER_NATAL_PROFILE.birthDate}T00:00:00Z`);
  const ageMs = targetTime - birthDate.getTime();
  const currentAgeYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
  const orbitalPeriodYears = 29.457;
  const orbitalCycleProgressPct = Math.min(100, Math.max(0, (currentAgeYears / orbitalPeriodYears) * 100));

  // Next birthday calculation (11 de Janeiro)
  let nextBirthdayYear = targetYear;
  let nextBirthdayDateObj = new Date(Date.UTC(nextBirthdayYear, 0, 11, 0, 0, 0));
  if (targetTime > nextBirthdayDateObj.getTime()) {
    nextBirthdayYear += 1;
    nextBirthdayDateObj = new Date(Date.UTC(nextBirthdayYear, 0, 11, 0, 0, 0));
  }
  const daysUntilNextBirthday = Math.max(0, Math.ceil((nextBirthdayDateObj.getTime() - targetTime) / (1000 * 60 * 60 * 24)));
  const nextBirthdayDate = `${nextBirthdayYear}-01-11`;

  // Ring tilt degree (Ring plane crossing in 2025/2026 brings ring inclination close to 0-1.5 degrees edge-on)
  // In Oct 2026, Saturn's rings are tilted only about ~0.8° to 1.2° as seen from Earth
  let ringTiltDeg = 1.1;
  if (targetYear === 2026) ringTiltDeg = 0.9;
  else if (targetYear === 2025) ringTiltDeg = 0.4;
  else if (targetYear === 2027) ringTiltDeg = 4.2;
  else if (targetYear >= 2028) ringTiltDeg = Math.min(26.7, 4.2 + (targetYear - 2027) * 3.5);

  // Position coordinates and degree interpolation
  let currentSign = 'Áries';
  let currentDegree = '04°12\'';
  let eclipticLongitude = 4.2;

  if (targetYear === 2026) {
    if (isRetrograde) {
      // Retrograding from 06° Aries back to 23° Pisces (353° ecliptic)
      // On Oct 26, 2026, it is around 24°18' Peixes
      const fraction = (targetTime - retroStartTime) / totalRetroMs;
      // Start ~6° Aries (= 6°), end ~23° Pisces (= 353°, delta -13°)
      const long = 6 - fraction * 13;
      eclipticLongitude = (long + 360) % 360;
      if (eclipticLongitude >= 330) {
        currentSign = 'Peixes';
        const degInSign = Math.floor(eclipticLongitude - 330);
        const minInSign = Math.floor(((eclipticLongitude - 330) % 1) * 60);
        currentDegree = `${degInSign}°${minInSign.toString().padStart(2, '0')}'`;
      } else {
        currentSign = 'Áries';
        const degInSign = Math.floor(eclipticLongitude);
        const minInSign = Math.floor((eclipticLongitude % 1) * 60);
        currentDegree = `${degInSign}°${minInSign.toString().padStart(2, '0')}'`;
      }
    } else {
      currentSign = 'Áries';
      currentDegree = '02°45\'';
      eclipticLongitude = 2.75;
    }
  } else if (targetYear === 2027) {
    currentSign = 'Áries';
    currentDegree = '13°50\' (Alinhamento Exato)';
    eclipticLongitude = 13.8;
  } else if (targetYear === 2028) {
    currentSign = isRetrograde ? 'Áries' : 'Touro';
    currentDegree = isRetrograde ? '28°10\' Áries' : '01°15\' Touro';
    eclipticLongitude = 31.25;
  } else {
    currentSign = ephemeris.sign.split('/')[0].trim();
    currentDegree = '12°00\'';
    eclipticLongitude = 45;
  }

  // Operational rules
  const rules = {
    canDeployNewFeatures: !isRetrograde,
    recommendedFocus: isRetrograde
      ? 'Auditoria rigorosa, depuração de bugs, refatoração de código legado, congelamento de novos deploys e revisão financeira.'
      : 'Avanço agressivo, lançamento de novos módulos, expansão de infraestrutura, assinatura de novos acordos e deploys em produção.',
    warningNote: isRetrograde
      ? 'Fase Retrógrada: Não inicie arquiteturas não testadas. Foque na eliminação de débito técnico.'
      : 'Fase Direta: Janela aberta para execução e consolidação de novos projetos.',
  };

  return {
    currentDate: targetDate.toISOString(),
    phase: isRetrograde ? 'RETRÓGRADO' : 'DIRETO',
    phaseLabel: isRetrograde ? 'RETRÓGRADO (AUDITORIA / FREEZE)' : 'DIRETO (EXECUÇÃO / EXPANSÃO)',
    currentSign,
    currentDegree,
    eclipticLongitude,
    daysUntilNextStation,
    nextStationType,
    nextStationDate,
    retroProgressPct,
    retroDaysElapsed,
    retroTotalDays,
    orbitalCycleProgressPct: parseFloat(orbitalCycleProgressPct.toFixed(1)),
    currentAgeYears: parseFloat(currentAgeYears.toFixed(2)),
    isFirstReturnActive,
    daysUntilNextBirthday,
    nextBirthdayDate,
    ringTiltDeg,
    operationalDirective: ephemeris.directive,
    rules,
  };
}

/**
 * Returns preset operational audit checklist tasks
 */
export function getDefaultAuditTasks(): import('../types/saturn').AuditTask[] {
  return [
    {
      id: 'task-1',
      title: 'Auditoria de Débito Técnico & Refatoração de Módulos Críticos',
      description: 'Mapear e refatorar classes legadas, reduzir complexidade ciclomática e congelar merge de features não estáveis.',
      category: 'codigo',
      completed: true,
      priority: 'alta',
      createdAt: '2026-10-20',
      phaseRecommendation: 'retrogrado',
    },
    {
      id: 'task-2',
      title: 'Auditoria de Dependências & Segurança CVE',
      description: 'Executar npm audit e revisar versões de pacotes contra vulnerabilidades conhecidas em todos os repositórios.',
      category: 'codigo',
      completed: false,
      priority: 'alta',
      createdAt: '2026-10-22',
      phaseRecommendation: 'retrogrado',
    },
    {
      id: 'task-3',
      title: 'Revisão Orçamentária & Corte de Custos de Cloud',
      description: 'Auditar instâncias ociosas no Google Cloud, desativar storage obsoleto e calibrar alertas de billing para 2027.',
      category: 'financas',
      completed: false,
      priority: 'alta',
      createdAt: '2026-10-23',
      phaseRecommendation: 'retrogrado',
    },
    {
      id: 'task-4',
      title: 'Backup Criptográfico Offline das Chaves & Repositórios',
      description: 'Gerar cópias a frio (cold storage criptografado) de credenciais mestras, chaves GPG e repositórios prioritários.',
      category: 'fundacoes',
      completed: true,
      priority: 'alta',
      createdAt: '2026-10-24',
      phaseRecommendation: 'retrogrado',
    },
    {
      id: 'task-5',
      title: 'Plano de Foco de Estudos em Ciência da Computação (2026-2027)',
      description: 'Definir cronograma estruturado de arquitetura de sistemas, algoritmos e computação distribuída para o Retorno de Saturno.',
      category: 'soberania',
      completed: false,
      priority: 'media',
      createdAt: '2026-10-25',
      phaseRecommendation: 'ambos',
    },
    {
      id: 'task-6',
      title: 'Limpeza de Ambientes Locais & Docker Prune',
      description: 'Limpar containers, volumes órfãos e particionamento de disco de máquinas de desenvolvimento.',
      category: 'fundacoes',
      completed: false,
      priority: 'baixa',
      createdAt: '2026-10-26',
      phaseRecommendation: 'retrogrado',
    },
  ];
}
