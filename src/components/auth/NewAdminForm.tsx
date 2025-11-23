"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createNewAdminUser } from '@/lib/firebase';
import { useState } from 'react';
import { Loader2, UserPlus } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

export function NewAdminForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const result = await createNewAdminUser(values);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Administrator Created',
        description: `Access granted to ${values.email}. They may sign in at any time.`,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: result.error,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Admin Email</FormLabel>
              <FormControl>
                <Input placeholder="new.admin@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <><UserPlus className="mr-2"/> Create Administrator</>}
        </Button>
      </form>
    </Form>
  );
}
