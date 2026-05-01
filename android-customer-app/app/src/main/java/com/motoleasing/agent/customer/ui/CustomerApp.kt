package com.motoleasing.agent.customer.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import com.motoleasing.agent.customer.ui.screens.LoginScreen
import com.motoleasing.agent.ui.theme.MotoLeasingAgentTheme

@Composable
fun CustomerApp(viewModel: CustomerViewModel) {
    MotoLeasingAgentTheme(themeKey = "crimson-navy") {
        val snackbarHostState = remember { SnackbarHostState() }

        LaunchedEffect(viewModel.message) {
            if (viewModel.message.isNotBlank()) {
                snackbarHostState.showSnackbar(viewModel.message)
            }
        }

        Scaffold(
            snackbarHost = { SnackbarHost(hostState = snackbarHostState) }
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                MaterialTheme.colorScheme.background,
                                Color(0xFFF7F2EA)
                            )
                        )
                    )
            ) {
                if (!viewModel.isAuthenticated) {
                    LoginScreen(viewModel = viewModel, onLoggedIn = {})
                } else {
                    CustomerShell(viewModel = viewModel)
                }

                if (viewModel.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.TopCenter),
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
    }
}
