"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Social } from "@/components/auth/social";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const { toast } = useToast();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      router.push("/common/dashboard");
    } catch (err) {
      const message = err.message.includes("auth/invalid-credential")
        ? "Invalid credentials"
        : "An error occurred";

      toast({
        variant: "destructive",
        title: "Erro!",
        description: message,
      });
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-3xl font-bold flex gap-2 items-center">siad</h3>
          <h2 className="text-sm text-secondary-200">Login to your account</h2>
        </div>
        <Form {...form}>
          <div className="h-full">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full h-full flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="Insert your e-mail" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Insert your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Social />

              <div className="flex items-baseline justify-between mt-8 gap-2 tablet:!flex-col">
                <Button variant="link" asChild>
                  <Link
                    href="/auth/register"
                    className="text-sm hover:underline tablet:!text-xs"
                  >
                    {"Don't have an account?"}
                  </Link>
                </Button>

                <Button variant="default" size="lg">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </Form>
      </div>
    </div>
  );
}
