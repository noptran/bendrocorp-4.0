import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OffenderReportPage } from './offender-report.page';

describe('OffenderReportPage', () => {
  let component: OffenderReportPage;
  let fixture: ComponentFixture<OffenderReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffenderReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OffenderReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
