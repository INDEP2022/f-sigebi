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
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ClarificationService } from 'src/app/core/services/catalogs/clarification.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GetGoodResVeService } from 'src/app/core/services/ms-rejected-good/goods-res-dev.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  NUMBERS_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ClarificationFormTabComponent } from '../../classify-assets-components/classify-assets-child-tabs-components/clarification-form-tab/clarification-form-tab.component';
import { ASSETS_COLUMNS } from './assets-columns';
import { CLARIFICATION_COLUMNS } from './clarifications-columns';

@Component({
  selector: 'app-clarifications',
  templateUrl: './clarifications.component.html',
  styles: [],
})
export class ClarificationsComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() requestObject: any;
  @Input() process: string = '';
  @Input() question: boolean = false;
  goodForm: ModelForm<IGood>;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  @Output() response = new EventEmitter<string>();
  paragraphs: any[] = [];
  goodSetting: any;
  assetsArray: any[] = [];
  assetsSelected: any[] = [];
  //dataSelected: any[] = [];
  // clarifiArray: any[] = [];
  clariArraySelected: any[] = [];
  rowSelected: any;
  detailArray: any;
  typeDoc: string = 'clarification';
  good: any;
  totalItems: number = 0;

  domicilieObject: any;
  articleColumns = CLARIFICATION_COLUMNS;
  haveNotification: boolean = false;
  isLoadingTable2 = false;
  task: any;
  statusTask: any = '';

  constructor(
    private modalService: BsModalService,
    private readonly fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly clarificationService: ClarificationService,
    private readonly rejectGoodService: RejectedGoodService,
    private readonly typeRelevantService: TypeRelevantService,
    private readonly genericService: GenericService,
    private readonly goodResDevService: GetGoodResVeService,
    private readonly chatClarificationService: ChatClarificationsService
  ) {
    super();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (this.requestObject) {
      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
        this.getData();
      });
    }
  }

  ngOnInit(): void {
    this.task = JSON.parse(localStorage.getItem('Task'));
    console.log('task', this.task);

    // DISABLED BUTTON - FINALIZED //
    this.statusTask = this.task.status;
    console.log('statustask', this.statusTask);

    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: CLARIFICATION_COLUMNS,
    };

    this.goodSetting = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: ASSETS_COLUMNS,
    };

    this.prepareForm();
  }
  private prepareForm() {
    this.goodForm = this.fb.group({
      id: [null],
      goodId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieSection: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieChapter: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel1: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel2: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel3: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      ligieLevel4: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      requestId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      goodTypeId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
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
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
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
        'N',
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1)],
      ], //cumple norma
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
          Validators.maxLength(300),
        ],
      ],
      armor: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      model: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(300),
        ],
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
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
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
        'N',
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      theftReport: [
        'N',
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(1),
        ],
      ],
      addressId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
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
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ], //kilatage
      material: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      weight: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      fractionId: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });
  }

  getData() {
    this.loading = true;
    this.params.value.addFilter('requestId', this.requestObject.id);
    this.params.value.addFilter(
      'processStatus',
      'DESTINO_DOCUMENTAL,SOLICITAR_ACLARACION',
      SearchFilter.IN
    );
    const filter = this.params.getValue().getParams();
    this.goodService.getAll(filter).subscribe({
      next: resp => {
        let result = resp.data.map(async (item: any) => {
          const goodTypeName = await this.getTypeGood(item.goodTypeId);
          item['goodTypeName'] = goodTypeName;

          item['fraction'] = item.fractionId ? item.fractionId.description : '';

          item['quantity'] = Number(item.quantity);

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
          this.assetsArray = resp.data;
          this.loading = false;
          this.totalItems = resp.count;
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

  selectGoods(event: any) {
    if (event.selected.length === 1) {
      this.good = event.data;
      this.goodForm.reset();
      console.log(...this.good);
      this.goodForm.patchValue({ ...this.good });
      this.rowSelected = this.good;

      this.getClarifications();
    } else {
      this.rowSelected = null;
      this.paragraphs = [];
    }
  }

  getClarifications() {
    this.paragraphs = [];
    this.isLoadingTable2 = true;
    const params = new ListParams();
    params['filter.goodId'] = `$eq:${this.good.id}`;

    this.rejectGoodService.getAllFilter(params).subscribe({
      next: resp => {
        console.log(resp.data);

        const clarification = resp.data.map(async (item: any) => {
          const clarifi = await this.getCatClarification(item.clarificationId);
          item['clarificationName'] = clarifi;
        });

        Promise.all(clarification).then(data => {
          this.paragraphs = resp.data;
          this.isLoadingTable2 = false;
        });
      },
      error: error => {
        this.isLoadingTable2 = false;
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

  clicked(event: any) {
    this.goodForm.reset();
    console.log(...event);
    this.goodForm.patchValue({ ...event });
    this.rowSelected = event;
  }

  selectAll(event?: any) {
    this.assetsSelected = [];
    if (event.target.checked) {
      this.assetsArray.forEach(x => {
        x.checked = event.target.checked;
        this.assetsSelected.push(x);
      });
    } else {
      this.assetsArray.forEach(x => {
        x.checked = event.target.checked;
        this.assetsSelected = [];
      });
    }
    console.log(this.assetsSelected);
  }

  /*   selectOne(event: any) {
    if (event.target.checked == true) {
      this.assetsSelected.push(
        this.assetsArray.find(x => x.id == event.target.value)
      );
      console.log(event.target.value);
      this.getClarifications();
    } else {
      let index = this.assetsSelected.indexOf(
        this.assetsArray.find(x => x.id == event.target.value)
      );
      this.assetsSelected.splice(index, 1);
    }
    console.log(this.assetsSelected);
  } */

  clarifiRowSelected(event: any) {
    this.clariArraySelected = event.selected;
  }

  newClarification() {
    let data = this.clariArraySelected[0];
    if (data === 0) {
      this.onLoadToast('info', 'Información', `Seleccione uno o mas bienes!`);
      return;
    }
    this.openForm();
  }

  deleteClarification() {
    let data = this.clariArraySelected[0];
    if (data === 0) {
      this.onLoadToast('info', 'Información', `Seleccione uno o mas bienes!`);
      return;
    }

    const clarifycationLength = this.paragraphs.length;
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar el registro?'
    ).then(async val => {
      if (val.isConfirmed) {
        const idChatClarification = data.chatClarification.idClarification;
        const result = await this.removeChatClarification(idChatClarification);

        this.rejectGoodService.remove(data.rejectNotificationId).subscribe({
          next: async val => {
            this.onLoadToast(
              'success',
              'Eliminada con exito',
              'La aclaración fue eliminada con éxito'
            );

            if (clarifycationLength === 1) {
              const goodResDev: any = await this.getGoodResDev(this.good.id);
              await this.removeDevGood(Number(goodResDev));
              await this.updateGood(this.good.id);
            }
          },
          complete: () => {
            this.getClarifications();
          },
          error: error => {
            console.log(error);
            this.onLoadToast(
              'error',
              'Error al eliminar',
              `No se pudo eliminar la aclaración ${error.error.message}`
            );
          },
        });
      }
    });
  }
  editForm() {
    let data = this.clariArraySelected;
    if (data.length === 1) {
      this.openForm(this.clariArraySelected[0]);
    } else {
      this.alert('warning', 'Error', '¡Seleccione solo una aclaración!');
    }
  }

  openForm(event?: any): void {
    let docClarification = event;
    let config: ModalOptions = {
      initialState: {
        goodTransfer: this.goodForm.value,
        docClarification,
        request: this.requestObject,
        callback: (next: boolean) => {
          if (next) this.getClarifications();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ClarificationFormTabComponent, config);
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

  updateGood(id: number) {
    return new Promise((resolve, reject) => {
      let body: any = {};
      body.id = this.good.id;
      body.goodId = this.good.goodId;
      //body.goodResdevId = Number(id);
      body.processStatus = 'REGISTRO_SOLICITUD';
      body.goodStatus = 'REGISTRO_SOLICITUD';
      this.goodService.update(body).subscribe({
        next: resp => {
          console.log('good updated', resp);
        },
        error: error => {
          console.log('good updated', error);
          this.onLoadToast(
            'error',
            'Erro Interno',
            'No se actualizo el campo bien-res-dev en bien'
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
          resolve('');
          this.onLoadToast(
            'error',
            'Error interno',
            'No se pudo obtener el bien-res-dev'
          );
        },
      });
    });
  }

  getAllGoodResDev(goodId: number) {
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
          resolve('');
          this.onLoadToast(
            'error',
            'Error interno',
            'No se pudo obtener el bien-res-dev'
          );
        },
      });
    });
  }
}
