import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OffenderReportsPage } from './offender-reports.page';

describe('OffenderReportsPage', () => {
  let component: OffenderReportsPage;
  let fixture: ComponentFixture<OffenderReportsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffenderReportsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OffenderReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
