import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from '../../../../../common/repository/interfaces/list-params';
import { ExcelService } from '../../../../../common/services/excel.service';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { JSON_TO_CSV } from '../../../../admin/home/constants/json-to-csv';
import { UploadExpedientFormComponent } from '../../shared-component-gss/upload-expedient-form/upload-expedient-form.component';
import { UploadImagesFormComponent } from '../../shared-component-gss/upload-images-form/upload-images-form.component';
import { TurnModalComponent } from '../turn-modal/turn-modal.component';
import { LIST_ASSETS_COLUMN } from './columns/list-assets-columns';
import { LIST_ASSETS_COPIES_COLUMN } from './columns/list-assets-copies';
import { LIST_DEDUCTIVES_COLUMNS } from './columns/list-deductivas-column';
import { LIST_WAREHOUSE_COLUMN } from './columns/list-warehouse-columns';

var data = [
  {
    id: 1,
    deductDescription:
      'Recepcion documenta, electronica y validadion de requisitos (17%)',
    observation: 'Observacion',
    selected: true,
  },
];

@Component({
  selector: 'app-sampling-assets-form',
  templateUrl: './sampling-assets-form.component.html',
  styleUrls: ['./sampling-assets-form.component.scss'],
})
export class SamplingAssetsFormComponent extends BasePage implements OnInit {
  @ViewChild('table2', { static: false }) table2: any;
  dateForm: ModelForm<any>;
  searchForm: ModelForm<any>;
  showSearchForm: boolean = true;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  paragraphs: any = [];
  totalItems: number = 0;
  maxDate = new Date();
  jsonToCsv = JSON_TO_CSV;

