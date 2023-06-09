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
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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

  get goodDescription() {
    return this.form.get('descripcion');
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
    private service: GoodsCharacteristicsService
  ) {
    super();
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

  save() {
    this.preUpdate();
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
    return [1];
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
      if (partializedGoods.length > 0) {
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
    await this.postRecord(true);

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

  private pupBuscaNumerario(): boolean {
    let vn_simb: number,
      vf_fecha: Date,
      vn_impor: string,
      lbln_encontro: boolean,
      lbln_conciliado: string;
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
        const result = this.pupBuscaNumerario();
        if (result === false) {
          return false;
        }
      }
      this.good.val2 = +(this.good.val2 + '').replace(',', '.') + '';
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
      this.good.val3 = +(this.good.val2 + '').replace(',', '.') + '';
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
      this.good.val7 = +(this.good.val2 + '').replace(',', '.') + '';
      let vnPunto = (this.good.val2 + '').indexOf('.');
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
  preUpdate() {
    if (this.descripcion && this.descripcion.value) {
      const tamanio = this.descripcion.value.length;
      if (tamanio <= 1) {
        this.onLoadToast(
          'error',
          'Descripción bien',
          'Verifique la cantidad de carácteres (no menor a 2 posiciones).'
        );
        return;
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
            return;
          } else {
            //consultar forms
          }
        }
      }
      this.excepNumerario();
    } else {
      this.onLoadToast('error', 'Descripción bien', 'No debe ser nula');
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

  searchGood(byPage = false) {
    // const numberGood = Number(this.numberGood.value);
    this.loading = true;
    if (this.fillParams(byPage)) {
      this.goodService.getAll(this.filterParams.getParams()).subscribe({
        next: async response => {
          console.log(response);
          if (response.data && response.data.length > 0) {
            let item = response.data[0];
            this.totalItems = response.count ?? 0;
            if (item) {
              this.good = item;
              this.service.goodChange.next(true);
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
              this.delegation.setValue(item.delegationNumber.description);
              this.subdelegation.setValue(item.subDelegationNumber.description);
              this.getLatitudLongitud(item.goodId);
              // this.getDelegation(item.)
              this.numberClassification.setValue(item.goodClassNumber);
              this.goodStatus.setValue(item.goodStatus);
              this.goodDescription.setValue(item.description);
              this.goodUnit.setValue(item.unit);
              this.goodQuantity.setValue(item.quantity);
              this.goodReference.setValue(item.referenceValue);
              this.goodAppraisal.setValue(item.appraisedValue);
              this.goodDateVigency.setValue(new Date(item.appraisalVigDate));
              // this.goodLatitude.setValue(item.latitude);
              // this.goodLongitude.setValue(item.longitud);
              this.goodObservations.setValue(item.observationss);
              if (item.appraisal === null) {
                this.goodAppraisal2.setValue(false);
              } else {
                this.goodAppraisal2.setValue(true);
              }
              // this.getTDicta();
              await this.postQuery();
              this.loading = false;
            } else {
              this.service.goodChange.next(false);
            }
          } else {
            this.totalItems = 0;
            this.loading = false;
          }
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.service.goodChange.next(false);
          this.onLoadToast('error', 'ERROR', 'No existe el Bien ingresado');
        },
      });
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
      this.dictationService.getRTdictaAarusr(filterParams.getParams())
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
    const response = await firstValueFrom(this.getStatusXPantalla());
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
