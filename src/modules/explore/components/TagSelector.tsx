import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { createTagRequest, searchTags } from "../services/tags.service";
import toast from "react-hot-toast";

export const TagSelector = (field: any) => {
  const validateTag = (value: string) => {
    const regex = /^[a-zA-Z0-9\s-]+$/;
    return regex.test(value);
  };

  return (
    <MultipleSelector
      defaultOptions={[]}
      value={field.value}
      onChange={field.onChange}
      maxSelected={5}
      hidePlaceholderWhenSelected
      creatable
      placeholder="Choose the tags that are relevant to your image"
      badgeClassName="bg-primary-default hover:bg-primary-hover"
      selectFirstItem={false}
      onSearch={async (value) => {
        const res = await searchTags(value);
        const data = await Promise.all(
          res.map((tagRow) => {
            return { label: tagRow.name, value: tagRow.id.toString() };
          })
        );
        return data;
      }}
      onCreate={async (value) => {
        const tagId = await createTagRequest({
          tag: value,
        });
        const option: Option = {
          label: value,
          value: tagId.toString(),
        };
        return option;
      }}
      onCreateValidate={(val) => {
        const isValid = validateTag(val);
        if (!isValid) {
          toast.error(
            "Tags can only contain single spaces, single hyphens, and alphanumeric characters"
          );
        }
        return isValid;
      }}
      emptyIndicator={
        <p className="w-full text-center text-sm leading-10 text-muted-foreground">
          no results found.
        </p>
      }
      loadingIndicator={
        <p className="w-full text-center text-sm leading-10 text-muted-foreground">
          searching
        </p>
      }
    />
  );
};
