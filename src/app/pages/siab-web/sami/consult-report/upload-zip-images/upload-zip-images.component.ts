import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IUploadEvent } from 'src/app/utils/file-upload/components/file-upload.component';

import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { typeImagesData } from './type-images-data';

@Component({
  selector: 'app-upload-zip-images',
  templateUrl: './upload-zip-images.component.html',
  styles: [],
})
export class UploadZipImagesComponent extends BasePage implements OnInit {
  accept: string = '*';
  accept2: string = null;
  uploadFiles = false;
  good: number = 0;
  info = `Haz clic para seleccionar las imágenes o arrástralas
      aquí`;

  multiple = true;
  userLogName: string = '';
  date: string = '';
  form: FormGroup = new FormGroup({});
  typeImages = new DefaultSelect(typeImagesData);
  typeImagen: string = '';
  constructor(
    private modalRef: BsModalRef,
    private programmingService: ProgrammingRequestService,
    private datePipe: DatePipe,
    private wContentService: WContentService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.initialForm();
    this.getInfoUserLog();
    this.obtainDate();
  }

  initialForm() {
    this.form = this.fb.group({
      typeImages: [null],
    });
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

  typeImageSelect(event: Event) {
    this.typeImagen = event.type;
  }

  async loadImage(uploadEvent: IUploadEvent) {
    if (this.typeImagen != '') {
      const { index, fileEvents } = uploadEvent;
      const selectedFile = fileEvents[0].file;

      const entries = await this.getEntries(selectedFile);
      const checkAllImages = entries.map((entrie: any) => {
        const checkData = entrie.filename.indexOf(this.typeImagen);
        if (checkData != -1) {
          return checkData;
        }
      });

      const filterData = checkAllImages.filter(data => {
        return data;
      });

      if (filterData.length == entries.length) {
        entries.map(async (entrie, index) => {
          const blob = await entrie.getData(new BlobWriter());
          const formData = {
            xidcProfile: 'NSBDB_Gral',
            dDocAuthor: this.userLogName,
            xidBien: this.good,
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
                this.modalRef.content.callback(true);
                this.close();
              },
              error: () => {},
            });
        });
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'Algunas imágenes de el zip no son las mismas que el tipo de imágen seleccionado'
        );
      }
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Selecciona el tipo de imágen a cargar'
      );
    }
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
