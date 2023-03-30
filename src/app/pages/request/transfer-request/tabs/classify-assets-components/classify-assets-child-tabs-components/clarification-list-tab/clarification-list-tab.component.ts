import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRejectGood } from 'src/app/core/models/good-reject/good-reject.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { ClarificationService } from 'src/app/core/services/catalogs/clarification.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ClarificationFormTabComponent } from '../clarification-form-tab/clarification-form-tab.component';
import { CLARIFICATION_COLUMNS } from './clarification-columns';

@Component({
  selector: 'app-clarification-list-tab',
  templateUrl: './clarification-list-tab.component.html',
  styles: [],
})
export class ClarificationListTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() good: IGood;
  paragraphs: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  idClarification: number = 0;
  constructor(
    private modalService: BsModalService,
    private rejectedGoodService: RejectedGoodService,
    private clarificationService: ClarificationService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.good) this.getData();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      columns: CLARIFICATION_COLUMNS,
    };
    this.settings.actions.delete = true;

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData(): void {
    if (this.good) {
      this.loading = true;
      this.params.getValue()['filter.goodId'] = this.good.id;
      this.rejectedGoodService.getAllFilter(this.params.getValue()).subscribe({
        next: async data => {
          const info = data.data.map(async item => {
            this.idClarification = item.clarificationId;
            const clarification: any = await this.getClarification(
              item.clarificationId
            );
            item.clarificationId = clarification;
          });

          Promise.all(info).then(() => {
            this.paragraphs.load(data.data);
            this.totalItems = data.count;
            this.loading = false;
          });
        },
        error: error => {
          this.loading = false;
        },
      });
    }
  }

  getClarification(id: number) {
    return new Promise((resolve, reject) => {
      this.clarificationService.getById(id).subscribe({
        next: response => {
          resolve(response.clarification);
        },
      });
    });
  }

  openForm(clarification?: IRejectGood): void {
    if (clarification?.answered == 'CONTESTADA') {
      this.onLoadToast(
        'warning',
        'No se puede editar una aclaración ya contestada',
        ''
      );
    } else {
      if (clarification?.clarificationId)
        clarification.clarificationId = this.idClarification;

      let config: ModalOptions = {
        initialState: {
          docClarification: clarification,
          goodTransfer: this.good,
          callback: (next: boolean) => {
            if (next) this.getData();
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ClarificationFormTabComponent, config);
    }
  }

  delete(clarification: IRejectGood) {
    if (clarification.answered == 'CONTESTADA') {
      this.onLoadToast(
        'warning',
        'No se puede eliminar una aclaración ya contestada',
        ''
      );
    } else {
      /*this.rejectedGoodService
        .remove(clarification.rejectNotificationId)
        .subscribe({
          next: response => {
            this.onLoadToast('success', `Aclaración eliminada correctamente`, ``);
            this.getData();
          },
        }); */
    }
  }
}
