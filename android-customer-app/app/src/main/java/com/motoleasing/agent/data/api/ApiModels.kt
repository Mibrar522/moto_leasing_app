package com.motoleasing.agent.data.api

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    val identifier: String,
    @SerializedName("dealer_id") val dealerId: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: SessionUser
)

data class SessionUser(
    val id: String,
    @SerializedName("full_name") val fullName: String,
    val email: String,
    @SerializedName("role_name") val roleName: String? = null,
    @SerializedName("dealer_name") val dealerName: String? = null,
    @SerializedName("dealer_code") val dealerCode: String? = null,
    @SerializedName("dealer_id") val dealerId: String? = null,
    @SerializedName("theme_key") val themeKey: String? = null,
    @SerializedName("employee_id") val employeeId: String? = null,
    val features: List<FeatureDto> = emptyList()
)

data class FeatureDto(
    val id: Int? = null,
    val key: String,
    val name: String? = null
)

data class UploadResponse(
    val url: String,
    @SerializedName("originalName") val originalName: String? = null,
    val message: String? = null
)

data class ActionResponse(
    val message: String? = null
)

data class DashboardResponse(
    val user: SessionUser,
    @SerializedName("employeeSales") val employeeSales: EmployeeSalesSummary? = null,
    @SerializedName("employeeCommissions") val employeeCommissions: List<EmployeeCommissionDto> = emptyList(),
    @SerializedName("salesTransactions") val salesTransactions: List<SaleTransactionDto> = emptyList(),
    val inventory: List<InventoryVehicleDto> = emptyList(),
    val customers: List<CustomerDto> = emptyList(),
    val ads: List<AdDto> = emptyList(),
    @SerializedName("workflowTasks") val workflowTasks: List<WorkflowTaskDto> = emptyList()
)

data class EmployeeSalesSummary(
    @SerializedName("receivedCount") val receivedCount: Int = 0,
    @SerializedName("pendingCount") val pendingCount: Int = 0,
    @SerializedName("receivedValue") val receivedValue: Double = 0.0,
    @SerializedName("pendingValue") val pendingValue: Double = 0.0,
    @SerializedName("overdueFollowups") val overdueFollowups: Int = 0
)

data class EmployeeCommissionDto(
    @SerializedName("commission_amount") val commissionAmount: Double? = null,
    @SerializedName("employee_id") val employeeId: String? = null
)

data class InventoryVehicleDto(
    val id: String,
    val brand: String? = null,
    val model: String? = null,
    @SerializedName("vehicle_type") val vehicleType: String? = null,
    @SerializedName("registration_number") val registrationNumber: String? = null,
    @SerializedName("chassis_number") val chassisNumber: String? = null,
    @SerializedName("engine_number") val engineNumber: String? = null,
    val status: String? = null,
    @SerializedName("purchase_price") val purchasePrice: Double? = null,
    @SerializedName("monthly_rate") val monthlyRate: Double? = null
)

data class AdDto(
    val id: String,
    val title: String? = null,
    val subtitle: String? = null,
    @SerializedName("image_url") val imageUrl: String? = null,
    @SerializedName("cta_label") val ctaLabel: String? = null,
    @SerializedName("cta_url") val ctaUrl: String? = null,
    @SerializedName("display_order") val displayOrder: Int? = null
)

data class CustomerDto(
    val id: String,
    @SerializedName("full_name") val fullName: String,
    @SerializedName("cnic_passport_number") val cnicPassportNumber: String,
    @SerializedName("created_by_agent") val createdByAgent: String? = null,
    @SerializedName("created_at") val createdAt: String? = null,
    @SerializedName("dealer_name") val dealerName: String? = null,
    @SerializedName("biometric_hash") val biometricHash: String? = null,
    @SerializedName("father_name") val fatherName: String? = null,
    @SerializedName("contact_email") val contactEmail: String? = null,
    @SerializedName("contact_phone") val contactPhone: String? = null,
    val gender: String? = null,
    val country: String? = null,
    val address: String? = null,
    @SerializedName("date_of_birth") val dateOfBirth: String? = null,
    @SerializedName("identity_doc_url") val identityDocUrl: String? = null,
    @SerializedName("identity_doc_back_url") val identityDocBackUrl: String? = null,
    @SerializedName("fingerprint_status") val fingerprintStatus: String? = null,
    @SerializedName("fingerprint_quality") val fingerprintQuality: String? = null,
    @SerializedName("fingerprint_device") val fingerprintDevice: String? = null,
    @SerializedName("fingerprint_thumb_url") val fingerprintThumbUrl: String? = null,
    @SerializedName("signature_image_url") val signatureImageUrl: String? = null
)

