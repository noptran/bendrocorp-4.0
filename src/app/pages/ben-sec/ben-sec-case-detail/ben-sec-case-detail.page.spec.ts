import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BenSecCaseDetailPage } from './ben-sec-case-detail.page';

describe('BenSecCaseDetailPage', () => {
  let component: BenSecCaseDetailPage;
  let fixture: ComponentFixture<BenSecCaseDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenSecCaseDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BenSecCaseDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
