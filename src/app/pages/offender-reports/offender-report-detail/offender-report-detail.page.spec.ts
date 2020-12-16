import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OffenderReportDetailPage } from './offender-report-detail.page';

describe('OffenderReportDetailPage', () => {
  let component: OffenderReportDetailPage;
  let fixture: ComponentFixture<OffenderReportDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffenderReportDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OffenderReportDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
