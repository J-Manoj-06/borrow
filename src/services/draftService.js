const DRAFT_KEY = 'borrow_add_book_draft';

/**
 * Save draft form data to LocalStorage.
 * @param {object} formData 
 */
export function saveBookDraft(formData) {
  try {
    const payload = {
      data: formData,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to save draft to LocalStorage:', e);
  }
}

/**
 * Load draft form data from LocalStorage.
 * @returns {object|null}
 */
export function loadBookDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data || null;
  } catch (e) {
    console.warn('Failed to load draft from LocalStorage:', e);
    return null;
  }
}

/**
 * Clear draft form data from LocalStorage.
 */
export function clearBookDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    console.warn('Failed to clear draft from LocalStorage:', e);
  }
}
