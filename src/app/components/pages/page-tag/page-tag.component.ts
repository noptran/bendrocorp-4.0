import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-tag',
  templateUrl: './page-tag.component.html',
  styleUrls: ['./page-tag.component.scss'],
})
export class PageTagComponent implements OnInit {

  // input is a comma seperated list of tags
  @Input() tags: string;

  constructor() { }

  parsedTags() {
    if (this.tags) {
      // tslint:disable-next-line:prefer-const
      let tagArray = this.tags.split(',');
      // trim the array items
      for (let index = 0; index < tagArray.length; index++) {
        tagArray[index] = tagArray[index].trim();
      }
      // return tags
      return tagArray;
    }
  }

  ngOnInit() {
  }

}
