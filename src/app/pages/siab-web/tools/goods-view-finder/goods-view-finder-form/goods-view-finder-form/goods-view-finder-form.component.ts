import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ConsultTxtComponent } from '../components/consult-txt/consult-txt.component';
import { GoodsViewFinderShowComponent } from '../components/goods-view-finder-show/goods-view-finder-show.component';
import { GOODS_VIEW_FINDER_COLUMNS } from './goods-view-finder-columns';
import { goodsViewData } from './goods-view-finder-data';
import { DESTINATIONS_OPTIONS, PROCESS_OPTIONS } from './option-select';

@Component({
  selector: 'app-goods-view-finder-form',
  templateUrl: './goods-view-finder-form.component.html',
  styleUrls: ['./goods-view-finder-form.scss'],
})
export class GoodsViewFinderFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  transferents = new DefaultSelect();
  status = new DefaultSelect();
  processData = new DefaultSelect<any>(PROCESS_OPTIONS);
  destinations = new DefaultSelect<any>(DESTINATIONS_OPTIONS);
  regionalDelegations = new DefaultSelect<any>();
  warehouses = new DefaultSelect<any>();
  data = goodsViewData;
  counter = this.data.length;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  consultFile: string = '';
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: GOODS_VIEW_FINDER_COLUMNS,
      edit: {
        editButtonContent: '<i class="fa fa-eye text-info mx-2"></i>',
      },
    };

    console.log(this.processData);
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      numberGood: [null],
      numberGestion: [null],
      description: [null],
      process: [null],
      allDelegationRegional: [null],
      regionalDelegation: [null],
      allwarehouses: [null],
      warehouse: [null],
      destiny: [null],
      transferent: [null],
      allTransferents: [null],
      status: [null],
      allStatus: [null],
      ofDateRecepDocumental: [null],
      toTheDateRecepDocumental: [null],
      ofDateValidation: [null],
      toTheDateValidation: [null],
      ofDateSchedule: [null],
      toTheDateSchedule: [null],
      ofPhysicalReceptionDate: [null],
      toThePhysicalReceptionDate: [null],
      allDestiny: [null],
    });
  }

  getViewFinderSelect(event: ListParams) {
    console.log(event);
  }

  getRegionalDelegationSelect(event: ListParams) {
    console.log(event);
  }

  getStatusSelect(event: ListParams) {
    console.log(event);
  }

  getWarehouseSelect(event: ListParams) {
    console.log(event);
  }

  validateDowloadImages() {
    if (this.counter <= 200) {
      this.alert(
        'warning',
        '¡Aviso!',
        'Para poder realizar la descarga de las imágenes es necesario que se consulten máximo 200 bienes'
      );
    } else {
      alert('Descargado imagenes');
    }
  }

  validateExportImages() {
    if (this.consultFile) {
      this.onLoadToast(
        'success',
        'Exportación de bienes',
        'Bienes exportados correctamente'
      );
    } else {
      this.alert(
        'warning',
        '¡Aviso!',
        'Para poder realizar la exportación de bienes necesitas cargar un archivo txt'
      );
    }
  }

  consultTxt() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          this.consultFile = data;
        }
      },
    };

    const rejectionComment = this.modalService.show(
      ConsultTxtComponent,
      config
    );
  }

  view() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg' };

    config.initialState = {
      callback: (data: boolean) => {},
    };

    const viewGoods = this.modalService.show(
      GoodsViewFinderShowComponent,
      config
    );
  }

  resetForm() {
    this.form.reset();
  }

  consult() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea buscar el bien?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Bien buscado correctamente', '');
      }
    });
  }
}
