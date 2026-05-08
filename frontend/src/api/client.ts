const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
export const api = {
  deployments: (q='') => fetch(`${API}/deployments${q}`).then(r=>r.json()),
  deployment: (id:string) => fetch(`${API}/deployments/${id}`).then(r=>r.json()),
  summary: () => fetch(`${API}/summary`).then(r=>r.json()),
}
