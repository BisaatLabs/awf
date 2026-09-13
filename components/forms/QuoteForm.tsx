'use client';

import React, { useState } from 'react';
import { useForm, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteSchema, type QuoteValues } from '@/lib/validations';
import { createWhatsAppUrl } from '@/lib/whatsapp';

interface FieldConfig {
  name: keyof QuoteValues;
  label: string;
  placeholder: string;
}

const CONTACT_FIELDS: FieldConfig[] = [
  { name: 'fullName', label: 'Full name', placeholder: 'Your name' },
  { name: 'company', label: 'Company', placeholder: 'Company or organisation' },
  { name: 'email', label: 'Email', placeholder: 'you@example.com' },
  { name: 'phone', label: 'Phone', placeholder: '+92 300 1234567' },
];

const SPEC_FIELDS: FieldConfig[] = [
  { name: 'furniture', label: 'Furniture required', placeholder: 'Tables, desks, seating, beds…' },
  { name: 'quantity', label: 'Quantity', placeholder: 'Approximate quantity' },
  { name: 'dimensions', label: 'Dimensions', placeholder: 'Known sizes or "to be discussed"' },
  { name: 'material', label: 'Material / finish', placeholder: 'Solid wood, veneer, laminate, metal…' },
  { name: 'timeline', label: 'Timeline', placeholder: 'When do you need it delivered?' },
];

const PROJECT_TYPE_OPTIONS = [
  'Home',
  'Office',
  'Corporate / bulk',
  'School',
  'Institutional',
  'Custom',
];

const SPACE_TYPE_OPTIONS = [
  'Home',
  'Office',
  'Corporate',
  'School',
  'Institutional',
  'Hospitality',
];

const BUDGET_OPTIONS = [
  'To be discussed',
  'Under PKR 500,000',
  'PKR 500,000 – 1,500,000',
  'Above PKR 1,500,000',
];

export function QuoteForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
  });

  const [sent, setSent] = useState(false);

  const onSubmit = (values: QuoteValues) => {
    const message = [
      'Hello Al Wahid Furnitures,',
      '',
      'I would like to request a quotation.',
      '',
      `Name: ${values.fullName}`,
      `Company: ${values.company || 'Not specified'}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      '',
      `Project Type: ${values.projectType}`,
      `Space Type: ${values.spaceType}`,
      `Furniture: ${values.furniture}`,
      `Quantity: ${values.quantity}`,
      `Dimensions: ${values.dimensions}`,
      `Material / Finish: ${values.material}`,
      `Timeline: ${values.timeline}`,
      `Budget Range: ${values.budget}`,
      '',
      `Additional Requirements:\n${values.message || 'None'}`,
      '',
      'Please share the quotation and next steps.',
    ].join('\n');

    setSent(true);
    window.open(createWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
      {sent && (
        <div className="border border-[var(--green)] bg-[var(--green)]/10 p-4 text-sm text-[var(--green)]">
          Your enquiry has been prepared in WhatsApp. Please send it there to continue the conversation with our workshop team.
        </div>
      )}

      {/* Contact Details */}
      <div className="grid gap-6 sm:grid-cols-2">
        {CONTACT_FIELDS.map(({ name, label, placeholder }) => (
          <label key={name} className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">
            {label}
            <input
              {...register(name)}
              placeholder={placeholder}
              className="border-b border-[var(--line)] bg-transparent py-3 text-sm font-normal normal-case tracking-normal outline-none transition-colors placeholder:text-[var(--charcoal)]/35 focus:border-[var(--green)]"
            />
            {errors[name] && (
              <span className="text-[10px] normal-case tracking-normal text-[var(--walnut)]">
                {String(errors[name]?.message)}
              </span>
            )}
          </label>
        ))}
      </div>

      {/* Project & Space Types */}
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          label="Project type"
          name="projectType"
          register={register}
          options={PROJECT_TYPE_OPTIONS}
          error={errors.projectType?.message}
        />
        <SelectField
          label="Space type"
          name="spaceType"
          register={register}
          options={SPACE_TYPE_OPTIONS}
          error={errors.spaceType?.message}
        />
      </div>

      {/* Specifications */}
      <div className="grid gap-6 sm:grid-cols-2">
        {SPEC_FIELDS.map(({ name, label, placeholder }) => (
          <label key={name} className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">
            {label}
            <input
              {...register(name)}
              placeholder={placeholder}
              className="border-b border-[var(--line)] bg-transparent py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-[var(--green)]"
            />
            {errors[name] && (
              <span className="text-[10px] normal-case tracking-normal text-[var(--walnut)]">
                {String(errors[name]?.message)}
              </span>
            )}
          </label>
        ))}

        <SelectField
          label="Budget range"
          name="budget"
          register={register}
          options={BUDGET_OPTIONS}
          error={errors.budget?.message}
        />
      </div>

      {/* Additional Requirements */}
      <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">
        Additional requirements
        <textarea
          {...register('message')}
          rows={4}
          placeholder="Tell us about the space, delivery access, installation, or custom joinery requirements"
          className="resize-y border border-[var(--line)] bg-transparent p-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-[var(--green)]"
        />
        {errors.message && (
          <span className="text-[10px] normal-case tracking-normal text-[var(--walnut)]">
            {String(errors.message.message)}
          </span>
        )}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit bg-[var(--green)] px-6 py-4 text-xs font-bold uppercase tracking-[.13em] text-[var(--ivory)] transition hover:bg-[var(--walnut)] disabled:opacity-50"
      >
        Build My Enquiry
      </button>

      <p className="text-xs leading-5 text-[var(--charcoal)]/50">
        We will format your details directly into a WhatsApp enquiry message. No form data is stored or emailed.
      </p>
    </form>
  );
}

interface SelectFieldProps {
  label: string;
  name: keyof QuoteValues;
  register: UseFormRegister<QuoteValues>;
  options: string[];
  error?: string;
}

function SelectField({ label, name, register, options, error }: SelectFieldProps) {
  return (
    <label className="grid gap-2 text-xs font-bold uppercase tracking-[.1em]">
      {label}
      <select
        {...register(name)}
        className="border-b border-[var(--line)] bg-transparent py-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-[var(--green)]"
      >
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-[10px] normal-case tracking-normal text-[var(--walnut)]">
          {error}
        </span>
      )}
    </label>
  );
}
