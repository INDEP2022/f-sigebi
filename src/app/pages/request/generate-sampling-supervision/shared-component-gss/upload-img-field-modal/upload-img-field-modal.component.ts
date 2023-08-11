import { Component, inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { IUploadEvent } from 'src/app/utils/file-upload/components/file-upload.component';

@Component({
  selector: 'app-upload-img-field-modal',
  templateUrl: './upload-img-field-modal.component.html',
  styles: [],
})
export class UploadImgFieldModalComponent implements OnInit {
  data: any = null;
  process: string = '';
  userLogName: string = '';

  constructor() {}

  private bsModalService = inject(BsModalRef);
  private wcontentService = inject(WContentService);
  private authUser = inject(AuthService);

  ngOnInit(): void {
    this.getUser();
    console.log(this.data);
  }

  getUser() {
    const auth = this.authUser.decodeToken();
    console.log(auth);
    this.userLogName = auth.username;
  }

  loadImage(uploadEvent: IUploadEvent) {
    console.log(uploadEvent);
    console.log(this.data);
    console.log(this.process);
    const { index, fileEvents } = uploadEvent;

    fileEvents.map(item => {
      debugger;
      const formData = {
        xidcProfile: 'NSBDB_Gral',
        dDocAuthor: this.userLogName,
        //xidSolicitud: this.idRequest,
        xidTransferente: '',
        xidBien: this.data[0].goodId,
        xnombreProceso: 'Generar Muestreo',
      };
      const contentType = 'img';
      const docName = `IMG_${this.getDate()}${contentType}`;

      //this.insertImage(docName,contentType,JSON.stringify(formData),contentType)
    });
  }

  insertImage(docName: string, contentType: string, body: any, file: any) {
    this.wcontentService
      .addImagesToContent(docName, contentType, body, file)
      .subscribe({
        next: data => {
          this.bsModalService.content.callBack(true);
          this.close();
        },
        error: error => {},
      });
  }

  getDate() {
    const date = new Date();
    return moment(date).format('DD-MM-YYYY');
  }

  close() {
    this.bsModalService.hide();
  }
}
