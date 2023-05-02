import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AddGoodsButtonComponent } from 'src/app/pages/request/shared-request/select-goods/add-goods-button/add-goods-button.component';
import { ViewFileButtonComponent } from 'src/app/pages/request/shared-request/select-goods/view-file-button/view-file-button.component';
import { COLUMNS } from './columns-eye-visits/columns';
import { COLUMNS1 } from './columns-view-similar-goods/columns1';
import { COLUMNS2 } from './columns-view-similar-goods/columns2';
import { ModalAssignGoodGrouperComponent } from './modal-assign-good-grouper/modal-assign-good-grouper.component';
import { ModalModifyDatesComponent } from './modal-modify-dates/modal-modify-dates.component';

@Component({
  selector: 'app-select-similar-goods',
  templateUrl: './select-similar-goods.component.html',
  styles: [],
})
export class SelectSimilarGoodsComponent extends BasePage implements OnInit {
  @Input() nombrePantalla: string = '';
  titleSelectedGoods: string = '';
  goodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoods: any[] = [];
  goodTotalItems: number = 0;
  selectedGoodTotalItems: number = 0;
  selectedGoodColumns: any[] = [];
  goodColumns: any[] = [];
  goodSettings: any;
  selectedGoodSettings: any;
  selectedGoodSimilarGoodsSettings: any;
  selectedGoodEyeVisitsSettings: any;
  selectedRows: any[] = [];
  data: LocalDataSource = new LocalDataSource();
  enableButton: boolean = false;
  valueGoodGrouper: string;

  goodColumnsData = [
    {
      origin: 'Inventarios',
      description: 'funda para volante',
      key: '550-A4848',
      manageNo: '768',
      transferAmount: 32,
      transactionAmount: 3,
      reservedAmount: '0',
      availableAmount: 'Resarci',
      destination: '125',
      fileNo: 290,
      transferRequestNo: 0,
      saeNo: 1,
    },
  ];

  goodColumnsDataEyeVisits = [
    {
      maneuverRequired: true,
      goodNameAllocator: '1345',
      initDate: '20-01',
      endDate: '20-02',
      file: 141,
      requestNumb: 45,
      manageNumb: 608,
      reservedQuantity: 20,
      description: 'candil decorativo',
      saeNumb: 1,
      inventoryNumb: '00050103017',
      officeNumb: '600-06-00-05',
      fileType: 'pama',
    },
  ];

  goodTestData = [
    {
      allocatorAssetName: 'nombre bien asignador',
      origin: 'Invenatarios A.',
      description: 'Candil Decorativo',
      key: '801-69-68-65-2',
      reservedAmount: '20',
      subInventory: 'Admon',
      proceedingsNumb: 141,
      transferRequestNumber: 334343,
      managementNumb: 605,
      inventoryNumb: '0006010',
      inventoryTransactionNumb: 308295,
      saeNumb: 1532,
    },
  ];

  constructor(
    private bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
    this.goodSettings = { ...this.settings, actions: false };
    this.goodSettings.Update;

    this.selectedGoodSettings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
    };

