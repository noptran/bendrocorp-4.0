import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddUpdateIntelCaseCommentComponent } from './add-update-intel-case-comment.component';

describe('AddUpdateIntelCaseCommentComponent', () => {
  let component: AddUpdateIntelCaseCommentComponent;
  let fixture: ComponentFixture<AddUpdateIntelCaseCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateIntelCaseCommentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateIntelCaseCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
