import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AddTagComponent } from '../add-tag/add-tag.component';

@Component({
  selector: 'app-ben-sec-tags',
  templateUrl: './ben-sec-tags.component.html',
  styleUrls: ['./ben-sec-tags.component.scss'],
})
export class BenSecTagsComponent implements OnInit {
  // handle tags in and out
  @Input() tags: string;
  @Output() tagsChange = new EventEmitter<string>();
  @Output() update = new EventEmitter<boolean>();

  @Input() editable = false;
  @Input() showNoTags = true;
  @Input() showInItem = false;

  tagArray: any[] = [];

  // form stuff
  tagForm: FormGroup;

  readonly noTagsText = 'no tags';
  constructor(
    private modalController: ModalController
  ) { }

  tagColor(tagText: string): string {
    if (tagText.toLowerCase() === 'restricted') {
      return 'danger';
    } else if (tagText.toLowerCase() === 'warning') {
      return 'warning';
    } else {
      return 'primary';
    }
  }

  onAddTag(event: {
    component: IonicSelectableComponent
  }) {
    // Show form.
    event.component.showAddItemTemplate();
  }

  async openAddTag() {
    const modal = await this.modalController.create({
      component: AddTagComponent
    });

    modal.onDidDismiss()
      .then((data) => {
        // tslint:disable-next-line: no-string-literal
        const tagText = data['data'];
        console.log(tagText);

        // handle the tag add
        if (tagText) {
          // first remove no tags if exists
          const noTagIndex = this.tagArray.indexOf(this.noTagsText); //.findIndex(x => x === this.noTagsText);
          if (noTagIndex !== -1) {
            this.tagArray.splice(noTagIndex, 1);
          }

          this.tagArray.push(tagText);
          // emit binding change
          this.tagsChange.emit(this.tagArray.join(','));

          // make sure the binding update can happen
          this.sendBindingUpdate();
        }
    });

    return await modal.present();
  }

  sendBindingUpdate() {
    // make sure the binding update can happen
    setTimeout(() => {
      // emit update
      this.update.emit();
    }, 700);
  }

  removeTag(tagIndex: number) {
    // remove the tag
    console.log(tagIndex);
    this.tagArray.splice(tagIndex, 1);

    // emit binding change
    this.tagsChange.emit(this.tagArray.join(','));

    // make sure the binding update can happen
    this.sendBindingUpdate();

    // if we ran out of tags again push no tags to the array
    if (this.tagArray.length === 0) {
      this.tagArray.push(this.noTagsText);
    }
  }

  cleanTag(tag: string): string {
    return tag.trim().replace(/\s\s+/g, ' ').replace(/\s+/g, '-').toLowerCase();
  }

  parseTags() {
    if (this.tags && this.tags.length > 0) {
      // tslint:disable-next-line:prefer-const
      this.tagArray = this.tags.split(',');
      // trim the array items
      for (let index = 0; index < this.tagArray.length; index++) {
        this.tagArray[index] = this.tagArray[index].trim();
      }
      // return tags
      return this.tagArray;
    } else {
      if (this.showNoTags) {
        return this.tagArray.push(this.noTagsText);
      } else {
        return this.tagArray;
      }
    }
  }

  ngOnInit() {
    this.parseTags();
  }

}
