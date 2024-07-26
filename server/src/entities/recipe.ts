import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
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

  @OneToOne(() => Product, (product) => product.recipe, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product
}

export type RecipeBare = Omit<Recipe, 'category' | 'product'>

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
