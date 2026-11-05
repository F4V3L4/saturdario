import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type RecordType =
  | 'claim' | 'observation' | 'hypothesis' | 'interpretation'
  | 'question' | 'model' | 'experiment' | 'principle';

export type RecordStatus =
  | 'draft' | 'exploring' | 'planned' | 'active' | 'supported'
  | 'mixed' | 'unsupported' | 'refuted' | 'revised' | 'archived';

export interface KnowledgeRecord {
  id: string;
  record_type: RecordType;
  title: string;
  body: string;
  domain: string;
  status: RecordStatus;
  confidence: 'not_assessed' | 'low' | 'moderate' | 'high';
  scope?: string;
  method?: string;
  limitations?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface KnowledgeFile {
  version: 1;
  records: KnowledgeRecord[];
}

const validTypes: RecordType[] = [
  'claim', 'observation', 'hypothesis', 'interpretation',
  'question', 'model', 'experiment', 'principle',
];
const validStatuses: RecordStatus[] = [
  'draft', 'exploring', 'planned', 'active', 'supported',
  'mixed', 'unsupported', 'refuted', 'revised', 'archived',
];
const validConfidence = ['not_assessed', 'low', 'moderate', 'high'] as const;

function databasePath(): string {
  return process.env.SATURNARIO_DATA_FILE
    ? path.resolve(process.env.SATURNARIO_DATA_FILE)
    : path.resolve(process.cwd(), 'data/private/knowledge.json');
}

async function readDatabase(): Promise<KnowledgeFile> {
  const file = databasePath();
  try {
    const parsed = JSON.parse(await readFile(file, 'utf8')) as KnowledgeFile;
    if (parsed.version !== 1 || !Array.isArray(parsed.records)) {
      throw new Error('Formato do banco de conhecimento inválido.');
    }
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { version: 1, records: [] };
    }
    throw error;
  }
}

async function writeDatabase(data: KnowledgeFile): Promise<void> {
  const file = databasePath();
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = file + '.tmp';
  await writeFile(temporary, JSON.stringify(data, null, 2) + '\n', { mode: 0o600 });
  await rename(temporary, file).catch(async (error) => {
    await unlink(temporary).catch(() => undefined);
    throw error;
  });
}

export interface CreateRecordInput {
  record_type: RecordType;
  title: string;
  body: string;
  domain: string;
  status?: RecordStatus;
  confidence?: KnowledgeRecord['confidence'];
  scope?: string;
  method?: string;
  limitations?: string;
  metadata?: Record<string, unknown>;
}

export function validateCreateRecord(input: unknown): CreateRecordInput {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('O registro deve ser um objeto.');
  }
  const value = input as Record<string, unknown>;
  const text = (key: string, required = false): string | undefined => {
    const field = value[key];
    if (field === undefined && !required) return undefined;
    if (typeof field !== 'string' || (required && !field.trim())) {
      throw new Error(`Campo inválido: ${key}`);
    }
    if (field.length > (key === 'body' ? 20000 : 3000)) {
      throw new Error(`Campo excede o limite: ${key}`);
    }
    return field;
  };
  const recordType = text('record_type', true) as RecordType;
  const status = (text('status') ?? 'draft') as RecordStatus;
  const confidence = (text('confidence') ?? 'not_assessed') as KnowledgeRecord['confidence'];
  if (!validTypes.includes(recordType)) throw new Error('Tipo de registro inválido.');
  if (!validStatuses.includes(status)) throw new Error('Estado do registro inválido.');
  if (!(validConfidence as readonly string[]).includes(confidence)) {
    throw new Error('Nível de confiança inválido.');
  }
  const metadata = value.metadata;
  if (metadata !== undefined && (!metadata || typeof metadata !== 'object' || Array.isArray(metadata))) {
    throw new Error('Metadata deve ser um objeto.');
  }
  return {
    record_type: recordType,
    title: text('title', true)!,
    body: text('body', true)!,
    domain: text('domain', true)!,
    status,
    confidence,
    scope: text('scope'),
    method: text('method'),
    limitations: text('limitations'),
    metadata: metadata as Record<string, unknown> | undefined,
  };
}

