import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddUpdateIncidentReportCommentComponent } from './add-update-incident-report-comment.component';

describe('AddUpdateIncidentReportCommentComponent', () => {
  let component: AddUpdateIncidentReportCommentComponent;
  let fixture: ComponentFixture<AddUpdateIncidentReportCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateIncidentReportCommentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateIncidentReportCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
