import { IFeatureConfig, IStripePlanSettingsConfig } from "./feature.types";
import { IApplicationAccessConfig } from "./global.types";

export type IModelSettings = {
  defaultPrompt: string;
  defaultNegativePrompt: string;
  defaultGVPrompt: string;
  defaultGVNegativePrompt: string;
  defaultDallEPrompt: string;
  defaultDallENegativePrompt: string;
  primaryCheckpoint: string;
  models: {
    label: string;
    name: string;
  }[];
  methods: {
    label: string;
    name: string;
  }[];
  size: {
    height: "string";
    width: "string";
  };
};

export type SetCommandOptions =
  | {
      ex?: number;
      get?: boolean;
      nx?: boolean;
    }
  | undefined;

export type IVercelKVKey =
  | "kv-model-settings"
  | "user-settings"
  | "primary-checkpoints"
  | "model-endpoints"
  | "sampling-methods"
  | "stripe-plans-access"
  | "app-features"
  | "stripe-plans-settings"
  | "application-access"
  | "application-users"
  | "credit-value"
  | "keyfile"
  | "gcloud-token";

export const KV_KEYS: Record<IVercelKVKey, IVercelKVKey> = {
  "kv-model-settings": "kv-model-settings",
  "user-settings": "user-settings",
  "primary-checkpoints": "primary-checkpoints",
  "model-endpoints": "model-endpoints",
  "sampling-methods": "sampling-methods",
  "stripe-plans-access": "stripe-plans-access",
  "app-features": "app-features",
  "stripe-plans-settings": "stripe-plans-settings",
  "application-access": "application-access",
  "application-users": "application-users",
  "credit-value": "credit-value",
  keyfile: "keyfile",
  "gcloud-token": "gcloud-token",
};

type IKVAdminSettings = {
  key: "kv-model-settings";
  value: IModelSettings;
};
type IKVModelEndpoints = {
  key: "model-endpoints";
  value: Record<string, string>;
};
type IKVUserSettings = {
  key: "user-settings";
  value: {
    user_setting_a: string;
    user_setting_b: string;
  };
};
type IKVPrimaryCheckpoints = {
  key: "primary-checkpoints";
  value: string[];
};
type IKVStripePlansAccess = {
  key: "stripe-plans-access";
  value: IFeatureConfig[];
};
type IKVAppFeatures = {
  key: "app-features";
  value: string[];
};
type IKVStripePlanSettings = {
  key: "stripe-plans-settings";
  value: IStripePlanSettingsConfig;
};
type IKVApplicationUsers = {
  key: "application-users";
  value: string[];
};
type IKVApplicationAccess = {
  key: "application-access";
  value: IApplicationAccessConfig[];
};
type IKVCreditValue = {
  key: "credit-value";
  value: number;
};
type IKVKeyfile = {
  key: "keyfile";
  value: string;
};
type IKVGcloudToken = {
  key: "gcloud-token";
  value: string;
};
export type IKVStoreData =
  | IKVAdminSettings
  | IKVUserSettings
  | IKVPrimaryCheckpoints
  | IKVModelEndpoints
  | IKVStripePlansAccess
  | IKVAppFeatures
  | IKVStripePlanSettings
  | IKVApplicationAccess
  | IKVApplicationUsers
  | IKVCreditValue
  | IKVKeyfile
  | IKVGcloudToken;

export type IVercelKVStore = {
  modelSettings: IModelSettings | undefined;
  setModelSettings: (val: IModelSettings) => void;
};
