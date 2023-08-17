import { Component, inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared';
import { IUploadEvent } from 'src/app/utils/file-upload/components/file-upload.component';

@Component({
  selector: 'app-upload-img-field-modal',
  templateUrl: './upload-img-field-modal.component.html',
  styles: [],
})
export class UploadImgFieldModalComponent extends BasePage implements OnInit {
  data: any = null;
  process: string = '';
  userLogName: string = '';

  constructor() {
    super();
  }

  private bsModalService = inject(BsModalRef);
  private wcontentService = inject(WContentService);
  private authUser = inject(AuthService);

  ngOnInit(): void {
    this.getUser();
    //console.log(this.data);
  }

  getUser() {
    const auth = this.authUser.decodeToken();
    //console.log(auth);
    this.userLogName = auth.username;
  }

  loadImage(uploadEvent: IUploadEvent) {
    const { index, fileEvents } = uploadEvent;

    fileEvents.map(item => {
      const formData = {
        xidcProfile: 'NSBDB_Gral',
        dDocAuthor: this.userLogName,
        xidSolicitud: '123456',
        //xidTransferente: '123456',
        xidBien: this.data[0].goodId,
        xnombreProceso: 'Generar Muestreo',
        dDocTitle: `IMG_${this.getDate()}img`,

        ddocType: '',
        ddocCreator: '',

        dID: '',
        dSecurityGroup: 'Public',
        dDocAccount: '',
        dDocId: '',
        dInDate: moment(new Date()).format('DD-MMM-YYYY'),
        dOutDate: '',
        dRevLabel: '',
        xIdcProfile: '',
        xidExpediente: '',
      };
      const contentType = 'img';
      const docName = `IMG_${this.getDate()}${contentType}`;
      this.insertImage(
        docName,
        contentType,
        JSON.stringify(formData),
        item.file
      );
    });
  }

  insertImage(docName: string, contentType: string, body: any, file: any) {
    this.wcontentService
      .addImagesToContent(docName, contentType, body, file)
      .subscribe({
        next: data => {
          this.bsModalService.content.callback(true);
          this.close();
        },
        error: error => {
          console.log(error);
          this.onLoadToast('error', 'No se pudo cargar la(s) fotografías');
        },
      });
  }

  getDate() {
    const date = new Date();
    return moment(date).format('DD_MM_YYYY');
  }

  close() {
    this.bsModalService.hide();
  }
}
