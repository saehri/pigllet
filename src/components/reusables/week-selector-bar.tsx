import { memo, useState } from "react";
import moment from "moment";
import { View } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
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
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
  { label: "Yearly", value: "year" },
];

function WeekSelectorBar({ selectedDate, onNext, onPrev }: Props) {
  const theme = useTheme();

  const dateDisplay = `${moment(selectedDate).startOf("week").format("MMM, D")} - ${moment(selectedDate).endOf("week").format("MMM D, YY")}`;

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 40,
        marginBottom: 16,
        flex: 1,
      }}
    >
      <Text style={{ fontFamily: "Manrope-Medium", fontSize: 18 }}>
        {dateDisplay}
      </Text>

      <View style={{ flexDirection: "row", gap: 2 }}>
        <TimePeriodSelector />

        <Button
          compact
          contentStyle={{ height: 40 }}
          style={{
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
            backgroundColor: theme.colors.elevation.level2,
          }}
          onPress={onPrev}
        >
          <ChevronLeftIcon
            size={20}
            strokeWidth={1.5}
            color={theme.colors.onSurface}
          />
        </Button>
        <Button
          compact
          contentStyle={{ height: 40 }}
          style={{
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
            backgroundColor: theme.colors.elevation.level2,
          }}
          onPress={onNext}
        >
          <ChevronRightIcon
            size={20}
            strokeWidth={1.5}
            color={theme.colors.onSurface}
          />
        </Button>
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
          height: 40,
          flexDirection: "row-reverse",
          paddingHorizontal: 4,
        }}
        mode="contained"
        labelStyle={{
          color: theme.colors.onSurface,
          fontFamily: "Manrope-Regular",
        }}
        icon={(props) => (
          <SlidersHorizontalIcon
            strokeWidth={1.5}
            color={props.color}
            size={props.size}
          />
        )}
      >
        Weekly
      </Button>
    </>
  );
}
