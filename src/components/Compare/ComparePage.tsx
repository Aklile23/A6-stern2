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

  const [leftViewerScreenshots, setLeftViewerScreenshots] = useState<string[]>([]);
  const [rightViewerScreenshots, setRightViewerScreenshots] = useState<string[]>([]);

  const handleLeftScreenshot = (screenshots: string[]) => setLeftViewerScreenshots(screenshots);
  const handleRightScreenshot = (screenshots: string[]) => setRightViewerScreenshots(screenshots);

  const [isSeparateNotes, setIsSeparateNotes] = useState(false); // New state for separate notes checkbox
  const [leftNotes, setLeftNotes] = useState<string>(''); // New state for left view notes
  const [rightNotes, setRightNotes] = useState<string>(''); // New state for right view notes

  const [leftImageDetails, setLeftImageDetails] = useState<{ fileName: string; date: string } | null>(null);
  const [rightImageDetails, setRightImageDetails] = useState<{ fileName: string; date: string } | null>(null);
  // Add this at the top, alongside existing useState hooks
  const [isBottomSectionVisible, setIsBottomSectionVisible] = useState(false);


  // Handlers to update image details from each viewer
  const handleLeftImageDetailsUpdate = (fileName: string, date: string) => {
    setLeftImageDetails({ fileName, date });
  };

  const handleRightImageDetailsUpdate = (fileName: string, date: string) => {
    setRightImageDetails({ fileName, date });
  };


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
  setLeftSelectedFile(fileUrl); // Ensure this updates the state correctly
  if (fileUrl.endsWith('.glb') || fileUrl.endsWith('.obj') || fileUrl.endsWith('.e57')) {
    setLeftHDImageUrl(fileUrl);
    setShowLeftPCDViewer(true);
  } else {
    setLeftHDImageUrl(fileUrl);
    setShowLeft360Viewer(true);
  }
};

