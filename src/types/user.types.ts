import { ICredit, IDBUser } from "@/types/db.schema.types";

export type IPlan = IDBUser["plan"];
export type IRole = IDBUser["role"];

export type ISessionUser = {
  id: number;
};

export type IUserStat = {
  imagesGeneratedByUser: Array<{ count: number }>;
  totalImageGenerated: Array<{ count: number }>;
  likesOnUserContent: Array<{ sum: number }>;
};

export type UserReferralInfoResponse = {
  referredUsers: IDBUser[];
  creditInfo: ICredit;
};
