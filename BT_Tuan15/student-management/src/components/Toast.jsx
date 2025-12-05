// Tao component Toast de hien thi thong bao
import React, { useEffect } from 'react';

export default function Toast({ id, message, type = 'info', onClose, duration = 3000 }) {
    useEffect(() => {
        const t = setTimeout(() => onClose && onClose(id), duration);
        return () => clearTimeout(t);
    }, [id, duration, onClose]);

    const cls = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : 'toast-info'}`;

    return (
        <div className={cls} role="status" aria-live="polite">
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={() => onClose && onClose(id)}>&times;</button>
        </div>
    );
}
