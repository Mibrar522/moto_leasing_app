package com.motoleasing.agent

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.remember
import com.motoleasing.agent.customer.data.CustomerRepository
import com.motoleasing.agent.data.session.SessionStore
import com.motoleasing.agent.customer.ui.CustomerApp
import com.motoleasing.agent.customer.ui.CustomerViewModel

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
