import { Component, OnInit } from '@angular/core';
import { ScriptService } from 'src/app/core/services/script.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styles:[]
})
export class ContentComponent implements OnInit {

  constructor(
    private scriptService: ScriptService
  ) { }

  ngOnInit(): void {
    this.scriptService.removeScript('my-script');
  }

}
