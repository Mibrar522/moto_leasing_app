package com.motoleasing.agent.ui

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.motoleasing.agent.data.api.FeatureDto
import com.motoleasing.agent.data.api.CustomerDto
import com.motoleasing.agent.data.api.CustomerRequest
import com.motoleasing.agent.data.api.DashboardResponse
import com.motoleasing.agent.data.api.InventoryVehicleDto
import com.motoleasing.agent.data.api.SaleTransactionDto
import com.motoleasing.agent.data.api.SaleRequest
import com.motoleasing.agent.data.api.SessionUser
import com.motoleasing.agent.data.api.WorkflowTaskDto
import com.motoleasing.agent.data.repository.AgentRepository
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.text.NumberFormat
import java.util.Locale

data class DashboardCardState(
    val userId: String = "",
    val employeeName: String = "",
    val dealerName: String = "",
    val totalVehicleSales: Int = 0,
    val totalVehicleSalesValue: Double = 0.0,
    val totalCommission: Double = 0.0,
    val pendingTasks: Int = 0
)

data class ReportMetricState(
    val title: String,
    val value: String,
    val caption: String
)

data class FeatureSectionState(
    val title: String,
    val features: List<String>
)

enum class CustomerUploadField {
    CNIC_FRONT,
    CNIC_BACK,
    THUMB,
    SIGNATURE
}

enum class SaleUploadField {
    AGREEMENT,
    DEALER_SIGNATURE,
    AUTHORIZED_SIGNATURE,
    CUSTOMER_CNIC_FRONT,
    CUSTOMER_CNIC_BACK,
    BANK_CHECK,
    MISC_DOCUMENT
}

data class CustomerFormState(
    val fullName: String = "",
    val fatherName: String = "",
    val cnicPassportNumber: String = "",
    val contactEmail: String = "",
    val contactPhone: String = "",
    val gender: String = "",
    val country: String = "Pakistan",
    val address: String = "",
    val dateOfBirth: String = "",
    val identityDocUrl: String = "",
    val identityDocBackUrl: String = "",
    val fingerprintStatus: String = "NOT_CAPTURED",
    val fingerprintQuality: String = "",
    val fingerprintDevice: String = "",
    val fingerprintThumbUrl: String = "",
    val signatureImageUrl: String = ""
)

data class SaleFormState(
    val customerId: String = "",
    val vehicleId: String = "",
    val saleMode: String = "INSTALLMENT",
    val agreementNumber: String = "",
    val agreementDate: String = LocalDate.now().toString(),
    val purchaseDate: String = LocalDate.now().toString(),
    val downPaymentMode: String = "AMOUNT",
    val downPaymentPercent: String = "",
    val agreementPdfUrl: String = "",
    val dealerSignatureUrl: String = "",
    val authorizedSignatureUrl: String = "",
    val customerCnicFrontUrl: String = "",
    val customerCnicBackUrl: String = "",
    val bankCheckUrl: String = "",
    val miscDocumentUrl: String = "",
    val vehiclePrice: String = "",
    val downPayment: String = "",
    val financedAmount: String = "",
    val monthlyInstallment: String = "",
    val installmentMonths: String = "",
    val firstDueDate: String = "",
    val witnessName: String = "",
    val witnessCnic: String = "",
    val witnessTwoName: String = "",
    val witnessTwoCnic: String = "",
    val remarks: String = ""
)

