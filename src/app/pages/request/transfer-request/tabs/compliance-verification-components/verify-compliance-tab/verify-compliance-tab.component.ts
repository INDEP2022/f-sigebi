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
    private rejectedGoodService: RejectedGoodService
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
          this.articlesSelected(data);
        });
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestObject) {
      this.getArticle3();
      this.getArticle1213();

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

  getArticle3() {
    const params = new ListParams();
    if (this.transferenceId === 1 || this.transferenceId === 120) {
      params['filter.idTransferee'] = `$eq:${this.transferenceId}`;
    } else {
      params['filter.idTransferee'] = `$null`;
    }
    params['filter.article'] = `$eq:Articulo 3 Ley`;

    this.verifiCompliance.getAll(params).subscribe({
      next: async resp => {
        this.paragraphsTable1 = resp.data;
        //await this.getArticlesById(resp, 'article3');
      },
    });
  }

  getArticle1213() {
    const params = new ListParams();
    if (this.transferenceId === 1 || this.transferenceId === 120) {
      params['filter.idTransferee'] = `$eq:${this.transferenceId}`;
    } else {
      params['filter.idTransferee'] = `$null`;
    }

    params['filter.article'] = `$eq:Articulo 12 y 13 Reglamento`;
    this.verifiCompliance.getAll(params).subscribe({
      next: async resp => {
        this.paragraphsTable2 = resp.data;
        //await this.getArticlesById(resp, 'article12');
      },
    });
  }

  article3Selected(event: any): void {
    const elemento = event.data;

    const index = this.article3array.indexOf(elemento);
    if (index !== -1) {
      delete this.article3array[index];
    } else {
      this.article3array.push(elemento);
    }
  }

  article12y13Selected(event: any): void {
    const elemento = event.data;
    const index = this.article12and13array.indexOf(elemento);

    const index2 = this.paragraphsTable2.indexOf(elemento);
    if (index !== -1) {
      delete this.article12and13array[index];
    } else {
      this.article12and13array.push(elemento);
    }

    if (
      this.paragraphsTable2[index2].cumple &&
      this.paragraphsTable2[index2].cumple === true
    ) {
      this.paragraphsTable2[index2].cumple = false;
    } else if (
      this.paragraphsTable2[index2].cumple &&
      this.paragraphsTable2[index2].cumple === false
    ) {
      this.paragraphsTable2[index2].cumple = true;
    } else {
      this.paragraphsTable2[index2].cumple = true;
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
    console.log(this.isGoodSelected);

    if (this.goodsSelected.length === 1) {
      this.getClarifications(this.goodsSelected[0].id);
      setTimeout(() => {
        this.detailArray.patchValue(this.goodsSelected[0] as IGood);
        this.getDomicilieGood(this.goodsSelected[0].addressId);
        if (this.detailArray.controls['id'].value !== null) {
          this.isGoodSelected = true;
          console.log(this.isGoodSelected);
        }
      }, 2000);
    }
    //} else {
    //this.clarificationData = [];
    //}
  }

  getArticlesById(article: any, typeArt: string) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.requestId'] = `$eq:${this.requestObject.id}`;
      this.requestDocumentService.getAll(params).subscribe({
        next: resp => {
          this.existArt = resp.count;
          resp.data.map((item: any) => {
            for (let i = 0; i < article.data.length; i++) {
              const art = article.data[i];
              if (item.cumplimiento.id === art.complianceId) {
                if (item.fulfill === 'S') {
                  art['cumple'] = true;
                  if (typeArt === 'article3') {
                    this.article3array.push(art);
                  } else {
                    this.article12and13array.push(art);
                  }
                } else {
                  art['cumple'] = false;
                }
                break;
              }
            }
          });

          console.log(article);
          if (typeArt === 'article3') {
            this.paragraphsTable1 = article.data;
          } else {
            this.paragraphsTable2 = article.data;
          }
        },
        error: error => {
          console.log(error.error.message);
          this.existArt = 0;
          if (error.error.message === 'No se encontrarón registros.') {
            for (let i = 0; i < article.data.length; i++) {
              const art = article.data[i];
              art['cumple'] = false;
            }
            if (typeArt === 'article3') {
              this.paragraphsTable1 = article.data;
            } else {
              this.paragraphsTable2 = article.data;
            }
          }
        },
      });
    });
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

    if (this.existArt > 0) {
      const allArt = this.paragraphsTable1.concat(this.paragraphsTable2);
      console.log(allArt);

      allArt.map(async (item: any) => {
        await this.deleteDocumentRequest(item);
      });
    }

    /* insertar articulo 3 */
    this.article3array.map(async (item: any) => {
      await this.createDocRequest(item, 'S');
    });

    /* ingresar articulo 12 , 13 */
    this.paragraphsTable2.map(async (list: any, i: number) => {
      if (list.cumple === true) {
        await this.createDocRequest(list, 'S');
      } else if (list.cumple === false) {
        await this.createDocRequest(list, 'N');
      } else {
        await this.createDocRequest(list, 'N');
      }
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

  createDocRequest(article: any, fullfill: string) {
    return new Promise((resolve, reject) => {
      const user: any = this.authService.decodeToken();
      let body: any = {};
      body['requestId'] = this.requestObject.id;
      body['fulfillmentId'] = article.complianceId;
      body['fulfill'] = fullfill;
      body['creationUser'] = user.username;
      this.requestDocumentService.create(body).subscribe({
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

  deleteDocumentRequest(item: any) {
    return new Promise((resolve, reject) => {
      const body = {
        requestId: this.requestObject.id,
        fulfillmentId: item.complianceId,
      };
      this.requestDocumentService.remove(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: error => {
          console.log(error);
          resolve(true);
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
