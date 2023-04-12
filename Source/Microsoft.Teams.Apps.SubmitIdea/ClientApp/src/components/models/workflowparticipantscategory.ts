/*
    <copyright file="category.ts" company="Microsoft">
    Copyright (c) Microsoft. All rights reserved.
    </copyright>
*/

export interface IWorkflowParticipants {
    workflowParticipantsCategory: string | undefined;
}

export interface IWorkflowProcessMapping {
    workflowProcessMapValue: string | undefined;
}

export interface IProcessMappingTechnology {
    processMappingTechnologyItem: string | undefined;
}

export interface IRequireAttachments {
    requireAttachments: string | undefined;
}

export interface IRequireOfflineSupport {
    requireOfflineSupport: string | undefined;
}

export interface ISolutionSharedOutsideTenant {
    issolutionsharedOutsideTenant: string | undefined;
}

export interface ISolutionDowntimeRequired {
    requiredSolutionDowntime: string | undefined;
}

export interface ISolutionTableRequired {
    requiredTablesTrackData: string | undefined;
}

export interface ISolutionUseFrequencyRequired {
    solutionFrequencyCategory: string | undefined;
}

export interface IDataAccessibility {
    dataAccessibleUser: string | undefined;
}