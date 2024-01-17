import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import base64 from "react-native-base64";
import { Characteristic, Device } from "react-native-ble-plx";

const DeviceConnect = (props: any) => {
  const { list_chars, uuid, device } = props.route?.params;
  const [char, setChart] = useState<Characteristic>();
  const [data, setData] = useState<string>("");
  const [text, onChangeText] = React.useState("");

  useEffect(() => {
    let findChart = list_chars.find(
      (item: { uuid: any }) => item.uuid === uuid
    );
    if (findChart) {
      setChart(findChart);
    } else {
      console.log("error+=======");
    }
  }, [list_chars, uuid]);

  useEffect(() => {
    if (char) handleReadChar(device);
  }, [char]);

  const handleReadChar = (device: Device) => {
    if (char) {
      device
        .isConnected()
        .then((isConnected) => {
          return isConnected ? device : device.connect();
        })
        .then((d) => {
          return d.discoverAllServicesAndCharacteristics();
        })
        .then(async (d) => {
          const data = await d.readCharacteristicForService(
            char.serviceUUID,
            char.uuid
          );
          char.monitor((err, data) => {
            if (data?.value) {
              const rawData = base64.decode(data.value || "");
              setData(rawData);
            }
          });
          if (data) {
            const rawData = base64.decode(data.value || "");
            setData(rawData);
          }
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    }
  };

  const handleWriteToDevice = async (text: string, device: Device) => {
    if (!char) return undefined;
    device
      .isConnected()
      .then((isConnected) => {
        return isConnected ? device : device.connect();
      })
      .then((d) => {
        return d.discoverAllServicesAndCharacteristics();
      })
      .then(async (d) => {
        d.writeCharacteristicWithoutResponseForService(
          char.serviceUUID,
          char.uuid,
          base64.encode(text)
        );
        const data = await d.readCharacteristicForService(
          char.serviceUUID,
          char.uuid
        );
        if (data) {
          const rawData = base64.decode(data.value || "");
          setData(rawData);
          onChangeText('')
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <SafeAreaView style={modalStyle.modalTitle}>
      <Text style={modalStyle.modalTitleText}>Data Device</Text>
      <Text style={modalStyle.modalTitleText}>{data}</Text>
      <TextInput
        style={modalStyle.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Useless Text"
      />
      <TouchableOpacity
        onPress={() => handleWriteToDevice(text, device)}
        style={{
          backgroundColor: "#FF6060",
          justifyContent: "center",
          alignItems: "center",
          height: 50,
          marginHorizontal: 20,
          marginTop: 20,
          borderRadius: 8,
          width: 200,
        }}
      >
        <Text style={modalStyle.ctaButtonText}>Write</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: "center",
  },
  modalCellOutline: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalTitle: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center",
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

export default DeviceConnect;
