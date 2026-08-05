import { useState, useEffect } from 'react';
import { subscribeToSettings, saveSettingsSection } from '../services/settingsService';
import { uploadToCloudinary } from '../services/cloudinary';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export const useSettingsData = () => {
  const { user } = useAuth();

  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('library');
  const [savingSection, setSavingSection] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToSettings(
      (data) => {
        setSettings(data);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || 'Failed to load settings');
        setLoading(false);
      }
    );

    const timer = setTimeout(() => setLoading(false), 1500);

    return () => {
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save specific settings section
  const handleSaveSection = async (sectionId, payload) => {
    setSavingSection(sectionId);
    try {
      await saveSettingsSection(sectionId, payload, user?.email || 'Librarian');
      toast.success(`${sectionId.replace('_', ' ').toUpperCase()} settings saved successfully!`);
    } catch (err) {
      toast.error(`Failed to save ${sectionId} settings.`);
    } finally {
      setSavingSection(null);
    }
  };

  // Upload Library Logo to Cloudinary
  const handleLogoUpload = async (file) => {
    if (!file) return null;
    setUploadingLogo(true);
    try {
      const url = await uploadToCloudinary(file);
      toast.success('Library logo uploaded to Cloudinary!');
      return url;
    } catch (err) {
      toast.error('Failed to upload logo.');
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  return {
    settings,
    loading,
    error,
    activeTab,
    setActiveTab,
    savingSection,
    uploadingLogo,
    handleSaveSection,
    handleLogoUpload,
  };
};

export default useSettingsData;
