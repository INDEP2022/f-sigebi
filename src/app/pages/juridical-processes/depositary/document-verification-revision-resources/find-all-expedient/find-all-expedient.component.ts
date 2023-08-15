import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { ComerLetterService } from 'src/app/core/services/ms-parametercomer/comer-letter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EXPEDIENT_COLUMNS } from '../columns';

@Component({
  selector: 'app-find-all-expedient',
  templateUrl: './find-all-expedient.component.html',
  styles: [],
})
export class FindAllExpedientComponent extends BasePage implements OnInit {
  // loading: boolean = false;
  provider: any;
  loadingModalE: boolean = false;
  expedients: IExpedient[] = [];
  providerForm: FormGroup = new FormGroup({});
  dataFactExp: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedRow: any | null = null;
  @Output() onSave = new EventEmitter<any>();

  constructor(
    private modalRef: BsModalRef,
    private comerLetterService: ComerLetterService,
    private expedientService: ExpedientService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...EXPEDIENT_COLUMNS,
      },
    };
  }

  ngOnInit(): void {
    this.loadingModalE = true;
    this.providerForm.patchValue(this.provider);
    this.dataFactExp
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'preliminaryInquiry' ||
            filter.field == 'criminalCase' ||
            filter.field == 'expTransferNumber' ||
            filter.field == 'insertDate' ||
            filter.field == 'authorityNumber' ||
            filter.field == 'identifier' ||
            filter.field == 'signatory' ||
            filter.field == 'crimeKey' ||
            filter.field == 'expedientType' ||
            filter.field == 'courtName' ||
            filter.field == 'indicatedName' ||
            filter.field == 'insertedBy'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getExpedient(this.params.getValue());
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExpedient(this.params.getValue()));
  }

  // getAllExpedient() {
  //   this.loading = true;
  //   let params = {
  //     ...this.params.getValue(),
  //     ...this.columnFilters,
  //   };
  //   this.comerLetterService.getAll(params).subscribe({
  //     next: (data: any) => {
  //       this.loading = false;
  //       this.expedients = data.data;
  //       this.totalItems = data.count;
  //       this.dataFactExp.load(this.expedients);
  //       this.dataFactExp.refresh();
  //     },
  //     error: () => {
  //       this.loading = false;
  //       console.error('error al filtrar cartas');
  //     },
  //   });
  // }

  getExpedient(lparams: ListParams) {
    this.loadingModalE = true;
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('preliminaryInquiry', lparams.text, SearchFilter.LIKE);

    // para filtrar
    const params2 = {
      ...params,
      ...this.columnFilters,
    };
    this.expedientService.getExpedientList(params2).subscribe({
      next: data => {
        this.loadingModalE = false;
        this.expedients = data.data;
        this.totalItems = data.count;
        this.dataFactExp.load(this.expedients);
        this.dataFactExp.refresh();
      },
      error: () => {
        this.loading = false;
        console.error('no existe el expediente');
      },
    });
  }
  onUserRowSelect(row: any): void {
    if (row.isSelected) {
      this.selectedRow = row.data;
    } else {
      this.selectedRow = null;
    }
    console.log(this.selectedRow);
  }
  return() {
    this.modalRef.hide();
  }
  handleSuccess(): void {
    this.loading = true;
    this.onSave.emit(this.selectedRow);
    this.loading = false;
    this.modalRef.hide();
  }
}
