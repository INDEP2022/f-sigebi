import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DestinationActsDelegationComponent } from '../destination-acts-delegation/destination-acts-delegation.component';

import { LocalDataSource } from 'ng2-smart-table';
import { IGood } from 'src/app/core/models/ms-good/good';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';

interface IGlobal {
  numeroExpediente: number;
}

@Component({
  selector: 'app-destination-goods-acts',
  templateUrl: './destination-goods-acts.component.html',
  styles: [],
})
export class DestinationGoodsActsComponent extends BasePage implements OnInit {
  @ViewChild('mySmartTable') mySmartTable: any;
  actForm: FormGroup;
  formTable1: FormGroup;
  box: any[] = [];
  response: boolean = false;
  totalItems: number = 0;
  totalItems2: number = 0;
  settings2: any;
  strategy = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  rowSelected: boolean = false;
  selectedRow: any = null;
  etapa: number = 0;
  expediente: string | number;
  global: IGlobal = {
    numeroExpediente: null,
  };

  source: LocalDataSource = new LocalDataSource();
  source2: LocalDataSource = new LocalDataSource();

  goodsList: IGood[] = [];
  goodsList2: any[] = [];
  selectedGood: any;
  selectedGood2: any;
  deleteselectedRow: any;
  contador: number = 0;
  totalValue: number = 0;

  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private datePipe: DatePipe,
    private goodService: GoodService,
    private goodParametersService: GoodParametersService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = { ...this.settings, hideSubHeader: false, actions: false };
    this.settings2 = { ...this.settings, hideSubHeader: false, actions: false };
    this.settings.columns = COLUMNS1;
    this.settings2.columns = COLUMNS2;
  }

  ngOnInit(): void {
    this.initForm();
    this.pupInitForm();
    this.getEdo();
  }

  initForm() {
    this.actForm = this.fb.group({
      statusAct: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      act: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      preliminaryAscertainment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causePenal: [null, [Validators.required]],
      elabDate: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      destinationDelivDate: [null, [Validators.required]],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      deliveryName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      receiverName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      auditor: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });
  }

  pupInitForm() {
    if (this.global.numeroExpediente !== null) {
      this.params.getValue()[
        'filter.no_expedient'
      ] = `$eq:${this.global.numeroExpediente}`;
      /// se llama para llenar la forma
    }
  }

  /* data = EXAMPLE_DATA;
  data2 = EXAMPLE_DATA2; */

  search(term: string | number) {
    this.expediente = term;
    console.log(' this.expediente  ', this.expediente);
    this.loading = true;
    this.expedientService.getById(term).subscribe(
      response => {
        if (response !== null) {
          this.response = !this.response;
          this.actForm.controls['act'].setValue(response.registerNumber);
          this.actForm.controls['preliminaryAscertainment'].setValue(
            response.preliminaryInquiry
          );
          this.actForm.controls['statusAct'].setValue(response.expedientStatus);
          this.actForm.controls['deliveryName'].setValue(
            response.nameInstitution
          );
          this.actForm.controls['receiverName'].setValue(
            response.indicatedName
          );
          this.actForm.controls['observations'].setValue(response.insertMethod);
          this.actForm.controls['causePenal'].setValue(response.criminalCase);
          this.actForm.controls['destinationDelivDate'].setValue(
            this.datePipe.transform(response.receptionDate, 'dd/MM/yyyy')
          );
          this.actForm.controls['captureDate'].setValue(
            this.datePipe.transform(response.insertDate, 'dd/MM/yyyy')
          );
          this.actForm.controls['elabDate'].setValue(
            this.datePipe.transform(
              response.dictaminationReturnDate,
              'dd/MM/yyyy'
            )
          );
        } else {
          this.alert('info', 'No se encontrarón registros', '');
        }
        this.getGoods();
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  // getGoodsByExpedient(id: string | number): void {
  //   this.goodService.getByExpedient(id, this.params.getValue()).subscribe(
  //     response => {
  //       //console.log(response);
  //       let data = response.data.map((item: IGood) => {
  //         //console.log(item);
  //       });
  //       // this.data.load(data);
  //       this.totalItems = response.count;
  //       this.loading = false;
  //     },
  //     error => (this.loading = false)
  //   );
  // }

  onSubmit() {}

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }

  getGoods(): void {
    this.goodService
      .getByExpedient(this.expediente, this.params.getValue())
      .subscribe({
        next: response => {
          console.log(response);
          for (let i = 0; i < response.count; i++) {
            if (response.data[i] != undefined) {
              let item: IGood = {
                noBien: response.data[i].goodId,
                description: response.data[i].description,
                cantidad: response.data[i].quantity,
                //acta: response.data[i].goodId,
              };
              this.goodsList.push(item);
            }
          }
          this.totalItems = response.count;
          this.loading = false;
          this.source.load(this.goodsList);
          this.source.refresh();
        },
        error: error => (this.loading = false),
      });
  }

  getEdo() {
    this.goodParametersService.getPhaseEdo().subscribe(res => {
      let edo = JSON.parse(JSON.stringify(res['stagecreated']));
      this.etapa = edo;
    });
  }

  onUserRowSelect(good: any) {
    console.log('good', good.data);
    this.openModal(good.data);
  }

  openModal(good: any) {
    let config: ModalOptions = {
      initialState: {
        good: good,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => console.log('recibido '));
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DestinationActsDelegationComponent, config);
  }

  exportData() {
    if (this.expediente !== null && this.actForm.get('').value) {
      /// Llamar al bloque Actas
    } else {
      this.alert(
        'warning',
        'Actas de Destino de Bienes',
        'Necesitas un número de expedientes con acta (s)'
      );
    }
  }
  countRowTotal() {
    this.totalValue = 0;
    for (let i = 0; i < this.box.length; i++) {
      this.totalValue += Number(this.box[i].quantity);
    }
    this.totalValue = this.roundPercentage(this.totalValue);
    console.log('LONGITUD: ', this.box.length);
  }

  roundPercentage(percentage: number): number {
    return parseFloat(percentage.toFixed(1));
  }

  countFacture() {
    this.contador = 0;
    for (let i = 0; i < this.box.length; i++) {
      this.contador++;
    }
  }

  selectRow(event: IGood) {
    this.selectedGood = event;
    //console.log('selectedGood ', this.selectedGood);
  }

  selectRow2(event: IGood) {
    this.selectedGood2 = event;
    console.log('selectedGood2 ', this.selectedGood2);
  }

  addSelect() {
    console.log('Selected Row: ->', this.selectedGood.data);
    if (this.selectedGood == null) {
      this.onLoadToast('error', 'Debe Seleccionar un Registro');
      return;
    } else {
      this.goodsList2.push(this.selectedGood.data);
      this.source2.load(this.goodsList2);
      this.calculateTotalItem2();
      //this.selectedGood.data = null;
    }
  }

  clearSelection() {
    const selectedRows = this.mySmartTable.grid.getSelectedRows();
    selectedRows.forEach((row: any) => {
      row.isSelected = false;
    });
  }

  removeSelect() {
    this.box = [];
    if (this.deleteselectedRow == null) {
      this.onLoadToast('error', 'Debe seleccionar un registro');
      return;
    } else {
      this.strategy.remove(this.deleteselectedRow);
      this.strategy.remove(this.box);
      this.contador = 0;
      this.totalValue = 0;
      this.countRowTotal();
      this.clearSelection();
      this.countFacture();
      this.strategy.load([]);
    }
  }

  calculateTotalItem() {
    let aux = 0;
    for (let i = 0; i < this.goodsList.length; i++) {
      aux++;
    }
    this.totalItems = aux;
  }
  calculateTotalItem2() {
    let aux = 0;
    for (let i = 0; i < this.goodsList2.length; i++) {
      aux++;
    }
    this.totalItems2 = aux;
  }

  /////////////////////// cogigo de Alexander

  ////////////////////////
}
