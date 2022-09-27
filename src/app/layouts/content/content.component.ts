import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styles: [
  ]
})
export class ContentComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    const header: HTMLCollectionOf<HTMLElement> = this.document.getElementsByTagName('header')
    header[0]?.remove()
    const footer: HTMLCollectionOf<HTMLElement> = this.document.getElementsByTagName('footer')
    footer[0]?.remove()
  }

}
