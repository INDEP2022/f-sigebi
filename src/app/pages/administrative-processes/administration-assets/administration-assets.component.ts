import { Component } from '@angular/core';

@Component({
  template: `
    <div class="md-tabs">
      <tabset>
        <tab heading="Datos busqueda"><app-search-tab></app-search-tab></tab>
        <tab heading="Basic Title 1">Basic content 1</tab>
        <tab heading="Basic Title 2">Basic content 2</tab>
      </tabset>
    </div>
  `,
})
export class AdministrationAssetsComponent {}
