import { DatePipe } from '@angular/common';
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
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RELEASE_REPORT_COLUMNS } from '../release-letter-collumn';

@Component({
  selector: 'app-find-release-letter',
  templateUrl: './find-release-letter.component.html',
  styles: [],
})
export class FindReleaseLetterComponent extends BasePage implements OnInit {
  provider: any;
  letters: IComerLetter[] = [];
  providerForm: FormGroup = new FormGroup({});
  dataFactLetter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedRow: any | null = null;
  P_DIRECCION: string = 'M';
  loteId: number = null;
  @Output() onSave = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  dataVal: any;
  constructor(
    private modalRef: BsModalRef,
    private comerLetterService: ComerLetterService,
    private comerEventService: ComerEventService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: false,
        delete: true,
      },
      delete: {
        deleteButtonContent:
          '<i class="fa fa-trash text-danger mx-2 ml-5"></i>',
        confirmDelete: true,
      },
      columns: {
        ...RELEASE_REPORT_COLUMNS,
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
            // filter.field == 'lotsId' ||
            filter.field == 'addressedTo' ||
            filter.field == 'position' ||
            filter.field == 'invoiceNumber' ||
            filter.field == 'invoiceDate' ||
            filter.field == 'ccp3' ||
            filter.field == 'ccp4' ||
            filter.field == 'ccp5'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              if (filter.field == 'invoiceDate') {
                filter.search = this.datePipe.transform(
                  filter.search,
                  'yyyy-MM-dd'
                );
              }
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
    this.loading = true;
    // if (this.P_DIRECCION) {
    //   this.columnFilters['address'] = `$eq:${this.P_DIRECCION}`;
    // }
    if (this.loteId) {
      this.columnFilters['filter.lotsId'] = `$eq:${this.loteId}`;
    }
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    // this.comerEventService.getAllEvent(params).subscribe({
    this.comerLetterService.getAll(params).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.letters = data.data;
        this.totalItems = data.count;
        this.dataFactLetter.load(this.letters);
        this.dataFactLetter.refresh();
      },
      error: () => {
        this.loading = false;
        console.error('error al filtrar cartas');
        this.totalItems = 0;
        this.dataFactLetter.load([]);
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
      this.alert('warning', 'Selecciona un registro para continuar', '');
      return;
    }
    this.loading = true;
    this.onSave.emit(this.selectedRow);
    this.loading = false;
    this.modalRef.hide();
  }

  remove(event: any) {
    this.alertQuestion(
      'question',
      'Se eliminará el registro',
      '¿Desea Continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.comerLetterService.removeLib(event.id).subscribe({
          next: value => {
            this.getAllComerLetter();
            if (this.dataVal)
              if (this.dataVal.id == event.id) {
                this.onDelete.emit(true);
              }

            this.selectedRow = null;
            this.alert('success', 'Registro eliminado correctamente', '');
          },
          error: err => {
            this.alert('warning', 'No se pudo eliminado el registro', '');
          },
        });
      }
    });
  }
}
