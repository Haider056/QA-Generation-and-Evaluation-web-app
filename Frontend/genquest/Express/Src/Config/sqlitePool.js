// Local-dev shim: mimics the subset of the mysql2/promise pool API used by the models,
// backed by Node's built-in SQLite so the app runs without a MySQL server.
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const db = new DatabaseSync(process.env.SQLITE_PATH || path.join(__dirname, '..', '..', 'genquest-local.db'));
db.exec(`CREATE TABLE IF NOT EXISTS genusers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT);
CREATE TABLE IF NOT EXISTS genquestions (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, answer TEXT, created_at TEXT);`);
// Columns added for the Saved questions page (owner + where the question came from).
const qcols = db.prepare('PRAGMA table_info(genquestions)').all().map((c) => c.name);
for (const [col, type] of [['user_id', 'INTEGER'], ['book_title', 'TEXT'], ['chapter', 'TEXT']]) {
  if (!qcols.includes(col)) db.exec(`ALTER TABLE genquestions ADD COLUMN ${col} ${type}`);
}
const norm = (v) => (v instanceof Date ? v.toISOString() : v === undefined ? null : v);
module.exports = {
  async execute(sql, params = []) {
    const stmt = db.prepare(sql);
    const p = params.map(norm);
    if (/^\s*select/i.test(sql)) return [stmt.all(...p)];
    const r = stmt.run(...p);
    return [{ insertId: Number(r.lastInsertRowid), affectedRows: r.changes }];
  },
};
