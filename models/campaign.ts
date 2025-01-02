import { AirdropTaskType, TChain, TokenProtocol } from "@/interfaces/common";
import mongoose from "mongoose";

export interface IAirdropTask {
  task_type: AirdropTaskType;
  task_tg_channel?: string;
  task_website_url?: string;
  task_tg_bot_url?: string;
}

export type ICampaignStatus =
  | "pending"
  | "active"
  | "pause"
  | "inactive"
  | "ended";
export type ITokenPriceSource = "dexscreener" | "jupiter";

export interface ICampaign {
  _id: string;
  serial: number;
  status: ICampaignStatus;
  status_reason?: string;
  owner: string;
  name: string;
  description: string;
  logo_url: string;
  slogans: string[];
  website: string;
  total_airdrops: number;
  remaining_airdrops: number;
  token_amount_per_user: number;
  token_value_per_user: number;
  est_gas_per_user: number;
  // ------token begin------
  token_name: string;
  token_symbol: string;
  token_chain: TChain;
  token_protocol: TokenProtocol;
  token_address: string;
  token_decimals: number;
  initial_token_amount: number;
  token_balance: number;
  gas_balance: number;
  token_airdropped: number;
  gas_used: number;
  commission_token_amount: number;
  // ------token end------
  task?: IAirdropTask;
  all_check_success: boolean;
  token_price_source: ITokenPriceSource;
  price_update_timestamp: number;
  createdAt: Date;
  updatedAt: Date;
}

export const campaignSchema = new mongoose.Schema<ICampaign>(
  {
    serial: { type: Number, required: true },
    status: { type: String, required: true, default: "pending" },
    status_reason: { type: String, default: "" },
    owner: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    logo_url: { type: String, required: true },
    slogans: { type: [String], default: [] },
    website: { type: String, default: "" },
    total_airdrops: { type: Number, required: true },
    remaining_airdrops: { type: Number, default: 0 },
    token_name: { type: String, required: true },
    token_symbol: { type: String, required: true },
    token_chain: { type: String, required: true },
    token_protocol: { type: String, required: true },
    token_address: { type: String, required: true },
    token_decimals: { type: Number, required: true },
    token_balance: { type: Number, default: 0 },
    gas_balance: { type: Number, default: 0 },
    token_airdropped: { type: Number, default: 0 },
    initial_token_amount: { type: Number, default: 0 },
    gas_used: { type: Number, default: 0 },
    commission_token_amount: { type: Number, required: true },
    token_amount_per_user: { type: Number, required: true },
    token_value_per_user: { type: Number, default: 0 },
    est_gas_per_user: { type: Number, required: true },
    task: { type: Object, default: null },
    all_check_success: { type: Boolean, default: false },
    token_price_source: { type: String, required: true },
    price_update_timestamp: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "campaigns",
    toJSON: {
      versionKey: false,
      virtuals: true,
    },
  }
);

campaignSchema.index({ owner: 1 });
campaignSchema.index({ serial: 1 }, { unique: true });
campaignSchema.index({ token_value_per_user: 1 });
campaignSchema.index({ status: 1 });

export const CampaignModel =
  mongoose.connection.useDb("campaign").models.CampaignModel ||
  mongoose.connection.useDb("campaign").model("CampaignModel", campaignSchema);
