import {
  Home,
  Wrench,
  Layout,
  Warehouse,
  Clock,
  Calendar,
  CheckCircle2,
  Phone,
  MessageSquare,
  LucideIcon,
} from "lucide-react";

export interface FormOption {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface FormField {
  id: string;
  placeholder: string;
}

export interface FormStep {
  id: string;
  question: string;
  type: "choice" | "text" | "phone";
  options?: FormOption[];
  fields?: FormField[];
}

export interface FormConfig {
  webhookUrl: string;
  steps: FormStep[];
}

export const FORM_CONFIG: FormConfig = {
  webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK || "",
  steps: [
    {
      id: "workType",
      question: "Click on the type of work you need",
      type: "choice",
      options: [
        { label: "Full Roof Replacement", value: "replacement", icon: Home },
        { label: "Flat Roofing", value: "flat", icon: Warehouse },
        { label: "Roof Repair", value: "repair", icon: Wrench },
        { label: "Fascias & Gutters", value: "gutters", icon: Layout },
        { label: "Other", value: "other", icon: CheckCircle2 },
      ],
    },
    {
      id: "propertyType",
      question: "What type of property do you have?",
      type: "choice",
      options: [
        { label: "Detached", value: "detached", icon: Home },
        { label: "Semi Detached", value: "semi", icon: Home },
        { label: "Terraced", value: "terraced", icon: Warehouse },
        { label: "Bungalow", value: "bungalow", icon: Home },
      ],
    },
    {
      id: "isOwner",
      question: "Are you the owner of the property?",
      type: "choice",
      options: [
        { label: "Yes", value: "yes", icon: CheckCircle2 },
        { label: "No", value: "no", icon: CheckCircle2 },
      ],
    },
    {
      id: "timeline",
      question: "How soon are you looking to get started?",
      type: "choice",
      options: [
        { label: "ASAP", value: "asap", icon: Clock },
        { label: "This Month", value: "this_month", icon: Calendar },
        { label: "2-3 Months", value: "later", icon: Calendar },
      ],
    },
    {
      id: "contactPreference",
      question: "How would you like to get your quote?",
      type: "choice",
      options: [
        { label: "Phone Call", value: "phone", icon: Phone },
        { label: "Text / SMS", value: "sms", icon: MessageSquare },
        { label: "Free Property Visit", value: "visit", icon: Home },
      ],
    },
    {
      id: "personalInfo",
      question: "What's your name?",
      type: "text",
      fields: [
        { id: "firstName", placeholder: "First name" },
        { id: "lastName", placeholder: "Last name" },
      ],
    },
    {
      id: "phoneInfo",
      question: "What phone number should we contact you on?",
      type: "phone",
      fields: [{ id: "phone", placeholder: "+44 0000 000000" }],
    },
  ],
};
