import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { ZoneGeographicService } from 'src/app/core/services/catalogs/zone-geographic.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { ZonesService } from 'src/app/core/services/zones/zones.service';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { ModelForm } from '../../../../../core/interfaces/model-form';
import { BasePage } from '../../../../../core/shared/base-page';
import { DefaultSelect } from '../../../../../shared/components/select/default-select';
import { AnnexKComponent } from '../annex-k/annex-k.component';
import { LIST_ORDERS_COLUMNS } from './columns/list-orders-columns';

@Component({
  selector: 'app-generate-query',
  templateUrl: './generate-query.component.html',
  styleUrls: ['./generate-query.component.scss'],
})
export class GenerateQueryComponent extends BasePage implements OnInit {
  @ViewChild('table', { static: false }) table: any;
  title: string = 'Genera Consulta';
  orderServiceForm: ModelForm<any>;
  geographicalAreaSelected = new DefaultSelect();
  contractNumberSelected = new DefaultSelect();
  selectedRows: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;

  sendData: any[] = [];
  //Datos Anexo para pasar
  dataAnnex: any;

  private zoneGeoService = inject(ZoneGeographicService);
  private zones = inject(ZonesService);
  private orderService = inject(OrderServiceService);
  private authService = inject(AuthService);
  private deleRegService = inject(RegionalDelegationService);

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: LIST_ORDERS_COLUMNS,
    };
    this.initForm();
    this.getgeographicalAreaSelect(new ListParams());
  }

  initForm() {
    this.orderServiceForm = this.fb.group({
      geographicalArea: [null],
      samplingPeriod: [null],
      contractNumber: ['SAE/00084/2018'],
    });
  }

  getDelegReg() {
    const delegation = this.authService.decodeToken();
    console.log(delegation);
    return delegation.department;
  }

  searchOrders() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData(data);
    });
  }

  getData(params: ListParams) {
    this.loading = true;
    const deleReg = this.getDelegReg();
    const body = {
      contractNumber: this.orderServiceForm.value.contractNumber,
      pdDate: moment(this.orderServiceForm.value.samplingPeriod).format(
        'YYYY-MM-DD'
      ),
      regionalDelegationId: deleReg,
    };
    const page = params.page;
    const limit = params.limit;
    this.orderService.getSamplingOrderView(body, page, limit).subscribe({
      next: resp => {
        const result = resp.data.map(async (item: any) => {
          const delegation: any = await this.getDelegationRegional(
            item.regionalDelegation
          );
          item['delegationName'] = delegation;
        });

        Promise.all(result).then(() => {
          this.paragraphs = resp.data;
          this.totalItems = resp.count;
          this.loading = false;
        });
      },
    });
  }

  addOrders(): void {
    if (this.selectedRows.length == 0) {
      this.onLoadToast('info', 'Seleccione al menos una orden de servicio');
      return;
    }
    this.sendData = this.selectedRows;
    setTimeout(() => {
      this.selectedRows = [];
      const table = this.table.grid.getRows();
      for (let i = 0; i < table.length; i++) {
        const element = table[i];
        element.isSelected = false;
      }
    }, 500);
  }

  rowsSelected(event: any) {
    this.selectedRows = event.selected;
  }

  getContractNumberSelect(numbContract: any) {
    this.contractNumberSelected = new DefaultSelect([numbContract]);
  }

  getgeographicalAreaSelect(params: ListParams) {
    this.zoneGeoService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.geographicalAreaSelected = new DefaultSelect(
          resp.data,
          resp.count
        );
      },
    });
  }

  zoneGeographChange(event: any) {
    if (event == undefined) {
      this.geographicalAreaSelected = new DefaultSelect();
      this.contractNumberSelected = new DefaultSelect();
    } else {
      console.log(event);
      const value = { contractNumber: event.contractNumber };
      this.getContractNumberSelect(value);
    }
  }

  openAnnexK() {
    this.openModal(AnnexKComponent, '', 'generate-query');
  }

  turnSampling() {}

  save() {}

  openModal(component: any, data?: any, typeAnnex?: string) {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeAnnex: typeAnnex,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(component, config);
  }

  getDelegationRegional(id: number) {
    return new Promise((resolve, reject) => {
      this.deleRegService.getById(id).subscribe({
        next: resp => {
          resolve(resp.description);
        },
      });
    });
  }
}
