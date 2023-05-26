import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IManagementArea,
  IProceduremanagement,
} from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IEstate } from 'src/app/pages/request/programming-request-components/acept-programming/columns/users-columns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-document-part-office-modal',
  templateUrl: './document-part-office-modal.component.html',
  styles: [],
})
export class DocumentPartOfficeModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Datos';
  documentForm: FormGroup;
  edit: boolean = false;
  Edos$ = new DefaultSelect<IEstate>();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  tasuntos$ = new DefaultSelect<IManagementArea>();
  dataTAsuntos: any[] = [
    { id: '1', descripcion: 'Acta Circunstanciada' },
    { id: '2', descripcion: 'Amparo' },
    { id: '3', descripcion: 'Averiguación Previa' },
    { id: '4', descripcion: 'Causa Penal' },
    { id: '5', descripcion: 'Expediente Transferente' },
  ];
  users$ = new DefaultSelect<ISegUsers>();
  datos: IProceduremanagement;

  get admissionDate() {
    return this.documentForm.controls['admissionDate'].value.toUpperCase();
  }
  get descentfed() {
    return this.documentForm.controls['descentfed'].value.toUpperCase();
  }
  get affair() {
    return this.documentForm.controls['affair'].value.toUpperCase();
  }
  get affairType() {
    return this.documentForm.controls['affairType'].value.toUpperCase();
  }
  get officeNumber() {
    return this.documentForm.controls['officeNumber'].value.toUpperCase();
  }
  get userTurned() {
    return this.documentForm.controls['userTurned'].value.toUpperCase();
  }
  get sheet() {
    return this.documentForm.controls['sheet'].value.toUpperCase();
  }
  get flierNumber() {
    return this.documentForm.controls['flierNumber'].value.toUpperCase();
  }
  get status() {
    return this.documentForm.controls['status'].value.toUpperCase();
  }
  get id() {
    return this.documentForm.controls['id'].value.toUpperCase();
  }

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private stateService: StateOfRepublicService,
    private usersService: UsersService,
    private authService: AuthService,
    private procedureManagementService: ProcedureManagementService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    this.tasuntos$ = new DefaultSelect(
      this.dataTAsuntos,
      this.dataTAsuntos.length
    );
    console.log(this.tasuntos$);
  }
  close() {
    this.modalRef.hide();
  }
  getEdos(parameter: ListParams): void {
    let params = new FilterParams();
    params.addFilter('descentfed', SearchFilter.EQ);
    //console.log('Testldfgñsldkf');
    this.stateService.getAll(parameter).subscribe({
      next: data => {
        this.filterParams.getValue().removeAllFilters();
        data.data.map(edo => {
          edo.descCondition = `${edo.descCondition}`;
          return edo;
        });
        this.Edos$ = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        //this.users$ = new DefaultSelect();
        console.log('Error en la invocations');
      },
    });
  }
  getUsers($params: ListParams) {
    //console.log($params);
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.addFilter('name', $params.text, SearchFilter.LIKE);
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: data => {
        data.data.map(user => {
          user.userAndName = `${user.id}`;
          return user;
        });
        //console.log(data.data);
        this.users$ = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.users$ = new DefaultSelect();
      },
    });
  }
  private prepareForm() {
    this.documentForm = this.fb.group({
      admissionDate: [null, [Validators.required]],
      descentfed: [null, [Validators.required]],
      affair: [null, [Validators.required]],
      affairType: [null, [Validators.required]],
      officeNumber: [null, [Validators.required]],
      userTurned: [null, [Validators.required]],
      sheet: [null, [Validators.required]],
      flierNumber: [null],
      status: [null, [Validators.required]],
      id: [null, [Validators.required]],
      registerUser: [null],
    });
    if (this.datos != null) {
      this.edit = true;
      this.datos.admissionDate = new Date(this.datos.admissionDate);
      this.documentForm.patchValue(this.datos);
    }
  }
  confirm() {
    this.update();
  }

  update() {
    this.alertQuestion(
      'info',
      'Actualizar',
      '¿Desea actualizar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        if (this.documentForm.valid) {
          this.loading = true;
          const token = this.authService.decodeToken();
          let userId = token.preferred_username;

          this.documentForm.controls['affair'].setValue(
            this.documentForm.get('affair').value.toUpperCase()
          );
          this.documentForm.controls['officeNumber'].setValue(
            this.documentForm.get('officeNumber').value.toUpperCase()
          );
          this.documentForm.controls['status'].setValue(
            this.documentForm.get('status').value.toUpperCase()
          );
          this.documentForm.controls['registerUser'].setValue(
            userId.toUpperCase()
          );

          console.log(this.documentForm.value);
          const body = this.documentForm.value;

          this.procedureManagementService
            .update(this.datos.id, body)
            .subscribe({
              next: (data: any) => {
                this.handleSuccess();
              },
              error: error => {
                this.loading = false;
                console.log(error.error.message);
              },
            });
        } else {
          this.onLoadToast(
            'warning',
            'Advertencia',
            'No a seleccionado todos los campos requeridos'
          );
          this.documentForm.markAllAsTouched();
        }
      }
    });
  }
  handleSuccess() {
    const message: string = 'Actualizados';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  dateFormat(date: Date) {
    let fecha = date;
    let anio = fecha.getFullYear();
    let mes: any = fecha.getMonth() + 1;
    let dia: any = fecha.getDate();
    if (mes < 10) {
      mes = '0' + mes;
    }
    if (dia < 10) {
      dia = '0' + dia;
    }
    return anio + '-' + mes + '-' + dia;
  }
  mayus(evet: any) {
    console.log(evet.target.value);
    console.log(evet);
    let dat = evet.target.value.toUpperCase();
    return dat;
  }
}
