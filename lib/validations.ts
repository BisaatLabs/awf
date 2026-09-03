import { z } from 'zod';

export const quoteSchema = z.object({
  fullName: z.string().min(2, 'Please enter your name'), company: z.string().optional(),
  email: z.string().email('Enter a valid email'), phone: z.string().min(7, 'Enter a phone number'),
  projectType: z.string().min(1, 'Choose a project type'), spaceType: z.string().min(1, 'Choose a space type'),
  furniture: z.string().min(2, 'Tell us what you need'), quantity: z.string().min(1, 'Add a quantity'),
  dimensions: z.string().min(2, 'Add dimensions or write “to be discussed”'), material: z.string().min(2, 'Add a material or finish'),
  timeline: z.string().min(2, 'Add a timeline'), budget: z.string().min(1, 'Choose a budget range'), message: z.string().min(10, 'Please add a little more detail'),
});
export type QuoteValues = z.infer<typeof quoteSchema>;
