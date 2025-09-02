import { icons } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import { ComponentProps, Dispatch, memo, SetStateAction } from 'react';

import { iconsUserCanPick } from '@/constants/icons';

import LucideIcons from '../reusables/lucide-icons';

type Props = {
	selectedIconName: string;
	setIcon: Dispatch<SetStateAction<string>>;
};

function IconSelector({ selectedIconName, setIcon }: Props) {
	const theme = useTheme();

	return (
		<View
			style={{
				padding: 16,
				backgroundColor: theme.colors.surfaceVariant,
				height: 264,
				borderRadius: 16,
				gap: 16,
			}}
		>
			<FlatList
				data={iconsUserCanPick}
				contentContainerStyle={{
					flexDirection: 'row',
					flexWrap: 'wrap',
					gap: 8,
				}}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<IconButton
						key={item.key}
						name={item.key as keyof typeof icons}
						selectedIconName={selectedIconName}
						color={theme.colors.onSurface}
						size={20}
						setIcon={setIcon}
					/>
				)}
			/>
		</View>
	);
}

interface IconButtonProps extends ComponentProps<typeof LucideIcons> {
	selectedIconName: string;
	setIcon: Dispatch<SetStateAction<string>>;
}

function IconButton({
	selectedIconName,
	name,
	color,
	size,
	setIcon,
}: IconButtonProps) {
	const theme = useTheme();

	const itemPerRow = 6;
	const gapBetweenItem = 7;
	const screenHorizontalPadding = 16 * 4;
	const buttonBorderSize = 1;
	const iconButtonSize =
		(Dimensions.get('screen').width -
			screenHorizontalPadding -
			itemPerRow * buttonBorderSize -
			gapBetweenItem * (itemPerRow - 1)) /
		itemPerRow;

	const isSelected = selectedIconName === name;

	return (
		<Pressable
			onPress={() => setIcon(name)}
			style={{
				width: iconButtonSize,
				height: iconButtonSize,
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: 6,
				backgroundColor: isSelected
					? theme.colors.tertiaryContainer
					: theme.colors.elevation.level1,
				borderWidth: 1,
				borderColor: isSelected
					? theme.colors.tertiary
					: theme.colors.elevation.level0,
			}}
		>
			<LucideIcons
				name={name as keyof typeof icons}
				color={color}
				size={size}
			/>
		</Pressable>
	);
}

export default memo(IconSelector);

