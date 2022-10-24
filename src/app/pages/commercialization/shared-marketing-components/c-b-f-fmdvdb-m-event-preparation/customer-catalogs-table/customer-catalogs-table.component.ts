import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { CUSTOMER_CATALOGS_COLUMNS } from './customer-catalogs-columns';

@Component({
  selector: 'app-customer-catalogs-table',
  templateUrl: './customer-catalogs-table.component.html',
  styles: [],
})
export class CustomerCatalogsTableComponent extends BasePage implements OnInit {
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...CUSTOMER_CATALOGS_COLUMNS },
    };
  }

  ngOnInit(): void {}

  data = [
    {
      id_cliente: 1469,
      nom_razon: 'RODOLFO SILVEYRA IBARRA',
      rfc: 'SIIR480502JA1',
      id_vendedor: 789,
      calle: 'AVE FRANCISCO I MAD PTE 1701',
      ciudad: 'LOS MOCHIS',
      colonia: 'CUAUHTEMOC',
      delegacion: 'LOS MOCHIS',
      cp: '81249',
      pais: 'MÉXICO',
      fax: '',
      telefono: '',
      correoweb: 'osttic364@indep.gob.mx',
      estado: 'SINALOA',
      curp: '',
    },
    {
      id_cliente: 1470,
      nom_razon: 'ALCANTARA REYES MIGUEL ANGEL',
      rfc: 'ALRM750802',
      id_vendedor: 514,
      calle: 'Cuautitlan #144 mz 213 lt.28 #144',
      ciudad: 'ECATEPEC',
      colonia: 'CD.AZTECA',
      delegacion: 'LOS MOCHIS',
      cp: '81249',
      pais: 'MÉXICO',
      fax: '',
      telefono: '',
      correoweb: 'osttic364@indep.gob.mx',
      estado: 'SINALOA',
      curp: '',
    },
    {
      id_cliente: 846,
      nom_razon: 'PEREZ TEXTLE JOSE AARON',
      rfc: 'PETJ700101',
      id_vendedor: '',
      calle: 'Tenochtitlan #2',
      ciudad: 'ZACATELCO',
      colonia: 'SECCION CUARTA',
      delegacion: 'ZACATELCO',
      cp: '81249',
      pais: 'MÉXICO',
      fax: '',
      telefono: '',
      correoweb: 'osttic364@indep.gob.mx',
      estado: 'SINALOA',
      curp: '',
    },
  ];
}
