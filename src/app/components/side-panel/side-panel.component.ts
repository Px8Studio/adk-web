/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {AsyncPipe, NgComponentOutlet} from '@angular/common';
import {Component, inject, input, output, signal, Type, viewChild, type WritableSignal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatMiniFabButton} from '@angular/material/button';
import {MatOption} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {MatTooltip} from '@angular/material/tooltip';
import {type SafeHtml} from '@angular/platform-browser';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {Observable, of} from 'rxjs';

import {EvalCase} from '../../core/models/Eval';
import {Session} from '../../core/models/Session';
import {FEATURE_FLAG_SERVICE} from '../../core/services/interfaces/feature-flag';
import {LOGO_COMPONENT} from '../../injection_tokens';
import {ArtifactTabComponent} from '../artifact-tab/artifact-tab.component';
import {EvalTabComponent} from '../eval-tab/eval-tab.component';
import {EventTabComponent} from '../event-tab/event-tab.component';
import {SessionTabComponent} from '../session-tab/session-tab.component';
import {StateTabComponent} from '../state-tab/state-tab.component';
import {TraceTabComponent} from '../trace-tab/trace-tab.component';

import {SidePanelMessagesInjectionToken} from './side-panel.component.i18n';

/**
 * Side panel component.
 */
@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,         FormsModule,          NgComponentOutlet,
    MatTooltip,        MatTabGroup,          MatTab,
    MatTabLabel,       TraceTabComponent,    EventTabComponent,
    StateTabComponent, ArtifactTabComponent, SessionTabComponent,
    EvalTabComponent,  MatPaginator,         MatMiniFabButton,
    MatIcon,           NgxJsonViewerModule,  MatOption,
    MatSelect,         ReactiveFormsModule,
  ],
})
export class SidePanelComponent {
  appName = input('');
  userId = input('');
  sessionId = input('');
  traceData = input<any[]>([]);
  eventData = input(new Map<string, any>());
  currentSessionState = input<any>();
  artifacts = input<any[]>([]);
  selectedEvent = input<any|undefined>();
  selectedEventIndex = input<number|undefined>();
  renderedEventGraph = input<SafeHtml|undefined>();
  rawSvgString = input<string|null>(null);
  llmRequest = input<any|undefined>();
  llmResponse = input<any|undefined>();
  showSidePanel = input(false);
  isApplicationSelectorEnabledObs = input<Observable<boolean>>(of(false));
  apps$ = input<Observable<string[]|undefined>>(of([]));
  isLoadingApps = input<WritableSignal<boolean>>(signal(false));
  selectedAppControl = input(new FormControl<string>('', {
    nonNullable: true,
  }));

  readonly closePanel = output<void>();
  readonly appSelectionChange = output<MatSelectChange>();
  readonly tabChange = output<any>();
  readonly eventSelected = output<string>();
  readonly sessionSelected = output<Session>();
  readonly sessionReloaded = output<Session>();
  readonly evalCaseSelected = output<EvalCase>();
  readonly evalSetIdSelected = output<string>();
  readonly returnToSession = output<boolean>();
  readonly evalNotInstalled = output<string>();
  readonly page = output<PageEvent>();
  readonly closeSelectedEvent = output<void>();
  readonly openImageDialog = output<string|null>();

  readonly eventTabComponent = viewChild(EventTabComponent);
  readonly sessionTabComponent = viewChild(SessionTabComponent);
  readonly evalTabComponent = viewChild(EvalTabComponent);

  readonly logoComponent: Type<Component> | null = inject(LOGO_COMPONENT, {
    optional: true,
  });
  readonly i18n = inject(SidePanelMessagesInjectionToken);
  readonly featureFlagService = inject(FEATURE_FLAG_SERVICE);

  // Feature flag references for use in template.
  readonly isAlwaysOnSidePanelEnabledObs =
      this.featureFlagService.isAlwaysOnSidePanelEnabled();
  readonly isTraceEnabledObs = this.featureFlagService.isTraceEnabled();
  readonly isArtifactsTabEnabledObs =
      this.featureFlagService.isArtifactsTabEnabled();
  readonly isEvalEnabledObs = this.featureFlagService.isEvalEnabled();
  readonly isTokenStreamingEnabledObs =
      this.featureFlagService.isTokenStreamingEnabled();
  readonly isMessageFileUploadEnabledObs =
      this.featureFlagService.isMessageFileUploadEnabled();
  readonly isManualStateUpdateEnabledObs =
      this.featureFlagService.isManualStateUpdateEnabled();
  readonly isBidiStreamingEnabledObs =
      this.featureFlagService.isBidiStreamingEnabled
}
