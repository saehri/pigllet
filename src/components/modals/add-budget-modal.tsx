import { expenseCategories } from '@/constants/expense-category';
import { Cross, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { Dimensions, View, StyleSheet, ScrollView } from 'react-native';
import {
	Button,
	Modal,
	Portal,
	Searchbar,
	Text,
	useTheme,
} from 'react-native-paper';
import TransactionIcons from '../reusables/transaction-icons';

export default function AddBudgetModal() {
	const theme = useTheme();
	const [visible, setVisible] = useState<boolean>(false);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	return (
		<>
			<Portal>
				<Modal visible={visible} onDismiss={hideModal} style={styles.modal}>
					<View
						style={[
							styles.modalContent,
							{
								backgroundColor: theme.colors.background,
								borderColor: theme.colors.outlineVariant,
							},
						]}
					>
						<View
							style={[
								styles.modalHeader,
								{ borderColor: theme.colors.outlineVariant },
							]}
						>
							<Text variant="titleMedium" style={styles.title}>
								Add budget
							</Text>
							<Button onPress={hideModal} compact>
								<X size={20} color={theme.colors.onBackground} />
							</Button>
						</View>

						<ModalContent />
					</View>
				</Modal>
			</Portal>

			<Button onPress={showModal}>
				<Plus strokeWidth={1.5} color={theme.colors.onBackground} size={24} />
			</Button>
		</>
	);
}

function ModalContent() {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const itemToRender = expenseCategories.filter((item) =>
		item.icon.includes(searchQuery.toLocaleLowerCase())
	);

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={styles.searchContainer}
		>
			<View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
				<Searchbar
					mode="bar"
					placeholder="Search"
					value={searchQuery}
					onChangeText={setSearchQuery}
					style={{
						height: 45,
						padding: 0,
					}}
					inputStyle={{
						height: 40,
						padding: 0,
						margin: 0,
						bottom: 6,
					}}
				/>
			</View>

			<View style={{ paddingBottom: 24 }}>
				{itemToRender.length ? (
					itemToRender.map((item) => (
						<View
							key={item.icon}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								gap: 16,
								padding: 16,
							}}
						>
							<TransactionIcons icon={item.icon} />

							<Text variant="bodyLarge" style={{ fontFamily: 'Inter-Regular' }}>
								{item.category}
							</Text>
						</View>
					))
				) : (
					<Text
						variant="bodyLarge"
						style={{ fontFamily: 'Inter-Regular', textAlign: 'center' }}
					>
						No category found.
					</Text>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	modal: {
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(17, 17, 17, .3)',
	},
	modalContent: {
		width: Dimensions.get('screen').width,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		borderWidth: 1,
		borderBottomWidth: 0,
		maxHeight: '95%',
		bottom: -20,
	},
	modalHeader: {
		paddingLeft: 16,
		paddingTop: 12,
		paddingBottom: 8,
		paddingRight: 8,
		borderBottomWidth: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	title: {
		fontFamily: 'Inter-Regular',
	},
	searchContainer: {
		paddingVertical: 16,
	},
});
