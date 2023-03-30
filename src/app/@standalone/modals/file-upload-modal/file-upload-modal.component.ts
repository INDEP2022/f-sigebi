import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { IUploadEvent } from 'src/app/utils/file-upload/components/file-upload.component';
import { FileUploadModule } from 'src/app/utils/file-upload/file-upload.module';
import {
  FileUploadEvent,
  FILE_UPLOAD_STATUSES,
} from 'src/app/utils/file-upload/interfaces/file-event';

@Component({
  selector: 'app-file-upload-modal',
  standalone: true,
  imports: [CommonModule, FileUploadModule, SharedModule],
  templateUrl: './file-upload-modal.component.html',
  styles: [],
})
export class FileUploadModalComponent implements OnInit {
  accept: string = '*';
  folio: number | string = '3429238';
  refresh: boolean = false;
  constructor(
    private fileBrowserService: FileBrowserService,
    private modalRef: BsModalRef
  ) {}

  ngOnInit(): void {}

  testFiles(uploadEvent: IUploadEvent) {
    const { index, fileEvents } = uploadEvent;
    if (index) {
      this.uploadFile(fileEvents[index]);
    } else {
      fileEvents.forEach(fileEvent => {
        this.uploadFile(fileEvent);
      });
    }
  }

  uploadFile(fileEvent: FileUploadEvent) {
    fileEvent.status = FILE_UPLOAD_STATUSES.LOADING;
    this.fileBrowserService
      .uploadFileByFolio(this.folio, fileEvent.file)
      .subscribe({
        next: response => {
          if (response.type === HttpEventType.UploadProgress) {
            fileEvent.progress = Math.round(
              (100 * response.loaded) / response.total
            );
          }
        },
        error: error => {
          fileEvent.status = FILE_UPLOAD_STATUSES.FAILED;
        },
        complete: () => {
          fileEvent.status = FILE_UPLOAD_STATUSES.SUCCESS;
          this.refresh = true;
        },
      });
  }

  close() {
    this.modalRef.content.callback(this.refresh);
    this.modalRef.hide();
  }
}
