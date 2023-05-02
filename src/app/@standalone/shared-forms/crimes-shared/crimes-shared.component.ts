import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
/**import SERVICE**/
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { ICrime } from 'src/app/core/models/administrative-processes/crime.model';
import { dataCrimes } from './data';

@Component({
  selector: 'app-crimes-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './crimes-shared.component.html',
  styles: [],
})
export class CrimesSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() crimeField: string = 'crime';

  @Input() showCrimes: boolean = true;

  params = new BehaviorSubject<ListParams>(new ListParams());
  crimes = new DefaultSelect<ICrime>();

  constructor() {
    super();
  }

  ngOnInit(): void {}

  getCrimes(params: ListParams) {
    //Provisional data
    let data = dataCrimes;
    let count = data.length;
    this.crimes = new DefaultSelect(data, count);

    /*this.service.getAll(params).subscribe(
      data => {
        this.Crimes = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );*/
  }

  onCrimesChange(type: any) {
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
