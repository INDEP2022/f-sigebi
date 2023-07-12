import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IRequestInTurn } from 'src/app/core/models/catalogs/request-in-turn.model';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { IListResponse } from '../../../../core/interfaces/list-response.interface';
import { IRequest } from '../../../../core/models/requests/request.model';
import { AffairService } from '../../../../core/services/catalogs/affair.service';
import { AuthorityService } from '../../../../core/services/catalogs/authority.service';
import { RegionalDelegationService } from '../../../../core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from '../../../../core/services/catalogs/state-of-republic.service';
import { StationService } from '../../../../core/services/catalogs/station.service';
import { TransferenteService } from '../../../../core/services/catalogs/transferente.service';
import { RequestService } from '../../../../core/services/requests/request.service';
import { RequestInTurnSelectedComponent } from '../request-in-turn-selected/request-in-turn-selected.component';
import { REQUEST_IN_TURN_COLUMNS } from './request-in-turn-columns';

@Component({
  selector: 'app-request-in-turn-list',
  templateUrl: './request-in-turn-list.component.html',
  styleUrls: ['./request-in-turn-list.component.scss'],
})
export class RequestInTurnListComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  paragraphs = new LocalDataSource(); //: any[] = [];
  params = new BehaviorSubject<FilterParams>(new FilterParams());

  requestSelected: IRequestInTurn[] = [];

  requestService = inject(RequestService);
  regionalDelegacionService = inject(RegionalDelegationService);
  stateOfRepublicService = inject(StateOfRepublicService);
  transferentService = inject(TransferenteService);
  stationService = inject(StationService);
  authorityService = inject(AuthorityService);
  affairService = inject(AffairService);
  active: boolean = false;
  listRequest: any;
  listTable: any[] = [];

  checkRequest: boolean = true;
  reportRequest: string = '';

  constructor(
    private modalService: BsModalService,
    public fb: FormBuilder,
    private wcontentService: WContentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      //hideSubHeader: false,
      actions: false,
      selectMode: 'multi',
      columns: REQUEST_IN_TURN_COLUMNS,
    };

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      if (this.active) this.getRequest();
      // params.page = data.page;
      // params.limit = data.limit;
    });
  }

  countError: number = 0;
  requestError: string = '';

  openTurnRequests() {
    if (this.requestSelected.length === 0) {
      this.onLoadToast(
        'warning',
        'Información',
        `Seleccione una o mas solicitudes`
      );
      return;
    }

    for (let i = 0; i < this.requestSelected.length; i++) {
      const request = this.requestSelected[i];

      //Verifíca que tenga documentos la solicitud
      const body = {
        xidSolicitud: request.id,
      };

      const params = new ListParams();

      this.wcontentService.getDocumentos(body, params).subscribe({
        next: res => {
          console.log('Respuesta, ', res.data.length);

          if (res.data.length >= 1) {
            //Verifica si tiene Emisora, Autoridad y Delegación la Solicitud
            if (
              request?.stationId === null ||
              request?.authorityId === null ||
              request?.transferenceId === null ||
              request?.regionalDelegationId === null
            ) {
              this.checkRequest = false;
              this.countError = this.countError + 1;
              this.requestError = this.requestError + `${request?.id}, `;
              this.reportRequest = String(request.id);
              console.log('SOLICITUD CON ERROR, SIN IDS');
            } else {
              console.log('SOLICITUD CORRECTA, CON IDS');
              this.checkRequest = true;
            }
          } else {
            console.log('SOLICITUD CON ERROR, SIN DOCUMENTOS DEL ENDPOINT');
            this.checkRequest = false;
            this.countError = this.countError + 1;
            this.requestError = this.requestError + `${request?.id}, `;
          }
        },
        error: error => {
          console.log('SOLICITUD CON ERROR, ERROR ENDPOINT');
          this.checkRequest = false;
          this.countError = this.countError + 1;
          this.requestError = this.requestError + `${request?.id}, `;
        },
      });
    }

    if (this.countError != 0) {
      Swal.fire({
        title: 'Importante',
        html: `Existen solicitudes que no se pueden turnar: <strong>${this.requestError}</strong> por falta de información. <br> <strong>Verificar solicitudes seleccionadas</strong>`,
        icon: 'error',
        showCancelButton: false,
        confirmButtonColor: '#9D2449',
        cancelButtonColor: '#B08C5C',
        confirmButtonText: 'Aceptar',
        //cancelButtonText: 'Cancelar',
      }).then(result => {
        if (result.isConfirmed) {
          this.countError = 0;
          this.requestError = '';
          this.resetForm(this.active);
        }
      });
    } else if (this.checkRequest === true) {
      this.modalRequestTurn();
    }
  }

  modalRequestTurn() {
    let config: ModalOptions = {
      initialState: {
        requestToTurn: this.requestSelected,
        callback: (next: boolean) => {
          if (next) {
            this.paragraphs = new LocalDataSource();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RequestInTurnSelectedComponent, config);
  }

  searchForm(params: FilterParams) {
    this.active = true;
    this.params.next(params);
    // this.params.value.page = params.page;
    // this.params.value.limit = params.limit;
  }

  getRequest(): any {
    this.loading = true;
    this.requestService.getAll(this.params.getValue().getParams()).subscribe({
      next: (data: IListResponse<IRequest>) => {
        this.totalItems = Number(data.count);
        this.getresponse(data.data);
      },
      error: error => {
        this.loading = false;
        this.totalItems = 0;
        this.paragraphs.load([]);
        this.onLoadToast('error', '', `${error.error.message}`);
        console.log(error);
      },
    });
  }

  getresponse(data: any) {
    return new Promise((resolve, reject) => {
      let promises = [];
      promises.push(
        data.map((item: any) => {
          item['dateApplication'] = new Date(item.applicationDate)
            .toLocaleDateString()
            .toString();
          item['datePaper'] = new Date(item.paperDate)
            .toLocaleDateString()
            .toString();
          item['authorityName'] = item.authority
            ? item.authority.authorityName
            : '';

          item['delegationName'] = item.regionalDelegation
            ? item.regionalDelegation.description
            : '';

          item['stateOfRepublicName'] = item.state
            ? item.state.descCondition
            : '';

          item['transferentName'] = item.transferent
            ? item.transferent.name
            : '';

          item['stationName'] = item.emisora ? item.emisora.stationName : '';

          if (item.affair) {
            const affairService = this.affairService.getByIdAndOrigin(
              item.affair,
              'SAMI'
            );

            this.listTable = [];
            forkJoin([affairService]).subscribe(
              ([_affair]) => {
                let affair = _affair as any;

                item['affairName'] = affair.description;
              },
              error => {
                this.loading = false;
              }
            );
          } else {
            item['affairName'] = '';
          }
        })
      );

      Promise.all(promises)
        .then(result => {
          console.log(data);

          this.paragraphs.load(data);
          this.loading = false;
          resolve(data);
        })
        .catch(err => reject(err));
    });
  }

  onCustomAction(event: any) {
    this.requestSelected = event.selected;
    console.log('Solicitud, ', this.requestSelected);

    const request = this.requestSelected[0];

    if (
      request?.stationId === null ||
      request?.authorityId === null ||
      request?.regionalDelegationId === null
    ) {
      this.checkRequest = false;
      this.reportRequest = String(request.id);
      console.log('SOLICITUD CON ERROR');
    } else {
      this.checkRequest = true;
    }

    if (this.checkRequest === false) {
      Swal.fire({
        title: 'Importante',
        html: `No se puede turnar la siguiente solicitud: <strong>${this.reportRequest}</strong> por falta de información. <br> <strong>Asegúrese de desmarcar la solicitud.</strong> `,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#9D2449',
        cancelButtonColor: '#ffc107',
        confirmButtonText: 'Aceptar',
      }).then(result => {
        if (result.isConfirmed) {
          this.active = true;
        }
      });
    } else if (this.checkRequest === true) {
      console.log('Puede continuar');
    }
  }

  resetForm(event: any) {
    if (event === true) {
      this.paragraphs = new LocalDataSource();
      this.totalItems = 0;
    }
  }
}
