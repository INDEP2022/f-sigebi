import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-update-copy',
  templateUrl: './update-copy.component.html',
  styles: [],
})
export class UpdateCopyComponent extends BasePage implements OnInit {
  form: FormGroup;

  @Output() dataCopy = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<boolean>();
  senders = new DefaultSelect<ISegUsers>();
  nameUserDestinatario: ISegUsers;
  options: any[];
  // personExtInt: string;
  // personExtInt_I: string;
  // nrSelecttypePerson: string;
  select: any[];
  dataEdit: any;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.options = [
      { value: null, label: 'Seleccione un valor' },
      { value: 'E', label: 'PERSONA EXTERNA' },
      { value: 'I', label: 'PERSONA INTERNA' },
    ];
    console.log('this.dataEdit', this.dataEdit);
    this.form = this.fb.group({
      typePerson_I: [null, Validators.required],
      addresseeCopy: [
        this.dataEdit.addresseeCopy ? this.dataEdit.addresseeCopy : '',
        Validators.required,
      ],
      personaExt_I: [
        this.dataEdit.nomPersonExt ? this.dataEdit.nomPersonExt : '',
        Validators.required,
      ],
    });
  }

  async getSenders(params: ListParams) {
    this.usersService.getAllSegUsers(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });
        Promise.all(result).then((resp: any) => {
          this.senders = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.senders = new DefaultSelect();
      }
    );
  }

  // getAllUsers(params: ListParams) {
  //   // const params_ = new ListParams();
  //   // params_['filter.user'] = `$eq:${params_.text}`
  //   return this.usersService.getAllSegUsers(params).subscribe({
  //     next: (resp) => {

  //       this.users$ = new DefaultSelect(resp.data, resp.count);

  //     }, error: (error) => {
  //       this.users$ = new DefaultSelect([], 0, true);
  //     }
  //   }
  //   );
  // }

  getDescUser(control: string, event: Event) {
    // this.nameUserDestinatario = JSON.parse(JSON.stringify(event));
    // if (control === 'control') {
    //   this.form.get('personaExt').setValue(this.nameUserDestinatario.name);
    // } else {
    //   this.form.get('personaExt_I').setValue(this.nameUserDestinatario.name);
    // }
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
