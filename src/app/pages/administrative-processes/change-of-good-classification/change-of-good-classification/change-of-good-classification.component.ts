import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { ILabelOKey } from 'src/app/core/models/catalogs/label-okey.model';
import { IStatusCode } from 'src/app/core/models/catalogs/status-code.model';
import { IUnitXClassif } from 'src/app/core/models/ms-classifygood/ms-classifygood.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { LabelGoodService } from 'src/app/core/services/catalogs/label-good.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ClassifyGoodService } from 'src/app/core/services/ms-classifygood/ms-classifygood.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { getClassColour } from 'src/app/pages/general-processes/goods-characteristics/goods-characteristics/good-table-vals/good-table-vals.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  usuarVal: string;
  form: FormGroup;
  status = new DefaultSelect<IStatusCode>();
  goodChange = 0;
  goodChange2 = 0;
  statusSelect: IStatusCode;
  units: IUnitXClassif[] = [];
  noEtiqs: string[] = [];
  endProcess: boolean = false;
  destinations: ILabelOKey[] = [];
  listAtributAct: any[] = [];
  listAtributNew: IAttribClassifGoods[] = [];
  btnNewAtribut: boolean = true;
  atributActSettings: any;
  atributNewSettings: any;
  service = inject(ChangeOfGoodCharacteristicService);
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
    private readonly goodServices: GoodService,
    private readonly classifyGoodServices: ClassifyGoodService,
    private readonly labeGoodServices: LabelGoodService,
    private readonly goodsQueryServices: GoodsQueryService,
    private readonly dynamicCatalogsService: DynamicCatalogsService,
    private readonly goodSssubtypeService: GoodSssubtypeService,
    private statusScreenService: StatusXScreenService
  ) {
    super();
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
      edit: {
        editButtonContent: '<span class="fa fa-eye text-success mx-2"></span>',
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

  ngOnInit(): void {
    this.buildForm();
    this.buildFormNew();
    this.numberGood.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(x => {
        console.log(x);
        if (x) {
          this.loadGood();
        }
      });
    this.classificationOfGoods.valueChanges.subscribe({
      next: response => {
        console.log(response);
        if (response) {
          setTimeout(() => {
            this.goodChange2++;
          }, 100);
        }
      },
    });
    this.form.disable();
    this.formNew.disable();
    this.numberGood.enable();
  }

  clear() {
    this.form.reset();
    this.formNew.reset();
    // this.dataAct.reset();
    this.listAtributNew = [];
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
      fileNumberNew: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  async loadGood() {
    this.loading = true;
    this.listAtributAct = [];
    // this.refreshTableAct(this.listAtributAct);
    const filterParams = new FilterParams();
    filterParams.addFilter('id', this.numberGood.value);
    const response = await firstValueFrom(
      this.goodServices
        .getAll(filterParams.getParams())
        .pipe(catchError(x => of({ data: [] })))
    );
    if (response.data && response.data.length > 0) {
      this.good = response.data[0];
      const status = await firstValueFrom(this.getStatusXPantalla());
      console.log(this.usuarVal, this.usuarVal.substring(0, 3));
      if (status.length === 0 && this.usuarVal.substring(0, 3) === 'TLP') {
        this.alertInfo(
          'error',
          'Cambio de Clasificador',
          'Solo se podrá realizar el cambio de clasificador, de bienes en estatus ROP, STA y VXR'
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
              'No se puedo cargar la descripción del clasificador'
            );
          }
          this.loading = false;
        },
        error: err => {
          this.alert(
            'error',
            'Error',
            'No se puedo cargar la descripción del clasificador'
          );
          this.loading = false;
        },
      });
  }

  setGood(good: IGood, clasif: IGoodSssubtype) {
    this.descriptionGood.setValue(good.description);
    this.currentClasification.setValue(good.goodClassNumber);
    this.descriptionClasification.setValue(clasif.description);
    this.numberFile.setValue(good.fileNumber);
    this.fileNumberNew.setValue(good.fileNumber);
    // this.onLoadToast(
    //   'success',
    //   'Éxitoso',
    //   `Se ha cargado correctamente la información del bien No ${good.id}`
    // );
    console.log(this.currentClasification.value);
    setTimeout(() => {
      this.goodChange++;
    }, 100);
  }

  accept() {
    //5457740
  }

  onChange(event: any) {
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
            'Error al cargar los numeros de etiquetas para el destino'
          );
        },
      });
  }

  getDestination() {
    let params = new FilterParams();
    params.addFilter('id', `${this.noEtiqs}`, SearchFilter.IN);
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
        'INformación',
        'Debe seleccionar un No de clasificación de Bien'
      );
      return;
    }
  }

  onSaveConfirm(event: any) {
    event.confirm.resolve();
  }

  showAlert() {
    this.alertQuestion(
      'warning',
      'Actualizar',
      '¿Desea actualizar el clasificador del bien?'
    ).then(question => {
      if (question.isConfirmed) {
        this.addAtribut();
      }
    });
  }

  addAtribut() {
    const newLis: any = this.listAtributNew;
    const good: any = this.good;
    newLis.forEach((atrib: any) => {
      if (atrib.newVal !== undefined) {
        good[`val${atrib.columnNumber}`] = atrib.newVal;
      }
    });
    const putGood: any = {
      id: Number(good.id),
      goodId: Number(good.goodId),
      goodClassNumber: this.classificationOfGoods.value,
      fileeNumber: this.fileNumberNew.value,
      unitMeasure: this.unitXClassif.value,
      destiny: this.destination.value,
    };
    this.copiarPropiedades(good, putGood);
    console.log(this.data);
    let contador = 0;
    this.data.forEach(row => {
      if (row.required && !row.value) {
        this.onLoadToast(
          'error',
          'Bien ' + this.numberGood.value,
          'Complete los atributos requeridos'
        );
        return;
        // contador++;
      }
      putGood[row.column] = row.value;
    });
    console.log(putGood, 'Atributos sin llenar:' + contador);
    this.goodServices
      .update(putGood)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.onLoadToast(
            'success',
            'ÉXITO',
            `Se ha actualizado la clasificacion del bien ${this.good.id}`
          );
          this.listAtributNew = [];
          // this.dataAct.load([]);
          // this.dataAct.refresh();
          this.form.reset();
          this.formNew.reset();
        },
        error: err => {
          this.onLoadToast(
            'error',
            'ERROR',
            `Error al cambiar la clasificacion del bien ${this.good.id}`
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
