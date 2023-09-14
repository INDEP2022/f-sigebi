import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { CopiesOfficialOpinionService } from 'src/app/core/services/ms-dictation/ms-copies-official-opinion.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-add-copy',
  templateUrl: './add-copy.component.html',
  styles: [],
})
export class AddCopyComponent extends BasePage implements OnInit {
  form: FormGroup;
  @Input() screenKey: string = '';
  @Input() numberOfDicta: number = null;
  @Input() typeDictamination: string = '';

  @Output() dataCopy = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<true>();
  users$ = new DefaultSelect<ISegUsers>();
  nameUserDestinatario: ISegUsers;
  options: any[];
  personExtInt: string;
  personExtInt_I: string;
  nrSelecttypePerson: string;
  select: any[];
  dataEdit: boolean;
  managementNumber: any;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private mJobManagementService: MJobManagementService,
    private msCopiesOfficialOpinionService: CopiesOfficialOpinionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'E', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];

    this.form = this.fb.group({
      typePerson_I: [null, Validators.required],
      senderUser_I: [''],
      personaExt_I: [
        '',
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1500),
        ],
      ],
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
        console.log('AQUI', response.data);
        let result = response.data.map(async (item: any) => {
          item['userAndName'] = item.id + ' - ' + item.name;
        });
        Promise.all(result).then((resp: any) => {
          this.users$ = new DefaultSelect(response.data, response.count);
          // this.recipients = new DefaultSelect(response.data, response.count);
          this.loading = false;
        });
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
    if (this.screenKey == 'FACTJURDICTAMOFICIO') {
      this.saveCopiesByScreenKey(); // OFICIO DE DICTAMINACIONES JURIDICAS
    } else {
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
    }
    // this.modalRef.content.callback(true, this.form.value);
    this.close();
  }

  saveCopiesByScreenKey() {
    let obj: any = {
      numberOfDicta: this.numberOfDicta,
      typeDictamination: this.typeDictamination,
      recipientCopy: this.form.value.senderUser_I,
      copyDestinationNumber: null,
      personExtInt: this.form.value.typePerson_I,
      namePersonExt: this.form.value.personaExt_I,
    };
    this.msCopiesOfficialOpinionService.create(obj).subscribe({
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
}
