import db from '../db/client'

export function listDeployments(query: any) {
  const clauses: string[] = []
  const params: any = {}
  if (query.environment) { clauses.push('environment=@environment'); params.environment = query.environment }
  if (query.serviceName) { clauses.push('serviceName LIKE @serviceName'); params.serviceName = `%${query.serviceName}%` }
  if (query.status) { clauses.push('status=@status'); params.status = query.status }
  if (query.search) { clauses.push('(version LIKE @search OR gitCommit LIKE @search OR triggeredBy LIKE @search)'); params.search = `%${query.search}%` }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  return db.prepare(`SELECT * FROM deployments ${where} ORDER BY startedAt DESC`).all(params)
}

export const getDeployment = (id: string) => db.prepare('SELECT * FROM deployments WHERE id=?').get(id)

export function summary() {
  const today = new Date().toISOString().slice(0,10)
  const totalToday = db.prepare("SELECT COUNT(*) as c FROM deployments WHERE substr(startedAt,1,10)=?").get(today) as any
  const success = db.prepare("SELECT COUNT(*) as c FROM deployments WHERE status='SUCCESS'").get() as any
  const failed = db.prepare("SELECT COUNT(*) as c FROM deployments WHERE status='FAILED'").get() as any
  const running = db.prepare("SELECT COUNT(*) as c FROM deployments WHERE status='RUNNING'").get() as any
  const lastProd = db.prepare("SELECT * FROM deployments WHERE environment='prod' ORDER BY startedAt DESC LIMIT 1").get() as any
  return { totalDeploymentsToday: totalToday.c, successfulDeployments: success.c, failedDeployments: failed.c, runningDeployments: running.c, lastProductionDeployment: lastProd }
}
