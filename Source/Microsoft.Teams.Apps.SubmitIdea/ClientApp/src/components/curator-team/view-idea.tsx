// <copyright file="view-idea.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { alert } from "react-alert";
import CurrencyInput from "react-currency-input-field";
import { WithTranslation, withTranslation } from "react-i18next";
import * as microsoftTeams from "@microsoft/teams-js";
import {
  Text,
  Flex,
  Provider,
    Label,
    AddIcon,
  Input,
  RadioGroup,
  TextArea,
  Loader,
  Image,
  Button,
  Dropdown,
  FlexItem,
  TrashCanIcon,
} from "@fluentui/react-northstar";
import { TFunction } from "i18next";
import { IdeaEntity, ApprovalStatus } from "../models/idea";
import UserAvatar from "./user-avatar";
import { generateColor, isNullorWhiteSpace } from "../../helpers/helper";
import { ICategoryDetails } from "../models/category";
import { getAllCategories } from "../../api/category-api";
import { getIdea, updatePostContent } from "../../api/idea-api";
import { SeverityLevel } from "@microsoft/applicationinsights-web";
import { getApplicationInsightsInstance } from "../../helpers/app-insights";
import Constants from "../../constants/resources";
import { createBrowserHistory } from "history";
import { IPainPointsCurrentProcess } from "../models/PainPointsCurrentProcess";
import { IPersonalAppProductivity, IPainPointsInCurrentProcess } from "../models/PersonalAppProductivity";
import { IWorkflowParticipants, IWorkflowProcessMapping, IProcessMappingTechnology, IRequireAttachments, IRequireOfflineSupport, ISolutionSharedOutsideTenant, ISolutionDowntimeRequired, ISolutionTableRequired, ISolutionUseFrequencyRequired, IDataAccessibility } from "../models/workflowparticipantscategory";
import { ItoolsRequired , ICurrentState } from "../models/ToolsRequired";
import { Item } from "react-bootstrap/lib/Breadcrumb";
let moment = require("moment");

interface IState {
  idea: IdeaEntity | undefined;
  loading: boolean;
  theme: string;
  selectedStatus: number | undefined;
  selectedCategory: string | undefined;
  feedbackText: string | undefined;
  categories: Array<ICategoryDetails>;
  submitLoading: boolean;
    isCategorySelected: boolean;
    isAffectedTeamsAdded: boolean;
  feedbackTextEmpty: boolean;
    isIdeaApprovedOrRejected: boolean;
    isNumberImpactedTeam: boolean;

// Added new Fields as a Part of GreatIdeaEnhancement - Ashish.M - Start
    painpointsCurrentProcesses: Array<IPainPointsCurrentProcess>
    selectedPainpointsCurrentProcess: string | undefined;
    isImpactedTeamInputValid: boolean;
    isPainpointsSelected: boolean;
    isAppPersonalProductivity: boolean;
    isWorkflowParticipantsSelected: boolean;
    selectedIsthisAppforPersonalProductivity: string | undefined;
    selectedWorkflowParticipants: string | undefined;
    selectedToolsRequiredForDevelopment: string | undefined;
    selectedCurrentStateOfTrust: string | undefined;  
    selectedWorkflowProcessMap: string | undefined;
    selectedProcessMappingTechnology: string | undefined;
    selectedrequiredAttachments: string | undefined;
    selectedRequiredOfflineSupport: string | undefined;
    selectedOptionSolutionSharedOutsideTenant: string | undefined;
    selectedSolutionDowntimeValue: string | undefined;
    selectedSolutionTableValue: string | undefined;
    selectedSolutionUseFrequency: string | undefined;
    selecteddataAccessiblity: string | undefined;
    affectedTeams: string | undefined;
    numberImpactedPeople: number | undefined;
    documentLink: string;
    processdocumentLink: string;
    personalAppProductivity: Array<IPersonalAppProductivity>
    workflowparticipants: Array<IWorkflowParticipants>
    toolsRequiredDataset: Array<ItoolsRequired>
    currentStateOfTrust: Array<ICurrentState>
    isWorkflowProcessMap: Array<IWorkflowProcessMapping>
    processMappingTechnology: Array<IProcessMappingTechnology>
    isRequireAttachments: Array<IRequireAttachments>
    isRequireOfflineSupport: Array<IRequireOfflineSupport>
    isSolutionSharedOutsideTenant: Array<ISolutionSharedOutsideTenant>
    requiredSolutionDowntime: Array<ISolutionDowntimeRequired>
    requiredSolutionTables: Array<ISolutionTableRequired>
    isaffectedTeamsValid: boolean;
    solutionUseFrequency: Array<ISolutionUseFrequencyRequired>
    dataAccessibleUser: Array<IDataAccessibility>
    //Added for test - 03/17/2023
    painPointsInCurrentProcesses: Array<IPainPointsInCurrentProcess>
    selectedPainPointsTeamsCurrentprocess: string | undefined;
    //test-end 
    mapDocumentsList: Array<string>;
    numberPeopleTaskROI: number | undefined;
    amountPerMonth: number | undefined;
    numberHoursInMonth: number | undefined;
    numberPeopleUsingSolution: number | undefined;
    numberofDataSources: number | undefined;
    numberofWorkflowSteps: number | undefined;
}

const browserHistory = createBrowserHistory();


class ViewIdea extends React.Component<WithTranslation, IState> {
  localize: TFunction;
  userObjectId: string | undefined = "";
  items: any;
  appInsights: any;
  telemetry: string | undefined = "";
  ideaId: string | undefined = "";
  createdById: string | undefined = "";
  appUrl: string = new URL(window.location.href).origin;

  constructor(props) {
    super(props);
    this.localize = this.props.t;
    this.state = {
      loading: true,
      idea: undefined,
        selectedStatus: ApprovalStatus.Accepted,//changed from Approved to Accepted status by default
      selectedCategory: undefined,
        categories: [],
      
        //Added by Ashish.M - Start 
        processdocumentLink: "",
        selecteddataAccessiblity:"",
        selectedPainpointsCurrentProcess: "",
        selectedSolutionUseFrequency:"",
        selectedIsthisAppforPersonalProductivity: "",
        selectedWorkflowParticipants: "",
        selectedToolsRequiredForDevelopment: "",
        selectedCurrentStateOfTrust: "",
        selectedWorkflowProcessMap: "",
        selectedProcessMappingTechnology: "",
        selectedrequiredAttachments: "",
        selectedRequiredOfflineSupport: "",
        selectedOptionSolutionSharedOutsideTenant: "",
        selectedSolutionDowntimeValue: "",
        selectedSolutionTableValue: "",
        documentLink: "",
        mapDocumentsList: [],
        painpointsCurrentProcesses: [],
        affectedTeams: "",
        numberImpactedPeople: 0,
        numberPeopleTaskROI:0,
        personalAppProductivity: [],
        workflowparticipants: [],
        toolsRequiredDataset: [],
        isWorkflowProcessMap:[],
        currentStateOfTrust: [],
        processMappingTechnology: [],
        requiredSolutionDowntime:[],
        amountPerMonth: 0,
        numberHoursInMonth: 0,
        numberPeopleUsingSolution: 0,
        numberofDataSources: 0,
        numberofWorkflowSteps: 0,
        isRequireAttachments: [],
        isRequireOfflineSupport: [],
        isSolutionSharedOutsideTenant: [],
        requiredSolutionTables: [],
        solutionUseFrequency:[],
        //Added for test - 03/17/2023
        painPointsInCurrentProcesses: [],
        selectedPainPointsTeamsCurrentprocess: "",
        dataAccessibleUser:[],
     
        //Added by Ashish.M - End

      feedbackText: "",
      theme: "",
      submitLoading: false,
      isCategorySelected: false,
      feedbackTextEmpty: true,
        isIdeaApprovedOrRejected: false,
        isPainpointsSelected: true,
        isAffectedTeamsAdded: true,
        isAppPersonalProductivity: true,
        isWorkflowParticipantsSelected: true,
        isaffectedTeamsValid: true,
        isImpactedTeamInputValid: true,
        isNumberImpactedTeam: true
    };
    this.items = [
      //Ashish: Enhancement for :	The curator app needs an accepted radio button to mark an idea as accepted for development .
      // Added Accept Radio Button.
      {
        key: "accept",
        label: this.localize("radioAccept"),
        value: ApprovalStatus.Accepted,
        },
      // Added PreApproval Approval Status - Withum Ashish Madan - Start
        {
            key: "preapproval",
            label: this.localize("PreApproval"),
            value: ApprovalStatus.PreApproval,
        },
          // Added PreApproval Approval Status - Withum Ashish Madan - End
      {
        key: "approve",
        label: this.localize("radioApprove"),
        value: ApprovalStatus.Approved,
      },
      {
        key: "reject",
        label: this.localize("radioReject"),
        value: ApprovalStatus.Rejected,
      },
    ];

    let params = new URLSearchParams(window.location.search);
    this.telemetry = params.get("telemetry")!;
    this.ideaId = params.get("id")!;
    this.createdById = params.get("userId")!;
  }

