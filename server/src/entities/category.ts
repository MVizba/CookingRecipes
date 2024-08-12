import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { z } from 'zod'
import { Recipe } from './recipe'
import { User } from './user'

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('integer')
  userId: number

  @ManyToOne(() => User, (user) => user.categories)
  user: User

  @Column('text')
  category_name: string

  @OneToMany(() => Recipe, (recipe) => recipe.category, {
    cascade: ['insert'],
  })
  recipes: Recipe[]
}

export type CategoryBare = Omit<Category, 'user' | 'recipes'>

export const categorySchema = validates<CategoryBare>().with({
  id: z.number().int().positive(),
  userId: z.number().positive(),
  category_name: z
    .string()
    .trim()
    .min(2, 'Category name must be at least 2 characters long')
    .max(100),
})

export const categoryInsertSchema = categorySchema.omit({
  id: true,
})

export type CategoryInsert = z.infer<typeof categoryInsertSchema>

/* Just a commet to run a CI/CD */
