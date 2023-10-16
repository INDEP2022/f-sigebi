import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { LocalDataSource } from 'ng2-smart-table';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { GoodService } from 'src/app/core/services/good/good.service';
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

  flagData: boolean = false;

  selectedRow: any;
  //Columns
  columns = COLUMNS;
  modalParent: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private paymentServicesService: PaymentServicesService,
    private authorityService: AuthorityService,
    private goodService: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: { add: false, delete: true, position: 'right' },
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
    this.filterTable();
  }

  filterTable() {
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
                field = 'filter.payServiceNumber';
                searchFilter = SearchFilter.EQ;
                break;
              case 'goodNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'service':
                field = 'filter.serviceKey';
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'requestDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'paymentDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'amount':
                field = 'filter.cost';
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
          this.listAppraisal(this.flagData);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.listAppraisal(this.flagData));
  }

  listAppraisal(flagData: boolean) {
    if (flagData != true) {
      return;
    }
    this.search();
  }

  getallCondition() {
    this.flagData = true;
    this.listAppraisal(this.flagData);
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      applicationDate: [null],
      fechaSol: [null, [Validators.required]],
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

  selectRows(rows: any) {
    console.log('row ', rows);
    if (rows.length > 0) {
      this.selectedRow = rows[0];
      console.log('Rows Selected->', this.selectedRow);
      this.statusGood(this.selectedRow.service);
      this.flagGoods = true;
    } else {
      this.flagGoods = false;
      this.selectedRow = [];
    }
  }

  openModal(modData?: any) {
    let dateSol = this.form.get('fechaSol').value;
    this.selectedRow.fechaSol = dateSol;
    modData = this.selectedRow;
    console.log('modData modal ', modData);
    let config: ModalOptions = {
      initialState: {
        modData,
        callback: (next: boolean) => {
          if (next) {
            console.log('respuesta exitosa ');
            this.getTableData();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalParent = this.modalService.show(
      GoodsServicePaymentComponent,
      config
    );
  }

  openModalBase(modData?: any) {
    let dateSol = this.form.get('fechaSol').value;
    this.selectedRow.fechaSol = dateSol;
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
        console.log('DataReturnModal-> ', data);
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
    this.dataRows = [];
    const { fechaSol } = this.form.value;
    // const params = {
    //   ...this.params.getValue(),
    //   ...this.columnFilters,
    // };

    const parametros = {
      ...this.params.getValue(),
      'filter.applicationDate': `$eq:${this.formatDate(fechaSol)}`,
    };

    this.paymentServicesService.getPayment(parametros).subscribe({
      next: resp => {
        if (resp != null && resp != undefined) {
          const params = new ListParams();
          console.log('Resp Data-> ', resp);
          const _params: any = params;

          for (let i = 0; i < resp.data.length; i++) {
            _params['filter.code'] = `$eq:${resp.data[i].serviceKey}`;
            this.authorityService
              .getDescriptionService(_params)
              .subscribe(response => {
                this.goodService
                  .getStatus(resp.data[i].good.status)
                  .subscribe(status => {
                    let item = {
                      request: resp.data[i].payServiceNumber,
                      goodNumber: resp.data[i].goodNumber,
                      descriptionGood: resp.data[i].good.description,
                      service: resp.data[i].serviceKey,
                      descriptionService: response.data[0].description,
                      requestDate: resp.data[i].applicationDate,
                      paymentDate: resp.data[i].payDate,
                      amount: resp.data[i].cost,
                      isPayment: resp.data[i].payDate != null ? 'S' : 'N',
                      goodStatus: resp.data[i].good.status,

                      status: status.description,
                    };
                    this.dataRows.push(item);
                    this.localdata.load(this.dataRows);
                    this.localdata.refresh();
                  });
              });
          }
          console.log('Total items-> ', this.dataRows);
          this.totalItems = resp.count;
        }
      },
      error: err => {},
    });
  }

  statusGood(status: any) {
    this.goodService.getStatus(status).subscribe({
      next: resp => {
        console.log('statusGood-> ', resp);
      },
      error: err => {},
    });
  }

  search() {
    this.getTableData();
  }

  deleteFile(params: any) {
    console.log('paramsDelete->', params);
    if (params.paymentDate != null) {
      this.alert('error', 'La solicitud no ha sido eliminada', '');
    } else {
      /**Delete */
      this.paymentServicesService.deletePayment(params.request).subscribe({
        next: resp => {
          console.log('Delete-> ', resp);
        },
        error: err => {},
      });
    }
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${year}-${month}-${day}`;
  }
}
