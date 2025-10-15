// src/components/VoterCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Icons
import { 
  FiUser, 
  FiMapPin, 
  FiHash, 
  FiMessageCircle, 
  FiMail, 
  FiPhone,
  FiX,
  FiSend
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const VoterCard = ({ voter }) => {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [sending, setSending] = useState(false);

  const handleViewDetails = () => {
    navigate(`/voter/${voter.id}`);
  };

  const handleContactClick = (method) => {
    setSelectedMethod(method);
    setContactValue('');
    setShowContactModal(true);
  };

  const handleSendDetails = async () => {
    if (!contactValue.trim()) return;

    setSending(true);
    // Simulate sending process
    setTimeout(() => {
      setSending(false);
      setShowContactModal(false);
      setContactValue('');
      alert(`Voter details sent via ${selectedMethod} to ${contactValue}`);
    }, 1500);
  };

  const ContactIcon = ({ method, icon: Icon, color, bgColor }) => (
    <button
      onClick={() => handleContactClick(method)}
      className={`p-2 rounded-xl ${bgColor} text-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl`}
      title={`Send via ${method}`}
    >
      <Icon className="text-sm" />
    </button>
  );

  return (
    <>
      {/* Voter Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 hover:border-orange-200 mb-3">
        {/* Header with Serial and Booth */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
              <FiHash className="text-xs" />
              {voter.serialNumber}
            </div>
          </div>
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
            <FiMapPin className="text-xs" />
            Booth {voter.boothNumber}
          </div>
        </div>

        {/* Voter Name */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <FiUser className="text-orange-600 text-sm" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 truncate flex-1">
            {voter.name}
          </h3>
        </div>

        {/* Voter Details - Compact */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-gray-700">ID:</span>
              <span className="font-mono ml-1 truncate">{voter.voterId}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <FiMapPin className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2 leading-tight">{voter.pollingStationAddress}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-2">
          {/* View Details Button */}
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-1"
          >
            <FiUser className="text-sm" />
            View
          </button>

          {/* Contact Icons */}
          <div className="flex gap-1">
            <ContactIcon
              method="WhatsApp"
              icon={FaWhatsapp}
              color="text-white"
              bgColor="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            />
            <ContactIcon
              method="SMS"
              icon={FiMessageCircle}
              color="text-white"
              bgColor="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            />
            <ContactIcon
              method="Email"
              icon={FiMail}
              color="text-white"
              bgColor="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            />
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl animate-scaleIn border border-white/30">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  selectedMethod === 'WhatsApp' ? 'bg-green-500' :
                  selectedMethod === 'SMS' ? 'bg-blue-500' :
                  'bg-purple-500'
                } text-white`}>
                  {selectedMethod === 'WhatsApp' && <FaWhatsapp className="text-lg" />}
                  {selectedMethod === 'SMS' && <FiMessageCircle className="text-lg" />}
                  {selectedMethod === 'Email' && <FiMail className="text-lg" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Send Details</h3>
                  <p className="text-sm text-gray-600">via {selectedMethod}</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiX className="text-gray-500 text-lg" />
              </button>
            </div>

            {/* Voter Info Preview */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FiUser className="text-orange-600 text-sm" />
                <span className="text-sm font-semibold text-gray-900">{voter.name}</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Voter ID: <span className="font-mono">{voter.voterId}</span></div>
                <div>Booth: <span className="font-semibold">{voter.boothNumber}</span></div>
              </div>
            </div>

            {/* Contact Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedMethod === 'Email' ? 'Email Address' : 
                 selectedMethod === 'WhatsApp' ? 'Phone Number' : 'Phone Number'}
              </label>
              <div className="relative">
                {selectedMethod === 'Email' ? (
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                ) : (
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                )}
                <input
                  type={selectedMethod === 'Email' ? 'email' : 'tel'}
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={
                    selectedMethod === 'Email' ? 'Enter email address' :
                    selectedMethod === 'WhatsApp' ? 'With country code...' :
                    'Enter phone number'
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 text-sm"
                disabled={sending}
              >
                Cancel
              </button>
              <button
                onClick={handleSendDetails}
                disabled={!contactValue.trim() || sending}
                className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-all duration-200 text-sm flex items-center justify-center gap-2 ${
                  !contactValue.trim() || sending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : selectedMethod === 'WhatsApp' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    : selectedMethod === 'SMS'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                }`}
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="text-sm" />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoterCard;