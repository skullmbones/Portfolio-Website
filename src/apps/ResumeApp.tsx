function ResumeApp() {
  return (
    <div className="document-viewer-app">
      <iframe
        src="/files/resume.pdf"
        title="Resume"
        className="document-iframe"
      />
    </div>
  );
}

export default ResumeApp;
