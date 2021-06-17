import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BenSecTagsComponent } from './ben-sec-tags.component';

describe('BenSecTagsComponent', () => {
  let component: BenSecTagsComponent;
  let fixture: ComponentFixture<BenSecTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenSecTagsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BenSecTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
