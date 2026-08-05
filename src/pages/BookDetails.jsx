import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../layout/PageContainer';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import BookCoverViewer from '../components/BookDetails/BookCoverViewer';
import BookQuickStats from '../components/BookDetails/BookQuickStats';
import BookInfoView from '../components/BookDetails/BookInfoView';
import BookEditForm from '../components/BookDetails/BookEditForm';
import BorrowHistoryTable from '../components/BookDetails/BorrowHistoryTable';
import RelatedBooksGrid from '../components/BookDetails/RelatedBooksGrid';
import UnsavedChangesModal from '../components/BookDetails/UnsavedChangesModal';
import useBookDetails from '../hooks/useBookDetails';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiArchive, 
  FiTrash2, 
  FiSave, 
  FiX, 
  FiAlertTriangle, 
  FiAlertCircle 
} from 'react-icons/fi';

export const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const {
    book,
    loading,
    error,
    isEditing,
    editData,
    formErrors,
    newCoverPreview,
    isUploadingImage,
    uploadProgress,
    isSaving,
    transactions,
    relatedBooks,
    showUnsavedModal,
    setShowUnsavedModal,
    showArchiveModal,
    setShowArchiveModal,
    showDeleteModal,
    setShowDeleteModal,
    enterEditMode,
    requestExitEditMode,
    forceDiscardChanges,
    handleFieldChange,
    addTag,
    removeTag,
    handleCoverSelect,
    handleSaveBook,
    handleConfirmArchive,
    handleConfirmSoftDelete,
  } = useBookDetails(bookId);

  if (loading) {
    return <Loader fullScreen label="Loading book specifications from Firestore..." />;
  }

  if (error || !book) {
    return (
      <PageContainer>
        <div className="p-8 text-center bg-[#171717] border border-[#2A2A2A] rounded-2xl max-w-xl mx-auto my-12">
          <FiAlertCircle className="w-10 h-10 text-[#EF4444] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Book Record Not Found</h2>
          <p className="text-xs text-[#A1A1AA] mt-1 mb-6">
            {error || 'The requested catalog item does not exist or has been removed.'}
          </p>
          <Button variant="primary" icon={FiArrowLeft} onClick={() => navigate('/inventory')}>
            Return to Inventory
          </Button>
        </div>
      </PageContainer>
    );
  }

  const activeBookData = isEditing ? editData : book;
  const activeCoverUrl = newCoverPreview || activeBookData.coverImage || activeBookData.cover || activeBookData.cover_image || activeBookData.imageUrl || activeBookData.image || activeBookData.image_url || activeBookData.cover_url || activeBookData.coverUrl;

  return (
    <PageContainer>
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={FiArrowLeft}
            onClick={() => {
              if (isEditing) requestExitEditMode();
              else navigate('/inventory');
            }}
          >
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white line-clamp-1">
                {activeBookData.title || 'Untitled Book'}
              </h1>
              <Badge variant={book.isArchived ? 'neutral' : 'success'}>
                {book.isArchived ? 'Archived' : book.status || 'Available'}
              </Badge>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-0.5 font-mono">ID: {bookId}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                icon={FiX}
                onClick={requestExitEditMode}
              >
                Cancel Edits
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={FiSave}
                loading={isSaving}
                onClick={handleSaveBook}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                icon={FiEdit2}
                onClick={enterEditMode}
              >
                Edit Specification
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={FiArchive}
                onClick={() => setShowArchiveModal(true)}
              >
                Archive
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={FiTrash2}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Panel (1/3 width): Large Cover Viewer & Quick Stats */}
        <div className="space-y-6 lg:col-span-1">
          <BookCoverViewer
            coverUrl={activeCoverUrl}
            title={activeBookData.title}
          />
          <BookQuickStats book={activeBookData} />
        </div>

        {/* Right Panel (2/3 width): View Mode or Edit Mode */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <BookEditForm
              editData={editData}
              onChange={handleFieldChange}
              onImageChange={handleCoverSelect}
              onAddTag={addTag}
              onRemoveTag={removeTag}
              errors={formErrors}
              isUploadingImage={isUploadingImage}
              uploadProgress={uploadProgress}
            />
          ) : (
            <BookInfoView book={book} />
          )}
        </div>
      </div>

      {/* Bottom Section: Recent Borrow History */}
      <div className="mb-8">
        <BorrowHistoryTable transactions={transactions} />
      </div>

      {/* Bottom Section: Related Books */}
      <div className="mb-8">
        <RelatedBooksGrid books={relatedBooks} />
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onSave={handleSaveBook}
        onDiscard={forceDiscardChanges}
      />

      {/* Archive Confirmation Modal */}
      <Modal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        title="Confirm Archive Book"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs text-white">
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-[#2A2A2A] text-neutral-300">
            <p className="font-semibold text-white">Archive "{book.title}"?</p>
            <p className="mt-1">
              Archiving sets <code className="text-white font-mono">isArchived = true</code>. The book remains in catalog records but marked as inactive.
            </p>
          </div>
          <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowArchiveModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmArchive}>
              Confirm Archive
            </Button>
          </div>
        </div>
      </Modal>

      {/* Soft Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Soft Delete Book"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs text-white">
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 flex items-start gap-3">
            <FiAlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Perform Soft Delete on "{book.title}"?</p>
              <p className="mt-1 text-xs text-red-300/80">
                This updates <code className="font-mono text-white">deletedAt</code> and <code className="font-mono text-white">deletedBy</code> in Firestore.
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmSoftDelete}>
              Confirm Soft Delete
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default BookDetails;
