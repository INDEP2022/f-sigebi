import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewCell } from 'ng2-smart-table';
import { isNullOrEmpty } from '../../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';

@Component({
  selector: 'app-guidelines-revision',
  templateUrl: './guidelines-revision.component.html',
  styles: [],
})
export class GuidelinesRevisionComponent implements ViewCell, OnInit {
  @Input() value: string | number;
  @Input() rowData: any;
  @Input() key: any;
  @Output() cellChanged = new EventEmitter<any>();

  selectForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.selectForm = this.fb.group({
      revision: [null],
    });

    this.selectForm.controls['revision'].setValue(this.value);

    this.selectForm.valueChanges.subscribe(object => {
      if (!isNullOrEmpty(object.revision)) {
        this.rowData[this.key] = object.revision;
        this.cellChanged.emit(this.rowData);
      }
    });
  }
}
