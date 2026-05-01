package com.motoleasing.agent.data.api

import okhttp3.MultipartBody
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.PATCH
import retrofit2.http.Path
import retrofit2.http.PUT

interface AgentApiService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @GET("admin/dashboard")
    suspend fun getDashboard(): DashboardResponse

    @POST("customers")
    suspend fun createCustomer(@Body request: CustomerRequest): CustomerDto

    @PUT("customers/{id}")
    suspend fun updateCustomer(
        @Path("id") customerId: String,
        @Body request: CustomerRequest
    ): CustomerDto

    @POST("sales")
    suspend fun createSale(@Body request: SaleRequest): SaleTransactionDto

    @Multipart
    @POST("customers/upload-asset")
    suspend fun uploadCustomerAsset(@Part customerAsset: MultipartBody.Part): UploadResponse

    @Multipart
    @POST("sales/upload-agreement")
    suspend fun uploadAgreement(@Part agreement: MultipartBody.Part): UploadResponse

    @Multipart
    @POST("sales/upload-document")
    suspend fun uploadSaleDocument(@Part document: MultipartBody.Part): UploadResponse

    @PATCH("workflow/tasks/{id}/approve")
    suspend fun approveWorkflowTask(
        @Path("id") taskId: String,
        @Body body: Map<String, String>
    ): ActionResponse

    @PATCH("workflow/tasks/{id}/reject")
    suspend fun rejectWorkflowTask(
        @Path("id") taskId: String,
        @Body body: Map<String, String>
    ): ActionResponse
}