    public componentDidMount() {

    microsoftTeams.initialize();
    microsoftTeams.getContext((context) => {
      this.userObjectId = context.userObjectId!;
        this.setState({ theme: context.theme! });
        //Added by Ashish Madan - Great Idea Enhancement Dropdown Fields - Start
        this.setState({
            painpointsCurrentProcesses: [{painPointCurrentProcessName: 'Time Consuming' },
            {painPointCurrentProcessName: 'Manual Work' },
            {painPointCurrentProcessName: 'Error Prone' },
            {painPointCurrentProcessName: 'Data Loss' }]
        });

        this.setState({
            painPointsInCurrentProcesses: [{ painPointsCurrentProcessItemCategory: 'XYZ' },
                { painPointsCurrentProcessItemCategory: 'Manual Work' }]
        });

        this.setState({
            personalAppProductivity: [{ personaAppProductivityItem: 'Personal Productivity' }, { personaAppProductivityItem: '5-20 people' },
            { personaAppProductivityItem: 'Enterprise Grade App' },
            { personaAppProductivityItem: '' }]
        });

        this.setState({
            workflowparticipants: [{ workflowParticipantsCategory: 'Supplier' }, { workflowParticipantsCategory: 'FinanceTeam' }, { workflowParticipantsCategory: 'IT' }, { workflowParticipantsCategory: 'Other' }]
        });

        this.setState({ toolsRequiredDataset: [{ toolRequiredItem: 'PowerBI' }, { toolRequiredItem: 'Power Automate' }, { toolRequiredItem: 'PowerApps' }] })

        this.setState({ currentStateOfTrust: [{ currentStateItem: 'High' }, { currentStateItem: 'Low' }] })
        this.setState({ isWorkflowProcessMap: [{ workflowProcessMapValue: 'Yes' }, { workflowProcessMapValue: 'No' }] })
        this.setState({ processMappingTechnology: [{ processMappingTechnologyItem: 'Visio' }, { processMappingTechnologyItem: 'Power Automate' }, { processMappingTechnologyItem: 'Process Advisor' }] })


        this.setState({ isRequireAttachments: [{ requireAttachments: 'Yes' }, { requireAttachments: 'No' }]})
        
         //Added by Ashish Madan - Great Idea Enhancement Dropdown Fields - End

      // Initialize application insights for logging events and errors.
      this.appInsights = getApplicationInsightsInstance(
        this.telemetry,
        browserHistory
      );
        this.getCategory();
        this.getPainPoints();
        this.getPersonalAppProductivity();
        this.getWorkflowParticipants();
        this.getToolsRequired();
        this.getCurrentStateofTrust();
        this.getWorkflowProcessOptions();
        this.getProcessMapTechnology();
        this.getRequiredAttachments();
        this.getRequiredOfflineSupport();
        this.getSolutionSharedOptions();
        this.getSolutionDowntime();
        this.getSolutionTables();
        this.getInPainPoints();
        this.getSolutionUseFrequency();
        this.getUserAccessibility();
    });
  }

  getA11SelectionMessage = {
    onAdd: (item) => {
      if (item) {
        this.setState({ selectedCategory: item, isCategorySelected: true });
      }
      return "";
    },
    };

