import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import OTPAuthProvider from "./service"

export default ModuleProvider(Modules.AUTH, {
  services: [OTPAuthProvider],
})
