// src/components/GlobalForm.tsx
import React from "react";
import {
  Input,
  Select,
  SelectItem,
  Avatar,
  NumberInput,
} from "@heroui/react";

export interface FieldConfig {
  name: string;
  label: string;
  type: string; // "text" | "heroSelect" | "heroNumber" | "select"...
  options?: Array<{ value: string; label: string }>; // Para "select" nativo
  items?: Array<{
    id: string | number;
    name: string;
    avatar?: string;
    email?: string;
  }>; // Para "heroSelect"
}

interface GlobalFormProps {
  fields: FieldConfig[];
  values: Record<string, any>;
  onChange: (newValues: Record<string, any>) => void;
}

export function GlobalForm({ fields, values, onChange }: GlobalFormProps) {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => {
        // Creamos un ID único para asociar label y componente
        const labelId = `${field.name}-label`;

        switch (field.type) {
          /**
           * 1) "heroSelect": usa <Select> de Hero UI con avatares, etc.
           */
          case "heroSelect": {
            const items = field.items ?? [];
            const currentVal = values[field.name];
            const selectedKeys = currentVal ? new Set([String(currentVal)]) : new Set();

            return (
              <div key={field.name} className="flex flex-col w-full">
                <label
                  id={labelId}
                  className="font-medium text-sm mb-1"
                >
                  {field.label}
                </label>
                <Select
                  className="w-full"
                  variant="bordered"
                  selectionMode="single"
                  selectedKeys={selectedKeys}
                  // Asignamos aria-labelledby al ID del label
                  aria-labelledby={labelId}
                  onSelectionChange={(keys) => {
                    const [val] = keys as Iterable<string>;
                    onChange({ ...values, [field.name]: val });
                  }}
                >
                  {items.map((item) => (
                    <SelectItem
                      key={String(item.id)}
                      textValue={item.name}
                    >
                      <div className="flex gap-2 items-center">
                        {item.avatar && (
                          <Avatar
                            alt={item.name}
                            className="flex-shrink-0"
                            size="sm"
                            src={item.avatar}
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="text-small">{item.name}</span>
                          {item.email && (
                            <span className="text-tiny text-default-400">
                              {item.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </div>
            );
          }

          /**
           * 2) "heroNumber": usa <NumberInput> de Hero UI
           */
          case "heroNumber": {
            const currentVal = values[field.name] ?? "";
            return (
              <div key={field.name} className="flex flex-col w-full">
                <label id={labelId} className="font-medium text-sm mb-1">
                  {field.label}
                </label>
                <NumberInput
                  aria-labelledby={labelId}
                  className="w-full"
                  variant="bordered"
                  value={currentVal}
                  onValueChange={(val) => {
                    onChange({ ...values, [field.name]: val });
                  }}
                />
              </div>
            );
          }

          /**
           * 3) "select": <select> nativo
           */
          case "select": {
            return (
              <div key={field.name} className="flex flex-col w-full">
                <label
                  id={labelId}
                  className="font-medium text-sm mb-1"
                >
                  {field.label}
                </label>
                <select
                  aria-labelledby={labelId}
                  className="w-full border border-default-300 rounded px-2 py-1"
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...values,
                      [field.name]: e.target.value,
                    })
                  }
                >
                  <option value="">-- Seleccione --</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          /**
           * 4) Default -> <Input> de Hero UI
           */
          default: {
            return (
              <div key={field.name} className="flex flex-col w-full">
                <label id={labelId} className="font-medium text-sm mb-1">
                  {field.label}
                </label>
                <Input
                  aria-labelledby={labelId}
                  className="w-full"
                  type={field.type}
                  value={values[field.name] ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...values,
                      [field.name]: e.target.value,
                    })
                  }
                />
              </div>
            );
          }
        }
      })}
    </div>
  );
}
