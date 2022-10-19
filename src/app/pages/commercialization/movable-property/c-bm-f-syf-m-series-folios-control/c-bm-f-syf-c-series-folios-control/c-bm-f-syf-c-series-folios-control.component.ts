import { Component, OnInit } from '@angular/core';

import { BasePage } from 'src/app/core/shared/base-page';
import { SERIES_FOLIOS_CONTROL_COLUMNS } from './series-folios-control-columns';

import { BsModalService } from 'ngx-bootstrap/modal';
import { CBmFSyfMSeriesFoliosControlModalComponent } from '../c-bm-f-syf-m-series-folios-control-modal/c-bm-f-syf-m-series-folios-control-modal.component';

@Component({
  selector: 'app-c-bm-f-syf-c-series-folios-control',
  templateUrl: './c-bm-f-syf-c-series-folios-control.component.html',
  styles: [],
})
export class CBmFSyfCSeriesFoliosControlComponent
  extends BasePage
  implements OnInit
{
  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...SERIES_FOLIOS_CONTROL_COLUMNS },
    };
  }

  ngOnInit(): void {}

  data = [
    {
      id: '81',
      coord: '0',
      regional: 'OFICINAS CENTRALES',
      serie: 'H',
      foInicial: '13886',
      foFinal: '14200',
      validez: '10/11/2010',
      tipo: 'Factura',
      estatus: 'CER',
      totalFolios: '315',
      folRegistrados: '0',
      folUtilizados: '315',
      fecUsuario: 'GBLANCO',
      fecRegistro: '28/12/2009',
      direccion: 'M',
    },
    {
      id: '101',
      coord: '0',
      regional: 'OFICINAS CENTRALES',
      serie: 'E',
      foInicial: '35001',
      foFinal: '40000',
      validez: '10/11/2010',
      tipo: 'Factura',
      estatus: 'CER',
      totalFolios: '5000',
      folRegistrados: '0',
      folUtilizados: '5000',
      fecUsuario: 'VFIESCO',
      fecRegistro: '12/01/2010',
      direccion: '',
    },
    {
      id: '262',
      coord: '0',
      regional: 'OFICINAS CENTRALES',
      serie: 'INGRB',
      foInicial: '1',
      foFinal: '1000000',
      validez: '30/10/2023',
      tipo: 'Factura CFDI',
      estatus: 'ACT',
      totalFolios: '1000000',
      folRegistrados: '965350',
      folUtilizados: '34650',
      fecUsuario: 'GBLANCO',
      fecRegistro: '12/12/2011',
      direccion: 'M',
    },
  ];

  openModal(): void {
    const modalRef = this.modalService.show(
      CBmFSyfMSeriesFoliosControlModalComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }
}
