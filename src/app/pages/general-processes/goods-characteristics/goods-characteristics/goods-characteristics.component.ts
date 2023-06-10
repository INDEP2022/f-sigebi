import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { AccountMovements } from 'src/app/core/services/ms-account-movements/account-movements.service';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { GoodPartializeService } from 'src/app/core/services/ms-partialize/partialize.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  get good() {
    return this.service.good;
  }

  set good(value) {
    this.service.good = value;
  }

  get form() {
    return this.service.form ? this.service.form : null;
  }

  get haveTdictaUser() {
    return this.service.haveTdictaUser;
  }

  set haveTdictaUser(value) {
    this.service.haveTdictaUser = value;
  }

  get di_numerario_conciliado() {
    return this.service.di_numerario_conciliado;
  }

  set di_numerario_conciliado(value) {
    this.service.di_numerario_conciliado = value;
  }

  get disabledBienes() {
    return this.service.disabledBienes;
  }

  set disabledBienes(value) {
    this.service.disabledBienes = value;
  }

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

  constructor(
    private goodProcessService: GoodprocessService,
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
    private comerDetailService: ComerDetailsService
  ) {
    super();
    this.loading = true;
    this.params.value.limit = 1;
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      if (this.count > 0) this.searchGood(true);
      this.count++;
    });
    // this.form.valueChanges.subscribe(async x => {
    //   console.log(x);
    //   // await this.preUpdate();
    //   // await this.postRecord();
    // });
  }

  selectTab() {
    console.log(this.staticTabs);

    if (this.staticTabs?.tabs[1]) {
      this.staticTabs.tabs[0].disabled = true;
      this.staticTabs.tabs[1].active = true;
    }
  }

  ngOnInit(): void {
    this.service.prepareForm();
    this.activatedRoute.queryParams.subscribe({
      next: param => {
        console.log(param);
        if (param['noBien']) {
          // this.selectTab();
          this.numberGood.setValue(param['noBien']);
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
    setTimeout(() => {
      this.selectTab();
    }, 1000);
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
    console.log(this.service.data);
    let body: any = {
      id: this.good.id,
      goodId: this.good.goodId,
    };
    this.service.data.forEach(row => {
      body[row.column] = row.value;
    });
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
    body['observationss'] = this.goodObservations.value;
    if (this.goodAppraisal2.value) {
      body['appraisal'] = 'Y';
    }
    console.log(body);
    await this.preUpdate();
    this.goodService.update(body).subscribe({
      next: response => {
        this.onLoadToast('success', 'Bien actualizado correctamente');
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
      filterParams.addFilter('numberGood', this.good.goodId);
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
    this.form.reset();
    this.good = null;
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

  // private async

  async postQuery() {
    // debugger;
    await this.postRecord(true);
    this.loading = false;
    setTimeout(() => {
      this.service.goodChange.next(true);
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
      this.onLoadToast(
        'error',
        'Error de parametrización',
        'No se tiene parametrizada la clasificación del numerario'
      );
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

    vn_simb = this.good.val5.indexOf('/');
    if (vn_simb > 0) {
      vf_fecha = firstFormatDate(new Date(this.good.val5));
    } else {
      vn_simb = this.good.val5.indexOf('-');
      if (vn_simb > 0) {
        vf_fecha = secondFormatDate(new Date(this.good.val5));
      } else {
        vf_fecha = thirdFormatDate(new Date(this.good.val5));
      }
    }
    try {
      vn_impor = +this.good.val2;
    } catch (x) {
      this.onLoadToast(
        'error',
        'Numerario',
        'Fallo al transformar la cantidad numerica del importe'
      );
      return false;
    }
    lbln_encontro = false;
    lbln_conciliado = 'N';
    lbln_conciliado = await firstValueFrom(
      this.comerDetailService.faCoinciliationGood({
        goodNumber: this.numberGood.value,
        expedientNumber: this.good.fileNumber,
        coinKey: this.good.val1,
        bankKey: this.good.val4,
        accountKey: this.good.val6,
        deposit: vn_impor,
        vf_fecha,
        update: 'S',
      })
    );
    if (lbln_conciliado === 'S') {
      this.di_numerario_conciliado = 'Conciliado';
    } else {
      this.onLoadToast(
        'warning',
        'Conciliación',
        'No se encontró un movimiento relacionado'
      );
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
      this.onLoadToast(
        'error',
        'Excep Numerario',
        'No pudo cargar los parametros'
      );
      return false;
    }
    const data = parameters ? parameters.data : [];
    const vn_NumEfe = data.find(item => item.id === 'CLASINUMER')?.initialValue;
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
      this.good.val2 =
        this.pufQuitaCero((this.good.val2 + '').replace(',', '.')) + '';
      let vnPunto = (this.good.val2 + '').indexOf('.');
      if (vnPunto != 0) {
        try {
          this.goodAppraisal.setValue(+this.good.val2 + '');
        } catch (x) {
          this.onLoadToast('error', 'Verifique el valor númerico del campo 2');
          return false;
        }
      } else {
        try {
          this.goodAppraisal.setValue(this.good.val2);
          // this.good.appraisedValue = this.good.val2;
        } catch (x) {
          this.onLoadToast('error', 'Verifique el valor númerico del campo 2');
          return false;
        }
      }
      if (this.numberClassification.value === vn_NumFis) {
        this.good.cveCurrencyAppraisal = this.good.val3;
      } else {
        this.good.cveCurrencyAppraisal = this.good.val1;
      }
    } else if (this.numberClassification.value === vn_Valores) {
      this.good.val3 =
        this.pufQuitaCero((this.good.val2 + '').replace(',', '.')) + '';
      let vnPunto = (this.good.val3 + '').indexOf('.');
      if (vnPunto != 0) {
        try {
          this.numberClassification.setValue(
            this.getNewApraisedValueForVnValores(vnPunto, this.good.val3)
          );
        } catch (x) {
          this.onLoadToast('error', 'Verifique el valor númerico del campo 3');
          return false;
        }
      } else {
        try {
          this.goodAppraisal.setValue(this.good.val3);
          // this.good.appraisedValue = this.good.val3;
        } catch (x) {
          this.onLoadToast('error', 'Verifique el valor númerico del campo 3');
          return false;
        }
      }
      this.good.cveCurrencyAppraisal = this.good.val2;
    } else if (this.numberClassification.value === vn_Ctas) {
      this.good.val7 =
        this.pufQuitaCero((this.good.val7 + '').replace(',', '.')) + '';
      let vnPunto = (this.good.val7 + '').indexOf('.');
      if (vnPunto != 0) {
        try {
          this.numberClassification.setValue(
            this.getNewApraisedValueForVnValores(vnPunto, this.good.val7)
          );
        } catch (x) {
          this.onLoadToast('error', 'Verifique el valor númerico del campo 7');
          return false;
        }
      } else {
        try {
          this.goodAppraisal.setValue(this.good.val7);
          // this.good.appraisedValue = this.good.val3;
        } catch (x) {
          this.onLoadToast('error', 'Verifique el valor númerico del campo 7');
          return false;
        }
      }
      this.good.cveCurrencyAppraisal = this.good.val6;
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
        this.onLoadToast(
          'error',
          'Descripción bien',
          'Verifique la cantidad de carácteres (no menor a 2 posiciones).'
        );
        return false;
      }
      if (this.validationTypeSubtype()) {
        if (this.good.val14 === 'S') {
          if (this.goodAppraisal.value === null) {
            this.onLoadToast(
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
      this.onLoadToast('error', 'Descripción bien', 'No debe ser nula');
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
      return true;
    }
    if (this.type && this.type.value) {
      this.filterParams.addFilter('goodTypeId', this.type.value);
    }
    if (this.subtype && this.subtype.value) {
      this.filterParams.addFilter('subTypeId', this.subtype.value);
    }
    if (this.ssubtype && this.ssubtype.value) {
      this.filterParams.addFilter('ssubTypeId', this.ssubtype.value);
    }
    if (this.sssubtype && this.sssubtype.value) {
      this.filterParams.addFilter('sssubTypeId', this.sssubtype.value);
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
      const response = await firstValueFrom(
        this.goodService
          .getAll(this.filterParams.getParams())
          .pipe(catchError(x => of({ data: [], count: 0 })))
      );
      if (response.data && response.data.length > 0) {
        let item = response.data[0];
        this.totalItems = response.count ?? 0;
        if (item) {
          // this.se
          this.good = item;

          this.service.newGood = {
            id: this.good.id,
            goodId: this.good.goodId,
          };
          // this.excepNumerario();
          this.numberGood.setValue(item.id);
          this.type.setValue(item.goodTypeId);
          this.subtype.setValue(item.subTypeId);
          // this.form.get('ssubtype').setValue(item.goodTypeId);
          // this.form.get('sssubtype').setValue(item.goodTypeId);
          // this.getDelegation(item.delegationNumber);
          // this.getSubdelegation(item.subDelegationNumber);
          this.delegacion = item.delegationNumber.id ?? null;
          this.delegation.setValue(item.delegationNumber.description);
          this.subdelegacion = item.subDelegationNumber.id ?? null;
          this.subdelegation.setValue(item.subDelegationNumber.description);
          this.getLatitudLongitud(item.goodId);
          // this.getDelegation(item.)
          this.numberClassification.setValue(item.goodClassNumber);
          this.goodStatus.setValue(item.goodStatus);
          this.descripcion.setValue(item.description);
          this.goodUnit.setValue(item.unit);
          this.goodQuantity.setValue(item.quantity);
          this.goodReference.setValue(item.referenceValue);
          this.goodAppraisal.setValue(item.appraisedValue);
          this.goodDateVigency.setValue(
            formatForIsoDate(item.appraisalVigDate, 'string')
          );
          // this.goodLatitude.setValue(item.latitude);
          // this.goodLongitude.setValue(item.longitud);
          this.goodObservations.setValue(item.observationss);
          if (item.appraisal === null) {
            this.goodAppraisal2.setValue(false);
          } else {
            this.totalItems = 0;
            this.loading = false;
          }
          // this.getTDicta();
          await this.postQuery();
        } else {
          this.loading = false;
          this.service.goodChange.next(false);
        }
      } else {
        this.totalItems = 0;
        this.loading = false;
        this.service.goodChange.next(false);
        this.onLoadToast('error', 'ERROR', 'No existe el Bien ingresado');
      }
    } else {
      this.loading = false;
      this.totalItems = 0;
      this.service.goodChange.next(false);
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

  private async postRecord(postQuery = false) {
    // debugger;
    const filterParams = new FilterParams();
    filterParams.addFilter('typeNumber', 'CARBIEN');
    filterParams.addFilter('user', localStorage.getItem('username'));
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
    if (postQuery) {
      this.fillAvaluo();
    }
    await this.getValidations();
  }

  private fillAvaluo() {
    if (this.type.value === '6' && this.subtype.value) {
      if (this.goodAppraisal.value === null) {
        if (this.good.val14 === 'S') {
          this.goodAppraisal2.setValue('S');
        } else if (this.good.val14 === 'N') {
          this.goodAppraisal2.setValue('N');
        } else {
          if (this.good.val14 === null) {
            this.goodAppraisal2.setValue('X');
          } else {
            this.goodAppraisal2.setValue('S');
          }
        }
      } else {
        if (this.good.val14 === 'S') {
          this.goodAppraisal2.setValue('S');
        }
        if (this.good.val14 === 'N') {
          this.goodAppraisal2.setValue('S');
        }
        if (this.good.val14 !== 'S' && this.good.val14 !== 'N') {
          this.goodAppraisal2.setValue('S');
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
}