    this.selectedGoodSimilarGoodsSettings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
    };
    this.goodSettings.columns = COLUMNS1;
    this.selectedGoodSimilarGoodsSettings.columns = COLUMNS2;

    this.selectedGoodEyeVisitsSettings = {
      //columnas para la vista de visitas oculares
      ...this.settings,
      actions: false,
      selectMode: 'multi',
    };
    this.selectedGoodEyeVisitsSettings.columns = COLUMNS;
  }

  ngOnInit(): void {
    console.log('-->' + this.nombrePantalla);
    if (
      this.nombrePantalla === 'register-documentation' ||
      this.nombrePantalla === 'transf-notification'
    ) {
      this.titleSelectedGoods = 'Bienes Seleccionados';
      this.initTableViewSimilarGoods();
    } else {
      this.titleSelectedGoods = 'Bienes para Visitas Oculares';
      this.initTableViewEyeVisits();
    }
  }

  initTableViewEyeVisits() {
    const self = this;
    this.selectedGoodEyeVisitsSettings.columns = {
      viewFile: {
        title: 'Expediente',
        type: 'custom',
        sort: false,
        renderComponent: ViewFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.viewFile(row);
          });
        },
      },
      ...this.selectedGoodEyeVisitsSettings.columns,
    };
    this.initTableSelectedGood();
  }

  initTableViewSimilarGoods() {
    const self = this;
    this.goodSettings.columns = {
      addGood: {
        title: 'Agregar Bien',
        type: 'custom',
        sort: false,
        renderComponent: AddGoodsButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.openReserveModal(row);
          });
        },
      },
      viewFile: {
        title: 'Expediente',
        type: 'custom',
        sort: false,
        renderComponent: ViewFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.viewFile(row);
          });
        },
      },
      ...this.goodSettings.columns,
    };
    this.initTableSelectedGood();
  }

  initTableSelectedGood() {
    const self = this;
    if (
      this.nombrePantalla === 'register-documentation' ||
      this.nombrePantalla === 'transf-notification'
    ) {
      this.selectedGoodSettings = this.selectedGoodSimilarGoodsSettings;
      this.data.load(this.goodTestData);
    } else {
      this.selectedGoodSettings = this.selectedGoodEyeVisitsSettings;
      this.data.load(this.goodColumnsDataEyeVisits);
    }
    this.selectedGoodSettings.columns = {
      viewFile: {
        title: 'Expediente',
        type: 'custom',
        sort: false,
        renderComponent: ViewFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.viewFile(row);
          });
        },
      },
      ...this.selectedGoodSettings.columns,
    };
  }

  getGoods(filters: any) {
    //Llamar servicio para obtener bienes
    let columns = this.goodTestData;
    columns.forEach(c => {
      c = Object.assign({ addGood: '' }, { viewFile: '' }, c);
    });
    this.goodColumns = columns;
    this.goodTotalItems = this.goodColumns.length;
  }

  siabSearch() {}

  selectGoods(rows: any[]) {
    this.selectedGoods = rows;
  }

  onUserRowSelect(e: any) {
    this.selectedRows = e.selected;
    this.enableDisable(e.selected.length);
  }

  // Habilita/Deshabilitar boton para asignar bien agrupador
  enableDisable(numberRowsSelected: number) {
    numberRowsSelected > 0
      ? (this.enableButton = true)
      : (this.enableButton = false);
  }

  removeGoods() {
    // this.alertQuestion(
    //   'question',
    //   '¿Desea eliminar los bienes seleccionados?',
    //   '',
    //   'Eliminar'
    // ).then(question => {
    //   if (question.isConfirmed) {
    //     this.selectedGoodColumns.forEach((g: any, i: number) => {
    //       this.selectedGoods.forEach((d: any, j: number) => {
    //         if (g.key == d.key) {
    //           this.selectedGoodColumns.splice(i, 1);
    //           this.selectedGoods.splice(j, 1);
    //         }
    //       });
    //     });
    //     this.selectedGoodColumns = [...this.selectedGoodColumns];
    //     this.selectedGoodTotalItems = this.selectedGoodColumns.length;
    //     console.log(this.selectedGoods, this.selectedGoodColumns);
    //   }
    // });
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      ModalAssignGoodGrouperComponent,
      config
    );
    this.bsModalRef.content.event.subscribe((value: string) => {
      this.assignGoodGrouper(value);
    });
  }

  modifyDates() {
    let config: ModalOptions = {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(ModalModifyDatesComponent, config);
    this.bsModalRef.content.event.subscribe((value: string) => {
      console.log(value);
      this.changeValueDates(value, this.selectedRows);
    });
  }

  changeValueDates(dates: any, rows: any) {
    rows.forEach((element: any) => {
      this.goodColumnsDataEyeVisits.forEach((data: any) => {
        data.file == element.file;
        data.initDate = dates.initDate;
        data.endDate = dates.endDate;
      });
    });
    this.data.load(this.goodColumnsDataEyeVisits);
    this.enableButton = false;
  }

  assignGoodGrouper(value: string) {
    let tempArray: any[] = [];
    this.selectedRows.forEach((row: any) => {
      tempArray = this.goodTestData.map(element => {
        if (row.key === element.key) {
          element.allocatorAssetName = value;
        }
        return element;
      });
    });
    this.enableButton = false;
    this.data.load(tempArray);
  }
}
