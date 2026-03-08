import { X } from "lucide-react";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title: string;
}

export default function PdfPreviewModal({
  isOpen,
  onClose,
  pdfUrl,
  title,
}: PdfPreviewModalProps) {
  if (!isOpen || !pdfUrl) return null;

  // Make sure it points to backend url if it's a relative path
  const fullUrl = pdfUrl.startsWith("/")
    ? `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api").replace(/\/api$/, "")}${pdfUrl}`
    : pdfUrl;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 animate-[fadeIn_0.2s_ease-out] backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-gray-50 shrink-0">
          <h2 className="text-xl font-bold text-gray-900 truncate pr-4">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 w-full bg-gray-100">
          <iframe
            src={`${fullUrl}#toolbar=0`}
            className="w-full h-full border-none"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}
