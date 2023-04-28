import { IconAlertOctagonFilled, IconAlertTriangleFilled, IconInfoCircleFilled } from "@tabler/icons-react";
import { NextPage } from "next";

export enum AlertType {
  Error,
  Warn,
  Info,
}

export const AlertError: NextPage<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <div className="rounded-md alert-error-background p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <IconAlertOctagonFilled className="h-5 w-5 alert-error-icon" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium alert-error-title">{title}</h3>
          <div className="mt-2 text-sm alert-error-description">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AlertWarn: NextPage<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <div className="rounded-md alert-warn-background p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <IconAlertTriangleFilled className="h-5 w-5 alert-warn-icon" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium alert-warn-title">{title}</h3>
          <div className="mt-2 text-sm alert-warn-description">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AlertInfo: NextPage<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <div className="rounded-md alert-info-background p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <IconInfoCircleFilled className="h-5 w-5 alert-info-icon" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium alert-info-title">{title}</h3>
          <div className="mt-2 text-sm alert-info-description">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
