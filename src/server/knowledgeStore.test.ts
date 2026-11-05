import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  createKnowledgeRecord,
  importKnowledgeSeeds,
  listKnowledgeRecords,
  validateCreateRecord,
  KnowledgeValidationError,
} from './knowledgeStore';

let directory = '';
let database = '';

beforeEach(async () => {
  directory = await mkdtemp(path.join(os.tmpdir(), 'saturnario-knowledge-'));
  database = path.join(directory, 'knowledge.json');
  process.env.SATURNARIO_DATA_FILE = database;
});

afterEach(async () => {
  delete process.env.SATURNARIO_DATA_FILE;
  await rm(directory, { recursive: true, force: true });
});

describe('knowledge store', () => {
  it('validates and creates a record', async () => {
    const input = validateCreateRecord({
      record_type: 'hypothesis',
      title: 'Teste de hipótese',
      body: 'Conteúdo de teste.',
      domain: 'learning',
    });
    const created = await createKnowledgeRecord(input);
    assert.equal(created.title, 'Teste de hipótese');
    assert.equal((await listKnowledgeRecords({ domain: 'learning' })).length, 1);
  });

  it('rejects invalid record types', () => {
    assert.throws(() => validateCreateRecord({
      record_type: 'fortune',
      title: 'Inválido',
      body: 'Não deve ser aceito.',
      domain: 'test',
    }), /Tipo de registro inválido/);
  });

  it('imports seed data idempotently and preserves source links', async () => {
    const seeds = {
      version: '1.0.0',
      sources: [{
        id: 'source-test',
        title: 'Fonte de teste',
        source_type: 'primary',
        url: 'https://example.org/source',
      }],
      records: [{
        id: 'seed-question-1',
        record_type: 'question',
        title: 'Pergunta inicial',
        body: 'Investigar uma questão.',
        domain: 'science',
        status: 'exploring',
        confidence: 'not_assessed',
        sources: ['source-test'],
      }],
    };

    const first = await importKnowledgeSeeds(seeds);
    const second = await importKnowledgeSeeds(seeds);
    assert.deepEqual(first, {
      sources_added: 1,
      records_added: 1,
      sources_total: 1,
      records_total: 1,
    });
    assert.deepEqual(second, {
      sources_added: 0,
      records_added: 0,
      sources_total: 1,
      records_total: 1,
    });

    const [record] = await listKnowledgeRecords({ q: 'Pergunta inicial' });
    assert.equal(record.id, 'seed-question-1');
    assert.deepEqual(record.metadata?.source_ids, ['source-test']);
    const stored = JSON.parse(await readFile(database, 'utf8'));
    assert.equal(stored.sources[0].id, 'source-test');
  });

  it('rejects seed records linked to unknown sources', async () => {
    await assert.rejects(() => importKnowledgeSeeds({
      version: '1.0.0',
      sources: [],
      records: [{
        id: 'orphan',
        record_type: 'question',
        title: 'Sem fonte',
        body: 'Teste',
        domain: 'science',
        sources: ['missing-source'],
      }],
    }), KnowledgeValidationError);
  });
});
