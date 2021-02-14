import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { FieldDescriptor } from 'src/app/models/field.model';
import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page.service';
import { environment } from 'src/environments/environment';
import { Plugins } from '@capacitor/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Remarkable } from 'remarkable';
const { Toast } = Plugins;

@Component({
  selector: 'app-add-remove-page',
  templateUrl: './add-remove-page.page.html',
  styleUrls: ['./add-remove-page.page.scss'],
})
export class AddRemovePagePage implements OnInit {
// https://stackoverflow.com/questions/50735181/insert-markdown-for-bold-and-italics-around-selection

  readonly pageId: string;
  pageUri: string;
  page: Page;
  userId: number;
  isEditor: boolean;
  isAdmin: boolean;

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;
  pageCategories: FieldDescriptor[];

  // this is for the form only
  formCategoryIds: string[];
  editorConfig: any;
  dataSubmitted: boolean;

  // other
  md = new Remarkable();
  // sanitizedContent: SafeHtml;

  constructor(
    private pageService: PageService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private loading: LoadingController,
    private domSanitizer: DomSanitizer,
    private elementRef: ElementRef
  ) {
    this.pageId = this.route.snapshot.paramMap.get('id').split('-')[0];

    if (this.router.getCurrentNavigation()?.extras.state?.page) {
      this.page = this.router.getCurrentNavigation().extras.state.page as Page;
      this.pageUri = `${this.page.id.split('-')[0]}-${this.page.title.toLowerCase().split(' ').join('-')}`;
    }
  }

  renderMarkdown(): SafeHtml {
    if (this.page) {
      return this.domSanitizer.bypassSecurityTrustHtml(this.md.render(this.page.content));
    }
  }

  async setConfig() {
    // this.editorConfig = {
    //   placeholder: '',
    //   tabsize: 2,
    //   height: '200px',
    //   // for the initial roll out we are going to skip this and put images inline
    //   // TODO: The initial idea for this is not going to cut it, we can use image_uploads but they need a many to many
    //   // relationship with the pages
    //   uploadImagePath: `${environment.baseUrl}/pages/${this.page.id}/images?access_token=${await this.authService.checkAndRefreshAccessToken()}`,
    //   toolbar: [
    //       ['misc', ['codeview', 'undo', 'redo']],
    //       ['style', ['bold', 'italic', 'underline', 'clear']],
    //       ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
    //       ['fontsize', ['fontsize']],
    //       ['para', ['style', 'ul', 'ol', 'paragraph']],
    //       ['insert', ['table', 'picture', 'link', 'video', 'hr']]
    //   ],
    //   fontNames: ['Univia-Pro'], // we dont want any special fonts
    // };
  }

  async getPage() {
    if (this.pageId) {
      this.pageService.pageSearch(this.pageId)
      .subscribe(async (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.page = results[0] as Page;
          this.pageUri = `${this.page.id.split('-')[0]}-${this.page.title.toLowerCase().split(' ').join('-')}`;

          this.initParseIdsToCatArray();
          await this.setConfig();

          if (this.loadingIndicator) {
            this.loadingIndicator.dismiss();
          }
        } else {
          this.router.navigate(['pages']);
        }
      });
    }
  }

  async updatePage() {
    if (this.page && this.page.id) {
      this.dataSubmitted = true;

      // setup the loading indicator
      this.loadingIndicator = await this.loading.create({
        message: 'Updating'
      });
      await this.loadingIndicator.present();

      this.pageService.updatePage(this.page).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          console.log('updated!');
          Toast.show({
            text: 'Page updated!'
          });
          this.dataSubmitted = false;
          this.pageService.refreshData();
        }

        // dismiss the indicator
        if (this.loadingIndicator) {
          this.loading.dismiss();
        }
      });
    }
  }

  getCategories(): Promise<boolean> {
    return new Promise((resolve, error) => {
      this.pageService.listPageCategories().subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.pageCategories = results;
          resolve(true);
        } else {
          error(false);
        }
      });
    });
  }

  initParseIdsToCatArray() {
    if (this.page && this.page.categories) {
      this.formCategoryIds = this.page.categories.map((category) => {
        return category.id;
      });
    }
  }

  insertFormatting(text: string, defaultTxt = '', text2 = '') {
    const contentInput: HTMLTextAreaElement = this.elementRef.nativeElement.querySelector('textarea');
    const selectionStart = contentInput.selectionStart;
    const selectionEnd = contentInput.selectionEnd;
    const pageContentLength = this.page.content.length;

    console.log(contentInput);
    console.log(contentInput.selectionStart);
    console.log(contentInput.selectionEnd);

    // var selectionStart = txtarea.selectionStart
    // var selectionEnd = txtarea.selectionEnd
    // var scrollPos = txtarea.scrollTop;
    const caretPos = selectionStart;
    let mode = 0; // Adding markdown with selected text
    let front = (this.page.content).substring(0, caretPos);
    let back = (this.page.content).substring(selectionEnd, pageContentLength);
    let middle = (this.page.content).substring(caretPos, selectionEnd);

    if (text2 == '') {
      text2 = text;
    }
    let textLen = text.length;
    let text2Len = text2.length;

    if (selectionStart === selectionEnd) {
      middle = defaultTxt;
      mode = 1; // Adding markdown with default text
    } else {
      if (front.substr(-textLen) === text && back.substr(0, text2Len) === text2) {
        front = front.substring(0, front.length - textLen);
        back = back.substring(text2Len, back.length);
        text = '';
        text2 = '';
        mode = 2; // Removing markdown with selected text eg. **<selected>bold<selected>**
      } else if (middle.substr(0, textLen) == text && middle.substr(-text2Len) == text2) {
        middle = middle.substring(textLen, middle.length - text2Len);
        text = '';
        text2 = '';
        mode = 3; // Removing markdown with selected text eg. <selected>**bold**<selected>
      }
    }
    this.page.content = front + text + middle + text2 + back;
    // if (selectionStart !== selectionEnd) {
    //   if (mode === 0) {
    //     txtarea.selectionStart = selectionStart + textLen;
    //     txtarea.selectionEnd = selectionEnd + textLen;
    //   } else if (mode === 2) {
    //     txtarea.selectionStart = selectionStart - textLen;
    //     txtarea.selectionEnd = selectionEnd - textLen;
    //   } else if (mode === 3) {
    //     txtarea.selectionStart = selectionStart;
    //     txtarea.selectionEnd = selectionEnd - textLen - text2Len;
    //   }
    // } else {
    //   txtarea.selectionStart = selectionStart + textLen;
    //   txtarea.selectionEnd = txtarea.selectionStart + middle.length;
    // }
    // txtarea.focus();
    // txtarea.scrollTop = scrollPos;
  }

  noDefault(event: MouseEvent) {
    event.preventDefault();
  }

  async ngOnInit() {
    // get the user id
    this.userId = (await this.authService.retrieveUserSession()).id;

    // get the auth data
    this.isEditor = (await this.authService.hasClaim(29) || await this.authService.hasClaim(30));
    this.isAdmin = await this.authService.hasClaim(30);

    await this.getCategories();

    if (!this.page) {
      //
      console.log('page not passed - fetching');

      // setup the loading indicator
      this.loadingIndicator = await this.loading.create({
        message: 'Loading'
      });
      await this.loadingIndicator.present();
      this.getPage();
    } else {
      console.log('page passed from parent');

      await this.setConfig();

      this.initParseIdsToCatArray();
    }
  }

}
