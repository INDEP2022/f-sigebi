import { Component } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { Column } from 'ng2-smart-table/lib/lib/data-set/column';

@Component({
    template: `
    <div title="Aquí va tu tooltip">{{ column.title }} DT</div>
  `,
})
export class CustomHeaderComponent extends DefaultEditor {
    column: Column;
    constructor() {
        super();
    }
}