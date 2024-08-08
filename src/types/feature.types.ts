export type IAccess = "Free" | "Plus" | "Pro" | "Early Bird" | "Beta Tester";
export type IFeatureConfig = {
  name: string;
  access: IAccess[];
};
export type IStripePlanSettingsConfig = {
  credits: number[];
  plan_enabled: boolean[];
};
