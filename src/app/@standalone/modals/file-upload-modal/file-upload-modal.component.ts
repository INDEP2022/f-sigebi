import { CommonModule } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  catchError,
  concat,
  debounceTime,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';
import { IUploadEvent } from 'src/app/utils/file-upload/components/file-upload.component';
import { FileUploadModule } from 'src/app/utils/file-upload/file-upload.module';
import {
  FileUploadEvent,
  FILE_UPLOAD_STATUSES,
} from 'src/app/utils/file-upload/interfaces/file-event';

export interface IServiceUpload {
  [others: string]: any;
  uploadFile(
    campo: any,
    file: File,
    fileField: string
  ): Observable<HttpEvent<unknown>>;
}

@Component({
  selector: 'app-file-upload-modal',
  standalone: true,
  imports: [CommonModule, FileUploadModule, SharedModule],
  templateUrl: './file-upload-modal.component.html',
  styles: [],
})
export class FileUploadModalComponent extends BasePage implements OnInit {
  accept: string = '*';
  identificator: any = '3429238';
  uploadFiles = true;
  refresh: boolean = false;
  successCount: number = 0;
  totalDocs: number = 0;
  multiple = true;
  fileEvents: FileUploadEvent[];
  info = `Haz clic para seleccionar las imágenes o arrástralas
      aquí`;
  titleFinishUpload = 'Archivos cargados correctamente';
  questionFinishUpload = '¿Desea subir más archivos?';
  service: IServiceUpload = inject(FileBrowserService);
  constructor(
    private modalRef: BsModalRef,
    private _blockErrors: showHideErrorInterceptorService
  ) {
    super();
  }

  ngOnInit(): void {}

  testFiles(uploadEvent: IUploadEvent) {
    const { index, fileEvents } = uploadEvent;
    console.log(uploadEvent);
    this.fileEvents = fileEvents;
    this.totalDocs = fileEvents.length;
    if (index) {
      this.uploadFile(fileEvents[index], uploadEvent);
    } else {
      const obs = fileEvents.map((fileEvent, index) =>
        this.uploadFile(fileEvent, uploadEvent, index).pipe(debounceTime(1000))
      );
      this.loading = true;
      concat(...obs).subscribe({
        error: error => {
          this.loading = false;
        },
        complete: async () => {
          this.loading = false;
          const result = await this.alertQuestion(
            'question',
            'Archivos cargados correctamente',
            '¿Desea subir más archivos?'
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
  }

  uploadFile(
    fileEvent: FileUploadEvent,
    uploadEvent: IUploadEvent,
    consecNumber = 0
  ) {
    fileEvent.status = FILE_UPLOAD_STATUSES.LOADING;
    // if (!this.uploadFiles) {
    //   setTimeout(async () => {
    //     await this.finishUpload(fileEvent, uploadEvent);
    //   }, 500);
    // }
    // console.log(index);
    this._blockErrors.blockAllErrors = true;
    this.service.uploadFile(this.identificator, fileEvent.file, 'file').pipe(
      catchError(error => {
        this.alert('error', 'Error', 'Ocurrió un error al subir el documento');
        fileEvent.status = FILE_UPLOAD_STATUSES.FAILED;
        return throwError(() => error);
      }),
      tap(response => {
        if (response.type === HttpEventType.UploadProgress) {
          fileEvent.progress = Math.round(
            (100 * response.loaded) / response.total
          );
        }
        console.log(fileEvent.progress);
        if (fileEvent.progress == 100) {
          this.successCount = +1;
        }
        fileEvent.status = FILE_UPLOAD_STATUSES.SUCCESS;
        this.refresh = true;
      })
    );
  }

  // private async finishUpload(
  //   fileEvent: FileUploadEvent,
  //   uploadEvent: IUploadEvent
  // ) {
  //   fileEvent.status = FILE_UPLOAD_STATUSES.SUCCESS;
  //   this.refresh = true;
  //   const result = await this.alertQuestion(
  //     'question',
  //     this.titleFinishUpload,
  //     this.questionFinishUpload
  //   );

  //   if (!result.isConfirmed) {
  //     this.close();
  //   }
  //   if (result.isConfirmed) {
  //     this.totalDocs = 0;
  //     this.successCount = 0;
  //     uploadEvent.fileEvents.length = 0;
  //   }
  // }

  close() {
    this.modalRef.content.callback(this.refresh);
    // if (this.uploadFiles) {
    //   this.modalRef.content.callback(this.refresh);
    // } else {
    //   this.modalRef.content.callback(this.fileEvents);
    // }

    this.modalRef.hide();
  }
}
