import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'form-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-loader.component.html',
  styles: [
    `
      .loader {
        /* height: 8rem; */
        position: absolute;
        top: 12px;
        left: 0;
        right: 0;
        bottom: 0;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100px 100px;
        z-index: 100;
        content: '';
      }
      .loader-msg {
        margin-top: 12rem;
      }
    `,
  ],
})
export class FormLoaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
