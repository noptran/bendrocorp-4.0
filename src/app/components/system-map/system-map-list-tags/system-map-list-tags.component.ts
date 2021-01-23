import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-map-list-tags',
  templateUrl: './system-map-list-tags.component.html',
  styleUrls: ['./system-map-list-tags.component.scss'],
})
export class SystemMapListTagsComponent {

  // input is a comma seperated list of tags
  @Input() tags: string;
  @Input() limitTags = false;

  constructor() { }

  tagRestricted(tagText: string) {
    return (tagText.toLowerCase() === 'restricted');
  }

  parsedTags() {
    if (this.tags) {
      // tslint:disable-next-line:prefer-const
      let tagArray = this.tags.split(',');
      // trim the array items
      for (let index = 0; index < tagArray.length; index++) {
        tagArray[index] = tagArray[index].trim();
      }
      // return tags
      if (tagArray.length > 3 && this.limitTags) {
        tagArray.length = 3;
        return tagArray;
      } else {
        return tagArray;
      }
    }
  }

}
