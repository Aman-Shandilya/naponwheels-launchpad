import React, { createContext, useContext, useState, useCallback } from 'react';

interface ModalContextType {
  isOpen: boolean;
  openModal: (reason?: string) => void;
  closeModal: () => void;
  defaultReason: string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useLeadModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useLeadModal must be used within LeadModalProvider');
  return ctx;
};

export const LeadModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultReason, setDefaultReason] = useState(
    'I am interested in NapOnWheels services and would like more information.'
  );

  const openModal = useCallback((reason?: string) => {
    if (reason) setDefaultReason(reason);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, defaultReason }}>
      {children}
    </ModalContext.Provider>
  );
};
