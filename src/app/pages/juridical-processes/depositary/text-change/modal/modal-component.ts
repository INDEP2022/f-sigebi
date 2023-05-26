import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-textChange-modal',
  templateUrl: './modal-component.html',
})
export class ModalComponent implements OnInit {
  @Input() datosOpinion!: any;
  @Input() form: FormGroup;

  users$ = new DefaultSelect<ISegUsers>();
  nameUserDestinatario: ISegUsers;
  options: any[];
  personExtInt: string;
  personExtInt_I: string;
  nrSelecttypePerson: string;

  constructor(private usersService: UsersService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'E', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];

    this.form.get('typePerson_I').valueChanges.subscribe(value => {
      if (value === 'S') {
        this.form.get('senderUser').setValue(null);
      } else {
        this.form.get('senderUser').setValue('');
      }
    });

    this.setValues();
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

  setValues() {
    this.nrSelecttypePerson! = this.datosOpinion.personExtInt;
    this.form.get('typePerson_I').setValue(this.nrSelecttypePerson);
    this.form.get('senderUser_I').setValue(this.datosOpinion.recipientCopy);
    this.form.get('personaExt_I').setValue(this.datosOpinion.namePersonExt);
  }
}
