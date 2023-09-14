import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TransferentesSaeService } from 'src/app/core/services/catalogs/transferentes-sae.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-search-requests',
  templateUrl: './search-requests.component.html',
  styles: [],
})
export class SearchRequestsComponent extends BasePage implements OnInit {
  @Output() onSearch = new EventEmitter<any>();
  toggleSearch: boolean = true;
  searchForm: FormGroup = new FormGroup({});
  delegationItems = new DefaultSelect();
  stateItems = new DefaultSelect();
  transfereeItems = new DefaultSelect();
  emitterItems = new DefaultSelect();
  authorities = new DefaultSelect();

  deleRegionalId: string | number = null;
  stateId: string | null = null;
  idTransferer: string | number = null;
  idStation: string | number = null;

  /* injections */
  private readonly authorityService = inject(AuthorityService);
  private readonly regionalDelegationService = inject(
    RegionalDelegationService
  );
  private readonly authService = inject(AuthService);
  private readonly delegationStateService = inject(DelegationStateService);
  private readonly transferentService = inject(TransferenteService);
  private readonly transferentesSaeService = inject(TransferentesSaeService);
  private readonly stationService = inject(StationService);
  /*  */

  delegationTestData: any[] = [
    {
      id: 1,
      description: 'BAJA CALIFORNIA',
    },
    {
      id: 2,
      description: 'CHIAPAS',
    },
    {
      id: 3,
      description: 'GUANAJUATO',
    },
  ];

  stateTestData: any[] = [
    {
      id: 1,
      description: 'BAJA CALIFORNIA',
    },
    {
      id: 2,
      description: 'CHIAPAS',
    },
    {
      id: 3,
      description: 'GUANAJUATO',
    },
  ];

  transfereeTestData: any[] = [
    {
      id: 1,
      description: 'SAT - COMERCIO EXTERIOR',
    },
    {
      id: 2,
      description: 'EJEMPLO TRANSFERENTE 2',
    },
    {
      id: 3,
      description: 'EJEMPLO TRANSFERENTE 3',
    },
  ];

  emitterTestData: any[] = [
    {
      id: 1,
      description: 'EJEMPLO EMISORA 1',
    },
    {
      id: 2,
      description: 'EJEMPLO EMISORA 2',
    },
    {
      id: 3,
      description: 'EJEMPLO EMISORA 3',
    },
  ];

