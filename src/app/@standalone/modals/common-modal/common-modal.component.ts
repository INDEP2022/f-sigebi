import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-common-modal',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './common-modal.component.html',
  styles: [],
})
export class CommonModalComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
