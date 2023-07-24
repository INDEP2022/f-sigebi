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
  getUsuarios(params: ListParams) {
    this.securityService.getAllUsersTracker(params).subscribe({
      next: data => {
        this.user = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.user = new DefaultSelect();
      },
    });
  }
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
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.alert('success', `${message} Correctamente`, '');
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
