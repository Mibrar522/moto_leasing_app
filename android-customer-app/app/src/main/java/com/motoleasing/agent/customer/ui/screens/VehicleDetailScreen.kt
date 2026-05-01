package com.motoleasing.agent.customer.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.rememberScrollState
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
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.motoleasing.agent.customer.ui.components.ModeSelector
import com.motoleasing.agent.customer.ui.components.PriceChip
import com.motoleasing.agent.customer.ui.components.ScreenHeader
import com.motoleasing.agent.customer.ui.components.formatMoney
import com.motoleasing.agent.customer.ui.CustomerViewModel

@Composable
fun VehicleDetailScreen(
    viewModel: CustomerViewModel,
    vehicleId: String,
    mode: String,
    onOrderCreated: (orderId: String) -> Unit
) {
    val vehicle = viewModel.vehicles.firstOrNull { it.id == vehicleId }
    val heroUrl = remember(viewModel.backendUrl, vehicle?.imageUrl) { viewModel.buildAssetUrl(vehicle?.imageUrl) }

    if (vehicle == null) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Vehicle not found (it may have been sold).")
        }
        return
    }

    val title = "${vehicle.brand} ${vehicle.model}"
    var selectedMode by remember { mutableStateOf(if (mode == "INSTALLMENT") "INSTALLMENT" else "CASH") }
    val isInstallment = selectedMode == "INSTALLMENT"
    val total = if (isInstallment) vehicle.installmentTotalPrice else vehicle.cashTotalPrice

    var monthsText by remember { mutableStateOf(vehicle.installmentMonths.toString()) }
    var downPaymentText by remember { mutableStateOf("") }
    var firstDueDate by remember { mutableStateOf("") }

    val scroll = rememberScrollState()

    Column(
        modifier = Modifier
            .padding(16.dp)
            .verticalScroll(scroll),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        ScreenHeader(
            title = title,
            subtitle = vehicle.dealerName?.takeIf { it.isNotBlank() } ?: "Available stock"
        )

        ModeSelector(selected = selectedMode, onSelect = { selectedMode = it })

        if (!vehicle.imageUrl.isNullOrBlank()) {
            Card(shape = RoundedCornerShape(22.dp), modifier = Modifier.fillMaxWidth()) {
                AsyncImage(
                    model = heroUrl ?: "",
                    contentDescription = title,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(220.dp)
                )
            }
        }

        Card(shape = RoundedCornerShape(18.dp), modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("Pricing", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                Text("Actual: ${formatMoney(vehicle.basePrice)}")
                PriceChip(label = if (isInstallment) "Installment total" else "Cash total", value = total)
                if (isInstallment) {
                    Text("Monthly (est.): ${formatMoney(vehicle.installmentMonthlyAmount)}", style = MaterialTheme.typography.bodyMedium)
                    Text("${vehicle.installmentMonths} months", style = MaterialTheme.typography.bodySmall)
                }
            }
        }

        Card(shape = RoundedCornerShape(18.dp), modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Details", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                val lines = listOfNotNull(
                    vehicle.vehicleType.takeIf { it.isNotBlank() }?.let { "Type: $it" },
                    vehicle.color?.takeIf { it.isNotBlank() }?.let { "Color: $it" },
                    vehicle.serialNumber?.takeIf { it.isNotBlank() }?.let { "Serial: $it" },
                    vehicle.registrationNumber?.takeIf { it.isNotBlank() }?.let { "Reg: $it" },
                    vehicle.chassisNumber?.takeIf { it.isNotBlank() }?.let { "Chassis: $it" },
                    vehicle.engineNumber?.takeIf { it.isNotBlank() }?.let { "Engine: $it" }
                )
                lines.forEach { Text(it) }
                vehicle.productDescription?.takeIf { it.isNotBlank() }?.let { Text(it) }
            }
        }

        if (isInstallment) {
            Card(shape = RoundedCornerShape(18.dp), modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Installment form", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                        OutlinedTextField(
                            value = monthsText,
                            onValueChange = { monthsText = it },
                            label = { Text("Months") },
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = downPaymentText,
                            onValueChange = { downPaymentText = it },
                            label = { Text("Down payment") },
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f)
                        )
                    }
                    OutlinedTextField(
                        value = firstDueDate,
                        onValueChange = { firstDueDate = it },
                        label = { Text("First due date (YYYY-MM-DD)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }

        Spacer(Modifier.height(6.dp))

        Button(
            onClick = {
                val months = monthsText.toIntOrNull()
                viewModel.createOrder(
                    vehicleId = vehicle.id,
                    mode = selectedMode,
                    months = if (isInstallment) months else null,
                    downPayment = if (isInstallment) downPaymentText.toDoubleOrNull() else null,
                    firstDueDate = if (isInstallment && firstDueDate.isNotBlank()) firstDueDate else null,
                    onCreated = onOrderCreated
                )
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(if (isInstallment) "Proceed (Installment ${formatMoney(total)})" else "Proceed (Cash ${formatMoney(total)})")
        }
    }
}
