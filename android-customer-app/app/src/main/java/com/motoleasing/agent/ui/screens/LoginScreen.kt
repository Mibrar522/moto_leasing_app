package com.motoleasing.agent.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun LoginScreen(
    isLoading: Boolean,
    message: String,
    backendUrl: String,
    onBackendUrlChange: (String) -> Unit,
    onLogin: (String, String, String, String) -> Unit
) {
    var apiBaseUrl by remember(backendUrl) { mutableStateOf(backendUrl) }
    var dealerId by remember { mutableStateOf("") }
    var identifier by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(Color(0xFF0C3B5B), Color(0xFF1F6B8F))))
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Card(shape = RoundedCornerShape(28.dp), modifier = Modifier.fillMaxWidth()) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text("MotoLeasing Agent", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Text("Sign in with the dealer ID or dealer code plus employee email or employee code. The app theme follows the dealer theme selected on web.")
                OutlinedTextField(
                    value = apiBaseUrl,
                    onValueChange = {
                        apiBaseUrl = it
                        onBackendUrlChange(it)
                    },
                    label = { Text("Backend URL") },
                    supportingText = { Text("Example: http://192.168.8.119:6001/api/v1/") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = dealerId,
                    onValueChange = { dealerId = it },
                    label = { Text("Dealer ID / Code") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = identifier,
                    onValueChange = { identifier = it },
                    label = { Text("Employee Email / Code") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password") },
                    modifier = Modifier.fillMaxWidth()
                )
                Button(
                    onClick = { onLogin(apiBaseUrl, dealerId, identifier, password) },
                    enabled = !isLoading && apiBaseUrl.isNotBlank() && dealerId.isNotBlank() && identifier.isNotBlank() && password.isNotBlank(),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(if (isLoading) "Signing In..." else "Sign In")
                }
                if (message.isNotBlank()) {
                    Text(
                        message,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        }
    }
}
