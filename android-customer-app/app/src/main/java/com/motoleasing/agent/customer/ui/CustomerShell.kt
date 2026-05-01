package com.motoleasing.agent.customer.ui

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.ReceiptLong
import androidx.compose.material.icons.outlined.Storefront
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.motoleasing.agent.customer.ui.screens.HomeShowroomScreen
import com.motoleasing.agent.customer.ui.screens.OrderDetailScreen
import com.motoleasing.agent.customer.ui.screens.OrdersProScreen
import com.motoleasing.agent.customer.ui.screens.ProfileScreen
import com.motoleasing.agent.customer.ui.screens.ShopScreen
import com.motoleasing.agent.customer.ui.screens.VehicleDetailScreen

private enum class CustomerTab(val route: String, val label: String) {
    HOME("home", "Home"),
    SHOP("shop", "Shop"),
    ORDERS("orders", "Orders"),
    PROFILE("profile", "Profile"),
}

@Composable
fun CustomerShell(viewModel: CustomerViewModel) {
    val navController = rememberNavController()
    val tabs = remember { CustomerTab.entries }

    LaunchedEffect(Unit) {
        // Load the global data once per session; screens will just render it.
        viewModel.loadHome(viewModel.profile?.preferredDealerId)
        viewModel.refreshOrders()
    }

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val destinationRoute = navBackStackEntry?.destination?.route ?: CustomerTab.HOME.route
    val currentRoute = when {
        destinationRoute.startsWith("shop") -> CustomerTab.SHOP.route
        else -> destinationRoute
    }
    val showBottomBar = tabs.any { it.route == currentRoute }

    Scaffold(
        bottomBar = {
            if (!showBottomBar) return@Scaffold
            NavigationBar {
                tabs.forEach { tab ->
                    val selected = currentRoute == tab.route
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            navController.navigate(tab.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            Icon(
                                imageVector = when (tab) {
                                    CustomerTab.HOME -> Icons.Outlined.Home
                                    CustomerTab.SHOP -> Icons.Outlined.Storefront
                                    CustomerTab.ORDERS -> Icons.Outlined.ReceiptLong
                                    CustomerTab.PROFILE -> Icons.Outlined.Person
                                },
                                contentDescription = tab.label
                            )
                        },
                        label = { Text(tab.label) }
                    )
                }
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = CustomerTab.HOME.route,
            modifier = Modifier
        ) {
            composable(CustomerTab.HOME.route) {
                HomeShowroomScreen(
                    viewModel = viewModel,
                    onOpenCash = { navController.navigate("shop?mode=CASH") },
                    onOpenInstallment = { navController.navigate("shop?mode=INSTALLMENT") },
                    onOpenVehicle = { mode, vehicleId -> navController.navigate("vehicle/$mode/$vehicleId") }
                )
            }
            composable("shop?mode={mode}") { backStack ->
                val mode = backStack.arguments?.getString("mode") ?: "CASH"
                ShopScreen(
                    viewModel = viewModel,
                    initialMode = mode,
                    onOpenVehicle = { selectedMode, vehicleId ->
                        navController.navigate("vehicle/$selectedMode/$vehicleId")
                    }
                )
            }
            composable(CustomerTab.SHOP.route) {
                ShopScreen(
                    viewModel = viewModel,
                    initialMode = "CASH",
                    onOpenVehicle = { selectedMode, vehicleId ->
                        navController.navigate("vehicle/$selectedMode/$vehicleId")
                    }
                )
            }
            composable(CustomerTab.ORDERS.route) {
                OrdersProScreen(
                    viewModel = viewModel,
                    onOpenOrder = { orderId -> navController.navigate("order/$orderId") }
                )
            }
            composable(CustomerTab.PROFILE.route) {
                ProfileScreen(viewModel = viewModel)
            }
            composable("vehicle/{mode}/{id}") { backStack ->
                val mode = backStack.arguments?.getString("mode") ?: "CASH"
                val id = backStack.arguments?.getString("id") ?: ""
                VehicleDetailScreen(
                    viewModel = viewModel,
                    vehicleId = id,
                    mode = mode,
                    onOrderCreated = { orderId ->
                        navController.navigate("order/$orderId")
                    }
                )
            }
            composable("order/{id}") { backStack ->
                val id = backStack.arguments?.getString("id") ?: ""
                OrderDetailScreen(viewModel = viewModel, orderId = id)
            }
        }
    }
}
