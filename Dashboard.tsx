import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useBLE from "./useBLE";

const Dashboard = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    disconnectFromDevice,
    stopScanDevice,
  } = useBLE();

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const renderDeviceModalListItem = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() => connectToDevice(item.item)}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>{item.item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {allDevices.length > 0 && (
          <FlatList
            contentContainerStyle={styles.modalFlatlistContiner}
            data={allDevices}
            renderItem={renderDeviceModalListItem}
          />
        )}
      </View>

      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <TouchableOpacity onPress={scanForDevices} style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Scan Device</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={stopScanDevice} style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Stop Scan Device</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={disconnectFromDevice}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>Disconnect From Device</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Dashboard;
