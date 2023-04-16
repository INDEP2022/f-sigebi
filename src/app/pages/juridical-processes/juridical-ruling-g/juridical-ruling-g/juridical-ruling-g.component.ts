/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DEPOSITARY_ROUTES_2 } from 'src/app/common/constants/juridical-processes/depositary-routes-2';
import {
  baseMenu,
  baseMenuDepositaria,
} from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DatePickerComponent } from 'src/app/shared/render-components/date-picker/date-picker.component';
import { IJuridicalRulingParams } from '../../file-data-update/interfaces/file-data-update-parameters';
import { FileUpdateCommunicationService } from '../../file-data-update/services/file-update-communication.service';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
interface Variables {
  paso: string;
  dictamen: string;
  del_destino: string;
  lb_tipos_divtaminacion: string;
  tipo_dicta: string;
  tipo_vol: string;
  clasif2: string;
  oficio: string;
  tipos2: string;
  clasif: string;
  etiqueta: string;
  dato: string;
  consultas: string;
  estatus_tramite: string;
  desc_status_tramite: string;
}

@Component({
  selector: 'app-juridical-ruling-g',
  templateUrl: './juridical-ruling-g.component.html',
  styleUrls: ['./juridical-ruling-g.component.scss'],
})
export class JuridicalRulingGComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  selectedGooods: IGood[] = [];
  selectedGooodsValid: IGood[] = [];
  goods: IGood[] = [];
  goodsFilter: IGood[] = [];
  goodsValid: IGood[] = [];
  documents: IDocuments[] = [];
  variable: Variables;
  userAccesoXArea: ISegUsers;
  objComponent: Object = null;
  data3 = [
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
  ];

  data4 = [
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
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
      name: {
        title: 'Check',
        sort: false,
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (isSelected: boolean, row: IGood) =>
          this.isGoodSelected(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onGoodSelect(instance),
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
      proceso: {
        title: 'Proceso',
        type: 'string',
      },
      idDestino: {
        title: 'ID Destino',
        type: 'string',
      },
      name: {
        title: 'Check',
        sort: false,
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (isSelected: boolean, row: IGood) =>
          this.isGoodSelectedValid(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onGoodSelectValid(instance),
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
      documento: {
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
      id: {
        title: '#',
        type: 'number',
      },
      documento: {
        title: 'Documentos',
        type: 'string',
      },
      dateRenderDecoDev: {
        title: 'Fecha Recibido',
        editor: {
          type: 'custom',
          component: DatePickerComponent,
        },
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  /*   {
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
      documento: {
        title: 'Documentos',
        type: 'string',
      },
      dateRenderDecoDev: {
        title: 'Fecha Recibido',
        editor: {
          type: 'custom',
          component: DatePickerComponent,
        },
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  }; */
  expedientesForm: FormGroup;
  dictaminacionesForm: FormGroup;
  subtipoForm: FormGroup;
  gestionDestinoForm: FormGroup;
  public listadoDocumentos: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  public rutaAprobado: string =
    baseMenu + baseMenuDepositaria + DEPOSITARY_ROUTES_2[0].link;

  juridicalRulingParams: IJuridicalRulingParams;
  origin: boolean = true;
  aprobar: boolean = true;
  constructor(
    private fb: FormBuilder,
    private readonly goodServices: GoodService,
    private readonly fileUpdateComunicationsServices: FileUpdateCommunicationService,
    private readonly accesoXAreaServices: UsersService,
    private departmentService: DepartamentService,
    private readonly dictationServices: DictationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: false,
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      mode: '',
      columns: {
        id: {
          title: '#',
          type: 'number',
        },
        documento: {
          title: 'Documentos',
          type: 'string',
        },
        dateRenderDecoDev: {
          title: 'Fecha Recibido',
          editor: {
            type: 'custom',
            component: DatePickerComponent,
          },
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
    const params = {
      expediente: 14,
      volante: 1558180,
      tipoVo: 'P',
      tipoDic: 'PROCEDENCIA',
      consulta: 'N',
      pGestOk: 1,
      pNoTramite: 1044141,
    };
    this.juridicalRulingParams = params;
    /*  this.fileUpdateComunicationsServices.juridicalRulingParams; */
    this.expedientesForm
      .get('noExpediente')
      .setValue(this.juridicalRulingParams.expediente);
    this.expedientesForm
      .get('tipoDictaminacion')
      .setValue(this.juridicalRulingParams.tipoDic);
    this.listGood(this.juridicalRulingParams.expediente);
    this.dictaminacionesForm
      .get('volante')
      .setValue(this.juridicalRulingParams.volante);
    this.dictaminacionesForm.get('fechaDictamen').setValue(new Date());
    this.objComponent = {
      screen: 'FACTJURDICTAMASG',
      typeDictation: this.juridicalRulingParams.tipoDic,
      expedientNumber: this.juridicalRulingParams.expediente,
    };
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
      volante: [null, [Validators.pattern(STRING_PATTERN)]],
      fechaResolucion: [null],
      fechaNotificacion: [null],
      fechaNotificacionAseg: [null],
      fechaDictamen: [null],
      fechaPPFF: [null],
      cveOficio: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      estatus: [null],
      issuingUser: [null],
    });
    this.subtipoForm = this.fb.group({
      tipoDictaminacion: [null],
      ClassificationTypeSsubtypeOfGoods: [null],
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
    const ETAPA: Date = new Date();
    const lst_id: string = `E: ${this.juridicalRulingParams.expediente} N: ${this.juridicalRulingParams.volante}`;
    let departament: IDepartment = null;
    if (this.juridicalRulingParams.pGestOk === 1) {
      if (this.gestionDestinoForm.get('estatus').value === '') {
        this.onLoadToast(
          'error',
          'ERROR',
          'No se ha definido el área de gestión.'
        );
      }
    }
    if (this.expedientesForm.get('tipoDictaminacion').value === '') {
      this.onLoadToast('error', 'ERROR', 'No se definió el tipo_dicta.');
    }
    if (this.dictaminacionesForm.get('etiqueta').value !== '') {
      let params = new FilterParams();
      params.addFilter(
        'id',
        this.dictaminacionesForm.get('issuingUser').value,
        SearchFilter.EQ
      );
      params.addFilter('assigned', 'S', SearchFilter.EQ);
      this.accesoXAreaServices.getAllSegUsers(params.getParams()).subscribe({
        next: response => {
          this.userAccesoXArea = response.data[0];
          departament = this.getDepartment(
            this.userAccesoXArea.usuario.delegation1Number,
            this.userAccesoXArea.usuario.subdelegationNumber
          );
          console.log('Aqui esta el departamento', departament);
          if (departament !== null) {
            if (departament.level === 4) {
              /* craeteKeyOffice(); */
            }
          }
        },
        error: err => {
          this.onLoadToast(
            'error',
            'ERROR',
            'No se localizaron datos de la persona que autoriza.'
          );
        },
      });
    } else {
      this.onLoadToast('error', 'ERROR', 'FECHA INSTRUCTORA NULA');
    }

    /////////////Armar clave oficio
    /* craeteKeyOffice(); */
  }
  getDepartment(
    delegation: string | number,
    subdelagation: string | number,
    departament?: string | number,
    phaseEdo?: string | number
  ): IDepartment {
    let depart: IDepartment = null;
    this.departmentService
      .getByDelegationsSubdelegation(delegation, subdelagation)
      .subscribe({
        next: response => {
          depart = response.data[0];
        },
        error: err => {
          this.onLoadToast(
            'error',
            'ERROR',
            'No se localizó la dependencia de la persona que autoriza.'
          );
          depart = null;
        },
      });
    return depart;
  }
  craeteKeyOffice(
    vniveld2: string | number,
    vniveld3: string | number,
    vniveld4: string | number,
    v_tip_dicta: string
  ) {
    if (v_tip_dicta === 'RES') {
      const keyOfi = `${vniveld2}/${vniveld3}/${vniveld4}/${v_tip_dicta}`;
      this.dictaminacionesForm.get('cveOficio').setValue(keyOfi);
    } else {
      const keyOfi = `${vniveld2}/${vniveld3}/${vniveld4}`;
      this.dictaminacionesForm.get('cveOficio').setValue(keyOfi);
    }
  }
  btnRechazar() {
    console.log('btnRechazar');
  }
  btnBorrarDictamen() {
    console.log('btnBorrarDictamen');
  }
  btnImprimeOficio() {
    console.log('btnImprimeOficio');
  }
  btnParcializar() {
    console.log('btnParcializar');
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
    this.aprobar = false;
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

  listGood(numberFile: number | string) {
    this.goodServices
      .getByExpedient(numberFile, this.params.getValue())
      .subscribe({
        next: response => {
          console.log(response);
          this.goods = response.data;
          this.goodsFilter = this.goods;
          //this.validGoods(response.data);
        },
        error: err => {
          console.log(err);
          this.onLoadToast('error', 'ERROR', err.error.message);
        },
      });
  }

  validGoods(goods: IGood[]) {
    goods.forEach(good => {
      let model = {
        screen: 'FACTJURDICTAMASG',
        good: good.id,
        clasifGood: good.goodClassNumber,
        label: good.labelNumber,
        status: good.status,
        typeDictum: good.opinionType,
        typeDictum2: good.opinion,
        identificador: good.identifier,
        processDom: good.extDomProcess,
        type: good.type,
        subtype: good.subTypeId,
        val5: good.val5,
        expedient: good.fileNumber,
        val1: good.val1,
        val2: good.val2,
        val4: good.val4,
        val6: good.val6,
      };
      this.dictationServices.postValidationGoodAvailable(model).subscribe({
        next: response => {
          console.log(response);
          this.goods.push(good);
        },
        error: err => {
          console.log(err);
          this.onLoadToast('error', 'ERROR', err.error.message);
        },
      });
    });
  }

  getTypesGoods() {}
  onSaveConfirm(event: any) {
    console.log(event);
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Actualizado', '');
  }
  filterGood(event: string) {
    console.log('Entro', event);
    if (event === '0') {
      if (this.goodsValid.length === 0) {
        let newArray: IGood[] = [];
        this.goodsFilter.forEach(elemt => {
          if (!this.goodsValid.includes(elemt)) {
            newArray.push(elemt);
          }
        });
        this.goods = newArray;
      }
      console.log('No entro a Valid length');
      this.goods = this.goodsFilter;
    } else {
      this.goods = this.goodsFilter.filter(
        good => good.goodClassNumber === event
      );
    }
  }
}
