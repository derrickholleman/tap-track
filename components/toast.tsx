'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';

interface ToastContextValue {
	showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) throw new Error('useToast must be used within ToastProvider');
	return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [message, setMessage] = useState('');
	const [visible, setVisible] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const showToast = useCallback((msg: string) => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setMessage(msg);
		setVisible(true);
		timeoutRef.current = setTimeout(() => setVisible(false), 3000);
	}, []);

	return (
		<ToastContext value={{ showToast }}>
			{children}
			<div
				role="status"
				aria-live="polite"
				className={`fixed bottom-4 right-4 z-50 rounded-lg bg-green-600 px-6 py-3 text-white shadow-lg transition-all duration-300 ${
					visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
				}`}
			>
				{message}
			</div>
		</ToastContext>
	);
}
