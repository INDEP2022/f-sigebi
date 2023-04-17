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
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ClarificationService } from 'src/app/core/services/catalogs/clarification.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
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
  goodForm: ModelForm<IGood>;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
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

  constructor(
    private modalService: BsModalService,
    private readonly fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly clarificationService: ClarificationService,
    private readonly rejectGoodService: RejectedGoodService,
    private readonly typeRelevantService: TypeRelevantService,
    private readonly genericService: GenericService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.requestObject) {
      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
        this.getData();
      });
    }
  }

  ngOnInit(): void {
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
    const filter = this.params.getValue().getParams();
    this.goodService.getAll(filter).subscribe({
      next: resp => {
        console.log(resp.data);
        let result = resp.data.map(async (item: any) => {
          const goodTypeName = await this.getTypeGood(item.goodTypeId);
          item['goodTypeName'] = goodTypeName;

          item['fraction'] = item.fractionId.description;

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
            resolve(resp.data[0].description);
          },
        });
      } else {
        resolve(null);
      }
    });
  }

  selectGoods(event: any) {
    if (event.selected.length === 1) {
      console.log(event);
      this.good = event.data;
      this.goodForm.reset();
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

  clicked(event: any) {
    this.goodForm.reset();
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
    console.log(event.target.value);
  }

  newClarification() {
    if (this.rowSelected.length === 0) {
      this.alert('warning', 'Error', 'Debes seleccionar al menos un bien!');
    } else {
      this.openForm();
    }
  }

  deleteClarification() {
    let data = this.clariArraySelected[0];
    if (!data) {
      this.alert('warning', 'Cuidado', 'Tiene que seleccionar una aclaración');
    }
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar el registro?'
    ).then(val => {
      if (val.isConfirmed) {
        this.rejectGoodService.remove(data.rejectNotificationId).subscribe({
          next: val => {
            this.onLoadToast(
              'success',
              'Eliminada con exito',
              'La aclaración fue eliminada con éxito.'
            );
          },
          complete: () => {
            this.getClarifications();
          },
        });
      }
    });
  }
  editForm() {
    if (this.clariArraySelected.length === 1) {
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
        callback: (next: boolean) => {
          if (next) this.getClarifications();
        },
      },
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ClarificationFormTabComponent, config);
  }
}
