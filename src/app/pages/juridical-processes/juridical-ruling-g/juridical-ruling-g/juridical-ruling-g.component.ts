// FIXME: 2

/** BASE IMPORT */
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DEPOSITARY_ROUTES_2 } from 'src/app/common/constants/juridical-processes/depositary-routes-2';
import {
  baseMenu,
  baseMenuDepositaria,
} from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { IGoodsSubtype } from 'src/app/core/models/catalogs/goods-subtype.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DatePickerElementComponent } from 'src/app/shared/components/datepicker-element-smarttable/datepicker.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { TempGood } from './dataTemp';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-juridical-ruling-g',
  templateUrl: './juridical-ruling-g.component.html',
  styleUrls: ['./juridical-ruling-g.component.scss'],
})
export class JuridicalRulingGComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  selectedGooods: IGood[] = [];
  selectedGooodsValid: IGood[] = [];
  goods: IGood[] = TempGood;
  goodsValid: IGood[] = [];
  documents: IDocuments[] = [];
  selectedDocuments: IDocuments[] = [];
  statusDict: string = undefined;
  dictNumber: string | number = undefined;
  wheelNumber: string | number = undefined;
  delegationDictNumber: string | number = undefined;
  keyArmyNumber: string | number = undefined;

  idGoodSelected = 0;

  //tipos
  types = new DefaultSelect<Partial<IGoodType>>();
  subtypes = new DefaultSelect();
  ssubtypes = new DefaultSelect();
  sssubtypes = new DefaultSelect();

  typeField: string = 'type';
  subtypeField: string = 'subtype';
  ssubtypeField: string = 'ssubtype';
  sssubtypeField: string = 'sssubtype';

  goodTypeChange = new EventEmitter<IGoodType>();
  goodSubtypeChange = new EventEmitter<IGoodSubType>();
  goodSsubtypeChange = new EventEmitter<IGoodsSubtype>();
  goodSssubtypeChange = new EventEmitter<IGoodSssubtype>();

  data3 = [
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
  ];

  data4: IDocuments[] = [
    // { id: 'DEST', documento: 'PRIMER DOCUMENTO', fecha: '' },
    // { id: 'DEST', documento: 'SEGUNDO DOCUMENTO', fecha: '' },
  ];

  settings1 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      name: {
        title: '',
        sort: false,
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (isSelected: boolean, row: IGood) =>
          this.isGoodSelected(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onGoodSelect(instance),
      },
      id: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripcion',
        type: 'string',
      },
      quantity: {
        title: 'Cantidad',
        type: 'string',
      },
      identifier: {
        title: 'Ident.',
        type: 'string',
      },
      status: {
        title: 'Est',
        type: 'string',
      },
      processStatus: {
        title: 'Proceso',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings2 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      name: {
        title: '',
        sort: false,
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (isSelected: boolean, row: IGood) =>
          this.isGoodSelectedValid(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onGoodSelectValid(instance),
      },
      id: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripcion Dictaminada',
        type: 'string',
      },
      menaje: {
        title: 'Menaje',
        type: 'string',
      },
      quantity: {
        title: 'Cant. Dic..',
        type: 'string',
      },
      status: {
        title: 'Est',
        type: 'string',
      },
      processStatus: {
        title: 'Proceso',
        type: 'string',
      },
      idDestino: {
        title: 'ID Destino',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings3 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      id: {
        title: '#',
        type: 'number',
      },
      descriptionDocument: {
        title: 'Documentos',
        type: 'string',
      },
      fecha: {
        title: 'Fec. Recibido',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings4 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      // checked: {
      //   title: '',
      //   sort: false,
      //   type: 'custom',
      //   showAlways: true,
      //   valuePrepareFunction: (isSelected: boolean, row: IDocuments) =>
      //     this.isDocumentSelectedValid(row),
      //   renderComponent: CheckboxElementComponent,
      //   onComponentInitFunction: (instance: CheckboxElementComponent) =>
      //     this.onDocsSelectValid(instance),
      // },
      id: {
        title: '#',
        type: 'number',
      },
      descriptionDocument: {
        title: 'Documentos',
        type: 'string',
      },
      // fecha: {
      //   title: 'Fec. Recibido',
      //   type: 'string',
      // },
      fecha: {
        title: 'Fecha',
        sort: false,
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (bsValue: Date, row: IDocuments) =>
          this.isDocumentSelectedValid(row),
        renderComponent: DatePickerElementComponent,
        onComponentInitFunction: (instance: DatePickerElementComponent) =>
          this.onDocsSelectValid(instance),
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  expedientesForm: FormGroup;
  dictaminacionesForm: FormGroup;
  subtipoForm: FormGroup;
  gestionDestinoForm: FormGroup;
  public listadoDocumentos: boolean = false;
  public rutaAprobado: string =
    baseMenu + baseMenuDepositaria + DEPOSITARY_ROUTES_2[0].link;

  constructor(
    private fb: FormBuilder,
    private service: GoodTypeService,
    private goodSubtypesService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService,
    private readonly goodServices: GoodService,
    private readonly documentService: DocumentsService,
    private readonly authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
    this.onLoadGoodList();
    this.onLoadDocumentsByGood();
  }

  prepareForm() {
    this.expedientesForm = this.fb.group({
      tipoDictaminacion: [null, [Validators.required]],
      noExpediente: [null, [Validators.required]],
      averiguacionPrevia: [null, [Validators.pattern(STRING_PATTERN)]],
      causaPenal: [null, [Validators.pattern(STRING_PATTERN)]],
      delito: [false],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
    });

    this.dictaminacionesForm = this.fb.group({
      etiqueta: [null, [Validators.pattern(STRING_PATTERN)]],
      fechaResolucion: [null],
      fechaNotificacion: [null],
      fechaNotificacionAseg: [null],
      cveOficio: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      estatus: [null],
    });
    this.subtipoForm = this.fb.group({
      tipoDictaminacion: [null],
      type: [null, [Validators.required]],
      subtype: [null, [Validators.required]],
      ssubtype: [null, [Validators.required]],
      sssubtype: [null, [Validators.required]],
      attrib: [
        { value: null, disabled: true },
        Validators.pattern(NUMBERS_PATTERN),
      ],
    });
    this.gestionDestinoForm = this.fb.group({
      estatus: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }
  btnDocumentos() {
    console.log('btnDocumentos');
    this.listadoDocumentos = true;
  }
  btnAprobar() {
    console.log('btnAprobar');
  }
  btnRechazar() {
    console.log('btnRechazar');
  }
  btnBorrarDictamen() {
    this.btnDeleteDictation();
  }
  btnImprimeOficio() {
    console.log('btnImprimeOficio');
  }
  btnParcializar() {
    this.btnVerify();
  }
  btnOficioSubstanciacion() {
    console.log('btnOficioSubstanciacion');
  }
  btnOficioRelacionado() {
    console.log('btnOficioRelacionado');
  }

  btnSalir() {
    console.log('Salir');
    this.listadoDocumentos = false;
    // --
    // Sube documentos seleccionados
    if (this.selectedDocuments.length > 0) {
      this.documents = this.documents.concat(this.selectedDocuments);
      this.selectedDocuments.forEach(doc => {
        this.goods = this.goods.filter(_doc => _doc.id != doc.id);
      });
    }
  }
  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }

  isGoodSelected(_good: IGood) {
    const exists = this.selectedGooods.find(good => good.id == _good.id);
    return !exists ? false : true;
  }

  goodSelectedChange(good: IGood, selected: boolean) {
    if (selected) {
      this.selectedGooods.push(good);
    } else {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id != good.id
      );
    }
  }
  onGoodSelectValid(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChangeValid(data.row, data.toggle),
    });
  }

  isGoodSelectedValid(_good: IGood) {
    const exists = this.selectedGooodsValid.find(good => good.id == _good.id);
    return !exists ? false : true;
  }

  goodSelectedChangeValid(good: IGood, selected?: boolean) {
    if (selected) {
      this.selectedGooodsValid.push(good);
    } else {
      this.selectedGooodsValid = this.selectedGooodsValid.filter(
        _good => _good.id != good.id
      );
    }
  }

  /**
   * Selected document methods
   */
  // onDocsSelectValid(instance: CheckboxElementComponent) {
  //   instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
  //     next: data => this.documentSelectedChangeValid(data.row, data.toggle),
  //   });
  // }
  onDocsSelectValid(instance: DatePickerElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: (data: any) =>
        this.documentSelectedChangeValid(data.row, data.toggle),
    });
  }
  isDocumentSelectedValid(_doc: any) {
    const exists = this.selectedDocuments.find(doc => doc.id == _doc.id);
    return !exists ? false : true;
  }
  documentSelectedChangeValid(doc: any, selected?: string) {
    console.log('fecha ', selected);
    if (selected) {
      this.selectedDocuments.push(doc);
    } else {
      this.selectedDocuments = this.selectedDocuments.filter(
        _doc => _doc.id != doc.id
      );
    }
  }

  addAll() {
    if (this.goods.length > 0) {
      this.goodsValid = this.goodsValid.concat(this.goods);
      this.goods = [];
    }
  }
  addSelect() {
    if (this.selectedGooods.length > 0) {
      this.goodsValid = this.goodsValid.concat(this.selectedGooods);
      this.selectedGooods.forEach(good => {
        this.goods = this.goods.filter(_good => _good.id != good.id);
      });
      this.selectedGooods = [];
    }
  }
  removeSelect() {
    if (this.selectedGooodsValid.length > 0) {
      this.goods = this.goods.concat(this.selectedGooodsValid);
      this.selectedGooodsValid.forEach(good => {
        this.goodsValid = this.goodsValid.filter(_good => _good.id != good.id);
      });
      this.selectedGooodsValid = [];
    }
  }
  removeAll() {
    if (this.goodsValid.length > 0) {
      this.goods = this.goods.concat(this.goodsValid);
      this.goodsValid = [];
    }
  }

  onSelectedRow(event: any) {
    let obj: IGood = this.goods.find(element => element.id === event.data.id);
    let index: number = this.goods.findIndex(elm => elm === obj);
    console.log(index);
  }

  get type() {
    return this.subtipoForm.get(this.typeField);
  }
  get subtype() {
    return this.subtipoForm.get(this.subtypeField);
  }
  get ssubtype() {
    return this.subtipoForm.get(this.ssubtypeField);
  }
  get sssubtype() {
    return this.subtipoForm.get(this.sssubtypeField);
  }

  onTypesChange(type: any) {
    this.resetFields([this.subtype, this.ssubtype, this.sssubtype]);
    this.subtypes = new DefaultSelect();
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
    this.subtipoForm.updateValueAndValidity();
    this.goodTypeChange.emit(type);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field.setValue(null);
    });
    this.subtipoForm.updateValueAndValidity();
  }

  //Métodos para autocompletar los tipos
  getTypes(params: ListParams) {
    this.service.getAll(params).subscribe(
      res => {
        this.types = new DefaultSelect(res.data, res.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      }
    );
    /* this.service.search(params).subscribe(
      data => {
        this.types = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          //error = err.message;
        }

        //this.onLoadToast('error', 'Error', error);
      },
      () => {}
    ); */
  }

  getSubtypes(params: ListParams) {
    this.goodSubtypesService
      .getAll({ type: this.type.value, ...params })
      .subscribe(data => {
        console.log(data);
        this.subtypes = new DefaultSelect(data.data, data.count);
      });
  }

  onSubtypesChange(subtype: any) {
    if (!this.type.value) {
      this.types = new DefaultSelect([subtype.idTypeGood], 1);
      this.type.setValue(subtype.idTypeGood.id);
    }
    this.resetFields([this.ssubtype, this.sssubtype]);
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
    this.goodSubtypeChange.emit(subtype);
  }

  getSsubtypes(params: ListParams) {
    this.goodSsubtypeService
      .getAll({
        type: this.type.value,
        subtype: this.subtype.value,
        ...params,
      })
      .subscribe(data => {
        this.ssubtypes = new DefaultSelect(data.data, data.count);
      });
  }

  onSsubtypesChange(ssubtype: any) {
    if (!this.type.value || !this.subtype.value) {
      this.types = new DefaultSelect([ssubtype.noType], 1);
      this.subtypes = new DefaultSelect([ssubtype.noSubType], 1);
      this.type.setValue(ssubtype.noType.id);
      this.subtype.setValue(ssubtype.noSubType.id);
    }
    this.resetFields([this.sssubtype]);
    this.goodSsubtypeChange.emit(ssubtype);
  }
  goodSssubType: IGoodSssubtype;
  onValuesChange(goodSssubtypeChange: IGoodSssubtype): void {
    console.log(goodSssubtypeChange);
    this.goodSssubType = goodSssubtypeChange;
    this.subtipoForm.controls['attrib'].setValue(
      goodSssubtypeChange.numClasifGoods
    );
    this.subtipoForm.controls['id'].setValue(goodSssubtypeChange.id);
    this.sssubtypes = new DefaultSelect();
  }
  getSssubtypes(params: ListParams) {
    this.goodSssubtypeService
      .getAll({
        type: this.type.value,
        subtype: this.subtype.value,
        ssubtype: this.ssubtype.value,
        ...params,
      })
      .subscribe(data => {
        this.sssubtypes = new DefaultSelect(data.data, data.count);
      });
  }
  onSssubtypesChange(sssubtype: any) {
    if (!this.type.value || !this.subtype.value || !this.ssubtype.value) {
      console.log(sssubtype);
      this.types = new DefaultSelect([sssubtype.numType], 1);
      this.subtypes = new DefaultSelect([sssubtype.numSubType], 1);
      this.ssubtypes = new DefaultSelect([sssubtype.numSsubType], 1);
      this.type.setValue(sssubtype.numType.id);
      this.subtype.setValue(sssubtype.numSubType.id);
      this.ssubtype.setValue(sssubtype.numSsubType.id);
    }

    this.goodSssubtypeChange.emit(sssubtype);
  }

  /**
   * Listado de bienes según No. de expediente
   */
  onLoadGoodList() {
    this.goodServices
      .getByExpedient(
        this.expedientesForm.get('noExpediente').value,
        this.params.getValue()
      )
      .subscribe({
        next: response => {
          this.goods = response.data;
        },
        error: err => {
          console.log(err);
          this.goods = [];
        },
      });
  }

  rowSelected(e: any) {
    if (e) {
      this.idGoodSelected = e.data?.id;
      this.onLoadDocumentsByGood();
    }
  }

  onLoadDocumentsByGood() {
    this.documentService.getByGood(this.idGoodSelected).subscribe({
      next: response => {
        this.data4 = response.data;
      },
      error: err => {
        console.log(err);
        this.goods = [];
      },
    });
  }

  btnVerify() {
    const status = this.statusDict;
    const expedient = this.expedientesForm.get('noExpediente').value;
    if (status === 'DICTAMINADO') {
      this.alert('info', 'AVISO', 'Bien ya dictaminado');
    } else {
      if (expedient === null || undefined) {
        this.alert('error', 'ERROR', 'Falta seleccionar expediente');
      } else {
        // this.alert('warning', 'PENDIENTE', 'Parcializa la dictaminazión.');}
        Swal.fire('PENDIENTE', 'Parcializa la dictaminazión.', 'warning').then(
          () => {
            window.location.replace(
              '/pages/general-processes/goods-partialization'
            );
          }
        );
      }
    }
  }

  btnDeleteDictation() {
    let token = this.authService.decodeToken();

    const object = {
      proceedingsNumber: this.expedientesForm.get('noExpediente').value,
      typeDicta: this.expedientesForm.get('tipoDictaminacion').value,
      numberOfDicta: this.dictNumber,
      wheelNumber: this.wheelNumber,
      user: token.preferred_username,
      delegationNumberDictam: this.delegationDictNumber,
      clueJobNavy: this.keyArmyNumber, // -- keyArmyNumber
      judgmentDate: this.dictaminacionesForm.get('fechaNotificacion').value, // -- entryDate
      statusJudgment: this.statusDict, // -- statusDict
      typeJudgment: this.expedientesForm.get('tipoDictaminacion').value, // -- typeDict
    };

    this.checkout1(object)
      .then(({ json }) => {
        json.then(res => {
          if (res.statusCode === 200) {
            if (res.vBan === 'S' && res.vDelete === 'S') {
              // Pendiente
              // --
            } else {
              let object2 = {
                vProceedingsNumber: res.data.vProceedingsNumber,
                vTypeDicta: res.data.vTypeDicta,
                vOfDictaNumber: res.data.vOfDictaNumber,
                vWheelNumber: res.data.vWheelNumber,
              };
              this.checkout2(object2).then(({ json }) => {
                json.then(res => {
                  if (res.statusCode !== 200) {
                    this.alert('warning', 'AVISO', res.message[0]);
                  } else {
                    console.log('TODO SALE BIEN', res.data);
                  }
                });
              });
            }
          } else if (res.statusCode === 400) {
            this.alert('warning', 'AVISO', res.message[0]);
          }
        });
      })
      .catch(err => {});
  }

  async checkout1(object: object) {
    let response = await fetch(
      'http://sigebimsdev.indep.gob.mx/dictation/api/v1/application/factjurdictamasDeleteDisctp1',
      {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(object),
      }
    );
    return { status: response.status, json: response.json() };
  }

  async checkout2(object: object) {
    let response = await fetch(
      'http://sigebimsdev.indep.gob.mx/dictation/api/v1/application/factjurdictamasDeleteDisctp2',
      {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(object),
      }
    );
    return { status: response.status, json: response.json() };
  }

  async checkout3(object: object) {
    let response = await fetch(
      'http://sigebimsdev.indep.gob.mx/dictation/api/v1/application/factjurdictamasDeleteDisctp3',
      {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(object),
      }
    );
    return { status: response.status, json: response.json() };
  }
}
