import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IFormGroup, ModelForm } from 'src/app/core/interfaces/model-form';
import { IDomicilies } from 'src/app/core/models/good/good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ClarificationService } from 'src/app/core/services/catalogs/clarification.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodDomiciliesService } from 'src/app/core/services/good/good-domicilies.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
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
  verifComplianceForm: ModelForm<any>;
  domicilieObject: IDomicilies;
  transferenceId: number | string = null;
  existArt: number = 0;
  isGoodSelected: boolean = false;

  goodSettings = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
  //paragraphsEstate = new BehaviorSubject<FilterParams>(new FilterParams());
  goodData: any = [];
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

  /* aclaraciones */
  clarifySetting = { ...TABLE_SETTINGS, actions: false, selectMode: 'multi' };
  clarificationData: any = [];
  clarifyRowSelected: any = [];

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
    private requestHelperService: RequestHelperService
  ) {
    super();
  }

  ngOnInit(): void {
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
    this.initForm();

    this.articleColumns.cumple = {
      ...this.articleColumns.cumple,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          console.log('data', data);

          this.articlesSelected(data);
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
      descriptionGoodSae: [null],
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
    let docClarification = event;
    let config: ModalOptions = {
      initialState: {
        docClarification: docClarification,
        goodTransfer: this.goodsSelected[0],
        callback: (next: boolean) => {
          this.clarificationData = [];
          if (next) this.getClarifications(this.goodsSelected[0].id);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalservice.show(ClarificationFormTabComponent, config);
  }

  setDescriptionGoodSae(data: any) {
    this.goodData.map((item: any) => {
      if (item.id === data.data.id) {
        item.descriptionGoodSae = data.text;
      }
    });
  }

  getData() {
    this.loading = true;
    this.params.value.addFilter('requestId', this.requestObject.id);
    const filter = this.params.getValue().getParams();
    this.goodServices.getAll(filter).subscribe({
      next: resp => {
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
        });

        Promise.all(result).then(data => {
          this.goodData = resp.data;
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
            resolve(resp.data[0].description);
          },
        });
      } else {
        resolve(null);
      }
    });
  }

  getDomicilieGood(id: number) {
    this.goodDomicilieService.getById(id).subscribe({
      next: resp => {
        this.domicilieObject = resp as IDomicilies;
      },
    });
  }

  getArticle3(id: number, transferent: number) {
    const params = new ListParams();
    params['filter.requestId'] = `$eq:${id}`;
    params['filter.cumpliance.article'] = `$eq:Articulo 3 Ley`;
    if (this.transferenceId === 1 || this.transferenceId === 120) {
      params['filter.cumpliance.transfereeId'] = `$eq:${transferent}`;
    } else {
      params['filter.cumpliance.transfereeId'] = `$null`;
    }

    this.requestDocumentService.getAll(params).subscribe({
      next: resp => {
        let cumpliance = resp.data.map((item: any) => {
          item.cumpliance['cumple'] = item.fulfill === 'N' ? false : true;
          if (item.cumpliance['cumple'] === true) {
            this.article3array.push(item.cumpliance);
          }
          return item.cumpliance;
        });
        this.paragraphsTable1 = cumpliance;
      },
    });
  }

  getArticle1213(id: number, tranferent: number) {
    const params = new ListParams();
    params['filter.requestId'] = `$eq:${id}`;
    params['filter.cumpliance.article'] = `$eq:Articulo 12 y 13 Reglamento`;
    if (this.transferenceId === 1 || this.transferenceId === 120) {
      params['filter.cumpliance.transfereeId'] = `$eq:${tranferent}`;
    } else {
      params['filter.cumpliance.transfereeId'] = `$null`;
    }

    this.requestDocumentService.getAll(params).subscribe({
      next: resp => {
        let cumpliance = resp.data.map((item: any) => {
          item.cumpliance['cumple'] = item.fulfill === 'N' ? false : true;
          if (item.cumpliance['cumple'] === true) {
            this.article12and13array.push(item.cumpliance);
          }
          return item.cumpliance;
        });
        this.paragraphsTable2 = cumpliance;
      },
    });
  }

  article3Selected(event: any): void {
    let element = event.data;
    const index = this.article3array.indexOf(element);
    if (index === -1) {
      element.cumple = true;
      this.article3array.push(element);
    } else {
      delete this.article3array[index];
    }
  }

  article12y13Selected(event: any): void {
    let element = event.data;
    const index = this.paragraphsTable2.indexOf(element);

    if (this.paragraphsTable2[index].cumple === false) {
      this.paragraphsTable2[index].cumple = true;
    } else {
      this.paragraphsTable2[index].cumple = false;
    }

    const index2 = this.article12and13array.indexOf(element);
    if (index2 === -1) {
      element.cumple = true;
      this.article12and13array.push(element);
    } else {
      delete this.article12and13array[index];
    }
  }

  articlesSelected(data: any) {
    //console.log(data);
  }

  selectGood(event: any) {
    //if (event.isSelected === true) {
    this.clarificationData = [];
    this.detailArray.reset();
    this.goodsSelected = event.selected;

    if (this.goodsSelected.length === 1) {
      this.getClarifications(this.goodsSelected[0].id);
      setTimeout(() => {
        this.detailArray.patchValue(this.goodsSelected[0] as IGood);
        this.getDomicilieGood(this.goodsSelected[0].addressId);
        if (this.detailArray.controls['id'].value !== null) {
          this.isGoodSelected = true;
        }
      }, 2000);
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
        });
      },
      error: error => {},
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

  deleteClarification() {
    if (this.clarifyRowSelected.length !== 1) {
      this.alert('warning', 'Error', '¡Seleccione solo una aclaración!');
      return;
    }
    this.loader.load = true;
    Swal.fire({
      title: 'Eliminar Aclaración?',
      text: '¿Desea eliminar la aclaración?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#B38E5D',
      confirmButtonText: 'Eliminar',
    }).then(result => {
      if (result.isConfirmed) {
        const id = this.clarifyRowSelected[0].rejectNotificationId;
        this.rejectedGoodService.remove(id).subscribe({
          next: resp => {
            this.alert('success', 'Eliminado', 'La aclaración fue eliminada');
            this.clarificationData = [];
            this.getClarifications(this.goodsSelected[0].id);
          },
        });
      }
    });
  }

  async confirm() {
    if (this.article3array.length < 3 || this.article12and13array.length < 3) {
      this.alert(
        'error',
        'Error',
        'Para que la solicitud sea procedente se deben seleccionar al menos los prmeros 3 cumplimientos del Articulo 3 Ley y 3 del Articulo 12'
      );
      return;
    }

    console.log(this.paragraphsTable2);

    const articles = this.paragraphsTable2.concat(this.article3array);
    const id = this.requestObject.id;
    articles.map(async (item: any) => {
      await this.updateDocRequest(id, item);
    });

    this.goodData.map(async (item: any, i: number) => {
      let index = i + 1;
      const result = await this.updateGoods(item);

      if (this.goodData.length === index) {
        this.onLoadToast(
          'success',
          'Verificación Guardada',
          'Los datos se guardaron correctamente'
        );
      }
    });
  }

  updateGoods(item: any) {
    return new Promise((resolve, reject) => {
      let body: any = {};
      body['id'] = item.id;
      body['goodId'] = item.goodId;
      body['descriptionGoodSae'] = item.descriptionGoodSae;

      this.goodServices.update(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          console.log(error.error.message);
          this.alert(
            'error',
            'Error al guardar',
            'No se pudieron guardar los datos'
          );
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

  msgModal(btnTitle: string, message: string, title: string, typeMsg: any) {
    this.alertQuestion(typeMsg, title, message, btnTitle).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
