import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IUploadEvent } from 'src/app/utils/file-upload/components/file-upload.component';

import { DatePipe } from '@angular/common';
import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';

@Component({
  selector: 'app-upload-zip-images',
  templateUrl: './upload-zip-images.component.html',
  styles: [],
})
export class UploadZipImagesComponent implements OnInit {
  accept: string = '*';
  accept2: string = null;
  uploadFiles = false;
  info = `Haz clic para seleccionar las imágenes o arrástralas
      aquí`;

  multiple = true;
  userLogName: string = '';
  date: string = '';
  constructor(
    private modalRef: BsModalRef,
    private programmingService: ProgrammingRequestService,
    private datePipe: DatePipe,
    private wContentService: WContentService
  ) {}

  ngOnInit(): void {
    this.getInfoUserLog();
    this.obtainDate();
  }

  getInfoUserLog() {
    this.programmingService.getUserInfo().subscribe((data: any) => {
      this.userLogName = data.preferred_username;
    });
  }

  obtainDate() {
    const date = new Date();
    this.date = this.datePipe.transform(date, 'yyyy_MM_dd');
  }

  async loadImage(uploadEvent: IUploadEvent) {
    const { index, fileEvents } = uploadEvent;
    const selectedFile = fileEvents[0].file;

    const entries = await this.getEntries(selectedFile);

    entries.map(async (entrie, index) => {
      const blob = await entrie.getData(new BlobWriter());
      const formData = {
        xidcProfile: 'NSBDB_Gral',
        dDocAuthor: this.userLogName,
        xidBien: '9589899',
        xnombreProceso: 'Clasificar Bien',
      };
      const contentType = 'img';
      const docName = `IMG_${this.date}${contentType}`;

      this.wContentService
        .addImagesToContent(
          docName,
          contentType,
          JSON.stringify(formData),
          blob,
          entrie.filename
        )
        .subscribe({
          next: data => {
            console.log('subido al content', data);
          },
          error: error => {
            console.log('Error al subir al content', error);
          },
        });
    });
  }

  getEntries(selectedFile: any) {
    return new ZipReader(new BlobReader(selectedFile)).getEntries();
  }

  close() {
    this.modalRef.hide();
  }

  detectMimeType(base64String: string, fileName = 'unamedfile') {
    let ext = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (ext === undefined || ext === null || ext === '') ext = 'bin';
    ext = ext.toLowerCase();
    const signatures: any = {
      JVBERi0: 'application/pdf',
      R0lGODdh: 'image/gif',
      R0lGODlh: 'image/gif',
      iVBORw0KGgo: 'image/png',
      TU0AK: 'image/tiff',
      '/9j/': 'image/jpg',
      UEs: 'application/vnd.openxmlformats-officedocument.',
      PK: 'application/zip',
    };
    for (const s in signatures) {
      if (base64String.indexOf(s) === 0) {
        let x = signatures[s];
        if (ext.length > 3 && ext.substring(0, 3) === 'ppt') {
          x += 'presentationml.presentation';
        } else if (ext.length > 3 && ext.substring(0, 3) === 'xls') {
          x += 'spreadsheetml.sheet';
        } else if (ext.length > 3 && ext.substring(0, 3) === 'doc') {
          x += 'wordprocessingml.document';
        }
        return x;
      }
    }
    const extensions: any = {
      xls: 'application/vnd.ms-excel',
      ppt: 'application/vnd.ms-powerpoint',
      doc: 'application/msword',
      xml: 'text/xml',
      mpeg: 'audio/mpeg',
      mpg: 'audio/mpeg',
      txt: 'text/plain',
    };
    for (const e in extensions) {
      if (ext.indexOf(e) === 0) {
        const xx = extensions[e];
        return xx;
      }
    }
    return 'unknown';
  }
}
