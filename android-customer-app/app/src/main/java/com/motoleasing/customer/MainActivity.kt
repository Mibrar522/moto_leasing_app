package com.motoleasing.customer

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.remember
import com.motoleasing.agent.customer.data.CustomerRepository
import com.motoleasing.agent.customer.ui.CustomerApp
import com.motoleasing.agent.customer.ui.CustomerViewModel
import com.motoleasing.agent.data.session.SessionStore

// Customer app entry-point. We keep the internal modules under the existing
// `com.motoleasing.agent.*` packages for now, but expose a clean customer-only
// MainActivity/package name to the OS (and logs).
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val sessionStore = remember { SessionStore(applicationContext) }
            val repository = remember { CustomerRepository(sessionStore) }
            val viewModel = remember { CustomerViewModel(repository) }
            CustomerApp(viewModel)
        }
    }
}

