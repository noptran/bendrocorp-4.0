import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BenSecPage } from './ben-sec.page';

describe('BenSecPage', () => {
  let component: BenSecPage;
  let fixture: ComponentFixture<BenSecPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenSecPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BenSecPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
