import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { TABLE_SETTINGS } from '../../../../common/constants/table-settings';
import { ListParams } from '../../../../common/repository/interfaces/list-params';
import { BasePage } from '../../../../core/shared/base-page';
import { GenerateAutorizationComponent } from '../../dictate-assets-study/generate-autorization/generate-autorization.component';
import { RecipientDataComponent } from '../../prepare-request-responsables/recipient-data/recipient-data.component';
import { UploadDocumentarySupportComponent } from '../../save-responsible-answer/upload-documentary-support/upload-documentary-support.component';
import { ProgrammingDeliveryComponent } from '../../schedule-delivery-assets/programming-delivery/programming-delivery.component';
import { ASSETS_LIST_COLUMNS } from './columns/list-asset-columns';
import { LIST_ASSETS_DICTATE_ASSETS_COLUMNS } from './columns/list-assets-dictate-assets-columns';
import { ASSETS_LIST_SAVE_ANSWER_COLUMNS } from './columns/list-assets-save-answer-columns';

var data = [
  {
    id: 1,
    noAsset: 1234,
    noInventory: 4545,
    classifier: 'classificador',
    descripTransfer: 'descripcion de la transferente',
    quantityTransfer: 15,
    unitTransfer: 'kilos',
    descriptIndep: 'descripcion indep',
    quantityIndep: 15,
    unitIndep: 'Kilos',
    descriptWarehouse: 'descripcion del almacen',
    quantityWarehouse: 20,
    unitWarehouse: 'Kilos',
    statePhysicWarehouse: 'Buen estado',
    stateConsercationWarehouse: 'Optimo',
    quantityForStudy: 0,
  },
  {
    id: 2,
    noAsset: 1234,
    noInventory: 4545,
    classifier: 'classificador',
    descripTransfer: 'descripcion de la transferente',
    quantityTransfer: 15,
    unitTransfer: 'kilos',
    descriptIndep: 'descripcion indep',
    quantityIndep: 15,
    unitIndep: 'Kilos',
    descriptWarehouse: 'descripcion del almacen',
    quantityWarehouse: 20,
    unitWarehouse: 'Kilos',
    statePhysicWarehouse: 'Buen estado',
    stateConsercationWarehouse: 'Optimo',
    quantityForStudy: 0,
  },
];

@Component({
  selector: 'app-list-assets',
  templateUrl: './list-assets.component.html',
  styleUrls: ['./list-assets.component.scss'],
})
export class ListAssetsComponent extends BasePage implements OnInit, OnChanges {
  @Input() dataAssets: any;
  @Input() isSaving: boolean = false;
  @Input() typeComponent: string = '';
  @Output() listAssetsData = new EventEmitter<any>();

  modalParent: BsModalRef;

  paragraphs = new LocalDataSource();
  columns = ASSETS_LIST_COLUMNS;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  listAssetsDeleted: any[] = [];

  settings2: any;
  paragraphs2 = new LocalDataSource();
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  listAssetsToRetrieve: any[] = [];

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.settingTheColumns();
    this.paragraphs.load(data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isSaving === true) {
      //enviar los datos al padre y verificar que la lista no este vacia y que las cantidades no sean nulas
      this.listAssetsData.emit(this.paragraphs['data']);
    }
  }

  assetsSelected(event: any): void {
    this.listAssetsDeleted = event.selected;
  }

  delete() {
    for (let i = 0; i < this.listAssetsDeleted.length; i++) {
      let element = this.listAssetsDeleted[i];
      let index = this.paragraphs['data'].indexOf(element);
      this.paragraphs['data'].splice(index, 1);
      this.paragraphs2['data'].push(element);
    }
    this.paragraphs.refresh();
    this.paragraphs2.refresh();
  }

  generateReport() {
    this.openModal(RecipientDataComponent, '', 'prepare-request');
  }

  selectedAssestsDeleted(event: any) {
    this.listAssetsToRetrieve = event.selected;
  }

  retrieve() {
    for (let i = 0; i < this.listAssetsToRetrieve.length; i++) {
      let element = this.listAssetsToRetrieve[i];
      let index = this.paragraphs2['data'].indexOf(element);
      this.paragraphs2['data'].splice(index, 1);
      this.paragraphs['data'].push(element);
    }
    this.paragraphs2.refresh();
    this.paragraphs.refresh();
  }

  response(): void {
    if (this.listAssetsDeleted.length > 1) {
      Swal.fire({
        icon: undefined,
        title: 'Información',
        text: 'Solo puede seleccionar un bien!',
        confirmButtonColor: '#9D2449',
      });
      return;
    }
    this.openModal(
      UploadDocumentarySupportComponent,
      this.listAssetsToRetrieve,
      'save-answer'
    );
  }

  scheduleDelivery(): void {
    this.openModal(
      ProgrammingDeliveryComponent,
      this.listAssetsDeleted,
      'schedule-delivery'
    );
  }

  generateAuthorization() {
    this.openModal(
      GenerateAutorizationComponent,
      this.listAssetsDeleted,
      'dictate-assets'
    );
  }

  openModal(component: any, information?: any, typeReport?: string) {
    let config: ModalOptions = {
      initialState: {
        information: information,
        typeReport: typeReport,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalParent = this.modalService.show(component, config);
  }

  settingTheColumns() {
    console.log(this.typeComponent);
    if (this.typeComponent === 'save-answer') {
      this.saveAnswerColumns();
    } else if (this.typeComponent === 'prepare-request') {
      this.prepareRequestColumns();
    } else if (this.typeComponent === 'schedule-delivery') {
      this.scheduleDeliveryColumns();
    } else if (this.typeComponent === 'dictate-assets') {
      this.dictateAssetsColumns();
    }
  }

  dictateAssetsColumns(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: LIST_ASSETS_DICTATE_ASSETS_COLUMNS,
    };
  }

  scheduleDeliveryColumns(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: ASSETS_LIST_SAVE_ANSWER_COLUMNS,
    };
  }

  saveAnswerColumns(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: ASSETS_LIST_SAVE_ANSWER_COLUMNS,
    };
  }

  prepareRequestColumns(): void {
    //cantidad a estudiar tiene que ser mayor a la cantidad en el almacen
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: ASSETS_LIST_COLUMNS,
    };

    this.columns.input = {
      ...this.columns.input,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick.subscribe((data: any) => {
          this.paragraphs['data'].map(x => {
            if (x.id == data.row.id) {
              x.quantityForStudy = data.quantity;
            }
          });
        });
      },
    };

    this.settings2 = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: ASSETS_LIST_COLUMNS,
    };
  }
}
