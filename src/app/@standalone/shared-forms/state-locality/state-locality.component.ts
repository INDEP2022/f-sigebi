import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'state-locality',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './state-locality.component.html',
  styles: [],
})
export class StateLocalityComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() typeField: string = '';
  @Input() subtypeField: string = '';
  @Input() ssubtypeField: string = '';
  @Input() sssubtypeField: string = '';
  @Input() inlineForm: boolean = false;
  @Input() columns: number = 4;
  @Input() goodTypeShow: boolean = true;
  @Input() subTypeShow: boolean = true;
  @Input() ssubTypeShow: boolean = true;
  @Input() sssubTypeShow: boolean = true;
  rowClass: string;

  params = new BehaviorSubject<ListParams>(new ListParams());
  @Input() states = new DefaultSelect();
  @Input() cities = new DefaultSelect();
  @Input() municipalities = new DefaultSelect();
  @Input() localities = new DefaultSelect();

  // @Output() goodTypeChange = new EventEmitter<IGoodType>();
  // @Output() goodSubtypeChange = new EventEmitter<IGoodSubType>();
  // @Output() goodSsubtypeChange = new EventEmitter<IGoodsSubtype>();
  // @Output() goodSssubtypeChange = new EventEmitter<IGoodSssubtype>();
  constructor() {}

  ngOnInit(): void {
    console.log('d');
  }
}
