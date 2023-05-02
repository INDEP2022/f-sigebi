import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { EntFedService } from 'src/app/core/services/catalogs/entfed.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'state-locality',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './state-locality.component.html',
  styles: [],
})
export class StateLocalityComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() stateField: string = '';
  @Input() municipalityField: string = '';
  @Input() cityField: string = '';
  @Input() localityField: string = '';
  @Input() inlineForm: boolean = false;
  @Input() columns: number = 4;
  // @Input() goodTypeShow: boolean = true;
  // @Input() subTypeShow: boolean = true;
  // @Input() ssubTypeShow: boolean = true;
  // @Input() sssubTypeShow: boolean = true;
  rowClass: string;

  params = new BehaviorSubject<ListParams>(new ListParams());
  @Input() states = new DefaultSelect();
  @Input() cities = new DefaultSelect();
  @Input() municipalities = new DefaultSelect();
  @Input() localities = new DefaultSelect();

  // @Output() goodTypeChange = new EventEmitter<IGoodType>();
  // @Output() goodSubtypeChange = new EventEmitter<IGoodSubType>();
  // @Output() goodSsubtypeChange = new EventEmitter<IGoodsSubtype>();
  // @Output() goodSssubtypeChange = new EventEmitter<IGoodSssubtype>();

  get state() {
    return this.form.get(this.stateField);
  }

  get municipality() {
    return this.form.get(this.municipalityField);
  }

  constructor(
    private entFedService: EntFedService,
    private municipalityService: MunicipalityService,
    private cityService: CityService,
    private localityService: LocalityService
  ) {}

  ngOnInit(): void {
    console.log('d');
  }

  getStates(params: ListParams) {
    this.entFedService.getAll(params).subscribe({
      next: response => {
        this.states = new DefaultSelect(response.data, response.count);
      },
    });
  }

  getMunicipalities(params: ListParams) {
    this.municipalityService
      .getAll({ ...params, stateKey: this.state.value })
      .subscribe({
        next: response => {
          this.municipalities = new DefaultSelect(
            response.data,
            response.count
          );
        },
      });
  }

  getCities(params: ListParams) {
    this.cityService
      .getAll({ ...params, stateKey: this.state.value })
      .subscribe({
        next: response => {
          this.cities = new DefaultSelect(response.data, response.count);
        },
      });
  }

  getLocalities(params: ListParams) {
    this.localityService
      .getAll({
        ...params,
        stateKey: this.state.value,
        municipalityId: this.municipality.value,
      })
      .subscribe({
        next: response => {
          this.localities = new DefaultSelect(response.data, response.count);
        },
      });
  }
}
