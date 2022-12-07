import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-flat-file-notifications',
  templateUrl: './flat-file-notifications.component.html',
  styles: [],
})
export class FlatFileNotificationsComponent implements OnInit {
  notificationsForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.notificationsForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      file: [null],
    });
  }
}
