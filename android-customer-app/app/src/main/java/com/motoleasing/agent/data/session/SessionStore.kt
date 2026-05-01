package com.motoleasing.agent.data.session

import android.content.Context
import com.motoleasing.agent.BuildConfig

class SessionStore(context: Context) {
    private val prefs = context.getSharedPreferences("agent_session", Context.MODE_PRIVATE)

    fun saveSession(token: String, fullName: String, dealerName: String, themeKey: String) {
        prefs.edit()
            .putString("token", token)
            .putString("full_name", fullName)
            .putString("dealer_name", dealerName)
            .putString("theme_key", themeKey)
            .apply()
    }

    fun saveApiBaseUrl(url: String) {
        prefs.edit()
            .putString("api_base_url", normalizeBaseUrl(url))
            .apply()
    }

    fun getToken(): String? = prefs.getString("token", null)
    fun getThemeKey(): String = prefs.getString("theme_key", "sandstone") ?: "sandstone"
    fun getApiBaseUrl(): String =
        prefs.getString("api_base_url", normalizeBaseUrl(BuildConfig.API_BASE_URL))
            ?: normalizeBaseUrl(BuildConfig.API_BASE_URL)

    fun clear() {
        prefs.edit().clear().apply()
    }

    private fun normalizeBaseUrl(url: String): String {
        val trimmed = url.trim().ifBlank { BuildConfig.API_BASE_URL.trim() }
        val withSlash = if (trimmed.endsWith("/")) trimmed else "$trimmed/"

        // Allow users to type host-only (e.g. http://10.0.2.2:6001) and still work.
        // If the user already provided an /api/... path, keep it as-is.
        if (withSlash.contains("/api/")) {
            return withSlash
        }

        return withSlash.trimEnd('/') + "/api/v1/"
    }
}
