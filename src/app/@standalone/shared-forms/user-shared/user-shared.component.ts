import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { UsersService } from 'src/app/core/services/ms-users/users.service';

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
  @Input() id: boolean = false;
  //If Form PatchValue
  @Input() patchValue: boolean = false;
  @Output() change = new EventEmitter<IUser>();

  users = new DefaultSelect<IUser>();

  constructor(private serviceUser: UsersService) {
    super();
  }

  ngOnInit(): void {}

  getUsers(params: ListParams) {
    const routeUser = `?filter.name=$ilike:${params.text}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(res => {
      this.users = new DefaultSelect(res.data, res.count);
    });

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
    this.change.emit(type);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
