import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { IGoodsResDev } from 'src/app/core/models/ms-rejectedgood/goods-res-dev-model';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { NotifyAssetsImproprietyFormComponent } from '../notify-assets-impropriety-form/notify-assets-impropriety-form.component';
import { RefuseClarificationModalComponent } from '../refuse-clarification-modal/refuse-clarification-modal.component';
import { LIST_ASSETS_COLUMN } from './list-assets-columns';
import { NOTIFY_ASSETS_COLUMNS } from './notify-assets-columns';

@Component({
  selector: 'app-notification-assets-tab',
  templateUrl: './notification-assets-tab.component.html',
  styles: [],
})
export class NotificationAssetsTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() isSaving: boolean;
  @Input() process: string = '';
  idRequest: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columns: IGoodsResDev[] = [];
  columnFilters: any = [];
  totalItems: number = 0;
  notifications: IGoodsResDev;
  notificationsList: IChatClarifications[] = [];

  settings2: any;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs2: any[] = [];
  totalItems2: number = 0;
  notifyAssetsSelected: any[] = [];
  bsModalRef: BsModalRef;

  loading1 = this.loading;
  loading2 = this.loading;

  //verificar por el estado del campo transferente si es SAT O otro
  byInterconnection: boolean = false;

  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private rejectedGoodService: RejectedGoodService,
    private chatClarificationsService: ChatClarificationsService
  ) {
    super();
    this.idRequest = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    //la accion del guardar llega al hijo
    console.log(this.isSaving);
  }

  ngOnInit(): void {
    console.log('ID de solicitud: ', this.idRequest);
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: { ...LIST_ASSETS_COLUMN },
    };
    this.settings2 = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: { ...NOTIFY_ASSETS_COLUMNS },
    };

    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'enterExit':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getGoodsByRequest();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsByRequest());
  }

  getGoodsByRequest() {
    this.loading1 = true;
    const params1 = new ListParams();
    params1['filter.applicationId'] = `$eq:${this.idRequest}`;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
      ...params1,
    };

    this.rejectedGoodService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        this.loading1 = false;
      },
      error: error => (this.loading1 = false),
    });
  }

  rowsSelected(event: any) {
    const idNotify = { ...this.notifications };
    this.notificationsList = [];
    this.notifications = event.data;
    console.log(idNotify.goodId);
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getClarificationsByGood(idNotify.goodId));
  }

  getClarificationsByGood(id: number) {
    this.loading2 = true;
    const params1 = new ListParams();
    params1['filter.goodId'] = `$eq:${id}`;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
      ...params1,
    };
    this.chatClarificationsService.getAllFilter(params).subscribe({
      next: response => {
        this.notificationsList = response.data;
        this.totalItems2 = response.count;
        this.loading2 = false;
      },
      error: error => (this.loading2 = false),
    });
  }

  notifyAssetRowSelected(event: any) {
    //verificar cuantas aclaraciones se pueden seleccionar para aceptarlas
    this.notifyAssetsSelected = event.selected;
  }

  verifyClarification() {}

  finishClarifiImpro() {
    let message =
      '¿Esta seguro de que desea finalizar la aclaración?\nSe sugiere subir documentación soporte para esta sección';
    this.alertQuestion(
      undefined,
      'Confirmación de Aclaración',
      message,
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
        console.log('El estatus de la aclaración cambia a "Aclarado"');
        if (
          this.notifyAssetsSelected[0].typeClarification === 'IMPROCEDENCIA'
        ) {
          //el bien se marca como improcedente y desaparece
        } else {
          //estatys cambia a "aclarado"
        }
      }
    });
  }

  acceptClariImpro() {
    console.log(this.notifyAssetsSelected.length);

    if (this.notifyAssetsSelected.length < 1) {
      this.message('Error', 'Seleccione almenos un registro!');
      return;
    }
    this.openModal();
  }

  refuseClarification() {
    let config: ModalOptions = {
      initialState: {
        clarification: this.notifyAssetsSelected,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      RefuseClarificationModalComponent,
      config
    );
    //ver si los datos se devolveran por el mismo modal o se guardan

    /*  this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    }); */
  }

  message(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: undefined,
      width: 300,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        return;
      }
    });
  }

  openModal(): void {
    let config: ModalOptions = {
      initialState: {
        clarification: this.notifyAssetsSelected,
        isInterconnection: this.byInterconnection,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      NotifyAssetsImproprietyFormComponent,
      config
    );

    /*  this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    }); */
  }
}
