import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';

import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DestinationActsDelegationComponent } from '../destination-acts-delegation/destination-acts-delegation.component';

import { LocalDataSource } from 'ng2-smart-table';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
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
  settings1: any;
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
  columnFilters: any = [];
  get userAuth() {
    return this.authService.decodeToken().username;
  }
  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private datePipe: DatePipe,
    private goodService: GoodService,
    private statusGoodService: StatusGoodService,
    private goodParametersService: GoodParametersService,
    private modalService: BsModalService,
    private proceedingService: ProceedingsService,
    private historygoodService: HistoryGoodService,
    private authService: AuthService,
    private goodprocessService: GoodProcessService
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      rowClassFunction: (row: any) => {
        if (row.data.di_disponible === 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-danger text-white';
        }
      },
    };
    this.settings2 = { ...this.settings, hideSubHeader: false, actions: false };
    this.settings1.columns = COLUMNS1;
    this.settings2.columns = COLUMNS2;
  }
  /* rowClassFunction: (row: any) => {
        if (row.data.di_disponible == 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      }, */
  ngOnInit(): void {
    this.initForm();
    this.pupInitForm();
    this.getEdo();

    this.source
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          //this.params = this.pageFilter(this.params);
          if (this.response) this.getGoods();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.response) this.getGoods();
    });
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
          this.alert(
            'warning',
            'Actas de Destino de Bienes',
            'No se encontrarón registros.'
          );
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
    console.log('ENTRO A BUSCAR BIENES');
    this.loading = true;
    let params = {
      ...this.params,
      ...this.columnFilters,
    };
    params['filter.fileNumber'] = `$eq:${this.expediente}`;
    this.goodService.getAll(params).subscribe({
      next: async response => {
        console.log(response);
        const datos = await Promise.all(
          response.data.map(async (item: IGood) => {
            const acta = await this.getActDescription(
              item.goodId,
              item.fileNumber
            );
            const di_disponible = await this.getDisponible(item.goodId);
            return {
              ...item,
              acta,
              di_disponible,
            };
          })
        );
        this.totalItems = response.count;
        this.source.load(datos);
        this.source.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.source.load([]);
        this.source.refresh();
      },
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

  selectRow(event: any) {
    this.selectedGood = event;
    this.statusGoodSelected(event.data.status);
  }

  selectRow2(event: IGood) {
    this.selectedGood2 = event;
    console.log('selectedGood2 ', this.selectedGood2);
  }

  addSelect() {
    if (!this.validAdd(this.selectedGood.data)) {
      return;
    }
    console.log('Selected Row: ->', this.selectedGood.data);
    if (this.selectedGood === null) {
      this.onLoadToast('error', 'Debe Seleccionar un Registro');
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
  statusGoodSelected(status: string) {
    const params: ListParams = {};
    params['filter.status'] = `$eq:${status}`;
    this.statusGoodService.getAll(params).subscribe({
      next: (response: any) => {
        this.formTable1.get('detail').setValue(response.data[0].description);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  validAdd(good: any) {
    const cve_act: string = this.actForm.get('act').value;
    const status_act: string = this.actForm.get('statusAct').value;
    if (good.di_disponible === 'N') {
      this.onLoadToast(
        'warning',
        'Actas de Destino de Bienes',
        'El bien tiene un estatus invalido para ser asignado a alguna acta'
      );
      return false;
    }
    if (cve_act === null) {
      this.onLoadToast(
        'warning',
        'Actas de Destino de Bienes',
        'Debe registrar un acta antes de poder mover el bien'
      );
      return false;
    }
    if (good.goodClassNumber === 62 && cve_act.substring(0, 2) !== 'NA') {
      this.onLoadToast(
        'warning',
        'Actas de Destino de Bienes',
        'Para este bien la clave de acta dede iniciar con " NA "'
      );
      return false;
    }
    if (
      good.goodClassNumber === 62 &&
      cve_act.substring(13, 3) !== 'DAB' &&
      cve_act.substring(14, 3) !== 'DAB'
    ) {
      this.onLoadToast(
        'warning',
        'Actas de Destino de Bienes',
        'En la parte de quien administra en la clave de acta debe ser para este bien " DAB "'
      );
      return false;
    }
    if (status_act === 'CERRADA') {
      this.onLoadToast(
        'warning',
        'Actas de Destino de Bienes',
        'El acta ya esta cerrada, no puede realizar modificaciones a esta'
      );
      return false;
    } else {
      if (good.acta !== null) {
        this.onLoadToast(
          'warning',
          'Actas de Destino de Bienes',
          'Ese bien ya se encuentra en la acta ' + good.acta
        );
        return false;
      }
    }
    return true;
  }

  getActDescription(goodNumber: number, fileNumber: number) {
    return new Promise<string>((res, _rej) => {
      const model = {
        goodNumber,
        fileNumber,
      };
      this.proceedingService.getAct(model).subscribe({
        next: (response: any) => {
          res(response.data[0].cve_acta);
        },
        error: error => {
          console.log(error);
          res(null);
        },
      });
    });
  }

  async preInsert(good: any) {
    if (this.actForm.get('statusAct').value === 'CERRADA') {
      const data: any[] = await this.statusFinal();
      data.forEach(element => {
        if (element.status_final !== null) {
          this.updateGood(good, element.status_final);
          this.insertHistoryStatus(good, element.status_final, this.userAuth);
        }
      });
    }
  }
  ////////// Falta que entregen esto de Back
  statusFinal() {
    return new Promise<any[]>((res, rej) => {
      const params: ListParams = {};
      params['filter.status'] = `$eq:${this.statusFinal}`;
      this.statusGoodService.getAll(params).subscribe({
        next: (response: any) => {
          console.log(response.data);
          this.formTable1.get('detail').setValue(response.data[0].description);
        },
        error: error => {
          console.log(error);
        },
      });
    });
  }

  updateGood(good: any, statusFinal: string) {
    const model: IGood = null;
    model.id = good.id;
    model.goodId = good.goodId;
    model.status = statusFinal;
    this.goodService.update(model).subscribe({
      next: (response: any) => {
        console.log(response.data);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  insertHistoryStatus(good: IGood, statusFinal: string, usuario: string) {
    const model: IHistoryGood = {
      changeDate: this.getCurrentDate(),
      userChange: usuario,
      propertyNum: good.id,
      reasonForChange: 'Automatico',
      status: statusFinal,
      statusChangeProgram: 'FACTDESACTASUTILI',
    };
    this.historygoodService.create(model).subscribe({
      next: (response: any) => {
        console.log(response.data);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  //http://sigebimstest.indep.gob.mx/goodprocess/api/v1/update-good-status/getOneRegister
  getDisponible(goodNumber: number) {
    return new Promise((res, rej) => {
      const model = {
        vcScreen: 'FACTDESACTASUTILI',
        goodNumber,
      };
      this.goodprocessService.getDisponible(model).subscribe({
        next: response => {
          console.log(response);
          res('S');
        },
        error: err => {
          res('N');
        },
      });
    });
  }
  ////////////////////////
}
