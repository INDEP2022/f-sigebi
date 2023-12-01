import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings/proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { ButtonColumnSeeComponent } from 'src/app/shared/components/button-column-see/button-column-see.component';
import {
  ACT_DELIVERY_RECEPTION_COLUMNS,
  ACT_DESTRUCTION_DETAIL_COLUMNS,
} from './act-delivery-reception-columns';

@Component({
  selector: 'app-act-delivery-reception',
  templateUrl: './act-delivery-reception.component.html',
  styles: [],
})
export class ActDeliveryReceptionComponent extends BasePage implements OnInit {
  //form: FormGroup;
  form: FormGroup = new FormGroup({});

  //data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  columnFilters: any = [];
  show: boolean = false;

  data1: LocalDataSource = new LocalDataSource();
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters1: any = [];
  totalItems1: number = 0;

  proceedings: string;
  status: string;
  minutes: string;
  elaborationDate: string;
  receptionDate: string;
  captureDate: string;
  address: string;
  observations: string;
  delivery: string;
  receives: string;
  receiptElaborationDate: string;
  witness: string;
  deliveryDateOfGoods: string;
  scanFolio: string;

  criterio: number = 0;

  settings1 = { ...this.settings };

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private proceedingsService: ProceedingsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        watch: {
          title: 'Ver',
          width: '5%',
          type: 'custom',
          sort: false,
          filter: false,
          renderComponent: ButtonColumnSeeComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              console.log(row);
              this.seeOfficial(row);
            });
          },
        },
        ...ACT_DELIVERY_RECEPTION_COLUMNS,
      },
    };
    this.settings1 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: ACT_DESTRUCTION_DETAIL_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'rank':
                searchFilter = SearchFilter.EQ;
                break;
              case 'expediente':
                searchFilter = SearchFilter.EQ;
                break;
              case 'no_acta':
                searchFilter = SearchFilter.EQ;
                break;
              case 'fecha':
                //filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
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
          this.getData(this.criterio);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData(this.criterio));
  }

  private prepareForm() {
    this.form = this.fb.group({
      recordsSearchCriteria: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(15)],
      ],
    });
  }

  seeOfficial(event: any) {
    if (event) {
      this.show = true;
      this.proceedings = event.expediente;
      this.status = event.estatus;
      this.minutes = event.acta;
      var formattedEla = new DatePipe('en-EN').transform(
        event.fecha,
        'dd/MM/yyyy',
        'UTC'
      );
      this.elaborationDate = formattedEla;
      var formattedReception = new DatePipe('en-EN').transform(
        event.physicalReceptionDate,
        'dd/MM/yyyy',
        'UTC'
      );
      this.receptionDate = formattedReception;
      var formattedCapture = new DatePipe('en-EN').transform(
        event.captureDate,
        'dd/MM/yyyy',
        'UTC'
      );
      this.captureDate = formattedCapture;
      this.address = event.address;
      this.observations = event.observations;
      this.delivery = event.delivery;
      this.receives = event.receivedBy;
      var formattedElaReceipt = new DatePipe('en-EN').transform(
        event.receiptCreationDate,
        'dd/MM/yyyy',
        'UTC'
      );
      this.receiptElaborationDate = formattedElaReceipt;
      this.witness = event.auditingWitness;
      var formattedDateGoods = new DatePipe('en-EN').transform(
        event.goodsDeliveryDate,
        'dd/MM/yyyy',
        'UTC'
      );
      this.deliveryDateOfGoods = formattedDateGoods;
      this.scanFolio = event.scanningID;
      this.params1
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getDataAllDetail(event.no_acta));
    }
  }

  getDataAllDetail(acta?: number | string) {
    this.loading = true;
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };
    let body = {
      acta: acta,
    };
    this.proceedingsService.getTypeActaDetail(body, params).subscribe({
      next: resp => {
        console.log(resp);
        this.data1.load(resp.data);
        this.data1.refresh();
        this.totalItems1 = resp.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems1 = 0;
      },
    });
  }

  search() {
    if (this.form.get('recordsSearchCriteria').value) {
      this.criterio = this.form.get('recordsSearchCriteria').value;
      console.log(this.criterio);

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getData(this.criterio));
    } else {
      this.alert('error', 'Error se debe ingresar un No. de Acta', ``);
    }
  }

  getData(noActa?: number) {
    if (noActa) {
      this.params.getValue()['filter.no_acta'] = `$eq:${noActa}`;
      this.loading = true;
      let param = {
        ...this.params.getValue(),
        ...this.columnFilters,
      };
      this.proceedingsDeliveryReceptionService.getSearchActa(param).subscribe({
        next: resp => {
          console.log(resp.data);
          this.totalItems = resp.count;
          this.data.load(resp.data);
          this.data.refresh();
          //console.log(this.totalItems2, resp);
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          this.data.load([]);
          this.data.refresh();
          this.totalItems = 0;
        },
      });
    }
  }

  rowsSelected(event: any) {
    console.log(event.data);
  }

  /*reset(){
    this.form.get('recordsSearchCriteria').setValue('');
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }*/
}
