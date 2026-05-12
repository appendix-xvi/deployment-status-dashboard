import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import StatusBadge from '../components/StatusBadge'

const envs = ['', 'dev', 'dev01', 'alpha', 'staging', 'staging01', 'pt', 'preprod', 'prod']

type Filters = {
  environment: string
  serviceName: string
  status: string
  search: string
}

const initialFilters: Filters = {
  environment: '',
  serviceName: '',
  status: '',
  search: ''
}

export default function DashboardPage() {
  const [deployments, setDeployments] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(initialFilters)

  useEffect(() => {
    api.summary().then(setSummary)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 250)
    return () => clearTimeout(timeout)
  }, [filters])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams(debouncedFilters)
    api.deployments(`?${params.toString()}`)
      .then(setDeployments)
      .finally(() => setLoading(false))
  }, [debouncedFilters])

  const lastProd = summary?.lastProductionDeployment
  const cards = useMemo(
    () =>
      summary
        ? [
            ['Total today', summary.totalDeploymentsToday],
            ['Successful', summary.successfulDeployments],
            ['Failed', summary.failedDeployments],
            ['Running', summary.runningDeployments],
            ['Last prod', lastProd ? `${lastProd.serviceName} ${new Date(lastProd.startedAt).toLocaleString()}` : 'N/A']
          ]
        : [],
    [summary, lastProd]
  )

  return (
    <div className='space-y-4'>
      {summary && (
        <div className='grid gap-3 md:grid-cols-5'>
          {cards.map((card: any) => (
            <div key={card[0]} className='rounded border bg-white p-3'>
              <p className='text-xs text-slate-500'>{card[0]}</p>
              <p className='text-sm font-semibold'>{card[1]}</p>
            </div>
          ))}
        </div>
      )}

      <div className='grid gap-2 md:grid-cols-4'>
        <select
          className='rounded border p-2'
          value={filters.environment}
          onChange={(e) => setFilters({ ...filters, environment: e.target.value })}
        >
          {envs.map((env) => (
            <option key={env} value={env}>
              {env || 'All envs'}
            </option>
          ))}
        </select>
        <input
          className='rounded border p-2'
          placeholder='Service name'
          value={filters.serviceName}
          onChange={(e) => setFilters({ ...filters, serviceName: e.target.value })}
        />
        <select
          className='rounded border p-2'
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value=''>All status</option>
          <option>SUCCESS</option>
          <option>FAILED</option>
          <option>RUNNING</option>
          <option>ROLLED_BACK</option>
        </select>
        <input
          className='rounded border p-2'
          placeholder='Search version/commit/user'
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : deployments.length === 0 ? (
        <p>No deployments found.</p>
      ) : (
        <div className='overflow-auto rounded border bg-white'>
          <table className='min-w-full text-sm'>
            <thead className='bg-slate-100'>
              <tr>
                {['Service', 'Env', 'Status', 'Version/Image', 'Git commit', 'Triggered by', 'Started', 'Finished', 'Duration', 'Pipeline', 'Rollback'].map((h) => (
                  <th key={h} className='p-2 text-left'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deployments.map((d) => (
                <tr key={d.id} className='border-t'>
                  <td className='p-2'>
                    <Link className='text-blue-600' to={`/deployments/${d.id}`}>
                      {d.serviceName}
                    </Link>
                  </td>
                  <td className='p-2'>{d.environment}</td>
                  <td className='p-2'>
                    <StatusBadge status={d.status} />
                  </td>
                  <td className='p-2'>
                    {d.version}
                    <div className='text-xs text-slate-500'>{d.imageTag}</div>
                  </td>
                  <td className='p-2 font-mono'>{d.gitCommit}</td>
                  <td className='p-2'>{d.triggeredBy}</td>
                  <td className='p-2'>{new Date(d.startedAt).toLocaleString()}</td>
                  <td className='p-2'>{d.finishedAt ? new Date(d.finishedAt).toLocaleString() : '-'}</td>
                  <td className='p-2'>{d.durationSeconds ? `${d.durationSeconds}s` : '-'}</td>
                  <td className='p-2'>
                    <a className='text-blue-600' href={d.pipelineUrl} target='_blank' rel='noreferrer'>
                      View
                    </a>
                  </td>
                  <td className='p-2'>{d.rollbackAvailable ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
