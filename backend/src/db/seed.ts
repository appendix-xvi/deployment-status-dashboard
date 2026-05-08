import db, { initDb } from './client'

const services = ['payments-api', 'orders-service', 'catalog-web', 'auth-api']
const envs = ['dev', 'dev01', 'alpha', 'staging', 'staging01', 'pt', 'preprod', 'prod']
const users = ['alice', 'bob', 'carol', 'dave']
const statuses = ['SUCCESS', 'FAILED', 'RUNNING', 'ROLLED_BACK']

export function seedMockDeployments(count = 40) {
  initDb()
  db.prepare('DELETE FROM deployments').run()
  const stmt = db.prepare(`INSERT INTO deployments (serviceName,environment,status,version,imageTag,gitCommit,previousVersion,triggeredBy,startedAt,finishedAt,durationSeconds,pipelineUrl,changeSummary,errorMessage,rollbackAvailable,createdAt)
VALUES (@serviceName,@environment,@status,@version,@imageTag,@gitCommit,@previousVersion,@triggeredBy,@startedAt,@finishedAt,@durationSeconds,@pipelineUrl,@changeSummary,@errorMessage,@rollbackAvailable,@createdAt)`)
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random()*statuses.length)]
    const start = new Date(Date.now() - Math.floor(Math.random()*86400000))
    const dur = status === 'RUNNING' ? null : Math.floor(Math.random()*1200)+90
    const finish = dur ? new Date(start.getTime()+dur*1000).toISOString() : null
    stmt.run({serviceName:services[i%services.length],environment:envs[i%envs.length],status,version:`v1.${Math.floor(i/4)}.${i%10}`,imageTag:`ghcr.io/internal/app:${i}`,gitCommit:Math.random().toString(16).slice(2,9),previousVersion:`v1.${Math.max(0,Math.floor(i/4)-1)}.${(i+9)%10}`,triggeredBy:users[i%users.length],startedAt:start.toISOString(),finishedAt:finish,durationSeconds:dur,pipelineUrl:`https://ci.internal/pipelines/${1000+i}`,changeSummary:`Updated service dependencies and config set ${i}.`,errorMessage:status==='FAILED'?'Health check timeout on readiness probe':null,rollbackAvailable:status==='SUCCESS'?1:0,createdAt:new Date().toISOString()})
  }
}

if (require.main === module) { seedMockDeployments(); console.log('Seed completed') }
