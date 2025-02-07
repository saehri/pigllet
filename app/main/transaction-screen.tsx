import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { BackHandler, ScrollView, View } from 'react-native';
import {
	Appbar,
	Chip,
	SegmentedButtons,
	Surface,
	Text,
} from 'react-native-paper';

export default function SubscriptionScreen(props: any) {
	const [value, setValue] = useState('expense');

	useEffect(() => {
		const backAction = () => {
			props.jumpTo('home');
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, []);

	return (
		<View>
			<Appbar.Header>
				<Appbar.Content
					title="Transactions"
					titleStyle={{ fontWeight: 'bold' }}
				/>

				<Appbar.Action icon="plus" onPress={() => {}} />
				<Appbar.Action icon="calendar" onPress={() => {}} />
				<Appbar.Action
					icon="cog-outline"
					onPress={() => router.push('/setting-screen')}
				/>
			</Appbar.Header>

			<View style={{ paddingHorizontal: 16 }}>
				{/* <ScrollView
					showsHorizontalScrollIndicator={false}
					horizontal
					style={{ marginBottom: 24 }}
				>
					<View style={{ gap: 6, flexDirection: 'row' }}>
						<Chip style={{ borderRadius: 100 }}>Daily</Chip>
						<Chip style={{ borderRadius: 100 }}>Weekly</Chip>
						<Chip style={{ borderRadius: 100 }}>Monthly</Chip>
						<Chip style={{ borderRadius: 100 }}>Yearly</Chip>
					</View>
				</ScrollView> */}

				<SegmentedButtons
					value={value}
					onValueChange={setValue}
					buttons={[
						{
							icon: 'arrow-top-right-thin',
							value: 'expense',
							label: 'Expense',
						},
						{
							icon: 'arrow-bottom-left-thin',
							value: 'income',
							label: 'Income',
						},
						{ icon: 'bank-transfer', value: 'transfer', label: 'Transfer' },
					]}
				/>

				<Surface
					mode="flat"
					elevation={2}
					style={{
						borderRadius: 16,
						padding: 16,
					}}
				>
					<Text>Hello</Text>
				</Surface>
			</View>
		</View>
	);
}
