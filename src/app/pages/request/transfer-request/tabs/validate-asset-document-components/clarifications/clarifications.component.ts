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
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IFormGroup } from 'src/app/core/interfaces/model-form';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ClarificationService } from 'src/app/core/services/catalogs/clarification.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ClarificationFormTabComponent } from '../../classify-assets-components/classify-assets-child-tabs-components/clarification-form-tab/clarification-form-tab.component';
import { CLARIFICATION_COLUMNS } from './clarifications-columns';

//bienes
var data = [
  {
    id: 1,
    noManagement: '8905184',
    assetsDescripTransfer: 'VEHICULO NISSAN, MODELO TSUMA',
    assetsDescripSAE: '',
    typeAsset: 'VEHICULO',
    fraction: '8703.24.01',
    quantityTransfer: '1',
    ligieUnitMeasure: 'PIEZA',
    transferUnitMeasure: 'PIEZA',
    uniqueKey: '1244',
    physicalState: 'NUEVO',
    conservationState: '',
    destinyLigie: 'VENTA',
    destinyTransfer: 'VENTA',
  },
  {
    id: 2,
    noManagement: '8751658',
    assetsDescripTransfer: 'VEHICULO TOYOTA, MODELO SPRINT',
    assetsDescripSAE: '',
    typeAsset: 'VEHICULO',
    fraction: '8703.00.01',
    quantityTransfer: '1',
    ligieUnitMeasure: 'PIEZA',
    transferUnitMeasure: 'PIEZA',
    uniqueKey: '1211',
    physicalState: 'NUEVO',
    conservationState: '',
    destinyLigie: 'VENTA',
    destinyTransfer: 'VENTA',
  },
];
// aclaraciones
var data2 = [
  {
    clarificationDate: '11/08/2022',
    typeClarification: 'Aclaracíon',
    clarification: 'ERROR EN DOCUMENTACION ANEXA',
    reason: 'No cuenta con documentacion',
    status: 'NUEVA ACLARACION',
    observation: '',
  },
];

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
  goodForm: IFormGroup<IGood>;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  paragraphs: any[] = [];
  assetsArray: any[] = [];
  assetsSelected: any[] = [];
  //dataSelected: any[] = [];
  // clarifiArray: any[] = [];
  clariArraySelected: any[] = [];
  rowSelected: any;
  detailArray: any;
  typeDoc: string = 'clarification';

  constructor(
    private modalService: BsModalService,
    private readonly fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly clarificationService: ClarificationService,
    private readonly rejectGoodService: RejectedGoodService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
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

    this.prepareForm();
  }
  private prepareForm() {
    this.goodForm = this.fb.group({
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
      quantity: [1, [Validators.required]],
      duplicity: ['N'],
      capacity: [null, [Validators.pattern(STRING_PATTERN)]],
      volume: [null, [Validators.pattern(STRING_PATTERN)]],
      fileeNumber: [null],
      useType: [null, [Validators.pattern(STRING_PATTERN)]],
      physicalStatus: [null],
      stateConservation: [null],
      origin: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      goodClassNumber: [null],
      ligieUnit: [null],
      appraisal: [null],
      destiny: [null], //preguntar Destino ligie
      transferentDestiny: [null],
      compliesNorm: ['N'], //cumple norma
      notesTransferringEntity: [null, [Validators.pattern(STRING_PATTERN)]],
      unitMeasure: [null], // preguntar Unidad Medida Transferente
      saeDestiny: [null],
      brand: [null, [Validators.required]],
      subBrand: [null, [Validators.required]],
      armor: [null],
      model: [null, [Validators.required]],
      doorsNumber: [null],
      axesNumber: [null, [Validators.required]],
      engineNumber: [null, [Validators.required]], //numero motor
      tuition: [null, [Validators.required]],
      serie: [null, [Validators.required]],
      chassis: [null],
      cabin: [null],
      fitCircular: ['N', [Validators.required]],
      theftReport: ['N', [Validators.required]],
      addressId: [null],
      operationalState: [null, [Validators.required]],
      manufacturingYear: [null, [Validators.required]],
      enginesNumber: [null, [Validators.required]], // numero de motores
      flag: [null, [Validators.required]],
      openwork: [null, [Validators.required]],
      sleeve: [null],
      length: [null, [Validators.required]],
      shipName: [null, [Validators.required]],
      publicRegistry: [null, [Validators.required]], //registro public
      ships: [null],
      dgacRegistry: [null, [Validators.required]], //registro direccion gral de aereonautica civil
      airplaneType: [null, [Validators.required]],
      caratage: [null, [Validators.required]], //kilatage
      material: [null, [Validators.required]],
      weight: [null, [Validators.required]],
      fractionId: [null],
    });
  }

  getData() {
    console.log(this.requestObject);
    this.params.value.addFilter('requestId', this.requestObject.id);
    const filter = this.params.getValue().getParams();
    this.goodService.getAll(filter).subscribe({
      next: ({ data }) => {
        this.assetsArray = [...data];
        console.log(this.assetsArray);
      },
    });
  }

  getClarifications() {
    let params = new BehaviorSubject<FilterParams>(new FilterParams());
    params.value.addFilter('goodId', this.assetsArray[0]);
    const filter = this.params.getValue().getParams();
    this.rejectGoodService.getAllFilter(filter).subscribe({
      next: ({ data }) => {
        this.paragraphs = [...data];
        console.log(data);
      },
    });
  }

  clicked(event: any) {
    this.rowSelected = event;
    this.goodForm.patchValue({ ...event });
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

  selectOne(event: any) {
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
  }

  clarifiRowSelected(event: any) {
    this.clariArraySelected = event.selected;
  }

  newClarification() {
    if (this.assetsSelected.length === 0) {
      this.alert('warning', 'Error', 'Debes seleccionar al menos un bien!');
    } else {
      this.openForm();
    }
  }
  deleteClarification() {
    let data = this.clariArraySelected[0];
    if (!data) {
      this.alert('warning', 'Cuidado', 'Tiene que seleccionar una aclaracion');
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
              'La aclaracion fue eliminada con exito.'
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
      this.alert('warning', 'Error', 'Seleccione solo una aclaracion!');
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
