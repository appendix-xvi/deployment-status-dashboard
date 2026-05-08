import { Router } from 'express'
import { getDeployment, listDeployments, summary } from '../services/deployments'
import { seedMockDeployments } from '../db/seed'

const router = Router()

router.get('/deployments', (req, res) => res.json(listDeployments(req.query)))
router.get('/deployments/:id', (req, res) => {
  const data = getDeployment(req.params.id)
  if (!data) return res.status(404).json({ message: 'Deployment not found' })
  res.json(data)
})
router.get('/summary', (_req, res) => res.json(summary()))
router.post('/deployments/mock-generate', (_req, res) => { seedMockDeployments(50); res.json({ message: 'Mock deployments generated' }) })

export default router