data class WorkflowTaskDto(
    val id: String,
    @SerializedName("definition_name") val definitionName: String? = null,
    @SerializedName("task_status") val taskStatus: String? = null,
    @SerializedName("requester_name") val requesterName: String? = null,
    @SerializedName("acted_by_name") val actedByName: String? = null,
    @SerializedName("dealer_name") val dealerName: String? = null,
    @SerializedName("dealer_code") val dealerCode: String? = null,
    @SerializedName("customer_name") val customerName: String? = null,
    @SerializedName("cnic_passport_number") val cnicPassportNumber: String? = null,
    val brand: String? = null,
    val model: String? = null,
    @SerializedName("vehicle_type") val vehicleType: String? = null,
    val color: String? = null,
    @SerializedName("product_description") val productDescription: String? = null,
    @SerializedName("image_url") val imageUrl: String? = null,
    @SerializedName("sale_mode") val saleMode: String? = null,
    @SerializedName("approval_status") val approvalStatus: String? = null,
    @SerializedName("agreement_number") val agreementNumber: String? = null,
    @SerializedName("agreement_date") val agreementDate: String? = null,
    @SerializedName("agreement_pdf_url") val agreementPdfUrl: String? = null,
    @SerializedName("dealer_signature_url") val dealerSignatureUrl: String? = null,
    @SerializedName("vehicle_price") val vehiclePrice: Double? = null,
    @SerializedName("down_payment") val downPayment: Double? = null,
    @SerializedName("financed_amount") val financedAmount: Double? = null,
    @SerializedName("monthly_installment") val monthlyInstallment: Double? = null,
    @SerializedName("installment_months") val installmentMonths: Int? = null,
    @SerializedName("first_due_date") val firstDueDate: String? = null,
    @SerializedName("witness_name") val witnessName: String? = null,
    @SerializedName("witness_cnic") val witnessCnic: String? = null,
    @SerializedName("witness_two_name") val witnessTwoName: String? = null,
    @SerializedName("witness_two_cnic") val witnessTwoCnic: String? = null,
    val remarks: String? = null,
    @SerializedName("rejection_reason") val rejectionReason: String? = null,
    @SerializedName("vehicle_name") val vehicleName: String? = null
)

data class CustomerRequest(
    @SerializedName("full_name") val fullName: String,
    @SerializedName("cnic_passport_number") val cnicPassportNumber: String,
    @SerializedName("document_type") val documentType: String = "CNIC",
    @SerializedName("contact_email") val contactEmail: String = "",
    @SerializedName("contact_phone") val contactPhone: String = "",
    val gender: String = "",
    val country: String = "",
    val address: String = "",
    @SerializedName("date_of_birth") val dateOfBirth: String = "",
    @SerializedName("father_name") val fatherName: String = "",
    @SerializedName("extracted_name") val extractedName: String = "",
    @SerializedName("raw_ocr_text") val rawOcrText: String = "",
    @SerializedName("identity_doc_url") val identityDocUrl: String = "",
    @SerializedName("identity_doc_back_url") val identityDocBackUrl: String = "",
    @SerializedName("biometric_hash") val biometricHash: String = "",
    @SerializedName("fingerprint_status") val fingerprintStatus: String = "NOT_CAPTURED",
    @SerializedName("fingerprint_quality") val fingerprintQuality: String = "",
    @SerializedName("fingerprint_device") val fingerprintDevice: String = "",
    @SerializedName("fingerprint_thumb_url") val fingerprintThumbUrl: String = "",
    @SerializedName("signature_image_url") val signatureImageUrl: String = ""
)

data class SaleRequest(
    @SerializedName("customer_id") val customerId: String,
    @SerializedName("vehicle_id") val vehicleId: String,
    @SerializedName("sale_mode") val saleMode: String,
    @SerializedName("agreement_number") val agreementNumber: String = "",
    @SerializedName("agreement_date") val agreementDate: String,
    @SerializedName("purchase_date") val purchaseDate: String,
    @SerializedName("agreement_pdf_url") val agreementPdfUrl: String = "",
    @SerializedName("dealer_signature_url") val dealerSignatureUrl: String = "",
    @SerializedName("authorized_signature_url") val authorizedSignatureUrl: String = "",
    @SerializedName("customer_cnic_front_url") val customerCnicFrontUrl: String = "",
    @SerializedName("customer_cnic_back_url") val customerCnicBackUrl: String = "",
    @SerializedName("bank_check_url") val bankCheckUrl: String = "",
    @SerializedName("misc_document_url") val miscDocumentUrl: String = "",
    @SerializedName("vehicle_price") val vehiclePrice: Double,
    @SerializedName("down_payment") val downPayment: Double,
    @SerializedName("financed_amount") val financedAmount: Double,
    @SerializedName("monthly_installment") val monthlyInstallment: Double,
    @SerializedName("installment_months") val installmentMonths: Int,
    @SerializedName("first_due_date") val firstDueDate: String = "",
    @SerializedName("witness_name") val witnessName: String = "",
    @SerializedName("witness_cnic") val witnessCnic: String = "",
    @SerializedName("witness_two_name") val witnessTwoName: String = "",
    @SerializedName("witness_two_cnic") val witnessTwoCnic: String = "",
    val remarks: String = ""
)

data class SaleTransactionDto(
    val id: String,
    @SerializedName("customer_id") val customerId: String? = null,
    @SerializedName("vehicle_id") val vehicleId: String? = null,
    @SerializedName("agreement_number") val agreementNumber: String? = null,
    @SerializedName("customer_name") val customerName: String? = null,
    @SerializedName("agent_name") val agentName: String? = null,
    val brand: String? = null,
    val model: String? = null,
    @SerializedName("vehicle_type") val vehicleType: String? = null,
    @SerializedName("registration_number") val registrationNumber: String? = null,
    val color: String? = null,
    @SerializedName("image_url") val imageUrl: String? = null,
    @SerializedName("vehicle_price") val vehiclePrice: Double? = null,
    @SerializedName("sale_mode") val saleMode: String? = null,
    val status: String? = null,
    @SerializedName("approval_status") val approvalStatus: String? = null,
    @SerializedName("created_at") val createdAt: String? = null
)