const handleRightThumbnailClick = (fileUrl: string) => {
  setRightSelectedFile(fileUrl); // Ensure this updates the state correctly
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

  const [safetyIssue, setSafetyIssue] = useState(false);
  const [qualityIssue, setQualityIssue] = useState(false);
  const [delayed, setDelayed] = useState(false);

  const [leftSafetyIssue, setLeftSafetyIssue] = useState(false);
  const [leftQualityIssue, setLeftQualityIssue] = useState(false);
  const [leftDelayed, setLeftDelayed] = useState(false);

  const [rightSafetyIssue, setRightSafetyIssue] = useState(false);
  const [rightQualityIssue, setRightQualityIssue] = useState(false);
  const [rightDelayed, setRightDelayed] = useState(false);


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
    
    if (isSeparateNotes) {
      // Include separate notes for left and right views
      doc.text('Left View Notes:', 10, 20);
      doc.text(leftNotes || "No notes provided for Left View.", 10, 30, { maxWidth: 180 });
  
      doc.text('Right View Notes:', 10, 50);
      doc.text(rightNotes || "No notes provided for Right View.", 10, 60, { maxWidth: 180 });
    } else {
      // Include general notes
      doc.text(notes || "No general notes provided.", 10, 20, { maxWidth: 180 });
    }
  
    doc.save('Comparison_Report_Notes.pdf');
  };
  const handleModalPublish = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    let currentY = 110; // Starting Y position after the header
  
    // Title Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Comparison Report', 105, 15, { align: 'center' });
  
    // Date and Divider
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Date: ${currentDate}`, 10, 25);
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(10, 30, 200, 30); // Divider under title
  
    // Section: Project Information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60);
    doc.text("Project Information:", 10, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Project Name:", 10, 50);
    doc.setFont("helvetica", "italic");
    doc.text("A6_stern", 50, 50);
    doc.setFont("helvetica", "normal");
    doc.text("Generated By:", 10, 60);
    doc.setFont("helvetica", "italic");
    doc.text("John Doe", 50, 60);
  
    // Project Zone Section
    doc.setFont("helvetica", "bold");
    doc.text("Project Zone:", 10, 70);
    doc.setFont("helvetica", "italic");
  
    if (leftImageDetails && rightImageDetails) {
      doc.text("This report compares two images:", 10, 80);
      doc.text(
        `Left View: Based on ${leftImageDetails.fileName ?? ''} of Room ${leftImageDetails.fileName?.match(/\d+/)?.[0] ?? ''} taken on ${leftImageDetails.date ?? ''}.`,
        10,
        90,
        { maxWidth: 180 }
      );
      doc.text(
        `Right View: Based on ${rightImageDetails.fileName ?? ''} of Room ${rightImageDetails.fileName?.match(/\d+/)?.[0] ?? ''} taken on ${rightImageDetails.date ?? ''}.`,
        10,
        100,
        { maxWidth: 180 }
      );
      currentY = 110;
    } else if (leftImageDetails || rightImageDetails) {
      const imageDetails = leftImageDetails || rightImageDetails;
      doc.text(
        `This report is generated based on ${imageDetails?.fileName ?? ''} of Room ${imageDetails?.fileName?.match(/\d+/)?.[0] ?? ''} taken on ${imageDetails?.date ?? ''}.`,
        10,
        80,
        { maxWidth: 180 }
      );
      currentY = 90;
    }
  
    // Observations Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60);
  
    if (leftImageDetails) {
      doc.text("Observation of Image 1", 10, currentY);
      currentY += 10;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      const leftObservationText = "AI-generated explanation of the image 1 goes here";
      const leftObservationLines = doc.splitTextToSize(leftObservationText, 180);
      doc.text(leftObservationLines, 10, currentY);
      currentY += leftObservationLines.length * 6 + 10;
    }
  
    if (rightImageDetails) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Observation of Image 2", 10, currentY);
      currentY += 10;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      const rightObservationText = "AI-generated explanation of the image 2 goes here";
      const rightObservationLines = doc.splitTextToSize(rightObservationText, 180);
      doc.text(rightObservationLines, 10, currentY);
      currentY += rightObservationLines.length * 6 + 10;
    }
  
    // Section: Notes
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60);
  
    doc.text('Left View Notes:', 10, currentY);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    const leftNotesText = doc.splitTextToSize(leftNotes || "No notes provided for Left View.", 180);
    doc.text(leftNotesText, 10, currentY + 10);
    currentY += leftNotesText.length * 6 + 20;
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text('Right View Notes:', 10, currentY);
    doc.setFont("helvetica", "italic");
    const rightNotesText = doc.splitTextToSize(rightNotes || "No notes provided for Right View.", 180);
    doc.text(rightNotesText, 10, currentY + 10);
    currentY += rightNotesText.length * 6 + 20;
  
    // Section: Report Flags
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60);
    doc.text('Report Flags:', 10, currentY);
  
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
  
    let flagsText = "";
  
    if (leftDelayed || leftQualityIssue || leftSafetyIssue) {
      flagsText += "Left View is marked";
      const leftIssues = [];
      if (leftDelayed) leftIssues.push("as delayed");
      if (leftQualityIssue) leftIssues.push("for having a Quality Issue");
      if (leftSafetyIssue) leftIssues.push("for having a Safety Issue");
      flagsText += ` ${leftIssues.join(" and ")}. `;
    }
  
    if (rightDelayed || rightQualityIssue || rightSafetyIssue) {
      flagsText += "Right View is marked";
      const rightIssues = [];
      if (rightDelayed) rightIssues.push("as delayed");
      if (rightQualityIssue) rightIssues.push("for having a Quality Issue");
      if (rightSafetyIssue) rightIssues.push("for having a Safety Issue");
      flagsText += ` ${rightIssues.join(" and ")}. `;
    }
  
    if (!flagsText) {
      flagsText = "No issues marked.";
    }
  
    const flagsTextLines = doc.splitTextToSize(flagsText, 180);
    doc.text(flagsTextLines, 10, currentY + 10);
    currentY += flagsTextLines.length * 6 + 20;
  
    // Section: Reference Images Table
    currentY += 10;
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Reference Images", 105, currentY, { align: 'center' });
    currentY += 10;
  
    const leftColumnX = 20;
    const rightColumnX = 110;
    let rowY = currentY;
  
    const rows = Math.max(leftViewerScreenshots.length, rightViewerScreenshots.length);
  
    for (let i = 0; i < rows; i++) {
      if (rowY > 250) {
        doc.addPage();
        rowY = 20;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Reference Images", 105, rowY, { align: 'center' });
        rowY += 10;
      }
  
      if (leftViewerScreenshots[i]) {
        doc.addImage(leftViewerScreenshots[i], 'PNG', leftColumnX, rowY, 80, 80);
      }
  
      if (rightViewerScreenshots[i]) {
        doc.addImage(rightViewerScreenshots[i], 'PNG', rightColumnX, rowY, 80, 80);
      }
  
      rowY += 50;
    }
  
    // Save the PDF
    doc.save('Comparison_Report.pdf');
  
    // Clear screenshots and close modal
    setLeftViewerScreenshots([]);
    setRightViewerScreenshots([]);
    closePublishModal();
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
        {/* Left Viewer Section */}
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
                <Compare360Viewer imageUrl={leftHDImageUrl as string} onClose={handleCloseLeft360Viewer} onScreenshotsUpdate={handleLeftScreenshot}  onImageDetailsUpdate={handleLeftImageDetailsUpdate} />
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
          {/* {leftSelectedFile && (
            <div className="mt-4">
              <p className="text-white text-center">Selected File: {leftSelectedFile.split('/').pop()}</p>
            </div>
          )} */}
        </div>
  
        {/* Right Viewer Section */}
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
                <Compare360Viewer imageUrl={rightHDImageUrl as string} onClose={handleCloseRight360Viewer} onScreenshotsUpdate={handleRightScreenshot} onImageDetailsUpdate={handleRightImageDetailsUpdate}  />
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
          {/* {rightSelectedFile && (
            <div className="mt-4">
              <p className="text-white text-center">Selected File: {rightSelectedFile.split('/').pop()}</p>
            </div>
          )} */}
        </div>
      </div>
      <div className="flex justify-end mt-3 mb-3">
        <button
          onClick={() => setIsBottomSectionVisible(true)}
          disabled={!leftSelectedFile || !rightSelectedFile}
          className={`py-3 px-6 rounded-lg font-semibold shadow-md transition-transform duration-200 transform hover:scale-105 focus:outline-none ${
            leftSelectedFile && rightSelectedFile
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Compare
        </button>
      </div>

      {isBottomSectionVisible && (
        <div>
          {/* Notes Text Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              placeholder="Add notes for the left view here..."
              value={leftNotes}
              onChange={(e) => setLeftNotes(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-strokedark rounded-md p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
            <textarea
              placeholder="Add notes for the right view here..."
              value={rightNotes}
              onChange={(e) => setRightNotes(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-strokedark rounded-md p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
          </div>

          {/* Flags Section */}
          <div className="flex items-center mb-3 mt-3 ml-2 space-x-6">
            {/* Left View Flags */}
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 dark:text-gray-300 font-semibold">Left View Flags:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={leftSafetyIssue}
                  onChange={() => setLeftSafetyIssue(!leftSafetyIssue)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label className="text-gray-700 dark:text-gray-300">Safety Issue</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={leftQualityIssue}
                  onChange={() => setLeftQualityIssue(!leftQualityIssue)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label className="text-gray-700 dark:text-gray-300">Quality Issue</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={leftDelayed}
                  onChange={() => setLeftDelayed(!leftDelayed)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label className="text-gray-700 dark:text-gray-300">Delayed</label>
              </div>
            </div>

            {/* Right View Flags */}
            <div className="flex items-end space-x-4">
              <label className="text-gray-700 dark:text-gray-300 font-semibold ml-125">Right View Flags:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rightSafetyIssue}
                  onChange={() => setRightSafetyIssue(!rightSafetyIssue)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label className="text-gray-700 dark:text-gray-300">Safety Issue</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rightQualityIssue}
                  onChange={() => setRightQualityIssue(!rightQualityIssue)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label className="text-gray-700 dark:text-gray-300">Quality Issue</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rightDelayed}
                  onChange={() => setRightDelayed(!rightDelayed)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label className="text-gray-700 dark:text-gray-300">Delayed</label>
              </div>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex justify-end mt-6 gap-3">
            <button
              // onClick={openPublishModal}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
            <button
              onClick={openPublishModal}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Report
            </button>
          </div>
        </div>
      )} 
  
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
                <span className="text-gray-700 dark:text-gray-300">Include Screenshots</span>
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
