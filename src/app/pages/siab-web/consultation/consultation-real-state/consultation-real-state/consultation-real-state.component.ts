import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { REAL_STATE_COLUMNS } from './consultation-real-state-columns';

@Component({
  selector: 'app-consultation-real-state',
  templateUrl: './consultation-real-state.component.html',
  styles: [],
})
export class ConsultationRealStateComponent extends BasePage implements OnInit {
  //data: any;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        ...REAL_STATE_COLUMNS,
        seleccion: {
          title: 'Selección',
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectDelegation(instance),
          sort: false,
          filter: false,
        },
      },
    };
  }

  onSelectDelegation(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        //this.selectDelegation(data.row, data.toggle),
        console.log(data);
      },
    });
  }

  ngOnInit(): void {}

  rowsSelected(event: any) {
    //console.log(event.isSelected);
  }

  generateReport() {}

  data: any = [
    {
      clasific: 'test',
      description: 'test123123',
    },
    {
      clasific: 'test1',
      description: 'test123123',
    },
    {
      clasific: 'test2',
      description: 'test123123',
    },
  ];
}
