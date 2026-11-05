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
