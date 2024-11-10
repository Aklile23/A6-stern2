import React, { useState } from 'react';
import CompareCalendar from './CompareCalendar';
import CompareFileExplorer from './CompareFileExplorer';
import Compare360Viewer from './Compare360Viewer';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import ComparePCDViewer from './ComparePCDViewer';

const ComparePage: React.FC = () => {
  const availableDates = ['2024-10-07', '2024-10-09', '2024-10-11', '2024-10-14', '2024-10-16', '2024-10-18', '2024-10-21', '2024-10-23', '2024-10-25', '2024-10-28', '2024-11-01'];
  const navigate = useNavigate();

  const [leftSelectedDate, setLeftSelectedDate] = useState<string | null>(null);
  const [rightSelectedDate, setRightSelectedDate] = useState<string | null>(null);
  const [leftSelectedFile, setLeftSelectedFile] = useState<string | null>(null);
  const [rightSelectedFile, setRightSelectedFile] = useState<string | null>(null);

  const [showLeftCalendar, setShowLeftCalendar] = useState(true);
  const [showRightCalendar, setShowRightCalendar] = useState(true);
  const [showLeft360Viewer, setShowLeft360Viewer] = useState(false);
  const [showRight360Viewer, setShowRight360Viewer] = useState(false);

  const [leftHDImageUrl, setLeftHDImageUrl] = useState<string | null>(null);
  const [rightHDImageUrl, setRightHDImageUrl] = useState<string | null>(null);

  const [showLeftPCDViewer, setShowLeftPCDViewer] = useState(false);
  const [showRightPCDViewer, setShowRightPCDViewer] = useState(false);  

  // State for modal and checkboxes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [includeImages, setIncludeImages] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>(''); // Store the user's notes

  const handleLeftDateSelect = (date: string) => {
    setLeftSelectedDate(date);
    setLeftSelectedFile(null);
    setShowLeftCalendar(false);
  };

  const handleRightDateSelect = (date: string) => {
    setRightSelectedDate(date);
    setRightSelectedFile(null);
    setShowRightCalendar(false);
  };

  const handleLeftThumbnailClick = (fileUrl: string) => {
    if (fileUrl.endsWith('.glb') || fileUrl.endsWith('.obj') || fileUrl.endsWith('.e57')) {
      setLeftHDImageUrl(fileUrl);
      setShowLeftPCDViewer(true);
    } else {
      setLeftHDImageUrl(fileUrl);
      setShowLeft360Viewer(true);
    }
  };
  
  const handleRightThumbnailClick = (fileUrl: string) => {
    if (fileUrl.endsWith('.glb') || fileUrl.endsWith('.obj') || fileUrl.endsWith('.e57')) {
      setRightHDImageUrl(fileUrl);
      setShowRightPCDViewer(true);
    } else {
      setRightHDImageUrl(fileUrl);
      setShowRight360Viewer(true);
    }
  };

  const handleCloseLeft360Viewer = () => setShowLeft360Viewer(false);
  const handleCloseRight360Viewer = () => setShowRight360Viewer(false);

  const openPublishModal = () => setIsModalOpen(true);

  const closePublishModal = () => {
    setIsModalOpen(false);
    setIncludeImages(false);
    setIncludeNotes(false);
    setValidationMessage(null);
  };

  const generatePDFWithNotes = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Comparison Report Notes', 10, 10);
    doc.setFontSize(12);
    doc.text(notes, 10, 20);
    doc.save('Comparison_Report_Notes.pdf');
  };

  const handleModalPublish = () => {
    if (!includeImages && !includeNotes) {
      setValidationMessage('Please select at least one option to include in the report.');
    } else {
      if (includeNotes) {
        generatePDFWithNotes();
      }
      closePublishModal();
    }
  };

  return (
    <div className="w-full max-w-screen-3xl bg-white rounded-md shadow-default dark:bg-boxdark dark:text-white p-4 mx-auto mt-6">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-black dark:text-white">Compare View</h1>
        
        <button
          onClick={() => navigate('/A6_stern')}
          className="bg-primary text-white font-semibold py-2 px-3 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center"
        >
          <svg fill="#ffffff" height="24px" width="24px" viewBox="0 0 288.312 288.312" xmlns="http://www.w3.org/2000/svg">
            <path d="M127.353,3.555c-4.704-4.74-12.319-4.74-17.011,0L15.314,99.653c-4.74,4.788-4.547,12.884,0.313,17.48l94.715,95.785c4.704,4.74,12.319,4.74,17.011,0c4.704-4.74,4.704-12.427,0-17.167l-74.444-75.274h199.474v155.804c0,6.641,5.39,12.03,12.03,12.03c6.641,0,12.03-5.39,12.03-12.03V108.231c0-6.641-5.39-12.03-12.03-12.03H52.704l74.648-75.49C132.056,15.982,132.056,8.295,127.353,3.555z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="flex flex-col items-center justify-center w-full h-[70vh] bg-slate-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
        {showLeftCalendar ? (
            <>
              <CompareCalendar availableDates={availableDates} onDateSelect={handleLeftDateSelect} />
              <p className="text-gray-300 mt-4">{leftSelectedDate ? `Selected: ${leftSelectedDate}` : 'No date selected'}</p>
            </>
          ) : (
            <>
              {showLeftPCDViewer ? (
                <ComparePCDViewer modelUrl={leftHDImageUrl as string} onClose={() => setShowLeftPCDViewer(false)} />
              ) : showLeft360Viewer ? (
                <Compare360Viewer imageUrl={leftHDImageUrl as string} onClose={handleCloseLeft360Viewer} />
              ) : (
                leftSelectedDate && (
                  <CompareFileExplorer
                    selectedDate={leftSelectedDate}
                    onFileSelect={handleLeftThumbnailClick}
                    className="w-full h-full"
                    onBackToCalendar={() => setShowLeftCalendar(true)}
                  />
                )
              )}
            </>
          )}
          {leftSelectedFile && (
            <div className="mt-4">
              <p className="text-white text-center">Selected File: {leftSelectedFile.split('/').pop()}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center w-full h-[70vh] bg-slate-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
        {showRightCalendar ? (
            <>
              <CompareCalendar availableDates={availableDates} onDateSelect={handleRightDateSelect} />
              <p className="text-gray-300 mt-4">{rightSelectedDate ? `Selected: ${rightSelectedDate}` : 'No date selected'}</p>
            </>
          ) : (
            <>
              {showRightPCDViewer ? (
                <ComparePCDViewer modelUrl={rightHDImageUrl as string} onClose={() => setShowRightPCDViewer(false)} />
              ) : showRight360Viewer ? (
                <Compare360Viewer imageUrl={rightHDImageUrl as string} onClose={handleCloseRight360Viewer} />
              ) : (
                rightSelectedDate && (
                  <CompareFileExplorer
                    selectedDate={rightSelectedDate}
                    onFileSelect={handleRightThumbnailClick}
                    className="w-full h-full"
                    onBackToCalendar={() => setShowRightCalendar(true)}
                  />
                )
              )}
            </>
          )}
          {rightSelectedFile && (
            <div className="mt-4">
              <p className="text-white text-center">Selected File: {rightSelectedFile.split('/').pop()}</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full mt-6">
        <textarea
          placeholder="Add comparison notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-strokedark rounded-md p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />
      </div>

      {/* Publish Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={openPublishModal}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Publish Comparison
        </button>
      </div>

      {/* Publish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">Publish Report</h2>
            
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={() => setIncludeImages(!includeImages)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="text-gray-700 dark:text-gray-300">Include Images</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={() => setIncludeNotes(!includeNotes)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="text-gray-700 dark:text-gray-300">Include Notes</span>
              </label>
            </div>

            {validationMessage && (
              <p className="text-red-600 text-sm mb-4">{validationMessage}</p>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={closePublishModal}
                className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleModalPublish}
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
