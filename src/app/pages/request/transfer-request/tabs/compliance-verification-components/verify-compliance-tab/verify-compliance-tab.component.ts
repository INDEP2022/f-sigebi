import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IFormGroup, ModelForm } from 'src/app/core/interfaces/model-form';
import { IDomicilies } from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ClarificationService } from 'src/app/core/services/catalogs/clarification.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GetGoodResVeService } from 'src/app/core/services/ms-rejected-good/goods-res-dev.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { RequestDocumentationService } from 'src/app/core/services/requests/request-documentation.service';
import { VerificationComplianceService } from 'src/app/core/services/requests/verification-compliance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { RequestHelperService } from 'src/app/pages/request/request-helper-services/request-helper.service';
import Swal from 'sweetalert2';
import { ClarificationFormTabComponent } from '../../classify-assets-components/classify-assets-child-tabs-components/clarification-form-tab/clarification-form-tab.component';
import { CLARIFICATIONS_COLUMNS } from './clarifications-columns';
import { DETAIL_ESTATE_COLUMNS } from './detail-estates-columns';
import { VERIRY_COMPLIANCE_COLUMNS } from './verify-compliance-columns';

@Component({
  selector: 'app-verify-compliance-tab',
  templateUrl: './verify-compliance-tab.component.html',
  styleUrls: ['./verify-compliance-tab.component.scss'],
})
export class VerifyComplianceTabComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() requestObject: any;
  @Input() typeDoc: string = '';
  @Input() process: string = '';
  @Input() question: boolean = false;
  @Output() response = new EventEmitter<string>();

  bsModalRef: BsModalRef;
  verifComplianceForm: ModelForm<any>;
  domicilieObject: IDomicilies;
  transferenceId: number | string = null;
  existArt: number = 0;
  isGoodSelected: boolean = false;

  goodSettings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
  //paragraphsEstate = new BehaviorSubject<FilterParams>(new FilterParams());
  goodData = new LocalDataSource();
  //detallesBienes: IDetailEstate[] = [];
  columns = DETAIL_ESTATE_COLUMNS;
  articleColumns = VERIRY_COMPLIANCE_COLUMNS;

  paragraphsTable1: any[] = [];
  paragraphsTable2: any[] = [];

  params = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;

  detailArray: IFormGroup<IGood>;
  article3array: Array<any> = new Array<any>();
  article12and13array: Array<any> = new Array<any>();
  goodsSelected: any = [];
  checkboxReadOnly: boolean = false;
  formLoading: boolean = false;
  loadingClarification: boolean = false;

  /* aclaraciones */
  clarifySetting = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
  clarificationData: any = [];
  clarifyRowSelected: any = [];
  confirmation: boolean = false;
  task: any;
  statusTask: any = '';
  showClarificationButtons: boolean = true;

  constructor(
    private fb: FormBuilder,
    private goodServices: GoodService,
    private typeRelevantService: TypeRelevantService,
    private genericService: GenericService,
    private goodDomicilieService: GoodDomiciliesService,
    private bsModalservice: BsModalService,
    private verifiCompliance: VerificationComplianceService,
    private requestDocumentService: RequestDocumentationService,
    private authService: AuthService,
    private clarificationService: ClarificationService,
    private rejectedGoodService: RejectedGoodService,
    private requestHelperService: RequestHelperService,
    private goodResDevService: GetGoodResVeService,
    private goodsQueryService: GoodsQueryService,
    private chatClarificationService: ChatClarificationsService
  ) {
    super();
  }

  ngOnInit(): void {
    // DISABLED BUTTON - FINALIZED //
    this.task = JSON.parse(localStorage.getItem('Task'));
    this.statusTask = this.task.status;

    /* aclaraciones */
    this.clarifySetting.columns = CLARIFICATIONS_COLUMNS;

    this.settings = { ...TABLE_SETTINGS, actions: false };
    this.settings.columns = VERIRY_COMPLIANCE_COLUMNS;
    this.goodSettings.columns = DETAIL_ESTATE_COLUMNS;

    this.columns.descriptionGoodSae = {
      ...this.columns.descriptionGoodSae,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setDescriptionGoodSae(data);
        });
      },
    };

    this.columns.unitMeasureName = {
      ...this.columns.unitMeasureName,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setUnitTransferent(data);
        });
      },
    };

    this.initForm();

    this.articleColumns.cumple = {
      ...this.articleColumns.cumple,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.articlesSelected(data);
        });
      },
    };

    this.articleColumns.fulfill = {
      ...this.articleColumns.fulfill,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          //console.log('data', data);
        });
      },
    };

    /* Cambia el estado a readonly los checkboxs y el textarea de las tablas */
    if (this.typeDoc === 'approval-process') {
      this.checkboxReadOnly = true;
      this.requestHelperService.changeReadOnly(this.checkboxReadOnly);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestObject) {
      const id = this.requestObject.id;
      const transference = this.requestObject.transferenceId;
      this.getArticle3(id, transference);
      this.getArticle1213(id, transference);

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getData());
    }

    if (changes['question'].currentValue === true) {
      const article3 = this.article3array.filter(x => x.cumple === true);
      const article12 = this.article12and13array.filter(x => x.cumple === true);
      //console.log(article3, article12);
      /* verifica si tiene articulos seleccionados */
      if (article3.length >= 3 && article12.length >= 3) {
        /* verifica si ya el fomulario guardado */
        if (this.confirmation === true) {
          this.response.emit('turnar');
        } else {
          this.response.emit('sin guardar');
        }
      } else {
        this.response.emit('sin articulos');
      }
    }
  }

  initForm() {
    this.detailArray = this.fb.group({
      id: [null],
      goodId: [null],
      ligieSection: [null],
      ligieChapter: [null],
      ligieLevel1: [null],
      ligieLevel2: [null],
      ligieLevel3: [null],
      ligieLevel4: [null],
      requestId: [null],
      goodTypeId: [null],
      color: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(50)],
      ],
      goodDescription: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      quantity: [
        1,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(13),
        ],
      ],
      duplicity: [
        'N',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      ],
      capacity: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      volume: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      fileeNumber: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1250)],
      ],
      useType: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      physicalStatus: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(30)],
      ],
      stateConservation: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(30)],
      ],
      origin: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      goodClassNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieUnit: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      appraisal: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      ],
      destiny: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]], //preguntar Destino ligie
      transferentDestiny: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      compliesNorm: [
        null,
        [Validators.pattern(STRING_PATTERN), , Validators.maxLength(1)],
      ],
      notesTransferringEntity: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1500)],
      ],
      unitMeasure: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ], // preguntar Unidad Medida Transferente
      saeDestiny: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      brand: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      subBrand: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(350),
        ],
      ],
      armor: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      model: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      doorsNumber: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
      axesNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(5),
        ],
      ],
      engineNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ], //numero motor
      tuition: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      serie: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      chassis: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      cabin: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(5)],
      ],
      fitCircular: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      theftReport: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      addressId: [null, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      operationalState: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      manufacturingYear: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      enginesNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(5),
        ],
      ], // numero de motores
      flag: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(5),
        ],
      ],
      openwork: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      sleeve: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      length: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      shipName: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      publicRegistry: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ], //registro public
      ships: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      dgacRegistry: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ], //registro direccion gral de aereonautica civil
      airplaneType: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      caratage: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ], //kilatage
      material: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(80)],
      ],
      weight: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      fractionId: [null],
      descriptionGoodSae: [null],
      uniqueKey: [null],
      duplicatedGood: [null],
    });
  }

  clarificationSelected(event: any) {
    this.clarifyRowSelected = event.selected;
  }

  newClarification() {
    if (this.goodsSelected.length === 0) {
      this.alert('warning', 'Error', 'Debes seleccionar al menos un bien!');
    } else {
      this.openForm();
    }
  }

  editForm() {
    if (this.clarifyRowSelected.length === 1) {
      let clarify = this.clarifyRowSelected;
      delete clarify[0].clarificationName;
      this.openForm(clarify[0]);
    } else {
      this.alert('warning', 'Error', 'Seleccione solo una aclaración!');
    }
  }

  openForm(event?: any): void {
    //Modal para abrir formulario para crear Clarifications
    let docClarification = event;
    let config: ModalOptions = {
      initialState: {
        docClarification: docClarification,
        goodTransfer: this.goodsSelected[0],
        request: this.requestObject,
        callback: (next: boolean) => {
          this.clarificationData = [];
          if (next) {
            this.loadingClarification = true;
            this.getClarifications(this.goodsSelected[0].id);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    //this.bsModalRef =
    this.bsModalservice.show(ClarificationFormTabComponent, config);
    /* this.bsModalRef.content.event.subscribe((res: any) => {
    }); */
  }

  setDescriptionGoodSae(descriptionInput: any) {
    this.goodData['data'].map((item: any) => {
      if (item.id === descriptionInput.data.id) {
        item.descriptionGoodSae = descriptionInput.text;
      }
    });
    /*this.goodData.getElements().then(data => {
      data.map((item: any) => {
        if (item.id === descriptionInput.data.id) {
          item.descriptionGoodSae = descriptionInput.text;
        }
        this.goodData.load(data)
      });
    });*/
  }

  getData() {
    this.loading = true;
    this.params.value.addFilter('requestId', this.requestObject.id);
    this.params.value.addFilter(
      'processStatus',
      'VERIFICAR_CUMPLIMIENTO,SOLICITAR_ACLARACION',
      SearchFilter.IN
    );
    const filter = this.params.getValue().getParams();
    this.goodServices.getAll(filter).subscribe({
      next: resp => {
        /*let goods = resp.data.filter(x =>  
          x.processStatus == 'VERIFICAR_CUMPLIMIENTO' || x.processStatus == 'SOLICITAR_ACLARACION'
        );*/

        var result = resp.data.map(async (item: any) => {
          const goodTypeName = await this.getTypeGood(item.goodTypeId);
          item['goodTypeName'] = goodTypeName;

          const physicalStatus = await this.getByTheirStatus(
            item.physicalStatus,
            'Estado Fisico'
          );
          item['physicstateName'] = physicalStatus;

          const stateConservation = await this.getByTheirStatus(
            item.stateConservation,
            'Estado Conservacion'
          );
          item['stateConservationName'] = stateConservation;

          const transferentDestiny = await this.getByTheirStatus(
            item.transferentDestiny,
            'Destino'
          );
          item['transferentDestinyName'] = transferentDestiny;

          const destiny = await this.getByTheirStatus(item.destiny, 'Destino');
          item['destinyName'] = destiny;

          const unitMeasureName = await this.getTransferentUnit(
            item.unitMeasure
          );
          item['unitMeasureName'] = unitMeasureName;
        });

        Promise.all(result).then(data => {
          this.goodData.load(resp.data); //load  new LocalDataSource()
          this.totalItems = resp.count;
          this.loading = false;
        });
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  getTypeGood(id: number) {
    return new Promise((resolve, reject) => {
      if (id) {
        this.typeRelevantService.getById(id).subscribe({
          next: resp => {
            resolve(resp.description);
          },
        });
      } else {
        resolve(null);
      }
    });
  }

  getByTheirStatus(id: number | string, typeName: string) {
    return new Promise((resolve, reject) => {
      if (id) {
        var params = new ListParams();
        params['filter.name'] = `$eq:${typeName}`;
        params['filter.keyId'] = `$eq:${id}`;
        this.genericService.getAll(params).subscribe({
          next: resp => {
            resolve(resp.data.length > 0 ? resp.data[0].description : '');
          },
        });
      } else {
        resolve(null);
      }
    });
  }

  getTransferentUnit(id: string) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.uomCode'] = `$eq:${id}`;
      this.goodsQueryService
        .getCatMeasureUnitView(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: resp => {
            resolve(resp.data[0].measureTlUnit);
          },
          error: erro => {
            resolve('');
          },
        });
    });
  }

  getDomicilieGood(id: number) {
    this.goodDomicilieService.getById(id).subscribe({
      next: resp => {
        this.domicilieObject = resp as IDomicilies;
      },
    });
  }

  setUnitTransferent(unitData: any) {
    this.goodData.getElements().then(data => {
      data.map((item: any) => {
        if (item.id === unitData.id) {
          item['unitMeasureName'] = unitData.unitDesc;
          item['unitMeasure'] = unitData.unitId;
        }
      });
      this.goodData.load(data);
    });
  }

  getArticle3(id: number, transferentId: number) {
    let param = new FilterParams();
    param.addFilter('requestId', id);
    param.addFilter('cumpliance.article', 'Articulo 3 Ley');
    if (Number(transferentId) === 1 || Number(transferentId) === 120) {
      param.addFilter('cumpliance.transfereeId', transferentId);
    } else {
      param.addFilter('cumpliance.transfereeId', '', SearchFilter.NULL);
    }
    param.limit = 30;
    let filter = param.getParams();
    this.requestDocumentService.getAll(filter).subscribe({
      next: resp => {
        let cumpliance = resp.data.map((item: any) => {
          item.cumpliance['cumple'] = item.fulfill === 'N' ? false : true;
          if (item.cumpliance['cumple'] === true) {
            this.article3array.push(item.cumpliance);
          }
          return item.cumpliance;
        });
        this.paragraphsTable1 = cumpliance;
        this.article3array = this.paragraphsTable1;
        const artLenth = this.article3array.filter(x => x.cumple === true);
        if (artLenth.length) {
          this.confirmation = true;
        }
      },
    });
  }

  getArticle1213(id: number, transferentId: number) {
    let param = new FilterParams();
    param.addFilter('requestId', id);
    param.addFilter('cumpliance.article', 'Articulo 12 y 13 Reglamento');
    if (Number(transferentId) === 1 || Number(transferentId) === 120) {
      param.addFilter('cumpliance.transfereeId', transferentId);
    } else {
      param.addFilter('cumpliance.transfereeId', '', SearchFilter.NULL);
    }
    param.limit = 30;
    let filter = param.getParams();
    this.requestDocumentService.getAll(filter).subscribe({
      next: resp => {
        let cumpliance = resp.data.map((item: any) => {
          item.cumpliance['cumple'] = item.fulfill === 'N' ? false : true;
          if (item.cumpliance['cumple'] === true) {
            this.article12and13array.push(item.cumpliance);
          }
          return item.cumpliance;
        });
        this.paragraphsTable2 = cumpliance;
        this.article12and13array = this.paragraphsTable2;
        const artLenth = this.article12and13array.filter(
          x => x.cumple === true
        );
        if (artLenth.length) {
          this.confirmation = true;
        }
      },
    });
  }

  article3Selected(event: any): void {}

  article12y13Selected(event: any): void {}

  articlesSelected(element: any) {
    if (element.article === 'Articulo 12 y 13 Reglamento') {
      const index = this.article12and13array.indexOf(element);
      if (this.article12and13array[index].cumple === false) {
        this.article12and13array[index].cumple = true;
      } else {
        this.article12and13array[index].cumple = false;
      }
    } else if (element.article === 'Articulo 3 Ley') {
      const index = this.article3array.indexOf(element);
      if (this.article3array[index].cumple === false) {
        this.article3array[index].cumple = true;
      } else {
        this.article3array[index].cumple = false;
      }
    }
  }

  selectGood(event: any) {
    //if (event.isSelected === true) {
    this.formLoading = true;

    this.clarificationData = [];
    this.detailArray.reset();
    this.goodsSelected = event.selected;

    if (this.goodsSelected.length === 1) {
      //verifica si el bien ya fue aclarado para desabilitar
      this.showClarificationButtons =
        this.goodsSelected[0].goodStatus == 'ACLARADO' ? false : true;
      this.loadingClarification = true;
      this.getClarifications(this.goodsSelected[0].id);
      setTimeout(() => {
        this.goodsSelected[0].quantity = Number(this.goodsSelected[0].quantity);
        this.detailArray.patchValue(this.goodsSelected[0] as IGood);
        this.getDomicilieGood(this.goodsSelected[0].addressId);
        if (this.detailArray.controls['id'].value !== null) {
          this.isGoodSelected = true;
        }
        this.formLoading = false;
      }, 1000);

      //console.log("Información de domicilio ",);
    } else {
      this.clarificationData = [];
      this.isGoodSelected = false;
      this.detailArray.reset();
      this.formLoading = false;
    }
  }

  /*  Metodo para traer las solicitudes de un bien  */
  getClarifications(id: number | string) {
    this.clarificationData = [];
    let params = new ListParams();
    params['filter.goodId'] = `$eq:${id}`;
    this.rejectedGoodService.getAllFilter(params).subscribe({
      next: async resp => {
        const clarification = resp.data.map(async (item: any) => {
          const clarifi = await this.getCatClarification(item.clarificationId);
          item['clarificationName'] = clarifi;
        });

        Promise.all(clarification).then(data => {
          this.clarificationData = resp.data;
          this.loadingClarification = false;
        });
      },
      error: error => {
        this.loadingClarification = false;
        /*this.onLoadToast(
          'error',
          'error',
          'No se pudo cargar la clarificación'
        );*/
      },
    });
  }

  /* Metodo para traer las aclaraciones */
  getCatClarification(id: number | string) {
    return new Promise((resolve, reject) => {
      let params = new ListParams();
      params['filter.id'] = `$eq:${id}`;
      this.clarificationService.getAll(params).subscribe({
        next: resp => {
          resolve(resp.data[0].clarification);
        },
        error: error => {
          console.log(error.error.message);
          resolve('');
        },
      });
    });
  }

  async deleteClarification() {
    if (this.clarifyRowSelected.length !== 1) {
      this.alert('warning', 'Error', '¡Seleccione solo una aclaración!');
      return;
    }
    const clarifycationLength = this.clarificationData.length;
    Swal.fire({
      title: 'Eliminar Aclaración?',
      text: '¿Desea eliminar la aclaración?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#B38E5D',
      confirmButtonText: 'Eliminar',
    }).then(async result => {
      if (result.isConfirmed) {
        this.loader.load = true;
        //eliminar el chat clarification
        const idChatClarification =
          this.clarifyRowSelected[0].chatClarification.idClarification;
        const result = await this.removeChatClarification(idChatClarification);
        //elimina la aclaracion
        const id = this.clarifyRowSelected[0].rejectNotificationId;
        this.rejectedGoodService.remove(id).subscribe({
          next: async resp => {
            this.alert('success', 'Eliminado', 'La aclaración fue eliminada');
            this.clarificationData = [];
            this.getClarifications(this.goodsSelected[0].id);
            this.loader.load = false;
            //actualizar el good-res-dev
            if (clarifycationLength === 1) {
              const goodResDev: any = await this.getGoodResDev(
                this.goodsSelected[0].id
              );
              await this.removeDevGood(Number(goodResDev));
              let body: any = {};
              body['id'] = this.goodsSelected[0].id;
              body['goodId'] = this.goodsSelected[0].goodId;
              body.processStatus = 'REGISTRO_SOLICITUD';
              body.goodStatus = 'REGISTRO_SOLICITUD';
              await this.updateGoods(body);
            }
          },
          error: error => {
            this.loader.load = false;
            console.log(error);
            this.alert(
              'error',
              'Error',
              `Error al eliminar ${error.error.message}`
            );
          },
        });
      }
    });
  }

  async confirm() {
    this.loader.load = false;
    const article3 = this.article3array.filter(x => x.cumple === true);
    const article12Y13 = this.article12and13array.filter(
      x => x.cumple === true
    );

    if (article3.length < 3 || article12Y13.length < 3) {
      this.alert(
        'error',
        'Error',
        'Es requerido seleccionar 3 cumplimientos del Articulo 3 Ley y 3 del Articulo 12'
      );
      return;
    }

    const articles = this.article12and13array.concat(this.article3array);

    const id = this.requestObject.id;
    articles.map(async (item: any) => {
      await this.updateDocRequest(id, item);
    });

    const good = this.goodData['data'];
    setTimeout(() => {
      good.map(async (item: any, i: number) => {
        let index = i + 1;

        let body: any = {};
        body['id'] = item.id;
        body['goodId'] = item.goodId;
        body['descriptionGoodSae'] = item.descriptionGoodSae;
        body['unitMeasure'] = item.unitMeasure ? item.unitMeasure : null;
        const result = await this.updateGoods(body);

        if (result === true) {
          if (good.length === index) {
            this.onLoadToast(
              'success',
              'Verificación Guardada',
              'Los datos se guardaron correctamente'
            );
            this.confirmation = true;
          }
        }
      });
    }, 400);
  }

  updateGoods(body: any) {
    return new Promise((resolve, reject) => {
      this.goodServices.update(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          console.log(error.error.message);
          this.alert('error', 'Error al actualizar', 'No actualizar el bien');
          reject(false);
        },
      });
    });
  }

  updateDocRequest(requestId: number, article: any) {
    return new Promise((resolve, reject) => {
      const user: any = this.authService.decodeToken();
      let body: any = {};
      body['requestId'] = requestId;
      body['fulfillmentId'] = article.id;
      body['fulfill'] = article.cumple === true ? 'S' : 'N';
      this.requestDocumentService.update(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          reject(false);
          console.log(error.error.message);
          this.alert(
            'error',
            'Error al guardar',
            'No se pudieron guardar los datos'
          );
        },
      });
    });
  }

  removeDevGood(id: number) {
    return new Promise((resolve, reject) => {
      this.goodResDevService.remove(id).subscribe({
        next: resp => {
          console.log('good-res-dev removed', resp);
          resolve(true);
        },
        error: error => {
          console.log('good-res-dev remove error', error);
          this.onLoadToast(
            'error',
            'Error interno',
            'No se pudo eliminar el bien-res-deb'
          );
        },
      });
    });
  }

  removeChatClarification(id: number | string) {
    return new Promise((resolve, reject) => {
      this.chatClarificationService.remove(id).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          this.loader.load = false;
          reject(false);
          console.log(error);
          this.onLoadToast(
            'error',
            'Error al eliminar',
            'No se pudo eliminar el registro de la tabla Chat Aclaraciones'
          );
        },
      });
    });
  }

  getGoodResDev(goodId: number) {
    return new Promise((resolve, reject) => {
      let params = new FilterParams();
      params.addFilter('goodId', goodId);
      let filter = params.getParams();
      this.goodResDevService.getAllGoodResDev(filter).subscribe({
        next: (resp: any) => {
          if (resp.data) {
            resolve(resp.data[0].goodresdevId);
          }
        },
        error: error => {
          this.onLoadToast(
            'error',
            'Error interno',
            'No se pudo obtener el bien-res-dev'
          );
        },
      });
    });
  }

  msgModal(btnTitle: string, message: string, title: string, typeMsg: any) {
    this.alertQuestion(typeMsg, title, message, btnTitle).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
