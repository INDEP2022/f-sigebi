import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
export class FileUploadModalComponent extends BasePage implements OnInit {
  accept: string = '*';
  folio: number | string = '3429238';
  refresh: boolean = false;
  successCount: number = 0;
  totalDocs: number = 0;
  constructor(
    private fileBrowserService: FileBrowserService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {}

  testFiles(uploadEvent: IUploadEvent) {
    const { index, fileEvents } = uploadEvent;
    this.totalDocs = fileEvents.length;
    if (index) {
      this.uploadFile(fileEvents[index], uploadEvent);
    } else {
      fileEvents.forEach(fileEvent => {
        this.uploadFile(fileEvent, uploadEvent);
      });
    }
  }

  uploadFile(fileEvent: FileUploadEvent, uploadEvent: IUploadEvent) {
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
          console.log(fileEvent.progress);
          if (fileEvent.progress == 100) {
            this.successCount = +1;
          }
        },
        error: error => {
          fileEvent.status = FILE_UPLOAD_STATUSES.FAILED;
        },
        complete: async () => {
          fileEvent.status = FILE_UPLOAD_STATUSES.SUCCESS;
          this.refresh = true;
          const result = await this.alertQuestion(
            'question',
            'Archivos cargados correctamente',
            '¿Desea subir mas archivos?'
          );

          if (!result.isConfirmed) {
            this.close();
          }
          if (result.isConfirmed) {
            this.totalDocs = 0;
            this.successCount = 0;
            uploadEvent.fileEvents.length = 0;
          }
        },
      });
  }

  close() {
    this.modalRef.content.callback(this.refresh);
    this.modalRef.hide();
  }
}
