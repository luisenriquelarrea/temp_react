import React, { ReactNode, useEffect } from "react";

interface PreviewModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: ReactNode;
    heightPercent?: number;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
    open,
    onClose,
    children,
    title,
    heightPercent = 92,
}) => {

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (open) 
            document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="preview-modal-backdrop" onClick={onClose}>
            <div
                className="preview-modal"
                style={{ height: `${heightPercent}vh` }}
                onClick={(e) => e.stopPropagation()} >
            
            <div className="preview-handle" />

                { title && <div className="preview-header">{ title } </div> }

                <div className="preview-content">{children}</div>
            </div>
        </div>
    );
};

export default PreviewModal;