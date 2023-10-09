import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { PaymentServicesService } from 'src/app/core/services/ms-paymentservices/payment-services.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-goods-service-payment',
  templateUrl: './goods-service-payment.component.html',
  styles: [],
})
export class GoodsServicePaymentComponent extends BasePage implements OnInit {
  @Output() data = new EventEmitter<any>();

  @Input() record: string = 'id';

  expedientSelec = new DefaultSelect<IExpedient>();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  form: FormGroup = new FormGroup({});

  dateI: string = '';
  dateF: string = '';

  modData: any;

  countCreate: number = 0;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodprocessService: GoodprocessService,
    private expedientService: ExpedientService,
    private paymentServicesService: PaymentServicesService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('dataModal-> ', this.modData.fechaSol);
    console.log('FechaSol-> ', this.dateSet(this.modData.fechaSol));

    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      applicationDate: [null],
      service: [null],
      record: [null, []],
      type: [null, [Validators.required]],
      subtype: [null, [Validators.required]],
      ssubtype: [null, [Validators.required]],
      sssubtype: [null, [Validators.required]],
    });

    // this.form
    //   .get('applicationDate')
    //   .setValue(this.dateSet(this.modData.fechaSol));

    //   console.log("");
    this.form.patchValue({
      applicationDate: this.dateSet(this.modData.fechaSol),
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    const { record, type, subtype, ssubtype, sssubtype } = this.form.value;

    console.log('Confirm', record.id);

    let body = {
      screen: 'FACTADBSOLICSERVI',
      noAssociatedExp: Number(record.id),
      noType: Number(type),
      noSubType: Number(subtype),
      noSSubType: Number(ssubtype),
      noSSSubType: Number(sssubtype),
      limit: 0,
      page: 0,
    };
    console.log('Body-> ', body);
    this.pupInsertaBienesAux(body);
  }

  pupInsertaBienesAux(body: any) {
    this.goodprocessService.postPupInsertGoodsAux(body).subscribe({
      next: resp => {
        if (resp.data.length == 0) {
          this.alert('error', 'No hay registros para asignar', '');
        }

        if (resp != null && resp != undefined) {
          console.log('Resp InsertGood-> ', resp);
          const { applicationDate, service } = this.form.value;
          this.countCreate = 0;
          console.log('applicationDate send -> ', applicationDate);
          console.log(
            'FechaModal-> ',
            this.formatDate(new Date(applicationDate))
          );
          for (let i = 0; i < resp.data.length; i++) {
            if (this.modData.goodNumber != null) {
              let create = {
                applicationDate: this.formatDate(new Date(applicationDate)),
                cost: 1,
                goodNumber: resp.data[i].no_bien,
                serviceKey: String(service) != null ? String(service) : '1100',
              };
              //this.postPaymentRegister(create, i, resp.data.length);
            }
          }
        }
      },
      error: err => {
        this.alert('error', 'Error al agregar el Bien', '');
        console.log('Error InsertGoods-> ', err);
      },
    });
  }

  //Seleccionar expediente
  getExpedient(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('id', lparams.text, SearchFilter.EQ);

    this.expedientService.getExpedientList(params.getParams()).subscribe({
      next: data => {
        this.expedientSelec = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.expedientSelec = new DefaultSelect();
      },
    });
  }

  getGoods(ssssubType: IGoodSssubtype) {
    // this.good = ssssubType.numClasifGoods;
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  async postPaymentRegister(body: any, i: number, len: number) {
    this.paymentServicesService.postPayment(body).subscribe({
      next: response => {
        console.log('PaymentCreate-> ', response);
        //this.alert('success', '', 'El registro ha sido guardado correctamente')
        this.countCreate++;
        this.validateCount(this.countCreate, i, len);
      },
      error: err => {
        //this.alert('error', 'El registro No ha sido guardado', '');
        console.log('PaymentError-> ', err);

        this.countCreate = this.countCreate;
        this.validateCount(this.countCreate, i, len);
      },
    });
  }

  validateCount(value: number, i: number, len: number) {
    let auxNum: number = 0;
    auxNum = auxNum + Number(value);
    console.log('contador value antes de -> ', auxNum);
    if (i == len - 1) {
      console.log('contador value -> ', auxNum);
      console.log('contador i -> ', i);
      console.log('contador len -> ', len - 1);
      this.alert('success', `Se ha insertado ${auxNum} registros`, '');
      this.close();
    }
  }

  dateSet(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }
}
