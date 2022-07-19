import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import React, { useEffect } from "react";
import { Fragment, useMemo, useState } from "react";
import {
  RegisterOptions,
  useFormContext,
  UseFormRegister,
} from "react-hook-form";

import { classNames } from "../utils";

interface SelectItem {
  name: string;
  id: string;
}
interface SelectFieldProps {
  name: string;
  label: string;
  register?: UseFormRegister<any>;
  options?: RegisterOptions;
  items: SelectItem[];
}
export default function SelectField({
  name,
  label,
  items,
  options = {},
}: SelectFieldProps) {
  const cachedItems = useMemo(() => items, []);
  const {
    formState,
    watch,
    register: registerField,
    setValue,
  } = useFormContext();
  const errorMessage = formState?.errors?.[name]?.message;
  const selectValue: SelectItem | null = watch(name) || null;
  useEffect(() => {
    registerField(name, options);
  }, [registerField]);
  const handleChange = (val: SelectItem) => {
    setValue(name, val, { shouldValidate: true });
  };
  const hasError = !!errorMessage;
  return (
    <div style={{ width: "400px" }}>
      <Listbox value={selectValue} onChange={handleChange}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium text-gray-700">
              {label}
            </Listbox.Label>
            <div className="mt-1 relative">
              <Listbox.Button
                className={classNames(
                  `bg-white relative w-full border  rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1  sm:text-sm`,
                  hasError
                    ? `border-red-300 focus:ring-red-500 focus:border-red-500`
                    : `border-gray-300 focus:ring-indigo-500 focus:border-indigo-500`
                )}
              >
                <span className="block truncate">
                  {selectValue?.name || "Select one"}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className={classNames(
                      "h-5 w-5",
                      hasError ? "text-red-400" : "text-gray-400"
                    )}
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  static
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm w-100"
                >
                  {cachedItems.map((item) => (
                    <Listbox.Option
                      key={item.id}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-indigo-600" : "text-gray-900",
                          "cursor-default select-none relative py-2 pl-3 pr-9"
                        )
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {item.name}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
              {errorMessage ? (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
}
