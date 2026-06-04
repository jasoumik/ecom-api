import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ATTRIBUTE_MODULE } from '../../../modules/attribute'
import type AttributeModuleService from '../../../modules/attribute/service/attribute-module-service'
import { validateBody } from '../../../shared/validation'
import { errorHandler } from '../../../shared/errors/error-handler'
import {
  CreateAttributeGroupSchema,
  CreateAttributeSchema,
  CreateAttributeOptionSchema,
} from '../../../modules/attribute/validation/attribute.validation'

/**
 * GET /admin/attributes
 *
 * List all attribute groups, optionally filtered by categoryId.
 * Enriches each group with its attributes and their options.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const { categoryId, isActive } = req.query as {
      categoryId?: string
      isActive?: string
    }

    const attributeService = req.scope.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)

    const filters: Record<string, unknown> = {}
    if (categoryId) filters.categoryId = categoryId
    if (isActive !== undefined) filters.isActive = isActive === 'true'

    const groups = await attributeService.listGroups(filters)

    const enriched = await Promise.all(
      groups.map(async (group) => {
        const attributes = await attributeService.listAttributeDefinitions({ groupId: group.id })
        const attributesWithOptions = await Promise.all(
          attributes.map(async (attribute) => {
            const options = await attributeService.listOptions(attribute.id)
            return { ...attribute, options }
          })
        )
        return { ...group, attributes: attributesWithOptions }
      })
    )

    res.status(200).json({ data: enriched })
  } catch (error) {
    errorHandler(error, req, res)
  }
}

/**
 * POST /admin/attributes
 * POST /admin/attributes/groups
 * POST /admin/attributes/options
 *
 * Route to sub-action based on URL suffix.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const path = req.path
    const attributeService = req.scope.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)

    if (path.endsWith('/groups')) {
      const body = validateBody(CreateAttributeGroupSchema, req.body)
      const group = await attributeService.createGroup(body)
      res.status(201).json({ data: group })
      return
    }

    if (path.endsWith('/options')) {
      const body = validateBody(CreateAttributeOptionSchema, req.body)
      const option = await attributeService.createOption(body)
      res.status(201).json({ data: option })
      return
    }

    // Default: create an attribute
    const body = validateBody(CreateAttributeSchema, req.body)
    const attribute = await attributeService.createAttribute(body)
    res.status(201).json({ data: attribute })
  } catch (error) {
    errorHandler(error, req, res)
  }
}
