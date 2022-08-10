import { Switch } from "@headlessui/react";
import { useMemo } from "react";
import {
  RegisterOptions,
  useFormContext,
  UseFormRegister
} from "react-hook-form";

import { classNames } from "../utils";

interface InputProps {
  name: string;
  label: string;
  description?: string;
  register?: UseFormRegister<any>;
  options?: RegisterOptions;
  autocomplete?: string;
  autoFocus?: boolean;
  type?: string;
}

export default function ToggleField({
  autoFocus,
  register,
  autocomplete = "off",
  name,
  label,
  description = "",
  type,
  options = {},
  ...rest
}: InputProps) {
  const methods = useFormContext();
  const errorMessage = methods?.formState?.errors?.[name]?.message;
  const attrs: any = {};
  if (autoFocus) {
    attrs.autoFocus = true;
  }
  const value = useMemo(() => methods.watch(name), [methods, name]);
  return (
    <>
      <Switch.Group as="div" className="flex items-center justify-between">
        <span className="flex-grow flex flex-col">
          <Switch.Label
            as="span"
            className="text-sm font-medium text-gray-900"
            passive
          >
            {label}
          </Switch.Label>
          {description ? (
            <Switch.Description as="span" className="text-sm text-gray-500">
              {description}
            </Switch.Description>
          ) : null}
        </span>
        <Switch
          checked={value}
          onChange={() => methods.setValue(name, !value)}
          className={classNames(
            value ? "bg-indigo-600" : "bg-gray-200",
            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              value ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            )}
          />
        </Switch>
      </Switch.Group>
    </>
  );
}
