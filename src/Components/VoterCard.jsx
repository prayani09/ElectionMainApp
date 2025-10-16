import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FullVoterDetails'

// Icons
import {
  FiUser,
  FiMapPin,
  FiHash,
  FiMessageCircle,
  FiMail,
  FiPhone,
  FiX,
  FiSend,
  FiEye,
  FiShare2
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import TranslatedText from './TranslatedText';

const VoterCard = ({ voter, index }) => {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [sending, setSending] = useState(false);

  // Calculate serial number from index or use voter's serialNumber
  const serialNumber = voter.serialNumber || index + 1;

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
      alert(`${voter.name}'s details sent via ${selectedMethod} to ${contactValue}`);
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
      <div className="bg-gradient-to-br from-white to-orange-50/30 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:border-orange-300 hover:-translate-y-1 group">
        {/* Header with Serial and Booth */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg">
              <FiHash className="text-xs" />
              #{serialNumber}
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg">
            <FiMapPin className="text-xs" />
            <TranslatedText>Booth</TranslatedText> {voter.boothNumber || 'N/A'}
          </div>
        </div>

        {/* Voter Name with Beautiful Badge */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-white/50 rounded-xl border border-orange-100">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">
            <FiUser className="text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {voter.name || '—'}
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              <TranslatedText>Voter ID:</TranslatedText> <span className="font-mono">{voter.voterId || '—'}</span>
            </p>
          </div>
        </div>

        {/* Voter Details */}
        <div className="space-y-3 mb-4">
          {/* Polling Station */}
          <div className="flex items-start gap-3 p-2 bg-blue-50/50 rounded-lg border border-blue-100">
            <FiMapPin className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-blue-700 mb-1">
                <TranslatedText>Polling Station</TranslatedText>
              </p>
              <p className="text-xs text-gray-700 leading-tight">
                {voter.pollingStationAddress || <TranslatedText>No address available</TranslatedText>}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2">
            {voter.age && (
              <div className="text-center bg-purple-50 rounded-lg py-2 border border-purple-100">
                <p className="text-xs font-semibold text-purple-700">
                  <TranslatedText>Age</TranslatedText>
                </p>
                <p className="text-sm font-bold text-gray-900">{voter.age}</p>
              </div>
            )}
            {voter.gender && (
              <div className="text-center bg-pink-50 rounded-lg py-2 border border-pink-100">
                <p className="text-xs font-semibold text-pink-700">
                  <TranslatedText>Gender</TranslatedText>
                </p>
                <p className="text-sm font-bold text-gray-900">{voter.gender}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-2">
          {/* View Details Button */}
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 group-hover:scale-105"
          >
            <FiEye className="text-sm" />
            <TranslatedText>View Details</TranslatedText>
          </button>

          {/* Share Button */}
          <button
            onClick={() => handleContactClick('Share')}
            className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center group-hover:scale-105"
            title="Share Voter Details"
          >
            <FiShare2 className="text-sm" />
          </button>
        </div>

        {/* Quick Contact Icons - Only show on hover */}
        <div className="flex justify-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scaleIn border border-white/30">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${
                  selectedMethod === 'WhatsApp' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                  selectedMethod === 'SMS' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                  'bg-gradient-to-br from-purple-500 to-purple-600'
                } text-white shadow-lg`}>
                  {selectedMethod === 'WhatsApp' && <FaWhatsapp className="text-xl" />}
                  {selectedMethod === 'SMS' && <FiMessageCircle className="text-xl" />}
                  {selectedMethod === 'Email' && <FiMail className="text-xl" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    <TranslatedText>Share Voter Details</TranslatedText>
                  </h3>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>via</TranslatedText> {selectedMethod}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <FiX className="text-gray-500 text-lg" />
              </button>
            </div>

            {/* Voter Info Preview */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 mb-6 border border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500 text-white rounded-lg">
                  <FiUser className="text-sm" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{voter.name || '—'}</h4>
                  <p className="text-sm text-gray-600">
                    <TranslatedText>Serial #</TranslatedText> {serialNumber}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">
                    <TranslatedText>Voter ID:</TranslatedText>
                  </span>
                  <p className="font-mono text-gray-900">{voter.voterId || '—'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">
                    <TranslatedText>Booth:</TranslatedText>
                  </span>
                  <p className="text-gray-900">{voter.boothNumber || '—'}</p>
                </div>
              </div>
            </div>

            {/* Contact Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {selectedMethod === 'Email' ?
                  <TranslatedText>Email Address</TranslatedText> :
                  <TranslatedText>Phone Number</TranslatedText>
                }
              </label>
              <div className="relative">
                {selectedMethod === 'Email' ? (
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                ) : (
                  <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                )}
                <input
                  type={selectedMethod === 'Email' ? 'email' : 'tel'}
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={
                    selectedMethod === 'Email' ?
                      'Enter email address' :
                      selectedMethod === 'WhatsApp' ?
                        'With country code...' :
                        'Enter phone number'
                  }
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-base bg-white/80"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-200 text-base"
                disabled={sending}
              >
                <TranslatedText>Cancel</TranslatedText>
              </button>
              <button
                onClick={handleSendDetails}
                disabled={!contactValue.trim() || sending}
                className={`flex-1 px-6 py-4 rounded-2xl text-white font-semibold transition-all duration-200 text-base flex items-center justify-center gap-3 ${
                  !contactValue.trim() || sending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : selectedMethod === 'WhatsApp' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
                    : selectedMethod === 'SMS'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <TranslatedText>Sending...</TranslatedText>
                  </>
                ) : (
                  <>
                    <FiSend className="text-lg" />
                    <TranslatedText>Send</TranslatedText>
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