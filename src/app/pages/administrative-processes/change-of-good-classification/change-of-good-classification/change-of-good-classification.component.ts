import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
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
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ATRIBUT_ACT_COLUMNS, ATRIBUT_NEW_COLUMNS } from './columns';

@Component({
  selector: 'app-change-of-good-classification',
  templateUrl: './change-of-good-classification.component.html',
  styles: [],
})
export class ChangeOfGoodClassificationComponent
  extends BasePage
  implements OnInit
{
  //Reactive Forms
  form: FormGroup;
  good: IGood;
  status = new DefaultSelect<IStatusCode>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  statusSelect: IStatusCode;
  units: IUnitXClassif[] = [];
  noEtiqs: string[] = [];
  endProcess: boolean = false;
  destinations: ILabelOKey[] = [];
  listAtributAct: any[] = [];
  listAtributNew: IAttribClassifGoods[] = [];
  btnNewAtribut: boolean = true;
  atributActSettings = { ...this.settings };
  atributNewSettings = { ...this.settings };
  dataAct: LocalDataSource = new LocalDataSource();
  dataNew: LocalDataSource = new LocalDataSource();
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

  constructor(
    private fb: FormBuilder,
    private readonly goodServices: GoodService,
    private readonly classifyGoodServices: ClassifyGoodService,
    private readonly labeGoodServices: LabelGoodService,
    private readonly goodsQueryServices: GoodsQueryService,
    private readonly dynamicCatalogsService: DynamicCatalogsService,
    private readonly goodSssubtypeService: GoodSssubtypeService
  ) {
    super();
    this.atributActSettings = {
      ...this.settings,
      mode: 'inline',
      columns: { ...ATRIBUT_ACT_COLUMNS },
    };
    this.atributActSettings.actions = false;

    this.atributNewSettings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
        width: '10%',
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      mode: 'inline',
      columns: { ...ATRIBUT_NEW_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.buildForm();
    this.buildFormNew();
    this.form.disable();
    this.formNew.disable();
    this.numberGood.enable();
  }

  //disbaledInpust;

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

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

  loadGood() {
    this.loading = true;
    this.goodServices.getById(this.numberGood.value).subscribe({
      next: response => {
        console.log(response);
        this.good = response;
        this.loadClassifDescription(this.good.goodClassNumber);
        this.loading = false;
        this.classificationOfGoods.enable();
        this.getAtributos(this.good.goodClassNumber);
      },
    });
  }

  loadClassifDescription(numberClassif: string | number) {
    this.goodSssubtypeService.getClasification(numberClassif).subscribe({
      next: response => {
        console.log(response);
        this.setGood(this.good, response.data[0]);
      },
      error: err => {
        this.onLoadToast(
          'error',
          'ERROR',
          'Error al cargar la descripción del clasificador'
        );
      },
    });
  }

  setGood(good: IGood, clasif: IGoodSssubtype) {
    this.descriptionGood.setValue(good.description);
    this.currentClasification.setValue(good.goodClassNumber);
    this.descriptionClasification.setValue(clasif.description);
    this.numberFile.setValue(good.fileNumber);
    this.fileNumberNew.setValue(good.fileNumber);
    this.onLoadToast(
      'success',
      'Éxitoso',
      `Se ha cargado correctamente la información del bien No ${good.id}`
    );
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
    this.classifyGoodServices.getUnitiXClasif(params.getParams()).subscribe({
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
    this.classifyGoodServices.getEtiqXClasif(params.getParams()).subscribe({
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
    this.labeGoodServices.getEtiqXClasif(params.getParams()).subscribe({
      next: response => {
        this.destinations = response.data;
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', 'Error al cargar el destino');
      },
    });
  }
  getAtributos(numberClass: string | number, newAtribut: boolean = false) {
    let params = new FilterParams();
    params.addFilter('classifGoodNumber', numberClass, SearchFilter.EQ);

    this.goodsQueryServices.getAtribuXClasif(params.getParams()).subscribe({
      next: response => {
        if (newAtribut) {
          this.listAtributNew = response.data;
          this.getOtkeyOtvalue();
        } else {
          this.formateObjTabla(response.data);
        }
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', 'Error al cargar los atributos');
      },
    });
  }
  newAtribut() {
    this.getAtributos(this.classificationOfGoods.value, true);
  }
  formateObjTabla(array: any[]) {
    const good: any = this.good;
    array.forEach(list => {
      this.listAtributAct.push({
        attribute: list.attribute,
        val: good[`val${list.columnNumber}`],
      });
    });
    this.refreshTableAct(this.listAtributAct);
  }

  refreshTableAct(array: any[]) {
    this.dataAct.load(array);
    this.dataAct.refresh();
  }
  refreshTableNew() {
    this.dataNew.load(this.listAtributNew);
    this.dataNew.refresh();
  }
  onSaveConfirm(event: any) {
    console.log(event['newData']);

    event.confirm.resolve();
  }
  getOtkeyOtvalue() {
    this.listAtributNew.forEach((atrib, index) => {
      if (atrib.tableCd !== null) {
        const filter = {
          table: atrib.tableCd,
          classificationGoodNumber: this.classificationOfGoods.value,
        };
        this.dynamicCatalogsService.getOtkeyOtvalue(filter).subscribe({
          next: response => {
            console.log(response.data);
            console.log(index);
          },
          error: err => {
            this.onLoadToast('error', 'ERROR', 'Error al cargar los atributos');
          },
        });
      }
    });
  }
  onChangeValid(event: IAttribClassifGoods) {
    if (event.tableCd !== null) {
      console.log('Abriendo popup');
    } else {
      console.log(event);
      this.atributNewSettings.mode = 'inline';
    }
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
    this.good = good;
    this.good.goodClassNumber = this.classificationOfGoods.value;
    this.good.fileNumber = this.fileNumberNew.value;
    this.good.unitMeasure = this.unitXClassif.value;
    this.good.destiny = this.destination.value;
    this.goodServices.update(this.good).subscribe({
      next: response => {
        console.log(response.data);
        this.onLoadToast(
          'success',
          'ÉXITO',
          `Se ha actualizado el clasificacion del bien ${this.good.id}`
        );
        this.form.reset();
        this.formNew.reset();
        this.refreshTableAct([]);
        this.listAtributNew = [];
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
}
