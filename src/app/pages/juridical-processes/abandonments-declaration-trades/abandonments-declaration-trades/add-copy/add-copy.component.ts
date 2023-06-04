import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-add-copy',
  templateUrl: './add-copy.component.html',
  styles: [],
})
export class AddCopyComponent implements OnInit {
  form: FormGroup;

  @Output() dataCopy = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<boolean>();
  users$ = new DefaultSelect<ISegUsers>();
  nameUserDestinatario: ISegUsers;
  options: any[];
  personExtInt: string;
  personExtInt_I: string;
  nrSelecttypePerson: string;
  select: any[];
  dataEdit: boolean;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private modalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'E', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];

    this.form = this.fb.group({
      typePerson_I: [null, Validators.required],
      senderUser_I: ['', Validators.required],
      personaExt_I: ['', Validators.required],
    });

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
    console.log('AAA', this.form.value);

    this.dataCopy.emit(this.form.value);
    // this.modalRef.content.callback(true, this.form.value);
    this.close();
  }
}
