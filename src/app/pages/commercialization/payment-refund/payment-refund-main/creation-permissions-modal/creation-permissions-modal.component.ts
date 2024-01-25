import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PaysService } from '../services/services';

@Component({
  selector: 'app-creation-permissions-modal',
  templateUrl: './creation-permissions-modal.component.html',
  styles: [],
})
export class CreationPermissionsModalComponent
  extends BasePage
  implements OnInit
{
  title: 'Permisos de Creación';
  selectedUser: any = null;
  userItems = new DefaultSelect();
  creationForm: FormGroup = new FormGroup({});
  data_: any;
  text: string = 'Creado';
  constructor(
    private paysService: PaysService,
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private securityService: SecurityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.getUsers(new ListParams())
  }

  private prepareForm(): void {
    this.creationForm = this.fb.group({
      user: [null, [Validators.required]],
      name: [null],
      indGuarantee: [null],
      inddisp: [null],
    });
    if (this.data_) {
      this.creationForm.patchValue({
        user: this.data_.user + ' - ' + this.data_.name,
        name: this.data_.name,
        indGuarantee: this.data_.indGuarantee == 1 ? true : false,
        inddisp: this.data_.inddisp == 1 ? true : false,
      });
      this.text = 'Actualizado';
    }
  }

  close() {
    this.modalRef.hide();
  }

  async getUsers(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text) params.search = lparams.text;
    // params.addFilter('user', lparams.text, SearchFilter.ILIKE);

    params.sortBy = `user:ASC`;
    // return new Promise((resolve, reject) => {
    this.securityService.getAllUsersTracker(params.getParams()).subscribe({
      next: async (response: any) => {
        // console.log('resss', response);
        let result = response.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });

        Promise.all(result).then(async (resp: any) => {
          this.userItems = new DefaultSelect(response.data, response.count);
          this.loading = false;
        });
      },
      error: error => {
        this.userItems = new DefaultSelect();
        this.loading = false;
        // resolve(null);
      },
    });
    // });
  }

  async addPermission() {
    let response: any;
    if (this.data_) {
      // UPDATE
      let obj = {
        user: this.data_.user,
        indGuarantee: this.creationForm.value.indGuarantee ? 1 : 0,
        inddisp: this.creationForm.value.inddisp ? 1 : 0,
        registerNumber: this.data_.registerNumber,
      };
      response = await this.paysService.putEatCtlCreate_(obj, this.data_.user);
    } else {
      // CREATE
      let obj = {
        user: this.creationForm.value.user,
        indGuarantee: this.creationForm.value.indGuarantee ? 1 : 0,
        inddisp: this.creationForm.value.inddisp ? 1 : 0,
        registerNumber: null,
      };
      response = await this.paysService.createEatCtlCreate_(obj);
    }
    if (response) {
      this.alert('success', `Registro ${this.text} correctamente`, '');
      this.modalRef.content.callback(true);
      this.close();
    } else {
      this.alert('warning', 'Ha ocurrido un error', '');
    }
  }
}
