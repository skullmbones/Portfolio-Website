import { useMemo, useState, type FormEvent } from "react";

const RECIPIENT_EMAIL = "mikeybabboni@gmail.com";
const DEFAULT_SUBJECT = "Portfolio Inquiry";
const DEFAULT_MESSAGE = "";

function EmailApp() {
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [status, setStatus] = useState("Draft ready · Send opens your mail app");

  const mailtoUrl = useMemo(() => {
    const query = [
      subject.trim()
        ? `subject=${encodeURIComponent(subject.trim())}`
        : undefined,
      message.trim() ? `body=${encodeURIComponent(message)}` : undefined,
    ]
      .filter(Boolean)
      .join("&");

    return `mailto:${RECIPIENT_EMAIL}${query ? `?${query}` : ""}`;
  }, [message, subject]);

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Opening your email client...");
    window.location.href = mailtoUrl;
  };

  const handleNewDraft = () => {
    setSubject("");
    setMessage("Hi Michael,\n\n");
    setStatus("New draft");
  };

  return (
    <form className="email-app" onSubmit={handleSend}>
      <div className="email-menubar" aria-label="Email menu">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Insert</span>
        <span>Format</span>
        <span>Help</span>
      </div>

      <div className="email-toolbar">
        <button type="submit" className="email-send-button">
          <span aria-hidden="true">✉</span>
          Send
        </button>
        <button type="button" onClick={handleNewDraft}>
          <span aria-hidden="true">□</span>
          New
        </button>
        <span className="email-toolbar-divider" aria-hidden="true" />
        <span className="email-draft-label">Message · Draft</span>
      </div>

      <div className="email-address-fields">
        <label>
          <span>To:</span>
          <input
            type="email"
            value={RECIPIENT_EMAIL}
            readOnly
            aria-label="Recipient"
          />
        </label>
        <label>
          <span>Subject:</span>
          <input
            type="text"
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setStatus("Editing draft");
            }}
            aria-label="Email subject"
          />
        </label>
      </div>

      <div className="email-formatbar" aria-hidden="true">
        <span className="email-font-picker">Arial</span>
        <span className="email-size-picker">10</span>
        <strong className="email-format-button">B</strong>
        <em className="email-format-button">I</em>
        <u className="email-format-button">U</u>
      </div>

      <label className="email-message-label">
        <span className="email-visually-hidden">Message</span>
        <textarea
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setStatus("Editing draft");
          }}
          placeholder="Write your message..."
          aria-label="Email message"
        />
      </label>

      <footer className="email-statusbar">
        <span>{status}</span>
        <span>{message.length} characters</span>
      </footer>
    </form>
  );
}

export default EmailApp;
