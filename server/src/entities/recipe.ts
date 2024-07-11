import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { z } from 'zod'
import { Product } from './product'
import { Category } from './category'

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('integer')
  categoryId: number

  @ManyToOne(() => Category, (category) => category.recipes)
  category: Category

  @Column('text')
  recipe_name: string

  @OneToMany(() => Product, (product) => product.recipe, {
    cascade: true,
  })
  products: Product[]
}

export type RecipeBare = Omit<Recipe, 'category' | 'products'>

export const recipeSchema = validates<RecipeBare>().with({
  id: z.number().int().positive(),
  categoryId: z.number().positive(),
  recipe_name: z
    .string()
    .trim()
    .min(2, 'Recipe name must be at least 2 characters long')
    .max(100),
})

export const recipeInsertSchema = recipeSchema.omit({ id: true })

export type RecipeInsert = z.infer<typeof recipeInsertSchema>
