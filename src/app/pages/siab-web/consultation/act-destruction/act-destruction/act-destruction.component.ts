import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings/proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { ButtonColumnSeeComponent } from 'src/app/shared/components/button-column-see/button-column-see.component';
import {
  ACT_DESTRUCTION_COLUMNS,
  ACT_DESTRUCTION_DETAIL_COLUMNS,
} from './act-destruction-columns';

@Component({
  selector: 'app-act-destruction',
  templateUrl: './act-destruction.component.html',
  styles: [],
})
export class ActDestructionComponent extends BasePage implements OnInit {
  actDestructionForm: FormGroup;
  form: FormGroup;

  //data1: any[] = [];
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  totalItems: number = 0;

  data1: LocalDataSource = new LocalDataSource();
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters1: any = [];
  totalItems1: number = 0;
  noActa: number;
  show: boolean = false;

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

  settings1 = { ...this.settings };

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private proceedingsService: ProceedingsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: true,
      actions: false,
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
        ...ACT_DESTRUCTION_COLUMNS,
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
              case 'caseNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'noDocument':
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
          this.getDataAll();
        }
      });

    this.data1
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
              case 'good':
                searchFilter = SearchFilter.EQ;
                break;
              case 'caseNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'quantity':
                searchFilter = SearchFilter.EQ;
                break;
              case 'receive':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params1 = this.pageFilter(this.params1);
          this.getDataAllDetail(this.noActa);
        }
      });
  }
  private prepareForm() {
    this.actDestructionForm = this.fb.group({
      recordsSearchCriteria: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
  }

  searchConsult() {
    this.show = false;
    this.noActa = this.actDestructionForm.get('recordsSearchCriteria').value;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataAll(this.noActa));
  }

  getDataAll(act?: number | string) {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    let body = {
      acta: act,
    };
    this.proceedingsService.getTypeActa(body, params).subscribe({
      next: resp => {
        console.log(resp);
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
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

  seeOfficial(event: any) {
    if (event) {
      this.show = true;
      this.proceedings = event.caseNumber;
      this.status = event.status;
      this.minutes = event.document;
      var formattedEla = new DatePipe('en-EN').transform(
        event.elaborationDate,
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
        .subscribe(() => this.getDataAllDetail(event.noDocument));
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
}
