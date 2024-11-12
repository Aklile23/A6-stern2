// InteractiveViewer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TextureLoader, BackSide, WebGLRenderer, Scene, Camera } from 'three';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const PanoramicSphere: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const { gl } = useThree();
  const texture = useLoader(TextureLoader, imageUrl);

  useEffect(() => {
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
  }, [texture, gl]);

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={BackSide} />
    </mesh>
  );
};

// Helper component for setting WebGL references
const ScreenshotHelper: React.FC<{ setRefs: (gl: WebGLRenderer, scene: Scene, camera: Camera) => void }> = ({ setRefs }) => {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    setRefs(gl, scene, camera);
  }, [gl, scene, camera, setRefs]);

  return null;
};

const InteractiveViewerRoom: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const imageUrl = location.state?.imageUrl || "/Images/panoramas/20241007/room02.jpg";
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const room = location.state?.room || 'defaultRoom';

  const [gl, setGl] = useState<WebGLRenderer | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);

  const fileName = imageUrl.split('/').pop();
  const folderName = imageUrl.split('/')[3];
  const formattedDate = `${folderName.slice(0, 4)}-${folderName.slice(4, 6)}-${folderName.slice(6, 8)}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(false);
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const [notes, setNotes] = useState('');

  const [capturedScreenshot, setCapturedScreenshot] = useState<string | null>(null);
  const [capturedScreenshots, setCapturedScreenshots] = useState<string[]>([]);


  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const takeScreenshot = () => {
    if (gl && scene && camera) {
      gl.render(scene, camera);
      const dataUrl = gl.domElement.toDataURL("image/png");
      setCapturedScreenshots((prevScreenshots) => [...prevScreenshots, dataUrl]); // Append new screenshot
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "screenshot.png";
      link.click();
    }
  };

  const openPublishModal = () => setIsModalOpen(true);
  const closePublishModal = () => {
    setIsModalOpen(false);
    setIncludeNotes(false);
    setIncludeScreenshot(false);
    setNotes('');
  };

  const handleModalPublish = () => {
    const doc = new jsPDF();
  
    // Set up fonts and colors
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(40);

    // Header
    doc.text('360 Viewer Report', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date: ${currentDate}`, 10, 25);
    
    // Section: Notes
    doc.setDrawColor(200); // Light gray for section lines
    doc.setLineWidth(0.5);
    doc.line(10, 30, 200, 30); // Line under header
    
    doc.setFontSize(12);
    doc.setTextColor(60);
    doc.setFont("helvetica", "normal");
    doc.text('Notes:', 10, 40);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.text(notes || "No notes provided.", 10, 50, { maxWidth: 180 });
  
    if (includeNotes) {
      doc.setFontSize(12);
      doc.text('Notes:', 10, 40);
      doc.setFontSize(11);
      doc.text(notes || "No notes provided.", 10, 50, { maxWidth: 180 });
    }
  
    // Add each screenshot to the PDF
    if (includeScreenshot && capturedScreenshots.length > 0) {
      doc.setFontSize(12);
      doc.text('Screenshots:', 10, 80);
      let yPosition = 90;
  
      capturedScreenshots.forEach((screenshot, index) => {
        if (yPosition > 250) { // Move to new page if needed
          doc.addPage();
          yPosition = 20;
        }
        doc.addImage(screenshot, 'PNG', 10, yPosition, 180, 90);
        yPosition += 100; // Adjust spacing between screenshots
      });
    }
  
    // Save the PDF
    doc.save('360_Report.pdf');
  
    // Clear the screenshots array after publishing
    setCapturedScreenshots([]);
    closePublishModal();
  };
  
  

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="w-full max-w-screen-3xl bg-white rounded-md shadow-default dark:bg-boxdark dark:text-white p-4 mx-auto mt-6">
      <div className="flex justify-between items-center border-b border-gray-300 dark:border-strokedark pb-4">
        <div>
          <h1 className="text-xl font-bold text-black dark:text-white">360 Viewer</h1>
          <p className="text-sm text-black dark:text-gray-400 mt-1">
            Viewing: <span className="font-semibold">{fileName}</span> 
            <span className="text-gray-400"> (Date: {formattedDate})</span>
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/staticViewer', { state: { imageUrl } })}
            className="bg-primary text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-transform duration-300 hover:bg-opacity-60"
          >
            Open in 2D Viewer
          </button>
          <button
            onClick={() => navigate('/RoomExplorer', { state: { room } })}
            className="bg-primary text-white font-semibold py-2 px-3 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 flex items-center justify-center"
          >
            <svg fill="#ffffff" height="24px" width="24px" viewBox="0 0 288.312 288.312" xmlns="http://www.w3.org/2000/svg">
            <path d="M127.353,3.555c-4.704-4.74-12.319-4.74-17.011,0L15.314,99.653 
                    c-4.74,4.788-4.547,12.884,0.313,17.48l94.715,95.785c4.704,4.74,12.319,4.74,17.011,0
                    c4.704-4.74,4.704-12.427,0-17.167l-74.444-75.274h199.474v155.804
                    c0,6.641,5.39,12.03,12.03,12.03c6.641,0,12.03-5.39,12.03-12.03V108.231
                    c0-6.641-5.39-12.03-12.03-12.03H52.704l74.648-75.49
                    C132.056,15.982,132.056,8.295,127.353,3.555z" />
          </svg>
          </button>
        </div>
      </div>

      <div ref={viewerRef} className="relative flex w-full h-[70vh] mt-4 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
        <div className="flex-grow">
          <Canvas camera={{ fov: 70, position: [0, 0, 20] }}>
            <ScreenshotHelper setRefs={(gl, scene, camera) => {
              setGl(gl);
              setScene(scene);
              setCamera(camera);
            }} />
            <PanoramicSphere imageUrl={imageUrl} />
            <OrbitControls enablePan={true} enableZoom={false} dampingFactor={0.3} enableDamping={true} />
          </Canvas>

          <button
            onClick={toggleFullscreen}
            className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
          >
            {isFullscreen ? (
              <svg fill="#ffffff" height="24px" width="24px" viewBox="0 0 385.331 385.331" xmlns="http://www.w3.org/2000/svg">
                <path d="M264.943,156.665h108.273c6.833,0,11.934-5.39,11.934-12.211c0-6.833-5.101-11.85-11.934-11.838h-96.242V36.181
                        c0-6.833-5.197-12.03-12.03-12.03s-12.03,5.197-12.03,12.03v108.273c0,0.036,0.012,0.06,0.012,0.084
                        c0,0.036-0.012,0.06-0.012,0.096C252.913,151.347,258.23,156.677,264.943,156.665z"></path>
                <path d="M120.291,24.247c-6.821,0-11.838,5.113-11.838,11.934v96.242H12.03c-6.833,0-12.03,5.197-12.03,12.03
                        c0,6.833,5.197,12.03,12.03,12.03h108.273c0.036,0,0.06-0.012,0.084-0.012c0.036,0,0.06,0.012,0.096,0.012
                        c6.713,0,12.03-5.317,12.03-12.03V36.181C132.514,29.36,127.124,24.259,120.291,24.247z"></path>
                <path d="M120.387,228.666H12.115c-6.833,0.012-11.934,5.39-11.934,12.223c0,6.833,5.101,11.85,11.934,11.838h96.242v96.423
                        c0,6.833,5.197,12.03,12.03,12.03c6.833,0,12.03-5.197,12.03-12.03V240.877c0-0.036-0.012-0.06-0.012-0.084
                        c0-0.036,0.012-0.06,0.012-0.096C132.418,233.983,127.1,228.666,120.387,228.666z"></path>
                <path d="M373.3,228.666H265.028c-0.036,0-0.06,0.012-0.084,0.012c-0.036,0-0.06-0.012-0.096-0.012
                        c-6.713,0-12.03,5.317-12.03,12.03v108.273c0,6.833,5.39,11.922,12.223,11.934c6.821,0.012,11.838-5.101,11.838-11.922v-96.242
                        H373.3c6.833,0,12.03-5.197,12.03-12.03S380.134,228.678,373.3,228.666z"></path>
              </svg>
            ) : (
              // Icon for entering fullscreen (unchanged)
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M4 4h5V2H2v7h2V4zm15 0h-5V2h7v7h-2V4zM4 20h5v2H2v-7h2v5zm15-5h2v7h-7v-2h5v-5z" />
              </svg>
            )}
          </button>
        </div>

        {/* Vertical Icon Buttons */}
        <div className="flex flex-col space-y-4 p-2 right-3 top-40 transform -translate-y-1/2 absolute bg-white dark:bg-gray-700 rounded-lg shadow-lg">
          <button className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-opacity-80 transition">
            <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="24px" height="24px">
              <path d="M4,12L4,13L12,13L12,12L13,12L13,4L12,4L12,3L4,3L4,4L3,4L3,12L4,12ZM7,7L9,7L9,9L7,9L7,7ZM16,12L16,16L12,16L12,15L4,15L4,16L0,16L0,12L1,12L1,4L0,4L0,0L4,0L4,1L12,1L12,0L16,0L16,4L15,4L15,12L16,12Z"></path>
            </svg>
          </button>

          {/* Length Measure Icon */}
          <button className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-opacity-80 transition">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#ffffff" width="24px" height="24px">
              <path d="M62.839,17.992L46.021,1.174c-1.551-1.549-4.058-1.549-5.606,0L1.173,40.414 c-1.547,1.551-1.547,4.057,0,5.607L17.99,62.838c1.55,1.549,4.059,1.549,5.608,0l39.24-39.24 C64.387,22.049,64.387,19.541,62.839,17.992z M61.437,22.196l-39.24,39.241c-0.774,0.774-2.029,0.774-2.804,0L2.575,44.619 c-0.774-0.773-0.774-2.03-0.001-2.804l2.104-2.101l2.803,2.802c0.387,0.389,1.014,0.389,1.402,0 c0.387-0.386,0.387-1.013-0.001-1.399l-2.803-2.805l2.803-2.803l5.605,5.607c0.389,0.387,1.015,0.387,1.401,0 c0.388-0.389,0.388-1.016,0-1.402l-5.604-5.605l2.802-2.804l2.803,2.804c0.388,0.386,1.015,0.386,1.402,0 c0.386-0.389,0.386-1.014,0-1.402l-2.804-2.803l2.804-2.803l5.605,5.605c0.387,0.388,1.014,0.388,1.401,0 c0.388-0.388,0.388-1.015,0-1.401l-5.605-5.605l2.801-2.805l2.805,2.804c0.388,0.387,1.015,0.387,1.4,0.001 c0.389-0.389,0.389-1.016,0-1.402l-2.803-2.803l2.803-2.803l5.605,5.604c0.388,0.387,1.015,0.387,1.401,0 c0.388-0.388,0.388-1.015,0-1.401l-5.606-5.606l2.804-2.802l2.803,2.802 c0.388,0.388,1.015,0.388,1.401,0c0.388-0.388,0.388-1.015,0-1.401l-2.803-2.802l2.102-2.104 c0.774-0.772,2.03-0.772,2.804,0l16.817,16.817C62.211,20.167,62.211,21.423,61.437,22.196z"></path>
              <path d="M51.007,17.006c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4S53.216,17.006,51.007,17.006z M51.007,23.006 c-1.104,0-2-0.896-2-2s0.896-2,2-2s2,0.896,2,2S52.111,23.006,51.007,23.006z"></path>
            </svg>
          </button>

          {/* Angle Measure Icon */}
          <button className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-opacity-80 transition">
            <svg fill="#ffffff" viewBox="0 0 111.353 111.353" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
              <path d="M97,85.508c-2.75,0-4.988,2.239-4.988,4.989v4.007c-0.04,0-0.118,0-0.157,0l0,0l-44.231-0.078 c0.118-0.236,0.196-0.433,0.314-0.668c0.354-0.903-0.079-1.965-0.982-2.318c-0.903-0.353-1.964,0.079-2.318,0.982 c-0.275,0.668-0.589,1.336-0.982,2.004h-18.58l14.377-17.167c0.707,0.511,1.571,1.257,2.475,2.2 c0.354,0.393,0.825,0.55,1.296,0.55c0.432,0,0.864-0.157,1.218-0.472c0.707-0.667,0.747-1.808,0.079-2.515 c-0.982-1.061-1.964-1.886-2.789-2.514l49.731-56.645l2.004,2.003c0.98,0.981,2.239,1.454,3.496,1.454s2.553-0.472,3.496-1.454 c1.925-1.926,1.925-5.106,0-7.031L89.066,1.444c-1.925-1.925-5.106-1.925-7.031,0c-1.926,1.926-1.926,5.106,0,7.031l2.356,2.317 L10.541,96.074c-1.257,1.491-1.532,3.573-0.707,5.343c0.825,1.728,2.593,2.944,4.518,2.944l0,0l77.503-0.116 c0.039,0,0.078,0,0.157,0v2.121c0,2.75,2.238,4.987,4.988,4.987s4.989-2.237,4.989-4.987V90.457 C101.95,87.748,99.75,85.508,97,85.508z"></path>
            </svg>
          </button>

          {/* Marking Icon */}
          <button className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-opacity-80 transition">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="24px" height="24px">
              <path d="M208.125,399.449c0,0,9.656-15.703,21.266-34.563L75.469,270.152c-11.609,18.859-21.281,34.563-21.281,34.563 s27.797,60.406-9.906,121.656l29.844,18.375l29.844,18.375C141.656,401.855,208.125,399.449,208.125,399.449z"></path>
              <path d="M389.531,104.684c6.031-9.828,2.984-22.719-6.859-28.781L264.359,3.105 c-9.828-6.047-22.703-2.984-28.766,6.844L83.188,257.59l153.938,94.719L389.531,104.684z"></path>
              <polygon points="22.531,488.637 74.188,488.637 87.484,467.043 48.219,442.871 "></polygon>
              <path d="M482.406,484.449H117.844c-3.906,0-7.063,3.156-7.063,7.063v13.438c0,3.891,3.156,7.047,7.063,7.047h364.563 c3.906,0,7.063-3.156,7.063-7.047v-13.438C489.469,487.605,486.313,484.449,482.406,484.449z"></path>
            </svg>
        </button>
          {/* Screenshot Button */}
          <button onClick={takeScreenshot} className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-opacity-80 transition">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> 
            <path fill="none" d="M0 0h24v24H0z"></path> 
            <path d="M3 3h2v2H3V3zm4 0h2v2H7V3zm4 0h2v2h-2V3zm4 0h2v2h-2V3zm4 0h2v2h-2V3zm0 4h2v2h-2V7zM3 19h2v2H3v-2zm0-4h2v2H3v-2zm0-4h2v2H3v-2zm0-4h2v2H3V7zm7.667 4l1.036-1.555A1 1 0 0 1 12.535 9h2.93a1 1 0 0 1 .832.445L17.333 11H20a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2.667zM9 19h10v-6h-2.737l-1.333-2h-1.86l-1.333 2H9v6zm5-1a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path> </g> </g></svg>
          </button>
          {/* Other buttons */}
        </div>
      </div>

      <div className="flex w-full mt-6 space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
          <textarea
            rows={5}
            placeholder="Enter comments"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="flex flex-col space-y-4 mt-7">
          <button
            onClick={openPublishModal}
            className="bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform duration-300 hover:bg-opacity-60 self-start"
          >
            Publish
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">Publish Report</h2>
            
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeScreenshot}
                  onChange={() => setIncludeScreenshot(!includeScreenshot)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="text-gray-700 dark:text-gray-300">Include Screenshot</span>
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

            <div className="flex justify-end space-x-3 mt-4">
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

export default InteractiveViewerRoom;
