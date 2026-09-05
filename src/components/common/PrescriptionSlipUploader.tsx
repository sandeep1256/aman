import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  FileCheck,
  Stethoscope,
  Building2
} from 'lucide-react';
import { DoctorSlipViewerModal } from './DoctorSlipViewerModal';

export interface UploadedSlipData {
  fileUrl: string;
  fileName: string;
  fileType: 'image' | 'pdf';
  fileSize: string;
  doctorName?: string;
  clinicName?: string;
  notes?: string;
}

interface PrescriptionSlipUploaderProps {
  initialData?: Partial<UploadedSlipData>;
  onSlipChange: (slipData: UploadedSlipData | null) => void;
  showDoctorFields?: boolean;
}

export const PrescriptionSlipUploader: React.FC<PrescriptionSlipUploaderProps> = ({
  initialData,
  onSlipChange,
  showDoctorFields = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [slipData, setSlipData] = useState<UploadedSlipData | null>(
    initialData?.fileUrl
      ? {
          fileUrl: initialData.fileUrl,
          fileName: initialData.fileName || 'Doctor_Slip',
          fileType: initialData.fileType || (initialData.fileUrl.startsWith('data:application/pdf') ? 'pdf' : 'image'),
          fileSize: initialData.fileSize || 'Attached',
          doctorName: initialData.doctorName || '',
          clinicName: initialData.clinicName || '',
          notes: initialData.notes || '',
        }
      : null
  );

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (file: File) => {
    setUploadError(null);

    // Validate type
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isImage && !isPdf) {
      setUploadError('Invalid format. Please upload an Image (JPG, PNG, WEBP) or a PDF doctor slip.');
      return;
    }

    // Limit to 12MB
    if (file.size > 12 * 1024 * 1024) {
      setUploadError('File is too large (max 12MB). Please upload a smaller image or compressed PDF.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        setUploadError('Could not read file. Please try again.');
        return;
      }

      const newSlip: UploadedSlipData = {
        fileUrl: result,
        fileName: file.name,
        fileType: isPdf ? 'pdf' : 'image',
        fileSize: formatFileSize(file.size),
        doctorName: slipData?.doctorName || '',
        clinicName: slipData?.clinicName || '',
        notes: slipData?.notes || '',
      };

      setSlipData(newSlip);
      onSlipChange(newSlip);
    };

    reader.onerror = () => {
      setUploadError('Failed to read file from your device.');
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleRemoveSlip = () => {
    setSlipData(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onSlipChange(null);
  };

  const handleDoctorNameChange = (name: string) => {
    if (!slipData) return;
    const updated = { ...slipData, doctorName: name };
    setSlipData(updated);
    onSlipChange(updated);
  };

  const handleClinicNameChange = (clinic: string) => {
    if (!slipData) return;
    const updated = { ...slipData, clinicName: clinic };
    setSlipData(updated);
    onSlipChange(updated);
  };

  const handleNotesChange = (notes: string) => {
    if (!slipData) return;
    const updated = { ...slipData, notes };
    setSlipData(updated);
    onSlipChange(updated);
  };

  return (
    <div className="space-y-3" id="prescription-slip-uploader">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        id="prescription-file-input"
        accept="image/png,image/jpeg,image/webp,image/jpg,.pdf,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!slipData ? (
        /* Upload Drag & Drop Zone */
        <div
          id="slip-drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 sm:p-7 border-2 border-dashed transition-all text-center cursor-pointer select-none ${
            isDragging
              ? 'border-[#D4AF37] bg-[#FAF8F5] scale-[1.01]'
              : 'border-stone-300 hover:border-stone-900 bg-white hover:bg-[#FAF8F5]'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-3 bg-stone-100 flex items-center justify-center text-[#D4AF37] border border-stone-200">
            <Upload className="w-6 h-6" />
          </div>

          <div className="font-serif font-bold text-sm text-stone-950">
            Upload Doctor's Prescription Slip
          </div>
          <p className="text-xs text-stone-600 font-mono mt-1 max-w-sm mx-auto">
            Drag & drop doctor prescription slip or click to browse from device.
          </p>

          <div className="flex items-center justify-center gap-2 mt-3 text-[11px] font-mono">
            <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 text-stone-700 font-bold uppercase">
              JPG / PNG Images
            </span>
            <span className="text-stone-400">•</span>
            <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold uppercase">
              PDF Documents
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-500">Max 12MB</span>
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-stone-950 text-white font-mono text-xs uppercase font-bold hover:bg-stone-800 transition-colors shadow-xs">
            <FileCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Select Prescription Slip</span>
          </div>
        </div>
      ) : (
        /* Attached Slip Preview Card */
        <div className="p-4 bg-white border border-stone-300 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Slip Thumbnail or PDF Badge */}
              <div 
                onClick={() => setPreviewModalOpen(true)}
                className="w-14 h-14 shrink-0 bg-stone-100 border border-stone-300 flex items-center justify-center relative cursor-pointer group overflow-hidden"
                title="Click to zoom / view full slip"
              >
                {slipData.fileType === 'pdf' ? (
                  <div className="flex flex-col items-center justify-center text-rose-600">
                    <FileText className="w-7 h-7" />
                    <span className="text-[8px] font-mono font-bold uppercase mt-0.5">PDF</span>
                  </div>
                ) : (
                  <img
                    src={slipData.fileUrl}
                    alt="Prescription Slip"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                    slipData.fileType === 'pdf' 
                      ? 'bg-rose-50 text-rose-700 border-rose-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {slipData.fileType === 'pdf' ? 'Doctor Slip PDF' : 'Doctor Slip Image'}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Attached</span>
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-stone-950 truncate mt-0.5">
                  {slipData.fileName}
                </div>
                <div className="text-[11px] font-mono text-stone-500">
                  Size: {slipData.fileSize} • Ready for Optometrist Edging
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                id="slip-inspect-btn"
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                className="px-2.5 py-1.5 bg-[#FAF8F5] hover:bg-stone-200 text-stone-900 border border-stone-300 text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                title="Inspect slip"
              >
                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Inspect Slip</span>
              </button>
              <button
                id="slip-replace-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 border border-stone-200 transition-colors"
                title="Replace slip with another file"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                id="slip-remove-btn"
                type="button"
                onClick={handleRemoveSlip}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 transition-colors"
                title="Remove slip"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Optional Doctor / Clinic Details */}
          {showDoctorFields && (
            <div className="pt-2 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <label className="block text-[10px] font-mono uppercase text-stone-500 mb-1 flex items-center gap-1">
                  <Stethoscope className="w-3 h-3 text-[#D4AF37]" />
                  <span>Prescribing Doctor (Optional)</span>
                </label>
                <input
                  id="slip-doctor-name-input"
                  type="text"
                  placeholder="e.g. Dr. R. K. Sharma (Eye Surgeon)"
                  value={slipData.doctorName || ''}
                  onChange={(e) => handleDoctorNameChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-950"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-stone-500 mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#D4AF37]" />
                  <span>Hospital / Clinic (Optional)</span>
                </label>
                <input
                  id="slip-clinic-name-input"
                  type="text"
                  placeholder="e.g. Sawai Madhopur Eye Hospital"
                  value={slipData.clinicName || ''}
                  onChange={(e) => handleClinicNameChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-950"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-mono uppercase text-stone-500 mb-1">
                  Special Notes for Aman Opticals Lab Technician (Optional)
                </label>
                <input
                  id="slip-notes-input"
                  type="text"
                  placeholder="e.g. Please verify Axis 90 and high cylinder power for night driving"
                  value={slipData.notes || ''}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#FAF8F5] border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-950"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Preview Modal */}
      {slipData && (
        <DoctorSlipViewerModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          fileUrl={slipData.fileUrl}
          fileName={slipData.fileName}
          fileType={slipData.fileType}
          doctorName={slipData.doctorName}
          clinicName={slipData.clinicName}
        />
      )}
    </div>
  );
};
