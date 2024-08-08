import React from "react";
import LabelInfo from "../LabelInfo";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Button from "@/components/common/button/Button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { usePromptStore } from "@/store/prompt-settings";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import useFeatureAccess from "@/hooks/useFeatureAccess";
import { Generate } from "@/app/schema/generate";
import { useVercelKV } from "@/store/vercel-kv";
import { IMagicKeywordForm } from "@/modules/project/elements/PromptBar";
import { getValueWithOneSpace } from "@/utils/fn.frontend";
import { useProjectGenerationMutation } from "@/modules/project/services/project.mutation";
import useCanvasNodes from "@/hooks/useCanvasNodes";
import {
  IProjectImage,
  IProjectPrompt,
} from "@/modules/project/types/common.types";
import { useGlobalStore } from "@/store/global";

type IMagicKeywordSettings = {
  form: UseFormReturn<
    {
      keywords: {
        keyword: string;
        value: string;
      }[];
    },
    any,
    undefined
  >;
  closeDialog: () => void;
};
const MagicKeywordSettings = ({ form, closeDialog }: IMagicKeywordSettings) => {
  const { activeSubProject } = useGlobalStore();
  const params = useParams();
  const id = (params.id as string) || `${activeSubProject}`;
  console.log({ id });
  const promptState = usePromptStore();
  const { handleAddNodes } = useCanvasNodes();
  const { hasFeatureAccess } = useFeatureAccess();
  const { modelSettings } = useVercelKV();
  const { mutateAsync } = useProjectGenerationMutation(params.id as string);
  const handleMagicPromptGenerate = (values: IMagicKeywordForm) => {
    const hasAccess = hasFeatureAccess("generate-prompt");
    if (!hasAccess) return;
    if (!modelSettings) return;
    if (!promptState.prompt) {
      toast.error("Please enter a prompt");
      return;
    }

    const payload: Generate = {
      prompt: getValueWithOneSpace(promptState.prompt),
      negativePrompt: promptState.negativePrompt,
      seed: promptState.seed,
      cfg: promptState.cfg,
      elephantBrain: promptState.elephantBrain,
      elephantModel: promptState.elephantModel,
      numberOfImages: promptState.numberOfImages,
      quality: promptState.quality,
    };
    const axis_arr = ["xAxis", "yAxis", "zAxis"] as const;
    const axis_vals_arr: string[] = [];
    for (const keyword of values.keywords) {
      if (keyword.keyword) {
        const values_str = keyword.value
          .trim()
          .split(",")
          .map((item) => item.trim())
          .join(", ");
        axis_vals_arr.push(`${keyword.keyword.trim()}, ${values_str}`);
      }
    }

    for (let i = 0; i < axis_arr.length; i++) {
      const axis = axis_arr[i];
      const axis_val = axis_vals_arr[i];
      if (axis && axis_val) {
        payload[axis] = axis_val;
      }
    }

    const generateLogoPromise = mutateAsync({ payload, id });
    closeDialog();
    toast
      .promise(generateLogoPromise, {
        loading: "Generating magic prompt logos...",
        success: "Logos generated",
        error: (err) => err?.response?.statusText || "Logo generation failed",
      })
      .then((data) => {
        const promptObj: Record<
          string,
          {
            prompt: IProjectPrompt;
            images: IProjectImage[];
          }
        > = {};
        const prompt = data;
        const images = data.images;
        let count = 0;
        for (const image of images) {
          if (count < 2) {
            count++;
            continue;
          }
          const promptStr = image.generated_prompt;
          const item = promptObj[promptStr];
          if (item) {
            item.images.push(image);
          } else {
            const updatedPrompt = { ...prompt };
            // @ts-ignore
            updatedPrompt.id = `${updatedPrompt.id}-${Math.random() * 10000}`;
            updatedPrompt.prompt = promptStr;
            promptObj[promptStr] = {
              images: [image],
              prompt: updatedPrompt,
            };
          }
          count++;
        }

        function delay(ms: number) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        const generateAllNodes = async () => {
          if (handleAddNodes) {
            const items = Object.values(promptObj);
            let count = 1;
            for (const item of items) {
              const lastItem = items.length === count;
              handleAddNodes({
                images: item.images.map((image) => ({
                  ...image,
                  feedImage: undefined,
                })),
                prompt: item.prompt,
                withSave: lastItem,
                promptNodePosition: {
                  x: (count - 1) * 150,
                  y: Math.floor(Math.random() * 3) * 100,
                },
                isSinleImage: true,
              });
              count++;
              await delay(1000);
            }
          }
        };
        generateAllNodes().then(() => console.log("All nodes generated!"));
      });
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "keywords",
  });
  const updatedKeywordOptions = React.useMemo(() => {
    const keywordOptions = promptState.prompt
      ? promptState.prompt
          .trim()
          .split(" ")
          .map((item) => item.trim())
      : [];
    const uniqueKeywordOptions = [
      ...new Set(keywordOptions.filter((item) => item !== "")),
    ];
    return uniqueKeywordOptions;
  }, [promptState.prompt, fields, promptState.keywordsArr]);

  const handleSubmit = (values: IMagicKeywordForm) => {
    const keywords = values.keywords.slice(0, 3);
    promptState.setKeywords(keywords);
    handleMagicPromptGenerate(values);
  };

  const formFields = React.useMemo(
    () =>
      fields.map((field, index) => (
        <div
          key={`form-field-${field.id}`}
          className="w-full flex gap-4 items-center pr-10 relative"
        >
          <div className="flex flex-1 gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name={`keywords.${index}.keyword`}
                render={({ field }) => (
                  <FormItem>
                    <LabelInfo
                      label={`Magic Keyword #${index + 1}`}
                      infoText="Keyword to match in prompt"
                    />
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                        const keywordsArr = [...promptState.keywordsArr];
                        if (keywordsArr[index]) {
                          keywordsArr[index].keyword = e;
                        } else {
                          keywordsArr[index] = { keyword: e, value: "" };
                        }
                        promptState.setKeywordsArr(keywordsArr);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a keyword" />
                        </SelectTrigger>
                      </FormControl>
                      {updatedKeywordOptions.length ? (
                        <SelectContent>
                          {updatedKeywordOptions.map((keyword) => (
                            <SelectItem key={keyword} value={keyword}>
                              {keyword}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      ) : null}
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name={`keywords.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <LabelInfo
                      label={`Magic Value #${index + 1}`}
                      infoText="dfdf"
                    />
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {index > 0 ? (
            <Button
              className="rounded-md mt-5 absolute -right-5 top-1"
              rightIcon={<TrashIcon size={18} />}
              onClick={() => {
                remove(index);
                const keywordsArr = [...promptState.keywordsArr];
                keywordsArr.splice(index, 1);
                promptState.setKeywordsArr(keywordsArr);
              }}
            ></Button>
          ) : null}
        </div>
      )),
    [fields, form.control, remove, promptState.keywordsArr]
  );

  React.useEffect(() => {
    if (promptState.keywords.length) {
      form.setValue("keywords", promptState.keywords);
    }
  }, [promptState.keywords]);

  return (
    <div className="flex justify-center items-center w-full">
      {/* Cross Icon */}
      <div className="h-full w-[90%] mx-auto  rounded-xl bg-white relative">
        <h4 className="font-semibold text-xl">Magic Search & Replace panel</h4>
        <p className="text-light-gray">
          Type the magic keyword, and the magic extra generation you’d like to
          see
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mt-4 flex flex-col gap-3">{formFields}</div>
            <Button
              className="rounded-lg mt-6"
              variant="outline"
              leftIcon={<PlusIcon />}
              type="button"
              onClick={() => append({ keyword: "", value: "" })}
              disabled={fields.length >= 3}
            >
              Add New Keyword
            </Button>
            <div>
              <Button
                disabled={promptState.isLoading}
                className="rounded-lg mt-6"
              >
                Generate Magic Prompt
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MagicKeywordSettings;
