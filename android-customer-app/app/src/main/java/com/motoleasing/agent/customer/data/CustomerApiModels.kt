package com.motoleasing.agent.customer.data

import com.google.gson.annotations.SerializedName

data class OtpRequest(
    @SerializedName("purpose") val purpose: String,
    @SerializedName("email") val email: String,
    @SerializedName("phone_country_code") val phoneCountryCode: String,
    @SerializedName("phone_number") val phoneNumber: String
)

data class OtpResponse(
    @SerializedName("message") val message: String = "",
    @SerializedName("expires_in_seconds") val expiresInSeconds: Int = 0,
    @SerializedName("dev_code") val devCode: String? = null
)

data class VerifyOtpRequest(
    @SerializedName("purpose") val purpose: String,
    @SerializedName("email") val email: String,
    @SerializedName("phone_country_code") val phoneCountryCode: String,
    @SerializedName("phone_number") val phoneNumber: String,
    @SerializedName("code") val code: String,
    @SerializedName("full_name") val fullName: String? = null,
    @SerializedName("cnic") val cnic: String? = null,
    @SerializedName("address") val address: String? = null,
    @SerializedName("preferred_dealer_id") val preferredDealerId: String? = null
)

data class VerifyOtpResponse(
    @SerializedName("message") val message: String = "",
    @SerializedName("token") val token: String = "",
    @SerializedName("profile") val profile: CustomerProfile = CustomerProfile()
)

data class CustomerProfile(
    @SerializedName("customer_id") val customerId: String = "",
    @SerializedName("customer_account_id") val customerAccountId: String = "",
    @SerializedName("full_name") val fullName: String = "",
    @SerializedName("email") val email: String = "",
    @SerializedName("phone_e164") val phoneE164: String = "",
    @SerializedName("preferred_dealer_id") val preferredDealerId: String? = null
)

data class DealerDto(
    @SerializedName("id") val id: String = "",
    @SerializedName("dealer_name") val dealerName: String = "",
    @SerializedName("dealer_code") val dealerCode: String = "",
    @SerializedName("dealer_logo_url") val dealerLogoUrl: String? = null,
    @SerializedName("dealer_address") val dealerAddress: String? = null,
    @SerializedName("mobile_country_code") val mobileCountryCode: String? = null,
    @SerializedName("mobile_number") val mobileNumber: String? = null
)

data class DealersResponse(
    @SerializedName("dealers") val dealers: List<DealerDto> = emptyList()
)

data class AdDto(
    @SerializedName("id") val id: String = "",
    @SerializedName("title") val title: String? = null,
    @SerializedName("subtitle") val subtitle: String? = null,
    @SerializedName("image_url") val imageUrl: String? = null,
    @SerializedName("cta_label") val ctaLabel: String? = null,
    @SerializedName("cta_url") val ctaUrl: String? = null
)

data class AdsResponse(
    @SerializedName("ads") val ads: List<AdDto> = emptyList()
)

data class ProductDto(
    @SerializedName("id") val id: String = "",
    @SerializedName("brand") val brand: String = "",
    @SerializedName("model") val model: String = "",
    @SerializedName("vehicle_type") val vehicleType: String = "",
    @SerializedName("color") val color: String? = null,
    @SerializedName("description") val description: String? = null,
    @SerializedName("image_url") val imageUrl: String? = null,
    @SerializedName("base_price") val basePrice: Double = 0.0,
    @SerializedName("cash_total_price") val cashTotalPrice: Double = 0.0,
    @SerializedName("installment_total_price") val installmentTotalPrice: Double = 0.0,
    @SerializedName("installment_months") val installmentMonths: Int = 12,
    @SerializedName("installment_monthly_amount") val installmentMonthlyAmount: Double = 0.0
)

data class ProductsResponse(
    @SerializedName("products") val products: List<ProductDto> = emptyList()
)

data class VehicleDto(
    @SerializedName("id") val id: String = "",
    @SerializedName("status") val status: String? = null,
    @SerializedName("brand") val brand: String = "",
    @SerializedName("model") val model: String = "",
    @SerializedName("vehicle_type") val vehicleType: String = "",
    @SerializedName("color") val color: String? = null,
    @SerializedName("product_description") val productDescription: String? = null,
    @SerializedName("image_url") val imageUrl: String? = null,
    @SerializedName("serial_number") val serialNumber: String? = null,
    @SerializedName("registration_number") val registrationNumber: String? = null,
    @SerializedName("chassis_number") val chassisNumber: String? = null,
    @SerializedName("engine_number") val engineNumber: String? = null,
    @SerializedName("dealer_id") val dealerId: String? = null,
    @SerializedName("dealer_name") val dealerName: String? = null,
    @SerializedName("base_price") val basePrice: Double = 0.0,
    @SerializedName("cash_total_price") val cashTotalPrice: Double = 0.0,
    @SerializedName("installment_total_price") val installmentTotalPrice: Double = 0.0,
    @SerializedName("installment_months") val installmentMonths: Int = 12,
    @SerializedName("installment_monthly_amount") val installmentMonthlyAmount: Double = 0.0
)

data class VehiclesResponse(
    @SerializedName("vehicles") val vehicles: List<VehicleDto> = emptyList()
)

data class CreateOrderRequest(
    @SerializedName("vehicle_id") val vehicleId: String,
    @SerializedName("purchase_mode") val purchaseMode: String,
    @SerializedName("installment_months") val installmentMonths: Int? = null,
    @SerializedName("down_payment") val downPayment: Double? = null,
    @SerializedName("first_due_date") val firstDueDate: String? = null
)

data class InstallmentDto(
    @SerializedName("installment_number") val installmentNumber: Int = 0,
    @SerializedName("due_date") val dueDate: String = "",
    @SerializedName("amount") val amount: Double = 0.0,
    @SerializedName("status") val status: String = "PENDING",
    @SerializedName("paid_amount") val paidAmount: Double = 0.0
)

data class OrderDto(
    @SerializedName("id") val id: String = "",
    @SerializedName("purchase_mode") val purchaseMode: String = "",
    @SerializedName("base_price") val basePrice: Double = 0.0,
    @SerializedName("markup_percent") val markupPercent: Double = 0.0,
    @SerializedName("total_price") val totalPrice: Double = 0.0,
    @SerializedName("installment_months") val installmentMonths: Int = 0,
    @SerializedName("monthly_amount") val monthlyAmount: Double = 0.0,
    @SerializedName("status") val status: String = "",
    @SerializedName("product_brand") val productBrand: String? = null,
    @SerializedName("product_model") val productModel: String? = null,
    @SerializedName("product_image_url") val productImageUrl: String? = null,
    @SerializedName("received_installments") val receivedInstallments: Int? = null,
    @SerializedName("total_installments") val totalInstallments: Int? = null
)

data class OrdersResponse(
    @SerializedName("orders") val orders: List<OrderDto> = emptyList()
)

data class OrderDetailResponse(
    @SerializedName("order") val order: OrderDto = OrderDto(),
    @SerializedName("installments") val installments: List<InstallmentDto> = emptyList()
)

data class CreateOrderResponse(
    @SerializedName("message") val message: String = "",
    @SerializedName("order") val order: OrderDto = OrderDto(),
    @SerializedName("installments") val installments: List<InstallmentDto> = emptyList()
)

data class ReceiveInstallmentRequest(
    @SerializedName("paid_amount") val paidAmount: Double? = null
)

data class ReceiveInstallmentResponse(
    @SerializedName("message") val message: String = ""
)