  authorityTestData: any[] = [
    {
      id: 1,
      description: 'A',
    },
    {
      id: 1,
      description: 'B',
    },
    {
      id: 1,
      description: 'C',
    },
  ];

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getSelectItems();
  }

  prepareForm() {
    this.searchForm = this.fb.group({
      id: [null, [Validators.pattern(NUM_POSITIVE)]],
      authorityId: [null],
      typeRecord: [null, [Validators.pattern(STRING_PATTERN)]],
      recordId: [null, [Validators.pattern(NUM_POSITIVE)]],
      indicatedTaxpayer: [null, [Validators.pattern(STRING_PATTERN)]],
      domainExtinction: [null, [Validators.pattern(STRING_PATTERN)]],
      regionalDelegationId: [null],
      transferenceFile: [null, [Validators.pattern(STRING_PATTERN)]],
      trialType: [null, [Validators.pattern(STRING_PATTERN)]],
      keyStateOfRepublic: [null],
      previousInquiry: [null, [Validators.pattern(STRING_PATTERN)]],
      trial: [null, [Validators.pattern(STRING_PATTERN)]],
      transferenceId: [null],
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]],
      stationId: [null],
      protectNumber: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getSelectItems() {
    // Inicializar items de selects con buscador
    // this.getDelegations({ page: 1, text: '' });
    this.getRegionalDelegationId();
    this.getRegionalDeleg(new ListParams(), this.deleRegionalId);
    this.getStates(new ListParams());
    //this.getTransferees({ page: 1, text: '' });
    //this.getEmitters({ page: 1, text: '' });
    //this.getAuthority(new ListParams())
  }

  getRegionalDelegationId() {
    const id = this.authService.decodeToken().department;
    this.deleRegionalId = id;
  }

  getRegionalDeleg(params?: ListParams, id?: string | number) {
    //const regDelId = Number(this.getRegionalDelegationId());
    this.regionalDelegationService.getAll(params).subscribe((data: any) => {
      this.delegationItems = new DefaultSelect(data.data, data.count);
      if (id) {
        this.searchForm.controls['regionalDelegationId'].setValue(
          this.deleRegionalId
        );
      }
    });
  }

  updateDelegation(event: any) {
    //TODO: VER EL CAMBIO DE SELECT SE TIENE QUE LIMPIAR
    if (event === undefined) {
      this.delegationItems = new DefaultSelect();
      this.searchForm.controls['regionalDelegationId'].setValue(null);
      this.stateItems = new DefaultSelect();
      this.searchForm.controls['keyStateOfRepublic'].setValue(null);
      this.transfereeItems = new DefaultSelect();
      this.searchForm.controls['transferenceId'].setValue(null);
      this.emitterItems = new DefaultSelect();
      this.searchForm.controls['stationId'].setValue(null);
      this.authorities = new DefaultSelect();
      this.searchForm.controls['authorityId'].setValue(null);

      this.getRegionalDeleg(new ListParams());
    } else {
      this.stateItems = new DefaultSelect();
      this.searchForm.controls['keyStateOfRepublic'].setValue(null);
      this.transfereeItems = new DefaultSelect();
      this.searchForm.controls['transferenceId'].setValue(null);
      this.emitterItems = new DefaultSelect();
      this.searchForm.controls['stationId'].setValue(null);
      this.authorities = new DefaultSelect();
      this.searchForm.controls['authorityId'].setValue(null);

      this.deleRegionalId = event.id;
      this.getStates(new ListParams());
    }
  }

  getStates(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    params['filter.regionalDelegation'] = `$eq:${this.deleRegionalId}`;
    params['sortBy'] = 'keyState:ASC';
    this.delegationStateService.getAll(params).subscribe(
      (data: any) => {
        let result = data.data
          .map((x: any) => {
            return x.stateCode;
          })
          .filter((x: any) => x != undefined);
        this.stateItems = new DefaultSelect(result, result.length);
      },
      error => {
        this.stateItems = new DefaultSelect([], 0, true);
      }
    );
  }

  stateChanged(event: any) {
    if (event) {
      this.transfereeItems = new DefaultSelect();
      this.searchForm.controls['transferenceId'].setValue(null);
      this.emitterItems = new DefaultSelect();
      this.searchForm.controls['stationId'].setValue(null);
      this.authorities = new DefaultSelect();
      this.searchForm.controls['authorityId'].setValue(null);

      this.stateId = event.id;
      this.getTransferent(new ListParams());
    } else {
      this.transfereeItems = new DefaultSelect();
      this.searchForm.controls['transferenceId'].setValue(null);
      this.emitterItems = new DefaultSelect();
      this.searchForm.controls['stationId'].setValue(null);
      this.authorities = new DefaultSelect();
      this.searchForm.controls['authorityId'].setValue(null);
    }
  }

  getTransferent(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    params['filter.transferent.status'] = '$eq:1';
    params['filter.transferent.nameTransferent'] = `$ilike:${params.text}`;
    params['sortBy'] = 'nameTransferent:ASC';
    this.transferentesSaeService
      .getStateByTransferentKey(this.stateId, params)
      .subscribe({
        next: resp => {
          let transferents = resp.data.map(item => {
            return item.transferent;
          });
          transferents = transferents.filter(x => x != undefined);
          this.transfereeItems = new DefaultSelect(transferents, resp.count);
        },
      });
  }

  transferenceChanges(event: any) {
    if (event != undefined) {
      this.emitterItems = new DefaultSelect();
      this.searchForm.controls['stationId'].setValue(null);
      this.authorities = new DefaultSelect();
      this.searchForm.controls['authorityId'].setValue(null);

      this.idTransferer = event.id;
      this.getEmitters(new ListParams());
    } else {
      this.emitterItems = new DefaultSelect();
      this.searchForm.controls['stationId'].setValue(null);
      this.authorities = new DefaultSelect();
      this.searchForm.controls['authorityId'].setValue(null);
    }
  }
  getEmitters(params: ListParams) {
    // Funcion para demostrar funcionamiento de select. Reemplazar por uso de apis
    params['filter.idTransferent'] = `$eq:${this.idTransferer}`;
    params['filter.stationName'] = `$ilike:${params.text}`;
    params['sortBy'] = 'stationName:ASC';
    delete params['search'];
    delete params.text;
    this.stationService.getAll(params).subscribe({
      next: data => {
        /*data.data.map(data => {
          data.nameAndId = `${data.id} - ${data.stationName}`;
          return data;
        });*/
        this.emitterItems = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.emitterItems = new DefaultSelect();
      },
    });
  }

  stationChanges(event: any) {
    if (event != undefined) {
      this.authorities = new DefaultSelect();
      this.searchForm.controls['authorityId'].setValue(null);

      this.idStation = event.id;
      this.getAuthority(new ListParams());
    } else {
      this.authorities = new DefaultSelect();
      this.searchForm.controls['authorityId'].setValue(null);
    }
  }

  getAuthority(params?: ListParams) {
    params['filter.authorityName'] = `$ilike:${params.text}`;
    params['filter.idStation'] = `$eq:${this.idStation}`;
    params['filter.idTransferer'] = `$eq:${this.idTransferer}`;
    params['sortBy'] = 'authorityName:ASC';
    delete params['search'];
    delete params.text;
    this.authorityService.getAll(params).subscribe({
      next: data => {
        /*data.data.map(data => {
          data.nameAndId = `${data.idAuthority} - ${data.authorityName}`;
          return data;
        });*/
        this.authorities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.authorities = new DefaultSelect();
      },
    });
  }

  search() {
    // console.log(this.searchForm.controls);
    let emptyCount: number = 0;
    let controlCount: number = 0;
    /*for (const c in this.searchForm.controls) {
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
    }*/
    this.onSearch.emit(this.searchForm.value);
    this.toggleSearch = false;
  }

  reset() {
    this.searchForm.reset();
    this.stateItems = new DefaultSelect();
    this.transfereeItems = new DefaultSelect();
    this.emitterItems = new DefaultSelect();
    this.authorities = new DefaultSelect();

    this.getRegionalDelegationId();
    this.getRegionalDeleg(new ListParams(), this.deleRegionalId);
    this.getStates(new ListParams());
  }
}
