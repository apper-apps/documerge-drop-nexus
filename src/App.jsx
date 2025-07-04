import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Templates from '@/components/pages/Templates'
import TemplateWizard from '@/components/pages/TemplateWizard'
import Generate from '@/components/pages/Generate'
import History from '@/components/pages/History'
import Settings from '@/components/pages/Settings'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/new" element={<TemplateWizard />} />
          <Route path="/templates/:id/edit" element={<TemplateWizard />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App