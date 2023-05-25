import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-textChange-modal',
  templateUrl: './modal-component.html',
})
export class ModalComponent implements OnInit {
  form: FormGroup = this.fb.group({
    senderUserRemitente: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    addressee_I: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    descriptionSender: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
    ],
    typePerson: [null, [Validators.required]],
    senderUser: [null, null],
    personaExt: [null, null],
    typePerson_I: [null, [Validators.required]],
    senderUser_I: [null, null],
    personaExt_I: [null, null],
    key: [
      null,
      [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
    ],
    numberDictamination: [
      null,
      [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(11)],
    ],
  });

  users$ = new DefaultSelect<ISegUsers>();
  nameUserDestinatario: ISegUsers;
  options: any[];
  personExtInt: string;
  personExtInt_I: string;

  constructor(private usersService: UsersService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'E', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];
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
}
