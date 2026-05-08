import Database from 'better-sqlite3'

const db = new Database('/data/deployments.db')

export function initDb() {
  db.exec(`CREATE TABLE IF NOT EXISTS deployments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serviceName TEXT NOT NULL,
    environment TEXT NOT NULL,
    status TEXT NOT NULL,
    version TEXT NOT NULL,
    imageTag TEXT NOT NULL,
    gitCommit TEXT NOT NULL,
    previousVersion TEXT NOT NULL,
    triggeredBy TEXT NOT NULL,
    startedAt TEXT NOT NULL,
    finishedAt TEXT,
    durationSeconds INTEGER,
    pipelineUrl TEXT NOT NULL,
    changeSummary TEXT NOT NULL,
    errorMessage TEXT,
    rollbackAvailable INTEGER NOT NULL,
    createdAt TEXT NOT NULL
  )`)
}

export default db
