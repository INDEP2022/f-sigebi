import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//import { MeasurementUnitsService } from 'src/app/core/services/catalogs/measurement-units.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IUser } from 'src/app/core/models/administrative-processes/siab-sami-interaction/user.model';
import { usersData } from './data';

@Component({
  selector: 'app-user-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-shared.component.html',
  styles: [],
})
export class UsersSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() userField: string = 'user';
  @Input() label: string = 'Usuarios';
  @Input() showUsers: boolean = true;
  //If Form PatchValue
  @Input() patchValue: boolean = false;

  users = new DefaultSelect<IUser>();

  constructor(/*private service: WarehouseService*/) {
    super();
  }

  ngOnInit(): void {}

  getUsers(params: ListParams) {
    //Provisional data
    let data = usersData;
    let count = data.length;
    this.users = new DefaultSelect(data, count);
    /*this.service.getAll(params).subscribe(data => {
        this.status = new DefaultSelect(data.data,data.count);
      },err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);

      }, () => {}
    );*/
  }

  onUsersChange(type: any) {
    if (this.patchValue) {
      this.form.patchValue({
        userId: type.userId,
        name: type.name,
      });
      this.form.updateValueAndValidity();
    } else {
      this.form.updateValueAndValidity();
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
