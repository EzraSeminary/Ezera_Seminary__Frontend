import { X, DownloadSimple } from "@phosphor-icons/react";

type ExploreItem = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileType: string;
};

export default function ExploreItemViewer({
  item,
  onClose,
}: {
  item: ExploreItem;
  onClose: () => void;
}) {
  const isPdf =
    item.fileType?.toLowerCase() === "pdf" ||
    item.mimeType === "application/pdf" ||
    item.fileName?.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-accent-2">
        <div className="flex items-center justify-between p-4 border-b border-accent-1">
          <div className="min-w-0">
            <div className="font-nokia-bold text-secondary-8 truncate">
              {item.title}
            </div>
            {item.description && (
              <div className="text-xs text-secondary-6 truncate line-clamp-1">{item.description}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = item.fileUrl;
                link.download = item.fileName || `${item.title}.${item.fileType}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-3 py-2 rounded-xl bg-accent-6 hover:bg-accent-7 text-white font-nokia-bold flex items-center gap-2"
            >
              <DownloadSimple size={18} weight="bold" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-accent-1 text-secondary-7"
              aria-label="Close"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>

        {item.description ? (
          <div className="px-4 py-3 text-sm text-secondary-7 border-b border-accent-1 whitespace-pre-wrap">
            {item.description}
          </div>
        ) : null}

        <div className="h-[70vh] bg-secondary-1">
          {isPdf ? (
            <iframe
              title={item.title}
              src={item.fileUrl}
              className="w-full h-full"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-secondary-7 p-6 text-center">
              <div className="font-nokia-bold text-lg mb-2">
                Preview not available for this file type
              </div>
              <div className="text-sm text-secondary-6 mb-4">
                Use the Download button to open it in PowerPoint (or compatible viewer).
              </div>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = item.fileUrl;
                  link.download = item.fileName || `${item.title}.${item.fileType}`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-4 py-2 rounded-xl bg-accent-6 hover:bg-accent-7 text-white font-nokia-bold"
              >
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

