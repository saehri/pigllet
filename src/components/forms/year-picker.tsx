import { getYearsBetween } from '@/utils/utils';
import { ChevronDown } from 'lucide-react-native';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
	BackHandler,
	Dimensions,
	Pressable,
	ScrollView,
	View,
} from 'react-native';
import { Button, Portal, Surface, useTheme } from 'react-native-paper';

type Props = {
	selectedYear: number;
	setSelectedYear: Dispatch<SetStateAction<number>>;
};

export default function YearPicker({ selectedYear, setSelectedYear }: Props) {
	const theme = useTheme();
	const years = getYearsBetween(2000, new Date().getFullYear() + 10);
	const buttonRef = useRef<View | null>(null);
	const scrollViewRef = useRef<ScrollView | null>(null);

	const [visible, setVisible] = useState(false);
	const [buttonPosition, setButtonPosition] = useState({
		x: 0,
		y: 0,
		width: 0,
	});

	function shows() {
		setVisible(true);
		const toIndex = years.indexOf(selectedYear); // Keeps the selected year visible

		buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
			setButtonPosition({ x: x + 32, y: pageY + height + 1, width });
		});

		// Scroll to the selected year
		setTimeout(() => {
			if (scrollViewRef.current) {
				const index = toIndex < 0 ? 0 : toIndex;

				scrollViewRef.current.scrollTo({
					y: index * 40 - 50, // Assuming each item is ~40px tall
					animated: false,
				});
			}
		}, 100);
	}

	function hide() {
		setVisible(false);
	}

	// Handle back button to close the picker
	useEffect(() => {
		const backAction = () => {
			if (visible) {
				setVisible(false);
				return true;
			}
			return false;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);
		return () => backHandler.remove();
	}, [visible]);

	return (
		<>
			<Portal>
				{visible && (
					<View
						style={{
							position: 'absolute',
							width: Dimensions.get('screen').width,
							height: Dimensions.get('screen').height,
						}}
					>
						<Surface
							mode="elevated"
							elevation={3}
							style={{
								position: 'absolute',
								top: buttonPosition.y,
								left: buttonPosition.x,
								minWidth: buttonPosition.width,
								zIndex: 2,
								maxHeight: Dimensions.get('window').height * 0.5,
								borderRadius: 16,
								borderWidth: 1,
								borderColor: theme.colors.outlineVariant,
							}}
						>
							<ScrollView
								ref={scrollViewRef}
								showsVerticalScrollIndicator={false}
								style={{ margin: 16 }}
							>
								<View>
									{years.map((year) => (
										<Button
											key={year}
											style={{
												backgroundColor:
													selectedYear === year
														? theme.colors.primary
														: theme.colors.elevation.level3,
												borderRadius: 10,
											}}
											labelStyle={{
												fontFamily: 'Inter-Regular',
												fontSize: 16,
												color:
													selectedYear === year
														? theme.colors.onPrimary
														: theme.colors.onSurface,
											}}
											onPress={() => {
												setSelectedYear(year);
												hide();
											}}
										>
											{year}
										</Button>
									))}
								</View>
							</ScrollView>
						</Surface>

						<Pressable
							onPress={hide}
							style={{
								position: 'absolute',
								width: '100%',
								height: '100%',
								zIndex: 1,
							}}
						/>
					</View>
				)}
			</Portal>

			<Button
				ref={buttonRef}
				onPress={shows}
				style={{
					borderWidth: 1,
					borderRadius: 10,
					borderColor: theme.colors.outlineVariant,
				}}
				contentStyle={{
					flexDirection: 'row-reverse',
					alignItems: 'center',
				}}
				mode="outlined"
				labelStyle={{ fontFamily: 'Inter-Regular', fontSize: 16 }}
				icon={(props) => <ChevronDown size={props.size} color={props.color} />}
			>
				{selectedYear}
			</Button>
		</>
	);
}
