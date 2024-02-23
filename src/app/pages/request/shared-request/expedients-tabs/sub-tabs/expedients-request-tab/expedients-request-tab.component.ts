import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EXPEDIENTS_REQUEST_COLUMNS } from './expedients-request-columns';

@Component({
  selector: 'app-expedients-request-tab',
  templateUrl: './expedients-request-tab.component.html',
  styles: [],
})
export class ExpedientsRequestTabComponent
  extends BasePage
  implements OnInit, OnChanges {
  @Input() typeDoc: string = '';
  @Input() typeModule?: string = '';
  @Input() updateInfo: boolean;

  title: string = 'Solicitudes del Expediente';

  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsRequest = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  paragraphs: any[] = [];

  requestId: number = 0;
  allDocumentExpedient: any[] = [];
  screen: 'expedient-tab';
  task: any;
  statusTask: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private wContentService: WContentService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: EXPEDIENTS_REQUEST_COLUMNS,
    };

    this.requestId = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    // DISABLED BUTTON - FINALIZED //
    if (this.requestId == null) {
      this.task = JSON.parse(localStorage.getItem('Task'));
      this.statusTask = this.task.status;
      console.log('statustask', this.statusTask);
    }

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData(data);
    });
    this.getIdExpediente();
  }

  getIdExpediente() {
    this.requestService.getById(this.requestId).subscribe(data => {
      this.getRequestByExpedient(data.recordId);
    });
  }

  getRequestByExpedient(expeident: number) {
    if (expeident) {
      this.params.getValue()['filter.recordId'] = expeident;
      this.requestService.getAll(this.params.getValue()).subscribe({
        next: async data => {
          const filterInfo = data.data.map(items => {
            items.authorityId = items.authority.authorityName;
            items.regionalDelegationId = items.regionalDelegation.description;
            items.transferenceId = items.transferent.name;
            items.stationId = items.emisora.stationName;
            items.state = items.state.descCondition;
            return items;
          });
          this.paragraphs = filterInfo;
          this.totalItems = data.count;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
        },
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.typeModule != '' && this.typeModule == 'doc-complementary') {
      this.requestId = this.activatedRoute.snapshot.paramMap.get(
        'request'
      ) as unknown as number;
    }
    let onChangeCurrentValue = changes['typeDoc'].currentValue;
    this.typeDoc = onChangeCurrentValue;
  }

  requestSelected(event: any) {
    this.typeDocumentMethod(event);
    console.log('event', event, this.typeDoc);

  }

  typeDocumentMethod(type: number) {
    switch (type) {
      case 1:
        this.typeDoc = 'doc-request'; //documentos de solicitud
        break;
      case 2:
        this.typeDoc = 'doc-expedient'; //documentos de expediente
        break;
      case 3:
        this.typeDoc = 'request-expedient'; //solicitud de expediente
        break;
      case 4:
        this.typeDoc = 'request-assets'; //solicitud de bienes
        break;
      default:
        break;
    }
  }

  getRequestData() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData(data);
    });
  }

  /*getData() {
    if (this.requestId && this.getIdExpediente) {
      this.loading = true;
      const body = {
        //xidSolicitud: this.idRequest,
        xidExpediente: this.getIdExpediente,
      };

      this.wContentService.getDocumentos(body).subscribe({
        next: async (data: any) => {
          this.paragraphs = data.data;
          this.allDocumentExpedient = this.paragraphs;
          this.totalItems = data.count;
          this.loading = false;
        },
      });
    }
  }*/

  getData(params: ListParams) {
    this.requestService.getAll(this.params.getValue()).subscribe({
      next: async data => {
        const filterInfo = data.data.map(items => {
          items.authorityId = items.authority.authorityName;
          items.regionalDelegationId = items.regionalDelegation.description;
          items.transferenceId = items.transferent.name;
          items.stationId = items.emisora.stationName;
          items.state = items.state.descCondition;
          return items;
        });
        this.paragraphs = data.data;
        this.totalItems = data.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}
