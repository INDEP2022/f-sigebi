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

  ngOnInit(): void {}

  getSafes(params: ListParams) {
    /*{ type: this.warehouseType.value, ...params }*/
    this.safeService.getAll(params).subscribe(
      data => {
        this.safes = new DefaultSelect(data.data, data.count);
        console.log(data.data);
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
