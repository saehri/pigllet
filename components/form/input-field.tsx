import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { InputFieldProps } from '@/types/type';

export default function InputField(props: InputFieldProps) {
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View className="gap-2">
					<Text className={`text-slate-900 tracking-tight ${props.labelStyle}`}>
						{props.label}
					</Text>

					<TextInput
						className={`bg-white border border-red-100 rounded-xl text-base px-4 h-12 ${props.inputStyle}`}
						secureTextEntry={props.secureTextEntry}
						{...props}
					/>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
