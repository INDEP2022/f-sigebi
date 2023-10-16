import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Provisional Data
//Components
import { LocalDataSource } from 'ng2-smart-table';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { PaymentServicesService } from 'src/app/core/services/ms-paymentservices/payment-services.service';
import { GoodsServicePaymentComponent } from '../goods-service-payments/goods-service-payment.component';

@Component({
  selector: 'app-global-service-payment',
  templateUrl: './global-service-payment.component.html',
  styles: [],
})
export class GlobalServicePaymentComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  localdata: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataRows: any[] = [];

  requestId: number;
  serviceId: string = '';
  globalAmount: number;
  paymentDate: any;
  aplicationDate: any;

  modalParent: BsModalRef;

  selectedRow: any;
  flagGoods: boolean = false;

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
      hideSubHeader: false,
      actions: { add: false, delete: false, edit: false, position: 'right' },
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

  filterTable(fecha: string) {
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
          this.getTable(fecha);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTable(fecha));
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

  /*openModal2(edit?: any) {
    const modalRef = this.modalService.show(GoodsServicePaymentComponent, {
      //initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.data.subscribe(data => {
      if (data) {
        /*...
      }
    });
  }*/

  selectRows(rows: any) {
    console.log('row ', rows);
    if (rows.length > 0) {
      this.selectedRow = rows[0];
      console.log('Rows Selected->', this.selectedRow);
      this.flagGoods = true;
    } else {
      this.flagGoods = false;
      this.selectedRow = [];
    }
  }

  openModal(edit?: any) {
    let dateSol = this.aplicationDate;
    this.selectedRow.fechaSol = dateSol;
    edit = this.selectedRow;
    let config: ModalOptions = {
      initialState: {
        edit,
        callback: (next: boolean) => {
          if (next) {
            console.log('respuesta exitosa ');
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

  getPaymentServiceID(id: number) {
    this.paymentServicesService.getPaymentServiceId(id).subscribe({
      next: resp => {
        console.log('getPaymentServiceID-> ', resp);
        this.aplicationDate = resp.applicationDate;
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
        this.filterTable(this.aplicationDate);
      },
      error: err => {
        console.log('Error Service Search-> ', err);
      },
    });
  }

  getTable(fecha: string) {
    this.dataRows = [];

    const parametros = {
      ...this.params.getValue(),
      'filter.applicationDate': `$eq:${fecha}`,
    };
    const params = new ListParams();
    const _params: any = params;

    this.paymentServicesService.getPayment(parametros).subscribe(dataTable => {
      console.log('Data TableService -> ', dataTable);
      for (let i = 0; i < dataTable.data.length; i++) {
        _params['filter.code'] = `$eq:${dataTable.data[i].serviceKey}`;
        this.authorityService
          .getDescriptionService(_params)
          .subscribe(description => {
            let item = {
              request: dataTable.data[i].payServiceNumber,
              goodNumber: dataTable.data[i].goodNumber,
              descriptionGood: dataTable.data[i].good.description,
              service: dataTable.data[i].serviceKey,
              descriptionService: description.data[0].description,
              requestDate: dataTable.data[i].applicationDate,
              amount: dataTable.data[i].cost,
            };
            this.dataRows.push(item);
            this.localdata.load(this.dataRows);
            this.localdata.refresh();
          });
      }
      this.totalItems = dataTable.count;
    });
  }

  dateSet(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }
}
