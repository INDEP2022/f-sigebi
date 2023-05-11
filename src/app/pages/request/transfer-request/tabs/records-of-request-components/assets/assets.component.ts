import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  paragraphs: any[] = [];
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
    private goodsQueryService: GoodsQueryService
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
    this.paragraphs = [];
    const requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.params.value.addFilter('requestId', requestId);
    this.goodService.getAll(this.params.getValue().getParams()).subscribe({
      next: async (data: any) => {
        if (data !== null) {
          const result = data.data.map(async (item: any) => {
            //obtener tipo bien
            const goodType = await this.getGoodType(item.goodTypeId);
            item['goodTypeName'] = goodType;
            //obtener el estado fisico
            const physicalStatus = await this.getPhysicalStatus(
              item.physicalStatus
            );
            item['physicalStatusName'] = physicalStatus;

            //obtener el estado de concervacion
            const stateConservation = await this.getStateConservation(
              item.stateConservation
            );
            item['stateConservationName'] = stateConservation;

            //obtener el destino de la transferencia
            const transferentDestiny = await this.getTransferDestiny(
              item.transferentDestiny
            );
            item['transferentDestinyName'] = transferentDestiny;
            item['destinyLigieName'] = transferentDestiny;

            const goodMenaje = await this.getMenaje(item.id);
            item['goodMenaje'] = goodMenaje;
          });

          Promise.all(result).then(x => {
            this.totalItems = data.count;
            this.paragraphs = data.data;
            this.loading = false;
          });
        } else {
          this.paragraphs = defaultData;
          this.loading = false;
        }
      },
      error: error => {
        this.loading = false;
        this.paragraphs = [];
      },
    });
  }

  getGoodType(goodTypeId: number) {
    return new Promise((resolve, reject) => {
      if (goodTypeId !== null) {
        this.typeRelevantSevice.getById(goodTypeId).subscribe({
          next: (data: any) => {
            resolve(data.description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getPhysicalStatus(physicalState: any) {
    return new Promise((resolve, reject) => {
      if (physicalState !== null) {
        var params = new ListParams();
        params['filter.keyId'] = `$eq:${physicalState}`;
        params['filter.name'] = `$eq:Estado Fisico`;
        this.genericService.getAll(params).subscribe({
          next: data => {
            resolve(data.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getStateConservation(stateConcervation: any) {
    return new Promise((resolve, reject) => {
      if (stateConcervation !== null) {
        var params = new ListParams();
        params['filter.keyId'] = `$eq:${stateConcervation}`;
        params['filter.name'] = `$eq:Estado Conservacion`;
        this.genericService.getAll(params).subscribe({
          next: data => {
            resolve(data.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getTransferDestiny(transferentDestiny: any) {
    return new Promise((resolve, reject) => {
      if (transferentDestiny !== null) {
        var params = new ListParams();
        params['filter.keyId'] = `$eq:${transferentDestiny}`;
        params['filter.name'] = `$eq:Destino`;
        this.genericService.getAll(params).subscribe({
          next: data => {
            resolve(data.data[0].description);
          },
        });
      } else {
        resolve('');
      }
    });
  }

  getMenaje(id: number) {
    return new Promise((resolve, reject) => {
      this.menageService.getById(id).subscribe({
        next: (resp: any) => {
          if (resp) {
            resolve(resp['noGood']);
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
    this.loader.load = true;
    const file = event.target.files[0];
    const user = this.authService.decodeToken().preferred_username;

    /*const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = () => {
      const result = this.readExcel(fileReader.result);
      if(result === true){
        this.uploadFile(file, this.requestObject.id, user);
      }
    }*/
    this.uploadFile(file, this.requestObject.id, user);
    // this.fileUploaded.nativeElement.value = "";
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      let correcto = true;
      this.data = this.excelService.getData<any>(binaryExcel);
      for (let i = 0; i < this.data.length; i++) {
        const element: any = this.data[i];
        //|| element['FRACCIÓN ARANCELARIA'] === undefined
        if (element['CLAVE ARANCELARIA'] === undefined) {
          this.onLoadToast(
            'error',
            'Carga de archivo',
            'Todos los bienes deben tener una clave arancelaria!'
          );
          correcto = false;
          this.loader.load = false;
          break;
        }
      }
      return correcto;
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
          this.loader.load = false;
          this.fileUploaded.nativeElement.value = '';
          this.closeCreateGoodWIndows();
        },
        error: error => {
          this.loader.load = false;
          this.message(
            'error',
            'Error al subir el file',
            `No se pudo cargar el archivo excel ${error.error.message}`
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
      this.onLoadToast('info', 'Información', `Seleccione uno o mas bienes!`);
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
        'Ya se puede guardar el bien'
      );
    });
  }
  // abrir menaje
  menajeModal() {
    if (this.listgoodObjects.length === 0) {
      this.onLoadToast('info', 'Información', `Seleccione uno o mas bienes!`);
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
            'El domicio se actualizo',
            `Se guardo el domicilio del bien`
          );
          this.refreshTable();
          this.isSaveFraction = false;
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
            'Menaje guardado',
            `Se guardaron los menajes exitosamente`
          );
          this.refreshTable();
          this.isSaveFraction = false;
        }
      }
    });
  }

  saveFractions() {
    this.listGoodsFractions.map(async (item: any, i: number) => {
      let index = i + 1;
      const fractionResult = await this.updateGoods(item);
      if (fractionResult) {
        if (this.listGoodsFractions.length === index) {
          this.message(
            'success',
            'Fracción guardada',
            `Se guardó la fracción exitosamente`
          );
          this.refreshTable();
          this.isSaveFraction = false;
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
            `Error al actualizar los bienes ${error.error.message}`
          );
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
      }).then(result => {
        if (result.isConfirmed) {
          this.deleteMethod();
        }
      });
    } else {
      this.message('info', 'Información', `Seleccione uno o mas bienes`);
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
            `Los bienes se eliminaron correctamente`
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
          }, 600);
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

  message(header: any, title: string, body: string) {
    this.onLoadToast(header, title, body);
  }

  /* Clasificacion Masiva */
  masiveClasification() {
    if (this.listgoodObjects.length === 0) {
      this.onLoadToast('info', 'Información', `Seleccione uno o mas bienes!`);
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

      good.goodDescription = item.goodDescription;
      good.processStatus = item.processStatus;

      for (let i = 0; i < listReverse.length; i++) {
        const fractionsId = listReverse[i];
        good[fractions[i]] = Number(fractionsId);
      }
      this.listGoodsFractions.push(good);
    }
    this.loading = false;
    if (existAddres > 0) {
      this.onLoadToast(
        'info',
        'Bienes sin domicilio',
        'Existen bienes que aun no se les asigno un domicilio!'
      );
    }
    setTimeout(() => {
      this.onLoadToast(
        'success',
        'Proceso Finalizado',
        'Ya se pueden guardar los bien'
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
                  'info',
                  'clasificación de bien nula',
                  'el bien seleccionado no tiene numero de clasificación de bien'
                );
              }
            });
        }
      }
    });
  }

  matchLevelFraction(res: any) {
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
        const fractionCode = fraction.fractionCode.toString();
        if (
          fractionCode.length === 8 &&
          this.fractionProperties['goodClassNumber'] === undefined
        ) {
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
        const fractionCode = fraction.fractionCode.toString();
        if (
          fractionCode.length === 8 &&
          this.fractionProperties['goodClassNumber'] === undefined
        ) {
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
        const fractionCode = fraction.fractionCode.toString();
        if (
          fractionCode.length === 8 &&
          this.fractionProperties['goodClassNumber'] === undefined
        ) {
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
        const fractionCode = fraction.fractionCode.toString();
        if (
          fractionCode.length === 8 &&
          this.fractionProperties['goodClassNumber'] === undefined
        ) {
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
        const fractionCode = fraction.fractionCode.toString();
        if (
          fractionCode.length === 8 &&
          this.fractionProperties['goodClassNumber'] === undefined
        ) {
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
        const fractionCode = fraction.fractionCode.toString();
        if (
          fractionCode.length === 8 &&
          this.fractionProperties['goodClassNumber'] === undefined
        ) {
          const fractionDesc: any = await this.getNoClasifyGood(fractionCode);
          this.fractionProperties['goodClassNumber'] =
            fractionDesc.clasifGoodNumber;
          this.fractionProperties['fractionId'] = fraction.id;
          if (fraction.typeRelevant) {
            this.fractionProperties['goodTypeId'] = fraction.id;
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
}
