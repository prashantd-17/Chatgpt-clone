import { TestBed } from '@angular/core/testing';

import { OpenaiChatService } from './openai-chat.service';

describe('OpenaiChatService', () => {
  let service: OpenaiChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenaiChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
