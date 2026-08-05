import React from 'react';
import PageContainer from '../layout/PageContainer';
import SectionHeader from '../components/SectionHeader';
import LibrarySettingsTab from '../components/Settings/LibrarySettingsTab';
import BorrowRulesTab from '../components/Settings/BorrowRulesTab';
import TaxonomyTab from '../components/Settings/TaxonomyTab';
import NotificationsTab from '../components/Settings/NotificationsTab';
import ProfileSecurityTab from '../components/Settings/ProfileSecurityTab';
import AppearanceTab from '../components/Settings/AppearanceTab';
import BackupTab from '../components/Settings/BackupTab';
import AboutTab from '../components/Settings/AboutTab';
import { TableSkeleton } from '../components/Skeleton';
import useSettingsData from '../hooks/useSettingsData';
import { 
  FiBook, 
  FiSliders, 
  FiLayers, 
  FiBell, 
  FiShield, 
  FiSun, 
  FiDatabase, 
  FiInfo, 
  FiAlertCircle 
} from 'react-icons/fi';
import { cn } from '../utils/cn';

export const Settings = () => {
  const {
    settings,
    loading,
    error,
    activeTab,
    setActiveTab,
    savingSection,
    uploadingLogo,
    handleSaveSection,
    handleLogoUpload,
  } = useSettingsData();

  const tabs = [
    { id: 'library', label: 'Library Profile', icon: FiBook },
    { id: 'rules', label: 'Borrowing Rules', icon: FiSliders },
    { id: 'taxonomy', label: 'Categories & Depts', icon: FiLayers },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'profile', label: 'Profile & Security', icon: FiShield },
    { id: 'appearance', label: 'Appearance', icon: FiSun },
    { id: 'backup', label: 'Database Backup', icon: FiDatabase },
    { id: 'about', label: 'About System', icon: FiInfo },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title="System Settings"
        subtitle="Configure library operations and system preferences."
      />

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-3 text-red-200 text-xs">
          <FiAlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          <span>Notice: {error}. Realtime Firestore settings listener active.</span>
        </div>
      )}

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Settings Left Navigation Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none bg-[#111111] p-2 rounded-2xl border border-[#2A2A2A] self-start">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 select-none text-left',
                    isActive
                      ? 'bg-white text-black font-bold shadow-xs'
                      : 'text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white'
                  )}
                >
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-black' : 'text-[#A1A1AA]')} />
                  <span className="whitespace-nowrap">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Settings Tab Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'library' && (
              <LibrarySettingsTab
                data={settings.library}
                onSave={handleSaveSection}
                isSaving={savingSection === 'library'}
                onUploadLogo={handleLogoUpload}
                isUploadingLogo={uploadingLogo}
              />
            )}

            {activeTab === 'rules' && (
              <BorrowRulesTab
                data={settings.borrowing_rules}
                onSave={handleSaveSection}
                isSaving={savingSection === 'borrowing_rules'}
              />
            )}

            {activeTab === 'taxonomy' && (
              <TaxonomyTab
                categoriesData={settings.categories}
                departmentsData={settings.departments}
                semestersData={settings.semesters}
                onSaveSection={handleSaveSection}
                isSaving={!!savingSection}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsTab
                data={settings.notification_preferences}
                onSave={handleSaveSection}
                isSaving={savingSection === 'notification_preferences'}
              />
            )}

            {activeTab === 'profile' && <ProfileSecurityTab />}

            {activeTab === 'appearance' && <AppearanceTab />}

            {activeTab === 'backup' && <BackupTab />}

            {activeTab === 'about' && <AboutTab />}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Settings;
