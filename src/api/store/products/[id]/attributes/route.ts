import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ATTRIBUTE_MODULE } from '../../../../../modules/attribute'
import type AttributeModuleService from '../../../../../modules/attribute/service/attribute-module-service'
import { validateBody } from '../../../../../shared/validation'
import { errorHandler } from '../../../../../shared/errors/error-handler'
import { SetProductAttributesSchema } from '../../../../../modules/attribute/validation/attribute.validation'

/**
 * GET /store/products/:id/attributes
 *
 * Returns all attribute values for a product, enriched with their definitions.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const attributeService = req.scope.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)
    const attributes = await attributeService.getProductAttributes(id)
    res.status(200).json({ data: attributes })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * POST /store/products/:id/attributes
 *
 * Set or update attribute values for a product.
 * Body: { attributes: [{ attributeId, value }] }
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const body = validateBody(SetProductAttributesSchema, req.body)

    const attributeService = req.scope.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await attributeService.setProductAttributes(id, body.attributes as any)

    const updated = await attributeService.getProductAttributes(id)
    res.status(200).json({ data: updated })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
