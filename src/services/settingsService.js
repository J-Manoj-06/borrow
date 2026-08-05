import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const DEFAULT_SETTINGS = {
  library: {
    libraryName: 'Borrow Central Library',
    logoUrl: '',
    collegeName: 'State Institute of Technology',
    address: '100 University Avenue, Academic Block A',
    phone: '+1 (555) 019-2834',
    email: 'library@borrow.app',
    website: 'https://borrow.app',
    workingHours: 'Mon - Fri: 8:00 AM - 8:00 PM, Sat: 9:00 AM - 5:00 PM',
    description: 'Central academic library providing physical book borrowing synchronized with the Borrow Flutter application.',
  },
  borrowing_rules: {
    maxBooksPerStudent: 5,
    defaultBorrowDurationDays: 14,
    maxRenewalCount: 2,
    maxReservationLimit: 3,
    gracePeriodDays: 2,
    referenceBookPolicy: 'in_library_only',
    minAvailableCopiesRequired: 1,
    allowWeekendBorrowing: true,
    allowHolidayBorrowing: false,
    allowBookRenewal: true,
    allowReservation: true,
  },
  notification_preferences: {
    borrowApproved: true,
    borrowRejected: true,
    dueTomorrow: true,
    overdueReminder: true,
    bookReturned: true,
    accountApproved: true,
    accountSuspended: true,
  },
  appearance: {
    theme: 'dark',
    sidebarWidth: 'normal',
    fontSize: 'medium',
  },
  departments: [
    'Computer Science',
    'Information Technology',
    'Electronics & Comm',
    'Electrical & Electronics',
    'Mechanical Eng',
    'Civil Eng',
    'MBA',
    'MCA',
  ],
  categories: [
    'Academic',
    'Reference',
    'Magazine',
    'Novel',
    'Research',
    'Others',
  ],
  semesters: [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
  ],
};

/**
 * Subscribe to realtime updates for all documents in the settings collection in Firestore.
 * Automatically initializes default values if documents are absent.
 * @param {function} callback 
 * @param {function} onError 
 */
export function subscribeToSettings(callback, onError) {
  try {
    const settingsRef = collection(db, 'settings');

    const unsubscribe = onSnapshot(
      settingsRef,
      async (snapshot) => {
        const dataMap = { ...DEFAULT_SETTINGS };

        snapshot.docs.forEach((docSnap) => {
          dataMap[docSnap.id] = docSnap.data();
        });

        // Initialize missing default documents in Firestore if snapshot is empty
        if (snapshot.empty) {
          try {
            await Promise.all(
              Object.keys(DEFAULT_SETTINGS).map((key) =>
                setDoc(doc(db, 'settings', key), DEFAULT_SETTINGS[key], { merge: true })
              )
            );
          } catch (initErr) {
            console.warn('Settings default initialization warning:', initErr);
          }
        }

        callback(dataMap);
      },
      (error) => {
        console.error('Error in settings realtime listener:', error);
        callback(DEFAULT_SETTINGS);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Failed to create settings listener:', error);
    callback(DEFAULT_SETTINGS);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Save or update a specific section document in the settings collection.
 * @param {string} sectionId 
 * @param {object} payload 
 * @param {string} librarianEmail 
 */
export async function saveSettingsSection(sectionId, payload, librarianEmail = 'Librarian') {
  if (!sectionId) throw new Error('Section ID is required.');

  try {
    const docRef = doc(db, 'settings', sectionId);
    
    // Save to Firestore
    if (Array.isArray(payload)) {
      await setDoc(docRef, { items: payload, updatedAt: serverTimestamp() }, { merge: true });
    } else {
      await setDoc(docRef, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
    }

    // Log activity
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        type: 'settings_updated',
        title: 'Settings Updated',
        action: `Updated settings section: ${sectionId}`,
        userEmail: librarianEmail,
        timestamp: serverTimestamp(),
      });
    } catch (logErr) {
      console.warn('Activity log error:', logErr);
    }
  } catch (error) {
    console.error(`Error saving settings section ${sectionId}:`, error);
    throw error;
  }
}
