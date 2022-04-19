import { NavigateOptions } from 'react-router-dom'
import { IPos } from '../Interfaces/ICard'

// Clamp number between two values with the following line:
export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

export const delay = (ms:number) => new Promise(res => setTimeout(res, ms));

export function uuid() {
	var dt = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}

export const GetOffsetInfo = (ourRect: DOMRect | undefined, draggingCardRect: DOMRect | undefined) => {
	let distance = GetDistanceRect(draggingCardRect, ourRect)
	let overlaps = Overlaps(ourRect, draggingCardRect)
	let delta =
		!draggingCardRect || !ourRect
			? undefined
			: { X: draggingCardRect.x - ourRect.x, Y: draggingCardRect.y - ourRect.y }
	return { distance, overlaps, delta }
}

export const GetDistance = (pos1: IPos | undefined, pos2: IPos | undefined) => {
	if (!pos1 || !pos2) return Infinity
	let a = pos1.X - pos2.X
	let b = pos1.Y - pos2.Y
	return Math.sqrt(a * a + b * b)
}

export const GetDistanceRect = (rect1: DOMRect | undefined, rect2: DOMRect | undefined) => {
	if (!rect1 || !rect2) return Infinity
	let a = rect1.x - rect2.x
	let b = rect1.y - rect2.y
	return Math.sqrt(a * a + b * b)
}

export const Overlaps = (rect1: DOMRect | undefined, rect2: DOMRect | undefined): boolean => {
	if (!rect1 || !rect2) return false
	return !(
		rect1.right < rect2.left ||
		rect1.left > rect2.right ||
		rect1.bottom < rect2.top ||
		rect1.top > rect2.bottom
	)
}

export const GetRandomId = () => {
	return GetRandomInt(99999999)
}

export const GetRandomInt = (max: number) => {
	return Math.floor(Math.random() * max)
}
