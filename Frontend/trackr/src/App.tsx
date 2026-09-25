import { useState } from 'react'
import { useJobs } from './hooks/useJobs'
import { useDocuments } from './hooks/useDcouments'
import { useInterviews } from './hooks/useInterviews'
import KanbanBoard from './components/board/KanbanBoard'
import TableView from './components/board/TableView'
import InterviewsView from './components/board/InterviewView'
import AnalyticsView from './components/board/AnalytisView'
import DocumentsView from './components/board/DocumentsView'
import SavedJobs from './components/board/SavedJobs'
import SettingsView from './components/board/SettingsView'
import StatsBar from './components/board/StatsBar'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import JobFormModal from './components/modals/JobFormModal'
import DocumentModal from './components/modals/DocumentModal'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import type { Job } from './components/board/TableView'
import type { Profile } from './api/profile'

function readStoredSettings() {
  try { return JSON.parse(localStorage.getItem('jobtrackr-settings') ?? '{}') as { defaultView?: string; jobTitle?: string; huntLabel?: string } }
  catch { return {} }
}

function readStoredUser() {
  try { return JSON.parse(localStorage.getItem('user') ?? '{}') as { name?: string } }
  catch { return {} }
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [currentNav, setCurrentNav] = useState('board')
  const [currentTab, setCurrentTab] = useState(() => readStoredSettings().defaultView === 'table' ? 'table' : 'kanban')
  const [sidebarProfile, setSidebarProfile] = useState(() => ({
    userName: readStoredUser().name ?? 'JobTrackr user',
    jobTitle: readStoredSettings().jobTitle ?? '',
    huntLabel: readStoredSettings().huntLabel ?? '2026 Job Hunt',
  }))
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  const { jobs, loading: jobsLoading, error: jobsError, addJob, editJob, removeJob } = useJobs()
  const { documents, loading: docsLoading, addDocument, removeDocument }             = useDocuments()
  const { interviews, loading: interviewsLoading, addInterview, editInterview, removeInterview } = useInterviews()

  const deleteJob = (id: string) => { void removeJob(id) }
  const updateExistingJob = async (job: Partial<Job>) => {
    if (!editingJob) return
    await editJob(editingJob.id, job)
    setEditingJob(null)
  }

  function renderView() {
    if (currentNav === 'board') {
      if (currentTab === 'kanban')
        return <KanbanBoard jobs={jobs} onDelete={deleteJob} onEdit={setEditingJob} />
      if (currentTab === 'table')
        return <TableView jobs={jobs} onDelete={deleteJob} onEdit={setEditingJob} />
    }
    if (currentNav === 'interviews')
      return (
        <InterviewsView
          jobs={jobs}
          interviews={interviews}
          loading={interviewsLoading}
          onAdd={addInterview}
          onEdit={editInterview}
          onDelete={removeInterview}
        />
      )
    if (currentNav === 'analytics')  return <AnalyticsView jobs={jobs} interviews={interviews} />
    if (currentNav === 'documents')
      return (
        <DocumentsView
          documents={documents}
          jobs={jobs}
          onDelete={id => void removeDocument(id)}
          loading={docsLoading}
        />
      )
    if (currentNav === 'saved')    return <SavedJobs jobs={jobs} />
    if (currentNav === 'settings') return <SettingsView jobs={jobs} documents={documents} interviews={interviews} onSettingsSaved={(profile: Profile, preferences) => {
      setSidebarProfile({ userName: profile.name, jobTitle: preferences.jobTitle, huntLabel: preferences.huntLabel });
      setCurrentTab(preferences.defaultView);
    }} />
    return null
  }

  return (
    <div className="app">
      <Sidebar
        currentNav={currentNav}
        setCurrentNav={setCurrentNav}
        jobCount={jobs.length}
        upcomingInterviews={interviews.filter(i => i.status === 'Upcoming').length}
        {...sidebarProfile}
      />
      <main className="main">
        <Topbar
          currentNav={currentNav}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setShowAddModal={setShowAddModal}
          onLogout={onLogout}
        />
        {currentNav === 'board' && <StatsBar jobs={jobs} interviews={interviews} />}
        {jobsLoading && <div className="empty-msg">Loading jobs...</div>}
        {jobsError   && <div className="empty-msg">{jobsError}</div>}
        {!jobsLoading && !jobsError && renderView()}

        {showAddModal && (
          currentNav === 'documents'
            ? <DocumentModal
                jobs={jobs}
                onClose={() => setShowAddModal(false)}
                onSave={(file, type, linkedJobId) => addDocument(file, type, linkedJobId)}
              />
            : <JobFormModal onClose={() => setShowAddModal(false)} onSave={addJob} />
        )}
        {editingJob && (
          <JobFormModal
            initialJob={editingJob}
            onClose={() => setEditingJob(null)}
            onSave={updateExistingJob}
          />
        )}
      </main>
    </div>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'))
  const [showRegister, setShowRegister] = useState(false)

  if (!isLoggedIn) {
    if (showRegister) {
      return <RegisterPage onRegister={() => setIsLoggedIn(true)} onSwitchToLogin={() => setShowRegister(false)} />
    }
    return <LoginPage onLogin={() => setIsLoggedIn(true)} onSwitchToRegister={() => setShowRegister(true)} />
  }

  return <Dashboard onLogout={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setIsLoggedIn(false) }} />
}
