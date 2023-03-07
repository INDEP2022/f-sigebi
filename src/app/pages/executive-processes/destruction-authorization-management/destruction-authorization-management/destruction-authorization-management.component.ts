import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//PAtterns
//columns
import { GOODS_COLUMNS } from './destruction-authorization-management-goods-columns';
import { PROCEEDINGS_COLUMNS } from './destruction-authorization-management-proceedings-columns';
import { RULINGS_COLUMNS } from './destruction-authorization-management-rulings-columns';
//models
import { IGood } from 'src/app/core/models/ms-good/good';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
//Services
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';

@Component({
  selector: 'app-destruction-authorization-management',
  templateUrl: './destruction-authorization-management.component.html',
  styleUrls: ['./destruction-authorization-management.scss'],
})
export class DestructionAuthorizationManagementComponent
  extends BasePage
  implements OnInit
{
  proceedings = new DefaultSelect<IProccedingsDeliveryReception>();
  modelValue: IProccedingsDeliveryReception;

  settings2 = {
    ...this.settings,
    actions: false,
  };

  settings3 = {
    ...this.settings,
    actions: false,
  };

  form: FormGroup = new FormGroup({});
  today: Date;
  imagenurl =
    'https://images.ctfassets.net/txhaodyqr481/6gyslCh8jbWbh9zYs5Dmpa/a4a184b2d1eda786bf14e050607b80df/plantillas-de-factura-profesional-suscripcion-gratis-con-sumup-facturas.jpg?fm=webp&q=85&w=743&h=892';

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  goodPDS: IGood[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private goodService: GoodService
  ) {
    super();
    this.today = new Date();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...GOODS_COLUMNS },
      rowClassFunction: function (row: {
        data: { status: any };
      }): 'available' | 'not-available' {
        return row.data.status ? 'available' : 'not-available';
      },
    };
    this.settings2.columns = RULINGS_COLUMNS;
    this.settings3.columns = PROCEEDINGS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.getGoodByStatusPDS();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, []],
      keysProceedings: [null, []],
      typeProceedings: [null, []],
      datePhysicalReception: [null, []],
      dateDeliveryGood: [null, []],
      dateCaptureHc: [null, []],
      statusProceedings: [null, []],
      universalFolio: [null, []],
      observations: [null, []],
    });
  }

  //Método para select, que trae el listado de todos (No se esta usando)
  getProceedingsAll(params: ListParams) {
    this.proceedingsDeliveryReceptionService
      .getAllProceedingsDeliveryReception(params)
      .subscribe(
        data => {
          this.proceedings = new DefaultSelect(data.data, data.count);
        },
        err => {
          let error = '';
          if (err.proceedings === 0) {
            error = 'Revise su conexión de Internet.';
          } else {
            error = err.message;
          }
          this.onLoadToast('error', 'Error', error);
        },
        () => {}
      );
  }

  onValuesChange(modelChange: IProccedingsDeliveryReception) {
    this.modelValue = modelChange;
    this.form.controls['id'].setValue(this.modelValue.id);
    this.form.controls['keysProceedings'].setValue(
      this.modelValue.keysProceedings
    );
    this.form.controls['typeProceedings'].setValue(
      this.modelValue.typeProceedings
    );
    this.form.controls['datePhysicalReception'].setValue(
      this.modelValue.datePhysicalReception
    );
    this.form.controls['dateDeliveryGood'].setValue(
      this.modelValue.dateDeliveryGood
    );
    this.form.controls['dateCaptureHc'].setValue(this.modelValue.dateCaptureHc);
    this.form.controls['statusProceedings'].setValue(
      this.modelValue.statusProceedings
    );
    this.form.controls['universalFolio'].setValue(
      this.modelValue.universalFolio
    );
    this.form.controls['observations'].setValue(this.modelValue.observations);
  }

  getProceedingsByKey(): void {
    let keys = this.form.controls['keysProceedings'].value;
    console.log(keys);
    this.proceedingsDeliveryReceptionService
      .getProceedingsByKey(keys)
      .subscribe(
        response => {
          //TODO: Validate Response
          if (response !== null) {
            this.form.patchValue(response);
            this.form.updateValueAndValidity();
            // this.getGoodsByExpedient(response.id);
          } else {
            //TODO: CHECK MESSAGE
            this.alert('info', 'No se encontraron registros', '');
          }

          this.loading = false;
        },
        error => (this.loading = false)
      );
  }

  /*Método para traer los bienes con estatus PDS

  getGoodByStatusPDS() {
    this.loading = true;
    this.goodService.getGoodByStatusPDS(this.filterParams.getValue().getParams()).subscribe({
      next: response => {
        this.goodPDS = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }*/

  dataActRec = [
    {
      actasRecepcion: 'RT/AGA/ADM/DRBC/00254/17/12',
    },
    {
      actasRecepcion: 'RT/AGA/ADM/DRBC/00232/17/12',
    },
    {
      actasRecepcion: 'RT/AGA/ADM/TIJ/TIJ/02320/11/10',
    },
  ];

  dataDictam = [
    {
      actasRecepcion: 'DCCR/DECRO/DRBC/ATJRBC/00001/2018',
    },
    {
      actasRecepcion: 'DCCR/DECRO/DRBC/ATJRBC/00002/2018',
    },
    {
      actasRecepcion: 'DCCR/DECRO/DRBC/ATJRBC/00003/2018',
    },
  ];

  msjRequest() {
    this.alertQuestion(
      'question',
      'Atención',
      '¿Desea imprimir la solicitud de digitalización?'
    ).then(question => {
      if (question.isConfirmed) {
        this.alert('success', 'Listo', 'Se ha solicitado');
      }
    });
  }

  msjScan() {
    this.alertQuestion(
      'info',
      'Atención',
      'Para escanear debe de abrir la aplicación de su preferencia'
    );
  }

  openPrevImg() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.imagenurl),
          type: 'img',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  cleanForm(): void {
    this.form.reset();
  }
}
