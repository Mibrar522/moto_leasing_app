package com.motoleasing.agent.customer.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
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
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.motoleasing.agent.customer.ui.CustomerViewModel

@Composable
fun ProfileScreen(viewModel: CustomerViewModel) {
    var backendUrl by remember { mutableStateOf(viewModel.backendUrl) }

    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Profile", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.SemiBold)

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(viewModel.profile?.fullName ?: "Customer", fontWeight = FontWeight.SemiBold)
                Text(viewModel.profile?.email ?: "")
                Text(viewModel.profile?.phoneE164 ?: "")
            }
        }

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Backend", fontWeight = FontWeight.SemiBold)
                OutlinedTextField(
                    value = backendUrl,
                    onValueChange = { backendUrl = it },
                    label = { Text("Server URL") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                Button(
                    onClick = { viewModel.updateBackendUrl(backendUrl) },
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Save") }
            }
        }

        Button(
            onClick = viewModel::signOut,
            modifier = Modifier.fillMaxWidth()
        ) { Text("Sign out") }
    }
}

