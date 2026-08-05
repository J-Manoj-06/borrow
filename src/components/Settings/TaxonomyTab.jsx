import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Button from '../Button';
import Input from '../Input';
import { FiPlus, FiTrash2, FiSave, FiLayers, FiGrid } from 'react-icons/fi';

export const TaxonomyTab = ({
  categoriesData = [],
  departmentsData = [],
  semestersData = [],
  onSaveSection,
  isSaving,
}) => {
  const [categories, setCategories] = useState([
    'Academic',
    'Reference',
    'Magazine',
    'Novel',
    'Research',
    'Others',
  ]);
  const [departments, setDepartments] = useState([
    'Computer Science',
    'Information Technology',
    'Electronics & Comm',
    'Electrical & Electronics',
    'Mechanical Eng',
    'Civil Eng',
    'MBA',
    'MCA',
  ]);
  const [semesters, setSemesters] = useState([
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
  ]);

  const [newCat, setNewCat] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newSem, setNewSem] = useState('');

  useEffect(() => {
    if (categoriesData && Array.isArray(categoriesData.items || categoriesData)) {
      setCategories(categoriesData.items || categoriesData);
    }
    if (departmentsData && Array.isArray(departmentsData.items || departmentsData)) {
      setDepartments(departmentsData.items || departmentsData);
    }
    if (semestersData && Array.isArray(semestersData.items || semestersData)) {
      setSemesters(semestersData.items || semestersData);
    }
  }, [categoriesData, departmentsData, semestersData]);

  // Categories Handlers
  const handleAddCategory = () => {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      const updated = [...categories, newCat.trim()];
      setCategories(updated);
      setNewCat('');
      onSaveSection('categories', updated);
    }
  };

  const handleDeleteCategory = (cat) => {
    const updated = categories.filter((c) => c !== cat);
    setCategories(updated);
    onSaveSection('categories', updated);
  };

  // Departments Handlers
  const handleAddDepartment = () => {
    if (newDept.trim() && !departments.includes(newDept.trim())) {
      const updated = [...departments, newDept.trim()];
      setDepartments(updated);
      setNewDept('');
      onSaveSection('departments', updated);
    }
  };

  const handleDeleteDepartment = (dept) => {
    const updated = departments.filter((d) => d !== dept);
    setDepartments(updated);
    onSaveSection('departments', updated);
  };

  // Semesters Handlers
  const handleAddSemester = () => {
    if (newSem.trim() && !semesters.includes(newSem.trim())) {
      const updated = [...semesters, newSem.trim()];
      setSemesters(updated);
      setNewSem('');
      onSaveSection('semesters', updated);
    }
  };

  const handleDeleteSemester = (sem) => {
    const updated = semesters.filter((s) => s !== sem);
    setSemesters(updated);
    onSaveSection('semesters', updated);
  };

  return (
    <div className="space-y-6 text-xs text-white">
      {/* 1. Book Categories Section */}
      <Card className="p-6">
        <div className="border-b border-[#2A2A2A] pb-4 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FiLayers className="w-4 h-4 text-white" /> Book Categories
          </h3>
          <p className="text-xs text-[#A1A1AA]">Manage genres and academic subjects for catalog filtering</p>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add new category (e.g. Neuroscience)..."
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />
          <Button variant="primary" size="sm" icon={FiPlus} onClick={handleAddCategory}>
            Add Category
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <div
              key={c}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111] border border-[#2A2A2A] text-xs font-medium"
            >
              <span>{c}</span>
              <button
                type="button"
                onClick={() => handleDeleteCategory(c)}
                className="text-[#A1A1AA] hover:text-[#EF4444] transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Departments Section */}
      <Card className="p-6">
        <div className="border-b border-[#2A2A2A] pb-4 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FiGrid className="w-4 h-4 text-white" /> Academic Departments
          </h3>
          <p className="text-xs text-[#A1A1AA]">Manage institution departments associated with students & books</p>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add new department (e.g. Artificial Intelligence)..."
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
          />
          <Button variant="primary" size="sm" icon={FiPlus} onClick={handleAddDepartment}>
            Add Department
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {departments.map((d) => (
            <div
              key={d}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111] border border-[#2A2A2A] text-xs font-medium"
            >
              <span>{d}</span>
              <button
                type="button"
                onClick={() => handleDeleteDepartment(d)}
                className="text-[#A1A1AA] hover:text-[#EF4444] transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. Semesters Section */}
      <Card className="p-6">
        <div className="border-b border-[#2A2A2A] pb-4 mb-4">
          <h3 className="text-base font-bold text-white">Semester Levels</h3>
          <p className="text-xs text-[#A1A1AA]">Manage student academic semester levels</p>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add semester level (e.g. Semester 9)..."
            value={newSem}
            onChange={(e) => setNewSem(e.target.value)}
          />
          <Button variant="primary" size="sm" icon={FiPlus} onClick={handleAddSemester}>
            Add Semester
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {semesters.map((s) => (
            <div
              key={s}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111] border border-[#2A2A2A] text-xs font-medium"
            >
              <span>{s}</span>
              <button
                type="button"
                onClick={() => handleDeleteSemester(s)}
                className="text-[#A1A1AA] hover:text-[#EF4444] transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TaxonomyTab;
