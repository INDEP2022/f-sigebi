import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { IState } from 'src/app/core/models/catalogs/state-model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { OriginService } from 'src/app/core/services/catalogs/origin.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-search-inventory-goods',
  templateUrl: './search-inventory-goods.component.html',
  styles: [],
})
export class SearchInventoryGoodsComponent extends BasePage implements OnInit {
  toggleSearch: boolean = true;
  idRequest: number = 0;
  searchForm: FormGroup = new FormGroup({});
  delegationItems = new DefaultSelect();
  stateItems = new DefaultSelect();
  goodsTypes = new DefaultSelect();
  stationItems = new DefaultSelect();
  authorityItems = new DefaultSelect();
  delegationId: number = 0;
  idStation: string | number;
  stationId: number = 0;
  idAuthority: string = '';
  autorityId: string = '';
  stateId: string = '';
  delegation: string = '';
  regionalDelegationUser: IRegionalDelegation;
  authorities: any[] = [];
  goodTypes: any[] = [];
  origins = new DefaultSelect();
  @Output() onSearch = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private regionalDelegationService: RegionalDelegationService,
    private requestService: RequestService,
    private programmingService: ProgrammingRequestService,
    private stateService: DelegationStateService,
    private stationService: StationService,
    private authorityService: AuthorityService,
    private goodTypeService: GoodTypeService,
    private typeRelevanteService: TypeRelevantService,
    private originService: OriginService
  ) {
    super();
    this.idRequest = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getRequestInfo();
    this.getRegionalDelegationSelect(new ListParams());
    this.getGoodType(new ListParams());
    this.getOrigin(new ListParams());
  }

  getRequestInfo() {
    //this.requestService.getById()
  }

  getRegionalDelegationSelect(params?: ListParams) {
    //Delegation regional user login //
    this.programmingService.getUserInfo().subscribe((data: any) => {
      this.regionalDelegationService
        .getById(data.department)
        .subscribe((delegation: IRegionalDelegation) => {
          this.delegationId = delegation.id;
          this.delegation = delegation.description;
          this.searchForm
            .get('regionalDelegation')
            .setValue(delegation.description);
          this.searchForm.get('regionalDelegationId').setValue(delegation.id);
          this.regionalDelegationUser = delegation;
          this.getStates(new ListParams());
        });
    });

    if (params.text) {
      this.regionalDelegationService.search(params).subscribe(data => {
        this.delegationItems = new DefaultSelect(data.data, data.count);
      });
    } else {
      this.regionalDelegationService.getAll(params).subscribe(data => {
        this.delegationItems = new DefaultSelect(data.data, data.count);
      });
    }
  }

  regionalDelegationSelect(item: IRegionalDelegation) {
    this.regionalDelegationUser = item;
    this.delegationId = item.id;
    this.searchForm.get('regionalDelegationId').setValue(this.delegationId);
    this.getStateSelect(new ListParams());
  }

  getStateSelect(params?: ListParams) {
    params['filter.regionalDelegation'] = this.regionalDelegationUser.id;
    this.stateService.getAll(params).subscribe(data => {
      const filterStates = data.data.filter(_states => {
        return _states.stateCode;
      });

      const states = filterStates.map(items => {
        return items.stateCode;
      });

      this.stateItems = new DefaultSelect(states, data.count);
    });
  }

  prepareForm() {
    this.searchForm = this.fb.group({
      goodId: [null],
      regionalDelegation: [null],
      regionalDelegationId: [null],
      saeNo: [null],
      uniqueKey: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      stateKey: [null],
      warehouseCode: [null],
      goodDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      stationId: [null],
      origin: [null],
      fileNum: [null],
      authorityId: [null],
      folioAct: [null],
      transferFile: [null, [Validators.pattern(STRING_PATTERN)]],
      typeRelevantId: [null],
    });

    const info = JSON.parse(localStorage.getItem('Task'));
  }

  getDelegations(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    /*if (params.text == '') {
      this.delegationItems = new DefaultSelect(this.delegationTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.delegationTestData.filter((i: any) => i.id == id)];
      this.delegationItems = new DefaultSelect(item[0], 1);
    } */
  }

  getStates(params: ListParams) {
    params['filter.regionalDelegation'] = this.regionalDelegationUser.id;
    this.stateService.getAll(params).subscribe(data => {
      const filterStates = data.data.filter(_states => {
        return _states.stateCode;
      });

      const states = filterStates.map(items => {
        return items.stateCode;
      });

      this.stateItems = new DefaultSelect(states, data.count);
    });
  }

  stateSelect(state: IState) {
    this.stateId = state.id;
    this.getStation(new ListParams());
  }

  getStation(params: ListParams) {
    params['filter.keyState'] = this.stateId;
    this.stationService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.nameAndId = `${data.id} - ${data.stationName}`;
          return data;
        });
        this.stationItems = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.stationItems = new DefaultSelect();
      },
    });
  }

  stationSelect(item: IStation) {
    this.idStation = item.id;

    this.stationId = item.id;
    this.getAuthoritySelect(new ListParams());
  }

  search() {
    let emptyCount: number = 0;
    let controlCount: number = 0;
    for (const c in this.searchForm.controls) {
      if (
        this.searchForm.controls[c].value === null ||
        this.searchForm.controls[c].value === ''
      ) {
        emptyCount += 1;
      }
      controlCount += 1;
    }
    if (emptyCount === controlCount) {
      this.onLoadToast(
        'error',
        'Debe completar al menos un campo',
        'Complete los campos necesarios para realizar la búsqueda'
      );
      return;
    }
    this.onSearch.emit(this.searchForm.value);

    //this.toggleSearch = false;
  }

  getAuthoritySelect(params?: ListParams) {
    params['filter.idStation'] = this.idStation;
    //params['filter.idTransferer'] = `$eq:${this.transferentId}`;
    //params['sortBy'] = 'authorityName:ASC';
    //delete params['search'];
    //delete params.text;
    this.authorityService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.nameAndId = `${data.idAuthority} - ${data.authorityName}`;
          return data;
        });
        this.authorityItems = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.authorityItems = new DefaultSelect();
      },
    });
  }

  authoritySelect(item: IAuthority) {
    this.idAuthority = item.idAuthority;
    this.autorityId = item.idAuthority;
  }

  getGoodType(params?: ListParams) {
    this.typeRelevanteService.getAll(params).subscribe({
      next: response => {
        this.goodsTypes = new DefaultSelect(response.data, response.count);
      },
    });
    /*this.goodTypeService.getAll(params).subscribe({
      next: response => {
        this.goodsTypes = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });*/
  }

  getOrigin(params?: ListParams) {
    this.originService.getAll(params).subscribe({
      next: resp => {
        this.origins = new DefaultSelect(resp.data, resp.count);
      },
    });
  }
  reset() {
    this.searchForm.reset();
  }
}
