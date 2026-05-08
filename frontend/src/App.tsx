import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import DeploymentDetailPage from './pages/DeploymentDetailPage';
export default function App(){return <div className='max-w-7xl mx-auto p-4'><h1 className='text-2xl font-bold mb-4'>Deployment Status Dashboard</h1><Routes><Route path='/' element={<DashboardPage/>}/><Route path='/deployments/:id' element={<DeploymentDetailPage/>}/></Routes></div>}
