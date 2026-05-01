package com.motoleasing.agent.customer.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.motoleasing.agent.customer.ui.CustomerViewModel

@Composable
fun ProductDetailScreen(
    viewModel: CustomerViewModel,
    productId: String,
    mode: String,
    onOrderCreated: (orderId: String) -> Unit
) {
    val vehicle = viewModel.vehicles.firstOrNull { it.id == productId }
    var monthsText by remember { mutableStateOf(vehicle?.installmentMonths?.toString() ?: "12") }
    var downPaymentText by remember { mutableStateOf("") }
    var firstDueDate by remember { mutableStateOf("") }

    if (vehicle == null) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Vehicle not found")
        }
        return
    }

    val total = if (mode == "INSTALLMENT") vehicle.installmentTotalPrice else vehicle.cashTotalPrice

    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("${vehicle.brand} ${vehicle.model}", style = MaterialTheme.typography.headlineSmall)
        if (!vehicle.imageUrl.isNullOrBlank()) {
            AsyncImage(
                model = viewModel.backendUrl.trimEnd('/') + vehicle.imageUrl,
                contentDescription = "${vehicle.brand} ${vehicle.model}",
                modifier = Modifier.fillMaxWidth()
            )
        }
        if (!vehicle.productDescription.isNullOrBlank()) {
            Text(vehicle.productDescription ?: "", style = MaterialTheme.typography.bodyMedium)
        }
        Text("Actual price: ${vehicle.basePrice}")
        Text("Total price: $total")

        val months = monthsText.toIntOrNull()
        if (mode == "INSTALLMENT") {
            OutlinedTextField(
                value = monthsText,
                onValueChange = { monthsText = it },
                label = { Text("Installment months") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = downPaymentText,
                onValueChange = { downPaymentText = it },
                label = { Text("Down payment") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = firstDueDate,
                onValueChange = { firstDueDate = it },
                label = { Text("First due date (YYYY-MM-DD)") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )
            Text("Monthly (est.): ${vehicle.installmentMonthlyAmount}")
        }

        Button(
            onClick = {
                viewModel.createOrder(
                    vehicleId = vehicle.id,
                    mode = mode,
                    months = if (mode == "INSTALLMENT") months else null,
                    downPayment = if (mode == "INSTALLMENT") downPaymentText.toDoubleOrNull() else null,
                    firstDueDate = if (mode == "INSTALLMENT" && firstDueDate.isNotBlank()) firstDueDate else null
                ) { orderId -> onOrderCreated(orderId) }
            },
            modifier = Modifier.fillMaxWidth()
        ) { Text("Buy") }
    }
}
