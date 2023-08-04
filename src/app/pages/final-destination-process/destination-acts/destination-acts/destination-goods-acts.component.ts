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
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import {
  IDetailProceedingsDevollution,
  IDetailProceedingsDevollutionDelete,
} from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import {
  ProceedingsDeliveryReceptionService,
  ProceedingsService,
} from 'src/app/core/services/ms-proceedings';
import { ReceptionDeliveryMinutesComponent } from '../reception-delivery-minutes/reception-delivery-minutes.component';
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
  expediente: number;
  idActa: number;
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
  columnFilters2: any = [];
  loading2: boolean = this.loading;
  disableClosedAct: boolean = false;
  title: string = 'Actas de Destino de Bienes';
  get userAuth() {
    return this.authService.decodeToken().username;
  }

  noGood: number;
  descriptionGood: string;
  quantity: number;
  noRegister: number;

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
    private goodprocessService: GoodProcessService,
    private proceedingsDetailDel: ProceedingsDeliveryReceptionService
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
    this.settings2 = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: '',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      edit: {
        editButtonContent: '<i class="fas fa-edit bx-sm float-icon"></i>',
      },
    };
    this.settings1.columns = COLUMNS1;
    this.settings2.columns = COLUMNS2;
  }
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
    this.disableCampo('elabDate');
    this.disableCampo('captureDate');
    this.disableCampo('auditor');
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
    //this.expediente = term;
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
          this.alert('warning', this.title, 'No se encontrarón registros.');
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
    console.log('good', good.good);
    this.openModal(good.good);
  }

  openModal(good: any) {
    let config: ModalOptions = {
      initialState: {
        good: good,
        callback: (next: boolean) => {
          if (next) {
            this.getDetailProceedingsDevolution(this.idActa);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(DestinationActsDelegationComponent, config);
  }

  openModalRepor(expediente: number | string) {
    let config: ModalOptions = {
      initialState: {
        expediente: expediente,
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
    this.modalService.show(ReceptionDeliveryMinutesComponent, config);
  }

  exportData() {
    if (this.expediente !== null) {
      this.openModalRepor(this.expediente);
    } else {
      this.alert(
        'warning',
        this.title,
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
    if (this.selectedGood === null) {
      this.onLoadToast('error', 'Debe Seleccionar un Registro');
    } else {
      this.preInsert(this.selectedGood.data);
      this.createDetailProceedingsDevolution(
        this.selectedGood.data,
        this.idActa
      );
    }
  }

  clearSelection() {
    const selectedRows = this.mySmartTable.grid.getSelectedRows();
    selectedRows.forEach((row: any) => {
      row.isSelected = false;
    });
  }

  async removeSelect() {
    if (this.selectedGood2.data === null) {
      this.alert('error', this.title, 'Debe Seleccionar un Registro');
    } else {
      if (this.actForm.get('statusAct').value === 'CERRADA') {
        this.alert(
          'error',
          this.title,
          'El acta ya esta cerrada, no puede realizar modificaciones a esta'
        );
      } else {
        const data: any[] = await this.source.getAll();
        data.forEach(item => {
          if (item.id === this.selectedGood2.data.numberGood) {
            item.di_disponible = 'S';
          }
        });
        this.source.load(data);
        this.source.refresh();
        this.deleteDetailProceedingsDevolution(
          this.selectedGood2.data.numberGood,
          this.idActa
        );
      }
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

  getDetMinute(acta: number) {
    this.proceedingsDetailDel.getDetMinutes(acta).subscribe(
      response => {
        for (let i = 0; i < response.count; i++) {
          if (response.data[i] != null && response.data[i] != undefined) {
            this.noGood = response.data[i].numGoodId.id;
            this.descriptionGood = response.data[i].numGoodId.goodDescription;
            this.quantity = response.data[i].amountReturned;
            this.noRegister = response.data[i].numberRegister;
          }
        }
      },
      error => (this.loading = false)
    );
  }
  searchByExp(term: number | string) {
    this.expediente = Number(term);
    this.proceedingsDetailDel.getProceedingByExp(this.expediente).subscribe(
      response => {
        this.response = true;
        for (let i = 0; i < response.count; i++) {
          if (response.data[i] != undefined) {
            this.idActa = Number(response.data[i].id);
            this.actForm.controls['act'].setValue(
              response.data[i].keysProceedings
            );
            this.actForm.controls['observations'].setValue(
              response.data[i].observations
            );
            this.actForm.controls['statusAct'].setValue(
              response.data[i].statusProceedings
            );
            this.actForm.controls['address'].setValue(response.data[i].address);
            this.actForm.controls['elabDate'].setValue(
              this.datePipe.transform(
                response.data[i].elaborationDate,
                'dd/MM/yyyy'
              )
            );
            this.actForm.controls['captureDate'].setValue(
              this.datePipe.transform(
                response.data[i].captureDate,
                'dd/MM/yyyy'
              )
            );
            this.actForm.controls['destinationDelivDate'].setValue(
              this.datePipe.transform(
                response.data[i].datePhysicalReception,
                'dd/MM/yyyy'
              )
            );

            this.actForm.controls['deliveryName'].setValue(
              response.data[i].witness1
            );
            this.actForm.controls['receiverName'].setValue(
              response.data[i].witness2
            );
            this.actForm.controls['auditor'].setValue(
              response.data[i].responsible
            );
          }
        }
        if (response == null) {
          this.alert('info', 'No se encontrarón registros', '');
        }
        if (this.actForm.controls['statusAct'].value === 'CERRADA') {
          this.disableClosedAct = true;
        }
        this.getGoods();
        this.loading = false;
        this.getDetailProceedingsDevolution(this.idActa);
      },
      error => {
        this.alert(
          'error',
          this.title,
          'No se encontraron registros con este numero'
        );
      }
    );
  }

  disableCampo(campo: string) {
    this.actForm.get(campo).disable();
  }

  async closeAct() {
    if (this.actForm.get('act').value == null) {
      this.alert('error', this.title, 'No existe ningún acta a cerrar.');
    } else {
      console.log('ENTRO A CERRAR EL ACTA');
      const data2: any[] = await this.source2.getAll();
      if (data2.length === 0) {
        this.alert(
          'error',
          this.title,
          'El Acta No Tiene Ningún Bien Asignado, No Se Puede Cerrar.'
        );
      } else if (this.actForm.get('statusAct').value === 'CERRADA') {
        this.alert('error', this.title, 'El Acta ya Está Cerrada.');
      } else {
        const resp = await this.alertQuestion(
          'question',
          '¿Desea continuar?',
          'Está Seguro que Desea Cerrar el Acta.?'
        );
        if (resp.isConfirmed) {
          this.updateAct();
        }
      }
    }
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
        this.title,
        'El bien tiene un estatus inválido para ser asignado a alguna acta'
      );
      return false;
    }
    if (cve_act === null) {
      this.onLoadToast(
        'warning',
        this.title,
        'Debe registrar un acta antes de poder mover el bien'
      );
      return false;
    }
    if (good.goodClassNumber === 62 && cve_act.substring(0, 2) !== 'NA') {
      this.onLoadToast(
        'warning',
        this.title,
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
        this.title,
        'En la parte de quien administra en la clave de acta debe ser para este bien " DAB "'
      );
      return false;
    }
    if (status_act === 'CERRADA') {
      this.onLoadToast(
        'warning',
        this.title,
        'El acta ya esta cerrada, no puede realizar modificaciones a esta'
      );
      return false;
    } else {
      if (good.acta !== null) {
        this.onLoadToast(
          'warning',
          this.title,
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
      const data: any[] = await this.statusFinal(good.goodId);
      if (data.length === 0) {
        data.forEach(element => {
          if (element.estatus_final !== null) {
            this.updateGood(good, element.estatus_final);
            this.insertHistoryStatus(
              good,
              element.estatus_final,
              this.userAuth
            );
          }
        });
      }
    }
  }
  ////////// Falta que entregen esto de Back
  statusFinal(goodNumber: number) {
    return new Promise<any[]>((res, rej) => {
      const model = {
        vcScreen: 'FACTDESACTASUTILI',
        goodNumber,
      };
      this.goodprocessService.getStatusFinal(model).subscribe({
        next: (response: any) => {
          res(response.data.filter((index: number) => index === 0));
        },
        error: error => {
          console.log(error);
          res([]);
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

  getDisponible(goodNumber: number) {
    return new Promise((res, _rej) => {
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

  createDetailProceedingsDevolution(good: IGood, numberProceedings: number) {
    const { id, quantity } = good;
    const model: IDetailProceedingsDevollution = {
      numberGood: id,
      amount: quantity,
      numberProceedings,
    };
    console.log(model);
    this.proceedingService.createDetailProceedingsDevolution(model).subscribe({
      next: (response: any) => {
        this.getDetailProceedingsDevolution(numberProceedings);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getDetailProceedingsDevolution(numberAct: number) {
    this.loading2 = true;
    let params = {
      ...this.params2,
      ...this.columnFilters2,
    };
    params['filter.numberProceedings'] = `$eq:${numberAct}`;
    this.proceedingService.getDetailProceedingsDevolution(params).subscribe({
      next: response => {
        this.source2.load(response.data);
        this.source2.refresh();
        this.totalItems2 = response.count;
        this.loading2 = false;
      },
      error: error => {
        this.source2.load([]);
        this.source2.refresh();
        this.loading2 = false;
        console.log(error);
      },
    });
  }

  deleteDetailProceedingsDevolution(
    numberGood: number,
    numberProceedings: number
  ) {
    const model: IDetailProceedingsDevollutionDelete = {
      numberGood,
      numberProceedings,
    };
    this.proceedingService.deleteDetailProceedingsDevolution(model).subscribe({
      next: (response: any) => {
        console.log(response.data);
        this.getDetailProceedingsDevolution(numberProceedings);
        this.alert(
          'success',
          this.title,
          'Se ha eliminado el registro correctamente'
        );
      },
      error: err => {
        console.log(err);
      },
    });
  }

  updateAct() {
    const model: IProccedingsDeliveryReception = {};
    model.closeDate = this.getCurrentDate();
    model.statusProceedings = 'CERRADA';
    model.id = this.idActa;
    console.log(model);
    this.proceedingsDetailDel.update(this.idActa, model).subscribe({
      next: resp => {
        console.log(resp);
        this.alert('success', this.title, 'El acta ha sido cerrada.');
        this.disableClosedAct = true;
        this.searchByExp(this.expediente);
      },
      error: err => {
        this.alert('error', this.title, 'No se ha podido cerrar la acta.');
      },
    });
  }
  ////////////////////////
}
