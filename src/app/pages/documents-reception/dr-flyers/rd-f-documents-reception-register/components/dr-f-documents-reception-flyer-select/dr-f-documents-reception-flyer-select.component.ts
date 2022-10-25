import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-dr-f-documents-reception-flyer-select',
  templateUrl: './dr-f-documents-reception-flyer-select.component.html',
  styles: [],
})
export class DrFDocumentsReceptionFlyerSelectComponent implements OnInit {
  flyerForm = this.fb.group({
    flyerNumber: new FormControl<string | number>(null, [Validators.required]),
  });
  flyers = new DefaultSelect<{ id: number }>(
    FLYERS_EXAMPLE,
    FLYERS_EXAMPLE.length
  );
  callback?: (next: string | number) => void;
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private modalRef: BsModalRef
  ) {}

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }

  confirm() {
    const flyerNumber = this.flyerForm.controls.flyerNumber.value;
    this.modalRef.content.callback(flyerNumber);
    this.modalRef.hide();
  }
}

const FLYERS_EXAMPLE = [
  {
    id: 123456,
  },
  {
    id: 789455,
  },
  {
    id: 855123,
  },
  {
    id: 854123,
  },
  {
    id: 320145,
  },
];
