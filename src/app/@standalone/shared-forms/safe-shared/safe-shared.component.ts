import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//Models
import { debounceTime } from 'rxjs';
import { ISafe } from 'src/app/core/models/catalogs/safe.model';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
@Component({
  selector: 'app-safe-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './safe-shared.component.html',
  styles: [],
})
export class SafeSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;

  @Input() safeField: string = 'safe';

  safes = new DefaultSelect<ISafe>();

  get safe() {
    return this.form.get(this.safeField);
  }

  constructor(private safeService: SafeService) {
    super();
  }

  ngOnInit(): void {
    this.form
      .get(this.safeField)
      .valueChanges.pipe(
        debounceTime(300) // Retraso de 300 ms antes de realizar la búsqueda
      )
      .subscribe(value => {
        const newParams = new ListParams();
        newParams['filter.idSafe'] = value;
        this.getSafes(newParams);
      });
  }

  getSafes(params: ListParams) {
    /*{ type: this.warehouseType.value, ...params }*/
    this.safeService.getAll(params).subscribe(
      data => {
        data.data.map(data => {
          data.description = `${data.idSafe}- ${data.description}`;
          return data;
        });
        this.safes = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.safes = new DefaultSelect();
      },
      () => {}
    );
  }

  onSafeChange(type: any) {
    this.form.updateValueAndValidity();
    //this.resetFields([this.subdelegation]);
    //this.subdelegations = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
