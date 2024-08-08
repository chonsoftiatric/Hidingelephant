"use client";

import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import * as zod from "zod";
import { options } from "./data";
import BlurEffect from "@/components/common/elements/BlurEffect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import MultipleSelector from "@/components/ui/multiple-selector";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  useOnBoardingDetails,
  userOnBoarding,
} from "@/services/onBoarding.service";
import { API_ROUTES } from "@/utils/API_ROUTES";
import toast from "react-hot-toast";

const FormSchema = zod.object({
  where_did_you_hear_about_us: zod.string(),
  describes_you_best: zod
    .array(zod.string())
    .min(1, "required")
    .max(3, "select upto 3"),
  team_size: zod.string().min(2, "select 1").default("individual"),
  primary_use: zod
    .array(zod.object({ label: zod.string(), value: zod.string() }))
    .max(3, "Select up to 3"),
});

type FormValues = zod.infer<typeof FormSchema>;

const OnBoardingPage2 = () => {
  const { replace } = useRouter();
  const [isIndividual, setIsIndividual] = useState<boolean>(true);
  const [_selectedOptions, setSelectedOption] = useState<string[]>([]);

  const { data: isOnBoarded } = useOnBoardingDetails();

  if (isOnBoarded?.data) {
    // @temp - changed the path from /pricing to /p
    replace("/p/1");
  }

  const onBoardingMutation = useMutation({
    mutationFn: userOnBoarding,
    onSuccess: () => {
      replace("/p/1");
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      describes_you_best: [],
    },
    mode: "onChange",
  });

  const handleSubmit = (values: FormValues) => {
    const response = onBoardingMutation.mutateAsync({
      primaryUsage: values.primary_use.map((item) => item.value),
      sourceReference: values.where_did_you_hear_about_us,
      teamSize: values.team_size,
      workRole: values.describes_you_best,
    });
    toast.promise(response, {
      error: (err) => err?.message,
      loading: "loading",
      success: "success",
    });
  };

  const onSelect = (label: string) => {
    const allValues = form.getValues().describes_you_best;
    allValues.push(label);
    form.setValue("describes_you_best", allValues);
    setSelectedOption(allValues);
  };

  const onDeSelect = (label: string) => {
    const newValues = form
      .getValues("describes_you_best")
      .filter((item) => item != label);
    form.setValue("describes_you_best", newValues);
    setSelectedOption(newValues);
  };

  return (
    <div className="w-screen h-screen overflow-auto grid grid-cols-2 max-md:grid-cols-1">
      <BlurEffect type="right" className="w-full" />

      {/* first side */}
      <div className="container flex flex-col justify-center md:w-[450px] w-[350px] my-5">
        <h1 className="text-2xl font-bold mb-8">
          {`One more step and you're in!`}
        </h1>

        <Form {...form}>
          <form
            className="grid grid-cols-1 gap-5"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="where_did_you_hear_about_us"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where did you hear about us?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.where_did_you_hear_about_us.map(
                        (item, index) => (
                          <SelectItem
                            value={item}
                            key={`${index}-where-did-you-hear`}
                          >
                            {item}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-2">
              <h1 className="font-sm font-medium">What best describes you?</h1>
              <div className="flex flex-wrap gap-3">
                {options.describes_you_best.map((item, index) =>
                  form.getValues().describes_you_best.includes(item) ? (
                    <Badge
                      key={`best-describes-you-${index}`}
                      className={`p-2 cursor-pointer border-black border-[2px] hover:scale-105`}
                      variant={"default"}
                      onClick={() => onDeSelect(item)}
                    >
                      {item}
                    </Badge>
                  ) : (
                    <Badge
                      key={`best-describes-you-${index}`}
                      className={`p-2 cursor-pointer border-black border-[2px] hover:scale-105`}
                      variant={"outline"}
                      onClick={() => onSelect(item)}
                    >
                      {item}
                    </Badge>
                  )
                )}
              </div>
              {form.formState.errors.describes_you_best && (
                <p className="text-[#ef4444]">
                  {form.formState.errors.describes_you_best?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <h1 className="font-sm font-medium">
                Are you working as an individual or as part of a team?
              </h1>
              <div className="flex gap-5">
                <Button
                  variant={isIndividual ? "default" : "outline"}
                  type="button"
                  onClick={() => {
                    setIsIndividual(true);
                    form.setValue("team_size", "individual");
                  }}
                >
                  Individual
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsIndividual(false);
                    form.setValue("team_size", "");
                  }}
                  variant={!isIndividual ? "default" : "outline"}
                >
                  Part of a tem
                </Button>
              </div>
              {isIndividual == false ? (
                <FormField
                  control={form.control}
                  name="team_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many people are in your team?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select 1" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {options.team_size.map((item, index) => (
                            <SelectItem value={item} key={`${index}-team-size`}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              ) : null}
            </div>

            <FormField
              control={form.control}
              name="primary_use"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    What will you primarily use Hiding Elephant for?
                  </FormLabel>
                  <FormControl>
                    <div className="flex w-full flex-col gap-5">
                      <MultipleSelector
                        hidePlaceholderWhenSelected={true}
                        // @ts-ignore
                        value={field.value}
                        onChange={field.onChange}
                        defaultOptions={options.primary_use}
                        placeholder="Select"
                        badgeClassName="p-2"
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                          </p>
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>

      {/* second side */}
      <div className="grid place-items-center bg-light-cream p-5">
        <Image
          src={"/images/logo-maker-preview.png"}
          height={600}
          width={600}
          alt={"Image"}
        />
      </div>
    </div>
  );
};

export default OnBoardingPage2;
