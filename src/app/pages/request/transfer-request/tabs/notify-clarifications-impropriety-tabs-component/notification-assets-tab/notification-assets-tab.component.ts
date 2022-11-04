import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { NotifyAssetsImproprietyFormComponent } from '../notify-assets-impropriety-form/notify-assets-impropriety-form.component';
import { LIST_ASSETS_COLUMN } from './list-assets-columns';
import { NOTIFY_ASSETS_COLUMNS } from './notify-assets-columns';

var data1 = [
  {
    id: 1,
    statusAssets: 'SOLICITUD DE ACLARACION',
    management: '8901547',
    assetDescription: 'RESEPTOR DE SEÑAL CON NUMERO DE SERIE: 123456',
    unitMeasure: 'PIEZA',
    physicalState: 'BUENO',
    stateConsercation: 'BUENO',
  },
  {
    id: 2,
    statusAssets: 'SOLICITUD DE ACLARACION',
    management: '890122',
    assetDescription: 'RESEPTOR DE SEÑAL CON NUMERO DE SERIE: 323211',
    unitMeasure: 'PIEZA',
    physicalState: 'BUENO',
    stateConsercation: 'BUENO',
  },
];

var data2 = [
  {
    status: 'NUEVO',
    clarificationStatus: '',
    clarificationSAT: '',
    typeOfClarification: 'ACLARACION',
    clarification: 'ACLARACION EN ESTADO FISICO',
    typeClarification: '1',
    dateClarification: '12/10/2022',
    reason: 'ACLARACION DEL ESTADO FISICO DEL BIEN',
    observation: '',
  },
];

@Component({
  selector: 'app-notification-assets-tab',
  templateUrl: './notification-assets-tab.component.html',
  styles: [],
})
export class NotificationAssetsTabComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;

  settings2: any;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs2: any[] = [];
  totalItems2: number = 0;
  notifyAssetsSelected: any[] = [];
  bsModalRef: BsModalRef;

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: LIST_ASSETS_COLUMN,
    };
    this.settings2 = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: NOTIFY_ASSETS_COLUMNS,
    };

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData(): void {
    this.paragraphs = data1;
  }

  listAssetsRowSelected(event?: any): void {
    console.log(event);
    if (event.data.id === 1) {
      this.paragraphs2 = data2;
    } else {
      this.paragraphs2 = [];
    }
  }

  notifyAssetRowSelected(event: any) {
    this.notifyAssetsSelected.push(event.data);
  }

  acceptClariImpro() {
    if (this.notifyAssetsSelected.length != 1) {
      this.message('Error', 'Seleccione almenos un registro!');
      return;
    }
    this.openModal();
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

  openModal(): void {
    let config: ModalOptions = {
      initialState: {
        clarification: this.notifyAssetsSelected[0],
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(
      NotifyAssetsImproprietyFormComponent,
      config
    );

    /*  this.bsModalRef.content.event.subscribe((res: IRequestInTurnSelected) => {
      console.log(res);
      this.requestForm.get('receiUser').patchValue(res.user);
    }); */
  }
}
