import { ExclamationCircleIcon } from "@heroicons/react/outline";
import React from "react";
import {
  RegisterOptions,
  useFormContext,
  UseFormRegister,
} from "react-hook-form";
import { classNames } from "../utils";
interface InputProps {
  name: string;
  label: string;
  register?: UseFormRegister<any>;
  options?: RegisterOptions;
  autocomplete?: string;
  autoFocus?: boolean;
  type?: string;
}

export default function TextField({
  autoFocus,
  register,
  autocomplete = "off",
  name,
  label,
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
  return (
    <>
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            {...register!(name, options)}
            {...attrs}
            autoFocus={true}
            id={name}
            autoComplete={autocomplete}
            name={name}
            type={type || "text"}
            className={classNames(
              !errorMessage
                ? "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                : "",
              errorMessage
                ? `                    
                    appearance-none block w-full px-3 py-2 border text-red-900  border-red-300 rounded-md shadow-sm placeholder-red-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`
                : ""
            )}
          />
          {errorMessage ? (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          ) : null}
        </div>
        {errorMessage ? (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </>
  );
}