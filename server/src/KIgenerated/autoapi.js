// app.js — Automatisches REST-API für Sequelize v6 (ESM, keine Epilogue-Abhängigkeit)
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';
import debug from 'debug';
import express from 'express';

// === __dirname / __filename für ESM ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Sequelize aus CJS laden (stabil mit sequelize-auto -l esm) ===
const require = createRequire(import.meta.url);
const SequelizeCjs = require('sequelize');
const { Op } = SequelizeCjs;

// logging
const serializeLog = debug('sequelizeApi');

// === Express Setup ===

export async function setupAutoApis(postgresUrl) {
  // const app = express();
  // app.use(express.json());
  const router = express.Router();
  // // === DB-Verbindung (anpassen!) ===
  // const POSTGRES_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/frefru_teacher';
  // console.log(` sequelize with ${postgresUrl}`);

  const sequelize = new SequelizeCjs.Sequelize(postgresUrl, {
    dialect: 'postgres',
    logging: false,
  });

  // === Modelle laden ===
  const models = {};
  const modelsDir = path.join(__dirname, 'models');
  const initModelsPath = path.join(modelsDir, 'init-models.js');

  if (!fs.existsSync(modelsDir)) {
    throw new Error(`Models-Verzeichnis fehlt: ${modelsDir}`);
  }

  if (fs.existsSync(initModelsPath)) {
    const initMod = await import(pathToFileURL(initModelsPath).href);
    const initModelsFn = initMod.default || initMod.initModels || initMod.defaultInit || initMod.init;
    if (typeof initModelsFn !== 'function') {
      throw new Error('init-models.js gefunden, aber keine Init-Funktion exportiert.');
    }
    Object.assign(models, initModelsFn(sequelize));
  } else {
    // Fallback: alle einzelnen Modeldateien laden
    for (const file of fs.readdirSync(modelsDir)) {
      if (!file.endsWith('.js')) continue;
      if (file === 'index.js' || file === 'init-models.js') continue;

      const mod = await import(pathToFileURL(path.join(modelsDir, file)).href);
      const exp = mod.default ?? mod;
      if (exp && typeof exp.initModel === 'function') {
        const model = exp.initModel(sequelize);
        models[model.name] = model;
      }
    }
  }

  // === Hilfsfunktionen ===
  function getPkFields(model) {
    const a = [];
    if (Array.isArray(model.primaryKeyAttributes) && model.primaryKeyAttributes.length) {
      return model.primaryKeyAttributes.slice();
    }
    for (const [k, def] of Object.entries(model.rawAttributes || {})) {
      if (def && def.primaryKey) a.push(k);
    }
    return a;
  }

  function tableSlug(model, fallback) {
    const tn = model.getTableName ? model.getTableName() : fallback;
    return tn && typeof tn === 'object' ? tn.tableName : tn;
  }

  function buildFindOptions(query, model) {
    const opts = {};
    if (query.limit) opts.limit = Math.max(0, parseInt(query.limit, 10) || 0);
    if (query.offset) opts.offset = Math.max(0, parseInt(query.offset, 10) || 0);
    if (query.order) {
      const [col, dirRaw] = String(query.order).split(/\s+/);
      const dir = (dirRaw || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      opts.order = [[col, dir]];
    }
    const where = {};
    for (const [k, v] of Object.entries(query)) {
      if (['limit', 'offset', 'order'].includes(k)) continue;
      if (model.rawAttributes?.[k] !== undefined) where[k] = v;
    }
    if (Object.keys(where).length) opts.where = where;
    return opts;
  }

  function whereFromReq(req, pkFields) {
    const where = {};
    for (const k of pkFields) {
      const v = req.params[k] ?? req.query[k] ?? req.body?.[k];
      if (v == null) return { ok: false, miss: k };
      where[k] = v;
    }
    return { ok: true, where };
  }

  // === CRUD-Endpunkte (automatisch, inkl. Composite Keys) ===
  for (const [name, model] of Object.entries(models)) {
    const base = `/${tableSlug(model, name)}`;
    const pks = getPkFields(model);

    if (!pks.length) {
      console.warn(`⚠️ Überspringe Model ${name}: kein Primary Key erkannt`);
      continue;
    }

    serializeLog(`→ Route: ${base} (PK: ${pks.join(', ')})`);

    // LIST
    router.get(base, async (req, res) => {
      try {
        const opts = buildFindOptions(req.query || {}, model);
        const rows = await model.findAll(opts);
        res.json(rows);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'internal error', error: String(err) });
      }
    });

    // Pfad für READ/UPDATE/DELETE
    const pathWithPk = base + '/' + (pks.length === 1 ? `:${pks[0]}` : pks.map((k) => `:${k}`).join('/'));

    // READ
    router.get(pathWithPk, async (req, res) => {
      try {
        const r = whereFromReq(req, pks);
        if (!r.ok) return res.status(400).json({ message: `missing primary key: ${r.miss}` });
        const row = await model.findOne({ where: r.where });
        if (!row) return res.status(404).json({ message: 'not found' });
        res.json(row);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'internal error', error: String(err) });
      }
    });

    // CREATE
    router.post(base, async (req, res) => {
      try {
        const created = await model.create(req.body, { returning: true });
        const where = {};
        for (const k of pks) where[k] = created.get(k);
        const reloaded = await model.findOne({ where });
        res.status(201).json(reloaded || created);
      } catch (err) {
        console.error(err);
        const status = err?.name === 'SequelizeForeignKeyConstraintError' ? 409 : 400;
        res.status(status).json({ message: 'create failed', error: String(err) });
      }
    });

    // UPDATE (PATCH)
    router.patch(pathWithPk, async (req, res) => {
      try {
        const r = whereFromReq(req, pks);
        if (!r.ok) return res.status(400).json({ message: `missing primary key: ${r.miss}` });

        const [count] = await model.update(req.body, { where: r.where, returning: true });
        if (!count) return res.status(404).json({ message: 'not found' });
        const updated = await model.findOne({ where: r.where });
        res.json(updated);
      } catch (err) {
        console.error(err);
        const status = err?.name === 'SequelizeForeignKeyConstraintError' ? 409 : 400;
        res.status(status).json({ message: 'update failed', error: String(err) });
      }
    });

    // DELETE (Pfad)
    router.delete(pathWithPk, async (req, res) => {
      try {
        const r = whereFromReq(req, pks);
        if (!r.ok) return res.status(400).json({ message: `missing primary key: ${r.miss}` });

        const count = await model.destroy({ where: r.where });
        if (!count) return res.status(404).json({ message: 'not found' });
        res.status(204).send();
      } catch (err) {
        console.error(err);
        const status = err?.name === 'SequelizeForeignKeyConstraintError' ? 409 : 400;
        res.status(status).json({ message: 'delete failed', error: String(err) });
      }
    });

    // DELETE (Query)
    router.delete(base, async (req, res) => {
      try {
        const r = whereFromReq(req, pks);
        if (!r.ok) return res.status(400).json({ message: `missing primary key: ${r.miss}` });

        const count = await model.destroy({ where: r.where });
        if (!count) return res.status(404).json({ message: 'not found' });
        res.status(204).send();
      } catch (err) {
        console.error(err);
        const status = err?.name === 'SequelizeForeignKeyConstraintError' ? 409 : 400;
        res.status(status).json({ message: 'delete failed', error: String(err) });
      }
    });
  }

  // === Healthcheck ===
  router.get('/health', (_, res) => res.json({ ok: true }));

  // === Start Server ===
  await sequelize.authenticate();
  serializeLog('✅ DB-Verbindung steht');
  return router;
}

// === Start Server ===
// export async function startServer() {
// try {
//   await sequelize.authenticate();
//   serializeLog('✅ DB-Verbindung steht');
//   app.listen(8080, () => serializeLog('🚀 API läuft auf http://localhost:8080'));
// } catch (err) {
//   console.error('❌ DB-Fehler:', err);
//   process.exit(1);
// }

// }
