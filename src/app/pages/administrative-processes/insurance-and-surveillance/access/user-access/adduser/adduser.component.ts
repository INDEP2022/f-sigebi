import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styles: [],
})
export class AdduserComponent extends BasePage implements OnInit {
  editDialogData: boolean;
  users = new DefaultSelect<any>();
  form: FormGroup;
  data: any;
  constructor(
    private userService: UsersService,
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private securityService: SecurityService
  ) {
    super();
  }

  async ngOnInit() {
    await this.prepareForm();
  }
  async prepareForm() {
    this.form = this.fb.group({
      userKey: new FormControl(null, [Validators.required]),
      userRole: new FormControl(null, [Validators.required]),
      estAccess: new FormControl(null),
    });

    if (this.editDialogData === true) {
      const { userKey, userRole, estAccess }: any = this.data;
      console.log('this.data', this.data);
      this.form.patchValue({
        userKey: userKey.toString(),
        userRole: userRole,
        estAccess: estAccess == 1 ? true : false,
      });
      const paramsUser: any = new ListParams();
      paramsUser.text = userKey.toString();
      await this.getUser2(paramsUser);
    } else {
      await this.getUser(new ListParams());
    }
  }
  close() {
    this.modalRef.hide();
    this.form.reset();
  }

  guardarRegistro() {
    if (this.form.value.userRole != 1 && this.form.value.userRole != 2) {
      this.form.get('userRole').markAsUntouched();
      this.alert('warning', 'Debe seleccionar un rol', '');
      return;
    }
    let obj = {
      userKey: this.form.value.userKey,
      userRole: this.form.value.userRole,
      estAccess: this.form.value.estAccess ? 1 : 0,
    };

    console.log(this.form.value);
    if (this.editDialogData === true) {
      this.userService.editAccessUsers(obj).subscribe({
        next: response => {
          this.alert('success', 'El registro se ha actualizado', '');
          this.modalRef.content.callback(true);
          this.close();
        },
        error: () => {
          this.alert('error', 'Error al actualizar el registro', '');
          this.loading = false;
        },
      });
    } else {
      this.userService.createAccessUsers(obj).subscribe({
        next: response => {
          this.alert('success', 'El registro se ha creado', '');
          this.modalRef.content.callback(true);
          this.close();
        },
        error: error => {
          if (
            (error.error.message =
              'Datos duplicados. Clave pantalla duplicada.')
          ) {
            this.alert(
              'warning',
              'Este usuario ya se encuentra registrado',
              ''
            );
          } else {
            this.alert('error', 'Error al crear el registro', '');
          }

          this.loading = false;
        },
      });
    }
  }

  async getUser(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text) params.search = lparams.text;
    // params.addFilter('user', lparams.text, SearchFilter.ILIKE);

    params.sortBy = `user:ASC`;
    return new Promise((resolve, reject) => {
      this.securityService.getAllUsersTracker(params.getParams()).subscribe({
        next: async (response: any) => {
          console.log('resss', response);

          let result = response.data.map(async (item: any) => {
            // const name = item.userDetail ? item.userDetail.name : '';
            item['userAndName'] = item.user + ' - ' + item.name;
          });

          Promise.all(result).then(async (resp: any) => {
            this.users = new DefaultSelect(response.data, response.count);
            this.loading = false;
          });
        },
        error: error => {
          this.users = new DefaultSelect();
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async getUser2(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    params.addFilter('user', lparams.text, SearchFilter.EQ);

    return new Promise((resolve, reject) => {
      this.securityService.getAllUsersTracker(params.getParams()).subscribe({
        next: async (response: any) => {
          console.log('resss', response);

          let result = response.data.map(async (item: any) => {
            // const name = item.userDetail ? item.userDetail.name : '';
            item['userAndName'] = item.user + ' - ' + item.name;
          });

          Promise.all(result).then(async (resp: any) => {
            this.users = new DefaultSelect(response.data, response.count);
            this.loading = false;
          });
        },
        error: error => {
          this.users = new DefaultSelect();
          this.loading = false;
          resolve(null);
        },
      });
    });
  }
}
