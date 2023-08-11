import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerLetter } from 'src/app/core/models/ms-parametercomer/comer-letter';
import { ComerLetterService } from 'src/app/core/services/ms-parametercomer/comer-letter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RESPO_REPORT_COLUMNS } from '../resp-letter-columns';

@Component({
  selector: 'app-find-resp-letter',
  templateUrl: './find-resp-letter.component.html',
  styles: [],
})
export class FindRespLetterComponent extends BasePage implements OnInit {
  provider: any;
  letters: IComerLetter[] = [];
  providerForm: FormGroup = new FormGroup({});
  dataFactLetter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedRow: any | null = null;
  @Output() onSave = new EventEmitter<any>();
  loteId: number = null;

  constructor(
    private modalRef: BsModalRef,
    private comerLetterService: ComerLetterService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...RESPO_REPORT_COLUMNS,
      },
    };
  }

  ngOnInit(): void {
    this.loading = false;
    this.providerForm.patchValue(this.provider);
    this.dataFactLetter
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
            filter.field == 'lotsId' ||
            filter.field == 'addressedTo' ||
            filter.field == 'position' ||
            filter.field == 'paragraph1' ||
            filter.field == 'invoiceNumber' ||
            filter.field == 'invoiceDate' ||
            filter.field == 'signatory' ||
            filter.field == 'ccp1' ||
            filter.field == 'ccp2' ||
            filter.field == 'ccp3' ||
            filter.field == 'ccp4' ||
            filter.field == 'ccp5'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getAllComerLetter();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllComerLetter());
  }

  getAllComerLetter() {
    if (this.loteId) {
      this.columnFilters['filter.lotsId'] = `$eq:${this.loteId}`;
    }
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.comerLetterService.getAll(params).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.letters = data.data;
        this.totalItems = data.count;
        this.dataFactLetter.load(this.letters);
        this.dataFactLetter.refresh();
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
    if (!this.selectedRow) {
      this.alert('warning', 'Selecciona un Registro para Continuar', '');
      return;
    }
    this.loading = true;
    this.onSave.emit(this.selectedRow);
    this.loading = false;
    this.modalRef.hide();
  }
}
