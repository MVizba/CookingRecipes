import { validates } from '@server/utils/validation'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { Recipe } from './recipe'

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('integer')
  recipeId: number

  @ManyToOne(() => Recipe, (recipe) => recipe.products)
  recipe: Recipe

  @Column('text')
  name: string

  @Column('text')
  product: string

  @Column('text')
  instructions: string
}

export type ProductBare = Omit<Product, 'recipe'>

export const productSchema = validates<ProductBare>().with({
  id: z.number().int().positive(),
  recipeId: z.number().positive(),
  name: z.string().trim(),
  product: z.string().trim(),
  instructions: z.string().trim(),
})

export const productInsertSchema = productSchema.omit({ id: true })

export type ProductInsert = z.infer<typeof productInsertSchema>
