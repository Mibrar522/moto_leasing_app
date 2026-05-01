package com.motoleasing.agent.ui.screens

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.TextButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.motoleasing.agent.data.api.WorkflowTaskDto
import java.text.NumberFormat
import java.util.Locale

@Composable
fun WorkflowTasksScreen(
    tasks: List<WorkflowTaskDto>,
    backendUrl: String,
    canActionTasks: Boolean,
    onApprove: (String, String) -> Unit,
    onReject: (String, String) -> Unit,
    buildAssetUrl: (String?) -> String
) {
    var selectedTask by remember { mutableStateOf<WorkflowTaskDto?>(null) }
    val currency = remember { NumberFormat.getCurrencyInstance(Locale("en", "PK")) }

    LazyColumn(
        contentPadding = PaddingValues(18.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text("User Tasks", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
        item {
            Text(
                "Manager and application admin approvals from the existing workflow appear here.",
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        if (tasks.isEmpty()) {
            item {
                Card {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("No pending tasks", fontWeight = FontWeight.SemiBold)
                        Text("New mobile sales requests will appear here as they move through the workflow.")
                    }
                }
            }
        } else {
            items(tasks) { task ->
                Card {
                    Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(task.customerName ?: "Customer request", fontWeight = FontWeight.Bold)
                        Text(task.vehicleName ?: listOfNotNull(task.brand, task.model).joinToString(" ").ifBlank { task.definitionName ?: "Sales workflow item" })
                        Text("Status: ${task.taskStatus ?: "Pending"}", color = MaterialTheme.colorScheme.primary)
                        Text("Agreement: ${task.agreementNumber ?: "Pending"}")
                        Text("Dealer: ${task.dealerName ?: "Not set"}")
                        Text("Task ID: ${task.id}", color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Button(onClick = { selectedTask = task }, modifier = Modifier.fillMaxWidth()) {
                            Text("View Task")
                        }
                    }
                }
            }
        }
    }

    selectedTask?.let { task ->
        WorkflowTaskDetailDialog(
            task = task,
            currency = currency,
            canActionTasks = canActionTasks,
            onDismiss = { selectedTask = null },
            onApprove = { notes ->
                onApprove(task.id, notes)
                selectedTask = null
            },
            onReject = { notes ->
                onReject(task.id, notes)
                selectedTask = null
            },
            buildAssetUrl = buildAssetUrl
        )
    }
}

@Composable
private fun WorkflowTaskDetailDialog(
    task: WorkflowTaskDto,
    currency: NumberFormat,
    canActionTasks: Boolean,
    onDismiss: () -> Unit,
    onApprove: (String) -> Unit,
    onReject: (String) -> Unit,
    buildAssetUrl: (String?) -> String
) {
    var decisionNotes by remember(task.id) { mutableStateOf("") }
    val imageUrl = buildAssetUrl(task.imageUrl)
    val agreementUrl = buildAssetUrl(task.agreementPdfUrl)
    val signatureUrl = buildAssetUrl(task.dealerSignatureUrl)

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (canActionTasks && task.taskStatus.equals("PENDING", true)) {
                    TextButton(onClick = { onReject(decisionNotes) }) {
                        Text("Reject")
                    }
                    Button(onClick = { onApprove(decisionNotes) }) {
                        Text("Approve")
                    }
                } else {
                    Button(onClick = onDismiss) {
                        Text("Close")
                    }
                }
            }
        },
        dismissButton = {
            if (canActionTasks && task.taskStatus.equals("PENDING", true)) {
                TextButton(onClick = onDismiss) {
                    Text("Cancel")
                }
            }
        },
        title = { Text(task.customerName ?: "Workflow Task") },
        text = {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                item { Text("Vehicle: ${listOfNotNull(task.brand, task.model).joinToString(" ").ifBlank { task.vehicleName ?: "Not set" }}") }
                item { Text("Dealer: ${task.dealerName ?: "Not set"} / ${task.dealerCode ?: "No code"}") }
                item { Text("Requester: ${task.requesterName ?: "Not set"}") }
                item { Text("Task Status: ${task.taskStatus ?: "Pending"}") }
                item { Text("Approval Status: ${task.approvalStatus ?: "Pending"}") }
                item { Text("Agreement: ${task.agreementNumber ?: "Not assigned"}") }
                item { Text("Sale Mode: ${task.saleMode ?: "Not set"}") }
                item { Text("Vehicle Price: ${currency.format(task.vehiclePrice ?: 0.0)}") }
                item { Text("Down Payment: ${currency.format(task.downPayment ?: 0.0)}") }
                item { Text("Financed Amount: ${currency.format(task.financedAmount ?: 0.0)}") }
                item { Text("Monthly Installment: ${currency.format(task.monthlyInstallment ?: 0.0)}") }
                item { Text("Installment Months: ${task.installmentMonths ?: 0}") }
                item { Text("Witness 1: ${task.witnessName ?: "Not set"} / ${task.witnessCnic ?: "Not set"}") }
                item { Text("Witness 2: ${task.witnessTwoName ?: "Not set"} / ${task.witnessTwoCnic ?: "Not set"}") }
                if (task.remarks?.isNotBlank() == true) {
                    item { Text("Remarks: ${task.remarks}") }
                }
                if (task.rejectionReason?.isNotBlank() == true) {
                    item { Text("Rejection Reason: ${task.rejectionReason}") }
                }
                if (imageUrl.isNotBlank()) {
                    item {
                        AsyncImage(
                            model = imageUrl,
                            contentDescription = "Vehicle image",
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(180.dp),
                            contentScale = ContentScale.Crop
                        )
                    }
                }
                if (signatureUrl.isNotBlank() && signatureUrl.matches(Regex("(?i).+\\.(png|jpe?g|gif|webp|bmp|svg)$"))) {
                    item {
                        AsyncImage(
                            model = signatureUrl,
                            contentDescription = "Dealer signature",
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp),
                            contentScale = ContentScale.Fit
                        )
                    }
                }
                if (agreementUrl.isNotBlank()) {
                    item { Text("Agreement Document: $agreementUrl", color = MaterialTheme.colorScheme.primary) }
                }
                if (canActionTasks && task.taskStatus.equals("PENDING", true)) {
                    item {
                        OutlinedTextField(
                            value = decisionNotes,
                            onValueChange = { decisionNotes = it },
                            label = { Text("Decision Notes") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
        }
    )
}
