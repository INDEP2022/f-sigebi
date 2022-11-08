import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
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
export class ClarificationsComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  assetsArray: any[] = [];
  assetsSelected: any[] = [];
  //dataSelected: any[] = [];
  // clarifiArray: any[] = [];
  clariArraySelected: any[] = [];
  rowSelected: any;
  detailArray: any;
  typeDoc: string = 'clarification';

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    console.log(this.rowSelected);

    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: CLARIFICATION_COLUMNS,
    };

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getData();
      this.getClarifications();
    });
  }

  getData() {
    this.assetsArray = data;
  }

  getClarifications() {
    this.paragraphs = data2;
  }

  clicked(event: any) {
    console.log('one row');
    this.rowSelected = event;
    console.log(this.rowSelected);
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
      this.message('Error', 'Debes seleccionar al menos un bien!');
    } else {
      this.openForm();
    }
  }

  editForm() {
    if (this.clariArraySelected.length === 1) {
      this.openForm(this.clariArraySelected);
    } else {
      this.message('Error', 'Seleccione solo una aclaracion!');
    }
  }

  openForm(event?: any): void {
    let docClarification = event;
    let config: ModalOptions = {
      initialState: {
        docClarification: docClarification,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ClarificationFormTabComponent, config);
  }

  message(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: undefined,
      width: 300,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        return;
      }
    });
  }
}
