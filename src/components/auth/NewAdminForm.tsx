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
import { createNewAdmin } from '@/ai/flows/new-admin-flow';
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
    try {
      const result = await createNewAdmin({ email: values.email });
        if (result.success) {
            toast({
                title: 'Administrator Created',
                description: `An email has been sent to ${values.email} with login instructions.`,
            });
            form.reset();
        } else {
            throw new Error(result.error || 'An unknown error occurred.');
        }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to Create Administrator',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input placeholder="new.admin@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <UserPlus className="mr-2" />}
          Add User
        </Button>
      </form>
    </Form>
  );
}
