import { View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Appbar, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import { useSelectedCategory } from '@/store/useSelectedCategory';

import CategoryListHeader from '@/src/components/reusables/category-list-header';

export default function Layout() {
	const theme = useTheme();
	const selectedCategories = useSelectedCategory((s) => s.selectedCategories);

	return (
		<View style={{ flex: 1 }}>
			<LinearGradient
				colors={[theme.colors.background, 'transparent']}
				start={{ x: 0.5, y: 0.5 }}
				end={{ x: 0.5, y: 1 }}
				style={{
					position: 'absolute',
					top: 63,
					zIndex: 1,
					left: 0,
					width: '100%',
					height: 50,
					display: selectedCategories.length ? 'none' : 'flex',
				}}
			/>

			<AppHeader categoryOverlayActive={Boolean(selectedCategories.length)} />

			<Tabs
				initialRouteName="expense"
				screenOptions={{
					tabBarActiveTintColor: theme.colors.onPrimary,
					tabBarActiveBackgroundColor: theme.colors.primary,
					tabBarInactiveBackgroundColor: theme.colors.elevation.level3,
					tabBarInactiveTintColor: theme.colors.onSurface,
					tabBarStyle: {
						position: 'absolute',
						backgroundColor: 'rgba(0,0,0,0)',
						top: 4,
						borderTopWidth: 0,
						marginHorizontal: 16,
						elevation: 0,
						shadowOpacity: 0,
						gap: 12,
						borderRadius: 8,
						height: 40,
						display: selectedCategories.length ? 'none' : 'flex',
						zIndex: 10,
					},
					tabBarLabelStyle: {
						fontFamily: 'Manrope-Medium',
						fontSize: 14,
						textTransform: 'capitalize',
					},
					tabBarItemStyle: {
						overflow: 'hidden',
						borderRadius: 12,
						height: 40,
					},
					sceneStyle: {
						backgroundColor: theme.colors.background,
					},
					tabBarLabelPosition: 'beside-icon',
					tabBarIconStyle: {
						display: 'none',
					},
					headerShown: false,
				}}
			>
				<Tabs.Screen name="expense" />
				<Tabs.Screen name="income" />
				<Tabs.Screen name="transfer" />
			</Tabs>
		</View>
	);
}

type AppHeaderProps = {
	categoryOverlayActive: boolean;
};

function AppHeader({ categoryOverlayActive }: AppHeaderProps) {
	const theme = useTheme();
	const router = useRouter();

	const headerOverlayContent = () => {
		if (categoryOverlayActive) {
			return (
				<View
					style={{
						zIndex: 12,
						paddingHorizontal: 16,
						backgroundColor: theme.colors.background,
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-end',
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
					}}
				>
					<CategoryListHeader />
				</View>
			);
		}
	};

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
			}}
		>
			<Appbar.Header
				style={{
					backgroundColor: theme.colors.background,
					zIndex: 10,
				}}
			>
				<Appbar.BackAction onPress={() => router.back()} />
				<Appbar.Content
					title="Transaction category"
					titleStyle={{ fontFamily: 'Manrope-Medium', fontSize: 20 }}
				/>
			</Appbar.Header>

			{headerOverlayContent()}
		</View>
	);
}

