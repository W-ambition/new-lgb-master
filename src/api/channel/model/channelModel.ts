export interface GetPartnerDicParams {
  PartnerName?: string;
  PId?: number;
  Provinces?: number[];
  Citys?: number[];
  Areas?: number[];
}

export interface GetPartnerDicModel {
  PId: number;
  ParentNodeId: number;
  PartnerName: string;
  NodeLevel: number;
}
