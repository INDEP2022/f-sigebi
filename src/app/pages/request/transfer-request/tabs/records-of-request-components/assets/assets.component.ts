import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IDomicilies } from 'src/app/core/models/good/good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodDataAsetService } from 'src/app/core/services/ms-good/good-data-aset.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';
import Swal from 'sweetalert2';
import { AdvancedSearchComponent } from '../../classify-assets-components/classify-assets-child-tabs-components/advanced-search/advanced-search.component';
import { MenajeComponent } from '../records-of-request-child-tabs-components/menaje/menaje.component';
import { SelectAddressComponent } from '../records-of-request-child-tabs-components/select-address/select-address.component';
import { ASSETS_COLUMNS } from './assests-columns';
import { ExcelFormat } from './AssetExcelFormat';

const defaultData = [
  {
    id: 0,
    noManagement: '',
    descripTransfeAsset: '',
    typeAsset: '',
    physicalState: '',
    conservationState: '',
    tansferUnitMeasure: '',
    transferAmount: '',
    destinyLigie: '',
    destinyTransfer: '',
    householdAsset: '',
  },
];
@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent extends BasePage implements OnInit, OnChanges {
  @ViewChild('table', { static: false }) table: any;
  @Input() requestObject: any; //solicitudes
  @Input() process: string = '';
  @ViewChild('uploadFile') fileUploaded: ElementRef<any>;
  goodObject: any; //bienes
  goodDomiciliesMasive: any = []; // domicilios masivo
  listgoodObjects: any[] = [];
  totalItems: number = 0;
  principalSave: boolean = false;
  bsModalRef: BsModalRef;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  paragraphs = new LocalDataSource();
  createNewAsset: boolean = false;
  btnCreate: string = 'Nuevo Bien';
  domicilieObject: IDomicilies = null;
  data: ExcelFormat[] = [];
  menajeSelected: any;
  isSaveDomicilie: boolean = false;
  isSaveMenaje: boolean = false;
  isSaveFraction: boolean = false;
  //typeDoc: string = '';
  private idFractions: any = [];
  private listGoodsFractions: any = [];
  private fractionProperties: any = {};
  typeRecord: string = '';
  transferente: string = '';
  selectedAll: boolean = false;
  typeRequest: string = '';

  constructor(
    private route: ActivatedRoute,
    private modalServise: BsModalService,
    private goodService: GoodService,
    private typeRelevantSevice: TypeRelevantService,
    private genericService: GenericService,
    private requestHelperService: RequestHelperService,
    private excelService: ExcelService,
    private menageService: MenageService,
    private procedureManagementService: ProcedureManagementService,
    private authService: AuthService,
    private fractionService: FractionService,
    private goodsQueryService: GoodsQueryService,
    private goodFinderService: GoodFinderService,
    private cdr: ChangeDetectorRef,
    private goodDataAsetService: GoodDataAsetService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestObject) {
      this.typeRecord = this.requestObject.typeRecord;
      this.transferente = this.requestObject.transfer;
    }
  }

  ngOnInit(): void {
    this.fractionProperties = {
      goodClassNumber: null,
      unitMeasure: null,
      ligieUnit: null,
      fractionId: null,
      goodTypeId: null,
    };
    //console.log('Activando tab: assets');
    //console.log('TIPO TRASFERENCIA', this.requestObject.typeOfTransfer);
    this.typeRequest = this.requestObject.typeOfTransfer;
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: ASSETS_COLUMNS,
      selectMode: 'multi',
    };
    //this.settings.actions.delete = true;
    // this.settings.actions.position = 'left';
    //oye los camibios de detail-assets-tab para refrescar la tabla
    this.refreshTable();
    this.paginatedData();
  }

  paginatedData() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
  }

  getData() {
    this.loading = true;
    this.paragraphs = new LocalDataSource();
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.params.value.addFilter('requestId', requestId);
    this.goodFinderService
      .goodFinder(this.params.getValue().getParams())
      .subscribe({
        next: async resp => {
          const result = resp.data.map(async (item: any) => {
            const goodMenaje = await this.getMenaje(item.id);
            item['goodMenaje'] = goodMenaje;
          });

          Promise.all(result).then(x => {
            this.totalItems = resp.count;
            this.paragraphs.load(resp.data);
            this.loading = false;
          });
        },
        error: error => {
          this.loading = false;
          this.paragraphs = new LocalDataSource();
        },
      });
  }

  getMenaje(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.noGoodMenaje'] = `$eq:${id}`;
      this.menageService.getAll(params).subscribe({
        next: (resp: any) => {
          if (resp.data) {
            resolve(resp.data[0]['noGood']);
          } else {
            resolve('');
          }
        },
        error: error => {
          resolve('');
        },
      });
    });
  }

  onFileChange(event: any, type?: string) {
    this.loaderProgress.load = true; //Loading cambiar por uno de porcentaje
    const file = event.target.files[0];
    const name = file.name;
    const lastModified = file.lastModified;
    const user = this.authService.decodeToken().preferred_username;
    /*const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = () => {
      console.log('fileReader ',fileReader)
      const result:any = this.readExcel(fileReader.result,name,lastModified);
      if(result != null){
        this.uploadFile(result, this.requestObject.id, user);
      }
    }*/
    this.uploadFile(file, this.requestObject.id, user);
    this.fileUploaded.nativeElement.value = '';
  }

  readExcel(binaryExcel: string | ArrayBuffer, name: string) {
    try {
      this.data = this.excelService.getData<any>(binaryExcel);

      for (let i = 0; i < this.data.length; i++) {
        const element: any = this.data[i];
        if (element['ENTFED'] != undefined) {
          element['ENTFED'] = element['ENTFED'].toLowerCase();
          element['ENTFED'] =
            element['ENTFED'][0].toUpperCase() + element['ENTFED'].substring(1);
        } else {
          element['ENTFED'] = 'xx';
        }

        if (element['EDOFISICO'] != undefined) {
          element['EDOFISICO'] = element['EDOFISICO'].toLowerCase();
          element['EDOFISICO'] =
            element['EDOFISICO'][0].toUpperCase() +
            element['EDOFISICO'].substring(1);
        }
        if (element['MARCA'] != undefined) {
          element['MARCA'] = element['MARCA'].toLowerCase();
          element['MARCA'] =
            element['MARCA'][0].toUpperCase() + element['MARCA'].substring(1);
        } else {
          element['MARCA'] = 'xx';
        }

        if (element['SUBMARCA'] != undefined) {
          element['SUBMARCA'] = element['SUBMARCA'].toLowerCase();
          element['SUBMARCA'] =
            element['SUBMARCA'][0].toUpperCase() +
            element['SUBMARCA'].substring(1);
        }

        if (element['UNIDAD'] != undefined) {
          element['UNIDAD'] = element['UNIDAD'].toLowerCase();
          element['UNIDAD'] =
            element['UNIDAD'][0].toUpperCase() + element['UNIDAD'].substring(1);
        }

        if (element['ESTADO FÍSICO'] != undefined) {
          element['ESTADO FÍSICO'] = element['ESTADO FÍSICO'].toLowerCase();
          element['ESTADO FÍSICO'] =
            element['ESTADO FÍSICO'][0].toUpperCase() +
            element['ESTADO FÍSICO'].substring(1);
        }

        if (element['ESTADO DE CONSERVACIÓN'] != undefined) {
          element['ESTADO DE CONSERVACIÓN'] =
            element['ESTADO DE CONSERVACIÓN'].toLowerCase();
          element['ESTADO DE CONSERVACIÓN'] =
            element['ESTADO DE CONSERVACIÓN'][0].toUpperCase() +
            element['ESTADO DE CONSERVACIÓN'].substring(1);
        }

        if (element['TIPO'] == undefined) {
          element['TIPO'] = 'xx';
        }
      }
      console.table(this.data);
      const filename: string = name;
      const FileType: string =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const file = this.excelService.exportJsonToExcelNewFile(
        this.data,
        { filename },
        FileType
      );
      return file;
    } catch (error) {
      this.loader.load = false;
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
      return false;
    }
  }

  uploadFile(file: File, request: string, user: string) {
    this.procedureManagementService
      .uploadExcelMassiveChargeGoods(file, request, user)
      .subscribe({
        next: resp => {
          this.message(
            'success',
            'Archivos cargados',
            `Se importaron los archivos`
          );
          this.loaderProgress.load = false;
          this.fileUploaded.nativeElement.value = '';
          this.closeCreateGoodWIndows();
        },
        error: error => {
          this.loaderProgress.load = false;
          this.message(
            'error',
            'Error al cargar el archivo',
            `No se pudo cargar el archivo excel: ${error.error.message}`
          );
        },
      });
  }

  newAsset(): void {
    if (this.createNewAsset === false) {
      this.createNewAsset = true;
      this.btnCreate = 'Cerrar Bien';
      window.scroll(0, 600);
    } else {
      this.createNewAsset = false;
      this.btnCreate = 'Nuevo Bien';
    }
  }

  selectRows(event: any) {
    //Desactivar check
    if (event.isSelected == false) {
      this.table.isAllSelected = false;
    }
    this.listgoodObjects = event.selected;
    if (this.listgoodObjects.length <= 1) {
      if (event.isSelected === true) {
        this.setQuantyy();
        this.goodObject = this.listgoodObjects[0];

        this.createNewAsset = true;
        this.btnCreate = 'Cerrar Bien';
        const load = true;
        this.loadLoading(load);
        setTimeout(() => {
          this.loadLoading(false);
        }, 400);
      } else {
        this.goodObject = null;
        this.createNewAsset = false;
        this.btnCreate = 'Nuevo Bien';
      }
    } else {
      this.goodObject = this.listgoodObjects;
      this.createNewAsset = false;
      this.btnCreate = 'Nuevo Bien';
    }
  }

  setQuantyy() {
    const typeOfTransferent = this.requestObject.typeOfTransfer;
    if (
      typeOfTransferent === 'PGR_SAE' ||
      typeOfTransferent === 'FGR_SAE' ||
      typeOfTransferent === 'SAT_SAE'
    ) {
      if (
        !this.listgoodObjects[0].quantity ||
        this.listgoodObjects[0].quantity <= this.listgoodObjects[0].quantityy
      ) {
        this.listgoodObjects[0].quantity = this.listgoodObjects[0].quantityy;
      } else if (this.listgoodObjects[0].quantity === null) {
        this.listgoodObjects[0].quantity <= this.listgoodObjects[0].quantityy;
      }
    }
  }
  loadLoading(loading: boolean) {
    this.requestHelperService.loadingForm(loading);
  }
  openSelectAddressModal() {
    if (this.listgoodObjects.length === 0) {
      this.onLoadToast('warning', 'Información', `Seleccione uno o mas Bienes`);
      return;
    }
    let config: ModalOptions = {
      initialState: {
        request: this.requestObject,
        address: '',
        onlyOrigin: true,
        callback: (next: boolean) => {
          //if (next) this.getExample();
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalServise.show(SelectAddressComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      //cargarlos en el formulario
      this.loading = true;
      if (res) {
        for (let i = 0; i < this.listgoodObjects.length; i++) {
          const element = this.listgoodObjects[i];
          const good: any = {};

          good.id = element.id;
          good.goodId = element.goodId;
          good.addressId = res.id;

          this.goodDomiciliesMasive.push(good);
        }
        this.isSaveDomicilie = true;
      }
      this.loading = false;
      this.onLoadToast(
        'success',
        'Proceso Finalizado',
        'Ya se puede guardar el Bien'
      );
    });
  }
  // abrir menaje
  menajeModal() {
    if (this.listgoodObjects.length === 0) {
      this.onLoadToast('warning', 'Información', `Seleccione uno o mas Bienes`);
      return;
    }
    let config: ModalOptions = {
      initialState: {
        goodsObject: this.listgoodObjects,
        requestId: this.requestObject.id,
        callback: (next: boolean) => {
          //if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalServise.show(MenajeComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      //ver si es necesario recivir los datos desde menaje
      if (res) {
        this.menajeSelected = res;
        this.isSaveMenaje = true;
      }
    });
  }

  async save() {
    if (this.listgoodObjects.length > 0) {
      if (this.isSaveDomicilie === true) {
        await this.saveDomicilie();
      }
      if (this.isSaveMenaje === true) {
        await this.saveMenaje();
      }
      if (this.isSaveFraction === true) {
        await this.saveFractions();
      }
      this.closeCreateGoodWIndows();
    } else {
      this.message('error', 'Error', `Seleccione al menos un bien`);
    }
  }

  saveDomicilie() {
    this.goodDomiciliesMasive.map(async (item: any, i: number) => {
      let index = i + 1;
      const domicileResult = await this.updateGoods(item);
      if (domicileResult) {
        if (this.goodDomiciliesMasive.length === index) {
          this.message(
            'success',
            'El domicilio se actualizó',
            `Se guardó el domicilio del Bien`
          );
          this.refreshTable();
          this.isSaveDomicilie = false;
        }
      }
    });
  }

  saveMenaje() {
    this.menajeSelected.map(async (item: any, i: number) => {
      let index = i + 1;
      const menajeResult = await this.createMenaje(item);
      if (menajeResult) {
        if (this.menajeSelected.length === index) {
          this.message(
            'success',
            'Menaje Guardado',
            `Se guardaron los menajes exitosamente`
          );
          this.refreshTable();
          this.isSaveMenaje = false;
        }
      }
    });
  }

  saveFractions() {
    this.listGoodsFractions.map(async (item: any, i: number) => {
      let index = i + 1;
      const fractionResult = await this.updateGoods(item);
      this.updateGoodFindRecord(item);
      if (fractionResult) {
        if (this.listGoodsFractions.length === index) {
          this.message(
            'success',
            'Fracción Guardada',
            `Se guardó la fracción exitosamente`
          );
          this.refreshTable();
          this.isSaveFraction = false;
          this.fractionProperties = {
            goodClassNumber: null,
            unitMeasure: null,
            ligieUnit: null,
            fractionId: null,
            goodTypeId: null,
          };
        }
      }
    });
  }

  updateGoods(item: any) {
    return new Promise((resolve, reject) => {
      this.goodService.update(item).subscribe({
        next: resp => {
          if (resp.id) {
            resolve(true);
          }
        },
        error: error => {
          this.message(
            'error',
            'Error',
            `Error al actualizar los Bienes ${error.error.message}`
          );
          console.log(error);
          console.log(error.error.message);
          reject(false);
        },
      });
    });
  }

  createMenaje(item: any) {
    return new Promise((resolve, reject) => {
      this.menageService.create(item).subscribe({
        next: data => {
          resolve(true);
        },
        error: error => {
          this.message(
            'error',
            'Error',
            `Error al crear el menaje ${error.error.message}`
          );
          console.log(error.error.message);
          this.isSaveMenaje = false;
          reject(false);
        },
      });
    });
  }

  delete() {
    if (this.listgoodObjects.length > 0) {
      Swal.fire({
        title: 'Eliminar',
        text: '¿Está seguro de querer eliminar el bien seleccionado?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#9D2449',
        cancelButtonColor: '#B38E5D',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
      }).then(result => {
        if (result.isConfirmed) {
          this.deleteMethod();
        }
      });
    } else {
      this.message('warning', 'Información', `Seleccione uno o mas bienes`);
    }
  }

  deleteMethod() {
    this.loader.load = true;
    this.listgoodObjects.map(async (item, i) => {
      let index = i + 1;
      const deleteResult = await this.deleteGood(item);

      if (deleteResult === true) {
        if (this.listgoodObjects.length === index) {
          this.message(
            'success',
            'Bienes Eliminados',
            `Los Bienes se eliminaron correctamente`
          );
          this.loader.load = false;
          this.closeCreateGoodWIndows();
        }
      }
    });
  }

  deleteGood(element: any) {
    return new Promise((resolve, reject) => {
      let goodRemove = { id: element.id, goodId: element.goodId };
      this.goodService.removeGood(goodRemove).subscribe({
        next: (resp: any) => {
          if (resp.statusCode === 200) {
            resolve(true);
          } else {
            this.loader.load = false;
            reject(false);
            this.message('error', 'Eliminar', `${resp.message[0]}`);
          }
        },
        error: error => {
          this.loader.load = false;
          this.message('error', 'Eliminar', `No se puedo eliminar los bienes`);
        },
      });
    });
  }

  refreshTable() {
    this.requestHelperService.currentRefresh.subscribe({
      next: data => {
        if (data) {
          setTimeout(() => {
            this.closeCreateGoodWIndows();
          }, 1000);
        }
      },
    });
  }

  closeCreateGoodWIndows() {
    this.goodObject = null;
    this.createNewAsset = false;
    this.btnCreate = 'Nuevo Bien';
    this.paginatedData();
  }

  updateGoodFindRecord(good: any) {
    this.goodDataAsetService
      .updateGoodFinderRecord(good.goodId, good.id)
      .subscribe({
        next: resp => {
          console.log('registro actualizado');
        },
        error: error => {
          console.log('Error actualizar el registro de good', error);
          this.onLoadToast(
            'error',
            'Error al actualizar',
            'No se pudo actualizar el registro'
          );
        },
      });
  }

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  /* Clasificacion Masiva */
  masiveClasification() {
    if (this.listgoodObjects.length === 0) {
      this.onLoadToast('warning', 'Información', `Seleccione uno o mas Bienes`);
      return;
    }

    let config: ModalOptions = {
      initialState: {
        parameter: '',
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalServise.show(AdvancedSearchComponent, config);

    this.bsModalRef.content.event.subscribe((res: any) => {
      this.idFractions = [];
      this.loading = true;
      this.isSaveFraction = true;
      //this.cleanForm();
      this.matchLevelFraction(res);
    });
  }

  cleanForm() {
    for (let i = 0; i < this.listgoodObjects.length; i++) {
      const good = this.listgoodObjects[i];
      delete this.listgoodObjects[i].goodTypeName;
      delete this.listgoodObjects[i].physicalStatusName;
      delete this.listgoodObjects[i].stateConservationName;
      delete this.listgoodObjects[i].transferentDestinyName;
      delete this.listgoodObjects[i].destinyLigieName;

      delete this.listgoodObjects[i].goodMenaje;
      delete this.listgoodObjects[i].boveda;
      delete this.listgoodObjects[i].gaveta;
      delete this.listgoodObjects[i].expediente;
      delete this.listgoodObjects[i].almacen;
      delete this.listgoodObjects[i].solicitud;
      delete this.listgoodObjects[i].fraccion;
      for (const key in good) {
        // console.log(good[key], key);
        if (
          key !== 'goodId' &&
          key !== 'id' &&
          key !== 'requestId' &&
          key !== 'addressId' &&
          key !== 'dateIn' &&
          key !== 'goodDescription' &&
          key !== 'userCreation' &&
          key !== 'creationDate' &&
          key !== 'userModification' &&
          key !== 'modificationDate' &&
          key !== 'processStatus'
        ) {
          good[key] = null;
        }
      }
    }
  }

  setFractions(listReverse: any) {
    const fractions = [
      'ligieSection',
      'ligieChapter',
      'ligieLevel1',
      'ligieLevel2',
      'ligieLevel3',
      'ligieLevel4',
    ];
    this.listGoodsFractions = [];
    let existAddres = 0;
    for (let j = 0; j < this.listgoodObjects.length; j++) {
      const item = this.listgoodObjects[j];
      let good: any = {};
      good.id = Number(item.id);
      good.goodId = Number(item.goodId);
      if (!item.addressId) {
        good.addressId = null;
        existAddres++;
      } else {
        good.addressId = Number(item.addressId.id)
          ? Number(item.addressId.id)
          : Number(item.addressId);
      }

      good.requestId = Number(item.requestId.id)
        ? Number(item.requestId.id)
        : Number(item.requestId);
      good.goodClassNumber = Number(this.fractionProperties['goodClassNumber']);
      good.unitMeasure = this.fractionProperties['unitMeasure'];
      good.ligieUnit = this.fractionProperties['ligieUnit'];
      good.fractionId = Number(this.fractionProperties['fractionId']);
      good.goodTypeId = Number(this.fractionProperties['goodTypeId']);

      /* inf. del bien */
      good.goodDescription = item.goodDescription;
      good.goodStatus = 'VERIFICAR_CUMPLIMIENTO';
      good.processStatus = 'VERIFICAR_CUMPLIMIENTO';
      //good.processStatus = item.processStatus;

      good.quantity = item.quantity ? item.quantity : 0;
      good.duplicity = item.duplicity;
      good.capacity = item.capacity;
      good.fileeNumber = item.fileeNumber;
      good.volume = item.volume;
      good.physicalStatus = item.physicalStatus;
      good.useType = item.useType;
      good.stateConservation = item.stateConservation;
      good.origin = item.origin;
      good.destiny = item.destiny;
      if (item.transferentDestiny) {
        good.transferentDestiny = item.transferentDestiny;
      } else if (!item.transferentDestiny && good.destiny) {
        good.transferentDestiny = item.destiny;
      } else {
        good.transferentDestiny = 1;
      }
      good.notesTransferringEntity = item.notesTransferringEntity;
      good.appraisal = item.appraisal ? 'Y' : 'N';
      good.compliesNorm = item.compliesNorm ? 'Y' : 'N';
      good.saeDestiny = item.saeDestiny;
      /*  */

      for (let i = 0; i < listReverse.length; i++) {
        const fractionsId = listReverse[i];
        good[fractions[i]] = Number(fractionsId);
      }
      this.listGoodsFractions.push(good);
    }
    this.loading = false;
    //console.table(this.listGoodsFractions);
    if (existAddres > 0) {
      this.onLoadToast(
        'warning',
        'Bienes sin domicilio',
        'Existen Bienes que aun no se les asignó un domicilio'
      );
    }
    setTimeout(() => {
      this.onLoadToast(
        'success',
        'Proceso Finalizado',
        'Ya se pueden guardar los Bienes'
      );
    }, 600);
  }

  getNoClasifyGood(value: string) {
    return new Promise((resolve, reject) => {
      if (value) {
        if (value.length >= 8) {
          const fractionCode = { fraction: value };
          this.goodsQueryService
            .getUnitLigie(fractionCode)
            .subscribe((data: any) => {
              //guarda el no_clasify_good
              if (data.clasifGoodNumber !== null) {
                /* this.listGoodsFractions['goodClassNumber'] =
                  data.clasifGoodNumber; */
                resolve(data);
              } else {
                resolve(true);
                this.message(
                  'warning',
                  'clasificación de bien vacia',
                  'El bien seleccionado no tiene número de clasificación'
                );
              }
            });
        }
      }
    });
  }

  matchLevelFraction(res: any) {
    //debugger;
    switch (Number(res.level)) {
      case 5:
        this.getLevel4(new ListParams(), res.id);
        break;
      case 4:
        this.getLevel3(new ListParams(), res.id);
        break;
      case 3:
        this.getLevel2(new ListParams(), res.id);
        break;
      case 2:
        this.getLevel1(new ListParams(), res.id);
        break;
      case 1:
        this.getChapter(new ListParams(), res.id);
        break;
      case 0:
        this.getSection(new ListParams(), res.id);
        break;
      default:
        break;
    }
  }

  getSection(params: ListParams, id?: number) {
    params['filter.id'] = '$eq:' + id.toString();

    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: async data => {
        const fraction: any = data.data[0];
        this.idFractions.push(fraction.id);
        const fractionCode = fraction.fractionCode
          ? fraction.fractionCode.toString()
          : '';
        if (
          fractionCode.length === 8 &&
          this.fractionProperties.goodClassNumber === null
        ) {
          this.fractionProperties['relevantTypeId'] = fraction.relevantTypeId;
          const fractionDesc: any = await this.getNoClasifyGood(fractionCode);
          this.fractionProperties['goodClassNumber'] =
            fractionDesc.clasifGoodNumber;
          this.fractionProperties['fractionId'] = fraction.id;
          if (fraction.typeRelevant) {
            this.fractionProperties['goodTypeId'] = fraction.typeRelevant.id;
          }
          this.fractionProperties['unitMeasure'] = fraction.unit
            ? fraction.unit
            : '';
          this.fractionProperties['ligieUnit'] = fraction.unit
            ? fraction.unit
            : '';
        }
        const listReverse = this.idFractions.reverse();
        //estable los id para ser visualizados
        this.setFractions(listReverse);
      },
    });
  }

  getChapter(params: ListParams, id?: number) {
    params['filter.id'] = '$eq:' + id.toString();
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: async data => {
        const fraction: any = data.data[0];
        this.idFractions.push(fraction.id);
        const fractionCode = fraction.fractionCode
          ? fraction.fractionCode.toString()
          : '';
        if (
          fractionCode.length === 8 &&
          this.fractionProperties.goodClassNumber === null
        ) {
          this.fractionProperties['relevantTypeId'] = fraction.relevantTypeId;
          const fractionDesc: any = await this.getNoClasifyGood(fractionCode);
          this.fractionProperties['goodClassNumber'] =
            fractionDesc.clasifGoodNumber;
          this.fractionProperties['fractionId'] = fraction.id;
          if (fraction.typeRelevant) {
            this.fractionProperties['goodTypeId'] = fraction.typeRelevant.id;
          }
          this.fractionProperties['unitMeasure'] = fraction.unit
            ? fraction.unit
            : '';
          this.fractionProperties['ligieUnit'] = fraction.unit
            ? fraction.unit
            : '';
        }
        this.getSection(new ListParams(), data.data[0].parentId);
      },
      error: error => {},
    });
  }

  getLevel1(params: ListParams, id?: number) {
    params['filter.id'] = '$eq:' + id.toString();
    delete params.text;
    delete params.inicio;
    delete params.pageSize;
    delete params.take;
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: async data => {
        const fraction: any = data.data[0];
        this.idFractions.push(fraction.id);
        const fractionCode = fraction.fractionCode
          ? fraction.fractionCode.toString()
          : '';
        if (
          fractionCode.length === 8 &&
          this.fractionProperties.goodClassNumber === null
        ) {
          this.fractionProperties['relevantTypeId'] = fraction.relevantTypeId;
          const fractionDesc: any = await this.getNoClasifyGood(fractionCode);
          this.fractionProperties['goodClassNumber'] =
            fractionDesc.clasifGoodNumber;
          this.fractionProperties['fractionId'] = fraction.id;
          if (fraction.typeRelevant) {
            this.fractionProperties['goodTypeId'] = fraction.typeRelevant.id;
          }
          this.fractionProperties['unitMeasure'] = fraction.unit
            ? fraction.unit
            : '';
          this.fractionProperties['ligieUnit'] = fraction.unit
            ? fraction.unit
            : '';
        }
        this.getChapter(new ListParams(), fraction.parentId);
      },
      error: error => {},
    });
  }

  getLevel2(params: ListParams, id?: number) {
    params['filter.id'] = '$eq:' + id.toString();

    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: async data => {
        const fraction: any = data.data[0];
        this.idFractions.push(fraction.id);
        const fractionCode = fraction.fractionCode
          ? fraction.fractionCode.toString()
          : '';
        if (
          fractionCode.length === 8 &&
          this.fractionProperties.goodClassNumber === null
        ) {
          this.fractionProperties['relevantTypeId'] = fraction.relevantTypeId;
          const fractionDesc: any = await this.getNoClasifyGood(fractionCode);
          this.fractionProperties['goodClassNumber'] =
            fractionDesc.clasifGoodNumber;
          this.fractionProperties['fractionId'] = fraction.id;
          if (fraction.typeRelevant) {
            this.fractionProperties['goodTypeId'] = fraction.typeRelevant.id;
          }
          this.fractionProperties['unitMeasure'] = fraction.unit
            ? fraction.unit
            : '';
          this.fractionProperties['ligieUnit'] = fraction.unit
            ? fraction.unit
            : '';
        }
        this.getLevel1(new ListParams(), data.data[0].parentId);
      },
      error: error => {},
    });
  }

  getLevel3(params: ListParams, id?: number) {
    params['filter.id'] = '$eq:' + id.toString();
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: async data => {
        const fraction: any = data.data[0];
        this.idFractions.push(fraction.id);
        const fractionCode = fraction.fractionCode
          ? fraction.fractionCode.toString()
          : '';
        console.log(this.fractionProperties);

        if (
          fractionCode.length === 8 &&
          this.fractionProperties.goodClassNumber === null
        ) {
          this.fractionProperties['relevantTypeId'] = fraction.relevantTypeId;
          const fractionDesc: any = await this.getNoClasifyGood(fractionCode);
          this.fractionProperties['goodClassNumber'] =
            fractionDesc.clasifGoodNumber;
          this.fractionProperties['fractionId'] = fraction.id;
          if (fraction.typeRelevant) {
            this.fractionProperties['goodTypeId'] = fraction.typeRelevant.id;
          }
          this.fractionProperties['unitMeasure'] = fraction.unit
            ? fraction.unit
            : '';
          this.fractionProperties['ligieUnit'] = fraction.unit
            ? fraction.unit
            : '';
        }
        this.getLevel2(new ListParams(), data.data[0].parentId);
      },
      error: error => {},
    });
  }

  getLevel4(params: ListParams, id?: number) {
    params['filter.id'] = '$eq:' + id.toString();
    params.limit = 50;
    this.fractionService.getAll(params).subscribe({
      next: async (data: any) => {
        const fraction: any = data.data[0];
        this.idFractions.push(fraction.id);
        const fractionCode = fraction.fractionCode
          ? fraction.fractionCode.toString()
          : '';

        if (
          fractionCode.length === 8 &&
          this.fractionProperties.goodClassNumber === null
        ) {
          this.fractionProperties['relevantTypeId'] = fraction.relevantTypeId;
          const fractionDesc: any = await this.getNoClasifyGood(fractionCode);
          this.fractionProperties['goodClassNumber'] =
            fractionDesc.clasifGoodNumber;
          this.fractionProperties['fractionId'] = fraction.id;
          if (fraction.typeRelevant) {
            this.fractionProperties['goodTypeId'] = fraction.typeRelevant.id;
          }
          this.fractionProperties['unitMeasure'] = fraction.unit
            ? fraction.unit
            : '';
          this.fractionProperties['ligieUnit'] = fraction.unit
            ? fraction.unit
            : '';
        }
        this.getLevel3(new ListParams(), data.data[0].parentId);
      },
      error: error => {},
    });
  }

  assignAllAddress() {
    Swal.fire({
      title: 'Asignación Masiva de Domicilio',
      html: 'Se asignará a todos los Bienes el domicilio que se seleccione',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        let config: ModalOptions = {
          initialState: {
            request: this.requestObject,
            address: '',
            onlyOrigin: true,
            callback: (next: boolean) => {
              //if (next) this.getExample();
            },
          },
          class: 'modalSizeXL modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.bsModalRef = this.modalServise.show(
          SelectAddressComponent,
          config
        );

        this.bsModalRef.content.event.subscribe((res: any) => {
          //cargarlos en el formulario
          this.loading = true;
          if (res) {
            this.assignAddress(this.requestObject.id, res.id);
          }
        });
      }
    });
  }

  assignAddress(requestId: number | string, addresId: number | string) {
    this.goodFinderService
      .masiveAssignationDomicileGood(requestId, addresId)
      .subscribe({
        next: resp => {
          this.onLoadToast(
            'success',
            'Asignación exitosa',
            `Se asignó un domicilio a todos los Bienes`
          );
          this.loading = true;
          this.closeCreateGoodWIndows();
        },
        error: error => {
          this.loading = false;
          console.log('Error al asignar domicilio a los Bienes ', error);
          this.onLoadToast(
            'error',
            'Error',
            `Error al asignar domicilio a los Bienes`
          );
        },
      });
  }

  classifyAllGoods() {
    Swal.fire({
      title: 'Clasificación Masiva',
      html: 'Se asignará a todos los Bienes la fracción que se seleccione',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        let config: ModalOptions = {
          initialState: {
            parameter: '',
            callback: (next: boolean) => {
              //if(next) this.getExample();
            },
          },
          class: 'modalSizeXL modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.bsModalRef = this.modalServise.show(
          AdvancedSearchComponent,
          config
        );

        this.bsModalRef.content.event.subscribe((res: any) => {
          this.idFractions = [];
          this.loading = true;
          //this.isSaveFraction = true;
          //console.log(res.id,this.requestObject.id)
          this.classifyGoods(this.requestObject.id, res.id);
        });
      }
    });
  }

  classifyGoods(requestId: number | string, fractionId: number | string) {
    let type = this.requestObject.typeOfTransfer == 'PGR_SAE' ? 4 : 1;
    this.goodFinderService
      .masiveClassificationGood(requestId, fractionId, type)
      .subscribe({
        next: resp => {
          this.onLoadToast(
            'success',
            'Clasificación Exitosa',
            `Se clasificaron todos los Bienes`
          );
          this.loading = true;
          this.closeCreateGoodWIndows();
        },
        error: error => {
          this.loading = false;
          console.log('Error al clasificar los bienes masivamente ', error);
          this.onLoadToast(
            'error',
            'Error',
            `No se pudieron clasificar los Bienes`
          );
        },
      });
  }
}
