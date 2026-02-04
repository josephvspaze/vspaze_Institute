import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './admin/components/Header';
import Sidebar from './admin/components/Sidebar';

import AdminProfile from './admin/pages/AdminProfile';
import DashboardLanding from './admin/pages/DashboardLanding';
import StudentManagement from './admin/pages/StudentManagement';
import FacultyManagement from './admin/pages/FacultyManagement';
import CourseManagement from './admin/pages/CourseManagement';
import BatchManagement from './admin/pages/BatchManagement';
import AttendanceManagement from './admin/pages/AttendanceManagement';
import PaymentManagement from './admin/pages/PaymentManagement';
import BatchDetails from './admin/pages/BatchDetails';
import Settings from './admin/pages/Settings';
import Notifications from './admin/pages/Notifications';
import CourseDetails from './admin/pages/CourseDetails';
import FacultyDetails from './admin/pages/FacultyDetails';
import Announcements from './admin/pages/Announcements';
import PendingStudents from './admin/pages/PendingStudents';
import PendingFaculty from './admin/pages/PendingFaculty';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('vspaze_auth') || '{}');
    if (auth.isAuthenticated) {
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    } else {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('vspaze_auth');
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    if (selectedBatch) {
      return <BatchDetails batch={selectedBatch} onBack={() => setSelectedBatch(null)} />;
    }
    if (selectedCourse) {
      return <CourseDetails course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
    }
    if (selectedFaculty) {
      return <FacultyDetails faculty={selectedFaculty} onBack={() => setSelectedFaculty(null)} />;
    }
    
    switch(activeSection) {
      case 'home': return <DashboardLanding 
        onBatchClick={(batch) => setSelectedBatch(batch)} 
        onCourseClick={(course) => setSelectedCourse(course)}
        onFacultyClick={(faculty) => setSelectedFaculty(faculty)}
      />;
      case 'students': return <StudentManagement />;
      case 'pending-students': return <PendingStudents />;
      case 'faculty': return <FacultyManagement />;
      case 'pending-faculty': return <PendingFaculty />;
      case 'courses': return <CourseManagement />;
      case 'batches': return <BatchManagement />;
      case 'attendance': return <AttendanceManagement />;
      case 'payments': return <PaymentManagement />;
      case 'announcements': return <Announcements />;
      case 'settings': return <Settings />;
      case 'notifications': return <Notifications />;
      default: return <DashboardLanding onBatchClick={(batch) => setSelectedBatch(batch)} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        setActiveSection={(section) => {
          setActiveSection(section);
          setSelectedBatch(null);
          setSelectedCourse(null);
          setSelectedFaculty(null);
        }}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          onLogoClick={() => {
            setActiveSection('home');
            setSelectedBatch(null);
          }}
          onLogout={handleLogout}
          onProfileClick={() => setShowProfile(true)}
          onSettingsClick={() => setActiveSection('settings')}
          onNotificationClick={() => setActiveSection('notifications')}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col p-4 md:p-6">
            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
      {showProfile && <AdminProfile onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default App;