class AgentViewModel(
    private val repository: AgentRepository
) : ViewModel() {
    private val currencyFormatter = NumberFormat.getCurrencyInstance(Locale("en", "PK"))
    var isAuthenticated by mutableStateOf(repository.getSavedToken()?.isNotBlank() == true)
        private set
    var isLoading by mutableStateOf(false)
        private set
    var message by mutableStateOf("")
        private set
    var errorMessage by mutableStateOf("")
        private set
    var activeThemeKey by mutableStateOf(repository.getSavedThemeKey())
        private set
    var backendUrl by mutableStateOf(repository.getSavedApiBaseUrl())
        private set
    var dashboard by mutableStateOf(DashboardCardState())
        private set
    var dashboardPayload by mutableStateOf<DashboardResponse?>(null)
        private set
    var currentUser by mutableStateOf<SessionUser?>(null)
        private set
    var lastCreatedCustomerId by mutableStateOf("")
        private set
    var editingCustomerId by mutableStateOf<String?>(null)
        private set
    var customerForm by mutableStateOf(CustomerFormState())
        private set
    var saleForm by mutableStateOf(SaleFormState())
        private set

    fun updateCustomerField(transform: CustomerFormState.() -> CustomerFormState) {
        customerForm = customerForm.transform()
    }

    fun loadCustomerForEdit(customerId: String) {
        val customer = dashboardPayload?.customers.orEmpty().firstOrNull { it.id == customerId } ?: return
        editingCustomerId = customer.id
        customerForm = CustomerFormState(
            fullName = customer.fullName,
            fatherName = customer.fatherName.orEmpty(),
            cnicPassportNumber = customer.cnicPassportNumber,
            contactEmail = customer.contactEmail.orEmpty(),
            contactPhone = customer.contactPhone.orEmpty(),
            gender = customer.gender.orEmpty(),
            country = customer.country ?: "Pakistan",
            address = customer.address.orEmpty(),
            dateOfBirth = customer.dateOfBirth.orEmpty(),
            identityDocUrl = customer.identityDocUrl.orEmpty(),
            identityDocBackUrl = customer.identityDocBackUrl.orEmpty(),
            fingerprintStatus = customer.fingerprintStatus ?: "NOT_CAPTURED",
            fingerprintQuality = customer.fingerprintQuality.orEmpty(),
            fingerprintDevice = customer.fingerprintDevice.orEmpty(),
            fingerprintThumbUrl = customer.fingerprintThumbUrl.orEmpty(),
            signatureImageUrl = customer.signatureImageUrl.orEmpty()
        )
    }

    fun startNewCustomer() {
        editingCustomerId = null
        customerForm = CustomerFormState()
    }

    fun updateSaleField(transform: SaleFormState.() -> SaleFormState) {
        saleForm = saleForm.transform()
    }

    fun updateBackendUrl(url: String) {
        backendUrl = url
    }

    fun persistBackendUrl(url: String) {
        repository.saveApiBaseUrl(url)
        backendUrl = repository.getSavedApiBaseUrl()
        message = "Backend URL saved for this device."
    }

    fun login(baseUrl: String, dealerId: String, identifier: String, password: String) {
        viewModelScope.launch {
            runWithLoading {
                val response = repository.login(baseUrl, dealerId, identifier, password)
                backendUrl = repository.getSavedApiBaseUrl()
                activeThemeKey = response.user.themeKey ?: "sandstone"
                currentUser = response.user
                isAuthenticated = true
                message = "Welcome back."
                errorMessage = ""
                refreshDashboard()
            }
        }
    }

    fun refreshDashboard() {
        viewModelScope.launch {
            runWithLoading {
                val response = repository.fetchDashboard()
                dashboardPayload = response
                currentUser = response.user
                val totalCommission = response.employeeCommissions.sumOf { it.commissionAmount ?: 0.0 }
                val totalSalesValue = response.salesTransactions.sumOf { it.vehiclePrice ?: 0.0 }
                dashboard = DashboardCardState(
                    userId = response.user.id,
                    employeeName = response.user.fullName,
                    dealerName = response.user.dealerName.orEmpty(),
                    totalVehicleSales = response.salesTransactions.size,
                    totalVehicleSalesValue = totalSalesValue,
                    totalCommission = totalCommission,
                    pendingTasks = response.workflowTasks.count { it.taskStatus.equals("PENDING", true) }
                )
                activeThemeKey = response.user.themeKey ?: activeThemeKey
                if (saleForm.customerId.isBlank()) {
                    val preferredCustomerId = if (lastCreatedCustomerId.isNotBlank()) {
                        lastCreatedCustomerId
                    } else {
                        response.customers.firstOrNull()?.id.orEmpty()
                    }
                    saleForm = saleForm.copy(customerId = preferredCustomerId)
                }
                if (saleForm.vehicleId.isBlank()) {
                    saleForm = saleForm.copy(vehicleId = availableVehicles().firstOrNull()?.id.orEmpty())
                }
                if (saleForm.agreementNumber.isBlank()) {
                    val maxAgreement = response.salesTransactions
                        .mapNotNull { it.agreementNumber?.trim() }
                        .mapNotNull { it.toLongOrNull() }
                        .maxOrNull() ?: 10000L
                    saleForm = saleForm.copy(agreementNumber = (maxAgreement + 1).toString())
                }
            }
        }
    }

    fun submitCustomer() {
        viewModelScope.launch {
            runWithLoading {
                val isEditing = !editingCustomerId.isNullOrBlank()
                val payload = CustomerRequest(
                    fullName = customerForm.fullName,
                    fatherName = customerForm.fatherName,
                    cnicPassportNumber = customerForm.cnicPassportNumber,
                    contactEmail = customerForm.contactEmail,
                    contactPhone = customerForm.contactPhone,
                    gender = customerForm.gender,
                    country = customerForm.country,
                    address = customerForm.address,
                    dateOfBirth = customerForm.dateOfBirth,
                    identityDocUrl = customerForm.identityDocUrl,
                    identityDocBackUrl = customerForm.identityDocBackUrl,
                    fingerprintStatus = customerForm.fingerprintStatus,
                    fingerprintQuality = customerForm.fingerprintQuality,
                    fingerprintDevice = customerForm.fingerprintDevice,
                    fingerprintThumbUrl = customerForm.fingerprintThumbUrl,
                    signatureImageUrl = customerForm.signatureImageUrl
                )
                val saved = if (!isEditing) {
                    repository.createCustomer(payload)
                } else {
                    repository.updateCustomer(editingCustomerId!!, payload)
                }
                customerForm = CustomerFormState()
                lastCreatedCustomerId = saved.id
                editingCustomerId = null
                saleForm = saleForm.copy(customerId = saved.id)
                message = if (!isEditing) {
                    "Customer ${saved.fullName} submitted successfully."
                } else {
                    "Customer ${saved.fullName} updated successfully."
                }
                errorMessage = ""
                refreshDashboard()
            }
        }
    }

    fun submitSale() {
        viewModelScope.launch {
            runWithLoading {
                val created = repository.createSale(
                    SaleRequest(
                        customerId = saleForm.customerId,
                        vehicleId = saleForm.vehicleId,
                        saleMode = saleForm.saleMode,
                        agreementNumber = saleForm.agreementNumber,
                        agreementDate = saleForm.agreementDate,
                        purchaseDate = saleForm.purchaseDate,
                        agreementPdfUrl = saleForm.agreementPdfUrl,
                        dealerSignatureUrl = saleForm.dealerSignatureUrl,
                        authorizedSignatureUrl = saleForm.authorizedSignatureUrl,
                        customerCnicFrontUrl = saleForm.customerCnicFrontUrl,
                        customerCnicBackUrl = saleForm.customerCnicBackUrl,
                        bankCheckUrl = saleForm.bankCheckUrl,
                        miscDocumentUrl = saleForm.miscDocumentUrl,
                        vehiclePrice = saleForm.vehiclePrice.toDoubleOrNull() ?: 0.0,
                        downPayment = saleForm.downPayment.toDoubleOrNull() ?: 0.0,
                        financedAmount = saleForm.financedAmount.toDoubleOrNull() ?: 0.0,
                        monthlyInstallment = saleForm.monthlyInstallment.toDoubleOrNull() ?: 0.0,
                        installmentMonths = saleForm.installmentMonths.toIntOrNull() ?: 0,
                        firstDueDate = saleForm.firstDueDate,
                        witnessName = saleForm.witnessName,
                        witnessCnic = saleForm.witnessCnic,
                        witnessTwoName = saleForm.witnessTwoName,
                        witnessTwoCnic = saleForm.witnessTwoCnic,
                        remarks = saleForm.remarks
                    )
                )
                saleForm = SaleFormState()
                message = "Sale request ${created.agreementNumber ?: created.id} submitted into workflow."
                errorMessage = ""
                refreshDashboard()
            }
        }
    }

    fun uploadCustomerAsset(target: CustomerUploadField, fileName: String, mimeType: String, fileBytes: ByteArray) {
        viewModelScope.launch {
            runWithLoading {
                val upload = repository.uploadCustomerAsset(fileName, mimeType, fileBytes)
                customerForm = when (target) {
                    CustomerUploadField.CNIC_FRONT -> customerForm.copy(identityDocUrl = upload.url)
                    CustomerUploadField.CNIC_BACK -> customerForm.copy(identityDocBackUrl = upload.url)
                    CustomerUploadField.THUMB -> customerForm.copy(
                        fingerprintThumbUrl = upload.url,
                        fingerprintStatus = "CAPTURED"
                    )
                    CustomerUploadField.SIGNATURE -> customerForm.copy(signatureImageUrl = upload.url)
                }
                message = "${target.name.replace('_', ' ').lowercase().replaceFirstChar { it.uppercase() }} uploaded."
                errorMessage = ""
            }
        }
    }

    fun uploadSaleAsset(target: SaleUploadField, fileName: String, mimeType: String, fileBytes: ByteArray) {
        viewModelScope.launch {
            runWithLoading {
                val upload = if (target == SaleUploadField.AGREEMENT) {
                    repository.uploadAgreement(fileName, mimeType, fileBytes)
                } else {
                    repository.uploadSaleDocument(fileName, mimeType, fileBytes)
                }
                saleForm = when (target) {
                    SaleUploadField.AGREEMENT -> saleForm.copy(agreementPdfUrl = upload.url)
                    SaleUploadField.DEALER_SIGNATURE -> saleForm.copy(dealerSignatureUrl = upload.url)
                    SaleUploadField.AUTHORIZED_SIGNATURE -> saleForm.copy(authorizedSignatureUrl = upload.url)
                    SaleUploadField.CUSTOMER_CNIC_FRONT -> saleForm.copy(customerCnicFrontUrl = upload.url)
                    SaleUploadField.CUSTOMER_CNIC_BACK -> saleForm.copy(customerCnicBackUrl = upload.url)
                    SaleUploadField.BANK_CHECK -> saleForm.copy(bankCheckUrl = upload.url)
                    SaleUploadField.MISC_DOCUMENT -> saleForm.copy(miscDocumentUrl = upload.url)
                }
                message = "${target.name.replace('_', ' ').lowercase().replaceFirstChar { it.uppercase() }} uploaded."
                errorMessage = ""
            }
        }
    }

    fun approveWorkflowTask(taskId: String, decisionNotes: String = "") {
        viewModelScope.launch {
            runWithLoading {
                val result = repository.approveWorkflowTask(taskId, decisionNotes)
                message = result.message ?: "Workflow task approved."
                errorMessage = ""
                refreshDashboard()
            }
        }
    }

    fun rejectWorkflowTask(taskId: String, decisionNotes: String = "") {
        viewModelScope.launch {
            runWithLoading {
                val result = repository.rejectWorkflowTask(taskId, decisionNotes)
                message = result.message ?: "Workflow task rejected."
                errorMessage = ""
                refreshDashboard()
            }
        }
    }

    fun availableCustomers(): List<CustomerDto> = dashboardPayload?.customers.orEmpty()

    fun editableCustomers(): List<CustomerDto> {
        val currentUserId = currentUser?.id ?: return emptyList()
        return dashboardPayload?.customers.orEmpty()
            .filter { it.createdByAgent == currentUserId }
            .sortedBy { it.fullName.lowercase() }
    }

    fun availableCustomersForThisMonth(): List<CustomerDto> {
        val currentUserId = currentUser?.id ?: return emptyList()
        val now = java.time.LocalDate.now()
        return dashboardPayload?.customers.orEmpty().filter { customer ->
            val createdAt = customer.createdAt
            val createdDate = createdAt?.let {
                runCatching { java.time.OffsetDateTime.parse(it).toLocalDate() }.getOrNull()
                    ?: runCatching { java.time.LocalDate.parse(it.take(10)) }.getOrNull()
            }
            val isSameMonth = createdDate?.let { it.year == now.year && it.monthValue == now.monthValue } ?: false
            val isCreatedByEmployee = customer.createdByAgent == currentUserId
            isSameMonth && isCreatedByEmployee
        }
    }

    fun availableVehicles(): List<InventoryVehicleDto> =
        dashboardPayload?.inventory.orEmpty().filter { it.status.equals("AVAILABLE", true) }

    fun mySalesTransactions(): List<SaleTransactionDto> {
        val userName = currentUser?.fullName?.trim().orEmpty()
        val allSales = dashboardPayload?.salesTransactions.orEmpty()
        if (userName.isBlank()) return allSales
        val filtered = allSales.filter { it.agentName?.trim().equals(userName, ignoreCase = true) }
        return if (filtered.isNotEmpty()) filtered else allSales
    }

    fun isSuperAdmin(): Boolean = currentUser?.roleName.equals("SUPER_ADMIN", true)

    fun hasFeature(vararg keys: String): Boolean {
        val featureKeys = currentUser?.features.orEmpty().map { it.key }.toSet()
        return keys.any { featureKeys.contains(it) }
    }

    fun reportMetrics(): List<ReportMetricState> {
        val payload = dashboardPayload ?: return emptyList()
        val receivedCount = payload.employeeSales?.receivedCount ?: 0
        val pendingCount = payload.employeeSales?.pendingCount ?: payload.workflowTasks.count { it.taskStatus.equals("PENDING", true) }
        val availableVehicles = payload.inventory.count { it.status.equals("AVAILABLE", true) }
        val receivedValue = payload.employeeSales?.receivedValue ?: payload.salesTransactions.sumOf { it.vehiclePrice ?: 0.0 }
        val pendingValue = payload.employeeSales?.pendingValue ?: 0.0
        val totalCommission = payload.employeeCommissions.sumOf { it.commissionAmount ?: 0.0 }

        return listOf(
            ReportMetricState("My Commission", currencyFormatter.format(totalCommission), "Earnings for your profile"),
            ReportMetricState("Received Sales", receivedCount.toString(), "Completed transactions"),
            ReportMetricState("Pending Workflow", pendingCount.toString(), "Requests waiting review"),
            ReportMetricState("Received Value", currencyFormatter.format(receivedValue), "Sales amount handled"),
            ReportMetricState("Pending Value", currencyFormatter.format(pendingValue), "Value still under process"),
            ReportMetricState("Available Vehicles", availableVehicles.toString(), "Vehicles ready for sale"),
            ReportMetricState("Commission", currencyFormatter.format(totalCommission), "Current employee earning")
        )
    }

    fun featureSections(): List<FeatureSectionState> {
        val features = currentUser?.features.orEmpty()
        if (features.isEmpty()) return emptyList()

        val sections = linkedMapOf(
            "Customer Operations" to setOf("FEAT_CUSTOMER_FORM", "FEAT_CUSTOMER_FINGERPRINT", "FEAT_CUSTOMER_REGISTER", "FEAT_CUSTOMER_RECORD_VIEW", "FEAT_CUSTOMER_RECORD_EDIT"),
            "Sales Operations" to setOf("FEAT_SALES_AGREEMENT_FORM", "FEAT_SALES_AGREEMENT_SUMMARY", "FEAT_SALES_REGISTER", "FEAT_TRANSACTION_REGISTER", "FEAT_SALES_INSTALLMENT_PREVIEW"),
            "Workflow" to setOf("FEAT_WORKFLOW_VIEW", "FEAT_WORKFLOW_TASKS", "FEAT_APPLICATIONS_LIST"),
            "Reports" to setOf("FEAT_REPORT_DAILY_SALES", "FEAT_REPORT_CUSTOMERS", "FEAT_REPORT_CUSTOMER_TRANSACTIONS", "FEAT_REPORT_BUSINESS_TRANSACTIONS", "FEAT_REPORT_INVOICE_VIEW", "FEAT_REPORT_EMPLOYEES", "FEAT_REPORT_SALARY"),
            "Employees & Access" to setOf("FEAT_EMPLOYEE_DIRECTORY", "FEAT_EMPLOYEE_FORM", "FEAT_EMPLOYEE_EDIT", "FEAT_ACCESS_CONTROL", "FEAT_PROFILE_SWITCH")
        )

        return sections.mapNotNull { (title, keys) ->
            val labels = features.filter { keys.contains(it.key) }.map { it.displayLabel() }.distinct()
            if (labels.isEmpty()) null else FeatureSectionState(title = title, features = labels)
        }
    }

    fun canActionWorkflowTasks(): Boolean = hasFeature("FEAT_WORKFLOW_TASKS")

    fun buildAssetUrl(assetUrl: String?): String {
        val raw = (assetUrl ?: "").trim()
        if (raw.isBlank()) return ""
        if (raw.startsWith("http://") || raw.startsWith("https://")) return raw
        val origin = backendUrl.removeSuffix("/").replace(Regex("/api/v1/?$"), "")
        val normalizedPath = if (raw.startsWith("/")) raw else "/$raw"
        return "$origin$normalizedPath"
    }

    fun logout() {
        repository.clearSession()
        isAuthenticated = false
        dashboardPayload = null
        currentUser = null
        dashboard = DashboardCardState()
        editingCustomerId = null
        customerForm = CustomerFormState()
        saleForm = SaleFormState()
        message = "Logged out."
        errorMessage = ""
    }

    fun clearError() {
        errorMessage = ""
    }

    private suspend fun runWithLoading(block: suspend () -> Unit) {
        isLoading = true
        try {
            block()
        } catch (error: Exception) {
            errorMessage = error.message ?: "Something went wrong."
        } finally {
            isLoading = false
        }
    }
}

