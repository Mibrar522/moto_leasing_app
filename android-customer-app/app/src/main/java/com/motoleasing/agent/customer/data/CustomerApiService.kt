package com.motoleasing.agent.customer.data

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface CustomerApiService {
    @POST("app/auth/request-otp")
    suspend fun requestOtp(@Body request: OtpRequest): OtpResponse

    @POST("app/auth/verify-otp")
    suspend fun verifyOtp(@Body request: VerifyOtpRequest): VerifyOtpResponse

    @GET("app/dealers")
    suspend fun dealers(): DealersResponse

    @GET("app/ads")
    suspend fun ads(@Query("dealer_id") dealerId: String? = null): AdsResponse

    @GET("app/products")
    suspend fun products(): ProductsResponse

    @GET("app/vehicles")
    suspend fun vehicles(@Query("dealer_id") dealerId: String? = null): VehiclesResponse

    @GET("app/orders")
    suspend fun orders(): OrdersResponse

    @POST("app/orders")
    suspend fun createOrder(@Body request: CreateOrderRequest): CreateOrderResponse

    @GET("app/orders/{id}")
    suspend fun order(@Path("id") orderId: String): OrderDetailResponse
}
