export enum FILE_UPLOAD_STATUSES {
  PENDING = '',
  LOADING = 'info',
  SUCCESS = 'success',
  FAILED = 'danger',
}
export class FileUploadEvent {
  progress: number = 0;
  loading: boolean = false;
  status: FILE_UPLOAD_STATUSES = FILE_UPLOAD_STATUSES.PENDING;
  constructor(public readonly file: File) {}
}
