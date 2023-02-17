import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { ILocality } from 'src/app/core/models/catalogs/locality.model';
import { IMunicipality } from 'src/app/core/models/catalogs/municipality.model';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { ITypeWarehouse } from 'src/app/core/models/catalogs/type-warehouse.model';
import { IZipCodeGoodQuery } from 'src/app/core/models/catalogs/zip-code.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { TypeWarehouseService } from 'src/app/core/services/catalogs/type-warehouse.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DOUBLE_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { responsableUser, typeTercero } from './warehouse-data';

@Component({
  selector: 'app-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styles: [],
})
export class WarehouseFormComponent extends BasePage implements OnInit {
  regDelData: IRegionalDelegation;
  warehouseForm: FormGroup = new FormGroup({});
  responsiblesUsers = new DefaultSelect(responsableUser);
  typeTercero = new DefaultSelect(typeTercero);
  states = new DefaultSelect<IStateOfRepublic>();
  municipalities = new DefaultSelect<IMunicipality>();
  cities = new DefaultSelect<ICity>();
  localities = new DefaultSelect<ILocality>();
  zipCode = new DefaultSelect<IZipCodeGoodQuery>();

  typeWarehouse = new DefaultSelect<ITypeWarehouse>();
  stateKey: string = '';
  municipalityId: string = '';
  localityId: string = '';
  show_city_municipality: boolean = false;
  showLocality: boolean = false;
  showZipCode: boolean = false;
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private router: Router,
    private municipalityService: MunicipalityService,
    private typeWarehouseService: TypeWarehouseService,
    private cityService: CityService,
    private localityService: LocalityService,
    private goodsQueryService: GoodsQueryService,
    private stateService: DelegationStateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getStateSelect(new ListParams());
    this.getTypeWarehouseSelect(new ListParams());
  }

  //Verificar typeTercero//
  prepareForm() {
    this.warehouseForm = this.fb.group({
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      responsibleUser: [null],
      numberRegister: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeTercero: [null, [Validators.required]],
      responsibleDelegation: [
        this.regDelData.description,
        [Validators.pattern(STRING_PATTERN)],
      ],
      managedBy: [null, [Validators.pattern(STRING_PATTERN)]],
      stateCode: [null, [Validators.required]],
      municipalityCode: [null, [Validators.required]],
      cityCode: [null, [Validators.required]],
      localityCode: [null, [Validators.required]],
      zipCode: [null, [Validators.required]],
      street: [null, [Validators.pattern(STRING_PATTERN)]],
      numberOutside: [null],
      type: [null],
      numberManagement: [null, [Validators.pattern(STRING_PATTERN)]],
      locator: [null],
      contractNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      siabWarehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      startOperation: [null],
      endOperation: [null],
      latitude: [null, [Validators.pattern(DOUBLE_PATTERN)]],
      longitude: [null, [Validators.pattern(DOUBLE_PATTERN)]],
    });
  }
  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estas seguro de crear almacén?'
    ).then(question => {
      if (question.isConfirmed) {
        console.log(this.warehouseForm.value);
        this.onLoadToast('success', 'Almacén creado correctamente', '');
        this.close();
      }
    });
  }

  getResponsibleUserSelect(responsibleUser: ListParams) {}

  getTypeTerceroSelect(typeTercero: ListParams) {}

  //Revisar error //
  getStateSelect(params?: ListParams) {
    params['filter.regionalDelegation'] = this.regDelData.id;
    this.stateService.getAll(params).subscribe(data => {
      const filterStates = data.data.filter(_states => {
        return _states.stateCode;
      });

      const states = filterStates.map(items => {
        return items.stateCode;
      });

      this.states = new DefaultSelect(states, data.count);
    });
  }

  stateSelect(item: IStateOfRepublic) {
    this.stateKey = item.id;
    this.getCitySelect(new ListParams());
    this.getMunicipalitiesSelect(new ListParams());
  }

  getCitySelect(params?: ListParams) {
    if (this.stateKey) {
      this.show_city_municipality = true;
      params['stateKey'] = this.stateKey;
      this.cityService.getAll(params).subscribe(data => {
        this.cities = new DefaultSelect(data.data, data.count);
      });
    }
  }

  getMunicipalitiesSelect(params?: ListParams) {
    if (this.stateKey) {
      this.show_city_municipality = true;
      params['stateKey'] = this.stateKey;
      this.municipalityService.getAll(params).subscribe(data => {
        this.municipalities = new DefaultSelect(data.data, data.count);
      });
    }
  }

  municipalitySelect(item: IMunicipality) {
    this.municipalityId = item.idMunicipality;
    this.getLocalitySelect(new ListParams());
  }

  getLocalitySelect(params?: ListParams) {
    if (this.stateKey && this.municipalityId) {
      this.showLocality = true;
      params['stateKey'] = this.stateKey;
      params['municipalityId'] = this.municipalityId;
      this.localityService.getAll(params).subscribe(data => {
        this.localities = new DefaultSelect(data.data, data.count);
      });
    }
  }

  localitySelect(item: ILocality) {
    this.localityId = item.id;
    this.getZipCodeSelect(new ListParams());
  }

  getZipCodeSelect(params?: ListParams) {
    if (this.stateKey && this.municipalityId && this.localityId) {
      this.showZipCode = true;
      params['filter.keyState'] = this.stateKey;
      params['filter.keyTownship'] = this.municipalityId;
      params['filter.keySettlement'] = this.localityId;
      this.goodsQueryService.getZipCode(params).subscribe(data => {
        this.zipCode = new DefaultSelect(data.data, data.count);
      });
    }
  }

  getTypeWarehouseSelect(params: ListParams) {
    this.typeWarehouseService.getAll(params).subscribe(data => {
      const filterType = data.data.filter(item => {
        return item.description;
      });
      this.typeWarehouse = new DefaultSelect(filterType, data.count);
    });
  }

  close() {
    this.modalService.hide();
  }
}
