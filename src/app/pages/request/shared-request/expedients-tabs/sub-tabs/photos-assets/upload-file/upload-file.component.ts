import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IUploadEvent } from 'src/app/utils/file-upload/components/file-upload.component';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styles: [],
})
export class UploadFileComponent extends BasePage implements OnInit {
  @ViewChild('FileInput', { static: false }) inputFile: ElementRef = null;
  data: any;
  fileToUpload: File | null = null;
  typeReport: string = '';
  statusTask: any;
  sizeMessage: boolean = false;
  filesImages: any[] = [];
  idRequest: number = 0;
  idTrans: number = 0;
  process: string = '';
  programming: Iprogramming;
  idGood: number = 0;
  date: string = '';
  userLogName: string = '';
  goodProg: any;
  nomProcess?: string = '';
  typeDoc?: any = null;

  constructor(
    private bsModalRef: BsModalRef,
    private requestService: RequestService,
    private wContentService: WContentService,
    private datePipe: DatePipe,
    private programmingService: ProgrammingRequestService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.idGood) this.idGood = this.data.id;
    if (this.idRequest) this.infoRequest();
    this.obtainDate();
    this.getInfoUserLog();
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

  infoRequest() {
    this.requestService.getById(this.idRequest).subscribe(data => {
      this.idTrans = data.transferenceId;
    });
  }

  close(): void {
    this.bsModalRef.hide();
  }

  loadImage(uploadEvent: IUploadEvent) {
    if (this.statusTask != 'FINALIZADA') {
      if (this.process == 'programming') {
        const { index, fileEvents } = uploadEvent;
        fileEvents.forEach(fileEvent => {
          const formData = {
            xidcProfile: 'NSBDB_Gral',
            dDocAuthor: this.userLogName,
            xfolioProgramacion: this.programming.folio,
            xnoProgramacion: this.programming.id,
            xidTransferente: this.programming.tranferId,
            xidBien: this.goodProg,
            xnombreProceso: 'Ejecutar Recepcion',
          };

          const contentType = 'img';
          const docName = `IMG_${this.date}${contentType}`;

          /* this.wContentService
            .addImagesToContent(
              docName,
              contentType,
              JSON.stringify(formData),
              fileEvent.file
            )
            .subscribe({
              next: data => {
                this.bsModalRef.content.callBack(true);
                this.close();
              },
              error: error => {},
            }); */
        });
      }
      if (this.process == 'scheduling-deliveries') {
        const { index, fileEvents } = uploadEvent;
        this.idGood = this.data.id;
        fileEvents.forEach(fileEvent => {
          const formData = {
            xidcProfile: 'NSBDB_Gral',
            dDocAuthor: this.userLogName,
            xidSolicitud: this.idRequest,
            xidTransferente: this.data.tranferId,
            xidBien: this.idGood,
            xnombreProceso: this.nomProcess,
            xtipoDocumento: this.typeDoc,
            xDelegacionRegional: this.data.delReg,
          };
          const contentType = 'img';
          const docName = `IMG_${this.date}${contentType}`;

          this.wContentService
            .addImagesToContent(
              docName,
              contentType,
              JSON.stringify(formData),
              fileEvent.file
            )
            .subscribe({
              next: data => {
                this.bsModalRef.content.callBack(true);
                this.close();
              },
              error: error => {},
            });
        });
      } else {
        const { index, fileEvents } = uploadEvent;
        this.idGood = this.data.id;
        fileEvents.forEach(fileEvent => {
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

          this.wContentService
            .addImagesToContent(
              docName,
              contentType,
              JSON.stringify(formData),
              fileEvent.file
            )
            .subscribe({
              next: data => {
                this.bsModalRef.content.callBack(true);
                this.close();
              },
              error: error => {},
            });
        });
      }
    }
  }
}
