import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { ChartData } from '@/types/type';
import { Dispatch, SetStateAction, useState } from 'react';

interface LineChartsProps {
	data: ChartData;
	currentDate: Date;
}

const CHART_HEIGHT = 175;

export default function LineCharts({ data, currentDate }: LineChartsProps) {
	const datasets = data.datasets[0].data.map((data) => data / 1000); // normalize the data by a thousand

	const CHART_WIDTH = Dimensions.get('window').width * (data.labels.length / 8);

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			className="mb-8"
		>
			<View>
				<LineChart
					style={{
						marginLeft: -40,
					}}
					data={{
						labels: data.labels,
						datasets: [{ data: datasets }],
					}}
					width={CHART_WIDTH} // from react-native
					height={CHART_HEIGHT}
					withHorizontalLines={false}
					withVerticalLines={false}
					withHorizontalLabels={false}
					// withVerticalLabels={false}
					yAxisInterval={2}
					// withDots={false}
					fromZero // optional, defaults to 1
					chartConfig={{
						backgroundColor: '#fff',
						backgroundGradientFrom: '#fff',
						backgroundGradientTo: '#fff',
						decimalPlaces: 2, // optional, defaults to 2dp
						color: (opacity = 1) => `rgba(255, 76, 102, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(17, 17, 17, ${opacity})`,
						propsForDots: {
							r: '2',
							strokeWidth: '2',
							stroke: '#fff',
						},
					}}
					renderDotContent={({ x, y, index, indexData }) => (
						<FloatingLabel
							key={index}
							x={x}
							y={y}
							index={index}
							indexData={indexData}
							selectedIndex={currentDate.getDate() - 1}
						/>
					)}
					bezier
				/>
			</View>
		</ScrollView>
	);
}

interface FloatingLabel {
	index: number;
	indexData: number;
	y: number;
	x: number;
	selectedIndex: number;
}

function FloatingLabel({
	index,
	indexData,
	x,
	y,
	selectedIndex,
}: FloatingLabel) {
	const dotDimension = 14;

	return (
		<>
			<View
				style={{
					position: 'absolute',
					width: dotDimension,
					height: dotDimension,
					top: y - CHART_HEIGHT - dotDimension / 2,
					left: x - dotDimension / 2,
				}}
				className="bg-[#FF4863] rounded-full border-2 border-white overflow-visible"
			></View>

			{selectedIndex === index && (
				<Text
					style={{
						top: y - CHART_HEIGHT,
						left: x + dotDimension / 2,
					}}
					className="absolute z-20 text-sm px-2 bg-white text-slate-900 border border-red-100 rounded-tr-md rounded-br-md rounded-bl-xl shadow-xl"
				>
					- Rp {(indexData * 1000).toLocaleString('id-ID')}
				</Text>
			)}
		</>
	);
}
