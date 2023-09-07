import { DatePipe } from '@angular/common';
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
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ClarificationService } from 'src/app/core/services/catalogs/clarification.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
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
  styleUrls: ['./clarifications.component.scss'],
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
  bsModalRef: BsModalRef;
  paragraphs: any[] = [];
  goodSetting: any;
  assetsArray = new LocalDataSource();
  assetsSelected: any[] = [];
  //dataSelected: any[] = [];
  // clarifiArray: any[] = [];
  clariArraySelected: any[] = [];
  rowSelected: any;
  detailArray: any;
  typeDoc: string = 'clarification';
  good: IGood[] = [];
  totalItems: number = 0;
  showClarificationButtons: boolean = true;

  domicilieObject: any;
  articleColumns = CLARIFICATION_COLUMNS;
  haveNotification: boolean = false;
  isLoadingTable2 = false;
  task: any;
  statusTask: any = '';
  columns = ASSETS_COLUMNS;
  goodsSelected: IGood[] = [];
  goodSaeModified: any = [];

  constructor(
    private modalService: BsModalService,
    private readonly fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly clarificationService: ClarificationService,
    private readonly rejectGoodService: RejectedGoodService,
    private readonly typeRelevantService: TypeRelevantService,
    private readonly genericService: GenericService,
    private readonly goodResDevService: GetGoodResVeService,
    private readonly chatClarificationService: ChatClarificationsService,
    private readonly goodFinderService: GoodFinderService,
    private readonly authService: AuthService,
    private readonly historyGoodService: HistoryGoodService
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
    console.log('Activando tab: clarifications');
    this.task = JSON.parse(localStorage.getItem('Task'));
    console.log('task', this.task);

    // DISABLED BUTTON - FINALIZED //
    this.statusTask = this.task.status;

    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: CLARIFICATION_COLUMNS,
    };

    this.goodSetting = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: ASSETS_COLUMNS,
    };

    /*this.columns.selected = {
      ...this.columns.selected,
      onComponentInitFunction: this.selectGoods.bind(this),
    };*/

    this.columns.descriptionGoodSae = {
      ...this.columns.descriptionGoodSae,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setDescriptionGoodSae(data);
        });
      },
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
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(5)],
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
      descriptionGoodSae: [null],
      saeMeasureUnit: [null],
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
    this.goodFinderService.goodFinder(filter).subscribe({
      next: async (resp: any) => {
        this.assetsArray.load(resp.data);
        this.loading = false;
        this.totalItems = resp.count;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No se encontraron registros', '');
        console.log('no se encontraron registros del bien ', error);
      },
    });
  }

  selectGoods(event: any) {
    /* event.toggle.subscribe((data: any) => { */
    /* const index = this.goodsSelected.indexOf(data.row);
      if (index == -1 && data.toggle == true) {
        this.goodsSelected.push(data.row);
      } else if (index != -1 && data.toggle == false) {
        this.goodsSelected.splice(index, 1);
      } */
    this.goodsSelected = [];
    this.goodsSelected.push(event);
    if (this.goodsSelected.length === 1) {
      this.rowSelected = null;
      this.paragraphs = [];
      this.goodForm.reset();
      setTimeout(() => {
        this.showClarificationButtons =
          this.goodsSelected[0].processStatus != 'SOLICITAR_ACLARACION'
            ? true
            : false;
        this.good = this.goodsSelected;

        this.goodForm.patchValue({ ...this.good[0] });
        this.rowSelected = this.good;
        this.getClarifications();
      }, 1000);
    } else if (this.goodsSelected.length > 1) {
      this.rowSelected = null;
      this.paragraphs = [];
      this.onLoadToast('warning', 'Solo se puede seleccionar un Bien');
    } else {
      this.rowSelected = null;
      this.paragraphs = [];
    }
    /* }); */
  }

  getClarifications() {
    this.paragraphs = [];
    this.isLoadingTable2 = true;
    const params = new ListParams();
    params['filter.goodId'] = `$eq:${this.good[0].id}`;

    this.rejectGoodService.getAllFilter(params).subscribe({
      next: resp => {
        console.log(resp.data);

        const clarification = resp.data.map(async (item: any) => {
          const clarifi = await this.getCatClarification(item.clarificationId);
          item['clarificationName'] = clarifi;
          const date = new Date(item.rejectionDate);
          const datePipe = new DatePipe('en-US');
          item['rejectionDate'] = datePipe.transform(date, 'dd/MM/yyyy', 'UTC');
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

  /*selectAll(event?: any) {
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
  }*/

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
    if (event.isSelected == true) {
      this.showClarificationButtons =
        event.data.answered == 'ACLARADA' ? false : true;
      this.clariArraySelected = event.selected;
    } else {
      this.showClarificationButtons = true;
    }
  }

  newClarification() {
    let data = this.clariArraySelected[0];
    if (data === 0) {
      this.onLoadToast('warning', 'Información', `Seleccione uno o mas Bienes`);
      return;
    }
    this.openForm();
  }

  deleteClarification() {
    let data = this.clariArraySelected[0];
    if (data === 0) {
      this.onLoadToast('warning', 'Información', `Seleccione uno o mas Bienes`);
      return;
    }

    const clarifycationLength = this.paragraphs.length;
    this.alertQuestion(
      'question',
      'Atención',
      '¿Desea eliminar el registro?'
    ).then(async val => {
      if (val.isConfirmed) {
        const idChatClarification = data.chatClarification.idClarification;
        const result = await this.removeChatClarification(idChatClarification);

        this.rejectGoodService.remove(data.rejectNotificationId).subscribe({
          next: async val => {
            this.onLoadToast(
              'success',
              'Eliminada',
              'La aclaración fue eliminada con éxito'
            );

            let body: any = {};
            if (clarifycationLength === 1) {
              const goodResDev: any = await this.getGoodResDev(this.good[0].id);
              await this.removeDevGood(Number(goodResDev));
              body['id'] = this.good[0].id;
              body['goodId'] = this.good[0].goodId;
              body.processStatus = 'DESTINO_DOCUMENTAL';
              body.goodStatus = 'DESTINO_DOCUMENTAL';
              body.status = 'ROP';
              await this.updateGood(body);
            } else {
              body['id'] = this.good[0].id;
              body['goodId'] = this.good[0].goodId;
              body.goodStatus =
                this.good[0].goodStatus != 'ACLARADO'
                  ? 'ACLARADO'
                  : 'DESTINO_DOCUMENTAL';
              body.processStatus = 'DESTINO_DOCUMENTAL';
              body.status = 'ROP';
              await this.updateGood(body);
            }
            //const update = await this.createHistoricGood('ROP', body.id);
            this.updateStatusTable(body);
          },
          complete: () => {
            this.getClarifications();
            this.getData();
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

  updateStatusTable(body: any) {
    this.assetsArray.getElements().then(data => {
      data.map((item: any) => {
        //debugger;
        if (item.id === body.id) {
          item.processStatus = body.processStatus;
          item.goodStatus = body.goodStatus;
        }
      });
      this.assetsArray.load(data);
    });
  }

  editForm() {
    let data = this.clariArraySelected;
    if (data.length === 1) {
      this.openForm(this.clariArraySelected[0]);
    } else {
      this.alert('warning', 'Error', 'Seleccione solo una Aclaración');
    }
  }

  openForm(event?: any): void {
    let docClarification = event;
    let config: ModalOptions = {
      //this.goodForm.value
      initialState: {
        goodTransfer: this.good,
        docClarification,
        request: this.requestObject,
        callback: (next: boolean) => {
          if (next) this.getClarifications();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      ClarificationFormTabComponent,
      config
    );

    this.bsModalRef.content.event.subscribe((res: any) => {
      if (res === 'UPDATE-GOOD') {
        this.assetsArray.getElements().then(data => {
          data.map((item: any) => {
            if (item.id === res.id) {
              item.processStatus = 'SOLICITAR_ACLARACION';
              item.goodStatus = 'SOLICITUD DE ACLARACION';
            }
          });
        });
      }
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
            'No se pudo eliminar el Bien'
          );
        },
      });
    });
  }

  updateGood(body: any) {
    return new Promise((resolve, reject) => {
      this.goodService.update(body).subscribe({
        next: resp => {
          console.log('good updated', resp);
          resolve(true);
        },
        error: error => {
          console.log('good updated', error);
          this.onLoadToast(
            'error',
            'Erro Interno',
            'No se actualizó el campo bien en bien'
          );
          reject(false);
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
            'No se pudo obtener el Bien'
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
            'No se pudo obtener el Bien'
          );
        },
      });
    });
  }

  setDescriptionGoodSae(descriptionInput: any) {
    this.assetsArray['data'].map((item: any) => {
      if (item.id === descriptionInput.data.id) {
        item.descriptionGoodSae = descriptionInput.text;

        this.addGoodModified(item);
      }
    });
  }

  addGoodModified(good: any) {
    const index = this.goodSaeModified.indexOf(good);
    if (index != -1) {
      this.goodSaeModified[index] = good;
      if (this.goodSaeModified[index].descriptionGoodSae == '') {
        this.goodSaeModified[index].descriptionGoodSae = null;
      }
    } else {
      this.goodSaeModified.push(good);
    }
  }

  saveGoodSaeDescrip() {
    if (this.goodSaeModified.length == 0) {
      return;
    }
    this.loading = true;
    this.goodSaeModified.map(async (item: any, _i: number) => {
      const index = _i + 1;
      const body: any = {
        id: item.id,
        goodId: item.goodId,
        descriptionGoodSae: item.descriptionGoodSae,
      };
      //debugger;
      const updateResult: any = await this.updateGood(body);
      if (this.goodSaeModified.length == index) {
        this.loading = false;
        this.goodSaeModified = [];
        this.onLoadToast('success', 'Bienes Actualizados');
      }
    });
  }

  createHistoricGood(status: string, good: number) {
    return new Promise((resolve, reject) => {
      const user: any = this.authService.decodeToken();
      let body: IHistoryGood = {
        propertyNum: good,
        status: status,
        changeDate: new Date(),
        userChange: user.username,
        statusChangeProgram: 'SOLICITUD_TRANSFERENCIA',
        reasonForChange: 'N/A',
      };
      this.historyGoodService.create(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(error);
          this.onLoadToast('error', 'No se pudo crear el historico del bien');
        },
      });
    });
  }
}
