import { z } from 'zod'

export const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .regex(/^\+1\d{9}$/, 'Phone number must be in +1XXXXXXXXX format'),
  email: z.string().email('Invalid email address'),
  nctId: z.string().min(1),
  agree: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the privacy policy' }),
  }),
})

export type FormData = z.infer<typeof formSchema>