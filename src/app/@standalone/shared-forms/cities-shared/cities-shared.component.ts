import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { ICity } from 'src/app/core/models/catalogs/city.model';

@Component({
  selector: 'app-cities-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './cities-shared.component.html',
  styles: [],
})
export class CitiesSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() cityField: string = 'city';

  @Input() showCity: boolean = true;
  @Output('state') state: EventEmitter<Object> = new EventEmitter<Object>();

  params = new BehaviorSubject<ListParams>(new ListParams());
  cities = new DefaultSelect<ICity>();

  get City() {
    return this.form.get(this.cityField);
  }

  constructor(private service: CityService) {
    super();
  }

  ngOnInit(): void {
    this.City.valueChanges.subscribe(id => {
      if (id) {
        this.service.getById(this.City.value).subscribe({
          next: resp => {
            this.cities = new DefaultSelect([resp], 1);
            if (resp) {
              const { noDelegation, noSubDelegation, state } = resp;
              let infoForms = {
                noDelegation,
                noSubDelegation,
                state,
              };
              this.state.next(infoForms);
            }
          },
        });
      }
    });
  }

  getCities(params: ListParams) {
    this.service.getAll(params).subscribe({
      next: data => (this.cities = new DefaultSelect(data.data, data.count)),
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
    });
  }

  onCitiesChange(subdelegation: any) {
    //this.resetFields([this.City]);
    this.cities = new DefaultSelect();
    /* this.form.updateValueAndValidity(); */
    if (subdelegation) {
      const { noDelegation, noSubDelegation, state } = subdelegation;
      let infoForms = {
        noDelegation,
        noSubDelegation,
        state,
      };
      this.state.next(infoForms);
    }
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
