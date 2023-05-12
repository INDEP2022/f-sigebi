import { DatePipe } from '@angular/common';
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
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IRejectGood } from 'src/app/core/models/good-reject/good-reject.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { ClarificationService } from 'src/app/core/services/catalogs/clarification.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GetGoodResVeService } from 'src/app/core/services/ms-rejected-good/goods-res-dev.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
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
  @Input() request: any;
  paragraphs: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  idClarification: number = 0;
  clarificationsLength: any;
  task: any;
  statusTask: any = '';
  constructor(
    private modalService: BsModalService,
    private rejectedGoodService: RejectedGoodService,
    private clarificationService: ClarificationService,
    private goodResDevService: GetGoodResVeService,
    private goodServices: GoodService,
    private chatClarificationService: ChatClarificationsService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.good) this.getData();
  }

  ngOnInit(): void {
    this.task = JSON.parse(localStorage.getItem('Task'));

    // DISABLED BUTTON - FINALIZED //
    this.statusTask = this.task.status;

    this.settings = {
      ...TABLE_SETTINGS,
      columns: CLARIFICATION_COLUMNS,
    };
    this.settings.actions.delete = true;

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
    console.log(this.request);
  }

  getData(): void {
    if (this.good) {
      this.loading = true;
      this.paragraphs = new LocalDataSource();
      this.params.getValue()['filter.goodId'] = this.good.id;
      this.rejectedGoodService.getAllFilter(this.params.getValue()).subscribe({
        next: async (data: any) => {
          const length = data.count;
          this.clarificationsLength = length;
          const info = data.data.map(async (item: any) => {
            this.idClarification = item.clarificationId;
            const clarification: any = await this.getClarification(
              item.clarificationId
            );
            item['clarificationName'] = clarification;
            const date = new Date(item.rejectionDate);
            const datePipe = new DatePipe('en-US');
            item['rejectionDate'] = datePipe.transform(
              date,
              'dd/MM/yyyy',
              'UTC'
            );
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
      let params = new ListParams();
      params['filter.id'] = `$eq:${id}`;
      this.clarificationService.getAll(params).subscribe({
        next: resp => {
          resolve(resp.data[0].clarification);
        },
        error: error => {
          console.log(error.error.message);
          resolve('');
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
          request: this.request,
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

  delete(clarification: any) {
    if (clarification.answered == 'CONTESTADA') {
      this.onLoadToast(
        'warning',
        'No se puede eliminar una aclaración ya contestada',
        ''
      );
    } else {
      Swal.fire({
        title: 'Eliminar Aclaración?',
        text: '¿Desea eliminar la aclaración?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#9D2449',
        cancelButtonColor: '#B38E5D',
        confirmButtonText: 'Eliminar',
      }).then(async (result: any) => {
        const idChatClarification =
          clarification['chatClarification'].idClarification;
        const charResult = await this.removeChatClarification(
          idChatClarification
        );
        this.rejectedGoodService
          .remove(clarification.rejectNotificationId)
          .subscribe({
            next: async response => {
              this.onLoadToast(
                'success',
                `Aclaración eliminada correctamente`,
                ``
              );
              console.log(
                'cantidad de aclaraciones:',
                this.clarificationsLength
              );
              if (this.clarificationsLength === 1) {
                const goodResDev: any = await this.getGoodResDev(
                  Number(this.good.id)
                );
                await this.removeDevGood(Number(goodResDev));
                let body: any = {};
                body['id'] = this.good.id;
                body['goodId'] = this.good.goodId;
                body.processStatus = 'REGISTRO_SOLICITUD';
                body.goodStatus = 'REGISTRO_SOLICITUD';
                await this.updateGoods(body);
              }
              setTimeout(() => {
                this.getData();
              }, 400);
            },
            error: error => {
              console.log(error);
              this.onLoadToast(
                'error',
                'Error al eliminar',
                `No se pudo eliminar el bien ${error.error.message}`
              );
            },
          });
      });
    }
  }

  updateGoods(body: any) {
    return new Promise((resolve, reject) => {
      this.goodServices.update(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          console.log(error.error.message);
          this.alert('error', 'Error al actualizar', 'No actualizar el bien');
          reject(false);
        },
      });
    });
  }

  removeDevGood(id: number) {
    return new Promise((resolve, reject) => {
      this.goodResDevService.remove(id).subscribe({
        next: resp => {
          console.log('good-res-dev removed', resp);
          resolve(true);
        },
        error: error => {
          console.log('good-res-dev remove error', error);
          this.onLoadToast(
            'error',
            'Error interno',
            'No se pudo eliminar el bien-res-deb'
          );
        },
      });
    });
  }

  getGoodResDev(goodId: number) {
    return new Promise((resolve, reject) => {
      let params = new FilterParams();
      params.addFilter('goodId', goodId);
      let filter = params.getParams();
      this.goodResDevService.getAllGoodResDev(filter).subscribe({
        next: (resp: any) => {
          if (resp.data) {
            resolve(resp.data[0].goodresdevId);
          }
        },
        error: error => {
          this.onLoadToast(
            'error',
            'Error interno',
            'No se pudo obtener el bien-res-dev'
          );
        },
      });
    });
  }

  removeChatClarification(id: number | string) {
    return new Promise((resolve, reject) => {
      this.chatClarificationService.remove(id).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          this.loader.load = false;
          reject(false);
          console.log(error);
          this.onLoadToast(
            'error',
            'Error al eliminar',
            'No se pudo eliminar el registro de la tabla Chat Aclaraciones'
          );
        },
      });
    });
  }
}
