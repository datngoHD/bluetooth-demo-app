import React, { useEffect } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  SectionList,
} from "react-native";
import useBLE from "./useBLE";
import { useNavigation } from "@react-navigation/native";
import { Characteristic, Descriptor, Device } from "react-native-ble-plx";

interface IProps {
  route: any;
  list_chars: Characteristic;
  device: Device;
}

const ListCharacter = (props: IProps) => {
  const { list_chars, device } = props.route?.params;
  const navigation = useNavigation();
  const { connectToDevice } = useBLE();

  const goToDeviceConnect = (item: Descriptor) => {
    navigation.navigate("DeviceConnect", {
      list_chars: list_chars,
      uuid: item.uuid,
      device: device,
    });
  };

  const data = list_chars;

  useEffect(() => {
    if (device) connectToDevice(device);
  }, []);

  const groupedData = data.reduce((acc: any, currentItem: Characteristic) => {
    const { serviceUUID } = currentItem;
    if (!acc.has(serviceUUID)) {
      acc.set(serviceUUID, []);
    }
    acc.get(serviceUUID).push(currentItem);
    return acc;
  }, new Map());

  const groupedArray = Array.from(groupedData, ([title, data]) => ({
    title,
    data,
  }));

  const renderDeviceModalListItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => goToDeviceConnect(item)}
        style={styles.ctaButton}
      >
        <Text>characteristic UUID: </Text>
        <Text style={styles.ctaButtonText}>{item.uuid}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {groupedArray.length > 0 && (
        <SectionList
          sections={groupedArray}
          keyExtractor={(item, index) => item.id}
          renderItem={renderDeviceModalListItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>Service UUID: {title}</Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    marginHorizontal: 16,
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#f2f2f2",
    // justifyContent: "center",
    // alignItems: "center",
    height: 70,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
    borderBottomWidth: 1,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
  },
});

export default ListCharacter;
