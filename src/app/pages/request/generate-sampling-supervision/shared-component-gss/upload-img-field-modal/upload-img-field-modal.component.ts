import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
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

  constructor() {}

  private bsModalService = inject(BsModalRef);
  private wcontentService = inject(WContentService);

  ngOnInit(): void {}

  loadImage(uploadEvent: IUploadEvent) {
    /*console.log(uploadEvent)
    console.log(this.data)
    console.log(this.process)
    const { index, fileEvents } = uploadEvent;

    fileEvents.map((item)=>{
      const formData = {
        xidcProfile: 'NSBDB_Gral',
        dDocAuthor: this.userLogName,
        xidSolicitud: this.idRequest,
        xidTransferente: this.idTrans,
        xidBien: this.idGood,
        xnombreProceso: 'Clasificar Bien',
      };
      const contentType = 'img';
      const docName = `IMG_${this.date}${contentType}`;
      this.insertImage()
    })
        
  }

  insertImage(docName: string, contentType:string, body:any, file:any){ 
    this.wcontentService
            .addImagesToContent(
              docName,
              contentType,
              body,
              file
            )
            .subscribe({
              next: data => {
                this.bsModalService.content.callBack(true);
                this.close();
              },
              error: error => {},
            });*/
  }
  close() {
    this.bsModalService.hide();
  }
}
