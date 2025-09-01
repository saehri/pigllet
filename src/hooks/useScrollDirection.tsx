import { useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export default function useScrollDirection(threshold = 10) {
	const lastOffsetY = useRef(0);
	const [direction, setDirection] = useState<'up' | 'down' | null>('up');

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const currentOffsetY = event.nativeEvent.contentOffset.y;
		const deltaY = currentOffsetY - lastOffsetY.current;

		if (Math.abs(deltaY) > threshold) {
			setDirection(deltaY > 0 ? 'down' : 'up');
			lastOffsetY.current = currentOffsetY; // reset after significant move
		}
	};

	return { direction, handleScroll };
}

