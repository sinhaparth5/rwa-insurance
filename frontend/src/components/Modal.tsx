"use client";

import {
  Dialog
} from "@chakra-ui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: string;
  children: React.ReactNode;
}

export const Modal = {
  Root: ({ children, open, onOpenChange }: any) => (
    <Dialog.Root open={open} onOpenChange={(details) => onOpenChange && onOpenChange(details.open)}>
      {children}
    </Dialog.Root>
  ),
  
  Content: ({ children, maxW }: any) => (
    <Dialog.Backdrop>
      <Dialog.Positioner>
        <Dialog.Content maxW={maxW}>
          <Dialog.CloseTrigger />
          {children}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Backdrop>
  ),
  
  Header: ({ children }: any) => (
    <Dialog.Header>
      <Dialog.Title>{children}</Dialog.Title>
    </Dialog.Header>
  ),
  
  Title: ({ children }: any) => children,
  
  Body: ({ children }: any) => (
    <Dialog.Body>{children}</Dialog.Body>
  ),
  
  Footer: ({ children }: any) => (
    <Dialog.Footer>{children}</Dialog.Footer>
  )
};

// Alternative: Direct Dialog wrapper for easier migration
export const DialogModal = ({ isOpen, onClose, title, size, children }: ModalProps) => (
  <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && onClose()}>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content maxW={size}>
        <Dialog.CloseTrigger />
        {title && (
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
        )}
        <Dialog.Body>
          {children}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Root>
);