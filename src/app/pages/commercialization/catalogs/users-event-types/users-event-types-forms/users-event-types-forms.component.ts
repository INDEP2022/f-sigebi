import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { UserTpeeventsService } from 'src/app/core/services/ms-user-events/user-tpeevents.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-users-event-types-forms',
  templateUrl: './users-event-types-forms.component.html',
  styles: [],
})
export class UsersEventTypesFormsComponent extends BasePage implements OnInit {
  title: string = 'USUARIO POR TIPO DE EVENTO';
  edit: boolean = false;
  form: ModelForm<any>;
  typeEvent: string;
  userEvent: any;
  idTypeEvent: string;
  user = new DefaultSelect<any>();
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private securityService: SecurityService,
    private userTpeeventsService: UserTpeeventsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm(): void {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      idTpevent: [null, [Validators.required]],
    });
    if (this.userEvent) {
      this.edit = true;
      this.form.patchValue(this.userEvent);
    }
    this.form.controls['idTpevent'].setValue(this.typeEvent);
    this.getUsuarios(new ListParams());
  }

  async getUsuarios(params: ListParams) {
    let text;
    if (params.text) {
      params['filter.user'] = `$ilike:${params.text}`;
      params['search'] = ``;
      text = params.text;
    }
    let user = await this.getUser(params);
    let dataUser: any = user;
    if (user == null) {
      if (text) {
        let params1 = new ListParams();
        params1['filter.name'] = `$ilike:${text}`;
        params1['search'] = ``;
        let user1 = await this.getUser(params1);
        let dataUser1: any = user1;
        this.loading = false;
        console.log(dataUser1);
        this.user = new DefaultSelect(dataUser1.data, dataUser1.count);
      } else {
        this.user = new DefaultSelect();
      }
    } else {
      console.log(dataUser);
      this.loading = false;
      this.user = new DefaultSelect(dataUser.data, dataUser.count);
    }
    /*console.log(user);
    this.securityService.getAllUsersTracker(params).subscribe({
      next: data => {
        this.user = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.user = new DefaultSelect();
      },
    });*/
  }

  async getUser(params: ListParams) {
    return new Promise((resolve, reject) => {
      this.securityService.getAllUsersTracker(params).subscribe({
        next: response => {
          resolve(response);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async userGet(text: string) {}
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    this.loading = true;
    let data = {
      idTpevent: this.idTypeEvent,
      username: this.form.controls['username'].value,
    };
    this.userTpeeventsService.create(data).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.loading = false;
        this.alert('error', `El usuario ya ha sido registrado`, '');
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'ha sido guardado';
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.alert('success', `El usuario ${message}`, '');
    this.loading = false;
    this.modalRef.content.callback(this.idTypeEvent);
    this.modalRef.hide();
  }

  update() {
    // this.loading = true;
    // this.userTpeeventsService.remove(this.form.getRawValue()).subscribe({
    //   next: data => this.handleSuccess(),
    //   error: error => (this.loading = false),
    // });
  }
  close() {
    this.modalRef.hide();
  }
}
