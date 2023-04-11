/*
    <copyright file="idea.ts" company="Microsoft">
    Copyright (c) Microsoft. All rights reserved.
    </copyright>
*/

export class IdeaEntity {
    ideaId: string | undefined;
    title: string | undefined;
    description: string | undefined;
    category: string | undefined;
    categoryId: string | undefined;
    tags: string | undefined;
    createdDate: Date | undefined;
    createdByName: string | undefined;
    createdByUserPrincipalName: string | undefined;
    updatedDate: Date | undefined;
    createdByObjectId: string | undefined;
    totalVotes: number | undefined;
    documentLinks: string | undefined;
    approvedOrRejectedByName: string | undefined;
    approverOrRejecterUserId: string | undefined;
    status: number | undefined;
    feedback: string | undefined;
    backgroundColor?: string | undefined;
    painPointsofCurrentProcess: string | undefined;
    //selectedPainpointsCurrentProcess?: string | undefined;
    affectedTeams: string | undefined;
    numberImpactedPeople: number | undefined;
    personalAppItemProductivity: string | undefined;
    workflowParticipantsCatgeory: string | undefined;
    toolsRequiredDevelopmentCategory: string | undefined;
    numberPeoplePerformingTask: number | undefined;
    amountPerMonth: number | undefined;
    hoursSpentPerMonth: number | undefined;
    currentStateOfTrust: string | undefined;
    workflowProcessMap: string | undefined;
    processMappingTechnology: string | undefined;
    numberPeopleUsingSolution: number | undefined;
    numberBackendDataSources: number | undefined;
    numberStepsinWorkFlow: number | undefined;
    requireAttachments: string | undefined;
    requireOfflineSupport: string | undefined;
    solutionSharedOutsideTenant: string | undefined;
    solutionRequiredDowntime: string | undefined;
    solutionRequiredTables: string | undefined;
    processMapDocumentLink: string | undefined;
    solutionUsageFrequency: string | undefined;
    dataAccessibility: string | undefined;
}

//Enhancement: Added Accepted Status Enum
export enum ApprovalStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
    Accepted = 3,
    PreApproval = 4 //Withum Enhancement Ashish.M - Added Another Radio Button for PreApprov  
}

export class UpvoteEntity {
    postId: string | undefined;
    userId: string | undefined;
}
