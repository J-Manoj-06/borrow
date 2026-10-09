import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiDownload,
  FiBookOpen,
  FiSearch,
  FiTrash2,
  FiInfo,
  FiArrowRight,
  FiCheck,
  FiImage,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import PageContainer from '../layout/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';
import {
  parseExcelFile,
  validateWorkbookRows,
  fetchExistingCatalogIdentifiers,
  generateCsvReport,
  importValidBooks,
  CORE_REQUIRED_FIELDS,
  FIELD_LABELS,
} from '../services/bulkUploadService.js';

export const BulkUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Upload & File State
  const [selectedFile, setSelectedFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [parsedSheets, setParsedSheets] = useState({});

  // Configuration State
  const [requireCoverImage, setRequireCoverImage] = useState(false);

  // Validation Results State
  const [isValidating, setIsValidating] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);
  const [validatedData, setValidatedData] = useState({ rows: [], stats: null });

  // Preview Filter & Pagination State
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'valid' | 'excluded' | 'duplicates' | 'images'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Import State
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
    percent: 0,
    bookTitle: '',
    currentBatch: 0,
    totalBatches: 0,
  });

  // Completion State
  const [completionResult, setCompletionResult] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Image Preview Modal
  const [previewImageBook, setPreviewImageBook] = useState(null);

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Handle File Selection
  const handleFileSelected = async (file) => {
    if (!file) return;

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExt) {
      toast.error('Unsupported file format. Please upload an Excel (.xlsx, .xls) or .csv file.');
      return;
    }

    setSelectedFile(file);
    setIsParsing(true);
    setHasValidated(false);
    setValidatedData({ rows: [], stats: null });
    setCompletionResult(null);

    try {
      const { sheetNames: names, sheets } = await parseExcelFile(file);
      setSheetNames(names);
      setParsedSheets(sheets);

      // Prefer "Popular Books" if present, else default to first sheet
      const preferred = names.find((n) => n.toLowerCase().includes('popular books')) || names[0];
      setSelectedSheet(preferred);

      toast.success(`Loaded "${file.name}" successfully (${sheets[preferred]?.length || 0} rows found).`);
    } catch (err) {
      console.error('File parsing error:', err);
      toast.error(err.message || 'Failed to parse spreadsheet.');
      setSelectedFile(null);
    } finally {
      setIsParsing(false);
    }
  };

  // Run Validation & Duplicate Detection
  const handleValidateFile = async () => {
    if (!selectedSheet || !parsedSheets[selectedSheet]) {
      toast.error('Please select a sheet to validate.');
      return;
    }

    const rawRows = parsedSheets[selectedSheet];
    if (rawRows.length === 0) {
      toast.error('The selected sheet contains no rows.');
      return;
    }

    setIsValidating(true);
    try {
      // 1. Fetch live catalog identifiers to detect duplicates against existing database
      const existingCatalog = await fetchExistingCatalogIdentifiers();

      // 2. Validate all rows strictly
      const result = validateWorkbookRows(
        rawRows,
        { requireCoverImage },
        existingCatalog
      );

      setValidatedData(result);
      setHasValidated(true);
      setCurrentPage(1);

      if (result.stats.valid > 0) {
        toast.success(`Validation complete: ${result.stats.valid} valid records ready for import.`);
      } else {
        toast.error('Validation complete: 0 valid records found. Inspect the table for missing fields.');
      }
    } catch (err) {
      console.error('Validation error:', err);
      toast.error('An error occurred during validation.');
    } finally {
      setIsValidating(false);
    }
  };

  // Filter & Search Rows
  const filteredRows = useMemo(() => {
    if (!validatedData.rows || validatedData.rows.length === 0) return [];

    let list = validatedData.rows;

    // Tab Filter
    if (activeTab === 'valid') {
      list = list.filter((r) => r.status === 'valid');
    } else if (activeTab === 'excluded') {
      list = list.filter((r) => r.status === 'excluded');
    } else if (activeTab === 'duplicates') {
      list = list.filter((r) => r.status === 'duplicate_sheet' || r.status === 'duplicate_db');
    } else if (activeTab === 'images') {
      list = list.filter((r) => r.coverStatus === 'invalid' || !r.hasValidCoverUrlFormat);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.author?.toLowerCase().includes(q) ||
          r.isbn?.toLowerCase().includes(q) ||
          r.accessionNumber?.toLowerCase().includes(q) ||
          r.department?.toLowerCase().includes(q) ||
          String(r.excelRow).includes(q)
      );
    }

    return list;
  }, [validatedData.rows, activeTab, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  // Download CSV Report
  const handleDownloadReport = () => {
    if (!validatedData.rows || validatedData.rows.length === 0) {
      toast.error('No validated data available to export.');
      return;
    }

    try {
      const blob = generateCsvReport(validatedData.rows);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Borrow_Import_Validation_Report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Validation report downloaded.');
    } catch {
      toast.error('Failed to generate CSV report.');
    }
  };

  // Import Process Trigger
  const handleStartImport = async () => {
    setShowConfirmModal(false);

    const validRows = validatedData.rows.filter((r) => r.status === 'valid');
    if (validRows.length === 0) {
      toast.error('There are no valid books eligible for import.');
      return;
    }

    setIsImporting(true);
    setImportProgress({
      current: 0,
      total: validRows.length,
      percent: 0,
      bookTitle: '',
      currentBatch: 0,
      totalBatches: Math.ceil(validRows.length / 15),
    });

    try {
      const result = await importValidBooks(
        validRows,
        user?.email || 'Librarian',
        (progress) => {
          setImportProgress(progress);
        },
        { requireCoverImage }
      );

      setCompletionResult({
        ...result,
        totalSpreadsheetRows: validatedData.stats.total,
        skippedMissing: validatedData.stats.excludedMissing,
        duplicatesSkipped: validatedData.stats.totalDuplicates,
      });

      setShowCompletionModal(true);
      toast.success(`Bulk import completed: ${result.successCount} books added to inventory!`);
    } catch (err) {
      console.error('Import execution error:', err);
      toast.error(err.message || 'Bulk import encountered a failure.');
    } finally {
      setIsImporting(false);
    }
  };

  // Reset Everything
  const handleReset = () => {
    setSelectedFile(null);
    setParsedSheets({});
    setSheetNames([]);
    setSelectedSheet('');
    setValidatedData({ rows: [], stats: null });
    setHasValidated(false);
    setCompletionResult(null);
    setActiveTab('all');
    setSearchQuery('');
    setCurrentPage(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionHeader
        title="Bulk Book Upload"
        subtitle="Import your library catalogue from Excel"
      >
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/Borrow_Books_Import_Template.xlsx"
            download="Borrow_Books_Import_Template.xlsx"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#171717] border border-[#2A2A2A] text-white hover:border-neutral-500 hover:bg-[#1E1E1E] transition-colors"
          >
            <FiDownload className="w-3.5 h-3.5 text-[#A1A1AA]" />
            Download Template (.xlsx)
          </a>
          <a
            href="/Library_Books_HIGH_QUALITY_COVERS-1.xlsx"
            download="Library_Books_HIGH_QUALITY_COVERS-1.xlsx"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#171717] border border-[#2A2A2A] text-white hover:border-neutral-500 hover:bg-[#1E1E1E] transition-colors"
          >
            <FiDownload className="w-3.5 h-3.5 text-[#22C55E]" />
            Download 500-Book Sample (.xlsx)
          </a>
        </div>
      </SectionHeader>

      {/* STEP 1: Schema Rules & Configuration Guidance */}
      <Card className="mb-6 p-5 bg-[#111111] border-[#2A2A2A]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FiInfo className="w-4 h-4 text-[#A1A1AA]" />
              Catalogue Schema & Strict Validation Rules
            </h3>
            <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed max-w-3xl">
              Rows with <strong>any missing required catalogue field</strong> are strictly excluded from the import to prevent incomplete records. Whitespace is trimmed and placeholders like <code className="text-neutral-300">-</code> or empty cells are treated as missing.
            </p>
          </div>

          {/* Toggle: Require Cover Image URL */}
          <div className="flex items-center gap-3 bg-[#171717] px-4 py-2.5 rounded-xl border border-[#2A2A2A] shrink-0">
            <div>
              <span className="block text-xs font-medium text-white">Require Cover Image URL</span>
              <span className="block text-[11px] text-[#A1A1AA]">Exclude rows lacking cover images</span>
            </div>
            <button
              type="button"
              disabled={isImporting}
              onClick={() => {
                setRequireCoverImage(!requireCoverImage);
                if (hasValidated) setHasValidated(false);
              }}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                requireCoverImage ? 'bg-white' : 'bg-[#2A2A2A]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-black shadow-md transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  requireCoverImage ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Required Fields Pill Badges */}
        <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider mr-1">
            Mandatory Fields:
          </span>
          {CORE_REQUIRED_FIELDS.map((f) => (
            <Badge key={f} variant="accent" size="sm">
              {FIELD_LABELS[f] || f} <span className="text-[#EF4444] ml-0.5">*</span>
            </Badge>
          ))}
          {requireCoverImage && (
            <Badge variant="accent" size="sm">
              Cover Image URL <span className="text-[#EF4444] ml-0.5">*</span>
            </Badge>
          )}
          <span className="text-[11px] text-[#52525B] ml-2">
            (Optional / Catalog attributes: Call Number, Copies, Category, Edition, Publisher & Year, Pages, Price)
          </span>
        </div>
      </Card>

      {/* STEP 2: Drag & Drop Upload Card */}
      <Card className="mb-6 p-6 bg-[#111111] border-[#2A2A2A]">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            selectedFile
              ? 'border-neutral-600 bg-[#171717]/80'
              : 'border-[#2A2A2A] hover:border-neutral-500 bg-[#141414] hover:bg-[#181818]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />

          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#1F1F1F] border border-[#2A2A2A] flex items-center justify-center text-white shadow-inner">
                <FiUploadCloud className="w-7 h-7 text-[#A1A1AA]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Drop your Excel or CSV file here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-white underline hover:text-neutral-300 font-bold"
                  >
                    Browse Files
                  </button>
                </h4>
                <p className="text-xs text-[#A1A1AA] mt-1">
                  Supports .xlsx, .xls, and .csv files up to 25MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center shrink-0">
                  <FiFileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white truncate max-w-sm">
                      {selectedFile.name}
                    </h4>
                    <Badge variant="neutral" size="sm">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </Badge>
                  </div>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Ready for catalogue parsing & duplicate checking
                  </p>
                </div>
              </div>

              {/* Sheet Selection & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {sheetNames.length > 1 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#A1A1AA]">Sheet:</span>
                    <select
                      value={selectedSheet}
                      disabled={isImporting || isValidating}
                      onChange={(e) => {
                        setSelectedSheet(e.target.value);
                        setHasValidated(false);
                      }}
                      className="bg-[#1F1F1F] text-white border border-[#2A2A2A] rounded-lg px-2.5 py-1.5 focus:outline-none text-xs"
                    >
                      {sheetNames.map((name) => (
                        <option key={name} value={name}>
                          {name} ({parsedSheets[name]?.length || 0} rows)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  loading={isValidating || isParsing}
                  onClick={handleValidateFile}
                  icon={FiCheckCircle}
                >
                  Validate & Preview File
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isImporting}
                  onClick={handleReset}
                  icon={FiTrash2}
                >
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* LIVE IMPORT PROGRESS BAR */}
      <AnimatePresence>
        {isImporting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-6 rounded-2xl bg-[#171717] border border-[#2A2A2A] shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                  Importing Catalogue to Database...
                </h4>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
                  Processing book {importProgress.current} of {importProgress.total} (Batch {importProgress.currentBatch} of {importProgress.totalBatches})
                </p>
              </div>
              <span className="text-xl font-bold font-mono text-white">
                {importProgress.percent}%
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full h-3 bg-[#2A2A2A] rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${importProgress.percent}%` }}
                transition={{ duration: 0.2 }}
                className="h-full bg-gradient-to-r from-neutral-200 to-white rounded-full"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-[#A1A1AA]">
              <span className="truncate max-w-md">
                Current: <span className="text-white font-medium">{importProgress.bookTitle || 'Initializing...'}</span>
              </span>
              <span className="text-neutral-400">Controlled batching active • Do not close tab</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 3: Summary Cards (Rendered after validation) */}
      {hasValidated && validatedData.stats && (
        <div className="space-y-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card className="p-4 bg-[#111111] border-[#2A2A2A]">
              <p className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                Total Records
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {validatedData.stats.total}
              </h3>
              <p className="text-[11px] text-[#71717A] mt-0.5">Spreadsheet rows</p>
            </Card>

            <Card className="p-4 bg-[#111111] border-emerald-900/40">
              <p className="text-[10px] font-semibold text-[#22C55E] uppercase tracking-wider flex items-center gap-1">
                <FiCheckCircle className="w-3 h-3" /> Ready to Import
              </p>
              <h3 className="text-2xl font-bold text-[#22C55E] mt-1">
                {validatedData.stats.valid}
              </h3>
              <p className="text-[11px] text-[#A1A1AA] mt-0.5">Eligible records</p>
            </Card>

            <Card className="p-4 bg-[#111111] border-red-900/40">
              <p className="text-[10px] font-semibold text-[#EF4444] uppercase tracking-wider flex items-center gap-1">
                <FiXCircle className="w-3 h-3" /> Excluded (Missing)
              </p>
              <h3 className="text-2xl font-bold text-[#EF4444] mt-1">
                {validatedData.stats.excludedMissing}
              </h3>
              <p className="text-[11px] text-[#A1A1AA] mt-0.5">Missing req. fields</p>
            </Card>

            <Card className="p-4 bg-[#111111] border-amber-900/40">
              <p className="text-[10px] font-semibold text-[#F59E0B] uppercase tracking-wider flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3" /> Duplicates
              </p>
              <h3 className="text-2xl font-bold text-[#F59E0B] mt-1">
                {validatedData.stats.totalDuplicates}
              </h3>
              <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                {validatedData.stats.duplicateSheet} sheet / {validatedData.stats.duplicateDb} DB
              </p>
            </Card>

            <Card className="p-4 bg-[#111111] border-[#2A2A2A]">
              <p className="text-[10px] font-semibold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1">
                <FiImage className="w-3 h-3" /> Covers Available
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {validatedData.stats.coversValid}
              </h3>
              <p className="text-[11px] text-[#71717A] mt-0.5">Valid image URLs</p>
            </Card>

            <Card className="p-4 bg-[#111111] border-[#2A2A2A]">
              <p className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                Covers Missing/Err
              </p>
              <h3 className="text-2xl font-bold text-neutral-400 mt-1">
                {validatedData.stats.coversMissing + validatedData.stats.coversFailed}
              </h3>
              <p className="text-[11px] text-[#71717A] mt-0.5">No URL or invalid</p>
            </Card>
          </div>

          {/* ACTION BAR: Import Button + Download CSV Report */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#171717] border border-[#2A2A2A]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A1A1AA]">
                Showing <strong>{filteredRows.length}</strong> of <strong>{validatedData.stats.total}</strong> records
              </span>
              {validatedData.stats.valid > 0 && (
                <Badge variant="success" size="sm">
                  {validatedData.stats.valid} ready for database
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                onClick={handleDownloadReport}
                icon={FiDownload}
              >
                Download CSV Report
              </Button>

              <Button
                variant="primary"
                size="md"
                disabled={validatedData.stats.valid === 0 || isImporting}
                loading={isImporting}
                onClick={() => setShowConfirmModal(true)}
                icon={FiArrowRight}
              >
                Import {validatedData.stats.valid} Valid Books
              </Button>
            </div>
          </div>

          {/* STEP 4: Interactive Preview Table with Filter Tabs & Search */}
          <Card className="p-0 overflow-hidden border-[#2A2A2A]">
            {/* Table Filter Tabs & Search Bar */}
            <div className="p-4 bg-[#141414] border-b border-[#2A2A2A] flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Rows', count: validatedData.stats.total },
                  { id: 'valid', label: 'Valid Rows', count: validatedData.stats.valid },
                  { id: 'excluded', label: 'Excluded (Missing)', count: validatedData.stats.excludedMissing },
                  { id: 'duplicates', label: 'Duplicates', count: validatedData.stats.totalDuplicates },
                  { id: 'images', label: 'Image Issues', count: validatedData.stats.coversFailed + (requireCoverImage ? validatedData.stats.coversMissing : 0) },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      activeTab === tab.id
                        ? 'bg-white text-black font-semibold'
                        : 'bg-[#1C1C1C] text-[#A1A1AA] hover:text-white hover:bg-[#252525]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        activeTab === tab.id ? 'bg-black text-white' : 'bg-[#2A2A2A] text-neutral-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search preview rows..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#1C1C1C] text-white border border-[#2A2A2A] rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-neutral-500 placeholder-[#71717A]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111111] border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-3.5 w-16 text-center">Row</th>
                    <th className="py-3 px-3.5 w-14">Cover</th>
                    <th className="py-3 px-3.5">Book Title</th>
                    <th className="py-3 px-3.5">Author</th>
                    <th className="py-3 px-3.5">ISBN</th>
                    <th className="py-3 px-3.5">Accession</th>
                    <th className="py-3 px-3.5">Department</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5">Exclusion / Conflict Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-[#A1A1AA] text-xs">
                        No rows found matching current filter or search criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((row) => {
                      const isValid = row.status === 'valid';
                      const isDup = row.status === 'duplicate_sheet' || row.status === 'duplicate_db';
                      const isExcluded = row.status === 'excluded';

                      return (
                        <tr
                          key={row.excelRow}
                          className={`hover:bg-[#1E1E1E]/50 transition-colors ${
                            !isValid ? 'bg-red-950/10' : ''
                          }`}
                        >
                          {/* Row Number */}
                          <td className="py-3 px-3.5 text-center font-mono text-[#A1A1AA]">
                            #{row.excelRow}
                          </td>

                          {/* Cover Thumbnail */}
                          <td className="py-3 px-3.5">
                            <div
                              onClick={() => row.coverUrl && setPreviewImageBook(row)}
                              className={`w-9 h-12 rounded bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0 cursor-pointer ${
                                row.coverUrl ? 'hover:border-white' : ''
                              }`}
                            >
                              {row.coverUrl ? (
                                <img
                                  src={row.proxyCoverUrl || row.coverUrl}
                                  alt={row.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML = '<span class="text-[9px] text-red-400">Err</span>';
                                  }}
                                />
                              ) : (
                                <FiBookOpen className="w-4 h-4 text-[#52525B]" />
                              )}
                            </div>
                          </td>

                          {/* Title */}
                          <td className="py-3 px-3.5 font-medium text-white max-w-xs">
                            <p className="truncate" title={row.title}>
                              {row.title}
                            </p>
                          </td>

                          {/* Author */}
                          <td className="py-3 px-3.5 text-[#D4D4D8] max-w-xs truncate" title={row.author}>
                            {row.author}
                          </td>

                          {/* ISBN */}
                          <td className="py-3 px-3.5 font-mono text-[#A1A1AA] whitespace-nowrap">
                            {row.isbn}
                          </td>

                          {/* Accession Number */}
                          <td className="py-3 px-3.5 font-mono text-white whitespace-nowrap">
                            {row.accessionNumber}
                          </td>

                          {/* Department */}
                          <td className="py-3 px-3.5 text-[#D4D4D8] whitespace-nowrap">
                            {row.department}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            {isValid && <Badge variant="success" size="sm">Valid</Badge>}
                            {isExcluded && <Badge variant="danger" size="sm">Excluded</Badge>}
                            {isDup && (
                              <Badge variant="warning" size="sm">
                                {row.status === 'duplicate_sheet' ? 'Duplicate (Sheet)' : 'Duplicate (DB)'}
                              </Badge>
                            )}
                            {row.status === 'image_failed' && (
                              <Badge variant="danger" size="sm">Image Error</Badge>
                            )}
                          </td>

                          {/* Reason */}
                          <td className="py-3 px-3.5 text-xs text-[#A1A1AA]">
                            {isValid ? (
                              <span className="text-[#22C55E] flex items-center gap-1">
                                <FiCheck className="w-3.5 h-3.5" /> All required fields verified
                              </span>
                            ) : (
                              <span className={isDup ? 'text-[#F59E0B]' : 'text-[#EF4444]'}>
                                {row.reason}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 bg-[#141414] border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#A1A1AA]">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-[#1C1C1C] text-white border border-[#2A2A2A] rounded-lg px-2 py-1 text-xs focus:outline-none"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="ml-2">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* CONFIRMATION MODAL BEFORE IMPORT */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Bulk Book Import"
        subtitle="Review records before database writes"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#D4D4D8] leading-relaxed">
            You are about to import{' '}
            <strong className="text-white font-bold text-sm">
              {validatedData.stats?.valid || 0} valid books
            </strong>{' '}
            into the library catalogue.
          </p>

          <div className="p-3.5 rounded-xl bg-[#111111] border border-[#2A2A2A] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#A1A1AA]">Total File Records:</span>
              <span className="font-semibold text-white">{validatedData.stats?.total}</span>
            </div>
            <div className="flex justify-between text-[#22C55E]">
              <span>Valid Books to Import:</span>
              <span className="font-bold">{validatedData.stats?.valid}</span>
            </div>
            <div className="flex justify-between text-[#EF4444]">
              <span>Excluded (Missing Required Data):</span>
              <span className="font-semibold">{validatedData.stats?.excludedMissing}</span>
            </div>
            <div className="flex justify-between text-[#F59E0B]">
              <span>Duplicates Skipped:</span>
              <span className="font-semibold">{validatedData.stats?.totalDuplicates}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-[11px] leading-relaxed">
            <strong>Important:</strong> Excluded and duplicate rows will <strong>NOT</strong> be written to the database. Cover images will be verified and uploaded to Cloudinary storage in controlled batches of 15 items.
          </div>

          <div className="pt-3 border-t border-[#2A2A2A] flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleStartImport}
            >
              Confirm & Start Import
            </Button>
          </div>
        </div>
      </Modal>

      {/* COMPLETION REPORT MODAL */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="Bulk Import Complete"
        subtitle="Catalog update execution report"
        maxWidth="max-w-md"
      >
        {completionResult && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-white">
              <div className="w-10 h-10 rounded-full bg-[#22C55E] text-black flex items-center justify-center font-bold text-lg shrink-0">
                <FiCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {completionResult.successCount} Books Successfully Imported
                </h4>
                <p className="text-[11px] text-emerald-200">
                  Catalogue items and activity logs written to Firestore.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111111] border border-[#2A2A2A] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Books Successfully Added:</span>
                <span className="font-bold text-[#22C55E]">{completionResult.successCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Rows Skipped (Missing Data):</span>
                <span className="font-semibold text-[#EF4444]">{completionResult.skippedMissing}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Duplicate Records Skipped:</span>
                <span className="font-semibold text-[#F59E0B]">{completionResult.duplicatesSkipped}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Database Write Failures:</span>
                <span className="font-semibold text-white">{completionResult.failCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Cover Images Uploaded:</span>
                <span className="font-semibold text-[#38BDF8]">{completionResult.coverSuccessCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Cover Images Failed / Skipped:</span>
                <span className="font-semibold text-[#71717A]">{completionResult.coverFailCount}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2A2A2A] flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="secondary"
                onClick={handleDownloadReport}
                icon={FiDownload}
              >
                Download CSV Report
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/inventory')}
                icon={FiBookOpen}
              >
                View Inventory
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* COVER IMAGE PREVIEW MODAL */}
      <Modal
        isOpen={Boolean(previewImageBook)}
        onClose={() => setPreviewImageBook(null)}
        title="Book Cover Image Preview"
        subtitle={previewImageBook?.title || 'Cover'}
        maxWidth="max-w-md"
      >
        {previewImageBook && (
          <div className="space-y-4 text-center">
            <div className="max-h-96 flex items-center justify-center bg-[#111111] rounded-xl p-3 border border-[#2A2A2A] overflow-hidden">
              <img
                src={previewImageBook.proxyCoverUrl || previewImageBook.coverUrl}
                alt={previewImageBook.title}
                className="max-h-80 max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="text-left text-xs text-[#A1A1AA] space-y-1">
              <p><strong className="text-white">ISBN:</strong> {previewImageBook.isbn}</p>
              <p><strong className="text-white">Accession:</strong> {previewImageBook.accessionNumber}</p>
              <p className="truncate" title={previewImageBook.coverUrl}>
                <strong className="text-white">Remote URL:</strong> {previewImageBook.coverUrl}
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setPreviewImageBook(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default BulkUpload;
