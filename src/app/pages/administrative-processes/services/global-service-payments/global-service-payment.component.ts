import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Provisional Data
//Components
import { LocalDataSource } from 'ng2-smart-table';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { PaymentServicesService } from 'src/app/core/services/ms-paymentservices/payment-services.service';
import { GoodsServicePaymentComponent } from '../goods-service-payments/goods-service-payment.component';
import { COLUMNSDATA } from './data';

@Component({
  selector: 'app-global-service-payment',
  templateUrl: './global-service-payment.component.html',
  styles: [],
})
export class GlobalServicePaymentComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  localdata: LocalDataSource = new LocalDataSource();

  columns: any = COLUMNSDATA;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  requestId: number;
  serviceId: string = '';
  globalAmount: number;
  paymentDate: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private paymentServicesService: PaymentServicesService,
    private authorityService: AuthorityService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGlobal();
  }

  getGlobal(): void {
    const id = this.route.snapshot.paramMap.get('requestId');
    if (id) {
      //Call Service
      this.requestId = Number(id);
      this.getPaymentServiceID(this.requestId);
    } else {
    }
  }
  private prepareForm(): void {
    this.form = this.fb.group({
      applicationDate: [null, [Validators.required]],
      pb_type: ['pb_lista', [Validators.required]],
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  openModal(context?: Partial<GoodsServicePaymentComponent>): void {
    const modalRef = this.modalService.show(GoodsServicePaymentComponent, {
      //initialState: {/**/},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe(data => {
      if (data) {
        /*...*/
      }
    });
  }

  getPaymentServiceID(id: number) {
    this.paymentServicesService.getPaymentServiceId(id).subscribe({
      next: resp => {
        console.log('getPaymentServiceID-> ', resp);
        //this.globalAmount = ;
        this.paymentDate =
          resp.payDate != null
            ? this.dateSet(new Date(resp.payDate))
            : resp.payDate;
        this.globalAmount = resp.cost;
        this.requestId = resp.payServiceNumber;

        const params = new ListParams();
        const _params: any = params;
        _params['filter.code'] = `$eq:${resp.serviceKey}`;

        this.authorityService
          .getDescriptionService(_params)
          .subscribe(response => {
            console.log('DescriptionService-> ', response);
            this.serviceId = response.data[0].description;
          });
        //this.serviceId = ;
      },
      error: err => {
        console.log('Error Service Search-> ', err);
      },
    });
  }

  dateSet(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }
}
