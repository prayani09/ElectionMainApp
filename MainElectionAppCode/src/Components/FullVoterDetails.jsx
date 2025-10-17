import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, ref, get } from '../Firebase/config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Icons
import {
  FiArrowLeft,
  FiShare2,
  FiDownload,
  FiFileText,
  FiPrinter,
  FiImage,
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiUser,
  FiMapPin,
  FiHash,
  FiCalendar,
} from 'react-icons/fi';
import { FaWhatsapp, FaRegFilePdf } from 'react-icons/fa';
import TranslatedText from './TranslatedText';
import { MarsIcon } from 'lucide-react';

const FullVoterDetails = () => {
  const { voterId } = useParams();
  const navigate = useNavigate();
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

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
    const message = `🗳️ *Voter Details*\n\n👤 *Name:* ${voter.name}\n🆔 *Voter ID:* ${voter.voterId}\n🏛️ *Booth:* ${voter.boothNumber}\n📍 *Address:* ${voter.pollingStationAddress}${voter.age ? `\n🎂 *Age:* ${voter.age}` : ''}${voter.gender ? `\n⚧️ *Gender:* ${voter.gender}` : ''}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareViaSMS = () => {
    const message = `Voter Details:\nName: ${voter.name}\nVoter ID: ${voter.voterId}\nBooth: ${voter.boothNumber}\nAddress: ${voter.pollingStationAddress}${voter.age ? `\nAge: ${voter.age}` : ''}${voter.gender ? `\nGender: ${voter.gender}` : ''}`;
    const url = `sms:?body=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `Voter Details - ${voter.name}`;
    const body = `Voter Details:\n\nName: ${voter.name}\nVoter ID: ${voter.voterId}\nBooth Number: ${voter.boothNumber}\nPolling Station Address: ${voter.pollingStationAddress}${voter.age ? `\nAge: ${voter.age}` : ''}${voter.gender ? `\nGender: ${voter.gender}` : ''}${voter.serialNumber ? `\nSerial Number: ${voter.serialNumber}` : ''}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  };

  const downloadAsImage = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('voter-details-card');
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });
      const image = canvas.toDataURL('image/png', 1.0);
      
      const link = document.createElement('a');
      link.download = `voter-${voter.voterId}-${Date.now()}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('voter-details-card');
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`voter-${voter.voterId}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const printVoterDetails = async () => {
    try {
      const element = document.getElementById('voter-details-card');
      if (!element) return;

      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'noopener,noreferrer');
      if (!printWindow) {
        alert('Popup blocked - please allow popups to print');
        return;
      }

      // Basic styles for print view - include simple layout to ensure readable output
      const styles = `
        <style>
          body { font-family: Arial, Helvetica, sans-serif; margin: 20px; color: #111827; }
          .card { border-radius: 12px; padding: 16px; border: 1px solid #e5e7eb; }
          h1 { font-size: 20px; margin-bottom: 8px; }
          .row { display:flex; justify-content:space-between; margin-bottom:8px; }
          .label { font-weight:600; color:#374151; width:40%; }
          .value { color:#111827; width:58%; }
        </style>
      `;

      // Build printable HTML by cloning key fields to avoid relying on Tailwind in new window
      const html = `
        <html>
          <head>
            <title>Voter Details - ${voter.name || voter.voterId || ''}</title>
            ${styles}
          </head>
          <body>
            <div class="card">
              <h1>Voter Details</h1>
              <div class="row"><div class="label">Serial Number:</div><div class="value">${voter.serialNumber || ''}</div></div>
              <div class="row"><div class="label">Full Name:</div><div class="value">${voter.name || ''}</div></div>
              <div class="row"><div class="label">Voter ID:</div><div class="value">${voter.voterId || ''}</div></div>
              <div class="row"><div class="label">Booth Number:</div><div class="value">${voter.boothNumber || ''}</div></div>
              <div class="row"><div class="label">Polling Station:</div><div class="value">${(voter.pollingStationAddress || '').replace(/\n/g, ' ')}</div></div>
              <div class="row"><div class="label">Age:</div><div class="value">${voter.age || ''}</div></div>
              <div class="row"><div class="label">Gender:</div><div class="value">${voter.gender || ''}</div></div>
              <div style="margin-top:16px; font-size:12px; color:#6b7280;">Printed from VoterData Pro — ${new Date().toLocaleString()}</div>
            </div>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      // Give the window a moment to render
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Do not automatically close - some platforms (and Bluetooth printers) need dialog interaction
        // printWindow.close();
      }, 300);
    } catch (err) {
      console.error('Error printing voter details:', err);
      alert('Failed to print. See console for details.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-orange-600 rounded-full absolute top-0 left-0 animate-spin"></div>
          </div>
          <div className="text-orange-600 text-lg font-semibold mt-4">
            <TranslatedText>Loading voter details...</TranslatedText>
          </div>
        </div>
      </div>
    );
  }

  if (!voter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/40">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            <TranslatedText>Voter Not Found</TranslatedText>
          </h2>
          <p className="text-gray-600 mb-6">
            <TranslatedText>The requested voter details could not be found.</TranslatedText>
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300"
          >
            <TranslatedText>Back to Dashboard</TranslatedText>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 bg-white/90 backdrop-blur-xl text-orange-600 hover:text-orange-700 font-semibold px-6 py-4 rounded-2xl shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <FiArrowLeft className="text-lg" />
            <TranslatedText>Back to Dashboard</TranslatedText>
          </button>
        </div>

        {/* Voter Details Card */}
        <div id="voter-details-card" className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 mb-8">
          {/* Card Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
              <FiUser className="text-xl" />
              <h1 className="text-2xl font-bold">
                <TranslatedText>Voter Details</TranslatedText>
              </h1>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto"></div>
          </div>

          {/* Voter Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <DetailItem 
                icon={FiHash}
                label="Serial Number" 
                value={voter.serialNumber || 'N/A'}
                color="from-purple-500 to-purple-600"
              />
              <DetailItem 
                icon={FiUser}
                label="Full Name" 
                value={voter.name}
                color="from-orange-500 to-amber-500"
              />
              <DetailItem 
                icon={FiFileText}
                label="Voter ID" 
                value={voter.voterId}
                color="from-blue-500 to-blue-600"
              />
              {voter.age && (
                <DetailItem 
                  icon={FiCalendar}
                  label="Age" 
                  value={voter.age}
                  color="from-green-500 to-green-600"
                />
              )}
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <DetailItem 
                icon={FiMapPin}
                label="Booth Number" 
                value={voter.boothNumber}
                color="from-red-500 to-red-600"
              />
              <DetailItem 
                icon={FiMapPin}
                label="Polling Station Address" 
                value={voter.pollingStationAddress}
                fullWidth
                color="from-indigo-500 to-indigo-600"
              />
              {voter.gender && (
                <DetailItem 
                  icon={MarsIcon}
                  label="Gender" 
                  value={voter.gender}
                  color="from-pink-500 to-pink-600"
                />
              )}
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <FiShare2 />
              <TranslatedText>Quick Actions</TranslatedText>
            </h3>
            <p className="text-sm text-orange-700/80">
              <TranslatedText>Share this voter's details with your team or download for offline reference.</TranslatedText>
            </p>
          </div>
        </div>

        {/* Share & Download Options */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/40">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            <TranslatedText>Share & Export</TranslatedText>
          </h2>
          <p className="text-gray-600 text-center mb-8">
            <TranslatedText>Choose how you want to share or save this voter's information</TranslatedText>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton
              icon={FaWhatsapp}
              label="WhatsApp"
              color="from-green-500 to-green-600"
              onClick={shareOnWhatsApp}
              disabled={downloading}
            />
            
            <ActionButton
              icon={FiMessageCircle}
              label="Text SMS"
              color="from-blue-500 to-blue-600"
              onClick={shareViaSMS}
              disabled={downloading}
            />
            
            <ActionButton
              icon={FiMail}
              label="Email"
              color="from-purple-500 to-purple-600"
              onClick={shareViaEmail}
              disabled={downloading}
            />
            
            <ActionButton
              icon={FiImage}
              label="Download Image"
              color="from-indigo-500 to-indigo-600"
              onClick={downloadAsImage}
              disabled={downloading}
            />
            
            <ActionButton
              icon={FiPrinter}
              label="Print"
              color="from-emerald-500 to-emerald-600"
              onClick={printVoterDetails}
              disabled={downloading}
            />
            
            <ActionButton
              icon={FaRegFilePdf}
              label="Download PDF"
              color="from-red-500 to-red-600"
              onClick={downloadAsPDF}
              disabled={downloading}
            />
          </div>

          {downloading && (
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-3 bg-orange-100 text-orange-700 px-4 py-2 rounded-xl">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                <span className="text-sm font-medium">
                  <TranslatedText>Preparing download...</TranslatedText>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value, fullWidth = false, color = "from-gray-500 to-gray-600" }) => (
  <div className={fullWidth ? 'lg:col-span-2' : ''}>
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-xl bg-gradient-to-r ${color} text-white shadow-lg`}>
        <Icon className="text-sm" />
      </div>
      <div className="text-sm font-semibold text-gray-700">
        <TranslatedText>{label}</TranslatedText>
      </div>
    </div>
    <div className="text-lg text-gray-800 bg-gray-50/80 px-4 py-4 rounded-2xl border border-gray-200/80 font-medium">
      {value}
    </div>
  </div>
);

const ActionButton = ({ icon: Icon, label, color, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-gradient-to-r ${color} text-white py-4 px-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl active:scale-95 flex flex-col items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    <Icon className="text-2xl" />
    <span className="text-sm">
      <TranslatedText>{label}</TranslatedText>
    </span>
  </button>
);

export default FullVoterDetails;