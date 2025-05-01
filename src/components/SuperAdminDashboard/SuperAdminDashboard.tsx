import React, { useState, useEffect } from 'react';
import { UsersIcon, Building as BuildingIcon, FileText as FileIcon, Book as BookIcon, Layout as LayoutIcon, GraduationCap } from 'lucide-react';
import { UserManagement } from './components/UserManagement';
import { GuideManagement } from './components/GuideManagement';
import { BlogManagement } from './components/BlogManagement';
import { TabsManagement } from './components/TabsManagement';
import { CourseManagement } from './components/CourseManagement';

export function SuperAdminDashboard() {
  // Set the initial tab to 'courses' to show the course management first
  const [active, setActive] = useState('courses');
  
  const tabs = [
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'courses', label: 'Courses', icon: GraduationCap },
    { id: 'guides', label: 'Guides', icon: FileIcon },
    { id: 'blogs', label: 'Blogs', icon: BookIcon },
    { id: 'blogTabs', label: 'Blog Tabs', icon: LayoutIcon },
  ];
  
  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="bg-white md:w-64 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
        </div>
        <nav className="flex flex-col p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                  active === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="w-full overflow-hidden">
        {active === 'users' && <UserManagement />}
        {active === 'courses' && <CourseManagement />}
        {active === 'guides' && <GuideManagement />}
        {active === 'blogs' && <BlogManagement />}
        {active === 'blogTabs' && <TabsManagement />}
      </div>
    </div>
  );
} 