import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagesPageRoutingModule } from './pages-routing.module';

import { PagesPage } from './pages.page';
import { PageSnippetComponent } from 'src/app/components/pages/page-snippet/page-snippet.component';
import { PageTagComponent } from 'src/app/components/pages/page-tag/page-tag.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagesPageRoutingModule
  ],
  declarations: [
    PagesPage,
    PageSnippetComponent,
    PageTagComponent,
  ]
})
export class PagesPageModule {}
