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
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { IClarificationGoodsReject } from 'src/app/core/models/ms-chat-clarifications/clarification-goods-reject-notifi-model';
import { IGoodsResDev } from 'src/app/core/models/ms-rejectedgood/goods-res-dev-model';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { NotifyAssetsImproprietyFormComponent } from '../notify-assets-impropriety-form/notify-assets-impropriety-form.component';
import { PrintSatAnswerComponent } from '../print-sat-answer/print-sat-answer.component';
import { RefuseClarificationModalComponent } from '../refuse-clarification-modal/refuse-clarification-modal.component';
import { LIST_ASSETS_COLUMN } from './list-assets-columns';
import { NOTIFY_ASSETS_COLUMNS } from './notify-assets-columns';

var data1 = [
  {
    id: 1,
    statusAssets: 'ACLARADO',
    management: '8901547',
    assetDescription: 'RESEPTOR DE SEÑAL CON NUMERO DE SERIE: 123456',
    unitMeasure: 'PIEZA',
    physicalState: 'BUENO',
    stateConsercation: 'BUENO',
  },
  {
    id: 2,
    statusAssets: 'SOLICITUD DE ACLARACIÓN',
    management: '890122',
    assetDescription: 'RESEPTOR DE SEÑAL CON NUMERO DE SERIE: 323211',
    unitMeasure: 'PIEZA',
    physicalState: 'BUENO',
    stateConsercation: 'BUENO',
  },
];

var data2 = [
  {
    status: 'NUEVO',
    clarificationStatus: '',
    clarificationSAT: '',
    typeOfClarification: 'ACLARACIÓN',
    clarification: 'ACLARACIÓN EN ESTADO FISICO',
    typeClarification: '1',
    dateClarification: '12/10/2022',
    reason: 'ACLARACIÓN DEL ESTADO FISICO DEL BIEN',
    observation: '',
  },

  {
    status: 'NUEVA',
    clarificationStatus: '',
    clarificationSAT: '',
    typeOfClarification: 'ACLARACIÓN',
    clarification: 'ERROR EN LA DOCUMENTACIÓN ANEXA',
    typeClarification: '2',
    dateClarification: '12/10/2022',
    reason: 'ACLARACIÓN DEL ESTADO FISICO DEL BIEN',
    observation: '',
  },
];

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
  notificationsGoods: IGoodsResDev;
  notificationsList: IChatClarifications[] = [];
  valuesNotifications: IChatClarifications;
  prueba: IChatClarifications;

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

  rowSelected: boolean = false;
  selectedRow: any = null;

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
    const idNotify = { ...this.notificationsGoods };
    this.notificationsList = [];
    this.notificationsGoods = event.data;
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
        console.log(response.data);
        this.notificationsList = response.data;
        this.totalItems2 = response.count;
        this.loading2 = false;
      },
      error: error => (this.loading2 = false),
    });
  }

  notifyAssetRowSelected(event: any) {
    this.valuesNotifications = event.data;
    const refuseObj = { ...this.valuesNotifications };
    console.log(
      'Información de la notificación seleccionada ',
      this.valuesNotifications
    );
    //let idRefuse = refuseObj.rejectNotificationId;
    //console.log("ID del rechazo", idRefuse)
    //verificar cuantas aclaraciones se pueden seleccionar para aceptarlas
    this.notifyAssetsSelected = event.selected;
  }

  refuseClarification() {
    const idNotify = { ...this.notificationsGoods };
    const refuseObj = { ...this.valuesNotifications };
    const idRefuse = refuseObj.clarifiNewsRejectId as IClarificationGoodsReject;
    const idRechazo = idRefuse.rejectNotificationId;
    console.log('ID del rechazo', idRefuse.rejectNotificationId);

    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      idRechazo,
      clarification: this.notifyAssetsSelected,
      callback: (next: boolean) => {
        this.getClarificationsByGood(idNotify.goodId);
      },
    };
    this.modalService.show(RefuseClarificationModalComponent, modalConfig);

    //ver si los datos se devolveran por el mismo modal o se guardan

    /*  this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    }); */
  }

  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
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
    console.log(
      'id tipo aclaración seleccionado',
      this.selectedRow.clarifiNewsRejectId.clarificationId
    );

    if (this.selectedRow.clarifiNewsRejectId.clarificationId < 1) {
      this.message('Error', 'Seleccione almenos un registro!');
      return;
    }
    this.openModal();
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
    const idNotify = { ...this.notificationsGoods };
    const dataClarifications = { ...this.valuesNotifications };
    const idAclara = this.selectedRow.clarifiNewsRejectId.clarificationId; //Id del tipo de aclaración
    let config: ModalOptions = {
      initialState: {
        dataClarifications,
        idAclara,
        clarification: this.notifyAssetsSelected,
        isInterconnection: this.byInterconnection,
        callback: (next: boolean) => {
          if (next) {
            this.getClarificationsByGood(idNotify.goodId);
          }
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

  //Respuesta del SAT
  satAnswer() {
    const idNotify = { ...this.notificationsGoods };
    const idAclaracion = this.selectedRow.id; //ID de la aclaración para mandar al reporte del sat
    if (this.selectedRow.satClarify == null) {
      this.message('Aviso', 'Aún no hay una respuesta del SAT');
      return;
    }

    let config: ModalOptions = {
      initialState: {
        idAclaracion,
        callback: (next: boolean) => {
          this.getClarificationsByGood(idNotify.goodId);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PrintSatAnswerComponent, config);
  }
}
