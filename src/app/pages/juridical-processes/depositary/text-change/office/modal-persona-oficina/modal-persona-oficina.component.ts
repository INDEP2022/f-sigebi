import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-modal-persona-oficina',
  templateUrl: './modal-persona-oficina.component.html',
  styles: [],
})
export class ModalPersonaOficinaComponent extends BasePage implements OnInit {
  form: FormGroup;
  users$ = new DefaultSelect<ISegUsers>();
  nameUserDestinatario: ISegUsers;
  options: any[];
  personExtInt: string;
  personExtInt_I: string;
  nrSelecttypePerson: string;
  select: any[];
  @Output() dataCopy = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<true>();
  managementNumber: any;
  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private mJobManagementService: MJobManagementService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      typePerson_I: [null, Validators.required],
      senderUser_I: [null, null],
      personaExt_I: [null, Validators.required],
    });
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'E', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];

    this.form.get('typePerson_I').valueChanges.subscribe(value => {
      if (value === 'E') {
        this.form.get('senderUser_I').setValue(null);
        this.form.get('personaExt_I').setValue('');
      } else {
        this.form.get('senderUser_I').setValue('');
      }
    });
  }
  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
  }

  getAllUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }

  getDescUser(control: string, event: Event) {
    this.nameUserDestinatario = JSON.parse(JSON.stringify(event));
    if (control === 'control') {
      this.form.get('personaExt').setValue(this.nameUserDestinatario.name);
    } else {
      this.form.get('personaExt_I').setValue(this.nameUserDestinatario.name);
    }
  }

  close() {
    this.modalRef.hide();
  }

  agregarExterno() {
    if (this.managementNumber == null) {
      this.dataCopy.emit(this.form.value);
    } else {
      let obj: any = {
        managementNumber: this.managementNumber,
        addresseeCopy: this.form.value.senderUser_I,
        delDestinationCopyNumber: null,
        recordNumber: null,
        personExtInt: this.form.value.typePerson_I,
        nomPersonExt: this.form.value.personaExt_I,
      };

      this.mJobManagementService.createCopyOficeManag(obj).subscribe({
        next: (resp: any) => {
          this.refresh.emit(true);
          this.loading = false;
          this.onLoadToast('success', 'CPP creado exitosamente', '');
        },
        error: err => {
          this.onLoadToast('error', 'error al crear CPP', '');
          this.loading = false;
        },
      });
    }

    this.modalRef.content.callback(true, this.form.value);
    this.close();
  }
}
