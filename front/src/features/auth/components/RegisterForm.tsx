import { useRegister } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(1, "Required"),
    email: z.string().email("メールアドレスの形式が正しくありません"), // TODO:正規表現対応
    password: z.string().min(8, "8文字以上で入力してください"),
    password_confirmation: z.string().min(1, "確認用のパスワードを入力してください"),
  })
  .superRefine(({ password, password_confirmation }, ctx) => {
    if (password !== password_confirmation) {
      ctx.addIssue({
        path: ["password_confimation"],
        code: "custom",
        message: "パスワードが一致しません",
      });
    }
  });

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
  });
  const { isLoading, mutate } = useRegister();
  const onSubmit: SubmitHandler<RegisterValues> = (data, event) => {
    event?.preventDefault();
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <label htmlFor="name">Name</label>
      <input {...register("name")} />
      {errors.name?.message && <p>{errors.name?.message}</p>}

      <label htmlFor="email">Email</label>
      <input {...register("email")} />
      {errors.email?.message && <p>{errors.email?.message}</p>}

      <label htmlFor="password">Password</label>
      <input {...register("password")} />
      {errors.password?.message && <p>{errors.password?.message}</p>}

      <label htmlFor="password_confirmation">Confirm Password</label>
      <input {...register("password_confirmation")} />
      {errors.password_confirmation?.message && (
        <p>{errors.password_confirmation?.message}</p>
      )}

      <button type="submit">登録</button>
    </form>
  );
}
