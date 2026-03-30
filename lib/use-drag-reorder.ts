'use client';

import { useState } from 'react';

export function useDragReorder(onReorder?: (fromIndex: number, toIndex: number) => void) {
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [overIndex, setOverIndex] = useState<number | null>(null);

	function handleDragStart(index: number) {
		setDragIndex(index);
	}

	function handleDragOver(e: React.DragEvent, index: number) {
		e.preventDefault();
		setOverIndex(index);
	}

	function handleDrop(index: number) {
		if (dragIndex !== null && dragIndex !== index) {
			onReorder?.(dragIndex, index);
		}
		setDragIndex(null);
		setOverIndex(null);
	}

	function handleDragEnd() {
		setDragIndex(null);
		setOverIndex(null);
	}

	return { dragIndex, overIndex, handleDragStart, handleDragOver, handleDrop, handleDragEnd };
}
