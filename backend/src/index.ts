import express from 'express'
import cors from 'cors'
import routes from './routes/deployments'
import { initDb } from './db/client'
import { seedMockDeployments } from './db/seed'

initDb()
const hasRows = (require('./db/client').default.prepare('SELECT COUNT(*) c FROM deployments').get() as any).c
if (!hasRows) seedMockDeployments(40)

const app = express()
app.use(cors())
app.use(express.json())
app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api', routes)
app.use((err: any, _req: any, res: any, _next: any) => { console.error(err); res.status(500).json({ message: 'Internal server error' }) })

app.listen(4000, () => console.log('Backend on 4000'))
