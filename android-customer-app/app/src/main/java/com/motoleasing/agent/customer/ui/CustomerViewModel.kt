package com.motoleasing.agent.customer.ui

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.motoleasing.agent.customer.data.AdDto
import com.motoleasing.agent.customer.data.CreateOrderRequest
import com.motoleasing.agent.customer.data.CustomerProfile
import com.motoleasing.agent.customer.data.CustomerRepository
import com.motoleasing.agent.customer.data.DealerDto
import com.motoleasing.agent.customer.data.InstallmentDto
import com.motoleasing.agent.customer.data.OrderDto
import com.motoleasing.agent.customer.data.ProductDto
import com.motoleasing.agent.customer.data.VehicleDto
import com.motoleasing.agent.customer.data.VerifyOtpRequest
import kotlinx.coroutines.launch
import retrofit2.HttpException

class CustomerViewModel(
    private val repo: CustomerRepository
) : ViewModel() {
    var isLoading by mutableStateOf(false)
        private set
    var message by mutableStateOf("")
        private set

    var backendUrl by mutableStateOf(repo.getSavedApiBaseUrl())
        private set

    var token by mutableStateOf(repo.getSavedToken())
        private set

    var profile by mutableStateOf<CustomerProfile?>(null)
        private set

    var dealers by mutableStateOf<List<DealerDto>>(emptyList())
        private set
    var ads by mutableStateOf<List<AdDto>>(emptyList())
        private set
    var products by mutableStateOf<List<ProductDto>>(emptyList())
        private set
    var vehicles by mutableStateOf<List<VehicleDto>>(emptyList())
        private set
    var orders by mutableStateOf<List<OrderDto>>(emptyList())
        private set
    var activeOrder by mutableStateOf<OrderDto?>(null)
        private set
    var activeInstallments by mutableStateOf<List<InstallmentDto>>(emptyList())
        private set

    val isAuthenticated: Boolean get() = !token.isNullOrBlank()
    val apiOrigin: String get() = backendUrl.trim().trimEnd('/').let { raw ->
        if (raw.contains("/api/")) raw.substringBefore("/api/") else raw
    }

    fun buildAssetUrl(path: String?): String? {
        val raw = path?.trim().orEmpty()
        if (raw.isBlank()) return null
        if (raw.startsWith("http://") || raw.startsWith("https://")) return raw
        val normalized = if (raw.startsWith("/")) raw else "/$raw"
        return apiOrigin.trimEnd('/') + normalized
    }

    fun updateBackendUrl(url: String) {
        backendUrl = url
        repo.saveApiBaseUrl(url)
    }

    fun signOut() {
        repo.clearSession()
        token = null
        profile = null
        orders = emptyList()
        message = ""
    }

    fun requestOtp(
        purpose: String,
        email: String,
        phoneCode: String,
        phoneNumber: String,
        onSuccess: (devCode: String?) -> Unit
    ) {
        isLoading = true
        message = ""
        viewModelScope.launch {
            try {
                val resp = repo.requestOtp(purpose, email, phoneCode, phoneNumber)
                message = resp.message.ifBlank { "OTP sent" }
                onSuccess(resp.devCode)
            } catch (e: Exception) {
                message = formatError(e, "Failed to request OTP")
            } finally {
                isLoading = false
            }
        }
    }

    fun verifyOtp(request: VerifyOtpRequest, onSuccess: () -> Unit) {
        isLoading = true
        message = ""
        viewModelScope.launch {
            try {
                val resp = repo.verifyOtp(request)
                token = resp.token
                profile = resp.profile
                repo.saveSession(resp.token, resp.profile.fullName.ifBlank { "Customer" })
                message = "Welcome ${resp.profile.fullName}"
                onSuccess()
            } catch (e: Exception) {
                message = formatError(e, "Failed to verify OTP")
            } finally {
                isLoading = false
            }
        }
    }

    fun loadHome(dealerId: String?) {
        viewModelScope.launch {
            try { dealers = repo.listDealers().dealers } catch (_: Exception) { }
        }
        viewModelScope.launch {
            try { ads = repo.listAds(dealerId).ads } catch (_: Exception) { }
        }
        viewModelScope.launch {
            try { products = repo.listProducts().products } catch (_: Exception) { }
        }
        viewModelScope.launch {
            try { vehicles = repo.listVehicles(dealerId).vehicles } catch (_: Exception) { }
        }
    }

    fun refreshOrders() {
        viewModelScope.launch {
            try { orders = repo.listOrders().orders } catch (_: Exception) { }
        }
    }

    fun createOrder(vehicleId: String, mode: String, months: Int?, downPayment: Double?, firstDueDate: String?, onCreated: (orderId: String) -> Unit) {
        isLoading = true
        message = ""
        viewModelScope.launch {
            try {
                val resp = repo.createOrder(
                    CreateOrderRequest(
                        vehicleId = vehicleId,
                        purchaseMode = mode,
                        installmentMonths = months,
                        downPayment = downPayment,
                        firstDueDate = firstDueDate
                    )
                )
                message = resp.message.ifBlank { "Order created" }
                refreshOrders()
                onCreated(resp.order.id)
            } catch (e: Exception) {
                message = formatError(e, "Failed to create order")
            } finally {
                isLoading = false
            }
        }
    }

    fun loadOrder(orderId: String) {
        isLoading = true
        message = ""
        viewModelScope.launch {
            try {
                val resp = repo.getOrder(orderId)
                activeOrder = resp.order
                activeInstallments = resp.installments
            } catch (e: Exception) {
                message = formatError(e, "Failed to load order")
            } finally {
                isLoading = false
            }
        }
    }

    private fun formatError(e: Exception, fallback: String): String {
        if (e is HttpException) {
            val raw = try { e.response()?.errorBody()?.string() } catch (_: Exception) { null }
            val cleaned = raw?.replace(Regex("\\s+"), " ")?.trim().orEmpty()
            return if (cleaned.isNotBlank()) "HTTP ${e.code()}: $cleaned" else "HTTP ${e.code()}: ${e.message()}"
        }
        return e.message ?: fallback
    }
}
