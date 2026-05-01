package com.motoleasing.agent.customer.data

import com.motoleasing.agent.data.api.AuthInterceptor
import com.motoleasing.agent.data.session.SessionStore
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object CustomerNetworkModule {
    fun createApi(sessionStore: SessionStore, baseUrl: String = sessionStore.getApiBaseUrl()): CustomerApiService {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val client = OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor(sessionStore))
            .addInterceptor(logging)
            .build()

        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .client(client)
            .build()
            .create(CustomerApiService::class.java)
    }
}

