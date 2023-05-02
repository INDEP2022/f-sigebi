import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISafe } from 'src/app/core/models/catalogs/safe.model';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalListGoodsComponent } from '../modal-list-goods/modal-list-goods.component';

export interface ExampleVault {
  number: number;
  description: string;
  location: string;
  responsible: string;
  entity: string;
  municipality: string;
  city: string;
  locality: string;
  goods?: ExapleGoods[];
}

export interface ExapleGoods {
  numberGood: number;
  description: string;
  quantity: number;
  dossier: string;
}

@Component({
  selector: 'app-vault-consultation',
  templateUrl: './vault-consultation.component.html',
  styles: [],
})
export class VaultConsultationComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  vaults: ISafe[] = [];
  //Data Table

  constructor(
    private modalService: BsModalService,
    private safeService: SafeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        idSafe: {
          title: 'No',
          width: '10%',
          sort: false,
        },
        description: {
          title: 'Descripcion',
          width: '20%',
          sort: false,
        },
        ubication: {
          title: 'Ubicacion',
          width: '10%',
          sort: false,
        },
        manager: {
          title: 'Responsable',
          width: '10%',
          sort: false,
        },
        stateCode: {
          title: 'Entidad',
          width: '10%',
          sort: false,
        },
        municipalityCode: {
          title: 'Municipio',
          width: '10%',
          sort: false,
        },
        cityCode: {
          title: 'Ciudad',
          width: '10%',
          sort: false,
        },
        localityCode: {
          title: 'Localidad',
          width: '10%',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getVaults());
  }

  getVaults() {
    this.loading = true;
    this.safeService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.vaults = response.data.map(vault => {
          return {
            idSafe: vault.idSafe,
            description: vault.description,
            localityCode: vault.localityDetail.nameLocation,
            cityCode: vault.cityDetail.nameCity,
            municipalityCode: vault.municipalityDetail.nameMunicipality,
            registerNumber: vault.registerNumber,
            responsibleDelegation: vault.manager,
            stateCode: vault.stateDetail.descCondition,
            ubication: vault.ubication,
            cityDetail: null,
            manager: vault.manager,
          };
        });
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  select(event: any) {
    console.log(event.data.idSafe);
    event.data
      ? this.openModal(event.data.idSafe)
      : this.alert('info', 'Ooop...', 'Esta Bóveda no contiene Bines');
  }

  openModal(data: any): void {
    this.modalService.show(ModalListGoodsComponent, {
      initialState: data,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
}
