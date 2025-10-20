import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, ref, get, update } from '../Firebase/config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  FiEdit2,
  FiSave,
  FiX,
} from 'react-icons/fi';
import { FaWhatsapp, FaRegFilePdf } from 'react-icons/fa';
import TranslatedText from './TranslatedText';

const FullVoterDetails = () => {
  const { voterId } = useParams();
  const navigate = useNavigate();
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [contactNumbers, setContactNumbers] = useState({
    whatsapp: '',
    phone: '',
  });
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [tempWhatsApp, setTempWhatsApp] = useState('');
  const [tempPhone, setTempPhone] = useState('');

  useEffect(() => {
    loadVoterDetails();
  }, [voterId]);

  const loadVoterDetails = async () => {
    setLoading(true);
    try {
      const voterRef = ref(db, `voters/${voterId}`);
      const snapshot = await get(voterRef);
      
      if (snapshot.exists()) {
        const voterData = { id: voterId, ...snapshot.val() };
        setVoter(voterData);
        setContactNumbers({
          whatsapp: voterData.whatsappNumber || '',
          phone: voterData.phoneNumber || '',
        });
      }
    } catch (error) {
      console.error('Error loading voter details:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContactNumbers = async () => {
    try {
      const voterRef = ref(db, `voters/${voterId}`);
      await update(voterRef, {
        whatsappNumber: contactNumbers.whatsapp,
        phoneNumber: contactNumbers.phone,
      });
      setVoter({ ...voter, whatsappNumber: contactNumbers.whatsapp, phoneNumber: contactNumbers.phone });
      setEditMode(false);
      alert('Contact numbers saved successfully!');
    } catch (error) {
      console.error('Error saving contact numbers:', error);
      alert('Failed to save contact numbers. Please try again.');
    }
  };

  const handleWhatsAppShare = () => {
    if (!contactNumbers.whatsapp) {
      setShowWhatsAppModal(true);
      setTempWhatsApp('');
    } else {
      sendWhatsAppMessage(contactNumbers.whatsapp);
    }
  };

  const handleSMSShare = () => {
    if (!contactNumbers.phone) {
      setShowSMSModal(true);
      setTempPhone('');
    } else {
      sendSMSMessage(contactNumbers.phone);
    }
  };

  const confirmWhatsAppNumber = async () => {
    if (tempWhatsApp && tempWhatsApp.length >= 10) {
      try {
        const voterRef = ref(db, `voters/${voterId}`);
        await update(voterRef, { whatsappNumber: tempWhatsApp });
        setContactNumbers({ ...contactNumbers, whatsapp: tempWhatsApp });
        setShowWhatsAppModal(false);
        sendWhatsAppMessage(tempWhatsApp);
      } catch (error) {
        console.error('Error saving WhatsApp number:', error);
        alert('Failed to save WhatsApp number.');
      }
    } else {
      alert('Please enter a valid WhatsApp number (at least 10 digits)');
    }
  };

  const confirmPhoneNumber = async () => {
    if (tempPhone && tempPhone.length >= 10) {
      try {
        const voterRef = ref(db, `voters/${voterId}`);
        await update(voterRef, { phoneNumber: tempPhone });
        setContactNumbers({ ...contactNumbers, phone: tempPhone });
        setShowSMSModal(false);
        sendSMSMessage(tempPhone);
      } catch (error) {
        console.error('Error saving phone number:', error);
        alert('Failed to save phone number.');
      }
    } else {
      alert('Please enter a valid phone number (at least 10 digits)');
    }
  };

  const sendWhatsAppMessage = (number) => {
    const message = `🗳️ *Voter Details*\n\n👤 *Name:* ${voter.name}\n🆔 *Voter ID:* ${voter.voterId}\n🏛️ *Booth:* ${voter.boothNumber}\n📍 *Address:* ${voter.pollingStationAddress}${voter.age ? `\n🎂 *Age:* ${voter.age}` : ''}${voter.gender ? `\n⚧️ *Gender:* ${voter.gender}` : ''}`;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const sendSMSMessage = (number) => {
    const message = `Voter Details:\nName: ${voter.name}\nVoter ID: ${voter.voterId}\nBooth: ${voter.boothNumber}\nAddress: ${voter.pollingStationAddress}${voter.age ? `\nAge: ${voter.age}` : ''}${voter.gender ? `\nGender: ${voter.gender}` : ''}`;
    const url = `sms:${number}?body=${encodeURIComponent(message)}`;
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

      const printWindow = window.open('', '_blank', 'noopener,noreferrer');
      if (!printWindow) {
        alert('Popup blocked - please allow popups to print');
        return;
      }

      const styles = `
        <style>
          @media print {
            @page { margin: 0.5cm; }
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            padding: 20px; 
            color: #1f2937;
            line-height: 1.5;
          }
          .container { max-width: 800px; margin: 0 auto; }
          .header { 
            text-align: center; 
            margin-bottom: 24px; 
            padding-bottom: 16px;
            border-bottom: 2px solid #f97316;
          }
          .header h1 { 
            font-size: 24px; 
            font-weight: 700; 
            color: #1f2937;
            margin-bottom: 4px;
          }
          .header p { 
            font-size: 13px; 
            color: #6b7280;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 16px;
            margin-bottom: 16px;
          }
          .info-item { 
            padding: 12px;
            background: #f9fafb;
            border-radius: 8px;
            border-left: 3px solid #f97316;
          }
          .info-label { 
            font-size: 11px; 
            font-weight: 600; 
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .info-value { 
            font-size: 14px; 
            font-weight: 500;
            color: #1f2937;
          }
          .footer { 
            margin-top: 24px; 
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            font-size: 11px; 
            color: #9ca3af;
            text-align: center;
          }
        </style>
      `;

      const html = `
        <html>
          <head>
            <title>Voter Details - ${voter.name || voter.voterId}</title>
            ${styles}
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Voter Details</h1>
                <p>Official Voter Information Record</p>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Serial Number</div>
                  <div class="info-value">${voter.serialNumber || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Voter ID</div>
                  <div class="info-value">${voter.voterId || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Full Name</div>
                  <div class="info-value">${voter.name || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Age</div>
                  <div class="info-value">${voter.age || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Gender</div>
                  <div class="info-value">${voter.gender || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Booth Number</div>
                  <div class="info-value">${voter.boothNumber || 'N/A'}</div>
                </div>
              </div>
              <div class="info-item" style="grid-column: 1 / -1;">
                <div class="info-label">Polling Station Address</div>
                <div class="info-value">${(voter.pollingStationAddress || 'N/A').replace(/\n/g, ' ')}</div>
              </div>
              <div class="footer">
                Printed on ${new Date().toLocaleString()} | VoterData Pro
              </div>
            </div>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);
    } catch (err) {
      console.error('Error printing voter details:', err);
      alert('Failed to print. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600"><TranslatedText>Loading voter details...</TranslatedText></p>
        </div>
      </div>
    );
  }

  if (!voter) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2"><TranslatedText>Voter Not Found</TranslatedText></h2>
          <p className="text-sm text-gray-600 mb-6"><TranslatedText>The requested voter details could not be found.</TranslatedText></p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            <TranslatedText>Back to Dashboard</TranslatedText>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors text-sm font-medium"
          >
            <FiArrowLeft className="text-lg" />
            <span><TranslatedText>Back</TranslatedText></span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Main Card */}
        <div id="voter-details-card" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FiUser className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white"><TranslatedText>Voter Details</TranslatedText></h1>
                  <p className="text-xs text-orange-100"><TranslatedText>Comprehensive Information</TranslatedText></p>
                </div>
              </div>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <FiEdit2 className="text-sm" />
                  <TranslatedText>Edit Contacts</TranslatedText>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={saveContactNumbers}
                    className="flex items-center gap-1.5 bg-white text-orange-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-orange-50 transition-colors"
                  >
                    <FiSave className="text-sm" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setContactNumbers({
                        whatsapp: voter.whatsappNumber || '',
                        phone: voter.phoneNumber || '',
                      });
                    }}
                    className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    <FiX className="text-sm" />
                    <TranslatedText>Cancel</TranslatedText>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <InfoField label="Serial Number" value={voter.serialNumber || 'N/A'} icon={FiHash} />
              <InfoField label="Voter ID" value={voter.voterId} icon={FiFileText} />
              <InfoField label="Full Name" value={voter.name} icon={FiUser} />
              <InfoField label="Age" value={voter.age || 'N/A'} icon={FiCalendar} />
              <InfoField label="Gender" value={voter.gender || 'N/A'} icon={FiUser} />
              <InfoField label="Booth Number" value={voter.boothNumber} icon={FiMapPin} />
              
              {/* Contact Numbers */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaWhatsapp className="text-gray-500 text-sm" />
                  <span className="text-xs font-medium text-gray-600"><TranslatedText>WhatsApp Number</TranslatedText></span>
                </div>
                {editMode ? (
                  <input
                    type="tel"
                    value={contactNumbers.whatsapp}
                    onChange={(e) => setContactNumbers({ ...contactNumbers, whatsapp: e.target.value })}
                    placeholder="Enter WhatsApp number"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900"> <TranslatedText>{contactNumbers.whatsapp || 'Not provided'}</TranslatedText></p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FiPhone className="text-gray-500 text-sm" />
                  <span className="text-xs font-medium text-gray-600"><TranslatedText>Phone Number</TranslatedText></span>
                </div>
                {editMode ? (
                  <input
                    type="tel"
                    value={contactNumbers.phone}
                    onChange={(e) => setContactNumbers({ ...contactNumbers, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900"> <TranslatedText>{contactNumbers.phone || 'Not provided'}</TranslatedText></p>
                )}
              </div>

              {/* Address - Full Width */}
              <div className="md:col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FiMapPin className="text-gray-500 text-sm" />
                  <span className="text-xs font-medium text-gray-600"><TranslatedText>Polling Station Address</TranslatedText></span>
                </div>
                <p className="text-sm font-medium text-gray-900 leading-relaxed"><TranslatedText>{voter.pollingStationAddress}</TranslatedText></p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4"><TranslatedText>Share & Export Options</TranslatedText></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <ActionBtn
              icon={FaWhatsapp}
              label="WhatsApp"
              onClick={handleWhatsAppShare}
              color="bg-green-500 hover:bg-green-600"
              disabled={downloading}
            />
            <ActionBtn
              icon={FiMessageCircle}
              label="SMS"
              onClick={handleSMSShare}
              color="bg-blue-500 hover:bg-blue-600"
              disabled={downloading}
            />
            <ActionBtn
              icon={FiMail}
              label="Email"
              onClick={shareViaEmail}
              color="bg-purple-500 hover:bg-purple-600"
              disabled={downloading}
            />
            <ActionBtn
              icon={FiPrinter}
              label="Print"
              onClick={printVoterDetails}
              color="bg-gray-700 hover:bg-gray-800"
              disabled={downloading}
            />
            <ActionBtn
              icon={FiImage}
              label="Image"
              onClick={downloadAsImage}
              color="bg-indigo-500 hover:bg-indigo-600"
              disabled={downloading}
            />
            <ActionBtn
              icon={FaRegFilePdf}
              label="PDF"
              onClick={downloadAsPDF}
              color="bg-red-500 hover:bg-red-600"
              disabled={downloading}
            />
          </div>
          {downloading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-orange-600">
              <div className="w-4 h-4 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <span><TranslatedText>Preparing download...</TranslatedText></span>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <Modal
          title="Enter WhatsApp Number"
          onClose={() => setShowWhatsAppModal(false)}
          onConfirm={confirmWhatsAppNumber}
        >
          <input
            type="tel"
            value={tempWhatsApp}
            onChange={(e) => setTempWhatsApp(e.target.value)}
            placeholder="Enter WhatsApp number with country code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2"><TranslatedText>Example: 919876543210 (with country code)</TranslatedText></p>
        </Modal>
      )}

      {/* SMS Modal */}
      {showSMSModal && (
        <Modal
          title="Enter Phone Number"
          onClose={() => setShowSMSModal(false)}
          onConfirm={confirmPhoneNumber}
        >
          <input
            type="tel"
            value={tempPhone}
            onChange={(e) => setTempPhone(e.target.value)}
            placeholder="Enter phone number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2"><TranslatedText>Enter the phone number to send SMS</TranslatedText></p>
        </Modal>
      )}
    </div>
  );
};

const InfoField = ({ label, value, icon: Icon }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="text-gray-500 text-sm" />
      <span className="text-xs font-medium text-gray-600">
        <TranslatedText>{label}</TranslatedText>
      </span>
    </div>
    <p className="text-sm font-medium text-gray-900">
      {typeof value === 'object' ? JSON.stringify(value) : 
       typeof value === 'string' ? <TranslatedText>{value}</TranslatedText> : value}
    </p>
  </div>
);

const ActionBtn = ({ icon: Icon, label, onClick, color, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${color} text-white py-3 px-3 rounded-lg font-medium transition-all duration-200 flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-sm hover:shadow`}
  >
    <Icon className="text-lg" />
    <span className="text-xs">
      {typeof label === 'string' ? <TranslatedText>{label}</TranslatedText> : label}
    </span>
  </button>
);

const Modal = ({ title, children, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {typeof title === 'string' ? <TranslatedText>{title}</TranslatedText> : title}
      </h3>
      {children}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <TranslatedText>Cancel</TranslatedText>
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          <TranslatedText>Confirm</TranslatedText>
        </button>
      </div>
    </div>
  </div>
);

export default FullVoterDetails;