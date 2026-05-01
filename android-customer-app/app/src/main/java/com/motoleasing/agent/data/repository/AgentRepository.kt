package com.motoleasing.agent.data.repository

import com.motoleasing.agent.data.api.CustomerRequest
import com.motoleasing.agent.data.api.DashboardResponse
import com.motoleasing.agent.data.api.LoginRequest
import com.motoleasing.agent.data.api.LoginResponse
import com.motoleasing.agent.data.api.NetworkModule
import com.motoleasing.agent.data.api.SaleRequest
import com.motoleasing.agent.data.api.UploadResponse
import com.motoleasing.agent.data.session.SessionStore
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File

class AgentRepository(
    private val sessionStore: SessionStore
) {
    private fun api() = NetworkModule.createApi(sessionStore)

    suspend fun login(baseUrl: String, dealerId: String, identifier: String, password: String): LoginResponse {
        sessionStore.saveApiBaseUrl(baseUrl)
        val response = NetworkModule.createApi(sessionStore, sessionStore.getApiBaseUrl()).login(
            LoginRequest(
                identifier = identifier.trim(),
                dealerId = dealerId.trim(),
                password = password
            )
        )
        sessionStore.saveSession(
            response.token,
            response.user.fullName,
            response.user.dealerName.orEmpty(),
            response.user.themeKey.orEmpty()
        )
        return response
    }

    suspend fun fetchDashboard(): DashboardResponse = api().getDashboard()

    suspend fun createCustomer(request: CustomerRequest) = api().createCustomer(request)

    suspend fun updateCustomer(customerId: String, request: CustomerRequest) =
        api().updateCustomer(customerId, request)

    suspend fun createSale(request: SaleRequest) = api().createSale(request)

    suspend fun uploadCustomerAsset(fileName: String, mimeType: String, fileBytes: ByteArray): UploadResponse =
        api().uploadCustomerAsset(filePart("customerAsset", fileName, mimeType, fileBytes))

    suspend fun uploadAgreement(fileName: String, mimeType: String, fileBytes: ByteArray): UploadResponse =
        api().uploadAgreement(filePart("agreement", fileName, mimeType, fileBytes))

    suspend fun uploadSaleDocument(fileName: String, mimeType: String, fileBytes: ByteArray): UploadResponse =
        api().uploadSaleDocument(filePart("document", fileName, mimeType, fileBytes))

    suspend fun approveWorkflowTask(taskId: String, decisionNotes: String) =
        api().approveWorkflowTask(taskId, mapOf("decision_notes" to decisionNotes))

    suspend fun rejectWorkflowTask(taskId: String, decisionNotes: String) =
        api().rejectWorkflowTask(taskId, mapOf("decision_notes" to decisionNotes))

    fun getSavedToken(): String? = sessionStore.getToken()
    fun getSavedThemeKey(): String = sessionStore.getThemeKey()
    fun getSavedApiBaseUrl(): String = sessionStore.getApiBaseUrl()
    fun saveApiBaseUrl(url: String) = sessionStore.saveApiBaseUrl(url)

    fun clearSession() = sessionStore.clear()

    private fun filePart(
        fieldName: String,
        fileName: String,
        mimeType: String,
        fileBytes: ByteArray
    ): MultipartBody.Part {
        val suffix = "." + fileName.substringAfterLast('.', "bin")
        val tempFile = File.createTempFile("agent-upload-", suffix)
        tempFile.writeBytes(fileBytes)
        val requestBody = tempFile.asRequestBody(mimeType.toMediaTypeOrNull())
        return MultipartBody.Part.createFormData(fieldName, fileName, requestBody)
    }
}
