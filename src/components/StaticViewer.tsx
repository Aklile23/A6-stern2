// StaticViewer.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const StaticViewer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const imageUrl = location.state?.imageUrl || "/Images/panoramas/20241007/room02.jpg";

  const fileName = imageUrl.split('/').pop();
  const folderName = imageUrl.split('/')[3];
  const formattedDate = `${folderName.slice(0, 4)}-${folderName.slice(4, 6)}-${folderName.slice(6, 8)}`;

  // State for modal, checkboxes, and text fields
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [includeAutoLabeling, setIncludeAutoLabeling] = useState(false);
  const [includeAdditionalComments, setIncludeAdditionalComments] = useState(false);
  const [autoLabelingText, setAutoLabelingText] = useState('');
  const [additionalCommentsText, setAdditionalCommentsText] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

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
  
    // Header with title and date
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text('2D Viewer Report', 105, 15, { align: 'center' });
  
    // Date and section underline
    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(`Date: ${currentDate}`, 10, 25);
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(10, 30, 200, 30); // Underline
  
    // Section: Automatic Labeling
    if (includeAutoLabeling) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(60);
      doc.text('Automatic Labeling:', 10, 40);
  
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.text(autoLabelingText || "No automatic labeling information provided.", 10, 50, { maxWidth: 180 });
    }
  
    // Section: Additional Comments
    if (includeAdditionalComments) {
      const commentsStartY = includeAutoLabeling ? 80 : 60;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(60);
      doc.text('Additional Comments:', 10, commentsStartY);
  
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.text(additionalCommentsText || "No additional comments provided.", 10, commentsStartY + 10, { maxWidth: 180 });
    }
  
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

  const handleGenerateAutomaticLabeling = () => {
    setAutoLabelingText("Generated labeling text goes here..."); // Replace with actual logic as needed
  };

  return (
    <div className="w-full max-w-screen-3xl bg-white rounded-md shadow-default dark:bg-boxdark dark:text-white p-4 mx-auto mt-6">
      <div className="flex justify-between items-center border-b border-gray-300 dark:border-strokedark pb-4">
        <div>
          <h1 className="text-xl font-bold text-black dark:text-white">Static Viewer</h1>
          <p className="text-sm text-black dark:text-gray-400 mt-1">
            Viewing: <span className="font-semibold">{fileName}</span>
            <span className="text-gray-400"> (Date: {formattedDate})</span>
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
            rows={5}
            placeholder="Enter comments"
            className="w-full px-4 py-2 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-primary focus:border-primary"
            value={autoLabelingText}
            onChange={(e) => setAutoLabelingText(e.target.value)}
          />
          {/* Generate Button */}
          <button
            onClick={handleGenerateAutomaticLabeling}
            className="mt-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform duration-300 hover:bg-indigo-700"
          >
            Generate
          </button>
        </div>

        {/* Additional Comments Section */}
        <div className="flex-1 p-4 rounded-md ">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Comments
          </label>
          <textarea
            rows={5}
            placeholder="Enter comments"
            className="w-full px-4 py-2 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-primary focus:border-primary"
            value={additionalCommentsText}
            onChange={(e) => setAdditionalCommentsText(e.target.value)}
          />
        </div>
      </div>
      {/* Publish Button for the Entire Form */}
      <div className="flex justify-end mr-5 -mt-13 mb-3">
        <button
          onClick={() => openPublishModal()}
          className="bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform duration-300 hover:bg-opacity-60"
        >
          Publish
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
