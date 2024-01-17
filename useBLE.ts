/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { BleError, BleManager, Characteristic, Device } from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";
import { useNavigation } from "@react-navigation/native";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  data?: string;
  stopScanDevice?: () => void;
  list_characters: Characteristic[];
  list_des: {
    serviceUUID: string;
  };
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [data, setData] = useState<string>("");
  const [list_characters, setListCharacters] = useState<Characteristic[]>([]);

  const [list_des, setListDes] = useState({
    serviceUUID: "",
  });

  const navigation = useNavigation();

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = async () =>
    bleManager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        Alert.alert(error.message);
      }
      if (device && device.name) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }

          return prevState;
        });
        // if (device?.name === "Find Me") {
        //   setAllDevices((prevState: Device[]) => {
        //     if (!isDuplicteDevice(prevState, device)) {
        //       return [...prevState, device];
        //     }

        //     return prevState;
        //   });
        //   bleManager.stopDeviceScan();
        // }
      }
    });

  const stopScanDevice = () => {
    bleManager.stopDeviceScan();
  };

  const connectToDevice = async (device: Device) => {
    bleManager.stopDeviceScan();
    try {
      setConnectedDevice(device);
      device
        .isConnected()
        .then((isConnected) => {
          return isConnected ? device : device.connect();
        })
        .then((device) => {
          return device.discoverAllServicesAndCharacteristics();
        })
        .then(async (device) => {
          let list_chars: Characteristic[] = [];
          const services = device.services();
          if (services) {
            await Promise.all(
              (
                await services
              ).map(async (service) => {
                const chars = await service.characteristics();
                list_chars = [...list_chars, ...chars];
              })
            );
          }
          navigation.navigate("ListCharacter", {
            list_chars: list_chars,
            device: device,
          });
        })
        .catch((error) => {
          console.log("error-------", error);
          Alert.alert(error.message);
        });
    } catch (err) {
      console.log("err", err);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      console.log("connectedDevice", connectedDevice.id);
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setAllDevices([]);
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    data,
    stopScanDevice,
    list_characters,
    list_des,
  };
}

export default useBLE;
