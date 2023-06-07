import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, catchError, firstValueFrom, map, of } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { AccountMovements } from 'src/app/core/services/ms-account-movements/account-movements.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SubdelegationService } from '../../../../core/services/catalogs/subdelegation.service';

@Component({
  selector: 'app-goods-characteristics',
  templateUrl: './goods-characteristics.component.html',
  styles: [],
})
export class GoodsCharacteristicsComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  goods: IGood[] = [];
  disabledBienes = true;
  disabledDescripcion = false;
  form: FormGroup;
  permisions = false;
  good: IGood | any;
  di_numerario_conciliado = 'No conciliado';
  showConciliado = false;
  LVALIDA = true;
  handleEvent(data: any) {
    console.log('Evento recibido:', data);
  }

  updateClasif(event: any) {
    console.log(event);
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

  get descripcion() {
    return this.form.get('descripcion');
  }

  select = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private goodService: GoodService,
    private serviceDeleg: DelegationService,
    private subdelegationService: SubdelegationService,
    private georeferencieService: SurvillanceService,
    private statusScreenService: StatusXScreenService,
    private dictationService: DictationService,
    private activatedRoute: ActivatedRoute,
    private parameterService: ParameterCatService,
    private accountMovementsService: AccountMovements,
    private segxAccessService: SegAcessXAreasService
  ) {
    super();
    this.form.valueChanges.subscribe(async x => {
      console.log(x);
      // await this.preUpdate();
      // await this.postRecord();
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.activatedRoute.queryParams.subscribe({
      next: param => {
        console.log(param);
        if (param['noBien']) {
          this.searchGood(param['noBien']);
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

  prepareForm() {
    this.form = this.fb.group({
      type: [null],
      subtype: [null],
      ssubtype: [null],
      sssubtype: [null],
      noBien: [null],
      noClasif: [null, [Validators.pattern(STRING_PATTERN)]],
      status: [null, [Validators.pattern(STRING_PATTERN)]],
      descripcion: [null, [Validators.pattern(STRING_PATTERN)]],
      unidad: [null, [Validators.pattern(STRING_PATTERN)]],
      cantidad: [null, [Validators.pattern(STRING_PATTERN)]],
      delegation: [null],
      subdelegation: [null],
      valRef: [null, [Validators.pattern(STRING_PATTERN)]],
      fechaAval: [null],
      valorAval: [null, [Validators.pattern(STRING_PATTERN)]],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      latitud: [null],
      longitud: [null],
      avaluo: ['0'],
    });
  }

  getGoods(ssssubType: IGoodSssubtype) {
    // this.good = ssssubType.numClasifGoods;
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

  private excepNumerario() {
    const filterParams = new FilterParams();
    // filterParams.limit = 1000;
    filterParams.addFilter(
      'id',
      'CLASINUMER,CLASINUMEF,CLASIOTMON,CLASIVALOR,CLASICTAS',
      SearchFilter.IN
    );
    this.parameterService
      .getAllWithFilters(filterParams.getParams())
      .subscribe({
        next: response => {
          console.log(response);
          const data = response ? response.data : [];
          const vn_NumEfe = data.find(
            item => item.id === 'CLASINUMER'
          )?.initialValue;
          const vn_NumFis = data.find(
            item => item.id === 'CLASINUMEF'
          )?.initialValue;
          const vn_OtrMon = data.find(
            item => item.id === 'CLASIOTMON'
          )?.initialValue;
          const vn_Valores = data.find(
            item => item.id === 'CLASIVALOR'
          )?.initialValue;
          const vn_Ctas = data.find(
            item => item.id === 'CLASICTAS'
          )?.initialValue;
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
            // if('62,1424,1426,1590'.includes(this.numberClassification.value + '') && this.good.num)
          }
        },
      });
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

  searchGood(good: any) {
    // const numberGood = Number(this.numberGood.value);

    this.goodService.getById2(good).subscribe({
      next: response => {
        console.log(response);

        this.good = response;
        // this.excepNumerario();
        this.type.setValue(response.goodTypeId);
        this.subtype.setValue(response.subTypeId);
        // this.form.get('ssubtype').setValue(response.goodTypeId);
        // this.form.get('sssubtype').setValue(response.goodTypeId);
        // this.getDelegation(response.delegationNumber);
        // this.getSubdelegation(response.subDelegationNumber);
        this.delegation.setValue(response.delegationNumber.description);
        this.subdelegation.setValue(response.subDelegationNumber.description);
        this.getLatitudLongitud(response.goodId);
        // this.getDelegation(response.)
        this.numberClassification.setValue(response.goodClassNumber);
        this.goodStatus.setValue(response.goodStatus);
        this.goodDescription.setValue(response.description);
        this.goodUnit.setValue(response.unit);
        this.goodQuantity.setValue(response.quantity);
        this.goodReference.setValue(response.referenceValue);
        this.goodAppraisal.setValue(response.appraisedValue);
        this.goodDateVigency.setValue(new Date(response.appraisalVigDate));
        // this.goodLatitude.setValue(response.latitude);
        // this.goodLongitude.setValue(response.longitud);
        this.goodObservations.setValue(response.observationss);
        if (response.appraisal === null) {
          this.goodAppraisal2.setValue('0');
        } else {
          this.goodAppraisal2.setValue('1');
        }
        // this.getTDicta();
        this.postQuery();
      },
      error: err => {
        console.log(err);
        this.onLoadToast('error', 'ERROR', 'No existe el Bien ingresado');
      },
    });
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
    // filterParams.addFilter('user', localStorage.getItem('username'));
    filterParams.addFilter('reading', 'S');
    // filterParams.addFilter()
    const rdicta = await firstValueFrom(
      this.dictationService.getRTdictaAarusr(filterParams.getParams())
    );
    if (rdicta && rdicta.count && rdicta.count > 0) {
      this.permisions = true;
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
      } else {
        if (di_disponible_e > 0 && this.permisions) {
          this.disabledBienes = false;
        } else if (di_disponible_d > 0 && this.permisions) {
          this.disabledBienes = false;
        } else {
          this.disabledBienes = true;
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
