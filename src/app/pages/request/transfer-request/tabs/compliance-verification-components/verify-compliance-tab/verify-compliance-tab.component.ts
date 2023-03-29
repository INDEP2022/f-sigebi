import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  verifComplianceForm: ModelForm<any>;
  domicilieObject: IDomicilies;
  transferenceId: number | string = null;
  existArt: number = 0;

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

    this.articleColumns.cumple = {
      ...this.articleColumns.cumple,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.articlesSelected(data);
        });
      },
    };
    this.initForm();

    /* aclaraciones */
    this.clarifySetting.columns = CLARIFICATIONS_COLUMNS;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestObject) {
      this.transferenceId = this.requestObject.transferenceId;
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
      color: [null],
      goodDescription: [null],
      quantity: [1],
      duplicity: ['N'],
      capacity: [null],
      volume: [null],
      fileeNumber: [null],
      useType: [null],
      physicalStatus: [null],
      stateConservation: [null],
      origin: [null],
      goodClassNumber: [null],
      ligieUnit: [null],
      appraisal: [null],
      destiny: [null], //preguntar Destino ligie
      transferentDestiny: [null],
      compliesNorm: [null],
      notesTransferringEntity: [null],
      unitMeasure: [null], // preguntar Unidad Medida Transferente
      saeDestiny: [null],
      brand: [null],
      subBrand: [null],
      armor: [null],
      model: [null],
      doorsNumber: [null],
      axesNumber: [null],
      engineNumber: [null], //numero motor
      tuition: [null],
      serie: [null],
      chassis: [null],
      cabin: [null],
      fitCircular: [null],
      theftReport: [null],
      addressId: [null],
      operationalState: [null],
      manufacturingYear: [null],
      enginesNumber: [null], // numero de motores
      flag: [null],
      openwork: [null],
      sleeve: [null],
      length: [null],
      shipName: [null],
      publicRegistry: [null], //registro public
      ships: [null],
      dgacRegistry: [null], //registro direccion gral de aereonautica civil
      airplaneType: [null],
      caratage: [null], //kilatage
      material: [null],
      weight: [null],
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
      this.alert('warning', 'Error', 'Seleccione solo una aclaracion!');
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
    params['filter.idTransferee'] = `$eq:${this.transferenceId}`;
    params['filter.article'] = `$eq:Articulo 3 Ley`;

    this.verifiCompliance.getAll(params).subscribe({
      next: async resp => {
        await this.getArticlesById(resp, 'article3');
      },
    });
  }

  getArticle1213() {
    const params = new ListParams();
    params['filter.idTransferee'] = `$eq:${this.transferenceId}`;
    params['filter.article'] = `$eq:Articulo 12 y 13 Reglamento`;

    this.verifiCompliance.getAll(params).subscribe({
      next: async resp => {
        await this.getArticlesById(resp, 'article12');
      },
    });
  }

  article3Selected(event: any): void {
    const elemento = event.data;

    const index = this.article3array.indexOf(elemento);
    console.log(index, this.article3array);
    if (index !== -1) {
      delete this.article3array[index];
    } else {
      this.article3array.push(elemento);
    }
    console.log(this.article3array);
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
    this.detailArray.reset();
    this.goodsSelected = event.selected;
    if (this.goodsSelected.length === 1) {
      this.getClarifications(this.goodsSelected[0].id);
      setTimeout(() => {
        this.detailArray.patchValue(this.goodsSelected[0] as IGood);
        this.getDomicilieGood(this.goodsSelected[0].addressId);
      }, 3000);
    }
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
      this.alert('warning', 'Error', 'Seleccione solo una aclaracion!');
      return;
    }

    Swal.fire({
      title: 'Eliminar Aclaración?',
      text: 'Desea eliminar la aclaracion?',
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

    const result = await this.updateGoods();
  }

  updateGoods() {
    return new Promise((resolve, reject) => {
      const goods = this.goodData;
      goods.map((item: any) => {
        let body: any = {};
        body['id'] = item.id;
        body['goodId'] = item.goodId;
        body['descriptionGoodSae'] = item.descriptionGoodSae;
        this.goodServices.update(body).subscribe({
          next: resp => {
            resolve(true);
            console.log(resp);
            this.alert(
              'success',
              'Verificación Guardad',
              'Los datos se guardaron correctamente'
            );
          },
          error: error => {
            console.log(error.error.message);
            this.alert(
              'error',
              'Error al guardar',
              'No se pudieron guardar los datos'
            );
          },
        });
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
