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
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { ICustomer } from 'src/app/core/models/catalogs/customer.model';

@Component({
  selector: 'app-customers-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './customers-shared.component.html',
  styles: [
  ]
})
export class CustomersSharedComponent extends BasePage implements OnInit {
  
  @Input() form: FormGroup;
  @Input() customerField: string = 'customer';

  @Input() showCustomer: boolean = true;

  params = new BehaviorSubject<ListParams>(new ListParams());
  customers = new DefaultSelect<ICustomer>();

  get customer() {
    return this.form.get(this.customerField);
  }

  constructor(private service: CustomerService) {
    super();
  }

  ngOnInit(): void {}

  getCustomers(params: ListParams) {
    this.service.getAll(params).subscribe(
      data => {
        this.customers = new DefaultSelect(data.data, data.count);
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

  onCustomersChange(subdelegation: any) {
    this.customers = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
