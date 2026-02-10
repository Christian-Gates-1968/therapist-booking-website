import React from "react";

const PrescriptionModal = ({ prescription, doctorName, appointmentDate, onClose }) => {
  // Parse the prescription string into structured fields
  const parsePrescription = (prescriptionStr) => {
    const fields = {};
    if (!prescriptionStr) return fields;

    const parts = prescriptionStr.split(", ");
    parts.forEach((part) => {
      const [key, ...valueParts] = part.split(": ");
      if (key && valueParts.length > 0) {
        fields[key.trim()] = valueParts.join(": ").trim();
      }
    });
    return fields;
  };

  const parsed = parsePrescription(prescription);

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
      <div className="bg-white w-[90%] max-w-lg p-6 rounded-2xl shadow-2xl border border-fuchsia-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-fuchsia-900">Prescription</h2>
            {doctorName && (
              <p className="text-sm text-fuchsia-600 mt-0.5">By {doctorName}</p>
            )}
            {appointmentDate && (
              <p className="text-xs text-gray-400 mt-0.5">{appointmentDate}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-fuchsia-700 text-2xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>

        <hr className="border-fuchsia-100 mb-5" />

        {/* Prescription Fields */}
        <div className="flex flex-col gap-4">
          {parsed.Medication && (
            <div className="bg-fuchsia-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-fuchsia-700 uppercase tracking-wide mb-1">
                Medication
              </p>
              <p className="text-sm text-gray-800">{parsed.Medication}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {parsed.Dosage && (
              <div className="bg-fuchsia-50 p-3 rounded-lg">
                <p className="text-xs font-semibold text-fuchsia-700 uppercase tracking-wide mb-1">
                  Dosage
                </p>
                <p className="text-sm text-gray-800">{parsed.Dosage}</p>
              </div>
            )}

            {parsed.Frequency && (
              <div className="bg-fuchsia-50 p-3 rounded-lg">
                <p className="text-xs font-semibold text-fuchsia-700 uppercase tracking-wide mb-1">
                  Frequency
                </p>
                <p className="text-sm text-gray-800">{parsed.Frequency}</p>
              </div>
            )}
          </div>

          {parsed.Notes && (
            <div className="bg-fuchsia-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-fuchsia-700 uppercase tracking-wide mb-1">
                Notes
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">{parsed.Notes}</p>
            </div>
          )}

          {/* Fallback: show raw text if parsing yields nothing */}
          {Object.keys(parsed).length === 0 && prescription && (
            <div className="bg-fuchsia-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-fuchsia-700 uppercase tracking-wide mb-1">
                Details
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">{prescription}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
