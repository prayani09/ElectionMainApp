import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as RW from 'react-window';
import TranslatedText from './TranslatedText';
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

const VoterItem = ({ index, style, data }) => {
  const voter = data.voters[index];
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
    <div style={style} className="px-3 py-2">
      {/* Voter Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/80 hover:border-orange-300 hover:shadow-lg transition-all duration-300 group">
        <div className="p-4">
          {/* Main Content Row */}
          <div className="flex items-center justify-between">
            {/* Left Section - Serial & Basic Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Serial Number */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1 shadow-lg flex-shrink-0">
                <FiHash className="text-xs" />
                #{serialNumber}
              </div>

              {/* Voter Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                    <FiUser className="text-sm" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                   <TranslatedText>{voter.name || '—'}</TranslatedText>
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {voter.voterId || '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin className="text-green-500" />
                    <TranslatedText>Booth : {voter.boothNumber || 'N/A'}</TranslatedText>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Actions & Additional Info */}
            <div className="flex items-center gap-3 ml-4">
              {/* Additional Info */}
              <div className="flex items-center gap-3 text-sm">
                {voter.age && (
                  <div className="text-center bg-blue-50 rounded-lg px-3 py-1 border border-blue-100">
                    <p className="text-xs font-semibold text-blue-700">
                      <TranslatedText>Age</TranslatedText>
                    </p>
                    <p className="text-sm font-bold text-gray-900">{voter.age}</p>
                  </div>
                )}
                {voter.gender && (
                  <div className="text-center bg-pink-50 rounded-lg px-3 py-1 border border-pink-100">
                    <p className="text-xs font-semibold text-pink-700">
                      <TranslatedText>Gender</TranslatedText>
                    </p>
                    <p className="text-sm font-bold text-gray-900">{voter.gender}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* View Details Button */}
                <button
                  onClick={handleViewDetails}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  <FiEye className="text-sm" />
                  <TranslatedText>View</TranslatedText>
                </button>

                {/* Quick Contact Icons */}
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
                </div>
              </div>
            </div>
          </div>

          {/* Polling Station Address - Only show if space allows */}
          {voter.pollingStationAddress && (
            <div className="mt-3 flex items-start gap-2 text-sm text-gray-600 bg-gray-50/50 rounded-lg p-2 border border-gray-100">
              <FiMapPin className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-tight line-clamp-1">
                {voter.pollingStationAddress}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scaleIn border border-white/30">
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
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 text-base bg-white/80"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-200 text-sm"
                disabled={sending}
              >
                <TranslatedText>Cancel</TranslatedText>
              </button>
              <button
                onClick={handleSendDetails}
                disabled={!contactValue.trim() || sending}
                className={`flex-1 px-4 py-3 rounded-xl text-white font-semibold transition-all duration-200 text-sm flex items-center justify-center gap-2 ${
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
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <TranslatedText>Sending...</TranslatedText>
                  </>
                ) : (
                  <>
                    <FiSend className="text-sm" />
                    <TranslatedText>Send</TranslatedText>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const VoterList = ({ voters }) => {
  const navigate = useNavigate();

  // Defensive: ensure voters is an array
  if (!Array.isArray(voters) || voters.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white/80 backdrop-blur-xl rounded-2xl m-4">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-lg font-medium mb-2">
          <TranslatedText>No voters found</TranslatedText>
        </p>
        <p className="text-sm text-gray-600">
          <TranslatedText>Try adjusting your search or filters</TranslatedText>
        </p>
      </div>
    );
  }

  // Try to resolve FixedSizeList from different module shapes
  const ListComp = RW.FixedSizeList || (RW.default && RW.default.FixedSizeList) || null;

  // If react-window is available and exposes FixedSizeList, use it for virtualization
  if (ListComp) {
    return (
      <ListComp
        height={600}
        itemCount={voters.length}
        itemSize={120} // Reduced height for compact row design
        itemData={{ voters, navigate }}
        className="px-1"
      >
        {VoterItem}
      </ListComp>
    );
  }

  // Fallback: render a simple list if virtualization isn't available
  return (
    <div className="space-y-2 p-3">
      {voters.map((voter, idx) => (
        <div key={voter.id || idx} className="bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/80 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
          <div className="p-4">
            <div className="flex items-center justify-between">
              {/* Left Section - Serial & Basic Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Serial Number */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1 shadow-lg flex-shrink-0">
                  <FiHash className="text-xs" />
                  #{voter.serialNumber || idx + 1}
                </div>

                {/* Voter Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                      <FiUser className="text-sm" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {voter.name || '—'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      {voter.voterId || '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-green-500" />
                      <TranslatedText>Booth</TranslatedText> {voter.boothNumber || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section - Actions & Additional Info */}
              <div className="flex items-center gap-3 ml-4">
                {/* Additional Info */}
                <div className="flex items-center gap-3 text-sm">
                  {voter.age && (
                    <div className="text-center bg-blue-50 rounded-lg px-3 py-1 border border-blue-100">
                      <p className="text-xs font-semibold text-blue-700">
                        <TranslatedText>Age</TranslatedText>
                      </p>
                      <p className="text-sm font-bold text-gray-900">{voter.age}</p>
                    </div>
                  )}
                  {voter.gender && (
                    <div className="text-center bg-pink-50 rounded-lg px-3 py-1 border border-pink-100">
                      <p className="text-xs font-semibold text-pink-700">
                        <TranslatedText>Gender</TranslatedText>
                      </p>
                      <p className="text-sm font-bold text-gray-900">{voter.gender}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/voter/${voter.id}`)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    <FiEye className="text-sm" />
                    <TranslatedText>View</TranslatedText>
                  </button>
                </div>
              </div>
            </div>

            {/* Polling Station Address */}
            {voter.pollingStationAddress && (
              <div className="mt-3 flex items-start gap-2 text-sm text-gray-600 bg-gray-50/50 rounded-lg p-2 border border-gray-100">
                <FiMapPin className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-tight line-clamp-1">
                  {voter.pollingStationAddress}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoterList;