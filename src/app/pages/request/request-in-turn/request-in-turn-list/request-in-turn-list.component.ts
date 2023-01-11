import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequestInTurn } from 'src/app/core/models/catalogs/request-in-turn.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { IListResponse } from '../../../../core/interfaces/list-response.interface';
import { IRequest } from '../../../../core/models/requests/request.model';
import { AffairService } from '../../../../core/services/catalogs/affair.service';
import { AuthorityService } from '../../../../core/services/catalogs/Authority.service';
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
  params = new BehaviorSubject<ListParams>(new ListParams());

  requestSelected: IRequestInTurn[] = [];

  requestService = inject(RequestService);
  regionalDelegacionService = inject(RegionalDelegationService);
  stateOfRepublicService = inject(StateOfRepublicService);
  transferentService = inject(TransferenteService);
  stationService = inject(StationService);
  authorityService = inject(AuthorityService);
  affairService = inject(AffairService);

  listRequest: any;
  listTable: any[] = [];

  constructor(private modalService: BsModalService, public fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: REQUEST_IN_TURN_COLUMNS,
    };
  }

  openTurnRequests() {
    if (this.requestSelected.length === 0) {
      this.onLoadToast(
        'info',
        'Informacion',
        `Seleccione una o muchas solicitudes!`
      );
      return;
    }

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

  searchForm(params: any) {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      params.page = data.inicio;
      params.take = data.pageSize;
      this.getRequest(params);
    });
  }

  getRequest(params?: any): any {
    this.loading = true;
    this.requestService.getAll(params).subscribe(
      (data: IListResponse<IRequest>) => {
        this.totalItems = Number(data.count);
        this.getresponse(data.data);
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    );
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
          item['authorityName'] = item.authority.authorityName;

          const delegacionService = this.regionalDelegacionService.getById(
            item.regionalDelegationId
          );
          const stateOfRepublicService = this.stateOfRepublicService.getById(
            item.keyStateOfRepublic
          );
          const transferenteService = this.transferentService.getById(
            item.transferenceId
          );
          const stationService = this.stationService.getById(item.stationId);

          const affairService = this.affairService.getById(item.affair);

          this.listTable = [];
          forkJoin([
            delegacionService,
            stateOfRepublicService,
            transferenteService,
            stationService,

            affairService,
          ]).subscribe(
            ([_delegation, _state, _transferent, _station, _affair]) => {
              let delegation = _delegation as any;
              let state = _state as any;
              let transferent = _transferent as any;
              let station = _station as any;
              //let authority = _authority as any;
              let affair = _affair as any;

              item['delegationName'] = delegation.data.description;
              item['stateOfRepublicName'] = state.data.descCondition;
              item['transferentName'] = transferent.data.nameTransferent;
              item['stationName'] = station.data.stationName;
              //item['authorityName'] = authority.data.authorityName;
              item['affairName'] = affair.data.description;
            },
            error => {
              this.loading = false;
            }
          );
        })
      );

      Promise.all(promises)
        .then(result => {
          this.paragraphs.load(data);
          this.loading = false;
          resolve(data);
        })
        .catch(err => reject(err));
    });
  }

  onCustomAction(event: any) {
    this.requestSelected = event.selected;
  }
}
