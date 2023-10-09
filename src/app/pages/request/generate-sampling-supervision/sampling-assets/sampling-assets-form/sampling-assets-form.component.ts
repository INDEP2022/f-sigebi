import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISamplingGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ExcelService } from '../../../../../common/services/excel.service';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { JSON_TO_CSV } from '../../../../admin/home/constants/json-to-csv';
import { UploadExpedientFormComponent } from '../../shared-component-gss/upload-expedient-form/upload-expedient-form.component';
import { UploadImagesFormComponent } from '../../shared-component-gss/upload-images-form/upload-images-form.component';
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
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any = [];
  totalItems: number = 0;
  sampleId: number = 0;
  jsonToCsv = JSON_TO_CSV;

  displaySearchAssetsBtn: boolean = false;
  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
    columns: LIST_ASSETS_COLUMN,
  };
  params2 = new BehaviorSubject<ListParams>(new ListParams());
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
  paragraphs3 = new LocalDataSource();
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
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private domicilieService: GoodDomiciliesService,
    private goodsqueryService: GoodsQueryService,
    private authService: AuthService,
    private goodService: GoodService,
    private transferentService: TransferenteService,
    private goodsInvService: GoodsInvService,
    private samplingGoodService: SamplingGoodService
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

  initDateForm() {
    this.dateForm = this.fb.group({
      initialDate: [null, [Validators.required]],
      finalDate: [null, [Validators.required]],
      transferent: [null],
    });
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

  selectWarehouse(event: any): any {
    this.displaySearchAssetsBtn = event.isSelected ? true : false;
    this.storeSelected = event.data;
  }

  goodSearch() {
    const startPeriod = this.dateForm.get('initialDate').value;
    const endPeriod = this.dateForm.get('finalDate').value;

    if (startPeriod && endPeriod) {
      this.params2
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getGoods());
    } else {
      this.alert(
        'warning',
        'Advertencia',
        'Se debe capturar una fecha de periodo inicial y final'
      );
    }
    /*
    console.log('this.storeSelected', this.storeSelected);

    const dates = this.dateForm.value;
    if (!dates.initialDate && !dates.finalDate) {
      
      return;
    }
    this.addParametersFilter(dates, this.storeSelected);
    const filter = this.params2.getValue().getParams();
    console.log('filter', filter);
    this.addParametersFilter(dates, this.storeSelected);

    console.log(this.storeSelected);

    //this.params2.getValue().addFilter('requestId', event.data.requestId.id);
    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getGoods();
    }); */
  }

  /*addParametersFilter(dates: any, storeSelect: any) {
    console.log('storeSelect', storeSelect);
    this.params2 = new BehaviorSubject<FilterParams>(new FilterParams());
    const initDate = moment(dates.initialDate).format('DD/MM/YYYY');
    const endDate = moment(dates.finalDate).format('DD/MM/YYYY');

    this.params2.getValue().addFilter3('sortBy', `organizationCode:ASC`);

    this.params2
      .getValue()
      .addFilter(
        'organizationId',
        this.storeSelected.organizationId,
        SearchFilter.EQ
      );

    this.params2
      .getValue()
      .addFilter(
        'entTransferentId',
        this.storeSelected.entTransferentId,
        SearchFilter.EQ
      );

    this.params2
      .getValue()
      .addFilter('initialPeriod', `${initDate},${endDate}`, SearchFilter.BTW);

    this.params2
      .getValue()
      .addFilter('finalPeriod', `${initDate},${endDate}`, SearchFilter.BTW);
  } */

  selectAssts(event: any) {
    this.listAssetsSelected = event.selected;
    console.log('this.listAssetsSelected', this.listAssetsSelected);
  }

  addAssets() {
    if (this.listAssetsSelected.length > 0) {
      this.listAssetsSelected.map(item => {
        const sampligGood: ISamplingGood = {
          sampleGoodId: 243,
          sampleId: this.sampleId,
          creationDate: moment().format('YYYY-MM-DD'),
          modificationDate: moment().format('YYYY-MM-DD'),
          creationUser: 'ggalindo',
          modificationUser: 'ggalindo',
          goodId: item.managementNumber,
          goodSiabNumber: item.goodSiabNumber,
          inventoryNumber: item.inventoryNumber,
          version: 1,
          description: item.description,
          quantity: item.transactionQuantity,
          unit: item.uomCode,
          subInventoryCode: item.subinventoryCode,
          locatorId: item.locatorId,
          inventoryItemId: item.inventoryItemId,
          tranferRequest: item.transferRequest,
          authorityId: item.authorityId,
          //emiterId: '1',
          transfereeFile: item.transferFile,
          keyUniqueSat: item.satUniqueKey,
          typeFile: item.fileType,
          tradeNumber: item.jobNumber,
          type: item.type,
          subType: item.ssubType,
          sSubtype: item.ssubType,
          ssSubtype: item.sssubType,
          //chapterItem: '6309',
          requestDate: moment(item.requestDate).format('YYYY-MM-DD'),
          fileNumber: item.fileNumber,
          fileDate: moment(item.fileDate).format('YYYY-MM-DD'),
          //indVerification: 'N',
        };
        this.samplingGoodService.createSamplingGood(sampligGood).subscribe({
          next: response => {
            console.log('muestreo bien insertado', response);
            this.getSampligGoods();
          },
        });
        console.log('item', sampligGood);
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Selecciona bienes para el muestreo'
      );
    }
    /*const storeInfo = {
      organizationId: this.storeSelected.organizationCode,
      entTransferentId: this.storeSelected.administratorName,
      startPeriod: this.dateForm.get('initialDate').value,
      endPeriod: this.dateForm.get('finalDate').value,
    }; */

    //this.goodsinvService.getSamplingGoodView()
    /*let ids: any = [];
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
      this.onLoadToast(
        'info',
        `Los bienes con el No. de Gestion ${idsg}, ya se encuantran agregados`
      );
      ids = [];
    }
    this.unselectGoodRows(); */
  }

  getSampligGoods() {
    this.params3.getValue()['filter.sampleId'] = this.sampleId;
    this.samplingGoodService
      .getSamplingGoods(this.params3.getValue())
      .subscribe({
        next: response => {
          console.log('Bienes ya insertados', response);
          this.paragraphs3.load(response.data);
        },
      });
  }

  selectAsstsCopy(event: any) {
    this.listAssetsCopiedSelected = event.selected;
  }

  uploadExpedient() {
    if (this.listAssetsCopiedSelected.length == 0) {
      this.onLoadToast(
        'info',
        'Se tiene que tener seleccionado al menos un registro'
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
      this.onLoadToast(
        'info',
        'Se tiene que tener seleccionado al menos un registro'
      );
      return;
    }
    this.openModals(UploadImagesFormComponent, this.listAssetsCopiedSelected);
  }

  exportCsv() {
    const title = 'Muestreo de Bienes para Supervisión';
    const filename: string = 'MuestreoBienesSupervision';
    //this.jsonToCsv = this.generateJsonExcel();
    //console.log(this.jsonToCsv)
    //{type: 'csv'}
    this.excelService.export(this.jsonToCsv, { filename });
  }

  /*generateJsonExcel() {
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
  } */

  close(): void {}

  search() {
    if (
      this.searchForm.get('id').value &&
      !this.searchForm.get('code').value &&
      !this.searchForm.get('nameWarehouse').value &&
      !this.searchForm.get('address').value
    )
      this.params.getValue()['filter.stockSiabNumber'] = `$eq:${
        this.searchForm.get('id').value
      }`;

    if (
      this.searchForm.get('code').value &&
      !this.searchForm.get('id').value &&
      !this.searchForm.get('nameWarehouse').value &&
      !this.searchForm.get('address').value
    )
      this.params.getValue()['filter.postalCode'] =
        this.searchForm.get('code').value;

    if (
      this.searchForm.get('nameWarehouse').value &&
      !this.searchForm.get('id').value &&
      !this.searchForm.get('code').value &&
      !this.searchForm.get('address').value
    )
      this.params.getValue()['filter.name'] =
        this.searchForm.get('nameWarehouse').value;

    if (
      this.searchForm.get('address').value &&
      !this.searchForm.get('id').value &&
      !this.searchForm.get('code').value &&
      !this.searchForm.get('nameWarehouse').value
    )
      this.params.getValue()['filter.descriptiveValue'] =
        this.searchForm.get('address').value;
    /*this.params.getValue()['filter.initialPeriod'] = `$btw:${
      this.dateForm.get('initialDate').value
    }, ${this.dateForm.get('finalDate').value}`; */

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      //this.getDomicilies();
      this.getCatAlmacenView();
    });
  }
  /*search() {
    this.loading = true;
    this.params.getValue().addFilter('regionalDelegation', this.delegationId);
    this.params
      .getValue()
      .addFilter('initialPeriod', this.dateForm.get('initialDate').value);
    this.params.getValue()['filter.id'] = 1;

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
            this.params.getValue().addFilter('postalCode', searchform[key]);
            break;
          case 'nameWarehouse':
            this.params
              .getValue()
              .addFilter('name', searchform[key], SearchFilter.ILIKE);
            break;
          case 'address':
            this.params
              .getValue()
              .addFilter('address1', searchform[key], SearchFilter.ILIKE);
            break;
          default:
            break;
        }
      }
    }

    
  } */

  getRegionalDelegationId() {
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
    this.params.getValue()[
      'filter.regionalDelegation'
    ] = `$eq:${this.delegationId}`;
    const filter = this.params.value;

    this.goodsqueryService.getCatStoresView(filter).subscribe({
      next: resp => {
        this.paragraphs = resp.data;
        this.totalItems = resp.count;

        this.loading = false;
      },
      error: error => {
        this.onLoadToast('info', 'No se encontraron registros');
        this.loading = false;
      },
    });
  }

  getGoods() {
    this.params2.getValue()[
      'filter.organizationId'
    ] = `$eq:${this.storeSelected.organizationCode}`;
    this.params2.getValue()['filter.initialPeriod'] = `$btw:${
      this.dateForm.get('initialDate').value
    }, ${this.dateForm.get('finalDate').value}`;

    this.params2.getValue()['filter.finalPeriod'] = `$btw:${
      this.dateForm.get('initialDate').value
    }, ${this.dateForm.get('finalDate').value}`;

    this.goodsInvService
      .getSamplingGoodView(this.params2.getValue())
      .subscribe({
        next: async resp => {
          this.paragraphs2.load(resp.data);
          this.totalItems2 = resp.data.length;
          const checkExistSamplingOrder = await this.checkSamplingOrder();
          if (checkExistSamplingOrder) {
            console.log('sampleId', this.sampleId);
            this.params3
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getSampligGoods());
          }
          //this.samplingGoodService.postSamplingGood()
        },
        error: error => {},
      });
  }

  checkSamplingOrder() {
    return new Promise((resolve, reject) => {
      const initialDate = moment(this.dateForm.get('initialDate').value).format(
        'YYYY-MM-DD'
      );
      const finalDate = moment(this.dateForm.get('finalDate').value).format(
        'YYYY-MM-DD'
      );
      const params = new BehaviorSubject<ListParams>(new ListParams());

      params.getValue()['filter.startDate'] = initialDate;
      params.getValue()['filter.endDate'] = finalDate;

      this.samplingGoodService.getSample(params.getValue()).subscribe({
        next: response => {
          console.log('muestreos', response);
          this.sampleId = response.data[0].sampleId;
          resolve(true);
        },
        error: error => {
          const sample: ISample = {
            sampleId: 302,
            regionalDelegationId: this.delegationId,
            startDate: initialDate,
            endDate: finalDate,
            speciesInstance: 'INSTANCIA_INICIADA',
            numeraryInstance: 'INSTANCIA_INICIADA',
            warehouseId: this.storeSelected.organizationCode,
            version: 1,
            userCreation: 'jcastro',
            userModification: 'jcastro',
            creationDate: moment().format('YYYY-MM-DD'),
            modificationDate: moment().format('YYYY-MM-DD'),
          };

          this.samplingGoodService.createSample(sample).subscribe({
            next: response => {
              console.log('sample', response);
              this.sampleId = response.sampleId;
              resolve(true);
            },
            error: error => {
              this.alert('error', 'Error', 'Error al crear Muestreo');
            },
          });
        },
      });
    });
  }

  /*turnForm() {
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
        const size = this.paragraphs3.length;
        const evaResult = this.paragraphs3.filter(x => x.resultTest != null);
        debugger;
        if (size == 0) {
          this.onLoadToast('info', 'No hay bienes agregados');
          return;
        }

        if (size != evaResult.length) {
          this.onLoadToast(
            'info',
            'Todos los bienes deben contar con un Resultado de Evaluación'
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
          const deductivesSelected = this.paragraphsDeductivas.filter(
            x => x.selected == true
          );

          if (deductivesSelected.length == 0) {
            this.onLoadToast('info', 'Seleccione al menos una deductiva');
            return;
          } else {
            this.openModals(TurnModalComponent, '', 'popTurna', 'modal-lg');
          }
        }
      }
    });
  } */

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
    this.params = new BehaviorSubject<ListParams>(new ListParams());
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getCatAlmacenView();
    });
  }

  /*removeGood() {
    if (this.listAssetsCopiedSelected.length == 0) {
      this.onLoadToast('info', 'Seleccione al menos un bien');
      return;
    }
    this.listAssetsCopiedSelected.map(item => {
      const index = this.paragraphs3.indexOf(item);
      this.paragraphs3.splice(index, 1);
    });
    this.paragraphs3 = [...this.paragraphs3];
    this.listAssetsCopiedSelected = [];

  
  } */

  /*meetGood(value: string) {
    if (this.listAssetsCopiedSelected.length == 0) {
      this.onLoadToast('info', 'Debe tener selecionado al menos un Bien');
      return;
    }

    this.listAssetsCopiedSelected.map(item => {
      const index = this.paragraphs3.indexOf(item);
      this.paragraphs3[index].resultTest = value;
    });
    this.paragraphs3 = [...this.paragraphs3];
    this.listAssetsCopiedSelected = [];
  } */

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
    event.toggle.subscribe((data: any) => {});
  }

  deductivesObservations(event: any) {}

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
