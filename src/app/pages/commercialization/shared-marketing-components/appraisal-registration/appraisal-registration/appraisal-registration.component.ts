import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IParameters } from 'src/app/core/models/ms-parametergood/parameters.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { AppraisalRegistrationMain } from '../classes/appraisal-registration-main';
const IVA = 'IVA';
const COLUMN_NUM = 'AVALUOM_NOCOLUM';
const NO_PARAMETERS_ERROR =
  'Ocurrió un error al obtener parámetros para el funcionamiento de la pantalla';
@Component({
  selector: 'app-appraisal-registration',
  templateUrl: './appraisal-registration.component.html',
  styles: [],
})
export class AppraisalRegistrationComponent
  extends AppraisalRegistrationMain
  implements OnInit
{
  constructor(
    private activatedRoute: ActivatedRoute,
    private parametersModService: ParameterModService,
    private parameterService: ParametersService,
    private authService: AuthService
  ) {
    super();
    const screen = this.activatedRoute.snapshot.data['screen'];
    this.global.direction = screen == 'FCOMERREGAVALUO' ? 'M' : 'I';
    this.screen = screen;
  }

  ngOnInit(): void {
    this.getIvaParameter().subscribe();
    this.getColumnNum().subscribe();
    console.log(this.authService.decodeToken());
  }

  getColumnNum() {
    return this.parameterService.getById(COLUMN_NUM).pipe(
      catchError(error => {
        this.alert('error', 'Error', NO_PARAMETERS_ERROR);
        return throwError(() => error);
      }),
      tap((response: any) => {
        const parameter = response as IParameters;
        if (!parameter) {
          this.alert('error', 'Error', NO_PARAMETERS_ERROR);
          return;
        }
        this.global.vIva = Number(parameter.initialValue);
      })
    );
  }

  getIvaParameter() {
    const params = new FilterParams();
    params.addFilter('parameter', IVA);
    return this.parametersModService.getParamterMod(params.getParams()).pipe(
      catchError(error => {
        this.alert('error', 'Error', NO_PARAMETERS_ERROR);
        return throwError(() => error);
      }),
      tap(response => {
        const iva = response?.data[0]?.value;
        if (!iva) {
          this.alert('error', 'Error', NO_PARAMETERS_ERROR);
          return;
        }
        this.global.vIva = Number(`.${iva}`);
      })
    );
  }
}
