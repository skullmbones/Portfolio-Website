import { useRef, useState, useEffect } from "react";
import "../styles/Window.css";

interface WindowProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
  id: string;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
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
  position,
  size,
  onPositionChange,
  onSizeChange,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Ensure size has valid values
  const validSize = {
    width: size?.width || 600,
    height: size?.height || 400,
  };

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

      const minX = 0;
      const maxX = window.innerWidth - windowWidth;
      const minY = 0;
      const maxY = window.innerHeight - windowHeight;

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
      let newX = position.x;
      let newY = position.y;

      const minWidth = 300;
      const minHeight = 150;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (isResizing.includes("e")) {
        newWidth = Math.max(minWidth, resizeStart.width + deltaX);
        newWidth = Math.min(newWidth, screenWidth - newX);
      }
      if (isResizing.includes("s")) {
        newHeight = Math.max(minHeight, resizeStart.height + deltaY);
        newHeight = Math.min(newHeight, screenHeight - newY);
      }
      if (isResizing.includes("w")) {
        // Left side resize: adjust left edge
        newX = position.x + deltaX;
        newWidth = resizeStart.width - deltaX;
        
        // Ensure width stays at minimum
        if (newWidth < minWidth) {
          newWidth = minWidth;
          newX = position.x + resizeStart.width - minWidth;
        }
        
        // Ensure X doesn't go negative
        if (newX < 0) {
          newWidth = resizeStart.width + position.x;
          newX = 0;
        }
        
        // Ensure doesn't go off right side
        if (newX + newWidth > screenWidth) {
          newWidth = screenWidth - newX;
        }
      }
      if (isResizing.includes("n")) {
        // Top side resize: adjust top edge
        newY = position.y + deltaY;
        newHeight = resizeStart.height - deltaY;
        
        // Ensure height stays at minimum
        if (newHeight < minHeight) {
          newHeight = minHeight;
          newY = position.y + resizeStart.height - minHeight;
        }
        
        // Ensure Y doesn't go negative
        if (newY < 0) {
          newHeight = resizeStart.height + position.y;
          newY = 0;
        }
        
        // Ensure doesn't go off bottom
        if (newY + newHeight > screenHeight) {
          newHeight = screenHeight - newY;
        }
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
      className="window"
      data-window-id={id}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${validSize.width}px`,
        height: `${validSize.height}px`,
      }}
    >
      <div className="window-title" onMouseDown={handleMouseDown}>
        <span className="window-title-text">{title}</span>
        <div className="window-controls">
          <button
            className="window-control-button"
            onClick={onMinimize}
            title="Minimize"
          >
            _
          </button>
          <button
            className="window-control-button"
            onClick={onClose}
            title="Close"
          >
            ×
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
