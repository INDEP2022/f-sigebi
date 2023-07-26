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
    private comerDetailService: ComerDetailsService
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
      this.limit = new FormControl(params.limit);
      this.getDetails();
    });
  }
  private prepareForm() {
    this.form = this.fb.group({
      idOI: [null, [Validators.required]],
      idArea: [null, [Validators.required]],
      ur: [null, [Validators.required]],
      clientRFC: [null, [Validators.required]],
      descriptionRFC: [null, [Validators.required]],
      anexo: [null, [Validators.required]],
      typepe: [null, [Validators.required]],
      idEvent: [null, [Validators.required]],
      concept: [null, [Validators.required]],
      idBank: [null, [Validators.required]],
      ordenDate: [null, [Validators.required]],
      numovto: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      reference: [null, [Validators.required]],
      idPayment: [null, [Validators.required]],
      chain: [null],
    });
  }
  searchOI() {
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

    this.identifier = data.identifier;
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

  //Enviar SIRSAE
  sendSIRSAE() {
    let motivo_reclap: string = null;
    let enviar: number = null;
    if (this.refe_ori != this.referenceOriDat) {
      motivo_reclap = 'REFERENCIA';
      enviar = 1;

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
    }
  }

  //Llenar los datos traidos

  //Traer detalles
}
