export interface UploadResultItem {
  ExtName: string;
  FileSize: number;
  NewName: string;
  OriginalName: string;
}

export interface UploadApiResult {
  Msg: string;
  Code: number;
  Result: UploadResultItem[];
  url: string;
}
