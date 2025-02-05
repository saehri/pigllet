import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
	text: string;
	onPress: () => void;
	type: 'main' | 'secondary';
}

export default function CustomButton(props: ButtonProps) {
	const styleMain = {
		to: 'py-2 rounded-lg items-center border bg-[#FF4863] border-[#FF6A83]',
		text: 'text-lg tracking-tight text-white',
	};
	const styleSecondary = {
		to: 'py-2 rounded-lg items-center border bg-slate-100 border-slate-300',
		text: 'text-lg tracking-tight text-slate-900',
	};

	return (
		<TouchableOpacity
			className={props.type === 'main' ? styleMain.to : styleSecondary.to}
			{...props}
		>
			<Text
				style={{ fontFamily: 'Geist-Regular' }}
				className={props.type === 'main' ? styleMain.text : styleSecondary.text}
			>
				{props.text}
			</Text>
		</TouchableOpacity>
	);
}
