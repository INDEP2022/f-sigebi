/** BASE IMPORT */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import {
  IDataBienes,
  IDictationXGood1,
} from 'src/app/core/models/ms-dictation/dictation-x-good1.model';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GoodsDialogComponent } from '../dialogs/goods-dialog/goods-dialog.component';
import { DICTAMINATION_X_GOOD_COLUMNS } from './goods.columns';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
})
export class GoodsComponent
  extends BasePage
  implements OnInit, OnDestroy, OnChanges
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  data1: LocalDataSource = new LocalDataSource();
  tableSettings = {
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      delete: false,
      add: false,
      position: 'left',
    },
    mode: 'external',
    columns: { ...DICTAMINATION_X_GOOD_COLUMNS },
    noDataMessage: 'No se encontrarón registros',
  };

  dataTable: IDictationXGood1[] = [];

  @Input() set loadingData(value: boolean) {
    this.loading = value;
  }

  @Input() set data(value: IDataBienes) {
    this.dataTable = value?.data;
    this.totalItems = +value?.count || 0;
  }

  @Input() dictation: IDictation;

  @Output() loadingDialog = new EventEmitter<boolean>();

  constructor(
    private modalService: BsModalService,
    private dictationService: DictationXGood1Service
  ) {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['data']) {
      if (changes['data']?.currentValue?.length > 0) {
        this.loading = false;
      }
    }
  }

  openForm(dictationXGood?: IDictationXGood1) {
    console.log(dictationXGood);
    let config: ModalOptions = {
      initialState: {
        dataCreate: this.dictation
          ? {
              ofDictNumber: this.dictation.id,
              typeDict: this.dictation.typeDict,
            }
          : null,
        dictationXGood,
        callback: (next: boolean) => {
          if (next) this.loadingDialog.emit(next);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodsDialogComponent, config);
  }
}
