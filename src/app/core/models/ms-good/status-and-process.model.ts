export interface IGoodStatusProcess {
  goodNumber: number;
  status: string;
  process: string;
}

export interface IGoodScreenACtionStatusProcess extends IGoodStatusProcess {
  screenKey: string;
  action: string;
  user: string;
}

export interface IGoodStatusFinalProcess {
  statusFinal: string;
  process: string;
}
