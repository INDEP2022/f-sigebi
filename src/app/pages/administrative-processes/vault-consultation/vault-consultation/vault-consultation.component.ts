import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil, BehaviorSubject } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ISafe } from 'src/app/core/models/catalogs/safe.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { ModalListGoodsComponent } from '../modal-list-goods/modal-list-goods.component';
import { COUNT_SAFE_COLUMNS } from './vault-consultation-column';
@Component({
  selector: 'app-vault-consultation',
  templateUrl: './vault-consultation.component.html',
  styles: [],
})
export class VaultConsultationComponent
  extends BasePage implements OnInit {
  totalItems: number;
  form: FormGroup;
  idSafe: number = 0;
  vaults: ISafe[] = [];
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataFactGen: LocalDataSource = new LocalDataSource();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private safeService: SafeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...COUNT_SAFE_COLUMNS },
      noDataMessage: 'No se encontrarón registros',
    };
  }
  ngOnInit(): void {
    this.dataFactGen
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'idSafe' ||
              filter.field == 'description' ||
              filter.field == 'ubication' ||
              filter.field == 'manager' ||
              filter.field == 'stateCode' ||
              filter.field == 'municipalityCode' ||
              filter.field == 'cityCode' ||
              filter.field == ' localityCode'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.search();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.search());
  }

  openForm(provider?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      provider,
      callback: (next: boolean) => {
        if (next) this.idSafe;
      },
    };
    this.modalService.show(ModalListGoodsComponent, modalConfig);
  }

  openModal(context?: Partial<ModalListGoodsComponent>) {
    const modalRef = this.modalService.show(ModalListGoodsComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  search() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.safeService.getAll(params).subscribe({
      next: (data: any) => {
        this.totalItems = data.count;
        this.vaults = data.data;
        this.dataFactGen.load(data.data);
        this.dataFactGen.refresh();
        this.loading = false;
      },
    });
  }
  select(event: any) {
    event.data
      ? this.openModal(event.data.idSafe)
      : this.alert('info', 'Ooop...', 'Esta Bóveda no contiene Bines');
  }

}
