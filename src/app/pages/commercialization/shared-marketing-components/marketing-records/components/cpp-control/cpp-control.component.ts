import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CppControl } from '../../utils/cpp-form';

@Component({
  selector: 'cpp-control',
  templateUrl: './cpp-control.component.html',
  styles: [],
})
export class CppControlComponent extends BasePage implements OnInit, OnChanges {
  @Input() disabled: boolean = false;
  @Input() form: FormGroup<CppControl>;
  @Input() users = new DefaultSelect();

  constructor(private usersService: UsersService) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.disabled
      ? this.form.controls.id.disable()
      : this.form.controls.id.enable();
  }

  ngOnInit(): void {}

  getUsers(params: FilterParams) {
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: response =>
        (this.users = new DefaultSelect(response.data, response.count)),
      error: error =>
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener el Remitente'
        ),
    });
  }
}
