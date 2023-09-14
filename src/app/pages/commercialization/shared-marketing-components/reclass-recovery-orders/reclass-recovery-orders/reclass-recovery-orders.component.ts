import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { ISendSirsae } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae-model';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  DETAILS_OI_COLUMNS,
  goodCheck,
} from './reclass-recovery-orders-columns';

@Component({
  selector: 'app-reclass-recovery-orders',
  templateUrl: './reclass-recovery-orders.component.html',
  styles: [],
})
export class ReclassRecoveryOrdersComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  limit = new FormControl(10);
  totalItems: number = 0;
  selectedOI: any = null;
  OIData = new DefaultSelect();
  dataComerDetails: LocalDataSource = new LocalDataSource();

  identifier: string;
  idEventParams: string;
  referenceOriDat: string = null;

  refe_ori: string = null;

  //Gets
  get idOI() {
    return this.form.get('idOI');
  }

  get idArea() {
    return this.form.get('idArea');
  }

  get ur() {
    return this.form.get('ur');
  }

  get clientRFC() {
    return this.form.get('clientRFC');
  }

  get descriptionRFC() {
    return this.form.get('descriptionRFC');
  }

  get anexo() {
    return this.form.get('anexo');
  }

  get typepe() {
    return this.form.get('typepe');
  }

  get idEvent() {
    return this.form.get('idEvent');
  }

  get concept() {
    return this.form.get('concept');
  }

  get idBank() {
    return this.form.get('idBank');
  }

  get ordenDate() {
    return this.form.get('ordenDate');
  }

  get numovto() {
    return this.form.get('numovto');
  }

  get amount() {
    return this.form.get('amount');
  }

  get reference() {
    return this.form.get('reference');
  }

  get idPayment() {
    return this.form.get('idPayment');
  }

  constructor(
    private fb: FormBuilder,
    private invoiceService: MsInvoiceService,
    private comerDetailService: ComerDetailsService,
    private sirsaeService: InterfacesirsaeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...DETAILS_OI_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.idOI({ page: 1, text: '' });

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      if (this.dataComerDetails['data'].length > 0) {
        this.limit = new FormControl(params.limit);
        this.getDetails();
      }
    });
  }
  private prepareForm() {
    this.form = this.fb.group({
      idOI: [null, [Validators.required]],
      idArea: [null, []],
      ur: [null, []],
      clientRFC: [null, []],
      descriptionRFC: [null, []],
      anexo: [null, []],
      typepe: [null, []],
      idEvent: [null, []],
      concept: [null, []],
      idBank: [null, []],
      ordenDate: [null, []],
      numovto: [null, []],
      amount: [null, []],
      reference: [null, []],
      idPayment: [null, []],
      chain: [null],
    });
  }
  searchOI() {
    if (this.idOI.value != null) {
      const paramsF = new FilterParams();
      paramsF.addFilter('recordedOrderId', this.idOI.value);
      this.invoiceService.getComerHeadboard(paramsF.getParams()).subscribe(
        res => {
          console.log(res['data'][0]);
          this.refe_ori = 'NADA';
          this.fillIncomeDataOI(res['data'][0]);
        },
        err => {
          console.log(err);
        }
      );
    } else {
      this.alert('warning', 'No ingresó ningún OI', '');
    }
  }

  //Llenar los datos traidos
  fillIncomeDataOI(data: any) {
    this.idArea.setValue(data.area);
    this.ur.setValue(data.aResponsible);
    this.clientRFC.setValue(data.clientRfc);
    this.anexo.setValue(data.atthached);
    this.typepe.setValue(data.typePe);
    this.concept.setValue(data.concept);
    this.idBank.setValue(data.bank);
    this.ordenDate.setValue(data.orderDate);
    this.numovto.setValue(data.movementNumber);
    this.amount.setValue(data.parentTotalAmount);
    this.reference.setValue(data.reference);
    this.idPayment.setValue(data.paymentId);
    this.idEvent.setValue(data.idEvent);
    this.identifier = data.idIdentifier;
    this.idEventParams = data.idEvent;
    this.referenceOriDat = data.reference;

    this.getDetails();
  }

  //Traer detalles
  getDetails() {
    this.loading = true;
    const paramsF = new FilterParams();
    paramsF.addFilter('idIdentifier', this.identifier);
    paramsF.addFilter('idEvent', this.idEventParams);
    paramsF.page = this.params.value.page;
    paramsF.limit = this.params.value.limit;
    this.comerDetailService.getComerDetails(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.totalItems = res.count;
        this.dataComerDetails.load(res.data);
        this.loading = false;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Select
  selectRow() {
    console.log(goodCheck);
  }

  //Limpiar
  clearAll() {
    this.form.reset();
    this.dataComerDetails.load([]);
  }

  //Enviar SIRSAE
  sendSIRSAE() {
    let motivo_reclap: string = null;
    let enviar: number = null;
    if (this.refe_ori != this.referenceOriDat) {
      motivo_reclap = 'REFERENCIA';
      enviar = 1;
    }
    console.log(this.identifier);
    const model: ISendSirsae = {
      identificator: this.identifier,
      eventId: this.idEventParams,
    };

    this.sirsaeService.sendSirsae(model).subscribe(
      res => {
        console.log(res);
        this.alert('success', 'Enviado a SIRSAE', '');
      },
      err => {
        console.log(err);
        this.alert(
          'error',
          'Se presentó un Error inesperado al enviar a SIRSAE',
          ''
        );
      }
    );
  }

  //Llenar los datos traidos

  //Traer detalles
}
