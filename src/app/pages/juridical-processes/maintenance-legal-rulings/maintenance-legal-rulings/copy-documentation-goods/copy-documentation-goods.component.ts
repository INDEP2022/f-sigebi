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
import {
  ICopiesOfficialOpinion,
  IDataCopiasOficio,
} from 'src/app/core/models/ms-dictation/copies-official-opinion.model';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { CopiesOfficialOpinionService } from 'src/app/core/services/catalogs/copies-official-opinion.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CopyDocumentationGoodsDialogComponent } from '../dialogs/copy-documentation-goods-dialog/copy-documentation-goods-dialog.component';
import { COPY_DOCUMENTATION_GOODS_COLUMNS } from './copy-documentation-goods.columns';

@Component({
  selector: 'app-copy-documentation-goods',
  templateUrl: './copy-documentation-goods.component.html',
})
export class CopyDocumentationGoodsComponent
  extends BasePage
  implements OnInit, OnDestroy, OnChanges
{
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  tableSettings = {
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      delete: true,
      add: false,
      position: 'left',
    },
    columns: { ...COPY_DOCUMENTATION_GOODS_COLUMNS },
    noDataMessage: 'No se encontrarón registros',
  };

  dataTable: ICopiesOfficialOpinion[] = [];

  @Input() dictation: IDictation;
  @Input() set loadingData(value: boolean) {
    this.loading = value;
  }

  @Input() set data(value: IDataCopiasOficio) {
    this.dataTable = value?.data;
    this.totalItems = value?.count || 0;
  }

  @Output() loadingDialog = new EventEmitter<boolean>();

  constructor(
    private modalService: BsModalService,
    private copiesOfficialOpinionService: CopiesOfficialOpinionService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['data']) {
      if (changes['data']?.currentValue?.length > 0) {
        this.loading = false;
      }
    }
  }

  ngOnInit(): void {}

  openForm(copiesOfficial?: ICopiesOfficialOpinion) {
    let config: ModalOptions = {
      initialState: {
        dataCreate: this.dictation
          ? {
              numberOfDicta: this.dictation.id,
              typeDictamination: this.dictation.typeDict,
            }
          : null,
        copiesOfficial,
        callback: (next: boolean) => {
          if (next) this.loadingDialog.emit(true);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CopyDocumentationGoodsDialogComponent, config);
  }
  showDeleteAlert(event: any) {
    this.alertQuestion(
      'question',
      'Selecciono el C.C.P. ' + event.recipientCopy + '. ¿Desea eliminarlo?',
      ''
    ).then(async question => {
      if (question.isConfirmed) {
        if (event.id == undefined) {
        } else {
          // DELETE COPIA PARA
          this.copiesOfficialOpinionService.remove(event).subscribe({
            next: data => {
              console.log('UPDATE COPIES DICTAMEN', data);
              this.onLoadToast('success', 'Se eliminó correctamente', '');
              this.loadingDialog.emit(true);
            },
            error: error => {
              console.log(error);
              this.onLoadToast(
                'error',
                'Ocurrió un Error al Eliminar la CCP',
                error.error.message
              );
            },
          });
        }
      }
    });
  }
}
