import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bendro-safe-search-result-top',
  templateUrl: './bendro-safe-search-result-top.component.html',
  styleUrls: ['./bendro-safe-search-result-top.component.scss'],
})
export class BendroSafeSearchResultTopComponent implements OnInit {
  @Input() searchResult: any;
  constructor() { }

  ngOnInit() {}

}
