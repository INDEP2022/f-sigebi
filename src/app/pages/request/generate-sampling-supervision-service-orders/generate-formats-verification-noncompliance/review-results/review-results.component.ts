import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { BasePage } from '../../../../../core/shared/base-page';
import { AnnexKFormComponent } from '../../../generate-sampling-supervision/generate-formats-verify-noncompliance/annex-k-form/annex-k-form.component';

@Component({
  selector: 'app-review-results',
  templateUrl: './review-results.component.html',
  styleUrls: ['./review-results.component.scss'],
})
export class ReviewResultsComponent extends BasePage implements OnInit {
  title: string = 'Recisión Resultados 758';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  //pasar datos a los detalle de muestreo
  samplingDetailData: any;
  //
  searchForm: any;
  //datos anexo para pasar
  dataAnnex: any;

  //en el caso de que sera una aprovacion de resultados se pone true
  isApprovalResult: boolean = false;
  input = '<input type="text" (keyup)="keyFunc($event)">';
  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {}

  turnSampling() {
    //verificar anexo k desde donde se llama si es aprobacion de resultados o generacion de formato
    if (this.isApprovalResult === false) {
      let title = 'Confirmación turnado';
      let message =
        '¿Esta de acuerdo qeu la información es correcta para turnar?';
      this.alertQuestion(undefined, title, message, 'Aceptar').then(
        question => {
          if (question.isConfirmed) {
            //Ejecutar el servicio
            console.log('guardar documento');
          }
        }
      );
    } else {
      this.confirmTurnModal();
    }
  }

  openAnnexK(): void {
    //verificar anexo k desde donde se llama si es aprobacion de resultados o generacion de formato
    this.openModal(AnnexKFormComponent, '', 'annex-k-review-results');
  }

  searchEvent(event: any) {
    this.searchForm = event;
  }

  openModal(component: any, data?: any, typeAnnex?: String): void {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);

    //this.bsModalRef.content.event.subscribe((res: any) => {
    //cargarlos en el formulario
    //console.log(res);
    //this.assetsForm.controls['address'].get('longitud').enable();
    //this.requestForm.get('receiUser').patchValue(res.user);
    //});
  }

  keyFunc(event: any) {
    let value = event.target.value;
  }

  confirmTurnModal() {
    Swal.fire({
      title: 'Confirmacion Turnado!',
      text: 'Observaciones:',
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
    }).then(result => {
      console.log(result.value);
    });
  }
}