export async function listKnowledgeRecords(filters: {
  domain?: string;
  record_type?: string;
  q?: string;
} = {}): Promise<KnowledgeRecord[]> {
  const db = await readDatabase();
  const q = filters.q?.toLocaleLowerCase();
  return db.records.filter((record) =>
    (!filters.domain || record.domain === filters.domain) &&
    (!filters.record_type || record.record_type === filters.record_type) &&
    (!q || (record.title + ' ' + record.body).toLocaleLowerCase().includes(q))
  ).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

let mutationQueue: Promise<unknown> = Promise.resolve();

export function createKnowledgeRecord(input: CreateRecordInput): Promise<KnowledgeRecord> {
  const operation = mutationQueue.then(async () => {
    const db = await readDatabase();
    const now = new Date().toISOString();
    const record: KnowledgeRecord = {
      id: randomUUID(),
      ...input,
      created_at: now,
      updated_at: now,
    };
    db.records.push(record);
    await writeDatabase(db);
    return record;
  });
  mutationQueue = operation.catch(() => undefined);
  return operation;
}


export class KnowledgeValidationError extends Error {
  constructor(message: string) { super(message); this.name = 'KnowledgeValidationError'; }
}

export interface KnowledgeSource {
  id: string;
  title: string;
  source_type: string;
  author?: string;
  publisher?: string;
  url?: string;
  accessed_at?: string;
  notes?: string;
}

interface KnowledgeSeeds {
  version: string;
  sources: KnowledgeSource[];
  records: Array<Record<string, unknown>>;
}

export async function importKnowledgeSeeds(input: unknown): Promise<{ sources_added: number; records_added: number; sources_total: number; records_total: number }> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new KnowledgeValidationError('Arquivo de sementes inválido.');
  }
  const seeds = input as Partial<KnowledgeSeeds>;
  if (typeof seeds.version !== 'string' || !Array.isArray(seeds.sources) || !Array.isArray(seeds.records)) {
    throw new KnowledgeValidationError('Estrutura de sementes inválida: version, sources e records são obrigatórios.');
  }

  const sourceIds = new Set<string>();
  const validSources = seeds.sources.map((source) => {
    if (!source || typeof source !== 'object' || typeof source.id !== 'string' ||
        typeof source.title !== 'string' || typeof source.source_type !== 'string' ||
        typeof source.url !== 'string' || !/^https?:\\/\\//i.test(source.url)) {
      throw new KnowledgeValidationError('Cada fonte precisa de id, título, tipo e URL HTTP(S) válidos.');
    }
    if (sourceIds.has(source.id)) throw new KnowledgeValidationError(`ID de fonte duplicado: ${source.id}`);
    sourceIds.add(source.id);
    return source;
  });

  const recordIds = new Set<string>();
  const preparedRecords = seeds.records.map((raw) => {
    if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string' || !raw.id.trim()) {
      throw new KnowledgeValidationError('Cada registro-semente precisa de um ID estável.');
    }
    if (recordIds.has(raw.id)) throw new KnowledgeValidationError(`ID de registro duplicado: ${raw.id}`);
    recordIds.add(raw.id);
    let inputRecord: CreateRecordInput;
    try {
      inputRecord = validateCreateRecord(raw);
    } catch (error) {
      throw new KnowledgeValidationError(error instanceof Error ? error.message : 'Registro-semente inválido.');
    }
    const linkedSources = raw.sources === undefined ? [] : raw.sources;
    if (!Array.isArray(linkedSources) || linkedSources.some((id) => typeof id !== 'string' || !sourceIds.has(id))) {
      throw new KnowledgeValidationError(`Referência de fonte inválida no registro ${raw.id}.`);
    }
    return { id: raw.id, input: inputRecord, source_ids: linkedSources as string[] };
  });

  const operation = mutationQueue.then(async () => {
    const db = await readDatabase();
    const existingSourceIds = new Set((db.sources ?? []).map((source) => source.id));
    const existingRecordIds = new Set(db.records.map((record) => record.id));
    const newSources = validSources.filter((source) => !existingSourceIds.has(source.id));
    const now = new Date().toISOString();
    const newRecords: KnowledgeRecord[] = preparedRecords
      .filter((record) => !existingRecordIds.has(record.id))
      .map((record) => ({
        id: record.id,
        ...record.input,
        metadata: { ...(record.input.metadata ?? {}), source_ids: record.source_ids, imported_from_seed: true },
        created_at: now,
        updated_at: now,
      }));
    db.sources = [...(db.sources ?? []), ...newSources];
    db.records.push(...newRecords);
    await writeDatabase(db);
    return {
      sources_added: newSources.length,
      records_added: newRecords.length,
      sources_total: db.sources.length,
      records_total: db.records.length,
    };
  });
  mutationQueue = operation.catch(() => undefined);
  return operation;
}
