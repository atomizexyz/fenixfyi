import type { NextPage } from "next";

export const MaxValueField: NextPage<any> = (props) => {
  return (
    <div className="form-control w-full flex flex-col space-y-2">
      <label className="flex justify-between">
        <span className="text-sm secondary-text">{props.title}</span>
        <span className="text-sm text-error">{props.errorMessage}</span>
      </label>
      <input
        type="number"
        step="any"
        placeholder="0"
        className="primary-input"
        disabled={props.disabled}
        {...props.register}
      />
      <label className="flex justify-between">
        <span className="text-sm secondary-text">{props.description}</span>
        <span className="text-sm secondary-text">
          {`${Number(props.value).toLocaleString("en-US")}`}
          <button
            type="button"
            onClick={() => props.setValue(props.register.name, props.value, { shouldValidate: true })}
            className="primary-button-mini"
            disabled={props.disabled}
          >
            Max
          </button>
        </span>
      </label>
    </div>
  );
};
