import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  sampleOrderForm: FormGroup = new FormGroup({});
  //
  @Input() searchForm: any;
  //datos anexo para pasar
  dataAnnex: any;
  //Id del Muestreo del orden obtener de taras el id
  sampleOrderId: number = null;
  //en el caso de que sera una aprovacion de resultados se pone true
  isApprovalResult: boolean = false;
  input = '<input type="text" (keyup)="keyFunc($event)">';

  private orderService = inject(OrderServiceService);
  private fb = inject(FormBuilder);

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    //setTimeout(() => {
    this.sampleOrderId = 3;
    //}, 2000);
    this.initAnexForm();
  }

  initAnexForm() {
    this.sampleOrderForm = this.fb.group({
      idSamplingOrder: [null],
      factsrelevant: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      downloadbreaches: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      datebreaches: [null, [Validators.required]],
      agreements: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      daterepService: [null, [Validators.required]],
      nameManagersoul: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
    });
  }

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

  async openAnnexK() {
    //verificar anexo k desde donde se llama si es aprobacion de resultados o generacion de formato
    const annextForm = await this.getSampleOrder();
    this.openModal(AnnexKFormComponent, annextForm, 'revition-results');
    //this.openModal(AnnexKComponent, annextForm, 'revition-results');
  }

  searchEvent(event: any) {
    this.searchForm = event;
  }

  openModal(component: any, data?: any, typeAnnex?: String): void {
    let config: ModalOptions = {
      initialState: {
        annexData: data,
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
      title: 'Confirmación del Turnado',
      text: 'Observaciones:',
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      allowOutsideClick: false,
    }).then(result => {
      console.log(result.value);
    });
  }

  getSampleOrder() {
    return new Promise((resolve, reject) => {
      const id = this.sampleOrderId;
      const params = new ListParams();
      params['filter.idSamplingOrder'] = `$eq:${id}`;
      this.orderService.getAllSampleOrder(params).subscribe({
        next: resp => {
          resolve(resp.data[0]);
        },
      });
    });
  }
}
