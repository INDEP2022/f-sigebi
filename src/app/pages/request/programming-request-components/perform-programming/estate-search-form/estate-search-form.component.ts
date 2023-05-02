import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ILocality } from 'src/app/core/models/catalogs/locality.model';
import { IMunicipality } from 'src/app/core/models/catalogs/municipality.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-estate-search-form',
  templateUrl: './estate-search-form.component.html',
  styles: [],
})
export class EstateSearchFormComponent implements OnInit {
  estateForm: FormGroup = new FormGroup({});
  loading: boolean = false;
  akaWarehouse = new DefaultSelect<IWarehouse>();
  states = new DefaultSelect<IStateOfRepublic>();
  municipalities = new DefaultSelect<IMunicipality>();
  localities = new DefaultSelect<ILocality>();
  idStateOfRepublic: string = '';
  idMunicipality: string = '';

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalRef,
    private warehouseService: WarehouseService,
    private stateOfRepublicService: StateOfRepublicService,
    private municipalityService: MunicipalityService,
    private localityService: LocalityService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
    this.getAkaWarehouseSelect(new ListParams());
    this.getStateSelect(new ListParams());
  }

  prepareForm() {
    this.estateForm = this.fb.group({
      warehouse: [null],
      state: [null],
      municipality: [null],
      locality: [null],
      cp: [null],
    });
  }

  confirm() {
    this.loading = true;
    this.handleSuccess();
  }

  close() {
    this.modalService.hide();
  }

  getAkaWarehouseSelect(params: ListParams) {
    this.warehouseService.getAll(params).subscribe(data => {
      this.akaWarehouse = new DefaultSelect(data.data, data.count);
    });
  }

  getStateSelect(params: ListParams) {
    if (params.text) {
      /*this.stateOfRepublicService.search(params).subscribe(data => {
        this.states = new DefaultSelect(data.data, data.count);
      }); */
    } else {
      this.stateOfRepublicService.getAll(params).subscribe(data => {
        this.states = new DefaultSelect(data.data, data.count);
      });
    }
  }

  stateSelect(item: IStateOfRepublic) {
    this.idStateOfRepublic = item.id;
    this.getMunicipalitySelect(new ListParams());
  }

  getMunicipalitySelect(params: ListParams) {
    params['stateKey'] = this.idStateOfRepublic;
    this.municipalityService.getAll(params).subscribe(data => {
      this.municipalities = new DefaultSelect(data.data, data.count);
    });
  }

  municipalitySelect(item: IMunicipality) {
    this.idMunicipality = item.idMunicipality;
    this.getLocalitySelect(new ListParams());
  }

  getLocalitySelect(params: ListParams) {
    params['stateKey'] = this.idStateOfRepublic;
    params['municipalityId'] = this.idMunicipality;
    this.localityService.getAll(params).subscribe(data => {
      this.localities = new DefaultSelect(data.data, data.count);
    });
  }

  handleSuccess() {
    this.loading = false;
    this.modalService.content.callback(this.estateForm.value);
    this.modalService.hide();
  }
}