private fun FeatureDto.displayLabel(): String = when (key) {
    "FEAT_CUSTOMER_FORM" -> "Customer onboarding"
    "FEAT_CUSTOMER_FINGERPRINT" -> "Biometric capture"
    "FEAT_CUSTOMER_REGISTER" -> "Customer registry"
    "FEAT_CUSTOMER_RECORD_VIEW" -> "Customer view"
    "FEAT_CUSTOMER_RECORD_EDIT" -> "Customer edit"
    "FEAT_SALES_AGREEMENT_FORM" -> "Sales request"
    "FEAT_SALES_AGREEMENT_SUMMARY" -> "Agreement summary"
    "FEAT_SALES_REGISTER" -> "Sales register"
    "FEAT_TRANSACTION_REGISTER" -> "Transaction register"
    "FEAT_SALES_INSTALLMENT_PREVIEW" -> "Installment preview"
    "FEAT_WORKFLOW_VIEW" -> "Workflow access"
    "FEAT_WORKFLOW_TASKS" -> "User tasks"
    "FEAT_APPLICATIONS_LIST" -> "Application queue"
    "FEAT_REPORT_DAILY_SALES" -> "Daily sales report"
    "FEAT_REPORT_CUSTOMERS" -> "Customer report"
    "FEAT_REPORT_CUSTOMER_TRANSACTIONS" -> "Customer transactions report"
    "FEAT_REPORT_BUSINESS_TRANSACTIONS" -> "Business transactions report"
    "FEAT_REPORT_INVOICE_VIEW" -> "Invoice report"
    "FEAT_REPORT_EMPLOYEES" -> "Employee report"
    "FEAT_REPORT_SALARY" -> "Salary report"
    "FEAT_EMPLOYEE_DIRECTORY" -> "Employee directory"
    "FEAT_EMPLOYEE_FORM" -> "Employee onboarding"
    "FEAT_EMPLOYEE_EDIT" -> "Employee edit"
    "FEAT_ACCESS_CONTROL" -> "Access control"
    "FEAT_PROFILE_SWITCH" -> "Profile switch"
    else -> name ?: key
}
