import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { ICharacteristicsGoodDTO } from 'src/app/core/models/ms-good/good';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { AccountMovements } from 'src/app/core/services/ms-account-movements/account-movements.service';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { AttribGoodBadService } from 'src/app/core/services/ms-good/attrib-good-bad.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { GoodPartializeService } from 'src/app/core/services/ms-partialize/partialize.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOUBLE_POSITIVE_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { IParamsLegalOpinionsOffice } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/legal-opinions-office/legal-opinions-office.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  firstFormatDate,
  firstFormatDateToSecondFormatDate,
  formatForIsoDate,
  secondFormatDate,
  thirdFormatDate,
} from 'src/app/shared/utils/date';
import { SubdelegationService } from '../../../../core/services/catalogs/subdelegation.service';
import { GoodsCharacteristicsService } from '../services/goods-characteristics.service';

@Component({
  selector: 'app-goods-characteristics',
  templateUrl: './goods-characteristics.component.html',
  styleUrls: ['./goods-characteristics.component.scss'],
})
export class GoodsCharacteristicsComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  formLoading = false;
  showConciliado = false;
  LVALIDA = true;
  filterParams = new FilterParams();
  newLimit = new FormControl(1);
  totalItems = 0;
  count = 0;
  delegacion: number;
  subdelegacion: number;
  selectedBad: any;
  form: FormGroup;
  disabledBienes: boolean = true;
  goodChange: number = 0;
  bodyGoodCharacteristics: ICharacteristicsGoodDTO = {};
  loadTypes = false;
  get data() {
    return this.service.data;
  }

  set data(value) {
    this.service.data = value;
  }

  get good() {
    return this.service.good;
  }

  set good(value) {
    this.service.good = value;
  }

  // get form() {
  //   return this.service.form ? this.service.form : null;
  // }

  get haveTdictaUser() {
    return this.service.haveTdictaUser;
  }

  set haveTdictaUser(value) {
    this.service.haveTdictaUser = value;
  }

  // get di_numerario_conciliado() {
  //   return this.service.di_numerario_conciliado;
  // }

  // set di_numerario_conciliado(value) {
  //   this.service.di_numerario_conciliado = value;
  // }

  // get disabledBienes() {
  //   return this.service.disabledBienes;
  // }

  // set disabledBienes(value) {
  //   this.service.disabledBienes = value;
  // }

  get disabledDescripcion() {
    return this.service.disabledDescripcion;
  }

  set disabledDescripcion(value) {
    this.service.disabledDescripcion = value;
  }

  get disabledNoClasifBien() {
    return this.service.disabledNoClasifBien;
  }

  set disabledNoClasifBien(value) {
    this.service.disabledNoClasifBien = value;
  }

  get disabledTable() {
    return this.service.disabledTable;
  }

  set disabledTable(value) {
    this.service.disabledTable = value;
  }

  get numberGood() {
    return this.form.get('noBien');
  }

  get numberClassification() {
    return this.form.get('noClasif');
  }

  get goodStatus() {
    return this.form.get('status');
  }

  get goodUnit() {
    return this.form.get('unidad');
  }

  get goodQuantity() {
    return this.form.get('cantidad');
  }

  get goodReference() {
    return this.form.get('valRef');
  }

  get goodAppraisal() {
    return this.form.get('valorAval');
  }

  get goodDateVigency() {
    return this.form.get('fechaAval');
  }

  get goodLatitude() {
    return this.form.get('latitud');
  }

  get goodLongitude() {
    return this.form.get('longitud');
  }

  get goodObservations() {
    return this.form.get('observaciones');
  }

  get goodAppraisal2() {
    return this.form.get('avaluo');
  }

  get delegation() {
    return this.form.get('delegation');
  }

  get subdelegation() {
    return this.form.get('subdelegation');
  }

  get latitud() {
    return this.form.get('latitud');
  }

  get longitud() {
    return this.form.get('longitud');
  }

  get type() {
    return this.form.get('type');
  }

  get subtype() {
    return this.form.get('subtype');
  }

  get ssubtype() {
    return this.form.get('ssubtype');
  }

  get sssubtype() {
    return this.form.get('sssubtype');
  }

  get descripcion() {
    return this.form.get('descripcion');
  }

  get pathDelegation() {
    return 'catalog/api/v1/delegation/get-all?filter.etapaEdo:$eq:' + this.good;
  }

  get disabledDescripcion2() {
    if (this.disabledDescripcion) {
      return true;
    } else {
      if (this.disabledBienes) {
        return true;
      }
      return false;
    }
  }

  select = new DefaultSelect();

  screenKey: string = 'FACTDIRDATOSBIEN'; // Clave de la pantalla actual
  origin: string = null;
  origin1: string = ''; // Pantalla para regresar a la anterior de la que se llamo origin
  origin2: string = ''; // Pantalla para regresar a la anterior de la que se llamo desde la origin1
  origin3: string = ''; // Pantalla para regresar a la anterior de la que se llamo desde la origin2
  paramsScreenOffice: IParamsLegalOpinionsOffice = {
    PAQUETE: '',
    P_GEST_OK: '',
    CLAVE_OFICIO_ARMADA: '',
    P_NO_TRAMITE: '',
    TIPO: '',
    P_VALOR: '',
    TIPO_VO: '',
    NO_EXP: '',
    CONSULTA: '',
  };
  TIPO_PROC: string = '';
  NO_INDICADOR: string = '';
  di_numerario_conciliado: string;
  constructor(
    private goodProcessService: GoodprocessService,
    private location: Location,
    private goodService: GoodService,
    private serviceDeleg: DelegationService,
    private subdelegationService: SubdelegationService,
    private georeferencieService: SurvillanceService,
    private statusScreenService: StatusXScreenService,
    private dictationService: DictationService,
    private activatedRoute: ActivatedRoute,
    private parameterService: ParameterCatService,
    private accountMovementsService: AccountMovements,
    private segxAccessService: SegAcessXAreasService,
    private service: GoodsCharacteristicsService,
    private goodPartialize: GoodPartializeService,
    private comerDetailService: ComerDetailsService,
    private attribGoodBadService: AttribGoodBadService,
    private fb: FormBuilder,
    public router: Router
  ) {
    super();
    this.loading = true;
    this.params.value.limit = 1;
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      // console.log(params);
      if (this.count > 0) this.searchGood(true);
      this.count++;
    });
    // this.form.valueChanges.subscribe(async x => {
    //   console.log(x);
    //   // await this.preUpdate();
    //   // await this.postRecord();
    // });
  }

  selectTab(tabDisabled: 0 | 1, tabActive: 0 | 1) {
    console.log(this.staticTabs);

    if (this.staticTabs?.tabs[tabActive]) {
      this.staticTabs.tabs[tabDisabled].disabled = true;
      this.staticTabs.tabs[tabActive].active = true;
    }
  }

  back() {
    this.location.back();
  }

  prepareForm() {
    this.form = this.fb.group({
      type: [null],
      subtype: [null],
      ssubtype: [null],
      sssubtype: [null],
      noBien: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      noClasif: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      status: [null, [Validators.pattern(STRING_PATTERN)]],
      descripcion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      unidad: [null, [Validators.pattern(STRING_PATTERN)]],
      cantidad: [null, [Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      delegation: [null],
      subdelegation: [null],
      valRef: [null, [Validators.pattern(STRING_PATTERN)]],
      fechaAval: [null],
      valorAval: [null, [Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      latitud: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      longitud: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      avaluo: ['0'],
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.activatedRoute.queryParams.subscribe({
      next: param => {
        console.log(param);
        this.origin = param['origin'] ?? null;
        this.origin1 = param['origin1'] ?? null;
        if (
          this.origin1 == 'FACTJURDICTAMOFICIO' &&
          this.origin == 'FATRIBREQUERIDO'
        ) {
          for (const key in this.paramsScreenOffice) {
            if (Object.prototype.hasOwnProperty.call(param, key)) {
              this.paramsScreenOffice[
                key as keyof typeof this.paramsScreenOffice
              ] = param[key] ?? null;
            }
          }
          this.origin2 = param['origin2'] ?? null;
          this.origin3 = param['origin3'] ?? null;
          this.TIPO_PROC = param['TIPO_PROC'] ?? null;
          this.NO_INDICADOR = param['NO_INDICADOR'] ?? null;
        }
        const selectedBadString = localStorage.getItem('selectedBad');
        if (selectedBadString) {
          this.selectedBad = JSON.parse(selectedBadString);
          console.log(this.selectedBad);
          if (!this.origin) this.origin = '1';
          console.log(this.origin);

          // this.selectTab();
          this.numberGood.setValue(this.selectedBad.id);
          this.searchGood();
        }
        // this.goodService.getById2(param['noBien']).subscribe({
        //   next: data => {
        //     this.searchGood(data);
        //   },
        // });
      },
    });
    // this.form.get('noBien').valueChanges.subscribe({
    //   next: val => {
    //     this.goodService.getById2(val).subscribe({
    //       next: data => {
    //         this.searchGood(data);
    //       },
    //     });
    //   },
    // });
  }

  ngAfterViewInit() {
    // this.selectTab();
    if (localStorage.getItem('selectedBad')) {
      setTimeout(() => {
        this.selectTab(0, 1);
      }, 1000);
    } else {
      setTimeout(() => {
        this.selectTab(1, 0);
      }, 1000);
    }
  }

  handleEvent(data: any) {
    console.log('Evento recibido:', data);
  }

  updateClasif(event: any) {
    console.log(event);
  }

  getGoods(ssssubType: IGoodSssubtype) {
    // this.good = ssssubType.numClasifGoods;
  }

  updateDelegation(event: any) {
    console.log(event);
    this.delegacion = event.id;
  }

  updateSubdelegation(event: any) {
    console.log(event);
    this.subdelegacion = event.id;
  }

  async save() {
    console.log(this.data);
    let body: any = {
      id: this.good.id,
      goodId: this.good.goodid,
    };
    let tableValid = true;
    this.data.forEach(row => {
      if (row.required && !row.value) {
        this.alert(
          'error',
          'Bien ' + this.numberGood.value,
          'Complete las características requeridas'
        );
        // this.onLoadToast(
        //   'error',
        //   'Bien ' + this.numberGood.value,
        //   'Complete las características requeridas'
        // );
        tableValid = false;
        return;
      }
      body[row.column] = row.value;
    });
    if (!tableValid) {
      console.log(this.data);
      return;
    }
    this.good.description;
    body['description'] = this.descripcion.value;
    body['unit'] = this.goodUnit.value;
    body['delegationNumber'] = this.delegacion;
    body['subDelegationNumber'] = this.subdelegacion;
    body['quantity'] = this.goodQuantity.value;
    body['referenceValue'] = this.goodReference.value;
    body['appraisedValue'] = this.goodAppraisal.value;
    body['appraisalVigDate'] = firstFormatDateToSecondFormatDate(
      this.goodDateVigency.value
    );
    body['cveCurrencyAppraisal'] = this.good.cveCurrencyAppraisal;
    body['observationss'] = this.goodObservations.value;
    if (this.goodAppraisal2.value) {
      body['appraisal'] = 'Y';
    }
    if (this.type.value + '' === '6' && this.subtype.value + '' === '1') {
      if (!this.good.val14) {
        body.val14 = 'S';
      }
    }
    console.log(body);
    const preUpdateValid = await this.preUpdate();
    if (!preUpdateValid) {
      return;
    }
    if (this.selectedBad && this.selectedBad.motive) {
      this.attribGoodBadService
        .remove(this.selectedBad)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            console.log(response);
          },
          error: err => {
            console.log(err);
          },
        });
    }

    this.goodService
      .update(body)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.alert(
            'success',
            'Bien ' + this.numberGood.value,
            'Actualizado correctamente'
          );

          // this.onLoadToast(
          //   'success',
          //   'Bien ' + this.numberGood.value,
          //   'Actualizado correctamente'
          // );
        },
      });
    await this.pupInsertGeoreferencia();
  }

  private async fillConciliate() {
    let clasificators = '62,1424,1426,1590';
    if (
      this.numberClassification.value &&
      clasificators.includes(this.numberClassification.value + '')
    ) {
      const filterParams = new FilterParams();
      filterParams.addFilter('numberGood', this.good.goodid);
      const accounts = await firstValueFrom(
        this.accountMovementsService
          .getAll(filterParams.getParams())
          .pipe(catchError(x => of(null)))
      );
      if (accounts && accounts.data && accounts.data.length > 0) {
        this.di_numerario_conciliado = 'Conciliado';
      }
      this.showConciliado = true;
      console.log(accounts);
    }
  }

  clearFilter() {
    this.bodyGoodCharacteristics = {};
    this.form.reset();
    this.good = null;
    this.data = [];
    this.totalItems = 0;
  }
  private async getDelegacionJoinSubdelDepartamentos() {
    return firstValueFrom(
      this.segxAccessService
        .getDelegationUser(localStorage.getItem('username'))
        .pipe(
          catchError(x => {
            return of({ data: [] });
          }),
          map(x => {
            return x.data;
          })
        )
    );
  }

  private async goodIsPartialize() {
    return await firstValueFrom(
      this.goodPartialize
        .isPartializeGood(this.numberGood.value)
        .pipe(catchError(x => of(null)))
    );
  }

  private async checkPartialize() {
    let vb_parcial = false;
    // debugger;
    const delegaciones = await this.getDelegacionJoinSubdelDepartamentos();
    if (delegaciones) {
      if (delegaciones.length > 1) {
        this.LVALIDA = true;
      } else {
        if (delegaciones[0] === 0) {
          this.LVALIDA = false;
        }
      }
    } else {
      this.LVALIDA = true;
    }
    if ('ATP,ADM'.includes(this.goodStatus.value) && this.LVALIDA) {
      this.disabledDescripcion = true;
    } else {
      const partializedGoods = await this.goodIsPartialize();
      if (partializedGoods) {
        vb_parcial = true;
      }
      if (vb_parcial) {
        this.disabledDescripcion = true;
      } else {
        this.disabledDescripcion = false;
      }
    }
  }

  nval(column: number) {
    const valTemp = this.data.find(row => row.column === 'val' + column);
    const good: any = this.good;
    return valTemp ? valTemp.value : good ? good['val' + column] ?? null : null;
  }

  // private async

  async postQuery() {
    // debugger;
    await this.postRecord(true);
    this.loading = false;
    setTimeout(() => {
      this.goodChange++;
      // this.service.goodChange.next(true);
    }, 100);
    const filterParams = new FilterParams();
    // filterParams.limit = 1000;
    filterParams.addFilter('id', 'CLASINUMER', SearchFilter.EQ);
    const vn_clas_nume = await firstValueFrom(
      this.parameterService
        .getAllWithFilters(filterParams.getParams())
        .pipe(catchError(x => of(null)))
    );
    if (
      !vn_clas_nume ||
      !vn_clas_nume.data ||
      (vn_clas_nume.data && vn_clas_nume.data.length === 0)
    ) {
      this.alert(
        'error',
        'Error de parametrización',
        'No se tiene parametrizada la clasificación del numerario'
      );
      // this.onLoadToast(
      //   'error',
      //   'Error de parametrización',
      //   'No se tiene parametrizada la clasificación del numerario'
      // );
      return;
    }
    await this.fillConciliate();
    await this.checkPartialize();
    // const filterParams2 = new FilterParams();
    // filterParams2.addFilter('numberGood', this.good.goodId);
    // const accounts = await firstValueFrom(
    //   this.accountMovementsService
    //     .getAll(filterParams2.getParams())
    //     .pipe(catchError(x => of(null)))
    // );
    // console.log(accounts);
  }

  private getNewApraisedValueForVnValores(vnPunto: number, val: string) {
    return (
      +val.substring(0, vnPunto - 1) +
      (+val.substring(vnPunto + 1, val.length - vnPunto) / 100).toFixed(2)
    );
  }

  private async pupBuscaNumerario() {
    let vn_simb: number,
      vf_fecha: string,
      vn_impor: number,
      lbln_encontro: boolean,
      lbln_conciliado: string;
    vn_simb = this.nval(5).indexOf('/');
    if (vn_simb > 0) {
      vf_fecha = firstFormatDate(new Date(this.nval(5)));
    } else {
      vn_simb = this.nval(5).indexOf('-');
      if (vn_simb > 0) {
        vf_fecha = secondFormatDate(new Date(this.nval(5)));
      } else {
        vf_fecha = thirdFormatDate(new Date(this.nval(5)));
      }
    }
    try {
      vn_impor = +this.nval(2);
    } catch (x) {
      this.alert(
        'error',
        'Numerario',
        'Fallo al transformar la cantidad numerica del importe'
      );
      // this.onLoadToast(
      //   'error',
      //   'Numerario',
      //   'Fallo al transformar la cantidad numerica del importe'
      // );
      return false;
    }
    lbln_encontro = false;
    lbln_conciliado = 'N';
    lbln_conciliado = await firstValueFrom(
      this.comerDetailService.faCoinciliationGood({
        goodNumber: this.numberGood.value,
        expedientNumber: this.good.fileNumber,
        coinKey: this.nval(1),
        bankKey: this.nval(4),
        accountKey: this.nval(6),
        deposit: vn_impor,
        vf_fecha,
        update: 'S',
      })
    );
    if (lbln_conciliado === 'S') {
      this.di_numerario_conciliado = 'Conciliado';
    } else {
      this.alert(
        'warning',
        'Conciliación',
        'No se encontró un movimiento relacionado'
      );

      // this.onLoadToast(
      //   'warning',
      //   'Conciliación',
      //   'No se encontró un movimiento relacionado'
      // );
    }
    return true;
  }

  private fillValInNumerario(column: number = 2, type: number = 0) {
    let index = this.data.findIndex(row => row.column === 'val' + column);
    if (index > -1) {
      this.data[index].value =
        this.pufQuitaCero((this.data[index] + '').replace(',', '.')) + '';
      let vnPunto = (this.data[index] + '').indexOf('.');
      if (vnPunto != 0) {
        try {
          if (type === 0) {
            this.goodAppraisal.setValue(this.data[index].value);
          } else {
            this.numberClassification.setValue(
              this.getNewApraisedValueForVnValores(
                vnPunto,
                this.data[index].value
              )
            );
          }
          return true;
        } catch (x) {
          // this.onLoadToast(
          //   'error',
          //   'Verifique el valor númerico del campo ' + column
          // );
          this.alert(
            'error',
            'Numerario',
            'Verifique el valor númerico del campo ' + column
          );
          return false;
        }
      } else {
        try {
          this.goodAppraisal.setValue(this.data[index].value);
          return true;
          // this.good.appraisedValue = this.good.val2;
        } catch (x) {
          // this.onLoadToast(
          //   'error',
          //   'Verifique el valor númerico del campo ' + column
          // );

          this.alert(
            'error',
            'Numerario',
            'Verifique el valor númerico del campo ' + column
          );
          return false;
        }
      }
    }
    return true;
  }
  private async excepNumerario() {
    const filterParams = new FilterParams();
    // filterParams.limit = 1000;
    filterParams.addFilter(
      'id',
      'CLASINUMER,CLASINUMEF,CLASIOTMON,CLASIVALOR,CLASICTAS',
      SearchFilter.IN
    );
    const parameters = await firstValueFrom(
      this.parameterService
        .getAllWithFilters(filterParams.getParams())
        .pipe(catchError(x => of(null)))
    );
    if (!parameters) {
      this.alert('error', 'Excep Numerario', 'No pudo cargar los parametros');
      // this.onLoadToast(
      //   'error',
      //   'Excep Numerario',
      //   'No pudo cargar los parametros'
      // );
      return false;
    }
    const data = parameters ? parameters.data : [];
    // const vn_NumEfe = data.find(item => item.id === 'CLASINUMER')?.initialValue;
    const vn_NumFis = data.find(item => item.id === 'CLASINUMEF')?.initialValue;
    const vn_OtrMon = data.find(item => item.id === 'CLASIOTMON')?.initialValue;
    const vn_Valores = data.find(
      item => item.id === 'CLASIVALOR'
    )?.initialValue;
    const vn_Ctas = data.find(item => item.id === 'CLASICTAS')?.initialValue;
    let clasificators = '62,1424,1426,1575,1590';
    if (vn_NumFis) {
      clasificators = clasificators + ',' + vn_NumFis;
    }
    if (vn_OtrMon) {
      clasificators = clasificators + ',' + vn_OtrMon;
    }
    if (
      this.numberClassification.value &&
      clasificators.includes(this.numberClassification.value + '')
    ) {
      if (
        '62,1424,1426,1590'.includes(this.numberClassification.value + '') &&
        this.di_numerario_conciliado === 'No Conciliado'
      ) {
        const result = await this.pupBuscaNumerario();
        if (result === false) {
          return false;
        }
      }
      if (!this.fillValInNumerario(2)) {
        return false;
      }

      const val3 = this.data.find(item => item.column === 'val3');
      if (this.numberClassification.value === vn_NumFis) {
        this.good.cveCurrencyAppraisal = val3 ? val3.value : null;
      } else {
        this.good.cveCurrencyAppraisal = this.nval(1);
      }
    } else if (this.numberClassification.value === vn_Valores) {
      if (!this.fillValInNumerario(3, 1)) {
        return false;
      }
      this.good.cveCurrencyAppraisal = this.nval(2);
    } else if (this.numberClassification.value === vn_Ctas) {
      if (!this.fillValInNumerario(7, 1)) {
        return false;
      }
      this.good.cveCurrencyAppraisal = this.nval(6);
    }
    return true;
  }

  validationTypeSubtype() {
    return (
      this.type &&
      this.type.value === '6' &&
      this.subtype &&
      this.subtype.value + '' === '1'
    );
  }
  async preUpdate() {
    if (this.descripcion && this.descripcion.value) {
      const tamanio = this.descripcion.value.length;
      if (tamanio <= 1) {
        this.alert(
          'error',
          'Descripción bien',
          'Verifique la cantidad de carácteres (no menor a 2 posiciones).'
        );
        // this.onLoadToast(
        //   'error',
        //   'Descripción bien',
        //   'Verifique la cantidad de carácteres (no menor a 2 posiciones).'
        // );
        return false;
      }
      if (this.validationTypeSubtype()) {
        if (this.nval(14) === 'S') {
          if (this.goodAppraisal.value === null) {
            // this.onLoadToast(
            //   'error',
            //   'Valor avalúo',
            //   'Debe indicarlo de contar con él'
            // );
            this.alertInfo(
              'error',
              'Valor avalúo',
              'Debe indicarlo de contar con él'
            );
            //consultar forms
            return false;
          } else {
            //consultar forms
          }
        }
      }
      const resultNumerario = await this.excepNumerario();
      return resultNumerario;
    } else {
      // this.onLoadToast('error', 'Descripción bien', 'No debe ser nula');
      this.alertInfo('error', 'Descripción bien', 'No debe ser nula');
      return false;
    }
  }

  private fillParams(byPage = false) {
    if (byPage) {
      this.filterParams.page = this.params.getValue().page;
      return true;
    }
    this.filterParams = new FilterParams();
    this.filterParams.limit = 1;
    this.filterParams.page = this.params.getValue().page;
    if (this.numberGood && this.numberGood.value) {
      this.filterParams.addFilter('id', this.numberGood.value);
      this.bodyGoodCharacteristics.noGood = this.numberGood.value;
      return true;
    }
    if (this.type && this.type.value) {
      this.filterParams.addFilter('goodTypeId', this.type.value);
      this.bodyGoodCharacteristics.noType = this.type.value;
    }
    if (this.subtype && this.subtype.value) {
      this.filterParams.addFilter('subTypeId', this.subtype.value);
      this.bodyGoodCharacteristics.noSubType = this.subtype.value;
    }
    if (this.ssubtype && this.ssubtype.value) {
      this.filterParams.addFilter('ssubTypeId', this.ssubtype.value);
      this.bodyGoodCharacteristics.noSsubType = this.ssubtype.value;
    }
    if (this.sssubtype && this.sssubtype.value) {
      this.filterParams.addFilter('sssubTypeId', this.sssubtype.value);
      this.bodyGoodCharacteristics.noSssubType = this.sssubtype.value;
    }
    if (this.filterParams.getFilterParams()) {
      return true;
    }
    return false;
  }

  private pufQuitaCero(pcValor: string) {
    let vcVal = pcValor;
    let vnPunto = pcValor.indexOf('.');
    let vnIni, vnFin;
    if (vnPunto != 0) {
      vnIni = vnPunto + 1;
      vnFin = pcValor.length;
      const afterPunto = vcVal.substring(vnIni, vnFin);
      vcVal = vcVal.substring(0, vnIni) + afterPunto.replaceAll('0', '');
    }
    return vcVal;
  }

  async searchGood(byPage = false) {
    // const numberGood = Number(this.numberGood.value);
    // debugger;
    this.loading = true;

    if (this.fillParams(byPage)) {
      // const response = await firstValueFrom(
      //   this.goodService
      //     .getAll(this.filterParams.getParams())
      //     .pipe(catchError(x => of({ data: [], count: 0 })))
      // );
      const newListParams = new ListParams();
      newListParams.limit = this.filterParams.limit;
      newListParams.page = this.filterParams.page;
      const response = await firstValueFrom(
        this.goodProcessService
          .getDistinctTypes(this.bodyGoodCharacteristics, newListParams)
          .pipe(
            catchError(x => of(null)),
            map(x => {
              return {
                ...x,
                data: x.data.map(item => {
                  return {
                    ...item,
                    quantity: item.quantity ? +(item.quantity + '') : null,
                  };
                }),
              };
            })
          )
      );
      if (response && response.data && response.data.length > 0) {
        this.staticTabs.tabs[1].disabled = false;
        this.staticTabs.tabs[1].active = true;
        let item = response.data[0];
        this.totalItems = response.count ?? 0;
        if (item) {
          // this.se
          this.good = item;

          // this.service.newGood = {
          //   id: this.good.id,
          //   goodId: this.good.goodId,
          // };
          // this.excepNumerario();
          this.numberGood.setValue(item.id);
          this.type.setValue(item.no_tipo);
          this.subtype.setValue(item.no_subtipo);
          this.form.get('ssubtype').setValue(item.no_ssubtipo);
          this.form.get('sssubtype').setValue(item.no_sssubtipo);
          this.loadTypes = true;
          // this.getDelegation(item.delegationNumber);
          // this.getSubdelegation(item.subDelegationNumber);
          const delegacion = item.delegationnumber;
          if (delegacion) {
            // this.delegacion = item.delegationNumber.id ?? null;
            // this.delegation.setValue(item.delegationNumber.description);
            this.delegacion = delegacion;
            this.delegation.setValue(delegacion);
          }
          const subdelegacion = item.subdelegationnumber;
          if (subdelegacion) {
            // this.subdelegacion = item.subDelegationNumber.id ?? null;
            // this.subdelegation.setValue(item.subDelegationNumber.description);
            this.subdelegacion = subdelegacion;
            this.subdelegation.setValue(subdelegacion);
          }
          this.getLatitudLongitud(item.goodid);
          // this.getDelegation(item.)
          this.numberClassification.setValue(item.goodclassnumber);
          this.goodStatus.setValue(item.status);
          this.descripcion.setValue(item.description);
          this.goodUnit.setValue(item.unit);
          this.goodQuantity.setValue(item.quantity);
          this.goodReference.setValue(item.referencevalue);
          this.goodAppraisal.setValue(item.appraisedvalue);
          this.goodDateVigency.setValue(
            formatForIsoDate(item.appraisalvigdate, 'string')
          );
          // this.goodLatitude.setValue(item.latitude);
          // this.goodLongitude.setValue(item.longitud);
          this.goodObservations.setValue(item.observationss);
          if (item.appraisal === null) {
            this.goodAppraisal2.setValue(false);
          } else {
            this.goodAppraisal2.setValue(true);
            this.totalItems = 0;
          }
          // this.getTDicta();
          await this.postQuery();
        } else {
          this.loading = false;
          this.goodChange++;
          // this.service.goodChange.next(false);
        }
      } else {
        this.totalItems = 0;
        this.loading = false;
        this.goodChange++;
        this.alertInfo('error', 'Error', 'No existen bienes');
        // this.service.goodChange.next(false);
        // this.onLoadToast('error', 'ERROR', 'No existen bienes');
      }
    } else {
      this.loading = false;
      this.totalItems = 0;
      this.goodChange++;
      // this.service.goodChange.next(false);
    }
  }

  getDelegation(id: any) {
    this.serviceDeleg.getById(id).subscribe(data => {
      this.delegation.setValue(data.description);
    });
  }

  getSubdelegation(id: any) {
    this.subdelegationService.getById(id).subscribe(data => {
      this.subdelegation.setValue(data.description);
    });
  }

  private getStatusXPantalla() {
    const filterParams = new FilterParams();
    filterParams.addFilter('screenKey', 'FACTDIRDATOSBIEN');
    filterParams.addFilter('status', this.good.status);
    return this.statusScreenService
      .getList(filterParams.getFilterParams())
      .pipe(map(x => (x.data ? x.data : [])));
  }

  // debugger;
  private async postRecord(isPostQuery = false) {
    const filterParams = new FilterParams();
    filterParams.addFilter('typeNumber', 'CARBIEN');
    // filterParams.addFilter('user', 'DR_SIGEBI');
    filterParams.addFilter(
      'user',
      localStorage.getItem('username').toUpperCase()
    );
    filterParams.addFilter('reading', 'S');
    // filterParams.addFilter()
    const rdicta = await firstValueFrom(
      this.dictationService
        .getRTdictaAarusr(filterParams.getParams())
        .pipe(catchError(x => of({ count: 0 })))
    );
    if (rdicta && rdicta.count && rdicta.count > 0) {
      this.haveTdictaUser = true;
    }
    if (isPostQuery) {
      this.fillAvaluo();
    }
    await this.getValidations();
  }

  private fillAvaluo() {
    if (this.type.value === '6' && this.subtype.value) {
      if (this.goodAppraisal.value === null) {
        if (this.good.val14 === 'S') {
          this.goodAppraisal2.setValue(true);
        } else if (this.good.val14 === 'N') {
          this.goodAppraisal2.setValue(false);
        } else {
          if (this.good.val14 === null) {
            this.goodAppraisal2.setValue(false);
          } else {
            this.goodAppraisal2.setValue(true);
          }
        }
      } else {
        if (this.good.val14 === 'S') {
          this.goodAppraisal2.setValue(true);
        }
        if (this.good.val14 === 'N') {
          this.goodAppraisal2.setValue(true);
        }
        if (this.good.val14 !== 'S' && this.good.val14 !== 'N') {
          this.goodAppraisal2.setValue(true);
        }
        if (this.goodAppraisal.value != null && this.good.val14 === 'N') {
          this.good.val14 = 'S';
        }
        if (this.goodAppraisal.value != null && this.good.val14 === null) {
          this.good.val14 = 'S';
        }
      }
    }
  }

  private async getValidations() {
    // debugger;
    const response = await firstValueFrom(
      this.getStatusXPantalla().pipe(catchError(x => of(null)))
    );
    if (response) {
      const di_disponible_e = response.filter(x => x.action === 'E').length;
      const di_disponible = response.filter(
        x => x.action === null || x.action === 'null'
      ).length;
      const di_disponible_d = response.filter(x => x.action === 'D').length;
      if (di_disponible > 0) {
        this.disabledBienes = false;
        this.disabledTable = false;
        this.disabledNoClasifBien = false;
        this.disabledDescripcion = false;
      } else {
        if (di_disponible_e > 0 && this.haveTdictaUser) {
          this.disabledBienes = false;
          this.disabledDescripcion = false;
          this.disabledTable = false;
          this.disabledNoClasifBien = false;
        } else if (di_disponible_d > 0 && this.haveTdictaUser) {
          this.disabledBienes = false;
          this.disabledDescripcion = false;
          this.disabledTable = false;
          this.disabledNoClasifBien = false;
        } else {
          this.disabledBienes = true;
          this.disabledDescripcion = true;
          this.disabledTable = true;
          this.disabledNoClasifBien = true;
        }
      }
    } else {
      this.disabledBienes = true;
      this.disabledDescripcion = true;
      this.disabledTable = true;
      this.disabledNoClasifBien = true;
    }
  }

  async pupInsertGeoreferencia() {
    let tipoBien = 1;
    if (this.latitud.value && this.longitud.value) {
      if (this.numberGood.value) {
        const response = await firstValueFrom(
          this.georeferencieService
            .getGeoreferencieObjectById(this.numberGood.value)
            .pipe(catchError(x => of(null)))
        );
        if (response) {
          await firstValueFrom(
            this.georeferencieService.putGeoreferencieObject({
              id: this.numberGood.value,
              georefLatitude: this.latitud.value,
              georefLongituded: this.longitud.value,
              typeId: this.type.value,
              georeferenceId: '1',
            })
          );
        } else {
          await firstValueFrom(
            this.georeferencieService.postGeoreferencieObject({
              id: this.numberGood.value,
              georefLatitude: this.latitud.value,
              georefLongituded: this.longitud.value,
              typeId: this.type.value,
              georeferenceId: '1',
            })
          );
        }
      }
    }
  }

  getLatitudLongitud(id: number) {
    // const params = new FilterParams();
    // params.addFilter('id', id)
    // this.georeferencieService.getGeoreferencieObject().subscribe({
    //   next: response => {
    //     console.log(response);
    //     // if(response.data && response.data.length > 0) {
    //     //   this.longitud.setValue(response.data[0])
    //     // }
    //   }
    // })

    this.georeferencieService.getGeoreferencieObjectById(id).subscribe({
      next: response => {
        console.log(response);
        if (response) {
          this.latitud.setValue(response.georefLatitude);
          this.longitud.setValue(response.georefLongituded);
        }
        // if(response.data && response.data.length > 0) {
        //   this.longitud.setValue(response.data[0])
        // }
      },
      error: err => {
        console.log(err);
      },
    });
  }

  goBack() {
    console.log(this.origin1, this.origin);

    if (
      this.origin1 == 'FACTJURDICTAMOFICIO' &&
      this.origin == 'FATRIBREQUERIDO'
    ) {
      this.router.navigate(
        [`/pages/general-processes/goods-with-required-information`],
        {
          queryParams: {
            ...this.paramsScreenOffice,
            TIPO_PROC: this.TIPO_PROC,
            NO_INDICADOR: this.NO_INDICADOR,
            origin: this.origin1,
            origin2: this.origin2,
            origin3: this.origin3,
          },
        }
      );
    } else {
      this.location.back();
    }
  }
}
