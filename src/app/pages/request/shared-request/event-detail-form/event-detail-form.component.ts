import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { SCHEDULING_DELIVERIES_COLUMNS } from './columns/scheduling-deliveries-columns';
@Component({
  selector: 'app-event-detail-form',
  templateUrl: './event-detail-form.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class EventDetailFormComponent extends BasePage implements OnInit {
  @Input() op: number;
  paragraphs: any[] = [];
  searchForm: FormGroup = new FormGroup({});
  showDetails: boolean = true;
  showSearch: boolean = false;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private fb: FormBuilder) {
    super();

    this.settings = {
      ...this.settings,
      columns: SCHEDULING_DELIVERIES_COLUMNS,
      edit: { editButtonContent: 'Documentos' },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.searchForm = this.fb.group({
      numberGestion: [null],
      numberSae: [null],
      numberInventory: [null],
      goodDescription: [null, [Validators.pattern(STRING_PATTERN)]],
      item: [null, [Validators.pattern(STRING_PATTERN)]],
      quantityGoods: [null],
      typeGood: [null, [Validators.pattern(STRING_PATTERN)]],
      unitOfMeasurement: [null],
      origin: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  showDocument() {
    alert('Documentos');
  }
}
