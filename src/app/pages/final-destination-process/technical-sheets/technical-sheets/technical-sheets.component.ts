import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BehaviorSubject, catchError, of, switchMap, takeUntil } from 'rxjs';
import { DictaminacionService } from 'src/app/common/services/dictaminacion.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FichasTecnicasService } from 'src/app/core/services/fichas-tecnicas/fichas-tecnicas.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from './../../../../common/repository/interfaces/list-params';
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
  numero_delegacion: string;
  dataTable: LocalDataSource = new LocalDataSource();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  columnFilters: any = [];

  global = {};

  constructor(
    private fb: FormBuilder,
    private programmingRequestService: ProgrammingRequestService,
    private dictaminaService: DictaminacionService,
    private router: Router,
    private authService: AuthService,
    private fichasTecnicas: FichasTecnicasService
  ) {
    super();
    this.settings = { ...this.settings, actions: false, hideSubHeader: false };
    this.settings.columns = COLUMNS;
  }

  get userData() {
    return this.authService.decodeToken();
  }
  ngOnInit(): void {
    localStorage.setItem('DWHERE', '');
    localStorage.setItem('tipo_reg', 'N');
    localStorage.setItem('p_fec', '');
    const exist = this.filterParams.getValue().getFilterParams();
    if (exist) {
      const filters = exist.split('&');
      filters.map(fil => {
        const partsFilter = fil.split('=');
        this.columnFilters[partsFilter[0]] = partsFilter[1];
      });
    }

    this.dataTable
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            switch (filter.field) {
              case 'yearEvaluates':
                searchFilter = SearchFilter.EQ;
                break;
              case 'monthValues':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          console.log(this.params);
          this.getUserInfo();
        }
      });

    console.log(this.userData.department);
    this.initForm();
    this.startCalendars();

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getUserInfo();
    });
  }

  selectFila(event: any) {
    console.log(event);
    let anioSelect = event.data.yearEvaluates;
    let mesOrigin = event.data.monthValues;
    let mesSelect: string = mesOrigin.toString().padStart(2, '0');
    let lv_fec_inicial = `01${mesSelect}${anioSelect}`;

    const dateEvalua = new Date(`${anioSelect}-${mesSelect}-01`);
    const dateComparar = new Date('2008-05-01');

    const lastDay = new Date(anioSelect, mesOrigin, 0).getDate();
    const formattedLastDay = lastDay < 10 ? `0${lastDay}` : `${lastDay}`;

    let lv_fec_final = `${formattedLastDay}${mesSelect}${anioSelect}`;
    let no_delegacion_selected = event.data.no_delegacion;
    let usuario_revision = event.data.usuario_revision;

    if (dateEvalua >= dateComparar) {
      let dwhereData = `USUARIO_IDFT= '${this.username.toLocaleUpperCase()}' AND trunc(FECHA_IDFT) between '${lv_fec_inicial}' and '${lv_fec_final}' and NO_DELEGACION_IDFT in ('${no_delegacion_selected}') and TIPO_ACTA in(''ENTREGA'')'`;
      localStorage.setItem('DWHERE', dwhereData);
    } else {
      let dwhereData = `'DESALOJO_DIADIA = 0 AND USUARIO_IDFT= '${this.username}' AND trunc(FECHA_IDFT) between '${lv_fec_inicial}' and '${lv_fec_final}' and NO_DELEGACION_IDFT in ('${no_delegacion_selected}') and TIPO_ACTA in(''ENTREGA'')'`;
      localStorage.setItem('DWHERE', dwhereData);
    }

    localStorage.setItem(
      'p_fec',
      `Revisión de la Ficha Técnica del '${lv_fec_inicial}' al '${lv_fec_final}'`
    );
    localStorage.setItem('tipo_reg', 'T');

    this.router.navigate([
      `/pages/final-destination-process/review-technical-sheets/${lv_fec_inicial}/${lv_fec_final}/${usuario_revision}/${no_delegacion_selected}`,
    ]);
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
    });
  }

  getUserInfo() {
    return this.programmingRequestService
      .getUserInfo()
      .pipe(
        switchMap((data: any) => {
          this.username = data.username;
          this.numero_delegacion = data.department;
          console.log('Usuario logueado: ', this.username);
          console.log(
            'No. Delegacion usuario logueado: ',
            this.numero_delegacion
          );
          const userprueba = 'HTORTOLERO';
          return this.dictaminaService
            .getUserLevel(userprueba)
            .pipe(catchError(() => of('1')));
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
        this.getFichasTecnicas();
      });
  }

  onSubmit() {
    this.getUserInfo();
  }

  onRevisionFichas() {
    localStorage.setItem('DWHERE', '');
    localStorage.setItem('tipo_reg', 'N');
    this.router.navigate([
      '/pages/final-destination-process/review-technical-sheets/null/null/null/null',
    ]);
  }

  getFichasTecnicas() {
    this.loading = true;

    console.log(this.form.value);
    const anioOriginal = this.form.value.year;
    const mesOriginal = this.form.value.month;
    const anio = new Date(anioOriginal);
    const mes = new Date(mesOriginal);
    const soloAnio = anio.getFullYear().toString();
    const soloMes = (mes.getMonth() + 1).toString();

    const params = {
      ...this.params.getValue(),
      ...this.columnFilters,
      'filter.yearEvaluates': `$eq:${soloAnio}`,
      'filter.monthValues': `$eq:${soloMes}`,
    };
    this.fichasTecnicas.getFichasTecnicas(params).subscribe({
      next: data => {
        console.log(data);
        let dataCreada: any[] = [];
        for (let ficha of data.data) {
          let fichaObjeto: any = {};
          fichaObjeto.yearEvaluates = ficha.yearEvaluates;
          fichaObjeto.monthValues = ficha.monthValues;
          fichaObjeto.userReview = ficha.userReview;
          fichaObjeto.delegationNumber = ficha.delegationNumber;
          dataCreada.push(fichaObjeto);
        }
        this.dataTable.load(dataCreada);
        this.totalItems = data.count;
        this.loading = false;
      },
      error: error => {
        this.dataTable.load([]);
        this.loading = false;
      },
    });
  }

  changeDelegation(event: any) {
    this.form.get('coordinador').patchValue(event?.id);
  }
}
