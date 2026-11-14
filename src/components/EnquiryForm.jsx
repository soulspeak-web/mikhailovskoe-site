import { useRef, useState } from "react";

const name = { key: "name", label: "Имя", autoComplete: "off" };
const email = {
  key: "email",
  label: "Электронная почта",
  type: "email",
  autoComplete: "off",
  placeholder: "author@example.com",
};
const residentFields = [
  name,
  email,
  {
    key: "direction",
    label: "Творческое направление",
    options: [
      "Режиссура",
      "Сценарное мастерство",
      "Операторское искусство",
      "Звук и музыка",
      "Продюсирование",
      "Другое",
    ],
  },
  {
    key: "project",
    label: "О проекте",
    multiline: true,
    hint: "Расскажите, над чем работаете и что хотели бы сделать в резиденции. Минимум 20 символов.",
    min: 20,
  },
];
const questionFields = [
  name,
  email,
  {
    key: "question",
    label: "Ваш вопрос",
    multiline: true,
    hint: "Например, об экскурсиях или доступности маршрута.",
    min: 10,
  },
];

function validate(field, value) {
  if (field.key === "name" && (!/\p{L}/u.test(value) || value.length < 2))
    return "Введите имя.";
  if (field.key === "email" && !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value))
    return "Укажите почту в формате name@example.com.";
  if (
    field.options &&
    !field.options.some((option) => option.value === value || option === value)
  )
    return "Выберите вариант из списка.";
  if (
    field.type === "number" &&
    (!Number.isSafeInteger(Number(value)) || Number(value) < 1)
  )
    return "Укажите целое число участников от 1.";
  if (field.min && value.length < field.min)
    return `Введите не меньше ${field.min} символов.`;
  return "";
}

function FormFields({ mode, fields, buttonLabel }) {
  const [errors, setErrors] = useState({});
  const [complete, setComplete] = useState(false);
  const confirmation = useRef(null);

  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const invalid = {};
    for (const field of fields) {
      const message = validate(
        field,
        String(values.get(field.key) ?? "").trim(),
      );
      if (message) invalid[field.key] = message;
    }
    const firstInvalid = Object.keys(invalid)[0];
    setErrors(invalid);
    if (firstInvalid) {
      form.elements.namedItem(firstInvalid)?.focus();
      return;
    }
    form.reset();
    setComplete(true);
    requestAnimationFrame(() => confirmation.current?.focus());
  }

  function clearError(event) {
    const key = event.target.name;
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  if (complete) {
    return (
      <div ref={confirmation} tabIndex={-1} className="enquiry-success">
        <h3>
          {mode === "resident"
            ? "Отправка пока недоступна"
            : "Данные прошли проверку"}
        </h3>
        <p role="status">
          Приём заявок откроется позже. Данные не отправлены и не сохранены,
          поля очищены.
        </p>
        <button
          type="button"
          className="button secondary"
          onClick={() => setComplete(false)}
        >
          Заполнить заново
        </button>
      </div>
    );
  }

  return (
    <form
      className="enquiry-fields"
      autoComplete="off"
      noValidate
      onSubmit={submit}
      onChange={clearError}
    >
      {fields.map((field) => {
        const id = `${mode}-${field.key}`;
        const error = errors[field.key];
        const controlProps = {
          id,
          name: field.key,
          required: true,
          "aria-invalid": error ? true : undefined,
          "aria-describedby":
            [field.hint && id + "-hint", error && id + "-error"]
              .filter(Boolean)
              .join(" ") || undefined,
        };

        return (
          <div className="enquiry-field" key={field.key}>
            <label htmlFor={id}>{field.label}</label>
            {field.hint && (
              <p className="field-hint" id={id + "-hint"}>
                {field.hint}
              </p>
            )}
            {field.options ? (
              <select {...controlProps} defaultValue="">
                <option value="" disabled>
                  Выберите вариант
                </option>
                {field.options.map((item) => {
                  const value = typeof item === "string" ? item : item.value;
                  return (
                    <option value={value} key={value}>
                      {typeof item === "string" ? item : item.label}
                    </option>
                  );
                })}
              </select>
            ) : field.multiline ? (
              <textarea
                {...controlProps}
                minLength={field.min}
                maxLength={2000}
                rows={5}
              />
            ) : (
              <input
                {...controlProps}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                min={field.type === "number" ? 1 : undefined}
                step={field.type === "number" ? 1 : undefined}
                maxLength={field.key === "name" ? 100 : undefined}
              />
            )}
            {error && (
              <p id={id + "-error"} className="field-error" role="alert">
                {error}
              </p>
            )}
          </div>
        );
      })}
      <button className="button enquiry-submit" type="submit">
        {buttonLabel}
      </button>
    </form>
  );
}

export function EnquiryForm({ resident = false, excursions = [] }) {
  const [visitorMode, setVisitorMode] = useState("excursion");
  const mode = resident ? "resident" : visitorMode;
  const excursionFields = [
    name,
    email,
    {
      key: "route",
      label: "Экскурсия",
      options: excursions.map((event) => ({
        value: event.id,
        label: `${event.date.slice(-2)} сентября, ${event.startTime} · ${event.title}`,
      })),
    },
    { key: "group", label: "Количество участников", type: "number" },
  ];
  const fields =
    mode === "resident"
      ? residentFields
      : mode === "question"
        ? questionFields
        : excursionFields;
  const buttonLabel =
    mode === "resident"
      ? "Отправить"
      : mode === "question"
        ? "Проверить демо-вопрос"
        : "Проверить заполнение";

  return (
    <section className="enquiry-panel" aria-labelledby="enquiry-title">
      <h2 id="enquiry-title">
        {resident ? "Заявка на резидентство" : "Демо обращения"}
      </h2>
      {!resident && (
        <p className="form-disclaimer">
          Приём заявок откроется позже. Сейчас можно проверить заполнение формы:
          данные не отправляются и не сохраняются.
        </p>
      )}
      {!resident && (
        <div
          className="enquiry-switch"
          role="group"
          aria-label="Цель обращения"
        >
          <button
            type="button"
            aria-pressed={mode === "excursion"}
            onClick={() => setVisitorMode("excursion")}
          >
            Экскурсия
          </button>
          <button
            type="button"
            aria-pressed={mode === "question"}
            onClick={() => setVisitorMode("question")}
          >
            Вопрос
          </button>
        </div>
      )}
      <FormFields
        key={mode}
        mode={mode}
        fields={fields}
        buttonLabel={buttonLabel}
      />
    </section>
  );
}
