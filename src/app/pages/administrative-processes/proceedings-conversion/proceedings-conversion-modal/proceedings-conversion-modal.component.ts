import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IConvertiongood } from 'src/app/core/models/ms-convertiongood/convertiongood';
import { ConvertiongoodService } from 'src/app/core/services/ms-convertiongood/convertiongood.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COUNT_ACTAS_COLUMNS } from '../proceedings-conversion-column';
import { IInitFormProceedingsBody } from '../proceedings-conversion/proceedings-conversion.component';
@Component({
  selector: 'app-proceedings-conversion-modal',
  templateUrl: './proceedings-conversion-modal.component.html',
  styles: [],
})
export class ProceedingsConversionModalComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table
  conversiones: IConvertiongood[] = [];
  columnFilters: any = [];
  pageParams: IInitFormProceedingsBody = null;
  conversionGood: IConvertiongood;
  edit = false;
  vaultSelect: any;
  totalItems2: number = 0;
  selectedRow: any | null = null;
  provider: any;
  providerForm: FormGroup = new FormGroup({});
  dataFactGood: LocalDataSource = new LocalDataSource();
  @Output() onSave = new EventEmitter<any>();

  // @Output() onConfirm = new EventEmitter<any>();
  constructor(
    private modalRef: BsModalRef,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private opcion: ModalOptions,
    private convertiongoodService: ConvertiongoodService,
    protected goodprocessService: GoodProcessService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COUNT_ACTAS_COLUMNS,
      },
    };
  }
  ngOnInit(): void {
    this.providerForm.patchValue(this.provider);
    this.dataFactGood
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'idConversion' ||
            filter.field == 'fileNumber' ||
            filter.field == 'goodFatherNumber' ||
            filter.field == 'witnessOic' ||
            filter.field == 'cveActaConv'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGoodByCOnversiones();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodByCOnversiones());
  }

  return() {
    this.modalRef.hide();
  }
  getGoodByCOnversiones(): void {
    this.loading = true;
    let para = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.convertiongoodService
      .getAllGoodsConversions(para, this.provider.idConversion)
      .subscribe({
        next: response => {
          this.conversiones = response.data;
          this.totalItems2 = response.count | 0;
          this.dataFactGood.load(response.data);
          this.dataFactGood.refresh();
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }
  onUserRowSelect(row: IConvertiongood): void {
    this.selectedRow = row;
    console.log(this.selectedRow);
  }

  handleSuccess(): void {
    this.loading = true;
    this.loading = false;
    for (const prop in this.selectedRow) {
      if (Object.prototype.hasOwnProperty.call(this.selectedRow, prop)) {
        console.log(`${prop}: ${this.selectedRow[0].idConversion}`);
      }
    }
    this.onSave.emit(this.selectedRow);
    this.router.navigate(
      ['/pages/administrative-processes/proceedings-conversion'],
      {
        queryParams: {
          origin: 'FACTDBCONVBIEN',
          PAR_IDCONV: Number(this.selectedRow[0].id),
        },
      }
    );
  }
}
