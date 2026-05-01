package com.motoleasing.agent.customer.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.motoleasing.agent.customer.data.OrderDto
import com.motoleasing.agent.customer.ui.components.ScreenHeader
import com.motoleasing.agent.customer.ui.components.formatMoney
import com.motoleasing.agent.customer.ui.CustomerViewModel

@Composable
fun OrdersProScreen(
    viewModel: CustomerViewModel,
    onOpenOrder: (orderId: String) -> Unit
) {
    LaunchedEffect(Unit) { viewModel.refreshOrders() }

    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        ScreenHeader(title = "Orders", subtitle = "Track your cash and installment purchases.")

        if (viewModel.orders.isEmpty()) {
            Text("No purchases yet.")
            return
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(viewModel.orders, key = { it.id }) { order ->
                OrderCard(order = order, onOpenOrder = onOpenOrder)
            }
        }
    }
}

@Composable
private fun OrderCard(order: OrderDto, onOpenOrder: (String) -> Unit) {
    val title = "${order.productBrand.orEmpty()} ${order.productModel.orEmpty()}".trim()
    val mode = order.purchaseMode.ifBlank { "CASH" }

    Card(
        shape = RoundedCornerShape(18.dp),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onOpenOrder(order.id) }
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(if (title.isNotBlank()) title else "Vehicle purchase", fontWeight = FontWeight.SemiBold)
            Text("Mode: $mode")
            Text("Total: ${formatMoney(order.totalPrice)}")
            val received = order.receivedInstallments ?: 0
            val total = order.totalInstallments ?: 0
            if (total > 0) {
                Text("Installments: $received / $total")
            }
        }
    }
}
