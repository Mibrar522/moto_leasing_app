package com.motoleasing.agent.customer.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.motoleasing.agent.customer.data.VerifyOtpRequest
import com.motoleasing.agent.customer.ui.CustomerViewModel

@Composable
fun LoginScreen(
    viewModel: CustomerViewModel,
    onLoggedIn: () -> Unit
) {
    var isSignup by remember { mutableStateOf(true) }
    var email by remember { mutableStateOf("") }
    var phoneCode by remember { mutableStateOf("+92") }
    var phoneNumber by remember { mutableStateOf("") }
    var fullName by remember { mutableStateOf("") }
    var cnic by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    var otp by remember { mutableStateOf("") }
    var otpRequested by remember { mutableStateOf(false) }
    var devOtp by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(if (isSignup) "Sign up" else "Login")

        OutlinedTextField(
            value = viewModel.backendUrl,
            onValueChange = viewModel::updateBackendUrl,
            label = { Text("Backend URL") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
        )

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedTextField(
                value = phoneCode,
                onValueChange = { phoneCode = it },
                label = { Text("Code") },
                modifier = Modifier.weight(1f),
                singleLine = true
            )
            OutlinedTextField(
                value = phoneNumber,
                onValueChange = { phoneNumber = it },
                label = { Text("Phone") },
                modifier = Modifier.weight(2f),
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
            )
        }

        if (isSignup) {
            OutlinedTextField(
                value = fullName,
                onValueChange = { fullName = it },
                label = { Text("Full name") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            OutlinedTextField(
                value = cnic,
                onValueChange = { cnic = it },
                label = { Text("CNIC (digits or 17301-5996795-1)") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
            )
            OutlinedTextField(
                value = address,
                onValueChange = { address = it },
                label = { Text("Address") },
                modifier = Modifier.fillMaxWidth()
            )
        }

        Button(
            onClick = {
                viewModel.requestOtp(
                    purpose = if (isSignup) "SIGNUP" else "LOGIN",
                    email = email,
                    phoneCode = phoneCode,
                    phoneNumber = phoneNumber
                ) { code ->
                    otpRequested = true
                    devOtp = code
                    if (code != null && otp.isBlank()) otp = code
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) { Text("Send OTP") }

        if (otpRequested) {
            OutlinedTextField(
                value = otp,
                onValueChange = { otp = it },
                label = { Text("OTP") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
            )

            if (devOtp != null) {
                Text("Dev OTP: $devOtp")
            }

            Button(
                onClick = {
                    viewModel.verifyOtp(
                        VerifyOtpRequest(
                            purpose = if (isSignup) "SIGNUP" else "LOGIN",
                            email = email,
                            phoneCountryCode = phoneCode,
                            phoneNumber = phoneNumber,
                            code = otp,
                            fullName = if (isSignup) fullName else null,
                            cnic = if (isSignup) cnic else null,
                            address = if (isSignup) address else null
                        )
                    ) { onLoggedIn() }
                },
                modifier = Modifier.fillMaxWidth()
            ) { Text(if (isSignup) "Create account" else "Login") }
        }

        Spacer(Modifier.height(8.dp))

        TextButton(onClick = { isSignup = !isSignup; otpRequested = false; otp = "" }) {
            Text(if (isSignup) "Already have an account? Login" else "New here? Sign up")
        }
    }
}

