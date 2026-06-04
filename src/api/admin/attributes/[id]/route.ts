import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ATTRIBUTE_MODULE } from '../../../../modules/attribute'
import type AttributeModuleService from '../../../../modules/attribute/service/attribute-module-service'
import { validateBody } from '../../../../shared/validation'
import { errorHandler } from '../../../../shared/errors/error-handler'
import { UpdateAttributeSchema } from '../../../../modules/attribute/validation/attribute.validation'

/**
 * DELETE /admin/attributes/:id
 *
 * Delete an attribute and all its options.
 */
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const attributeService = req.scope.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)
    await attributeService.deleteAttribute(id)
    res.status(200).json({ data: { id, deleted: true } })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * PATCH /admin/attributes/:id
 *
 * Update an attribute's fields.
 */
export async function PATCH(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { id } = req.params
    const body = validateBody(UpdateAttributeSchema, req.body)
    const attributeService = req.scope.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)
    const attribute = await attributeService.updateAttribute(id, body)
    res.status(200).json({ data: attribute })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
