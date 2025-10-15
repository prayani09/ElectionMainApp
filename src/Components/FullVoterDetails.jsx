// src/components/FullVoterDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, ref, get } from '../Firebase/config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FullVoterDetails = () => {
  const { voterId } = useParams();
  const navigate = useNavigate();
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVoterDetails();
  }, [voterId]);

  const loadVoterDetails = async () => {
    try {
      const voterRef = ref(db, `voters/${voterId}`);
      const snapshot = await get(voterRef);
      
      if (snapshot.exists()) {
        setVoter({ id: voterId, ...snapshot.val() });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading voter details:', error);
      setLoading(false);
    }
  };

  const shareOnWhatsApp = () => {
    const message = `Voter Details:\nName: ${voter.name}\nVoter ID: ${voter.voterId}\nBooth: ${voter.boothNumber}\nAddress: ${voter.pollingStationAddress}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareViaSMS = () => {
    const message = `Voter Details:\nName: ${voter.name}\nVoter ID: ${voter.voterId}\nBooth: ${voter.boothNumber}\nAddress: ${voter.pollingStationAddress}`;
    const url = `sms:?body=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const downloadAsImage = async () => {
    const element = document.getElementById('voter-details-card');
    const canvas = await html2canvas(element);
    const image = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = `voter-${voter.voterId}.png`;
    link.href = image;
    link.click();
  };

  const downloadAsPDF = async () => {
    const element = document.getElementById('voter-details-card');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`voter-${voter.voterId}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-orange-600 text-xl">Loading voter details...</div>
      </div>
    );
  }

  if (!voter) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600 text-xl">Voter not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Back to Dashboard
        </button>

        {/* Voter Details Card */}
        <div id="voter-details-card" className="bg-white rounded-lg shadow-xl border border-orange-200 p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-600 mb-2">Voter Details</h1>
            <div className="w-20 h-1 bg-orange-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <DetailItem label="Serial Number" value={voter.serialNumber} />
              <DetailItem label="Full Name" value={voter.name} />
              <DetailItem label="Voter ID" value={voter.voterId} />
            </div>
            <div className="space-y-4">
              <DetailItem label="Booth Number" value={voter.boothNumber} />
              <DetailItem 
                label="Polling Station Address" 
                value={voter.pollingStationAddress} 
                fullWidth 
              />
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <h2 className="text-xl font-semibold text-orange-700 mb-4">Share Voter Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={shareOnWhatsApp}
              className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              WhatsApp
            </button>
            
            <button
              onClick={shareViaSMS}
              className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Text SMS
            </button>
            
            <button
              onClick={downloadAsImage}
              className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Download Image
            </button>
            
            <button
              onClick={downloadAsPDF}
              className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? 'md:col-span-2' : ''}>
    <div className="text-sm font-medium text-orange-700 mb-1">{label}</div>
    <div className="text-lg text-gray-800 bg-orange-50 px-4 py-3 rounded-lg border border-orange-200">
      {value}
    </div>
  </div>
);

export default FullVoterDetails;