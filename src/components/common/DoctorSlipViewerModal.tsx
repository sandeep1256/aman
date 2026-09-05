import React from 'react';
import { X, Download, FileText, ZoomIn, Printer, CheckCircle, ExternalLink } from 'lucide-react';

interface DoctorSlipViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string;
  fileType?: 'image' | 'pdf';
  doctorName?: string;
  clinicName?: string;
  date?: string;
}

export const DoctorSlipViewerModal: React.FC<DoctorSlipViewerModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName = "Doctor_Prescription_Slip",
  fileType = fileUrl?.startsWith('data:application/pdf') || fileUrl?.endsWith('.pdf') ? 'pdf' : 'image',
  doctorName,
  clinicName,
  date,
}) => {
  if (!isOpen || !fileUrl) return null;

  const isPdf = fileType === 'pdf' || fileUrl.startsWith('data:application/pdf') || fileUrl.includes('.pdf');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName.includes('.') ? fileName : `${fileName}.${isPdf ? 'pdf' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (isPdf) {
      const printWindow = window.open(fileUrl);
      if (printWindow) {
        printWindow.focus();
        printWindow.print();
      }
    } else {
      const win = window.open('');
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Doctor Prescription Slip - Aman Opticals</title>
              <style>
                body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; }
                .header { margin: 20px 0; text-align: center; }
                img { max-width: 95%; max-height: 85vh; object-fit: contain; }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>Aman Opticals - Optical Lab Job Prescription</h2>
                <p>${doctorName ? `Doctor: ${doctorName}` : ''} ${clinicName ? `• Clinic: ${clinicName}` : ''} ${date ? `• Date: ${date}` : ''}</p>
              </div>
              <img src="${fileUrl}" onload="window.print();window.close();" />
            </body>
          </html>
        `);
        win.document.close();
      }
    }
  };

  return (
    <div 
      id="doctor-slip-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        id="doctor-slip-modal-container"
        className="bg-white border border-stone-300 max-w-4xl w-full my-auto shadow-2xl text-stone-900 overflow-hidden flex flex-col max-h-[92vh] rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-stone-950 text-[#D4AF37] flex items-center justify-center font-bold">
              {isPdf ? <FileText className="w-5 h-5 text-rose-500" /> : <ZoomIn className="w-5 h-5 text-[#D4AF37]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm text-stone-950">
                  Doctor Prescription Slip
                </h3>
                <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                  isPdf 
                    ? 'bg-rose-50 text-rose-700 border-rose-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {isPdf ? 'PDF Document' : 'Original Photo'}
                </span>
                <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-[#D4AF37]" />
                  Verified Slip
                </span>
              </div>
              <div className="text-[11px] font-mono text-stone-500 mt-0.5 truncate max-w-md">
                {fileName} {doctorName ? `• Dr: ${doctorName}` : ''} {clinicName ? `• ${clinicName}` : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="slip-download-btn"
              type="button"
              onClick={handleDownload}
              className="p-2 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors flex items-center gap-1 text-xs font-mono"
              title="Download Prescription Slip"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              id="slip-print-btn"
              type="button"
              onClick={handlePrint}
              className="p-2 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors flex items-center gap-1 text-xs font-mono"
              title="Print Prescription Slip"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              id="slip-close-btn"
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-stone-200 text-stone-500 hover:text-stone-950 transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto bg-[#1A1A1A] p-4 sm:p-6 flex items-center justify-center min-h-[350px]">
          {isPdf ? (
            <div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center bg-stone-900 rounded-none overflow-hidden">
              <object
                data={fileUrl}
                type="application/pdf"
                className="w-full h-[65vh] border-0"
              >
                <div className="text-center p-8 text-white space-y-4 max-w-md">
                  <FileText className="w-16 h-16 text-rose-500 mx-auto" />
                  <h4 className="font-serif text-lg font-bold">PDF Prescription Attached</h4>
                  <p className="text-xs font-mono text-stone-400">
                    Your browser does not support inline PDF preview. You can open or download the doctor slip directly below.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <a
                      href={fileUrl}
                      download={fileName}
                      className="px-4 py-2 bg-[#D4AF37] text-stone-950 font-mono text-xs font-bold uppercase inline-flex items-center gap-2 hover:bg-[#c49f30]"
                    >
                      <Download className="w-4 h-4" />
                      Download Slip PDF
                    </a>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-stone-800 text-white font-mono text-xs font-bold uppercase inline-flex items-center gap-2 hover:bg-stone-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </a>
                  </div>
                </div>
              </object>
            </div>
          ) : (
            <div className="max-w-full max-h-full flex items-center justify-center">
              <img
                src={fileUrl}
                alt="Doctor Prescription Slip"
                className="max-w-full max-h-[70vh] object-contain shadow-2xl border border-stone-800 bg-white"
              />
            </div>
          )}
        </div>

        {/* Modal Bottom Bar with Lab Notice */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Aman Opticals Quality Lab: High-precision computerized lens edging is aligned directly with this slip.</span>
          </div>
          <div className="text-[11px] text-stone-500">
            {date ? `Uploaded on: ${date}` : 'Ready for Lab Assembly'}
          </div>
        </div>
      </div>
    </div>
  );
};
