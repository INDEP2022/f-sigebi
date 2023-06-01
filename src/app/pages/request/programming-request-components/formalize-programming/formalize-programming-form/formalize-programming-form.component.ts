import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DocumentsListComponent } from '../../execute-reception/documents-list/documents-list.component';
import { RECEIPT_COLUMNS_FORMALIZE } from '../../execute-reception/execute-reception-form/columns/minute-columns';
import { TRANSPORTABLE_GOODS_FORMALIZE } from '../../execute-reception/execute-reception-form/columns/transportable-goods-columns';
import { MINUTES_COLUMNS } from '../columns/minutes-columns';
import { InformationRecordComponent } from '../information-record/information-record.component';
import { minutes, tranGoods } from './formalize-programmig.data';

@Component({
  selector: 'app-formalize-programming-form',
  templateUrl: './formalize-programming-form.component.html',
  styles: [],
})
export class FormalizeProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  settingsMinutes = {
    ...this.settings,
    columns: MINUTES_COLUMNS,
    edit: { editButtonContent: '<i class="fa fa-book text-warning mx-2"></i>' },
    actions: { columnTitle: 'Generar / cerrar acta', position: 'right' },
  };
  settingsReceipt = {
    ...this.settings,
    actions: false,
    columns: RECEIPT_COLUMNS_FORMALIZE,
  };
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  settingsTranGoods = {
    ...this.settings,
    actions: false,
    columns: TRANSPORTABLE_GOODS_FORMALIZE,
    selectMode: 'multi',
  };
  minutes = minutes;
  receipts: any[] = [];
  programming: Iprogramming;
  idTransferent: number;
  idStation: number;
  tranGoods = tranGoods;
  idProgramming: number = 0;
  nameTransferent: string = '';
  nameStation: string = '';
  authorityName: string = '';
  typeRelevantName: string = '';
  nameWarehouse: string = '';
  ubicationWarehouse: string = '';
  formLoading: boolean = false;
  paramsStation = new BehaviorSubject<ListParams>(new ListParams());
  paramsAuthority = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private activRouted: ActivatedRoute,
    private ProgrammingService: ProgrammingRequestService,
    private regionalDelegationService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private authorityService: AuthorityService,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService
  ) {
    super();
    this.idProgramming = Number(this.activRouted.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.formLoading = true;
    this.getProgrammingData();
  }

  getProgrammingData() {
    this.ProgrammingService.getProgrammingId(this.idProgramming).subscribe({
      next: data => {
        console.log('data', data);
        this.programming = data;
        this.idTransferent = data.tranferId;
        this.idStation = data.stationId;
        this.getRegionalDelegation();
        this.getTransferent();
        this.getStation();
        this.getAuthority();
        this.getTypeRelevant();
        this.getwarehouse();
      },
      error: error => {},
    });
  }

  uploadDocuments() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const uploadDocumentos = this.modalService.show(
      DocumentsListComponent,
      config
    );
  }

  generateMinute() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const generateMinute = this.modalService.show(
      InformationRecordComponent,
      config
    );
  }

  getRegionalDelegation() {
    this.regionalDelegationService
      .getById(this.programming.regionalDelegationNumber)
      .subscribe(data => {
        this.programming.regionalDelegationNumber = data.description;
      });
  }

  getTransferent() {
    this.transferentService
      .getById(this.programming.tranferId)
      .subscribe(data => {
        this.nameTransferent = data.nameTransferent;
      });
  }

  getStation() {
    this.paramsStation.getValue()['filter.id'] = this.programming.stationId;
    this.paramsStation.getValue()['filter.idTransferent'] =
      this.programming.tranferId;

    this.stationService.getAll(this.paramsStation.getValue()).subscribe({
      next: response => {
        this.nameStation = response.data[0].stationName;
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getAuthority() {
    this.paramsAuthority.getValue()['filter.idAuthority'] =
      this.programming.autorityId;
    this.paramsAuthority.getValue()['filter.idTransferer'] = this.idTransferent;
    this.paramsAuthority.getValue()['filter.idStation'] = this.idStation;

    this.authorityService.getAll(this.paramsAuthority.getValue()).subscribe({
      next: response => {
        let authority = response.data.find(res => {
          return res;
        });
        this.authorityName = authority.authorityName;
      },
    });
  }

  getTypeRelevant() {
    return this.typeRelevantService
      .getById(this.programming.typeRelevantId)
      .subscribe(data => {
        this.typeRelevantName = data.description;
      });
  }

  getwarehouse() {
    return this.warehouseService
      .getById(this.programming.storeId)
      .subscribe(data => {
        this.nameWarehouse = data.description;
        this.ubicationWarehouse = data.ubication;
        this.formLoading = false;
      });
  }

  confirm() {}

  close() {}
}
