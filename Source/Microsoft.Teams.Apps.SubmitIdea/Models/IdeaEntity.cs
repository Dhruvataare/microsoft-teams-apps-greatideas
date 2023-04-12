// <copyright file="IdeaEntity.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.Teams.Apps.SubmitIdea.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using Microsoft.Azure.Search;
    using Microsoft.WindowsAzure.Storage.Table;
    using Newtonsoft.Json;

    /// <summary>
    /// A class that represents team idea entity model which helps to create, insert, update and delete the idea.
    /// </summary>
    public class IdeaEntity : TableEntity
    {
        /// <summary>
        /// Gets or sets Azure Active Directory id of author who created the idea.
        /// </summary>
        [IsFilterable]
        public string CreatedByObjectId
        {
            get { return this.RowKey; }
            set { this.RowKey = value; }
        }

        /// <summary>
        /// Gets or sets unique identifier for each created idea.
        /// </summary>
        [Key]
        public string IdeaId
        {
            get { return this.PartitionKey; }
            set { this.PartitionKey = value; }
        }

        /// <summary>
        /// Gets or sets title of idea.
        /// </summary>
        [IsSearchable]
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets user entered post description value.
        /// </summary>
        [Required]
        [MaxLength(500)]
        public string Description { get; set; }

        /// <summary>
        /// Gets or sets user selected idea category value.
        /// </summary>
        [IsFilterable]
        [IsSearchable]
        [Required]
        public string Category { get; set; }

        /// <summary>
        /// Gets or sets user selected idea category id.
        /// </summary>
        [IsFilterable]
        [IsSearchable]
        public string CategoryId { get; set; }

        /// <summary>
        /// Gets or sets semicolon separated tags entered by user.
        /// </summary>
        [IsSearchable]
        [IsFilterable]
        public string Tags { get; set; }

        /// <summary>
        /// Gets or sets date time when entry is created.
        /// </summary>
        [IsSortable]
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets author name who created idea.
        /// </summary>
        [IsFilterable]
        public string CreatedByName { get; set; }

        /// <summary>
        /// Gets or sets date time when entry is updated.
        /// </summary>
        [IsSortable]
        public DateTime UpdatedDate { get; set; }

        /// <summary>
        /// Gets or sets user principle name of author who created the idea.
        /// </summary>
        [IsFilterable]
        [IsSearchable]
        public string CreatedByUserPrincipalName { get; set; }

        /// <summary>
        /// Gets or sets total number of likes received for a idea from users.
        /// </summary>
        [IsSortable]
        public int TotalVotes { get; set; }

        /// <summary>
        /// Gets or sets supporting document links for idea in json format.
        /// </summary>
        public string DocumentLinks { get; set; }

        /// <summary>
        /// Gets or sets name of user who has approved or rejected the idea.
        /// </summary>
        public string ApprovedOrRejectedByName { get; set; }

        /// <summary>
        /// Gets or sets Object identifier of user who has approved or rejected the idea.
        /// </summary>
        public string ApproverOrRejecterUserId { get; set; }

        /// <summary>
        /// Gets or sets status of idea i.e. Pending, Approved or Rejected.
        /// </summary>
        [IsFilterable]
        public int Status { get; set; }

        /// <summary>
        /// Gets or sets feedback comment if admin has rejected idea request.
        /// </summary>
        public string Feedback { get; set; }

        /// <summary>
        /// Gets or sets email Address of idea creator
        /// </summary>
        public string ApproverEmailAddress { get; set; }

        /// <summary>
        /// Gets or sets name of user to whom the idea is assigned.
        /// </summary>
        public string AssignedTo { get; set; }

        /// <summary>
        /// Gets or sets Pain Points of Current Process.
        /// </summary>
        public string PainPointsofCurrentProcess { get; set; }

        /// <summary>
        /// Gets or sets Affected Teams
        /// </summary>
        public string AffectedTeams { get; set; }

        /// <summary>
        /// Gets or sets Number Impacted People
        /// </summary>
        public int NumberImpactedPeople { get; set; }

        /// <summary>
        /// Gets or sets PersonalAppProductivity.
        /// </summary>
        public string PersonalAppItemProductivity { get; set; }

        /// <summary>
        /// Gets or sets WorkflowParticipantsCatgeory.
        /// </summary>
        public string WorkflowParticipantsCatgeory { get; set; }

        /// <summary>
        /// Gets or sets toolsRequiredDevelopmentCategory.
        /// </summary>
        public string ToolsRequiredDevelopmentCategory { get; set; }

        /// <summary>
        /// Gets or sets Number of People Peforming Tasks.
        /// </summary>
        public int NumberPeoplePerformingTask { get; set; }

        /// <summary>
        /// Gets or sets Amount Per Month.
        /// </summary>
        public int AmountPerMonth { get; set; }

        /// <summary>
        /// Gets or sets Amount Per Month.
        /// </summary>
        public int HoursSpentPerMonth { get; set; }

        /// <summary>
        /// Gets or sets Trust.
        /// </summary>
        public string CurrentStateOfTrust { get; set; }

        /// <summary>
        /// Gets or sets workflowProcessMap.
        /// </summary>
        public string WorkflowProcessMap { get; set; }

        /// <summary>
        /// Gets or sets ProcessMappingTechnology.
        /// </summary>
        public string ProcessMappingTechnology { get; set; }

        /// <summary>
        /// Gets or sets Number of People Using Solution.
        /// </summary>
        public int NumberPeopleUsingSolution { get; set; }

        /// <summary>
        /// Gets or sets Number of backend DataSources.
        /// </summary>
        public int NumberBackendDataSources { get; set; }

        /// <summary>
        /// Gets or sets Number of WorkflowSteps.
        /// </summary>
        public int NumberStepsinWorkFlow { get; set; }

        /// <summary>
        /// Gets or sets Require Attachments.
        /// </summary>
        public string RequireAttachments { get; set; }

        /// <summary>
        /// Gets or sets Require Offline Support.
        /// </summary>
        public string RequireOfflineSupport { get; set; }

        /// <summary>
        /// Gets or sets Solution Shared.
        /// </summary>
        public string SolutionSharedOutsideTenant { get; set; }

        /// <summary>
        /// Gets or sets Solution Required Downtime.
        /// </summary>
        public string SolutionRequiredDowntime { get; set; }

        /// <summary>
        /// Gets or sets Solution Tables
        /// </summary>
        public string SolutionRequiredTables { get; set; }

        /// <summary>
        /// Gets or sets supporting document links for idea in json format.
        /// </summary>
        public string ProcessMapDocumentLink { get; set; }

        /// <summary>
        /// Gets or sets supporting document links for idea in json format.
        /// </summary>
        public string SolutionUsageFrequency { get; set; }

        /// <summary>
        /// Gets or sets supporting document links for idea in json format.
        /// </summary>
        public string DataAccessibility { get; set; }
    }
}
