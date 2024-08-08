"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="pb-10 overflow-auto">
      <div className="p-3 px-5 font-semibold text-xl">Setting</div>

      <Card className="max-w-[320px] m-4 md:ml-[50px]">
        <CardHeader>
          <h5 className="font-semibold text-xl">Notifications</h5>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 max-w-[300px] mr-auto">
            <div className="flex justify-between items-center">
              <p>Email Notification</p>
              <Switch className="data-[state=checked]:bg-primary-default" />
            </div>
            <div className="flex justify-between items-center">
              <p>Monthly Reports</p>
              <Switch className="data-[state=checked]:bg-primary-default" />
            </div>
            <div className="flex justify-between items-center">
              <p>Quarterly Reports</p>
              <Switch className="data-[state=checked]:bg-primary-default" />
            </div>
            <div className="flex justify-between items-center">
              <p>Push Notification</p>
              <Switch className="data-[state=checked]:bg-primary-default" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
