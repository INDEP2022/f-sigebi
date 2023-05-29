import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { IncidentMaintenanceService } from 'src/app/core/services/ms-generalproc/incident-maintenance.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-incident-maintenance',
  templateUrl: './incident-maintenance.component.html',
  styles: [],
})
export class IncidentMaintenanceComponent extends BasePage implements OnInit {
  form: ModelForm<any>;
  select = new DefaultSelect();
  params = new BehaviorSubject<ListParams>(new ListParams());
  apruebaSelected = new DefaultSelect();
  IncidenceSelected = new DefaultSelect();
  mntoStatus: string;
  userValidation: number;

  constructor(
    private fb: FormBuilder,
    private securityService: SecurityService,
    private incidentMaintenanceService: IncidentMaintenanceService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    const user = this.authService.decodeToken() as any;
    console.log(user);
    this.getApruebaSearch(new ListParams());
    this.validation();
  }

  prepareForm() {
    this.form = this.fb.group({
      aprovedUser: [null, [Validators.required]],
      incidenceId: [null, [Validators.required]],
      ticketId: [null, [Validators.required]],
      officeId: [null, [Validators.required]],
      incidenceDetail: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      solutionDetail: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      strSql: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      mntoStatus: [null],
      detiUser: [null],
      dateAttendsDeti: [null],
      dateRunUser: [null],
      nbOrigin: [null],
    });
  }

  getApruebaSearch(params: ListParams) {
    params['filter.assigned'] = `$eq:S`;

    this.securityService.getAllFilterAssigned(params).subscribe({
      next: resp => {
        console.log(resp.data);
        this.apruebaSelected = new DefaultSelect(resp.data, resp.count);
      },
      error: error => {
        console.log(error);
        this.apruebaSelected = new DefaultSelect();
      },
    });
  }

  getIncidence(params?: ListParams) {
    params[
      'filter.aprovedUser'
    ] = `$eq:${this.form.controls['aprovedUser'].value}`;
    console.log(this.form.controls['aprovedUser'].value);
    this.incidentMaintenanceService.getAllFilterAprovedUser(params).subscribe({
      next: resp => {
        console.log(resp);
        this.IncidenceSelected = new DefaultSelect(resp.data, resp.count);
      },
      error: error => {
        console.log(error);
        this.IncidenceSelected = new DefaultSelect();
      },
    });
  }

  getIncidences(data: any) {
    console.log(data);
    const params = new ListParams();
    params['filter.aprovedUser'] = `$eq:${data.user.user}`;
    console.log(this.form.controls['aprovedUser'].value);
    this.incidentMaintenanceService.getAllFilterAprovedUser(params).subscribe({
      next: resp => {
        console.log(resp);
        this.IncidenceSelected = new DefaultSelect(resp.data, resp.count);
      },
      error: error => {
        console.log(error);
        this.IncidenceSelected = new DefaultSelect();
      },
    });

    for (const controlName in this.form.controls) {
      if (this.form.controls.hasOwnProperty(controlName)) {
        if (controlName != 'aprovedUser') {
          this.form.controls[controlName].setValue(null);
        }
      }
    }
  }

  getIncidenceId(params: ListParams) {
    params[
      'filter.incidenceId'
    ] = `$eq:${this.form.controls['incidenceId'].value}`;
    this.incidentMaintenanceService.getAllFilterAprovedUser(params).subscribe({
      next: resp => {
        console.log(resp);
        this.form.patchValue(resp.data[0]);

        this.mntoStatus = this.form.controls['mntoStatus'].value;
      },
      error: error => {
        console.log(error);
      },
    });
  }

  validation() {
    this.userValidation = -1;
    for (const controlName in this.form.controls) {
      if (
        this.form.controls.hasOwnProperty(controlName) &&
        this.userValidation < 0
      ) {
        if (controlName != 'aprovedUser' && controlName != 'incidenceId') {
          this.form.controls[controlName].disable();
          console.log(controlName);
        }
      }
    }
  }

  putAproved() {
    this.loading = true;
    if (this.form.valid) {
      this.form.controls['mntoStatus'].setValue('EJECUTADO');
      const data: any = {};
      for (const controlName in this.form.controls) {
        if (this.form.controls.hasOwnProperty(controlName)) {
          const control = this.form.controls[controlName];
          data[controlName] = control.value;
        }
      }
      console.log(data);
      this.incidentMaintenanceService.update4(data).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    } else {
      this.onLoadToast(
        'warning',
        'Advertencia',
        `Debe llenar los campos requeridos`
      );
      this.loading = false;
    }
  }

  handleSuccess() {
    const message: string = 'Ejecución';
    this.onLoadToast('success', 'Ejecutado', `${message} Correctamente`);
    this.loading = false;
    for (const controlName in this.form.controls) {
      if (this.form.controls.hasOwnProperty(controlName)) {
        this.form.controls[controlName].setValue(null);
        this.form.controls[controlName].enable();
      }
    }
    this.validation();
  }
}
