import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

const EXAMPLE_DATA = [
  {
    nmtabla: 9,
    otclave: 2,
    otvalor: 'MENSAJERIA',
    no_registro: 2710785,
    abreviatura: 'NULL',
  },
  {
    nmtabla: 9,
    otclave: 7,
    otvalor: 'OTROS',
    no_registro: 2710787,
    abreviatura: 'NULL',
  },
  {
    nmtabla: 9,
    otclave: 12,
    otvalor: 'co',
    no_registro: 2710789,
    abreviatura: 'NULL',
  },
  {
    nmtabla: 9,
    otclave: 14,
    otvalor: 'CORREO CERTIFICADO',
    no_registro: 2710790,
    abreviatura: 'NULL',
  },
  {
    nmtabla: 9,
    otclave: 1,
    otvalor: 'VIA SAT',
    no_registro: 122445587,
    abreviatura: 'NULL',
  },
  {
    nmtabla: 9,
    otclave: 15,
    otvalor: 'VIA SIJ',
    no_registro: 91311643,
    abreviatura: 'NULL',
  },
  {
    nmtabla: 9,
    otclave: 16,
    otvalor: 'VIA ELECTRÓNICA',
    no_registro: 474059533,
    abreviatura: 'NULL',
  },
  {
    nmtabla: 9,
    otclave: 3,
    otvalor: 'FAX',
    no_registro: 2710188,
    abreviatura: 'NULL',
  },
  {
    nmtabla: 9,
    otclave: 8,
    otvalor: 'PERSONAL',
    no_registro: 2710189,
    abreviatura: 'NULL',
  },
  {
    nmtabla: 9,
    otclave: 10,
    otvalor: 'TELEGRAMA',
    no_registro: 2710190,
    abreviatura: 'NULL',
  },
  {
    nmtabla: 9,
    otclave: 13,
    otvalor: 'MENSAJERIA PRIVADA',
    no_registro: 2710191,
    abreviatura: 'NULL',
  },
];
@Component({
  selector: 'dynamic-catalog-select',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './dynamic-catalog-select.component.html',
  styles: [],
})
export class DynamicCatalogSelectComponent implements OnInit {
  @Input() goodForm: FormGroup;
  @Input() feature: any;
  dynamicData = new DefaultSelect([], 0);
  constructor(private dynamicCatalogService: DynamicCatalogService) {}

  ngOnInit(): void {
    console.log(this.feature);
  }

  getDynamicData(params: ListParams) {
    this.dynamicCatalogService
      .getDynamicData(this.feature.cdtabla, params)
      .subscribe({
        next: data =>
          (this.dynamicData = new DefaultSelect(data.data, data.count)),
      });
  }
}
