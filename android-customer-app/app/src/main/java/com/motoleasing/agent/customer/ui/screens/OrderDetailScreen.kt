package com.motoleasing.agent.customer.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.motoleasing.agent.customer.data.InstallmentDto
import com.motoleasing.agent.customer.ui.components.ScreenHeader
import com.motoleasing.agent.customer.ui.components.formatMoney
import com.motoleasing.agent.customer.ui.CustomerViewModel

@Composable
fun OrderDetailScreen(
    viewModel: CustomerViewModel,
    orderId: String
) {
    LaunchedEffect(orderId) { viewModel.loadOrder(orderId) }

    val order = viewModel.activeOrder
    if (order == null) {
        Column(modifier = Modifier.padding(16.dp)) { Text("Loading...") }
        return
    }

    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        ScreenHeader(
            title = "Installment history",
            subtitle = "Read-only. Payments are recorded by the company."
        )
        Text("${order.productBrand.orEmpty()} ${order.productModel.orEmpty()}", style = MaterialTheme.typography.titleMedium)
        Text("Mode: ${order.purchaseMode}", style = MaterialTheme.typography.bodyMedium)
        Text("Total: ${formatMoney(order.totalPrice)}", style = MaterialTheme.typography.bodyMedium)

        if (order.purchaseMode == "INSTALLMENT") {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(viewModel.activeInstallments) { inst ->
                    InstallmentCard(inst)
                }
            }
        } else {
            Text("Cash purchase. No installments.", style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
private fun InstallmentCard(inst: InstallmentDto) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Installment ${inst.installmentNumber} - ${inst.dueDate}")
            Text("Amount: ${formatMoney(inst.amount)}")
            Text("Status: ${inst.status}")
            if (String(inst.status).uppercase() == "RECEIVED") {
                Text("Paid: ${formatMoney(inst.paidAmount)}")
            } else {
                Text("Not paid yet")
            }
        }
    }
}
