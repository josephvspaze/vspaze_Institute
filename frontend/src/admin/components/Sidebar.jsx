import React, { useState, useEffect } from 'react';
import { Home, Users, GraduationCap, BookOpen, Calendar, CreditCard, ClipboardCheck, Megaphone, X, ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeSection, setActiveSection }) => {
  const [studentsExpanded, setStudentsExpanded] = useState(false);
  const [facultyExpanded, setFacultyExpanded] = useState(false);
  const [pendingStudentsCount, setPendingStudentsCount] = useState(0);
  const [pendingFacultyCount, setPendingFacultyCount] = useState(0);

  useEffect(() => {
    const updatePendingCounts = () => {
      const pendingStudents = JSON.parse(localStorage.getItem('pending_students') || '[]');
      const pendingFaculty = JSON.parse(localStorage.getItem('pending_faculty') || '[]');
      setPendingStudentsCount(pendingStudents.length);
      setPendingFacultyCount(pendingFaculty.length);
    };
    
    updatePendingCounts();
    const interval = setInterval(updatePendingCounts, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Students', icon: Users, hasSubmenu: true },
    { id: 'faculty', label: 'Faculty', icon: GraduationCap, hasSubmenu: true },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'batches', label: 'Batches', icon: Calendar },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'announcements', label: 'Announcements', icon: Megaphone }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">vspaze</span>
          </div>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6 text-cyan-400" />
          </button>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.hasSubmenu) {
                    if (item.id === 'students') setStudentsExpanded(!studentsExpanded);
                    if (item.id === 'faculty') setFacultyExpanded(!facultyExpanded);
                  } else {
                    setActiveSection(item.id);
                    onClose();
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-all ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-cyan-100 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.hasSubmenu && (
                  (item.id === 'students' ? studentsExpanded : facultyExpanded) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {item.hasSubmenu && item.id === 'students' && studentsExpanded && (
                <div className="ml-4 space-y-1 mb-2">
                  <button
                    onClick={() => {
                      setActiveSection('students');
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
                      activeSection === 'students'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-cyan-200 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-sm">All Students</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection('pending-students');
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
                      activeSection === 'pending-students'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-cyan-200 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-sm">New Students</span>
                    {pendingStudentsCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {pendingStudentsCount}
                      </span>
                    )}
                  </button>
                </div>
              )}
              {item.hasSubmenu && item.id === 'faculty' && facultyExpanded && (
                <div className="ml-4 space-y-1 mb-2">
                  <button
                    onClick={() => {
                      setActiveSection('faculty');
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
                      activeSection === 'faculty'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-cyan-200 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-sm">All Faculty</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection('pending-faculty');
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
                      activeSection === 'pending-faculty'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-cyan-200 hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-sm">New Faculty</span>
                    {pendingFacultyCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {pendingFacultyCount}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
