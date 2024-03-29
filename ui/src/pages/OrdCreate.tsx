/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

import { Listbox, RadioGroup, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { forwardRef, Fragment, useEffect, useMemo } from "react";
import {
  FormProvider,
  RegisterOptions,
  useForm,
  useFormContext
} from "react-hook-form";
import { Namespace, useGetNamespacesQuery } from "../operations";

/* This example requires Tailwind CSS v2.0+ */
function Heading() {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          New Peer node
        </h2>
      </div>
    </div>
  );
}
/* This example requires Tailwind CSS v2.0+ */
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pb-5 border-b border-gray-200">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    </div>
  );
}
interface InputTextProps {
  label: string;
  onChange: any;
  onBlur: any;
  name: any;
}
const InputText = forwardRef(
  ({ label, name, onBlur, onChange, ...props }: InputTextProps, ref) => {
    const id = useMemo(() => label, [label]);
    const methods = useFormContext();
    return (
      <div className="sm:col-span-3">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1">
          <input
            ref={ref as any}
            type="text"
            {...props}
            onBlur={onBlur}
            onChange={onChange}
            name={name}
            id={id}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>
    );
  }
);
interface InputTextProps {
  label: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
interface IOption {
  id: string;
  name: string;
}
interface InputSelectProps {
  name: string;
  label: string;
  items: IOption[];
  options?: RegisterOptions;
}
const InputSelect = forwardRef(
  ({ label, options, items, name }: InputSelectProps, ref) => {
    const cachedItems = useMemo(() => items, []);
    const {
      formState,
      watch,
      register: registerField,
      setValue,
    } = useFormContext();
    const errorMessage = formState?.errors?.[name]?.message;
    const selectValue: IOption | null = watch(name) || null;
    useEffect(() => {
      registerField(name, options);
    }, [registerField]);
    const handleChange = (val: IOption) => {
      setValue(name, val, { shouldValidate: true });
    };

    return (
      <div>
        <Listbox value={selectValue || null} onChange={handleChange}>
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium text-gray-700">
                {label}
              </Listbox.Label>
              <div className="mt-1 relative">
                <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <span className="block truncate">
                    {selectValue ? selectValue.name : ""}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-400"
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
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {items.map((item) => (
                      <Listbox.Option
                        key={item.id}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "text-white bg-indigo-600"
                              : "text-gray-900",
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
              </div>
            </>
          )}
        </Listbox>
      </div>
    );
  }
);

interface SelectItem {
  name: string;
  id: string;
  description: string;
}
interface RadioGroupProps {
  name: string;
  label: string;
  options: RegisterOptions;
  items: SelectItem[];
}
function RadioGroupField({ name, label, items, options }: RadioGroupProps) {
  const cachedItems = useMemo(() => items, []);
  const { formState, watch, register, setValue } = useFormContext();
  const errorMessage = formState?.errors?.[name]?.message;
  const selectValue: string | null = watch(name) || null;
  useEffect(() => {
    register(name, options);
  }, [name, options]);
  const handleChange = (val: string) =>
    setValue(name, val, { shouldValidate: true });
  const hasError = !!errorMessage;

  return (
    <RadioGroup value={selectValue} onChange={handleChange}>
      <RadioGroup.Label
        className={classNames(
          "block text-sm font-medium ",
          hasError ? "text-red-700" : "text-gray-700"
        )}
      >
        {label}
      </RadioGroup.Label>
      <div className="bg-white rounded-md -space-y-px">
        {cachedItems.map((setting, settingIdx) => (
          <RadioGroup.Option
            key={setting.name}
            value={setting.id}
            className={({ checked }) => {
              console.log(checked);

              return classNames(
                settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                settingIdx === cachedItems.length - 1
                  ? "rounded-bl-md rounded-br-md"
                  : "",
                "relative pr-4 pt-4 pb-4 flex cursor-pointer focus:outline-none"
              );
            }}
          >
            {({ active, checked }) => {
              console.log(active, checked);

              return (
                <>
                  <span
                    className={classNames(
                      checked
                        ? "bg-indigo-600 border-transparent"
                        : "bg-white border-gray-300",
                      active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                      "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center"
                    )}
                    aria-hidden="true"
                  >
                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                  </span>
                  <div className="ml-3 flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className={classNames(
                        checked ? "text-indigo-900" : "text-gray-900",
                        "block text-sm font-medium"
                      )}
                    >
                      {setting.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className={classNames(
                        checked ? "text-indigo-700" : "text-gray-500",
                        "block text-sm"
                      )}
                    >
                      {setting.description}
                    </RadioGroup.Description>
                  </div>
                </>
              );
            }}
          </RadioGroup.Option>
        ))}
      </div>
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {errorMessage}
        </p>
      ) : null}
    </RadioGroup>
  );
}
const worldStates = [
  {
    name: "LevelDB",
    id: "LevelDB",
    description: "LevelDB world state",
  },
  {
    name: "CouchDB",
    id: "CouchDB",
    description: "CouchDB world state",
  },
];
export default function OrdCreate() {
  const methods = useForm({
    defaultValues: {
      worldState: worldStates[0].id,
      externalEndpoint: "",
      name: "peer0-org1",
      namespace: null,
    } as {
      worldState: string;
      externalEndpoint: string;
      name: string;
      namespace: Namespace | null;
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = methods;
  const { data, loading, error } = useGetNamespacesQuery();
  const namespaces = useMemo(() => {
    return data?.namespaces || [];
  }, [data]);
  useEffect(() => {
    if (!getValues("namespace")) {
      setValue("namespace", namespaces.filter((i) => i.name === "default")[0]);
    }
  }, [namespaces, watch("namespace")]);

  return (
    <FormProvider {...methods}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Heading />
          <div className="mt-8">
            <form className="space-y-8 ">
              <SectionHeader title="Peer configuration" />
              <div className="space-y-8 divide-y divide-gray-200">
                <InputText
                  label="Name"
                  {...register("name", { required: true, maxLength: 30 })}
                />
                <InputSelect
                  label="Namespace"
                  name="namespace"
                  items={namespaces.map((namespace) => ({
                    id: namespace.name,
                    name: namespace.name,
                  }))}
                  options={{}}
                />
                <RadioGroupField
                  label="World state"
                  name="worldState"
                  items={worldStates}
                  options={{ required: true }}
                />
                <InputText
                  label="External Endpoint"
                  {...register("externalEndpoint", {
                    required: true,
                    maxLength: 30,
                  })}
                />
              </div>
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
