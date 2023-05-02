import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { ServiceCatService } from 'src/app/core/services/catalogs/service-cat.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IServiceCat } from 'src/app/core/models/catalogs/service-cat.model';

@Component({
  selector: 'app-services-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './services-shared.component.html',
  styles: [],
})
export class ServicesSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() serviceField: string = 'service';

  @Input() showServices: boolean = true;

  services = new DefaultSelect<IServiceCat>();

  constructor(private service: ServiceCatService) {
    super();
  }

  ngOnInit(): void {}

  getServices(params: ListParams) {
    this.service.getAll(params).subscribe(
      data => {
        this.services = new DefaultSelect(data.data, data.count);
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

  onServicesChange(type: any) {
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
