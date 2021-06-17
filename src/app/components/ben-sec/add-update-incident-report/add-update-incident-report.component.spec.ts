import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddUpdateIncidentReportComponent } from './add-update-incident-report.component';

describe('AddUpdateIncidentReportComponent', () => {
  let component: AddUpdateIncidentReportComponent;
  let fixture: ComponentFixture<AddUpdateIncidentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateIncidentReportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateIncidentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
