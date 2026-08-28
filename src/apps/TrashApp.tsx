type DocumentItem = {
  id: number;
  name: string;
  type: string;
  size: string;
};

const documents: DocumentItem[] = [
  {
    id: 1,
    name: "hire_me_pls.txt",
    type: "TXT",
    size: "1.9 TB",
  },
  {
    id: 2,
    name: "old_portfolio_site.tar",
    type: "TAR",
    size: "6.7 GB",
  },

];

function TrashApp() {
  return (
    <div className="app-content documents-app">
      <div className="documents-grid" role="list">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="document-card non-openable"
            role="listitem"
          >
            <div className="document-preview" aria-hidden="true">
              <span>{doc.type}</span>
            </div>

            <div className="document-info">
              <strong>{doc.name}</strong>
              <span>
                {doc.type} · {doc.size}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrashApp;