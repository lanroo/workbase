import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Collaborators from '@/pages/Collaborators'
import CollaboratorDetail from '@/pages/CollaboratorDetail'
import Enterprises from '@/pages/Enterprises'
import EnterpriseDetail from '@/pages/EnterpriseDetail'
import Contracts from '@/pages/Contracts'
import ContractDetail from '@/pages/ContractDetail'
import Tasks from '@/pages/Tasks'
import TaskDetail from '@/pages/TaskDetail'
import Reports from '@/pages/Reports'
import ReportDetail from '@/pages/ReportDetail'
import Users from '@/pages/Users'

function AppLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" aria-hidden />
      <p className="text-zinc-500 text-sm mt-4 m-0">Loading…</p>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <AppLoading />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return <AppLoading />
  if (!isAdmin) return <Navigate to="/collaborators" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/collaborators" replace />} />
        <Route path="collaborators" element={<Collaborators />} />
        <Route path="collaborators/:id" element={<CollaboratorDetail />} />
        <Route path="enterprises" element={<Enterprises />} />
        <Route path="enterprises/:id" element={<EnterpriseDetail />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="contracts/:id" element={<ContractDetail />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/:id" element={<ReportDetail />} />
        <Route path="users" element={<AdminRoute><Users /></AdminRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
