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
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styles: [],
})
export class WarehouseFormComponent extends BasePage implements OnInit {
  regDelData: IRegionalDelegation;
  warehouseForm: FormGroup = new FormGroup({});
  responsiblesUsers = new DefaultSelect();
  typeTercero = new DefaultSelect();
  states = new DefaultSelect<IStateOfRepublic>();
  municipalities = new DefaultSelect<IMunicipality>();
  cities = new DefaultSelect<ICity>();
  localities = new DefaultSelect<ILocality>();
  zipCode = new DefaultSelect<IZipCodeGoodQuery>();

  typeWarehouse = new DefaultSelect<ITypeWarehouse>();
  stateKey: string = '';

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
  }

  //Verificar typeTercero//
  prepareForm() {
    this.warehouseForm = this.fb.group({
      nameWarehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      responsibleUser: [null],
      numberRegister: [null],
      typeTercero: [null],
      regionalDelegation: [
        this.regDelData.description,
        [Validators.pattern(STRING_PATTERN)],
      ],
      managedBy: [null, [Validators.pattern(STRING_PATTERN)]],
      state: [null],
      municipality: [null],
      city: [null],
      locality: [null],
      zipCode: [null],
      street: [null],
      numberOutside: [null],
      typeWarehouse: [null],
      numberManagement: [null],
      locator: [null],
      contractNumber: [null],
      siabWarehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      startOperation: [null],
      endOperation: [null],
      latitude: [null, [Validators.pattern(STRING_PATTERN)]],
      longitude: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }
  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estas seguro de crar almacén?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Almacén creado correctamente', '');
        this.close();
        this.router.navigate([
          '/pages/request/perform-programming/1/warehouse/1',
        ]);
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
    this.getLocalitySelect(new ListParams());
    this.getZipCodeSelect(new ListParams());
  }

  getCitySelect(params?: ListParams) {
    params['stateKey'] = this.stateKey;
    console.log('parametros ciudades', params);
    this.cityService.getAll(params).subscribe(data => {
      console.log('ciudades', data);
      this.cities = new DefaultSelect(data.data, data.count);
    });
  }

  getMunicipalitiesSelect(params?: ListParams) {
    params['stateKey'] = this.stateKey;
    console.log('params municipio', params);
    this.municipalityService.getAll(params).subscribe(data => {
      this.municipalities = new DefaultSelect(data.data, data.count);
    });
  }

  getLocalitySelect(params?: ListParams) {
    /*params['stateKey'] = this.stateKey;
    this.localityService.getAll(params).subscribe(data => {
      console.log('Localidades', data);
      this.localities = new DefaultSelect(data.data, data.count);
    }); */
  }

  getZipCodeSelect(params?: ListParams) {
    params['filter.keyState'] = this.stateKey;
    this.goodsQueryService.getZipCode(params).subscribe(data => {
      console.log('Codigos postales', data);
      this.zipCode = new DefaultSelect(data.data, data.count);
    });
  }

  getTypeWarehouseSelect(params: ListParams) {
    this.typeWarehouseService.getAll(params).subscribe(data => {
      this.typeWarehouse = new DefaultSelect(data.data, data.count);
    });
  }

  close() {
    this.modalService.hide();
  }
}
