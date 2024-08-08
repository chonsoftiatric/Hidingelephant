import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditProfileForm } from "./EditProfileForm";
import { useUserDetails } from "@/services/user.service";
import { useState } from "react";

interface EditProfileModalProps {
  id: number | undefined;
}

export const EditProfileModal = (props: EditProfileModalProps) => {
  const { data: user } = useUserDetails();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {user && user?.id === props.id ? (
        <DialogTrigger className="z-10" asChild>
          <div className="border border-gray-400 flex items-center gap-4 px-2 py-1 cursor-pointer bg-white rounded-full">
            <p className="text-sm font-semibold">Edit Profile</p>
          </div>
        </DialogTrigger>
      ) : null}
      <DialogPortal>
        <DialogOverlay className="bg-black opacity-75" />
        <DialogContent className="p-0 max-w-[600px] w-full border-none">
          <DialogHeader className="mt-4">
            <DialogTitle className="font-semibold ml-4">
              Edit profile
            </DialogTitle>
            <DialogDescription className="pt-2">
              <EditProfileForm onClose={() => setOpen(false)} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