  displaySearchAssetsBtn: boolean = false;
  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
    columns: LIST_ASSETS_COLUMN,
  };
  params2 = new BehaviorSubject<FilterParams>(new FilterParams());
  paragraphs2 = new LocalDataSource();
  totalItems2: number = 0;
  listAssetsSelected: any[] = [];

  settings3 = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
    columns: LIST_ASSETS_COPIES_COLUMN,
  };
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs3: any[] = [];
  totalItems3: number = 0;
  listAssetsCopiedSelected: any[] = [];

  settings4 = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: '',
  };
  columns4 = LIST_DEDUCTIVES_COLUMNS;
  paragraphsDeductivas: any[] = [{}];

  delegationId: string = '';
  storeSelected: any = {};

  selectTransferent = new DefaultSelect();

  //private domicilieService = inject(DomicileService);
  private domicilieService = inject(GoodDomiciliesService);
  private goodsqueryService = inject(GoodsQueryService);
  private authService = inject(AuthService);
  private goodService = inject(GoodService);
  private transferentService = inject(TransferenteService);
  private goodsinvService = inject(GoodsInvService);

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService
  ) {
    super();
  }

  ngOnInit(): void {
    this.delegationId = this.getRegionalDelegationId();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_WAREHOUSE_COLUMN,
    };

    this.initDateForm();
    this.initSearchForm();

    this.settings4.columns = LIST_DEDUCTIVES_COLUMNS;

    this.columns4.observation = {
      ...this.columns4.observation,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.deductivesObservations(data);
        });
      },
    };
    this.columns4.selected = {
      ...this.columns4.selected,
      onComponentInitFunction: this.deductiveSelected.bind(this),
    };

    this.getTransferent(new ListParams());
    this.paragraphsDeductivas = data;
  }

  get initialDate() {
    return this.dateForm.get('initialDate');
  }

  get finalDate() {
    return this.dateForm.get('finalDate');
  }

  initDateForm() {
    this.dateForm = this.fb.group({
      initialDate: [null, [Validators.required]],
      finalDate: [null, [Validators.required]],
      transferent: [null],
    });

    this.finalDate.disable();
    //this.paragraphs = data;
    //this.paragraphs2 = data2;
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      id: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      code: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      nameWarehouse: [null, [Validators.pattern(STRING_PATTERN)]],
      address: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  public enableFinalDate(event: any) {
    if (event != undefined) {
      if (this.finalDate.value == null) {
        this.finalDate.enable();
      } else {
        this.finalDate.setValue('');
      }
    }
  }

  selectWarehouse(event: any): any {
    this.displaySearchAssetsBtn = event.isSelected ? true : false;
    console.log(event);
    this.storeSelected = event;
  }

  goodSearch() {
    const dates = this.dateForm.value;
    if (!dates.initialDate && !dates.finalDate) {
      this.alert(
        'info',
        'Error muestreo',
        'Debe capturar los campos requeridos para el muestreo'
      );
      return;
    }

    this.addParametersFilter(dates);

    console.log(this.storeSelected);

    //this.params2.getValue().addFilter('requestId', event.data.requestId.id);
    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getGoods();
    });
  }

  addParametersFilter(dates: any) {
    this.params2 = new BehaviorSubject<FilterParams>(new FilterParams());
    const initDate = moment(dates.initialDate).format('DD/MM/YYYY');
    const endDate = moment(dates.finalDate).format('DD/MM/YYYY');

    this.params2.getValue().addFilter3('sortBy', `organizationCode:ASC`);

    this.params2.getValue().addFilter('organizationId', 191, SearchFilter.EQ);

    this.params2
      .getValue()
      .addFilter(
        'entTransferentId',
        this.dateForm.get('transferent').value,
        SearchFilter.EQ
      );

    this.params2
      .getValue()
      .addFilter('initialPeriod', `${initDate},${endDate}`, SearchFilter.BTW);

    this.params2
      .getValue()
      .addFilter('finalPeriod', `${initDate},${endDate}`, SearchFilter.BTW);
  }

  selectAssts(event: any) {
    this.listAssetsSelected = event.selected;
  }

  addAssets() {
    let ids: any = [];
    this.listAssetsSelected.map((item: any) => {
      const index = this.paragraphs3.indexOf(item);
      if (index == -1) {
        this.paragraphs3.push(item);
      } else {
        ids.push(item.goodId);
      }
      this.paragraphs3 = [...this.paragraphs3];
    });

    if (ids.length > 0) {
      const idsg = ids.join(',');
      this.alert(
        'info',
        `Los bienes con el No. de Gestion ${idsg}, ya se encuantran agregados`,
        ''
      );
      ids = [];
    }
    this.unselectGoodRows();
  }

  selectAsstsCopy(event: any) {
    this.listAssetsCopiedSelected = event.selected;
  }

  uploadExpedient() {
    if (this.listAssetsCopiedSelected.length == 0) {
      this.alert(
        'warning',
        'Se debe que tener seleccionado al menos un registro',
        ''
      );
      return;
    }
    this.openModals(
      UploadExpedientFormComponent,
      this.listAssetsCopiedSelected
    );
  }

  uploadImages(): void {
    if (this.listAssetsCopiedSelected.length == 0) {
      this.alert(
        'warning',
        'Se debe que tener seleccionado al menos un registro',
        ''
      );
      return;
    }
    this.openModals(UploadImagesFormComponent, this.listAssetsCopiedSelected);
  }

  exportCsv() {
    const title = 'Muestreo de Bienes para Supervisión';
    const filename: string = 'MuestreoBienesSupervision';
    this.jsonToCsv = this.generateJsonExcel();
    //console.log(this.jsonToCsv)
    //{type: 'csv'}
    this.excelService.export(this.jsonToCsv, { filename });
  }

  generateJsonExcel() {
    let good: any = {};
    let jsonBody: any = [{}];
    this.paragraphs3.map((item: any) => {
      (good.NomInventario = item.inventoryNumber),
        (good.NoGestion = item.goodId),
        (good.Descripcion = item.goodDescription),
        (good.DelegaRegional = item.regionalDelegation),
        (good.Cantidad = item.quantity),
        (good.ResultEvaluación = item.resultTest);

      jsonBody.push(good);
    });

    return jsonBody;
  }

  close(): void {}

  search() {
    this.loading = true;
    this.params.getValue().addFilter('regionalDelegation', this.delegationId);
    const searchform = this.searchForm.value;
    for (const key in searchform) {
      if (searchform[key] != null) {
        switch (key) {
          case 'id':
            this.params
              .getValue()
              .addFilter('stockSiabNumber', searchform[key]);
            break;
          case 'code':
            if (searchform[key] !== '') {
              this.params.getValue().addFilter('postalCode', searchform[key]);
            }
            break;
          case 'nameWarehouse':
            if (searchform[key] !== '') {
              this.params
                .getValue()
                .addFilter('name', searchform[key], SearchFilter.ILIKE);
            }
            break;
          case 'address':
            if (searchform[key] !== '') {
              this.params
                .getValue()
                .addFilter('address1', searchform[key], SearchFilter.ILIKE);
            }
            break;
          default:
            break;
        }
      }
    }

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      //this.getDomicilies();
      this.getCatAlmacenView();
    });
  }

  getRegionalDelegationId() {
    console.log('info token: ' + this.authService.decodeToken());
    const id = this.authService.decodeToken().department;
    return id;
  }

  /*getDomicilies() {
    const filter = this.params.getValue().getParams();
    this.paragraphs = [];
    this.domicilieService.getAll(filter).subscribe({
      next: resp => {
        resp.data.map((item: any) => {
          item['aliasWarehouseName'] = item.warehouseAlias.id;
          item['keyState'] = item.regionalDelegationId.keyState;
        });

        this.paragraphs = resp.data;
        this.totalItems = resp.count;
        this.params.getValue().removeAllFilters();
        this.loading = false;
      },
      error: error => {
        this.params.getValue().removeAllFilters();
        console.log('tabla domicilio ', error);
        this.onLoadToast('info', 'No se encontraron registros');
        this.loading = false;
      },
    });
  }*/

  getCatAlmacenView() {
    const filter = this.params.getValue().getParams();
    this.goodsqueryService.getCatStoresView(filter).subscribe({
      next: resp => {
        this.paragraphs = resp.data;
        this.totalItems = resp.count;
        this.params.getValue().removeAllFilters();
        this.loading = false;
      },
      error: error => {
        this.params.getValue().removeAllFilters();
        this.alert('warning', 'No se encontraron registros', '');
        this.loading = false;
      },
    });
  }

  getGoods() {
    const filter = this.params2.getValue().getParams();
    this.goodsinvService.getSamplingGoodView(filter).subscribe({
      next: resp => {
        console.log(resp.data);
        this.paragraphs2.load(resp.data);
        this.totalItems2 = resp.count;
      },
      error: error => {
        console.log(error);
        this.alert('warning', 'No se encontraron registros', '');
      },
    });
  }

  turnForm() {
    Swal.fire({
      title: 'Confirmación Turnado',
      text: '¿Está seguro que la información es correcta para turnar?',
      icon: undefined,
      width: 450,
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        console.log('Guardar solicitud');
        const size = this.paragraphs3.length;
        const evaResult = this.paragraphs3.filter(x => x.resultTest != null);
        debugger;
        if (size == 0) {
          this.alert('warning', 'No hay bienes agregados', '');

          return;
        }

        if (size != evaResult.length) {
          this.alert(
            'warning',
            'Todos los bienes deben contar con un Resultado de Evaluación',
            ''
          );
          return;
        }

        const cumple = this.paragraphs3.filter(x => x.resultTest == 'CUMPLE');
        const noCumple = this.paragraphs3.filter(
          x => x.resultTest == 'NO CUMPLE'
        );
        if (cumple.length == size) {
          const deductivesSize = this.paragraphsDeductivas.length;
          const deductivesSelected = this.paragraphsDeductivas.filter(
            x => x.selected == true
          );

          console.log('Todos los bienes CUMPLEN');

          if (deductivesSelected.length == 0) {
            //popBienesCumplen
            this.openModals(
              TurnModalComponent,
              '',
              'popBienesCumplen',
              'modal-lg'
            );
          } else {
            //confirmacionTurnado
            this.openModals(
              TurnModalComponent,
              '',
              'confirmacionTurnado',
              'modal-lg'
            );
          }
        } else {
          console.log('No todos los bienes CUMPLEN');
          const deductivesSelected = this.paragraphsDeductivas.filter(
            x => x.selected == true
          );

          if (deductivesSelected.length == 0) {
            this.alert('warning', 'Seleccione al menos una deductiva', '');
            return;
          } else {
            this.openModals(TurnModalComponent, '', 'popTurna', 'modal-lg');
          }
        }
      }
    });
  }

  openModals(
    component: any,
    good?: any,
    type?: string,
    modalSize: string = 'modalSizeXL'
  ): void {
    let config: ModalOptions = {
      initialState: {
        good: good,
        typeModal: type,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: `${modalSize} modal-dialog-centered`,
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }

  clean() {
    this.dateForm.reset();
    this.searchForm.reset();
    this.paragraphs = [];
  }

  removeGood() {
    if (this.listAssetsCopiedSelected.length == 0) {
      this.alert('warning', 'Seleccione al menos un bien', '');
      return;
    }
    this.listAssetsCopiedSelected.map(item => {
      const index = this.paragraphs3.indexOf(item);
      this.paragraphs3.splice(index, 1);
    });
    this.paragraphs3 = [...this.paragraphs3];
    this.listAssetsCopiedSelected = [];

    /**
     * todo: eliminar el bien de la tabla muestreo bien view
     */
  }

  meetGood(value: string) {
    if (this.listAssetsCopiedSelected.length == 0) {
      this.alert('warning', 'Debe tener seleccionado al menos un Bien', '');

      return;
    }

    this.listAssetsCopiedSelected.map(item => {
      const index = this.paragraphs3.indexOf(item);
      this.paragraphs3[index].resultTest = value;
    });
    this.paragraphs3 = [...this.paragraphs3];
    this.listAssetsCopiedSelected = [];
  }

  unselectGoodRows() {
    const a = this.table2.grid.getRows();
    a.map((item: any) => {
      item.isSelected = false;
    });
    /*const table = document.getElementById('table2');
    const tbody = table.children[0].children[1].children;

    for (let index = 0; index < tbody.length; index++) {
      const ele:any = tbody[index];
      
      console.log(ele.children[0].checked )
      ele.children[0].children[0].checked = false
    }*/
  }

  deductiveSelected(event: any) {
    event.toggle.subscribe((data: any) => {
      console.log(data);
    });
  }

  deductivesObservations(event: any) {
    console.log(event);
  }

  getTransferent(params: ListParams) {
    params['sortBy'] = 'nameTransferent:ASC';
    params['filter.status'] = `$eq:${1}`;
    params['filter.typeTransferent'] = `$eq:NO`;
    this.transferentService.getAll(params).subscribe({
      next: data => {
        this.selectTransferent = new DefaultSelect(data.data, data.count);
      },
    });
  }
}
