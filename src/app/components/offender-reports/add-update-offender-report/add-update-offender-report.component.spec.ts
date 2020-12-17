import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddUpdateOffenderReportComponent } from './add-update-offender-report.component';

describe('AddUpdateOffenderReportComponent', () => {
  let component: AddUpdateOffenderReportComponent;
  let fixture: ComponentFixture<AddUpdateOffenderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateOffenderReportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateOffenderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
