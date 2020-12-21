import { Component, Input, OnInit } from '@angular/core';
import { Page } from 'src/app/models/page.model';

@Component({
  selector: 'app-page-snippet',
  templateUrl: './page-snippet.component.html',
  styleUrls: ['./page-snippet.component.scss'],
})
export class PageSnippetComponent implements OnInit {
  @Input() page: Page = {} as Page;
  constructor() { }

  ngOnInit() {}

}
