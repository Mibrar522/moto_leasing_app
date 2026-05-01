package com.motoleasing.agent.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AdminPanelSettings
import androidx.compose.material.icons.outlined.Assessment
import androidx.compose.material.icons.outlined.AssignmentTurnedIn
import androidx.compose.material.icons.outlined.Dashboard
import androidx.compose.material.icons.outlined.Logout
import androidx.compose.material.icons.outlined.PersonAddAlt
import androidx.compose.material.icons.outlined.RequestPage
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.TextButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.motoleasing.agent.ui.screens.CustomerFormScreen
import com.motoleasing.agent.ui.screens.DashboardScreen
import com.motoleasing.agent.ui.screens.LoginScreen
import com.motoleasing.agent.ui.screens.ReportsScreen
import com.motoleasing.agent.ui.screens.SaleFormScreen
import com.motoleasing.agent.ui.screens.AccessProfileScreen
import com.motoleasing.agent.ui.screens.WorkflowTasksScreen
import com.motoleasing.agent.ui.theme.MotoLeasingAgentTheme

private enum class AgentTab { DASHBOARD, CUSTOMER, SALE, TASKS, REPORTS, ACCESS }

private data class AgentTabItem(
    val tab: AgentTab,
    val label: String
)

@Composable
fun AgentApp(viewModel: AgentViewModel) {
    MotoLeasingAgentTheme(themeKey = viewModel.activeThemeKey) {
        val snackbarHostState = remember { SnackbarHostState() }
        var selectedTab by remember { mutableStateOf(AgentTab.DASHBOARD) }
        val availableTabs = remember(
            viewModel.currentUser,
            viewModel.dashboardPayload,
            viewModel.isAuthenticated
        ) {
            buildList {
                add(AgentTabItem(AgentTab.DASHBOARD, "Dashboard"))
                if (viewModel.hasFeature("FEAT_CUSTOMER_FORM", "FEAT_CUSTOMER_REGISTER", "FEAT_CUSTOMER_RECORD_VIEW")) {
                    add(AgentTabItem(AgentTab.CUSTOMER, "Customer"))
                }
                if (viewModel.hasFeature("FEAT_SALES_AGREEMENT_FORM", "FEAT_SALES_REGISTER")) {
                    add(AgentTabItem(AgentTab.SALE, "Sale"))
                }
                if (viewModel.hasFeature("FEAT_WORKFLOW_TASKS", "FEAT_WORKFLOW_VIEW", "FEAT_APPLICATIONS_LIST")) {
                    add(AgentTabItem(AgentTab.TASKS, "Tasks"))
                }
                if (viewModel.hasFeature(
                        "FEAT_REPORT_DAILY_SALES",
                        "FEAT_REPORT_CUSTOMERS",
                        "FEAT_REPORT_CUSTOMER_TRANSACTIONS",
                        "FEAT_REPORT_BUSINESS_TRANSACTIONS",
                        "FEAT_REPORT_INVOICE_VIEW",
                        "FEAT_REPORT_EMPLOYEES",
                        "FEAT_REPORT_SALARY"
                    ) || viewModel.isSuperAdmin()
                ) {
                    add(AgentTabItem(AgentTab.REPORTS, "Reports"))
                }
                add(AgentTabItem(AgentTab.ACCESS, "Access"))
            }
        }

        LaunchedEffect(viewModel.isAuthenticated) {
            if (viewModel.isAuthenticated) {
                viewModel.refreshDashboard()
            }
        }

        LaunchedEffect(viewModel.message) {
            if (viewModel.message.isNotBlank()) {
                snackbarHostState.showSnackbar(viewModel.message)
            }
        }

        LaunchedEffect(availableTabs) {
            if (availableTabs.none { it.tab == selectedTab }) {
                selectedTab = availableTabs.firstOrNull()?.tab ?: AgentTab.DASHBOARD
            }
        }

        if (!viewModel.isAuthenticated) {
            LoginScreen(
                isLoading = viewModel.isLoading,
                message = viewModel.message,
                backendUrl = viewModel.backendUrl,
                onBackendUrlChange = viewModel::updateBackendUrl,
                onLogin = viewModel::login
            )
            if (viewModel.errorMessage.isNotBlank()) {
                AlertDialog(
                    onDismissRequest = { viewModel.clearError() },
                    title = { Text("Action failed") },
                    text = { Text(viewModel.errorMessage) },
                    confirmButton = {
                        TextButton(onClick = { viewModel.clearError() }) { Text("Close") }
                    }
                )
            }
            return@MotoLeasingAgentTheme
        }

        Scaffold(
            snackbarHost = { SnackbarHost(snackbarHostState) },
            bottomBar = {
                NavigationBar {
                    availableTabs.forEach { tabItem ->
                        NavigationBarItem(
                            selected = selectedTab == tabItem.tab,
                            onClick = { selectedTab = tabItem.tab },
                            icon = {
                                Icon(
                                    when (tabItem.tab) {
                                        AgentTab.DASHBOARD -> Icons.Outlined.Dashboard
                                        AgentTab.CUSTOMER -> Icons.Outlined.PersonAddAlt
                                        AgentTab.SALE -> Icons.Outlined.RequestPage
                                        AgentTab.TASKS -> Icons.Outlined.AssignmentTurnedIn
                                        AgentTab.REPORTS -> Icons.Outlined.Assessment
                                        AgentTab.ACCESS -> Icons.Outlined.AdminPanelSettings
                                    },
                                    contentDescription = null
                                )
                            },
                            label = { Text(tabItem.label) }
                        )
                    }
                    NavigationBarItem(
                        selected = false,
                        onClick = viewModel::logout,
                        icon = { Icon(Icons.Outlined.Logout, contentDescription = null) },
                        label = { Text("Logout") }
                    )
                }
            }
        ) { padding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(MaterialTheme.colorScheme.background, Color(0xFFEFF5FF))
                        )
                    )
                    .padding(padding)
            ) {
                when (selectedTab) {
                    AgentTab.DASHBOARD -> DashboardScreen(
                        dashboard = viewModel.dashboard,
                        userName = viewModel.currentUser?.fullName.orEmpty(),
                        dealerName = viewModel.currentUser?.dealerName.orEmpty(),
                        ads = viewModel.dashboardPayload?.ads.orEmpty(),
                        inventory = viewModel.dashboardPayload?.inventory.orEmpty(),
                        sales = viewModel.dashboardPayload?.salesTransactions.orEmpty(),
                        tasks = viewModel.dashboardPayload?.workflowTasks.orEmpty(),
                        onRefresh = viewModel::refreshDashboard,
                        showSalesCards = viewModel.hasFeature("FEAT_SALES_REGISTER", "FEAT_TRANSACTION_REGISTER", "FEAT_REPORT_DAILY_SALES") || viewModel.isSuperAdmin(),
                        showCommissionCard = viewModel.hasFeature("FEAT_REPORT_SALARY") || viewModel.isSuperAdmin(),
                        showPendingTasksCard = viewModel.hasFeature("FEAT_WORKFLOW_TASKS", "FEAT_WORKFLOW_VIEW") || viewModel.isSuperAdmin(),
                        showTransactionsButton = viewModel.hasFeature("FEAT_TRANSACTION_REGISTER") || viewModel.isSuperAdmin(),
                        onOpenTransactions = {
                            selectedTab = when {
                                availableTabs.any { it.tab == AgentTab.REPORTS } -> AgentTab.REPORTS
                                availableTabs.any { it.tab == AgentTab.SALE } -> AgentTab.SALE
                                else -> AgentTab.DASHBOARD
                            }
                        },
                        buildAssetUrl = viewModel::buildAssetUrl
                    )
                    AgentTab.CUSTOMER -> CustomerFormScreen(
                        state = viewModel.customerForm,
                        customers = viewModel.editableCustomers(),
                        editingCustomerId = viewModel.editingCustomerId,
                        backendUrl = viewModel.backendUrl,
                        loading = viewModel.isLoading,
                        onChange = viewModel::updateCustomerField,
                        onSelectCustomer = viewModel::loadCustomerForEdit,
                        onStartNewCustomer = viewModel::startNewCustomer,
                        onSubmit = viewModel::submitCustomer,
                        onUploadAsset = viewModel::uploadCustomerAsset
                    )
                    AgentTab.SALE -> SaleFormScreen(
                        state = viewModel.saleForm,
                        backendUrl = viewModel.backendUrl,
                        loading = viewModel.isLoading,
                        ads = viewModel.dashboardPayload?.ads.orEmpty(),
                        customers = viewModel.availableCustomersForThisMonth(),
                        vehicles = viewModel.availableVehicles(),
                        sales = viewModel.mySalesTransactions(),
                        onChange = viewModel::updateSaleField,
                        onSubmit = viewModel::submitSale,
                        onUploadAsset = viewModel::uploadSaleAsset,
                        buildAssetUrl = viewModel::buildAssetUrl
                    )
                    AgentTab.TASKS -> WorkflowTasksScreen(
                        tasks = viewModel.dashboardPayload?.workflowTasks.orEmpty(),
                        backendUrl = viewModel.backendUrl,
                        canActionTasks = viewModel.canActionWorkflowTasks(),
                        onApprove = viewModel::approveWorkflowTask,
                        onReject = viewModel::rejectWorkflowTask,
                        buildAssetUrl = viewModel::buildAssetUrl
                    )
                    AgentTab.REPORTS -> ReportsScreen(
                        metrics = viewModel.reportMetrics()
                    )
                    AgentTab.ACCESS -> AccessProfileScreen(
                        user = viewModel.currentUser,
                        backendUrl = viewModel.backendUrl,
                        sections = viewModel.featureSections(),
                        onSaveBackendUrl = viewModel::persistBackendUrl
                    )
                }

                if (viewModel.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier
                            .align(Alignment.TopCenter)
                            .padding(top = 16.dp),
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }

        if (viewModel.errorMessage.isNotBlank()) {
            AlertDialog(
                onDismissRequest = { viewModel.clearError() },
                title = { Text("Action failed") },
                text = { Text(viewModel.errorMessage) },
                confirmButton = {
                    TextButton(onClick = { viewModel.clearError() }) { Text("Close") }
                }
            )
        }
    }
}
