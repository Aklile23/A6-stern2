// StaticViewer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import imageDescriptions from '../utils/imageDescriptions';


const StaticViewer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const imageUrl = location.state?.imageUrl || "/Images/panoramas/20241007/room02.jpg";
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State for modal, checkboxes, and text fields
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [includeAutoLabeling, setIncludeAutoLabeling] = useState(false);
  const [includeAdditionalComments, setIncludeAdditionalComments] = useState(false);
  const [autoLabelingText, setAutoLabelingText] = useState('');
  const [additionalCommentsText, setAdditionalCommentsText] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const [safetyIssue, setSafetyIssue] = useState(false);
  const [qualityIssue, setQualityIssue] = useState(false);
  const [delayed, setDelayed] = useState(false);

  const [displayedText, setDisplayedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false); 
  
  useEffect(() => {
    // Clear the text when the image changes
    setDisplayedText('');
    setIsGenerating(false); // Reset generating state
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current); // Clear any ongoing typing timeout
      typingTimeoutRef.current = null; // Reset the timeout ref
    }
  }, [imageUrl]);

  useEffect(() => {
    return () => {
        setDisplayedText(''); // Clear text on unmount
    };
  }, []);

  const extractDateFromPath = (path: string): string => {
    // Split the path into parts
    const parts: string[] = path.split('/');
  
    // Look for a segment that matches the YYYYMMDD pattern
    const dateSegment: string | undefined = parts.find((segment: string) => /^\d{8}$/.test(segment));
  
    if (!dateSegment) {
      throw new Error("Date not found in the path");
    }
  
    // Format the date as YYYY-MM-DD
    return `${dateSegment.slice(0, 4)}-${dateSegment.slice(4, 6)}-${dateSegment.slice(6, 8)}`;
  };

  const fileName = imageUrl.split('/').pop();
  let formattedDate: string;

  try {
    formattedDate = extractDateFromPath(imageUrl);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error extracting date:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    formattedDate = "Unknown Date"; // Fallback if date extraction fails
  }

  let roomNumber = "Unknown Room";
  const roomMatch = fileName.match(/room(\d+)/i);
  if (roomMatch) {
    roomNumber = `Room ${parseInt(roomMatch[1], 10)}`; // Extracts room number and removes leading zero if any
  }

  const handleGenerateAutomaticLabeling = () => {
    const relativePath = imageUrl.split('Images/')[1];
    const description = imageDescriptions[relativePath] || "No description available for this image.";
    setAutoLabelingText(description);

    setDisplayedText(''); // Clear previous text
    setIsGenerating(true); 
    let index = 0;

    // Stop any ongoing typing animation
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // "Generating..." animation
    const loadingPhases = ['Generating.', 'Generating..', 'Generating...','Generating.', 'Generating..', 'Generating...'];
    let loadingIndex = 0;

    const showLoading = () => {
      if (loadingIndex < loadingPhases.length) {
        setDisplayedText(loadingPhases[loadingIndex]);
        loadingIndex++;
        typingTimeoutRef.current = setTimeout(showLoading, 500); // Adjust delay between loading phases
      } else {
        startTyping(); // Start the typing animation after "Generating..." finishes
      }
    };

    const startTyping = () => {
      const typeCharacter = () => {
        if (index <= description.length) {
          setDisplayedText(description.slice(0, index)); // Use slicing for typing effect
          index++;
          typingTimeoutRef.current = setTimeout(typeCharacter, 50); // Adjust typing speed
        }else {
          setIsGenerating(false);
        }
      };
      typeCharacter(); // Start typing
    };

    showLoading(); // Start the loading animation
  };

  const openPublishModal = () => setIsModalOpen(true);
  const closePublishModal = () => {
    setIsModalOpen(false);
    setIncludeAutoLabeling(false);
    setIncludeAdditionalComments(false);
    setValidationMessage(null);
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
  
    // Initialize vertical position for content
    let currentY = 40; // Starting Y-coordinate for content placement
  
    // Title Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('2D Viewer Report', 105, 15, { align: 'center' });
  
    // Sub-header with Date and Divider
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Date: ${currentDate}`, 10, currentY);
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(10, currentY + 5, 200, currentY + 5);
    currentY += 15; // Adjust for the next section
  
    // Section: Project Information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60);
    doc.text("Project Information:", 10, currentY);
    currentY += 10;
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Project Name:", 10, currentY);
    doc.setFont("helvetica", "italic");
    doc.text("A6_stern", 50, currentY);
    currentY += 10;
  
    doc.setFont("helvetica", "normal");
    doc.text("Generated By:", 10, currentY);
    doc.setFont("helvetica", "italic");
    doc.text("John Doe", 50, currentY);
    currentY += 10;
  
    const roomDescription = fileName.match(/\d+/) ? `Room ${fileName.match(/\d+/)[0]}` : "Room 1";
    const projectZoneDescription = `This report is generated based on ${fileName} of ${roomDescription} taken on ${formattedDate.replace(/-/g, '/')}.`;
    doc.setFont("helvetica", "normal");
    doc.text("Project Zone:", 10, currentY);
    doc.setFont("helvetica", "italic");
    doc.text(projectZoneDescription, 50, currentY, { maxWidth: 140 });
    currentY += 20;
  
    // Section: Automatic Labeling
    if (includeAutoLabeling) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(60);
      doc.text('State of the construction:', 10, currentY);
      currentY += 10;
  
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
  
      // Use content from the text area
      const autoLabelingTextLines = doc.splitTextToSize(
        autoLabelingText || "No automatic labeling information provided.", 
        180
      );
      doc.text(autoLabelingTextLines, 10, currentY);
      currentY += autoLabelingTextLines.length * 6 + 10;
    }
  
    // Section: Additional Comments
    if (includeAdditionalComments) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(60);
      doc.text('Detailed Comments:', 10, currentY);
      currentY += 10;
  
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
  
      const additionalCommentsLines = doc.splitTextToSize(
        additionalCommentsText || "No detailed comments provided.", 
        180
      );
      doc.text(additionalCommentsLines, 10, currentY);
      currentY += additionalCommentsLines.length * 6 + 10;
    }
  
    // Section: Report Flags
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60);
    doc.text('Report Flags:', 10, currentY);
    currentY += 10;
  
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
  
    let flagsText = "The project ";
    if (delayed) flagsText += "is marked as delayed. ";
    if (qualityIssue && safetyIssue) {
      flagsText += "Quality and Safety Issues observed.";
    } else if (qualityIssue) {
      flagsText += "Quality Issue observed.";
    } else if (safetyIssue) {
      flagsText += "Safety Issue observed.";
    } else {
      flagsText += "has no issues marked.";
    }
  
    const flagsTextLines = doc.splitTextToSize(flagsText, 180);
    doc.text(flagsTextLines, 10, currentY);
    currentY += flagsTextLines.length * 6;
  
    // Save the PDF
    doc.save('2DViewer_Report.pdf');
  };
  
  const handleModalPublish = () => {
    if (!includeAutoLabeling && !includeAdditionalComments) {
      setValidationMessage('Please select at least one option to include in the report.');
    } else {
      generatePDFReport();
      closePublishModal();
    }
  };

  return (
    <div className="w-full max-w-screen-3xl bg-white rounded-md shadow-default dark:bg-boxdark dark:text-white p-4 mx-auto mt-6">
      <div className="flex justify-between items-center border-b border-gray-300 dark:border-strokedark pb-4">
        <div>
          <h1 className="text-xl font-bold text-black dark:text-white">Static Viewer</h1>
          <p className="text-sm text-black dark:text-gray-400 mt-1">
            Viewing: <span className="font-semibold">{fileName}</span>
            <div className="flex justify-center space-x-1 mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">{roomNumber},</p>
              <span className="text-gray-400"> (Date: {formattedDate})</span>
            </div>
            
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/interactiveViewer', { state: { imageUrl } })}
            className="bg-primary text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-transform duration-300 hover:bg-opacity-60"
          >
            Open in 360 Viewer
          </button>
          <button
            onClick={() => navigate('/A6_stern')}
            className="bg-primary text-white font-semibold py-2 px-3 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center"
          >
            <svg fill="#ffffff" height="24px" width="24px" viewBox="0 0 288.312 288.312" xmlns="http://www.w3.org/2000/svg">
              <path d="M127.353,3.555c-4.704-4.74-12.319-4.74-17.011,0L15.314,99.653c-4.74,4.788-4.547,12.884,0.313,17.48l94.715,95.785c4.704,4.74,12.319,4.74,17.011,0c4.704-4.74,4.704-12.427,0-17.167l-74.444-75.274h199.474v155.804c0,6.641,5.39,12.03,12.03,12.03c6.641,0,12.03-5.39,12.03-12.03V108.231c0-6.641-5.39-12.03-12.03-12.03H52.704l74.648-75.49C132.056,15.982,132.056,8.295,127.353,3.555z" />
            </svg>
          </button>
        </div>
      </div>

      {/* HD Image Display */}
      <div className="relative w-full h-[70vh] mt-4 bg-gray-700 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
        <img src={imageUrl} alt={fileName} className="object-contain w-full h-full rounded-lg" />
      </div>

      {/* Input fields under the viewer */}
      <div className="flex w-full space-x-4 mt-7">
        
        {/* Automatic Labeling Section */}
        <div className="flex-1 p-4 border border-gray-300 dark:border-strokedark rounded-lg bg-gray-50 dark:bg-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Automatic Labeling
          </label>
          <textarea
              rows={10}
              placeholder="Automatic description..."
              className={`w-full px-4 py-2 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-primary focus:border-primary${
                displayedText.includes('Generating')
                  ? 'italic text-gray-500' // Apply styles for 'Generating'
                  : ''}`}
              value={displayedText}
              readOnly // Prevent edits during the animation
          />
          {/* Generate Button */}
          <button
            onClick={handleGenerateAutomaticLabeling}
            disabled={isGenerating} // Disable button when generating
            className={`mt-2 py-2 px-4 rounded-lg shadow-md transition-transform duration-300 ${
              isGenerating
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' // Disabled styles
                : 'bg-indigo-600 text-white hover:bg-indigo-700' // Active styles
            }`}
          >
            Generate
          </button>
        </div>

        {/* Additional Comments Section */}
        <div className="flex-1 p-4 border border-gray-300 dark:border-strokedark rounded-lg bg-gray-50 dark:bg-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Comments
          </label>
          <textarea
            rows={10}
            placeholder="Enter comments"
            className="w-full px-4 py-2 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-primary focus:border-primary"
            value={additionalCommentsText}
            onChange={(e) => setAdditionalCommentsText(e.target.value)}
          />

          {/* Report Flags (Safety, Quality, Delayed) */}
          <div className="mt-4 ml-1">
            {/* <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Flags</p> */}
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  checked={safetyIssue}
                  onChange={() => setSafetyIssue(!safetyIssue)}
                />
                <span className="text-gray-700 dark:text-gray-300">Safety Issue</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  checked={qualityIssue}
                  onChange={() => setQualityIssue(!qualityIssue)}
                />
                <span className="text-gray-700 dark:text-gray-300">Quality Issue</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  checked={delayed}
                  onChange={() => setDelayed(!delayed)}
                />
                <span className="text-gray-700 dark:text-gray-300">Delayed</span>
              </label>
            </div>
          </div>
        </div>


      </div>
      {/* Publish Button for the Entire Form */}
      <div className="flex justify-end mr-5 -mt-15 mb-3 gap-3">
        <button
          // onClick={() => openPublishModal()}
          disabled={isGenerating} 
          className={` font-semibold py-3 px-6 rounded-lg shadow-md transition-transform duration-300 ${
            isGenerating
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' // Disabled styles
              : 'bg-indigo-600 text-white hover:bg-indigo-700' // Active styles
          }`}
        >
          Save
        </button>
        <button
          // onClick={() => openPublishModal()}
          disabled={isGenerating} 
          className={` font-semibold py-3 px-6 rounded-lg shadow-md transition-transform duration-300 ${
            isGenerating
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' // Disabled styles
              : 'bg-indigo-600 text-white hover:bg-indigo-700' // Active styles
          }`}
        >
          Generate Report
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
                  checked={includeAutoLabeling}
                  onChange={() => setIncludeAutoLabeling(!includeAutoLabeling)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="text-gray-700 dark:text-gray-300">Include Automatic Labeling</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={includeAdditionalComments}
                  onChange={() => setIncludeAdditionalComments(!includeAdditionalComments)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="text-gray-700 dark:text-gray-300">Include Additional Comments</span>
              </label>
            </div>

            {validationMessage && <p className="text-red-600 text-sm mb-4">{validationMessage}</p>}

            <div className="flex justify-end space-x-3">
              <button
                onClick={closePublishModal}
                className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleModalPublish}
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700"
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

export default StaticViewer;
