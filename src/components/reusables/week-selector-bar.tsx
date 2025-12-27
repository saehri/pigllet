import { memo, useState } from "react";
import moment from "moment";
import { View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SlidersHorizontalIcon,
} from "lucide-react-native";
import SettingContentWrapper from "../settings/setting-content-wrapper";
import SettingContentButton from "../settings/setting-content-button";
import { getCardPosition } from "@/utils/utils";

type Props = {
  selectedDate: Date;
  onNext: () => void;
  onPrev: () => void;
};

const timePeriods: { label: string; value: string }[] = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

function WeekSelectorBar({ selectedDate, onNext, onPrev }: Props) {
  const theme = useTheme();

  const dateDisplay = `${moment(selectedDate).startOf("week").format("MMM, D")} - ${moment(selectedDate).endOf("week").format("MMM D, YY")}`;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        height: 40,
      }}
    >
      <Text
        style={{
          fontFamily: "GSans",
          lineHeight: 19,
          fontSize: 19,
          marginTop: 8,
        }}
      >
        {dateDisplay}
      </Text>

      <View style={{ flexDirection: "row", gap: 2 }}>
        <TimePeriodSelector />

        <IconButton
          mode="contained-tonal"
          onPress={onPrev}
          icon={(props) => (
            <ChevronLeftIcon
              size={props.size}
              strokeWidth={1.5}
              color={props.color}
            />
          )}
          style={{
            margin: 0,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
          }}
        />

        <IconButton
          mode="contained-tonal"
          onPress={onNext}
          icon={(props) => (
            <ChevronRightIcon
              size={props.size}
              strokeWidth={1.5}
              color={props.color}
            />
          )}
          style={{
            margin: 0,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
          }}
        />
      </View>
    </View>
  );
}

export default memo(WeekSelectorBar);

function TimePeriodSelector() {
  const theme = useTheme();

  const [visible, setVisible] = useState(false);

  const openDialog = () => setVisible(true);
  const closeDialog = () => setVisible(false);

  const RightButton = ({ selected }: { selected: boolean }) => (
    <View>
      <CheckIcon
        style={{ display: selected ? "flex" : "none" }}
        size={20}
        color={theme.colors.onSurface}
      />
    </View>
  );

  return (
    <>
      <Portal>
        <Dialog visible={visible} onDismiss={closeDialog}>
          <Dialog.Content style={{ gap: 2 }}>
            {timePeriods.map((timeP, index) => (
              <SettingContentButton
                position={getCardPosition(index, timePeriods.length)}
                label={timeP.label}
                key={timeP.value}
                higlight={"week" === timeP.value}
                buttonRight={<RightButton selected={"week" === timeP.value} />}
                customInactiveColor={theme.colors.elevation.level5}
              />
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>

      <Button
        compact
        onPress={openDialog}
        contentStyle={{
          flexDirection: "row-reverse",
          paddingHorizontal: 4,
        }}
        mode="contained-tonal"
        labelStyle={{
          fontFamily: "GSans",
        }}
        icon={(props) => (
          <SlidersHorizontalIcon
            strokeWidth={1.5}
            color={props.color}
            size={props.size}
          />
        )}
      >
        Week
      </Button>
    </>
  );
}
