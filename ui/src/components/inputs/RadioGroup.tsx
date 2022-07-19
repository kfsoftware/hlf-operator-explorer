import { RadioGroup } from '@headlessui/react'
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import React, { useEffect } from 'react';
import { Fragment, useMemo, useState } from 'react';
import { RegisterOptions, useFormContext, UseFormRegister } from 'react-hook-form';

import { classNames } from '../utils';


interface SelectItem {
  name: string
  id: string
  description: string
}
interface RadioGroupProps {
  name: string;
  label: string;
  options: RegisterOptions
  items: SelectItem[]
}
export default function RadioGroupField({
  name,
  label,
  items,
  options,
}: RadioGroupProps) {
  const cachedItems = useMemo(() => items, [])
  const { formState, watch, register: registerField, setValue } = useFormContext()
  const errorMessage = formState?.errors?.[name]?.message;
  const selectValue: SelectItem | null = watch(name) || null;
  useEffect(() => {
    registerField(name, options);
  }, [registerField]);
  const handleChange = (val: SelectItem) => setValue(name, val, { shouldValidate: true });
  const hasError = !!errorMessage

  return (
    <RadioGroup value={selectValue} onChange={handleChange}>
      <RadioGroup.Label className={
        classNames(
          "block text-sm font-medium ",
          hasError ? "text-red-700" : "text-gray-700" 
        )
      }>{label}</RadioGroup.Label>
      <div className="bg-white rounded-md -space-y-px">
        {cachedItems.map((setting, settingIdx) => (
          <RadioGroup.Option
            key={setting.name}
            value={setting}
            className={({ checked }) =>
              classNames(
                settingIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                settingIdx === cachedItems.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                'relative pr-4 pt-4 pb-4 flex cursor-pointer focus:outline-none'
              )
            }
          >
            {({ active, checked }) => (
              <>
                <span
                  className={classNames(
                    checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
                    active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                    'h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center'
                  )}
                  aria-hidden="true"
                >
                  <span className="rounded-full bg-white w-1.5 h-1.5" />
                </span>
                <div className="ml-3 flex flex-col">
                  <RadioGroup.Label
                    as="span"
                    className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'block text-sm font-medium')}
                  >
                    {setting.name}
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as="span"
                    className={classNames(checked ? 'text-indigo-700' : 'text-gray-500', 'block text-sm')}
                  >
                    {setting.description}
                  </RadioGroup.Description>
                </div>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
      {
        errorMessage
          ? <p className="mt-2 text-sm text-red-600" id="email-error">
            {errorMessage}
          </p>
          : null
      }
    </RadioGroup>
  )
}

