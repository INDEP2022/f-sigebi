import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { PAGE_SETUP_COLUMNS } from './page-setup-columns';

@Component({
  selector: 'app-c-bm-vm-c-cp-page-setup',
  templateUrl: './c-bm-vm-c-cp-page-setup.component.html',
  styles: [
  ]
})
export class CBmVmCCpPageSetupComponent extends BasePage implements OnInit {

  
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: {...PAGE_SETUP_COLUMNS},
    }
  }

  ngOnInit(): void {
  }

  data = [
    {
      table: "Comer_soladjinsgob",
      column: "ID_tipoentgob",
      ak: "sol",
      orderColumns: 1,
      ak2: "Cve. Tpo Entidad"
    },
    {
      table: "Comer_soladjinsgob",
      column: "Estado",
      ak: "sol",
      orderColumns: 3,
      ak2: "Estado"
    },
    {
      table: "Comer_soladjinsgob",
      column: "descripcion",
      ak: "det",
      orderColumns: 11,
      ak2: "Descripción Bien"
    },
    {
      table: "Comer_soladjinsgob",
      column: "Delegación",
      ak: "det",
      orderColumns: 12,
      ak2: "Delegación"
    },
    {
      table: "Comer_soladjinsgob",
      column: "Ubicación",
      ak: "det",
      orderColumns: 13,
      ak2: "Ubicación"
    },
    {
      table: "Comer_soladjinsgob",
      column: "Valor_Avaluo",
      ak: "det",
      orderColumns: 14,
      ak2: "Valor Avaluo"
    }
  ]

}
