import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-c-fc-c-commercial-file',
  templateUrl: './c-fc-c-commercial-file.component.html',
  styles: [],
})
export class CFcCCommercialFileComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noGood: [null, [Validators.required]],
    });
  }
}
