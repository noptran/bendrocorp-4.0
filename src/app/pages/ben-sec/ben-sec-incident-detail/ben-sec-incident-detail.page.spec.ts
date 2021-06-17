import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BenSecIncidentDetailPage } from './ben-sec-incident-detail.page';

describe('BenSecIncidentDetailPage', () => {
  let component: BenSecIncidentDetailPage;
  let fixture: ComponentFixture<BenSecIncidentDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenSecIncidentDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BenSecIncidentDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
