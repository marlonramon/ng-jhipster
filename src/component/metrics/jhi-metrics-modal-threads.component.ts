/*
 Copyright 2016-2021 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ThreadData } from './thread-data.interface';

@Component({
    selector: 'jhi-thread-modal',
    template: `
        <div class="modal-header">
            <h4 class="modal-title" jhiTranslate="metrics.jvm.threads.dump.title">Threads dump</h4>
            <button type="button" class="close" (click)="activeModal.dismiss('closed')">&times;</button>
        </div>
        <div class="modal-body">
            <span class="badge badge-primary" (click)="threadDumpFilter = {}">
                All&nbsp;<span class="badge badge-pill badge-default">{{ threadDumpAll }}</span> </span
            >&nbsp;
            <span class="badge badge-success" (click)="threadDumpFilter = { threadState: 'RUNNABLE' }">
                Runnable&nbsp;<span class="badge badge-pill badge-default">{{ threadDumpRunnable }}</span> </span
            >&nbsp;
            <span class="badge badge-info" (click)="threadDumpFilter = { threadState: 'WAITING' }"
                >Waiting&nbsp;<span class="badge badge-pill badge-default">{{ threadDumpWaiting }}</span></span
            >&nbsp;
            <span class="badge badge-warning" (click)="threadDumpFilter = { threadState: 'TIMED_WAITING' }">
                Timed Waiting&nbsp;<span class="badge badge-pill badge-default">{{ threadDumpTimedWaiting }}</span> </span
            >&nbsp;
            <span class="badge badge-danger" (click)="threadDumpFilter = { threadState: 'BLOCKED' }"
                >Blocked&nbsp;<span class="badge badge-pill badge-default">{{ threadDumpBlocked }}</span></span
            >&nbsp;
            <div class="mt-2">&nbsp;</div>
            Filter
            <input type="text" [(ngModel)]="threadDumpFilter" class="form-control" />
            <div class="pad" *ngFor="let entry of (threadDump | pureFilter: threadDumpFilter:'lockName' | keys)">
                <h6>
                    <span class="badge" [ngClass]="getBadgeClass(entry.value.threadState)">{{ entry.value.threadState }}</span
                    >&nbsp;{{ entry.value.threadName }}
                    (ID
                    {{ entry.value.threadId }})
                    <a (click)="entry.show = !entry.show" href="javascript:void(0);">
                        <span [hidden]="entry.show" jhiTranslate="metrics.jvm.threads.dump.show">Show StackTrace</span>
                        <span [hidden]="!entry.show" jhiTranslate="metrics.jvm.threads.dump.hide">Hide StackTrace</span>
                    </a>
                </h6>
                <div class="card" [hidden]="!entry.show">
                    <div class="card-body">
                        <div *ngFor="let st of (entry.value.stackTrace | keys)" class="break">
                            <samp
                                >{{ st.value.className }}.{{ st.value.methodName }}(<code
                                    >{{ st.value.fileName }}:{{ st.value.lineNumber }}</code
                                >)</samp
                            >
                            <span class="mt-1"></span>
                        </div>
                    </div>
                </div>
                <table class="table table-sm table-responsive">
                    <thead>
                        <tr>
                            <th jhiTranslate="metrics.jvm.threads.dump.blockedtime">Blocked Time</th>
                            <th jhiTranslate="metrics.jvm.threads.dump.blockedcount">Blocked Count</th>
                            <th jhiTranslate="metrics.jvm.threads.dump.waitedtime">Waited Time</th>
                            <th jhiTranslate="metrics.jvm.threads.dump.waitedcount">Waited Count</th>
                            <th jhiTranslate="metrics.jvm.threads.dump.lockname">Lock Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ entry.value.blockedTime }}</td>
                            <td>{{ entry.value.blockedCount }}</td>
                            <td>{{ entry.value.waitedTime }}</td>
                            <td>{{ entry.value.waitedCount }}</td>
                            <td class="thread-dump-modal-lock" title="{{ entry.value.lockName }}">
                                <code>{{ entry.value.lockName }}</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary float-left" data-dismiss="modal" (click)="activeModal.dismiss('closed')">
                Done
            </button>
        </div>
    `
})
export class JhiThreadModalComponent implements OnInit {
    threadDumpFilter: any;
    threadDump: ThreadData[] = [];
    threadDumpAll = 0;
    threadDumpBlocked = 0;
    threadDumpRunnable = 0;
    threadDumpTimedWaiting = 0;
    threadDumpWaiting = 0;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit(): void {
        this.threadDump.forEach(value => {
            if (value.threadState === 'RUNNABLE') {
                this.threadDumpRunnable += 1;
            } else if (value.threadState === 'WAITING') {
                this.threadDumpWaiting += 1;
            } else if (value.threadState === 'TIMED_WAITING') {
                this.threadDumpTimedWaiting += 1;
            } else if (value.threadState === 'BLOCKED') {
                this.threadDumpBlocked += 1;
            }
        });

        this.threadDumpAll = this.threadDumpRunnable + this.threadDumpWaiting + this.threadDumpTimedWaiting + this.threadDumpBlocked;
    }

    getBadgeClass(threadState: string): 'badge-success' | 'badge-info' | 'badge-warning' | 'badge-danger' | 'badge-primary' {
        if (threadState === 'RUNNABLE') {
            return 'badge-success';
        } else if (threadState === 'WAITING') {
            return 'badge-info';
        } else if (threadState === 'TIMED_WAITING') {
            return 'badge-warning';
        } else if (threadState === 'BLOCKED') {
            return 'badge-danger';
        } else {
            return 'badge-primary';
        }
    }
}
