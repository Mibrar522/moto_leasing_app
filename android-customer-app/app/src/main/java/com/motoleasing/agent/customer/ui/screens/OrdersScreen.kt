package com.motoleasing.agent.customer.ui.screens

import androidx.compose.foundation.clickable
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
import com.motoleasing.agent.customer.data.OrderDto
import com.motoleasing.agent.customer.ui.CustomerViewModel

@Composable
fun OrdersScreen(
    viewModel: CustomerViewModel,
    onOpenOrder: (orderId: String) -> Unit
) {
    LaunchedEffect(Unit) { viewModel.refreshOrders() }

    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("My Orders", style = MaterialTheme.typography.titleLarge)
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(viewModel.orders) { order ->
                OrderCard(order, onOpenOrder)
            }
        }
    }
}

@Composable
private fun OrderCard(order: OrderDto, onOpenOrder: (String) -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onOpenOrder(order.id) }
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text("${order.productBrand.orEmpty()} ${order.productModel.orEmpty()} (${order.purchaseMode})")
            Text("Total: ${order.totalPrice}")
            val received = order.receivedInstallments ?: 0
            val total = order.totalInstallments ?: 0
            if (total > 0) {
                Text("Installments: $received / $total")
            }
        }
    }
}

