package com.motoleasing.agent.customer.data

import com.motoleasing.agent.data.session.SessionStore

class CustomerRepository(
    private val sessionStore: SessionStore
) {
    private fun api() = CustomerNetworkModule.createApi(sessionStore)

    fun getSavedToken(): String? = sessionStore.getToken()
    fun getSavedApiBaseUrl(): String = sessionStore.getApiBaseUrl()
    fun saveApiBaseUrl(url: String) = sessionStore.saveApiBaseUrl(url)

    fun saveSession(token: String, fullName: String) {
        sessionStore.saveSession(token, fullName, "", "")
    }

    fun clearSession() = sessionStore.clear()

    suspend fun requestOtp(purpose: String, email: String, phoneCode: String, phoneNumber: String): OtpResponse =
        api().requestOtp(
            OtpRequest(
                purpose = purpose,
                email = email,
                phoneCountryCode = phoneCode,
                phoneNumber = phoneNumber
            )
        )

    suspend fun verifyOtp(request: VerifyOtpRequest): VerifyOtpResponse = api().verifyOtp(request)

    suspend fun listDealers(): DealersResponse = api().dealers()
    suspend fun listAds(dealerId: String?): AdsResponse = api().ads(dealerId)
    suspend fun listProducts(): ProductsResponse = api().products()
    suspend fun listVehicles(dealerId: String?): VehiclesResponse = api().vehicles(dealerId)

    suspend fun listOrders(): OrdersResponse = api().orders()
    suspend fun createOrder(request: CreateOrderRequest): CreateOrderResponse = api().createOrder(request)
    suspend fun getOrder(orderId: String): OrderDetailResponse = api().order(orderId)
}
