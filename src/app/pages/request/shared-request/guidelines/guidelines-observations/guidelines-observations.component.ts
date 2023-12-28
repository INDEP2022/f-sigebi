import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-guidelines-observations',
  templateUrl: './guidelines-observations.component.html',
  styles: [],
})
export class GuidelinesObservationsComponent
  extends DefaultEditor
  implements OnInit {

  @Input() value: string | number;
  @Input() rowData: any;
  @Input() key: any;
  selectForm: FormGroup = new FormGroup({});
  @Output() cellChanged = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {

    this.selectForm = this.fb.group({
      observations: [null],
    });

    this.selectForm.controls['observations'].setValue(this.value)

    this.selectForm.valueChanges.subscribe((object) => {
      this.rowData[this.key] = object.observations;
      this.cellChanged.emit(this.rowData);
    });

  }

  change(event) {
    this.rowData[this.key] = this.value;
    this.cellChanged.emit(this.rowData);
  }

}
