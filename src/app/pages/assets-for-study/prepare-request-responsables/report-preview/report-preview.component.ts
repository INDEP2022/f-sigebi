import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { RecipientDataComponent } from '../recipient-data/recipient-data.component';

@Component({
  selector: 'app-report-preview',
  templateUrl: './report-preview.component.html',
  styles: [],
})
export class ReportPreviewComponent implements OnInit {
  @ViewChild('FileInput', { static: false }) inputFile: ElementRef = null;
  title: string = 'Vista del reporte';
  childModal: BsModalRef;
  isSignReport: boolean = true;
  isSendReport: boolean = false;

  fileToUpload: File | null = null;
  typeReport: string = '';
  sizeMessage: boolean = false;

  constructor(
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {}

  close() {
    this.bsModalRef.hide();
    this.openModal(RecipientDataComponent);
  }

  signReport(): void {
    this.isSignReport = false;
    this.isSendReport = true;
  }

  previousStep() {
    this.isSignReport = true;
    this.isSendReport = false;
  }

  sendToSign(): void {
    //verificar que el reporte y los datos necesarios se envien
    Swal.fire({
      icon: undefined,
      title: 'Confimación',
      text: '¿Está seguro de enviar la información a firmar?',
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      console.log('enviar la información');
    });
  }

  selectFile(event: any) {
    console.log(event);
    let file = event.target.files[0];
    let size = file.size / 1000000;
    this.sizeMessage = size > 10 ? true : false;
    if (this.sizeMessage) {
      this.inputFile.nativeElement.value = '';
    } else {
      this.fileToUpload = file;
    }
  }

  openModal(component: any) {
    let config: ModalOptions = {
      initialState: {
        information: '',
        typeReport: 'prepare-request',
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.childModal = this.modalService.show(component, config);

    /*  this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    }); */
  }
}
