import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { PreviousRouteService } from 'src/app/common/services/previous-route.service';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { ILabelOKey } from 'src/app/core/models/catalogs/label-okey.model';
import { IStatusCode } from 'src/app/core/models/catalogs/status-code.model';
import { IUnitXClassif } from 'src/app/core/models/ms-classifygood/ms-classifygood.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { LabelGoodService } from 'src/app/core/services/catalogs/label-good.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ClassifyGoodService } from 'src/app/core/services/ms-classifygood/ms-classifygood.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { getClassColour } from 'src/app/pages/general-processes/goods-characteristics/goods-characteristics/good-table-vals/good-table-vals.component';
import { ChangeOfGoodCharacteristicService } from '../services/change-of-good-classification.service';
import { CharacteristicGoodCellComponent } from './characteristicGoodCell/characteristic-good-cell.component';
import { ATRIBUT_ACT_COLUMNS } from './columns';

@Component({
  selector: 'app-change-of-good-classification',
  templateUrl: './change-of-good-classification.component.html',
  styleUrls: ['./change-of-good-classification.component.scss'],
})
export class ChangeOfGoodClassificationComponent
  extends BasePage
  implements OnInit
{
  //Reactive Forms
  origin: number = null;
  usuarVal: string;
  form: FormGroup;
  finalStatus: any[];
  // status = new DefaultSelect<IStatusCode>();
  goodChange = 0;
  goodChange2 = 0;
  statusSelect: IStatusCode;
  currentClasif: IGoodSssubtype;
  newClasif: IGoodSssubtype;
  units: IUnitXClassif[] = [];
  noEtiqs: string[] = [];
  endProcess: boolean = false;
  destinations: ILabelOKey[] = [];
  loadingGood = false;
  readOnlyGood = false;
  old: any;
  // listAtributAct: any[] = [];
  // listAtributNew: IAttribClassifGoods[] = [];
  btnNewAtribut: boolean = true;
  atributActSettings: any;
  atributNewSettings: any;
  newDescription: string;
  service = inject(ChangeOfGoodCharacteristicService);
  initValue = false;
  showExpedient = false;
  // atributActSettings = { ...this.settings };
  // pageSizeOptions = [5, 10, 15, 20];
  // limit: FormControl = new FormControl(5);
  // params = new BehaviorSubject<ListParams>(new ListParams());
  // totalItems = 0;
  // limit2: FormControl = new FormControl(5);
  // params2 = new BehaviorSubject<ListParams>(new ListParams());
  // totalItems2 = 0;
  // atributNewSettings = { ...this.settings };
  // dataAct: LocalDataSource = new LocalDataSource();
  // dataNew: LocalDataSource = new LocalDataSource();
  //Criterio por clasificación de bienes
  get numberGood() {
    return this.form.get('numberGood');
  }
  get descriptionGood() {
    return this.form.get('descriptionGood');
  }
  get currentClasification() {
    return this.form.get('currentClasification');
  }
  get descriptionClasification() {
    return this.form.get('descriptionClasification');
  }

  get clasification() {
    return this.form.get('clasification');
  }

  get numberFile() {
    return this.form.get('numberFile');
  }

  //Reactive Forms
  formNew: FormGroup;
  formPrueb: FormGroup;

  get classificationOfGoods() {
    return this.formNew.get('classificationOfGoods');
  }
  get unitXClassif() {
    return this.formNew.get('unitXClassif');
  }
  get destination() {
    return this.formNew.get('destination');
  }
  get fileNumberNew() {
    return this.formNew.get('fileNumberNew');
  }

  get data() {
    return this.service.data;
  }

  get good() {
    return this.service.good;
  }

  set good(value) {
    this.service.good = value;
  }

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private readonly goodServices: GoodService,
    private readonly classifyGoodServices: ClassifyGoodService,
    private readonly labeGoodServices: LabelGoodService,
    private goodFinderService: GoodFinderService,
    private readonly goodsQueryServices: GoodsQueryService,
    private readonly dynamicCatalogsService: DynamicCatalogsService,
    private readonly goodSssubtypeService: GoodSssubtypeService,
    private previousRouteService: PreviousRouteService,
    private statusScreenService: StatusXScreenService,
    private segAcessXAreasService: SegAcessXAreasService,
    private router: Router
  ) {
    super();
    this.buildForm();
    this.buildFormNew();
    this.atributActSettings = {
      ...this.settings,
      actions: null,
      hideSubHeader: false,
      columns: { ...ATRIBUT_ACT_COLUMNS },
    };
    // this.params.value.limit = 5;
    // this.params2.value.limit = 5;
    // this.atributActSettings.actions = false;
    this.usuarVal = localStorage.getItem('username').toUpperCase();
    this.atributNewSettings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: '',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      columns: {
        ...ATRIBUT_ACT_COLUMNS,
        value: {
          ...ATRIBUT_ACT_COLUMNS.value,
          type: 'custom',
          valuePrepareFunction: (cell: any, row: any) => {
            return { value: row, good: this.good };
          },
          renderComponent: CharacteristicGoodCellComponent,
        },
      },
      rowClassFunction: (row: any) => {
        return (
          getClassColour(row.data, false) +
          ' ' +
          (row.data.tableCd ? '' : 'notTableCd')
        );
      },
    };

    // this.atributNewSettings = {
    //   ...this.settings,
    //   actions: {
    //     columnTitle: 'Acciones',
    //     edit: true,
    //     delete: false,
    //     position: 'right',
    //     width: '10%',
    //   },
    //   edit: {
    //     ...this.settings.edit,
    //     saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
    //     cancelButtonContent:
    //       '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
    //     confirmSave: true,
    //   },
    //   mode: 'inline',
    //   columns: { ...ATRIBUT_NEW_COLUMNS },
    // };
  }

  private async initializeForm() {
    const filterParams = new FilterParams();
    filterParams.limit = 100000;
    console.log(localStorage.getItem('username'));
    filterParams.addFilter(
      'user',
      localStorage.getItem('username'),
      SearchFilter.ILIKE
    );
    const results = await firstValueFrom(
      this.segAcessXAreasService
        .getAll(filterParams.getParams())
        .pipe(catchError(x => of(null)))
    );
    if (results) {
      if (results.data && results.data.length > 0) {
        if (results.data[0].delegationNumber + '' === '0') {
          // this.showExpedient = true;
          // this.fileNumberNew.addValidators(Validators.required);
        }
      }
    }
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe({
      next: param => {
        if (param['numberGood']) {
          console.log(param);
          this.readOnlyGood = true;
          this.numberGood.setValue(param['numberGood']);
          if (this.previousRouteService.getHistory().length > 1) {
            this.origin = 1;
          }
          if (!this.loadingGood) {
            this.loadGood();
          }
        } else {
          this.origin = 0;
        }
      },
    });

    this.initializeForm();
    this.numberGood.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(x => {
        if (x) {
          this.loadGood();
        }
      });
    this.classificationOfGoods.valueChanges.subscribe({
      next: response => {
        // console.log(response, this.good);
        if (this.good && response + '' === this.good.goodClassNumber + '') {
          this.initValue = true;
        } else {
          this.initValue = false;
        }
        setTimeout(() => {
          this.goodChange2++;
        }, 100);
      },
    });
    this.form.disable();
    this.formNew.disable();
    this.numberGood.enable();
  }

  goBack() {
    this.previousRouteService.back();
  }

  clear() {
    this.form.reset();
    this.formNew.reset();
    setTimeout(() => {
      this.goodChange++;
    }, 500);

    // this.dataAct.reset();
    // this.listAtributNew = [];
  }

  //disbaledInpust;

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private getStatusXPantalla() {
    const filterParams = new FilterParams();
    filterParams.addFilter('screenKey', 'FCAMNOCLASIFBIEN');
    filterParams.addFilter('status', this.good.status);
    filterParams.addFilter('procesoExtDom', this.good.extDomProcess);
    return this.statusScreenService
      .getList(filterParams.getFilterParams())
      .pipe(
        takeUntil(this.$unSubscribe),
        catchError(x => of({ data: [] })),
        map(x => (x.data ? x.data : []))
      );
  }

  private buildForm() {
    this.form = this.fb.group({
      numberGood: [null, [Validators.required]],
      descriptionGood: [null, [Validators.pattern(STRING_PATTERN)]],
      clasification: [null, [Validators.pattern(STRING_PATTERN)]],
      currentClasification: [null, [Validators.pattern(STRING_PATTERN)]],
      descriptionClasification: [null, [Validators.pattern(STRING_PATTERN)]],
      numberFile: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  private buildFormNew() {
    this.formNew = this.fb.group({
      classificationOfGoods: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      unitXClassif: [null, [Validators.required]],
      destination: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fileNumberNew: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  disabledButton() {
    if (!this.good) return true;
    if (this.formNew.invalid) return true;
    if (!this.classificationOfGoods) return true;
    if (!this.classificationOfGoods.value) return true;
    if (!this.data) return true;
    if (this.data.length === 0) return true;
    let contador = 0;
    for (let index = 0; index < this.data.length; index++) {
      const row = this.data[index];
      if (row.required && !row.value) {
        contador++;
        index = this.data.length;
        return true;
      }
    }
    if (contador > 0) {
      return true;
    }
    return false;
  }

  async loadGood() {
    this.loading = true;
    // this.listAtributAct = [];
    // this.refreshTableAct(this.listAtributAct);
    this.loadingGood = true;
    // this.router.navigate([], {
    //   relativeTo: this.activatedRoute,
    //   queryParams: { numberGood: this.numberGood.value },
    //   queryParamsHandling: 'merge', // remove to replace all query params by provided
    // });

    const filterParams = new FilterParams();
    filterParams.addFilter('id', this.numberGood.value);
    const response = await firstValueFrom(
      this.goodFinderService
        .goodFinder(filterParams.getParams())
        .pipe(catchError(x => of({ data: [] })))
    );
    if (response.data && response.data.length > 0) {
      this.loadingGood = false;
      this.good = response.data[0];
      this.finalStatus = await firstValueFrom(this.getStatusXPantalla());
      // console.log(this.usuarVal, this.usuarVal.substring(0, 3));
      if (
        this.finalStatus.length === 0 &&
        this.usuarVal.substring(0, 3) === 'TLP'
      ) {
        this.alertInfo(
          'error',
          'Cambio de Clasificador',
          'Solo se podrá realizar el cambio de clasificador, de Bienes en Estatus ROP, STA y VXR'
        );
        this.clear();
        return;
      } else {
        this.loadClassifDescription(this.good.goodClassNumber);

        this.classificationOfGoods.enable();

        // this.getAtributos(this.good.goodClassNumber);
      }
    } else {
      this.loading = false;
      this.alert('error', 'Error', 'Bien no encontrado');
    }
  }

  loadClassifDescription(numberClassif: string | number) {
    this.goodSssubtypeService
      .getClasification(numberClassif)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response.data && response.data.length > 0) {
            this.setGood(this.good, response.data[0]);
          } else {
            this.alert(
              'error',
              'Error',
              'No se puede cargar la descripción del clasificador'
            );
          }
          this.loading = false;
        },
        error: err => {
          this.alert(
            'error',
            'Error',
            'No se puede cargar la descripción del clasificador'
          );
          this.loading = false;
        },
      });
  }

  setGood(good: IGood, clasif: IGoodSssubtype) {
    this.currentClasif = clasif;
    this.descriptionGood.setValue(good.description);
    this.clasification.setValue(
      good.goodClassNumber + ' - ' + clasif.description
    );
    this.currentClasification.setValue(good.goodClassNumber);
    this.descriptionClasification.setValue(clasif.description);
    this.numberFile.setValue(good.fileNumber);
    this.fileNumberNew.setValue(good.fileNumber);
    // this.onLoadToast(
    //   'success',
    //   'Éxitoso',
    //   `Se ha cargado correctamente la información del bien No ${good.id}`
    // );
    setTimeout(() => {
      this.goodChange++;
    }, 100);
  }

  accept() {
    //5457740
  }

  get pathClasification() {
    return 'catalog/api/v1/good-sssubtype?sortBy=numClasifGoods:ASC';
  }

  onChange(event: IGoodSssubtype) {
    console.log(event);
    // return;
    this.newClasif = event;
    let LVALIDA = true;
    if (event && LVALIDA) {
      let type = this.currentClasif.numType as IGoodType;
      let subType = this.currentClasif.numSubType as IGoodSubType;
      let newType = this.newClasif.numType as IGoodType;
      let newSubType = this.currentClasif.numSubType as IGoodSubType;
      if (
        type &&
        type.id + '' === '7' &&
        subType &&
        subType.id + '' === '1' &&
        newType &&
        newType.id + '' === '7' &&
        newSubType &&
        newSubType.id + '' === '34'
      ) {
      }
    }
    this.newDescription = event.description;
    this.unitXClassif.setValue(null);
    this.destination.setValue(null);
    this.getUnitiXClasif();
    this.getEtiqXClasif();
    this.formNew.enable();
    this.btnNewAtribut = false;
  }

  getUnitiXClasif() {
    let params = new FilterParams();
    params.addFilter(
      'classifyGoodNumber',
      this.classificationOfGoods.value,
      SearchFilter.EQ
    );
    params.addFilter3('sortBy', 'unit:ASC');
    this.classifyGoodServices
      .getUnitiXClasif(params.getParams())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.units = response.data;
        },
        error: err => {
          this.onLoadToast('error', 'ERROR', 'Error al cargar las unidades');
        },
      });
  }

  getEtiqXClasif() {
    let params = new FilterParams();
    params.addFilter(
      'classifyGoodNumber',
      this.classificationOfGoods.value,
      SearchFilter.EQ
    );
    params.addFilter3('sortBy', 'unit:ASC');
    this.classifyGoodServices
      .getEtiqXClasif(params.getParams())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.noEtiqs = response.data.map(etiq => {
            return etiq.labelNumber;
          });
          this.getDestination();
        },
        error: err => {
          this.onLoadToast(
            'error',
            'ERROR',
            'Error al Cargar los Números de Etiquetas para el Destino'
          );
        },
      });
  }

  getDestination() {
    let params = new FilterParams();
    params.addFilter('id', `${this.noEtiqs}`, SearchFilter.IN);
    params.addFilter3('sortBy', 'description:ASC');
    this.labeGoodServices
      .getEtiqXClasif(params.getParams())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.destinations = response.data;
        },
        error: err => {
          this.onLoadToast('error', 'ERROR', 'Error al cargar el destino');
        },
      });
  }

  newAtribut() {
    if (this.classificationOfGoods.value === '') {
      this.onLoadToast(
        'info',
        'Información',
        'Debe seleccionar un No. De clasificación de Bien'
      );
      return;
    }
  }

  onSaveConfirm(event: any) {
    event.confirm.resolve();
  }

  showAlert() {
    this.alertQuestion(
      'question',
      'Actualizar',
      '¿Desea actualizar el clasificador del Bien?'
    ).then(question => {
      if (question.isConfirmed) {
        this.addAtribut();
      }
    });
  }

  private updateFirsTable() {
    this.currentClasification.setValue(this.classificationOfGoods.value);
    this.descriptionClasification.setValue(this.newDescription);
    this.data.forEach(atrib => {
      if (atrib.value !== undefined) {
        this.good[atrib.column] = atrib.value;
      }
    });
    this.good = { ...this.good };
    console.log(this.good);

    setTimeout(() => {
      this.goodChange++;
    }, 100);
  }

  updateSecondTable() {
    this.formNew.reset();
    this.fileNumberNew.setValue(this.numberFile.value);
    setTimeout(() => {
      this.goodChange2++;
    }, 100);
  }

  async addAtribut() {
    const putGood: any = {
      id: Number(this.good.id),
      goodId: Number(this.good.goodId),
      goodClassNumber: this.classificationOfGoods.value,
      fileeNumber: this.fileNumberNew.value,
      unitMeasure: this.unitXClassif.value,
      destiny: this.destination.value,
      // status: this.finalStatus,
    };
    let contador = 0;
    for (let index = 0; index < this.data.length; index++) {
      const row = this.data[index];
      if (row.required && !row.value) {
        this.alert(
          'error',
          'Bien ' + this.numberGood.value,
          'Complete el atributo ' + row.attribute
        );
        contador++;
        index = this.data.length;
        return;
      }
      putGood[row.column] = row.value;
    }
    if (contador > 0) {
      return;
    }
    // console.log(putGood, 'Atributos sin llenar:' + contador);
    this.goodServices
      .update(putGood)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.alert(
            'success',
            'No. Bien ' + this.good.id,
            `Se ha actualizado la Clasificación Correctamente`
          );
          this.updateFirsTable();
          // this.dataAct.load([]);
          // this.dataAct.refresh();
          // this.form.reset();
          this.updateSecondTable();
        },
        error: err => {
          this.alert(
            'error',
            'ERROR',
            `Error al cambiar la clasificación del Bien ${this.good.id}`
          );
        },
      });
  }

  copiarPropiedades(objetoFuente: any, objetoDestino: any) {
    for (let propiedad in objetoFuente) {
      if (propiedad.startsWith('val')) {
        objetoDestino[propiedad] = objetoFuente[propiedad];
      }
    }
  }
}