    getPainA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedPainpointsCurrentProcess: item , isPainpointsSelected: true});
            }
            return "";
        },
    };

    //test
    getPainPointsProcessA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedPainPointsTeamsCurrentprocess: item });
            }
            return "";
        },
    };

    getPersonalProductivityA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedIsthisAppforPersonalProductivity: item, isAppPersonalProductivity: true });
            }
            return "";
        },
    };
  
    getWorkflowParticipantsA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedWorkflowParticipants: item , isWorkflowParticipantsSelected:true });
            }
            return "";
        },
    };

    getToolsA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedToolsRequiredForDevelopment: item });
            }
            return "";
        },
    };

    getCurrentStateTrustA11SelectionMessage = {
    onAdd: (item) => {
        if (item) {
            this.setState({ selectedCurrentStateOfTrust: item });
        }
        return "";
        },
    };

    getWorkflowMapA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedWorkflowProcessMap: item });
            }
            return "";
        },
    };

    getProcessMapTechnologyA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedProcessMappingTechnology: item });
            }
            return "";
        },
    };

    getRequireAttachmentsA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedrequiredAttachments: item });
            }
            return "";
        },
    };

    getRequireOfflineSupportA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedRequiredOfflineSupport: item });
            }
            return "";
        },
    };

    getSolutionSharedA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedOptionSolutionSharedOutsideTenant: item });
            }
            return "";
        },
    };

    getSolutionDowntimeA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedSolutionDowntimeValue: item });
            }
            return "";
        },
    };

    getSolutionTablesA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedSolutionTableValue: item });
            }
            return "";
        },
    };

    getSolutionUseFrequencyA11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selectedSolutionUseFrequency: item });
            }
            return "";
        },
    };

    getSolutionSolutionData11SelectionMessage = {
        onAdd: (item) => {
            if (item) {
                this.setState({ selecteddataAccessiblity: item });
            }
            return "";
        },
    };


  /**
   *Get idea details from API
   */
  async getIdea() {
    this.appInsights.trackTrace({
      message: `'getIdea' - Initiated request`,
      properties: { User: this.userObjectId },
      severityLevel: SeverityLevel.Information,
    });
    let response = await getIdea(this.createdById!, this.ideaId!);
    if (response.status === 200 && response.data) {
      this.appInsights.trackTrace({
        message: `'getIdea' - Request success`,
        properties: { User: this.userObjectId },
        severityLevel: SeverityLevel.Information,
      });

      let idea = response.data as IdeaEntity;
      let category = this.state.categories
        .filter((row) => row.categoryName === idea.category)
        .shift();
      if (category === undefined) {
        this.setState({ selectedCategory: undefined });
      } else {
        this.setState({
          selectedCategory: idea.category,
          isCategorySelected: true,
        });
      }
        //Added by Ashish madan on 02/26/2023 - start

        let painPointsOfCurrentProcessItem = this.state.painpointsCurrentProcesses.filter((row) => row.painPointCurrentProcessName === idea.painPointsofCurrentProcess)
            .shift();
        if (painPointsOfCurrentProcessItem === undefined) {
            this.setState({ selectedPainpointsCurrentProcess: undefined });
        } else {
            this.setState({
                selectedPainpointsCurrentProcess: idea.painPointsofCurrentProcess,
                isPainpointsSelected: true,
                
            });
        }

        let solutionUsageFrequency = this.state.solutionUseFrequency.filter((row) => row.solutionFrequencyCategory === idea.solutionUsageFrequency)
            .shift();
        if (solutionUsageFrequency === undefined) {
            this.setState({ selectedSolutionUseFrequency: undefined });
        } else {
            this.setState({
                selectedSolutionUseFrequency: idea.solutionUsageFrequency
            });
        }

        let dataAccessible = this.state.dataAccessibleUser.filter((row) => row.dataAccessibleUser === idea.dataAccessibility)
            .shift();
        if (dataAccessible === undefined) {
            this.setState({ selecteddataAccessiblity: undefined });
        } else {
            this.setState({
                selecteddataAccessiblity: idea.dataAccessibility
            });
        }


        if (this.onAffectedTeamsChange === undefined) {
            this.setState({ affectedTeams: undefined });
        } else {
            this.setState({
                affectedTeams: idea.affectedTeams,
                
            });
        }

        if (this.onnumberImpactedPeople === undefined) {
            this.setState({ numberImpactedPeople: undefined });
        } else {
            this.setState({
                numberImpactedPeople: idea.numberImpactedPeople
            });
        }

        let personalAppProductivityItem = this.state.personalAppProductivity.filter((row) => row.personaAppProductivityItem === idea.personalAppItemProductivity)
            .shift();
        if (personalAppProductivityItem === undefined) {
            this.setState({ selectedIsthisAppforPersonalProductivity: undefined });
        } else {
            this.setState({
                selectedIsthisAppforPersonalProductivity: idea.personalAppItemProductivity,
                isAppPersonalProductivity:true,
            });
        }
        let workflowParticipantsItem = this.state.workflowparticipants.filter((row) => row.workflowParticipantsCategory === idea.workflowParticipantsCatgeory)
            .shift();
        if (workflowParticipantsItem === undefined) {
            this.setState({ selectedWorkflowParticipants: undefined });
        } else {
            this.setState({
                selectedWorkflowParticipants: idea.workflowParticipantsCatgeory,
                isWorkflowParticipantsSelected:true,
            });
        }

        let toolsRequiredDevelopmentItem = this.state.toolsRequiredDataset.filter((row) => row.toolRequiredItem === idea.toolsRequiredDevelopmentCategory)
            .shift();
        if (toolsRequiredDevelopmentItem === undefined) {
            this.setState({ selectedToolsRequiredForDevelopment: undefined });
        } else {
            this.setState({
                selectedToolsRequiredForDevelopment: idea.toolsRequiredDevelopmentCategory
            });
        }

        if (this.onnumberPeoplePerformingROITask === undefined) {
            this.setState({ numberPeopleTaskROI: undefined });
        } else {
            this.setState({
                numberPeopleTaskROI: idea.numberPeoplePerformingTask
            });
        }

        if (this.onAmountPerMonth === undefined) {
            this.setState({ amountPerMonth: undefined });
        } else {
            this.setState({
                amountPerMonth: idea.amountPerMonth
            });
        }

        if (this.onhoursSpent === undefined) {
            this.setState({ numberHoursInMonth: undefined });
        } else {
            this.setState({
                numberHoursInMonth: idea.hoursSpentPerMonth
            });
        }
        let currentStateofTrustItem = this.state.currentStateOfTrust.filter((row) => row.currentStateItem === idea.currentStateOfTrust)
            .shift();
        if (currentStateofTrustItem === undefined) {
            this.setState({ selectedCurrentStateOfTrust: undefined });
        } else {
            this.setState({
                selectedCurrentStateOfTrust: idea.currentStateOfTrust
            });
        }

        let workflowProcessMap = this.state.isWorkflowProcessMap.filter((row) => row.workflowProcessMapValue === idea.workflowProcessMap)
            .shift();
        if (workflowProcessMap === undefined) {
            this.setState({ selectedWorkflowProcessMap: undefined });
        } else {
            this.setState({
                selectedWorkflowProcessMap: idea.workflowProcessMap
            });
        }


        let processMapTechnologyItem = this.state.processMappingTechnology.filter((row) => row.processMappingTechnologyItem === idea.processMappingTechnology)
            .shift();
        if (processMapTechnologyItem === undefined) {
            this.setState({ selectedProcessMappingTechnology: undefined });
        } else {
            this.setState({
                selectedProcessMappingTechnology: idea.processMappingTechnology
            });
        }


        if (this.numberPeopleUsingSolution === undefined) {
            this.setState({ numberPeopleUsingSolution: undefined });
        } else {
            this.setState({
                numberPeopleUsingSolution: idea.numberPeopleUsingSolution
            });
        }

        if (this.numberDatasources === undefined) {
            this.setState({ numberofDataSources: undefined });
        } else {
            this.setState({
                numberofDataSources: idea.numberBackendDataSources
            });
        }

        if (this.numberWorkflowSteps === undefined) {
            this.setState({ numberofWorkflowSteps: undefined });
        } else {
            this.setState({
                numberofWorkflowSteps: idea.numberStepsinWorkFlow
            });
        }

        let requireAttachmentsItems = this.state.isRequireAttachments.filter((row) => row.requireAttachments === idea.requireAttachments)
            .shift();
        if (requireAttachmentsItems === undefined) {
            this.setState({ selectedrequiredAttachments: undefined });
        } else {
            this.setState({
                selectedrequiredAttachments: idea.requireAttachments
            });
        }

        let requireOfflineSupport = this.state.isRequireOfflineSupport.filter((row) => row.requireOfflineSupport === idea.requireOfflineSupport)
            .shift();
        if (requireOfflineSupport === undefined) {
            this.setState({ selectedRequiredOfflineSupport: undefined });
        } else {
            this.setState({
                selectedRequiredOfflineSupport: idea.requireOfflineSupport
            });
        }

        let solutionSharedOutsideTenant = this.state.isSolutionSharedOutsideTenant.filter((row) => row.issolutionsharedOutsideTenant === idea.solutionSharedOutsideTenant)
            .shift();
        if (solutionSharedOutsideTenant === undefined) {
            this.setState({ selectedOptionSolutionSharedOutsideTenant: undefined });
        } else {
            this.setState({
                selectedOptionSolutionSharedOutsideTenant: idea.solutionSharedOutsideTenant
            });
        }

        let solutionRequireDowntime = this.state.requiredSolutionDowntime.filter((row) => row.requiredSolutionDowntime === idea.solutionRequiredDowntime)
            .shift();
        if (solutionRequireDowntime === undefined) {
            this.setState({ selectedSolutionDowntimeValue: undefined });
        } else {
            this.setState({
                selectedSolutionDowntimeValue: idea.solutionRequiredDowntime
            });
        }

        let solutionRequireTables = this.state.requiredSolutionTables.filter((row) => row.requiredTablesTrackData === idea.solutionRequiredTables)
            .shift();
        if (solutionRequireTables === undefined) {
            this.setState({ selectedSolutionTableValue: undefined });
        } else {
            this.setState({
                selectedSolutionTableValue: idea.solutionRequiredTables
            });
        }

        //Added by Ashish madan on 02/26/2023 - end


      let color = generateColor();
      idea.backgroundColor = color;
      this.setState({
        loading: false,
        idea: idea,
      });
    } else {
      this.appInsights.trackTrace({
        message: `'getIdea' - Request failed`,
        properties: { User: this.userObjectId },
        severityLevel: SeverityLevel.Information,
      });
    }
    this.setState({
      loading: false,
    });
  }
  async getCategory() {
    this.appInsights.trackTrace({
      message: `'getCategory' - Initiated request`,
      properties: { User: this.userObjectId },
      severityLevel: SeverityLevel.Information,
    });
    let category = await getAllCategories();

    if (category.status === 200 && category.data) {
      this.appInsights.trackTrace({
        message: `'getCategory' - Request success`,
        properties: { User: this.userObjectId },
        severityLevel: SeverityLevel.Information,
      });
      this.setState({
        categories: category.data,
      });

      await this.getIdea();
    } else {
      this.appInsights.trackTrace({
        message: `'getCategory' - Request failed`,
        properties: { User: this.userObjectId },
        severityLevel: SeverityLevel.Information,
      });
    }
    this.setState({
      loading: false,
    });
    }

    //Added by Ashish madan - getPersonalAppProductivity - getWorkflowParticipants - getToolsRequired -getCurrentStateofTrust
    async getPainPoints() {

        this.setState({
            painpointsCurrentProcesses: [{ painPointCurrentProcessName: 'Time Consuming' },
            { painPointCurrentProcessName: 'Manual Work' },
            { painPointCurrentProcessName: 'Error Prone' },
            { painPointCurrentProcessName: 'Data Loss' }]
        });
        await this.getIdea();

    }
        //Added by Ashish madan - end

    async getSolutionUseFrequency() {
        this.setState({
            solutionUseFrequency: [{ solutionFrequencyCategory: 'Daily' },
                { solutionFrequencyCategory: 'Weekly' },
                { solutionFrequencyCategory: 'Monthly' },
                { solutionFrequencyCategory: 'Yearly' },
                { solutionFrequencyCategory: 'Seasonal' },
                { solutionFrequencyCategory: 'Infrequently' }]
        });
        await this.getIdea();

    }
    async getPersonalAppProductivity() {

        this.setState({
            personalAppProductivity: [{ personaAppProductivityItem: 'Personal Productivity' }, { personaAppProductivityItem: '5-20 people' },
            { personaAppProductivityItem: 'Enterprise Grade App' },
            { personaAppProductivityItem: '' }]
        });
        await this.getIdea();

    }

    async getWorkflowParticipants() {

        this.setState({
            workflowparticipants: [{ workflowParticipantsCategory: 'Supplier' }, { workflowParticipantsCategory: 'FinanceTeam' }, { workflowParticipantsCategory: 'IT' }, { workflowParticipantsCategory: 'Other' }]
        });
        await this.getIdea();

    }

    async getToolsRequired() {

        this.setState({ toolsRequiredDataset: [{ toolRequiredItem: 'PowerBI' }, { toolRequiredItem: 'Power Automate' }, { toolRequiredItem: 'PowerApps' }] })
        await this.getIdea();

    }

    async getCurrentStateofTrust() {
        this.setState({ currentStateOfTrust: [{ currentStateItem: 'High' }, { currentStateItem: 'Low' }] })
        await this.getIdea();

    }

    async getWorkflowProcessOptions() {
        this.setState({ isWorkflowProcessMap: [{ workflowProcessMapValue: 'Yes' }, { workflowProcessMapValue: 'No' }] })
        await this.getIdea();

    }

    async getProcessMapTechnology() {
        this.setState({ processMappingTechnology: [{ processMappingTechnologyItem: 'Visio' }, { processMappingTechnologyItem: 'Power Automate' }, { processMappingTechnologyItem: 'Process Advisor' }] })
        await this.getIdea();

    }

    async getRequiredAttachments() {

        this.setState({ isRequireAttachments: [{ requireAttachments: 'Yes' }, { requireAttachments: 'No' }] })
        await this.getIdea();

    }

    async getRequiredOfflineSupport() {
        this.setState({ isRequireOfflineSupport: [{ requireOfflineSupport: 'Yes' }, { requireOfflineSupport: 'No' }] })
        await this.getIdea();
    }

    async getSolutionSharedOptions() {
        this.setState({ isSolutionSharedOutsideTenant: [{ issolutionsharedOutsideTenant: 'Yes' }, { issolutionsharedOutsideTenant: 'No' }] })
        await this.getIdea();
    }

    async getSolutionDowntime() {
        this.setState({ requiredSolutionDowntime: [{ requiredSolutionDowntime: 'A few Days' }, { requiredSolutionDowntime: 'Few Weeks' }, { requiredSolutionDowntime: 'Cannot Afford Downtime' }] })
        await this.getIdea();
    }

    async getSolutionTables() {
        this.setState({ requiredSolutionTables: [{ requiredTablesTrackData: 'Just 1 Table' }, { requiredTablesTrackData: 'More than 1 table' }] })
        await this.getIdea();
    }


    async getUserAccessibility() {
        this.setState({ dataAccessibleUser: [{ dataAccessibleUser: 'Yes' }, { dataAccessibleUser: 'No' }] })
        await this.getIdea();
    }

    ////Added for test - 03/17/2023
    async getInPainPoints() {
        this.setState({
            painPointsInCurrentProcesses: [{ painPointsCurrentProcessItemCategory: 'XYZ' }, { painPointsCurrentProcessItemCategory: 'ABC' }]
        });
        await this.getIdea();
    }

    //preApproveIdea - getSolutionTables
  /**
   *Approve or rejectIdea -- getWorkflowProcessOptions --getProcessMapTechnology -- getRequiredAttachments -- getRequiredOfflineSupport -- getSolutionSharedOptions --getSolutionDowntime--
   */
  async approveOrRejectIdea(idea: any) {
    this.appInsights.trackTrace({
      message: `'approveOrRejectIdea' - Initiated request`,
      properties: { User: this.userObjectId },
      severityLevel: SeverityLevel.Information,
    });
    let updateEntity = await updatePostContent(idea);

    if (updateEntity.status === 200 && updateEntity.data) {
      this.appInsights.trackTrace({
        message: `'approveOrRejectIdea' - Request success`,
        properties: { User: this.userObjectId },
        severityLevel: SeverityLevel.Information,
      });
    } else {
      this.appInsights.trackTrace({
        message: `'approveOrRejectIdea' - Request failed`,
        properties: { User: this.userObjectId },
        severityLevel: SeverityLevel.Information,
      });
    }

    this.setState({
      loading: false,
      submitLoading: false,
      isIdeaApprovedOrRejected: true,
    });
  }


    async preApproveIdea(idea: any) {
        this.appInsights.trackTrace({
            message: `'approveOrRejectIdea' - Initiated request`,
            properties: { User: this.userObjectId },
            severityLevel: SeverityLevel.Information,
        });
        let updateEntity = await updatePostContent(idea);

        if (updateEntity.status === 200 && updateEntity.data) {
            this.appInsights.trackTrace({
                message: `'approveOrRejectIdea' - Request success`,
                properties: { User: this.userObjectId },
                severityLevel: SeverityLevel.Information,
            });
        } else {
            this.appInsights.trackTrace({
                message: `'approveOrRejectIdea' - Request failed`,
                properties: { User: this.userObjectId },
                severityLevel: SeverityLevel.Information,
            });
        }


        this.setState({
            loading: false,
            submitLoading: false,
            isIdeaApprovedOrRejected: true,
            //selectedPainpointsCurrentProcess: idea.PainPointsofCurrentProcess,       
        });
    }
  /**
   * Handle radio group change event.
   * @param e | event
   * @param props | props
   */
    handleChange = (e: any, props: any) => {
        this.setState({ selectedStatus: props.value });
    };

    //handlePainPoints = (e: any) => {
    //    this.state.painpointsCurrentProcesses.map((item, i) => {
    //        if (item === e.value) {
    //            this.setState({ selectedPainpointsCurrentProcess: e.value });
    //        }
    //        return;
    //    });
    //}

    checkIfConfirmAllowed = () => {

        if ((this.state.selectedStatus !== ApprovalStatus.Accepted) && (this.state.selectedStatus !== ApprovalStatus.Rejected)) {
            if (this.state.selectedCategory === undefined) {    
                this.setState({ isCategorySelected: false });
                
            }

            if (this.state.selectedPainpointsCurrentProcess === undefined) {
                this.setState({ isPainpointsSelected: false });
                return false;
            }


            if (isNullorWhiteSpace(this.state.affectedTeams!)) {
                this.setState({ isAffectedTeamsAdded: false });
                return false;
            }


            if (this.state.selectedIsthisAppforPersonalProductivity === undefined ){
                this.setState({ isAppPersonalProductivity: false });
                return false;
            }

            if (this.state.isWorkflowParticipantsSelected === undefined) {
                this.setState({ isWorkflowParticipantsSelected: false });
                return false;
            }

            if (
                this.state.selectedStatus === 2 &&
                isNullorWhiteSpace(this.state.feedbackText!)
            ) {
                this.setState({ feedbackTextEmpty: false });
                return false;
            }
            return true;
        }
        else {
            return true;
        }
    };

    onDocumentChange = (link: string) => {
            this.setState({ processdocumentLink:link})

    }

    onDocumentAddClick = () => {
        let documentsList1 = this.state.mapDocumentsList;
            documentsList1.push(this.state.processdocumentLink);
        this.setState({ mapDocumentsList: documentsList1 /*, processdocumentLink: "" */});
    }

    onDocumentKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            this.onDocumentAddClick();
        }
    }
    value = (event: any) => {
        if (event.key === 'Enter') {
            this.onDocumentAddClick();
        }
    }

    //onInput = (event: any) => {
    //    return (event.charCode != 8 && event.charCode == 0 || (event.charCode >= 48 && event.charCode <= 57))
    //}
    //valueInput = (event: any) => {
    //    return (event.charCode != 8 && event.charCode == 0 || (event.charCode >= 48 && event.charCode <= 57))
    //}



    onDocumentRemoveClick = (index: number) => {
        let documents = this.state.mapDocumentsList;
        documents.splice(index, 1);
        this.setState({ mapDocumentsList: documents });
    }


    checkIfSaveDetailsAllowed = () => {

        if (this.state.selectedPainpointsCurrentProcess === undefined) {
            this.setState({ isPainpointsSelected: false });
            return false;
        }

                if (isNullorWhiteSpace(this.state.affectedTeams!))
                {
                    this.setState({ isAffectedTeamsAdded: false });
                    return false;
                }
                //if (this.validateAffectedTeamInput()) {
                //    this.setState({ isaffectedTeamsValid: false });
                //    return false;
                //}

        if (this.state.selectedIsthisAppforPersonalProductivity === undefined) {
            this.setState({ isAppPersonalProductivity: false });
            return false;
        }

        if (this.state.selectedWorkflowParticipants === undefined) {
            this.setState({ isWorkflowParticipantsSelected: false });
            return false;
        }

        if (this.state.numberImpactedPeople === null || this.validateNumberImpactedPeople()===false) {
            this.setState({ isNumberImpactedTeam: false });
            return false;
        }

        return true;
    };


    validateNumberImpactedPeople = () => {
        let expression = Constants.ImpactedTeamsInputRegEx;
        let regex = new RegExp(expression);
        if (this.state.numberImpactedPeople?.toString().match(regex)) {
            this.setState({ isImpactedTeamInputValid: true })
            return true;
        }
        else {
            this.setState({ isImpactedTeamInputValid: false })
            return false;
        }
    }

    //validateAffectedTeamInput = () => {
    //    let affectedTeamsUserInput = Constants.urlAffectedTeamsInputRegEx;
    //    let regex = new RegExp(affectedTeamsUserInput);
    //    if (this.state.affectedTeams?.match(regex)) {
    //        this.setState({ isaffectedTeamsValid: true })
    //        return true;
    //    }
    //    else {
    //        this.setState({ isaffectedTeamsValid: false })
    //        return false;
    //    }
    //}
  /**
   *Returns text component containing error message for failed name field validation
   *@param {boolean} isValuePresent Indicates whether value is present
   */
  private getRequiredFieldError = (isValuePresent: boolean) => {
    if (!isValuePresent) {
      return (
        <Text
          content={this.localize("fieldRequiredMessage")}
          className="field-error-message"
          error
          size="medium"
        />
      );
      }
    return <></>;
    };


    //private getInValidInputError = (isValidInput: boolean) => {
    //    if (isValidInput === false) {
    //        return (<Text content={this.localize('inValidLinkError')} className="field-error-message" error size="medium" />);
    //    }
    //    return (<></>);
    //}

    private getInvalidNumberInputError = (isValidInput: boolean) => {
        if (!isValidInput) {
            return (<Text content={this.localize("inValidNumberInputError")} className="field-error-message" error size="medium" />);
        }

        return (<></>);
    }


  handleConfirm = () => {
    if (this.checkIfConfirmAllowed()) {
      this.setState({ submitLoading: true });
      let category = this.state.categories
        .filter((row) => row.categoryName === this.state.selectedCategory)
            .shift();
      let updateEntity: IdeaEntity = {
        ideaId: this.state.idea?.ideaId,
        feedback:
          this.state.selectedStatus === ApprovalStatus.Rejected
            ? this.state.feedbackText
            : "",
        status: this.state.selectedStatus,
          category: this.state.selectedCategory,
          categoryId: category?.categoryId,
        approverOrRejecterUserId: this.userObjectId,
        createdByObjectId: this.state.idea?.createdByObjectId,
        title: this.state.idea?.title,
        description: this.state.idea?.description,
        documentLinks: this.state.idea?.documentLinks,
        totalVotes: this.state.idea?.totalVotes,
        tags: this.state.idea?.tags,
        createdDate: this.state.idea?.createdDate,
        createdByName: this.state.idea?.createdByName,
        createdByUserPrincipalName: this.state.idea?.createdByUserPrincipalName,
        updatedDate: this.state.idea?.updatedDate,
        approvedOrRejectedByName: this.state.idea?.approvedOrRejectedByName,
         painPointsofCurrentProcess: this.state.selectedPainpointsCurrentProcess,
          personalAppItemProductivity: this.state.selectedIsthisAppforPersonalProductivity,
          workflowParticipantsCatgeory: this.state.selectedWorkflowParticipants,
          toolsRequiredDevelopmentCategory: this.state.selectedToolsRequiredForDevelopment,
         currentStateOfTrust : this.state.selectedCurrentStateOfTrust,
          affectedTeams: this.state.affectedTeams,
          numberPeoplePerformingTask: this.state.numberPeopleTaskROI,
          amountPerMonth: this.state.amountPerMonth,
          hoursSpentPerMonth: this.state.numberHoursInMonth,
          workflowProcessMap: this.state.selectedWorkflowProcessMap,
          processMappingTechnology: this.state.selectedProcessMappingTechnology,
          numberPeopleUsingSolution:this.state.numberPeopleUsingSolution,
          numberImpactedPeople: this.state.numberImpactedPeople,
          numberStepsinWorkFlow: this.state.numberofWorkflowSteps,
          requireAttachments: this.state.selectedrequiredAttachments,
          requireOfflineSupport: this.state.selectedRequiredOfflineSupport,
          solutionSharedOutsideTenant: this.state.selectedOptionSolutionSharedOutsideTenant,
          solutionRequiredDowntime: this.state.selectedSolutionDowntimeValue,
          numberBackendDataSources: this.state.numberofDataSources, 
          solutionRequiredTables: this.state.selectedSolutionTableValue,
          processMapDocumentLink: this.state.idea?.processMapDocumentLink,
          solutionUsageFrequency: this.state.selectedSolutionUseFrequency,
          dataAccessibility:this.state.selecteddataAccessiblity
      };

      this.approveOrRejectIdea(updateEntity);
    }
    };

    // Added by Ashish Madan 
    handleDetails = () => {
        if (this.checkIfSaveDetailsAllowed()) {
            this.setState({ submitLoading: true });
            let category = this.state.categories
                .filter((row) => row.categoryName === this.state.selectedCategory)
                .shift();
            let updateEntity: IdeaEntity = {
                ideaId: this.state.idea?.ideaId,
                feedback:
                    this.state.selectedStatus === ApprovalStatus.Rejected
                        ? this.state.feedbackText
                        : "",
                status: this.state.selectedStatus,
                category: this.state.selectedCategory,
                categoryId: category?.categoryId,
                approverOrRejecterUserId: this.userObjectId,
                createdByObjectId: this.state.idea?.createdByObjectId,
                title: this.state.idea?.title,
                description: this.state.idea?.description,
                documentLinks: this.state.idea?.documentLinks,
                totalVotes: this.state.idea?.totalVotes,
                tags: this.state.idea?.tags,
                createdDate: this.state.idea?.createdDate,
                createdByName: this.state.idea?.createdByName,
                createdByUserPrincipalName: this.state.idea?.createdByUserPrincipalName,
                updatedDate: this.state.idea?.updatedDate,
                approvedOrRejectedByName: this.state.idea?.approvedOrRejectedByName,
                painPointsofCurrentProcess: this.state.selectedPainpointsCurrentProcess,
                affectedTeams: this.state.affectedTeams,
                workflowParticipantsCatgeory:this.state.selectedWorkflowParticipants,
                numberImpactedPeople: this.state.numberImpactedPeople,
                toolsRequiredDevelopmentCategory: this.state.selectedToolsRequiredForDevelopment,
                numberPeoplePerformingTask: this.state.numberPeopleTaskROI,
                amountPerMonth: this.state.amountPerMonth,
                hoursSpentPerMonth: this.state.numberHoursInMonth,
                currentStateOfTrust: this.state.selectedCurrentStateOfTrust,
                workflowProcessMap: this.state.selectedWorkflowProcessMap,
                processMappingTechnology: this.state.selectedProcessMappingTechnology,
                numberPeopleUsingSolution: this.state.numberPeopleUsingSolution,
                numberBackendDataSources: this.state.numberofDataSources,
                numberStepsinWorkFlow: this.state.numberofWorkflowSteps,
                requireAttachments: this.state.selectedrequiredAttachments,
                requireOfflineSupport: this.state.selectedRequiredOfflineSupport,
                solutionSharedOutsideTenant: this.state.selectedOptionSolutionSharedOutsideTenant,
                solutionRequiredDowntime: this.state.selectedSolutionDowntimeValue,
                solutionRequiredTables: this.state.selectedSolutionTableValue,
                personalAppItemProductivity: this.state.selectedIsthisAppforPersonalProductivity,
                processMapDocumentLink: JSON.stringify(this.state.mapDocumentsList),     
                solutionUsageFrequency: this.state.selectedSolutionUseFrequency,
                dataAccessibility: this.state.selecteddataAccessiblity
            };
            this.preApproveIdea(updateEntity);
        }
    };

  onFeedbackChange = (value: string) => {
    this.setState({ feedbackText: value });
    };

    // Ashish Madan Changes - Great Idea Enhancement - Event Handlers Start

    onAffectedTeamsChange = (value: string) => {
        this.setState({ affectedTeams: value , isAffectedTeamsAdded:true});
    }

    onnumberImpactedPeople = (value: number) => {
        this.setState({numberImpactedPeople:value, isNumberImpactedTeam: true})
    }

    onnumberPeoplePerformingROITask = (value: number) => {
        this.setState({ numberPeopleTaskROI: value })
    }

    onAmountPerMonth = (value: number) => {
        this.setState({ amountPerMonth: value })
    }

    onhoursSpent = (value: number) => {
        this.setState({numberHoursInMonth: value })
    }

    numberPeopleUsingSolution = (value: number) => {
        this.setState({ numberPeopleUsingSolution: value })
    }

    numberDatasources = (value: number) => {
        this.setState({ numberofDataSources: value })
    }

    numberWorkflowSteps = (value: number) => {
        this.setState({ numberofWorkflowSteps: value })
    }
    // Ashish Madan Changes - Great Idea Enhancement - Event Handlers End
  /**
   * Renders the component.
   */
    public render(): JSX.Element { 
        const { painpointsCurrentProcesses, personalAppProductivity , workflowparticipants , toolsRequiredDataset,currentStateOfTrust,isWorkflowProcessMap,processMappingTechnology,isRequireAttachments} = this.state;

    //Ashish Madan Changes - Great Idea Enhancement - Fetch Dropdown values (Mapping)

        //let painpointList = painpointsCurrentProcesses.length > 0
        //    && painpointsCurrentProcesses.map((item, i) => {
        //        return (
        //            <option  value={item.painPointCurrentProcessName}>{item.painPointCurrentProcessName}</option>
        //        )
        //    }, this);

        //let personalAppProductivityItemList = personalAppProductivity.length > 0 && personalAppProductivity.map((item, i) => {
        //    return (
        //        <option value={item.personaAppProductivityItem}>{item.personaAppProductivityItem}</option>
        //    )
        //}, this);


        let workflowParticipants = workflowparticipants.length > 0 && workflowparticipants.map((item, i) => {
            return (
                <option value={item.workflowParticipantsCategory}>{item.workflowParticipantsCategory}</option>
            )
        }, this);

        let toolsRequiredDataItem = toolsRequiredDataset.length > 0 && toolsRequiredDataset.map((item, i) => {
            return (
                <option value={item.toolRequiredItem}>{item.toolRequiredItem}</option>
            )
        }, this); 

        let currentStateTrust = currentStateOfTrust.length > 0 && currentStateOfTrust.map((item, i) => {
            return (
                <option value={item.currentStateItem}>{item.currentStateItem}</option>
            )
        }, this); 

        let isWorkflowProcessMapping = isWorkflowProcessMap.length > 0 && isWorkflowProcessMap.map((item, i) => {
            return (
                <option value={item.workflowProcessMapValue}>{item.workflowProcessMapValue}</option>
            )
        }, this); 

        let processMappingTechnologyitem = processMappingTechnology.length > 0 && processMappingTechnology.map((item, i) => {
            return (
                <option value={item.processMappingTechnologyItem}>{item.processMappingTechnologyItem}</option>
            )
        }, this); 

        let requireAttachments = isRequireAttachments.length > 0 && isRequireAttachments.map((item, i) => {
            return (
                <option value={item.requireAttachments}>{item.requireAttachments}</option>
            )
        }, this); 

    if (!this.state.loading && !this.state.isIdeaApprovedOrRejected) {
      return (
        <Provider>
          <div className="module-container">
            <div className="tab-container">
              {this.state.idea && (
                <Flex column>
                  <Flex className="top-margin">
                    <Text
                      size="largest"
                      className="word-break"
                      weight="bold"
                      content={this.state.idea.title}
                    />
                  </Flex>
                  <Flex wrap className="subtitle-margin" vAlign="center">
                    <UserAvatar
                      avatarColor={this.state.idea.backgroundColor!}
                      showFullName={true}
                      postType={this.state.idea.category!}
                      content={this.state.idea.createdByName!}
                      title={this.state.idea.createdByName!}
                    />
                    &nbsp;
                    <Text
                      content={this.localize("ideaPostedOnText", {
                        time: moment(
                          new Date(this.state.idea.createdDate!)
                        ).format("llll"),
                      })}
                    />
                  </Flex>
                  <Flex className="add-toppadding">
                    <Flex.Item>
                      <Text
                        content={this.localize("synopsisTitle")}
                        weight="bold"
                      />
                    </Flex.Item>
                  </Flex>
                  <Flex>
                    <Flex.Item>
                      <div>
                        <Text
                          className="word-break"
                          content={this.state.idea.description}
                        />
                      </div>
                    </Flex.Item>
                  </Flex>
                  <Flex wrap className="add-toppadding">
                    <Flex.Item size="size.half">
                      <Flex column>
                        <Text
                          content={this.localize("tagsTitle")}
                          weight="bold"
                        />
                        <div className="margin-top-small">
                          {this.state.idea.tags &&
                            this.state.idea.tags
                              ?.split(";")
                              .map((tag, index) => (
                                <Label
                                  circular
                                  className={
                                    this.state.theme === Constants.dark
                                      ? "tags-label-wrapper-dark"
                                      : "tags-label-wrapper"
                                  }
                                  key={index}
                                  content={tag}
                                />
                              ))}
                        </div>
                        <Text
                          className="add-toppadding"
                          content={this.localize("supportingDocumentsTitle")}
                          weight="bold"
                        />
                        <div className="documents-area document-width">
                          <div className="document-text">
                            {this.state.idea.documentLinks &&
                              JSON.parse(this.state.idea.documentLinks).map(
                                (document) => (
                                  <Flex>
                                    <Text                                
                                      className="document-hover"
                                      truncated
                                      content={document}
                                      onClick={() =>
                                        window.open(document, "_blank")
                                      }
                                          />
                                      </Flex>
                                )
                              )}
                          </div>
                        </div>
                      </Flex>
                    </Flex.Item>
                    <Flex.Item size="size.half" className="add-toppadding">
                      <Flex column gap="gap.small">
                        <Text
                          content={this.localize("category")}
                          weight="bold"
                        />
                        <Flex.Item push>
                          {this.getRequiredFieldError(
                            this.state.isCategorySelected
                          )}
                        </Flex.Item>
                        <Flex.Item>
                          <Dropdown
                            fluid
                            className="category-length"
                            items={this.state.categories.map(
                              (category) => category.categoryName
                            )}
                            value={this.state.selectedCategory}
                            placeholder={this.localize("categoryPlaceholder")}
                            getA11ySelectionMessage={
                              this.getA11SelectionMessage
                            }
                            disabled={
                              this.state.idea.status !== ApprovalStatus.Pending && this.state.idea.status !== ApprovalStatus.Accepted
                            }
                          />
                        </Flex.Item>
                        {(this.state.idea.status === ApprovalStatus.Pending || this.state.idea.status === ApprovalStatus.Accepted || this.state.idea.status === ApprovalStatus.PreApproval) && (
                          <>
                            <Text
                              content={this.localize("confirmation")}
                              weight="bold"
                            />
                            <RadioGroup
                              items={this.items}
                              defaultCheckedValue={this.state.selectedStatus}
                              onCheckedValueChange={this.handleChange}

                            />
                          </>
                          )}
                        {this.state.selectedStatus ===
                          ApprovalStatus.Rejected && (
                          <>
                            {this.getRequiredFieldError(
                              this.state.feedbackTextEmpty
                            )}
                            <TextArea
                              className="reason-text-area"
                              fluid
                              maxLength={150}
                              placeholder={this.localize(
                                "reasonForRejectionText"
                              )}
                              value={this.state.feedbackText}
                              onChange={(event: any) =>
                                this.onFeedbackChange(event.target.value)
                              }
                            />
                          </>
                                              )}
                    <FlexItem size="size.half" className="add-toppadding">
                                              <Flex column gap="gap.small">
                                                  {this.state.selectedStatus === ApprovalStatus.PreApproval && (
                                                      <>                                                        
                                                          <Flex column gap="gap.small" />
                                                          <Text size="small" content={this.localize("Affected Teams") + "*"} weight="bold" />
                                                             <Flex.Item push>
                                                                  {this.getRequiredFieldError(
                                                                      this.state.isAffectedTeamsAdded
                                                                  )}
                                                              </Flex.Item>                                                                                                             
                                                          <FlexItem>
                                                              <Input
                                                                  fluid maxLength={200}
                                                                  placeholder={this.localize("Affected Teams")}
                                                                  value={this.state.affectedTeams}
                                                                  onChange={(event: any) => this.onAffectedTeamsChange(event.target.value)}
                                                                  
                                                              />
                                                          </FlexItem>

                                                          <Text content={this.localize("Pain Point in Current Process") + "*"}
                                                              weight="bold"
                                                          />

                                                          <Dropdown
                                                              fluid
                                                              className="category-length"
                                                              items={this.state.painpointsCurrentProcesses.map(
                                                                  (category) => category.painPointCurrentProcessName
                                                              )}
                                                              value={this.state.selectedPainpointsCurrentProcess}
                                                              placeholder={this.localize("selected Pain Points")}
                                                              getA11ySelectionMessage={this.getPainA11SelectionMessage}
                                                          />
                                                          <Flex.Item push>
                                                              {this.getRequiredFieldError(
                                                                  this.state.isPainpointsSelected
                                                              )}

                                                          </Flex.Item>


                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Number Impacted People") + "*"} weight="bold" />
                                                          <Flex.Item push>

                                                              {this.state.numberImpactedPeople === null ?
                                                                  this.getRequiredFieldError(
                                                                      this.state.isNumberImpactedTeam
                                                                  ) : this.getInvalidNumberInputError(
                                                                      this.state.isNumberImpactedTeam
                                                                  )}

                                                          </Flex.Item>

                                                          <input type="number"
                                                              className="category-length"
                                                              placeholder={this.localize("Impacted Teams")}
                                                              min="0"
                                                              value={this.state.numberImpactedPeople}
                                                              onChange={(event: any) => this.onnumberImpactedPeople(event.target.value)}
                                                          >
                                                          </input>
                                                          <Flex column gap="gap.small" />
                                                          <Text content={this.localize("Is this App for Personal Productivity") + "*"}
                                                              weight="bold"
                                                          />
                                                          <Flex.Item push>
                                                              {this.getRequiredFieldError(
                                                                  this.state.isAppPersonalProductivity
                                                              )}
                                                          </Flex.Item>

                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.personalAppProductivity.map(
                                                                      (category) => category.personaAppProductivityItem
                                                                  )}
                                                                  value={this.state.selectedIsthisAppforPersonalProductivity}
                                                                  placeholder={this.localize("Is this App for Personal Productivity")}
                                                                  getA11ySelectionMessage={this.getPersonalProductivityA11SelectionMessage}
                                                              />
                                                          </Flex.Item>
                                                          <Flex column gap="gap.small" />
                                                          <Text content={this.localize("Workflow Participants")+ "*"}
                                                              weight="bold"
                                                          />
                                                          <Flex.Item push>
                                                              {this.getRequiredFieldError(
                                                                  this.state.isWorkflowParticipantsSelected
                                                              )}
                                                          </Flex.Item>
                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.workflowparticipants.map(
                                                                      (category) => category.workflowParticipantsCategory
                                                                  )}
                                                                  value={this.state.selectedWorkflowParticipants}
                                                                  placeholder={this.localize("Workflow Participants")}
                                                                  getA11ySelectionMessage={this.getWorkflowParticipantsA11SelectionMessage}
                                                              />
                                                          </Flex.Item>


                                                          <Flex column gap="gap.small" />
                                                          <Text content={this.localize("Tools Required in Development")}
                                                              weight="bold"
                                                          />

                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.toolsRequiredDataset.map(
                                                                      (category) => category.toolRequiredItem
                                                                  )}
                                                                  value={this.state.selectedToolsRequiredForDevelopment}
                                                                  placeholder={this.localize("Tools Required in Development")}
                                                                  getA11ySelectionMessage={this.getToolsA11SelectionMessage}
                                                              />
                                                          </Flex.Item>

                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Number People Performing task")} weight="bold" />
                                                          <input type="number"
                                                              className="category-length"
                                                              placeholder={this.localize("Number People Performing task")}
                                                              value={this.state.numberPeopleTaskROI}
                                                              onChange={(event: any) => this.onnumberPeoplePerformingROITask(event.target.value)}
                                                          >
                                                          </input>
                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Amount Per Month")} weight="bold" />
                                                          <input
                                                              type="number"
                                                              className="category-length"
                                                              placeholder={this.localize("Amount Per Month")}
                                                              value={this.state.amountPerMonth}
                                                              onChange={(event: any) => this.onAmountPerMonth(event.target.value)}
                                                          >
                                                          </input>
                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Hours Spent Per Month")} weight="bold" />
                                                          <input
                                                              type="number"
                                                              className="category-length"
                                                              placeholder={this.localize("Hours Spent Per Month")}
                                                              value={this.state.numberHoursInMonth}
                                                              onChange={(event: any) => this.onhoursSpent(event.target.value)}
                                                          >
                                                          </input>
                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Current state of Trust")} weight="bold" />


                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.currentStateOfTrust.map(
                                                                      (category) => category.currentStateItem
                                                                  )}
                                                                  value={this.state.selectedCurrentStateOfTrust}
                                                                  placeholder={this.localize("Current state of Trust")}
                                                                  getA11ySelectionMessage={this.getCurrentStateTrustA11SelectionMessage}
                                                              />
                                                          </Flex.Item>

                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Do you have a workflow Process Map")} weight="bold" />
                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.isWorkflowProcessMap.map(
                                                                      (category) => category.workflowProcessMapValue
                                                                  )}
                                                                  value={this.state.selectedWorkflowProcessMap}
                                                                  placeholder={this.localize("Do you have a workflow Process Map")}
                                                                  getA11ySelectionMessage={this.getWorkflowMapA11SelectionMessage}
                                                              />
                                                          </Flex.Item>    
                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Choose Process Mapping Technology")} weight="bold" />

                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.processMappingTechnology.map(
                                                                      (category) => category.processMappingTechnologyItem
                                                                  )}
                                                                  value={this.state.selectedProcessMappingTechnology}
                                                                  placeholder={this.localize("Choose Process Mapping Technology")}
                                                                  getA11ySelectionMessage={this.getProcessMapTechnologyA11SelectionMessage}
                                                              />
                                                          </Flex.Item>   

                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("How many People will use the Solution")} weight="bold" />
                                                              <Input
                                                                  type="number"
                                                                  className="category-length"
                                                                  placeholder={this.localize("How many People use the Solution")}
                                                                  value={this.state.numberPeopleUsingSolution}
                                                                  onChange={(event: any) => this.numberPeopleUsingSolution(event.target.value)}

                                                              />
                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("How many Backend/Data Sources are Used in Solution")} weight="bold" />                                                    
                                                              <Input
                                                                  type="number"
                                                                  className="category-length"
                                                                  placeholder={this.localize("How many Backend/Data Sources are Used in Solution")}
                                                                  value={this.state.numberofDataSources}
                                                                  onChange={(event: any) => this.numberDatasources(event.target.value)}

                                                              />                                                         
                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("How many steps are in Workflow")} weight="bold" />                                                     
                                                              <Input
                                                                  type="number"
                                                                  className="category-length"
                                                                  placeholder={this.localize("How many steps are in Workflow")}
                                                                  value={this.state.numberofWorkflowSteps}
                                                                  onChange={(event: any) => this.numberWorkflowSteps(event.target.value)}

                                                              />
                                                      
                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Requires Attachments")} weight="bold" />

                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.isRequireAttachments.map(
                                                                      (category) => category.requireAttachments
                                                                  )}
                                                                  value={this.state.selectedrequiredAttachments}
                                                                  placeholder={this.localize("Requires Attachments")}
                                                                  getA11ySelectionMessage={this.getRequireAttachmentsA11SelectionMessage}
                                                              />
                                                          </Flex.Item> 

                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Requires Offline Support")} weight="bold" />

                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.isRequireOfflineSupport.map(
                                                                      (category) => category.requireOfflineSupport
                                                                  )}
                                                                  value={this.state.selectedRequiredOfflineSupport}
                                                                  placeholder={this.localize("Requires Offline Support")}
                                                                  getA11ySelectionMessage={this.getRequireOfflineSupportA11SelectionMessage}
                                                              />
                                                          </Flex.Item> 

                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Will the Solution be Shared outside of your Tenant")} weight="bold" />

                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.isSolutionSharedOutsideTenant.map(
                                                                      (category) => category.issolutionsharedOutsideTenant
                                                                  )}
                                                                  value={this.state.selectedOptionSolutionSharedOutsideTenant}
                                                                  placeholder={this.localize("Will the Solution be Shared outside of your Tenant")}
                                                                  getA11ySelectionMessage={this.getSolutionSharedA11SelectionMessage}
                                                              />
                                                          </Flex.Item> 

                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("How long could you tolerate Solution Downtime")} weight="bold" />

                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.requiredSolutionDowntime.map(
                                                                      (category) => category.requiredSolutionDowntime
                                                                  )}
                                                                  value={this.state.selectedSolutionDowntimeValue}
                                                                  placeholder={this.localize("How long could you tolerate Solution Downtime")}
                                                                  getA11ySelectionMessage={this.getSolutionDowntimeA11SelectionMessage}
                                                              />
                                                          </Flex.Item> 

                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Will lots of tables/lists/fields be needed to track data")} weight="bold" />

                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.requiredSolutionTables.map(
                                                                      (category) => category.requiredTablesTrackData
                                                                  )}
                                                                  value={this.state.selectedSolutionTableValue}
                                                                  placeholder={this.localize("Will lots of tables/lists/fields be needed to track data")}
                                                                  getA11ySelectionMessage={this.getSolutionTablesA11SelectionMessage}
                                                              />
                                                          </Flex.Item> 


                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("How often will the solution be used")} weight="bold" />

                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.solutionUseFrequency.map(
                                                                      (category) => category.solutionFrequencyCategory
                                                                  )}
                                                                  value={this.state.selectedSolutionUseFrequency}
                                                                  placeholder={this.localize("How often will the solution be used")}
                                                                  getA11ySelectionMessage={this.getSolutionUseFrequencyA11SelectionMessage}
                                                              />
                                                          </Flex.Item> 


                                                          <Flex column gap="gap.smaller" />
                                                          <Text size="small" content={this.localize("Is the data accessible only to the user who created it ")} weight="bold" />

                                                          <Flex.Item>
                                                              <Dropdown
                                                                  fluid
                                                                  className="category-length"
                                                                  items={this.state.dataAccessibleUser.map(
                                                                      (category) => category.dataAccessibleUser
                                                                  )}
                                                                  value={this.state.selecteddataAccessiblity}
                                                                  placeholder={this.localize("Is the data accessible only to the user who created it")}
                                                                  getA11ySelectionMessage={this.getSolutionSolutionData11SelectionMessage}
                                                              />
                                                          </Flex.Item> 


                                                          <Flex gap="gap.smaller">
                                                              <Text size="small" content={this.localize("Upload Process Map Documents")} weight="bold" />
                                                              <Flex.Item>
                                                              <Input
                                                                  placeholder={this.localize("Process Map Documents")}
                                                                  fluid value={this.state.processdocumentLink}
                                                                  onKeyDown={this.onDocumentKeyDown}
                                                                  onChange={(event: any) => this.onDocumentChange(event.target.value)} />
                                                                  </Flex.Item>
                                                              <Flex.Item push>
                                                                  <div></div>
                                                              </Flex.Item>
                                                              <AddIcon key="search" onClick={this.onDocumentAddClick} className="add-icon hover-effect" />
                                                              </Flex>

                                                          <div className="document-text">
                                                              {
                                                                  this.state.mapDocumentsList.map((value: string, index) => {
                                                                      if (value.trim().length > 0) {
                                                                          return (
                                                                              <Flex vAlign="center" key={index} className="margin-top-medium">
                                                                                  <Text color="blue" className="document-hover" styles={{ paddingRight: "0.3rem" }} truncated content={value.trim()} />
                                                                                  <Flex.Item align="center">
                                                                                      <TrashCanIcon outline styles={{ paddingRight: "0.5rem" }} className="hover-effect" onClick={() => this.onDocumentRemoveClick(index)} />
                                                                                  </Flex.Item>
                                                                              </Flex>
                                                                          )
                                                                      }
                                                                  })
                                                              }
                                                          </div>
                                                        
                                                      </>
                                                  )}
                                             </Flex>
                                          </FlexItem>
                      </Flex>
                    </Flex.Item>
                  </Flex>
                </Flex>
              )}
            </div>
            {/* Added condition to Allow Accepted status also */}
            <div className="tab-footer">                     
                      <Flex hAlign="end">
                                  <Button
                                      primary
                                      disabled={this.state.submitLoading}
                                      loading={this.state.submitLoading}
                                      content={this.localize((this.state.selectedStatus === ApprovalStatus.PreApproval) ? "Save Details" : "Confirm")}
                              onClick={(this.state.selectedStatus === ApprovalStatus.PreApproval) ? this.handleDetails : this.handleConfirm}
                          />
                      </Flex>   
                 </div>
          </div>
        </Provider>
      );
    } else if (this.state.isIdeaApprovedOrRejected) {
      return (
        <div className="submit-idea-success-message-container">
          <Flex column gap="gap.small">
            <Flex hAlign="center" className="margin-space">
              {this.state.selectedStatus === ApprovalStatus.Approved ? (
                <Image
                  className="preview-image-icon"
                  fluid
                  src={this.appUrl + "/Artifacts/successIcon.png"}
                />
              ) : this.state.selectedStatus === ApprovalStatus.Accepted ? (
                <Image
                  className="preview-image-icon"
                  fluid
                  src={this.appUrl + "/Artifacts/successIcon.png"}
                              />
              ) : this.state.selectedStatus === ApprovalStatus.PreApproval? (
                <Image
                className="preview-image-icon"
                fluid
                src={this.appUrl + "/Artifacts/successIcon.png"}
                />
              ) : (
                <Image
                  className="preview-image-icon"
                  fluid
                  src={this.appUrl + "/Artifacts/rejectIcon.png"}
                />
              )}{" "}
            </Flex>
            <Flex hAlign="center" className="space">
              <Text
                weight="bold"
                content={
                  this.state.selectedStatus === ApprovalStatus.Approved
                    ? this.localize("approvedIdeaSuccessMessage")
                    : this.state.selectedStatus === ApprovalStatus.Accepted
                    ? this.localize("acceptedIdeaSuccessMessage")
                    : this.state.selectedStatus === ApprovalStatus.PreApproval
                    ? this.localize("preApprovedSuccessMessage")
                    : this.localize("rejectedIdeaMessage")
                }
                size="medium"
              />
            </Flex>
          </Flex>
        </div>
      );
    } else {
      return <Loader />;
    }
  }
}

export default withTranslation()(ViewIdea);
