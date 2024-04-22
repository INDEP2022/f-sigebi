import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { inputSelect } from 'src/app/pages/final-destination-process/delivery-schedule/schedule-of-events/interfaces/input-select';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-edit-modal-conf',
  templateUrl: './edit-modal-conf.component.html',
  styles: [],
})
export class EditModalConfComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data: any;
  user1 = new DefaultSelect();
  edit: boolean = false;
  goodNumber: any;
  userName: any[];
  userSele: any;
  @Output() refresh = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();

  eventTypeOptions: inputSelect[] = [];
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private usersService: UsersService,
    private goodService: GoodService,
    private authorityService: AuthorityService,
    private indUserService: IndUserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getAllSegUser1(null);
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [],
      goodId: [],
      description: [],
      extDomProcess: [],
      scheduledDateDecoDev: [],
      promoterUserDecoDevo: [],
      quantity: [],
      appraisedValue: [],
      tesofeDate: [],
      tesofeFolio: [],
    });
    this.form.patchValue(this.data);
    console.log(this.data);
  }

  close() {
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.goodService.updateGood(this.form.value).subscribe(
      resp => {
        this.alert('success', 'Registro actualizado correctamente', '');
        this.modalRef.content.callback(true);
        this.close();
      },
      err => {
        this.alert('error', 'Error al actualizar el registro', '');
      }
    );
  }

  getAllSegUser1(params?: ListParams) {
    this.usersService.getAllSegUsers2(params).subscribe({
      next: resp => {
        this.user1 = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }

  getAllSegUserFind(num: any) {
    console.log('num : ', num);
    const params = new ListParams();
    const _params: ListParams = params;
    _params[`filter.name`] = `$eq:${num}`;
    console.log('_params-> ', _params);
    this.usersService.getAllSegUsers2(_params).subscribe({
      next: resp => {
        //this.user1 = new DefaultSelect(resp.data, resp.count);
        console.log('resp.data[0].user -> ', resp.data[0].user);
        this.loadUser(resp.data[0].user);
        //this.form.get('promoter').patchValue(resp.data[0].user);
      },
      error: err => {
        this.user1 = new DefaultSelect();
      },
    });
  }

  formatDate(fecha: string) {
    const fecha_original = new Date(fecha);
    // Obtener los componentes de fecha (día, mes, año)
    const dia = fecha_original.getUTCDate();
    const mes = (fecha_original.getUTCMonth() + 1).toString().padStart(2, '0'); // Añade cero inicial si es necesario
    const año = fecha_original.getUTCFullYear();
    // Formatear la fecha en el nuevo formato DD/MM/YYYY
    const nuevo_formato = `${dia}/${mes}/${año}`;
    return nuevo_formato;
  }

  formatDate2(fecha: string) {
    const fecha_original = new Date(fecha);
    // Obtener los componentes de fecha (día, mes, año)
    const dia = fecha_original.getUTCDate();
    const mes = (fecha_original.getUTCMonth() + 1).toString().padStart(2, '0'); // Añade cero inicial si es necesario
    const año = fecha_original.getUTCFullYear();
    // Formatear la fecha en el nuevo formato DD/MM/YYYY
    return `${año}-${mes}-${dia}`;
  }

  changeUser1(event: any) {
    //name otvalor
    console.log(event);
  }

  onChangeUser(event: any) {
    console.log(event);
    // this.form.get('promoter').patchValue(event.id);
  }

  public getUser(params: ListParams) {
    params.limit = 100;
    params.take = 100;
    this.indUserService.getAllUser(params).subscribe({
      next: data => {
        this.userSele = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        this.userSele = new DefaultSelect();
      },
    });
  }

  loadUser(user: string) {
    this.indUserService.getUser(user).subscribe({
      next: response => {
        this.userSele = new DefaultSelect(response.data, response.count);
        // this.form.get('user').setValue(response.data[0].user);
      },
    });
  }
}
