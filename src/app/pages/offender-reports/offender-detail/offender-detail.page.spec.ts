import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OffenderDetailPage } from './offender-detail.page';

describe('OffenderDetailPage', () => {
  let component: OffenderDetailPage;
  let fixture: ComponentFixture<OffenderDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffenderDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OffenderDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
