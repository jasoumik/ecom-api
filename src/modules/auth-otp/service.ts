import { AbstractAuthModuleProvider } from "@medusajs/utils"
import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
} from "@medusajs/framework/types"
import { verifyOtp } from "../../utils/otp-store"

class OTPAuthProvider extends AbstractAuthModuleProvider {
  static identifier = "otp"
  static DISPLAY_NAME = "OTP Authentication"

  async authenticate(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const identifier = (data.body?.identifier as string | undefined)?.trim()
    const otp = (data.body?.otp as string | undefined)?.trim()

    if (!identifier) {
      return { success: false, error: "identifier is required" }
    }
    if (!otp) {
      return { success: false, error: "otp is required" }
    }

    const valid = verifyOtp(identifier, otp)
    if (!valid) {
      return { success: false, error: "Invalid or expired OTP. Please request a new one." }
    }

    let authIdentity
    try {
      authIdentity = await authIdentityProviderService.retrieve({
        entity_id: identifier,
      })
    } catch {
      authIdentity = await authIdentityProviderService.create({
        entity_id: identifier,
      })
    }

    return { success: true, authIdentity }
  }
}

export default OTPAuthProvider
