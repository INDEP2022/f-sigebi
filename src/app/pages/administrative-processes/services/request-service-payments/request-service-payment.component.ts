import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { LocalDataSource } from 'ng2-smart-table';
import { PaymentServicesService } from 'src/app/core/services/ms-paymentservices/payment-services.service';
import { GoodsServicePaymentComponent } from '../goods-service-payments/goods-service-payment.component';
import { RequestServiceFormComponent } from '../request-service-form/request-service-form.component';

@Component({
  selector: 'app-request-service-payment',
  templateUrl: './request-service-payment.component.html',
  styles: [],
})
export class RequestServicePaymentComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  localdata: LocalDataSource = new LocalDataSource();
  dataRows: any[] = [];
  columnFilters: any = [];

  flagGoods: boolean = false;

  selectedRow: any;
  //Columns
  columns = COLUMNS;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private paymentServicesService: PaymentServicesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: { add: true, delete: true, position: 'right' },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    /**
     * Instance renderComponent
     **/
    /*this.columns.isPayment={
      ...this.columns.isPayment,
      onComponentInitFunction: (instance: any) => {
        instance.toggle.subscribe((data: any) => {
         this.otherFn(data);
        });
      }
    }*/
    this.localdata
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'isPayment':
                field = 'filter.numbermovement';
                searchFilter = SearchFilter.EQ;
                break;
              case 'request':
                searchFilter = SearchFilter.EQ;
                break;
              case 'goodNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'service':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'requestDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'paymentDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'amount':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getTableData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTableData());
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

  openGlobal(requestId: string) {
    //Change Routing
    this.router.navigate([
      'pages/administrative-processes/services/global',
      requestId,
    ]);
  }

  selectRows(rows: any[]) {
    console.log('row ', rows);
    if (rows.length > 0) {
      this.selectedRow = rows;
      console.log('Rows Selected->', this.selectedRow);
      this.flagGoods = true;
    } else {
      this.flagGoods = false;
      this.selectedRow = [];
    }
  }

  openModal(modData?: any) {
    modData = this.selectedRow;
    const modalRef = this.modalService.show(GoodsServicePaymentComponent, {
      initialState: {
        modData,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe(data => {
      if (data) {
        /*...*/
      }
    });
  }

  openModalNew(context?: Partial<RequestServiceFormComponent>): void {
    const modalRef = this.modalService.show(RequestServiceFormComponent, {
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

  getTableData() {
    /**this.dataRows = [];*/
    const params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    /**Data de la tabla de el microservicio que está caido */
    /**Falta el agregar nuevo registro a la tabla */
    /**this.dataRows.push(item);
                    this.localdata.load(this.dataRows);
                    console.log('this dataRows: ', this.dataRows);
                    console.log('this localData: ', this.localdata);
                    this.totalItems = res.count; */
    this.paymentServicesService.getPayment(params).subscribe({
      next: resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp Data-> ', resp);
          for (let i = 0; i < resp.data.length; i++) {
            let item = {
              request: resp.data[i].payServiceNumber,
              goodNumber: resp.data[i].goodNumber,
              descriptionGood: 'data del bien',
              service: resp.data[i].serviceKey,
              descriptionService: 'data del servicio',
              requestDate: resp.data[i].applicationDate,
              paymentDate: resp.data[i].payDate,
              amount: resp.data[i].cost,
              goodStatus: 'status goo',
            };
            this.dataRows.push(item);
            this.localdata.load(this.dataRows);
            this.localdata.refresh();
          }
          this.totalItems = resp.count;
        }
      },
      error: err => {},
    });
  }
}
