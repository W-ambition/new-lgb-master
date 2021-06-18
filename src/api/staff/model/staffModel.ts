export interface userItem {
  UserId: string;
  UserName: string;
  ActualName: string;
  UserType: number;
}

export interface GetUserDicParams {
  UserId?: string;
  UserName?: string;
}
