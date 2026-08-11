import { useState } from "react";
import Window from "../components/Window";

type DocumentItem = {
  id: number;
  name: string;
  type: string;
  size: string;
  description: string;
  content: string;
  path?: string;
  imagePath?: string;
};

const documents: DocumentItem[] = [
  {
    id: 1,
    name: "resume.pdf",
    type: "PDF",
    size: "1.2 MB",
    description: "A polished one-page resume for professional work and freelance opportunities.",
    content: "Resume content placeholder. Replace this with your real resume text later.",
    path: "/files/resume.pdf",
    imagePath: "/img/resume.png",
  },
  {
    id: 2,
    name: "portfolio.pdf",
    type: "PDF",
    size: "2.4 MB",
    description: "A curated portfolio of recent projects, case studies, and design work.",
    content: "Portfolio content placeholder. Replace this with your real project overview later.",
  },
  {
    id: 3,
    name: "references.txt",
    type: "TXT",
    size: "42 KB",
    description: "A placeholder notes file for references, contacts, and quick access info.",
    content: "Reference notes placeholder. Add your contact details or links here.",
  },
  {
    id: 4,
    name: "cover-letter.docx",
    type: "DOCX",
    size: "780 KB",
    description: "A draft cover letter template ready to customize for new opportunities.",
    content: "Cover letter placeholder. Replace this with your real letter text later.",
  },
];

const getResumeWindowSize = () => {
  if (typeof window === "undefined") {
    return { width: 760, height: 980 };
  }

  const maxWidth = Math.min(920, window.innerWidth - 120);
  const maxHeight = Math.min(1120, window.innerHeight - 120);
  const aspectRatio = 8.5 / 11;

  let width = maxWidth;
  let height = width / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
};

function DocumentsApp() {
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
  const [windowPosition, setWindowPosition] = useState(() => {
    if (typeof window === "undefined") {
      return { x: 120, y: 100 };
    }

    const size = getResumeWindowSize();
    return {
      x: Math.max(40, Math.round((window.innerWidth - size.width) / 2)),
      y: Math.max(40, Math.round((window.innerHeight - size.height) / 2)),
    };
  });
  const [windowSize, setWindowSize] = useState(getResumeWindowSize);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleOpenDocument = (doc: DocumentItem) => {
    if (doc.name === "resume.pdf" && doc.path && doc.imagePath) {
      setActiveDoc(doc);
      return;
    }

    setActiveDoc(doc);
  };

  return (
    <div className="app-content documents-app">

      <div className="documents-grid" role="list">
        {documents.map((doc) => (
          <button
            key={doc.id}
            type="button"
            className="document-card"
            onClick={() => handleOpenDocument(doc)}
          >
            <div className="document-preview" aria-hidden="true" />
            <div className="document-info">
              <strong>{doc.name}</strong>
              <span>{doc.type}</span>
            </div>
          </button>
        ))}
      </div>

      {activeDoc ? (
        <div className="document-window-shell">
          <Window
            id={`document-${activeDoc.id}`}
            title={activeDoc.name}
            onClose={() => setActiveDoc(null)}
            onMinimize={() => setIsMinimized((prev) => !prev)}
            isMinimized={isMinimized}
            position={windowPosition}
            size={windowSize}
            onPositionChange={(x, y) => setWindowPosition({ x, y })}
            onSizeChange={(width, height) => setWindowSize({ width, height })}
          >
            <div className="document-window-content">
              {activeDoc.name === "resume.pdf" && activeDoc.imagePath ? (
                <>
                  <div className="document-image-frame">
                    <img
                      src={activeDoc.imagePath}
                      alt="Resume preview"
                      className="document-preview-image"
                    />
                  </div>
                  <div className="document-actions">
                    <a href={activeDoc.path} download className="document-download-btn">
                      Download PDF
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="document-modal-preview" aria-hidden="true" />
                  <p>{activeDoc.description}</p>
                  <div className="document-meta">
                    <span>Type: {activeDoc.type}</span>
                    <span>Size: {activeDoc.size}</span>
                  </div>
                  <div className="document-content-box">{activeDoc.content}</div>
                </>
              )}
            </div>
          </Window>
        </div>
      ) : null}
    </div>
  );
}

export default DocumentsApp;
