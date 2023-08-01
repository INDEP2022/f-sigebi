import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { DictaminacionService } from 'src/app/common/services/dictaminacion.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-technical-sheets',
  templateUrl: './technical-sheets.component.html',
  styles: [],
})
export class TechnicalSheetsComponent extends BasePage implements OnInit {
  form: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  data: any;
  username: string = '';
  nivel_usuario: any;

  global = {};

  constructor(
    private fb: FormBuilder,
    private programmingRequestService: ProgrammingRequestService,
    private dictaminaService: DictaminacionService,
    private router: Router,
    private authService: AuthService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
  }

  get userData() {
    return this.authService.decodeToken();
  }
  ngOnInit(): void {
    console.log(this.userData.department);
    this.initForm();
    this.startCalendars();
    this.getUserInfo();
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  startCalendars() {
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.minModeFromMonth,
        dateInputFormat: 'MM',
      }
    );
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  initForm() {
    this.form = this.fb.group({
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      user: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      coordinador: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  getUserInfo() {
    return this.programmingRequestService
      .getUserInfo()
      .pipe(
        switchMap((data: any) => {
          console.log(data);
          this.username = data.username;
          console.log('Usuario logueado: ', this.username);
          const userprueba = 'HTORTOLERO';
          return this.dictaminaService.getUserLevel(userprueba).pipe(
            catchError(() => of('1')) // Manejo del error con un valor por defecto
          );
        })
      )
      .subscribe((nivelUsuario: any) => {
        this.nivel_usuario = nivelUsuario.nivel_usar;
        console.log('Nivel de usuario: ', this.nivel_usuario);
        if (this.nivel_usuario === '2') {
          this.params.getValue()[
            'filter.no_delegacion'
          ] = `$eq:${this.userData.department}`;
        } else if (this.nivel_usuario === '') {
          this.params.getValue()[
            'filter.no_delegacion'
          ] = `$eq:${this.userData.department}`;
          this.params.getValue()[
            'filter.usuario'
          ] = `$eq:${this.userData.username}`;
        }
        /// llamar a la función que carga la tabla
      });
  }

  onSubmit() {}

  onRevisionFichas() {
    this.router.navigate([
      '/pages/final-destination-process/review-technical-sheets',
    ]);
  }

  changeDelegation(event: any) {
    this.form.get('coordinador').patchValue(event?.id);
  }
}
