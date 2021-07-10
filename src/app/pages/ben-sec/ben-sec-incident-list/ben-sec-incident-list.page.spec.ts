import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BenSecIncidentListPage } from './ben-sec-incident-list.page';

describe('BenSecIncidentListPage', () => {
  let component: BenSecIncidentListPage;
  let fixture: ComponentFixture<BenSecIncidentListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenSecIncidentListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BenSecIncidentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
