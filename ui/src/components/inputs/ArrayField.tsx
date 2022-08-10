import { PlusSmIcon as PlusSmIconSolid } from "@heroicons/react/solid";
import {
  RegisterOptions,
  useFieldArray,
  useFormContext,
  UseFormRegister,
} from "react-hook-form";
import { get } from "lodash";
import TextField from "./TextField";

interface InputProps {
  name: string;
  label: string;
  itemLabel: string;
  register?: UseFormRegister<any>;
  options?: RegisterOptions;
  autocomplete?: string;
  autoFocus?: boolean;
  type?: string;
}

export default function ArrayField({
  autoFocus,
  register,
  autocomplete = "off",
  name,
  label,
  itemLabel,
  type,
  options = {},
  ...rest
}: InputProps) {
  const methods = useFormContext();
  const errorMessage = get(methods?.formState?.errors, name)?.message;
  const attrs: any = {};
  if (autoFocus) {
    attrs.autoFocus = true;
  }
  const arrayField = useFieldArray({
    control: methods.control,
    name: name,
  });
  return (
    <>
      <fieldset>
        <legend>{label}</legend>
        <div className="mt-4">
          <ul>
            {methods.getValues(name).map((_: string, idx: number) => (
              <>
                <li className="flex items-center  py-3">
                  <div className="flex items-center">
                    <TextField
                      autoFocus={true}
                      register={register}
                      name={`${name}.${idx}`}
                      label={itemLabel}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => arrayField.remove(idx)}
                    className="ml-6 mt-6 rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Remove
                  </button>
                </li>
              </>
            ))}
          </ul>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                arrayField.append("");
              }}
              className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusSmIconSolid className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        {errorMessage ? (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {errorMessage}
          </p>
        ) : null}
      </fieldset>
    </>
  );
}
