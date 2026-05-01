package com.motoleasing.agent.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.motoleasing.agent.data.api.SessionUser
import com.motoleasing.agent.ui.FeatureSectionState

@Composable
fun AccessProfileScreen(
    user: SessionUser?,
    backendUrl: String,
    sections: List<FeatureSectionState>,
    onSaveBackendUrl: (String) -> Unit
) {
    var editableBackendUrl by remember(backendUrl) { mutableStateOf(backendUrl) }

    LazyColumn(
        contentPadding = PaddingValues(18.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text("Profile & Access", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
        item {
            Card {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(user?.fullName ?: "Employee", fontWeight = FontWeight.Bold)
                    Text("Role: ${user?.roleName ?: "Not set"}")
                    Text("Dealer: ${user?.dealerName ?: "Not set"}")
                    Text("Dealer Code: ${user?.dealerCode ?: "Not set"}")
                    Text("Theme: ${user?.themeKey ?: "sandstone"}")
                }
            }
        }
        item {
            Card {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Backend Connection", fontWeight = FontWeight.Bold)
                    OutlinedTextField(
                        value = editableBackendUrl,
                        onValueChange = { editableBackendUrl = it },
                        label = { Text("Backend URL") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Button(
                        onClick = { onSaveBackendUrl(editableBackendUrl) },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Save Backend URL")
                    }
                }
            }
        }
        items(sections) { section ->
            Card {
                Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(section.title, fontWeight = FontWeight.Bold)
                    section.features.forEach { feature ->
                        Text("- $feature", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
    }
}
