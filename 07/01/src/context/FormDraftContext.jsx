import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "react-form-lab:wizard-draft";

const defaultDraft = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: 18,
  gender: undefined,
  education: undefined,
  skills: [],
  experience: 0,
  employmentType: undefined,
  city: undefined,
  website: "",
  bio: "",
  remote: false,
  newsletter: false,
  terms: false,
};

const FormDraftContext = createContext(null);

function readDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDraft;
    return { ...defaultDraft, ...JSON.parse(raw) };
  } catch {
    return defaultDraft;
  }
}

export function FormDraftProvider({ children }) {
  const [draft, setDraftState] = useState(readDraft);

  const setDraft = (nextDraft) => {
    setDraftState((current) => {
      const value =
        typeof nextDraft === "function" ? nextDraft(current) : nextDraft;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return value;
    });
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDraftState(defaultDraft);
  };

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      clearDraft,
      storageKey: STORAGE_KEY,
    }),
    [draft]
  );

  return (
    <FormDraftContext.Provider value={value}>
      {children}
    </FormDraftContext.Provider>
  );
}

export function useFormDraft() {
  const context = useContext(FormDraftContext);

  if (!context) {
    throw new Error("useFormDraft must be used inside FormDraftProvider");
  }

  return context;
}
