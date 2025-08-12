import { icons } from 'lucide-react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import {
	ComponentProps,
	Dispatch,
	memo,
	SetStateAction,
	useRef,
	useState,
} from 'react';
import Fuse from 'fuse.js';

import { iconsUserCanPick } from '@/constants/icons';

import { Dimensions, Pressable, View } from 'react-native';

import LucideIcons from '../reusables/lucide-icons';
import { ScrollView } from 'react-native-gesture-handler';

const fuse = new Fuse(iconsUserCanPick, {
	keys: ['key', 'tag'],
	threshold: 0.3,
	ignoreLocation: true,
});

type Props = {
	selectedIconName: string;
	setIcon: Dispatch<SetStateAction<string>>;
};

function IconSelector({ selectedIconName, setIcon }: Props) {
	const theme = useTheme();

	const [query, setQuery] = useState('');
	const [results, setResults] = useState(iconsUserCanPick);
	const searchTimeout = useRef(null); // store timeout ID

	// Memoized debounce function so it’s not recreated on every render
	const onChangeSearch = (text: string) => {
		setQuery(text);
		if (!text) {
			setResults(iconsUserCanPick); // reset if empty
		} else {
			const fuseResults = fuse.search(text);
			setResults(fuseResults.map((result) => result.item));
		}
	};

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
			<Searchbar
				placeholder="Search by name or tag..."
				onChangeText={onChangeSearch}
				value={query}
				style={{ borderRadius: 6 }}
			/>

			<ScrollView
				contentContainerStyle={{
					flexDirection: 'row',
					flexWrap: 'wrap',
					gap: 8,
				}}
				showsVerticalScrollIndicator={false}
			>
				{results.map((icon) => (
					<IconButton
						key={icon.key}
						name={icon.key as keyof typeof icons}
						selectedIconName={selectedIconName}
						color={theme.colors.onSurface}
						size={20}
						setIcon={setIcon}
					/>
				))}
			</ScrollView>

			{/* <FlatList
				data={results}
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
			/> */}
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
					: theme.colors.elevation.level5,
				borderWidth: 1,
				borderColor: isSelected
					? theme.colors.tertiary
					: theme.colors.elevation.level5,
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

