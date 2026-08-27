import { useRef, useState, useEffect } from "react";
import { appRegistry } from "../data/appRegistry";
import "../styles/Window.css";

interface WindowProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
  id: string;
  isMinimized: boolean;
  isActive?: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onFocus?: () => void;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
}

function Window({
  title,
  onClose,
  onMinimize,
  children,
  id,
  isMinimized,
  isActive = true,
  position,
  size,
  onFocus,
  onPositionChange,
  onSizeChange,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  // Ensure size has valid values
  const validSize = {
    width: size?.width || 600,
    height: size?.height || 400,
  };
  const windowIcon =
    appRegistry.find((app) => app.id === id)?.icon ??
    (id.startsWith("document-") ? "▤" : "▣");

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-control-button")) return;
    if ((e.target as HTMLElement).closest("button:not(.window-control-button)")) return;
    if ((e.target as HTMLElement).closest(".resize-handle")) return;

    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: validSize.width,
      height: validSize.height,
      left: position.x,
      top: position.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      const rect = windowRef.current!.getBoundingClientRect();
      const windowWidth = rect.width;
      const windowHeight = rect.height;

      const workspaceHeight = window.innerHeight - 58;
      const minX = 8;
      const maxX = Math.max(minX, window.innerWidth - windowWidth - 8);
      const minY = 8;
      const maxY = Math.max(minY, workspaceHeight - windowHeight - 8);

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      onPositionChange(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, onPositionChange]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = resizeStart.left;
      let newY = resizeStart.top;

      const screenWidth = window.innerWidth;
      const workspaceHeight = window.innerHeight - 58;
      const minWidth = Math.min(300, screenWidth - 16);
      const minHeight = Math.min(180, workspaceHeight - 16);

      if (isResizing.includes("e")) {
        newWidth = Math.max(minWidth, Math.min(resizeStart.width + deltaX, screenWidth - resizeStart.left - 8));
      }
      if (isResizing.includes("s")) {
        newHeight = Math.max(minHeight, Math.min(resizeStart.height + deltaY, workspaceHeight - resizeStart.top - 8));
      }
      if (isResizing.includes("w")) {
        const nextLeft = resizeStart.left + deltaX;
        const maxLeft = resizeStart.left + resizeStart.width - minWidth;
        newX = Math.max(8, Math.min(nextLeft, maxLeft));
        newWidth = Math.max(minWidth, resizeStart.width - (newX - resizeStart.left));
        newWidth = Math.min(newWidth, screenWidth - newX - 8);
      }
      if (isResizing.includes("n")) {
        const nextTop = resizeStart.top + deltaY;
        const maxTop = resizeStart.top + resizeStart.height - minHeight;
        newY = Math.max(8, Math.min(nextTop, maxTop));
        newHeight = Math.max(minHeight, resizeStart.height - (newY - resizeStart.top));
        newHeight = Math.min(newHeight, workspaceHeight - newY - 8);
      }

      onSizeChange(newWidth, newHeight);
      if (isResizing.includes("w") || isResizing.includes("n")) {
        onPositionChange(newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, resizeStart, position, onSizeChange, onPositionChange]);

  if (isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className={`window${isActive ? " is-active" : ""}`}
      data-window-id={id}
      role="dialog"
      aria-labelledby={`window-title-${id}`}
      onMouseDown={onFocus}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${validSize.width}px`,
        height: `${validSize.height}px`,
      }}
    >
      <div className="window-title" onMouseDown={handleMouseDown}>
        <div className="window-title-label">
          <span className="window-title-icon" aria-hidden="true">
            {windowIcon}
          </span>
          <span className="window-title-text" id={`window-title-${id}`}>
            {title}
          </span>
        </div>
        <div className="window-controls">
          <button
            type="button"
            className="window-control-button"
            onClick={onMinimize}
            aria-label={`Minimize ${title}`}
          >
            <span aria-hidden="true">—</span>
          </button>
          <button
            type="button"
            className="window-control-button window-close-button"
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
      <div className="window-content">{children}</div>

      {/* Resize Handles */}
      <div
        className="resize-handle nw"
        onMouseDown={handleResizeStart("nw")}
        title="Resize"
      />
      <div
        className="resize-handle ne"
        onMouseDown={handleResizeStart("ne")}
        title="Resize"
      />
      <div
        className="resize-handle sw"
        onMouseDown={handleResizeStart("sw")}
        title="Resize"
      />
      <div
        className="resize-handle se"
        onMouseDown={handleResizeStart("se")}
        title="Resize"
      />
      <div
        className="resize-handle n"
        onMouseDown={handleResizeStart("n")}
        title="Resize"
      />
      <div
        className="resize-handle s"
        onMouseDown={handleResizeStart("s")}
        title="Resize"
      />
      <div
        className="resize-handle w"
        onMouseDown={handleResizeStart("w")}
        title="Resize"
      />
      <div
        className="resize-handle e"
        onMouseDown={handleResizeStart("e")}
        title="Resize"
      />
    </div>
  );
}

export default Window;
