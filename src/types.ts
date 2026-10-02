export type RouterId = 'huawei-claro' | 'tp-link' | 'movistar-hgu';

export interface WiFiBandConfig {
  enabled: boolean;
  ssid: string;
  hideSsid: boolean;
  securityMode: 'WPA2-PSK' | 'WPA2/WPA3-Personal' | 'WPA3-SAE' | 'Open';
  encryption: 'AES' | 'TKIP+AES';
  password: string;
  channel: string;
  channelWidth: string;
  transmitPower?: string;
}

export interface MacFilterRule {
  id: string;
  mac: string;
  description: string;
  enabled: boolean;
}

export interface MacFilterConfig {
  enabled: boolean;
  mode: 'whitelist' | 'blacklist';
  rules: MacFilterRule[];
}

export interface RouterConfig {
  id: RouterId;
  name: string;
  model: string;
  brand: string;
  isp: string;
  gatewayIp: string;
  subnetMask: string;
  defaultUsername: string;
  defaultPasswordHint: string;
  firmwareVersion: string;
  hardwareVersion: string;
  serialNumber: string;
  macAddress: string;
  dualBandCombined: boolean;
  wifi24: WiFiBandConfig;
  wifi5: WiFiBandConfig;
  macFilter: MacFilterConfig;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  ip: string;
  mac: string;
  band: '2.4GHz' | '5GHz';
  signal: number; // percentage
  status: 'online' | 'idle';
}
