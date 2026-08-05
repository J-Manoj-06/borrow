import { useState } from 'react';
import { generateAndDownloadExcelReport } from '../services/exportReportService';
import { toast } from 'react-hot-toast';

export const useExportReport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const fileName = await generateAndDownloadExcelReport();
      toast.success(`Report exported successfully! (${fileName})`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExport,
  };
};

export default useExportReport;
