/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDictationXGood1 } from 'src/app/core/models/ms-dictation/dictation-x-good1.model';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GoodsDialogComponent } from '../dialogs/goods-dialog/goods-dialog.component';
import { DICTAMINATION_X_GOOD_COLUMNS } from './goods.columns';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
})
export class GoodsComponent extends BasePage implements OnInit, OnDestroy {
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: true,
      delete: false,
    },
    hideSubHeader: true,
    mode: 'external',
    columns: DICTAMINATION_X_GOOD_COLUMNS,
  };

  dataTable: IDictationXGood1[] = [];

  constructor(
    private modalService: BsModalService,
    private dictationService: DictationXGood1Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        this.getGoods();
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods());
  }

  getGoods() {
    this.dictationService.getAll().subscribe({
      next: data => {
        this.dataTable = data.data;
        this.data.load(this.dataTable);
        this.totalItems = data.count || 0;
        this.data.refresh();
        this.loading = false;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  openForm(dictationXGood?: IDictationXGood1) {
    console.log(dictationXGood);
    let config: ModalOptions = {
      initialState: {
        dictationXGood,
        callback: (next: boolean) => {
          if (next) this.getGoods();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodsDialogComponent, config);
  }
}
