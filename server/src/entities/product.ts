import { validates } from '@server/utils/validation'
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { Recipe } from './recipe'

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number

  @OneToOne(() => Recipe, (recipe) => recipe.product)
  recipe: Recipe

  @Column('integer')
  cookingTime: number

  @Column('text')
  product: string

  @Column('text')
  instructions: string
}

export type ProductBare = Omit<Product, 'recipe'>

export const productSchema = validates<ProductBare>().with({
  id: z.number().int().positive(),
  cookingTime: z.number().int().positive(),
  product: z.string().trim(),
  instructions: z.string().trim(),
})

export const productInsertSchema = productSchema.omit({ id: true })

export type ProductInsert = z.infer<typeof productInsertSchema>
