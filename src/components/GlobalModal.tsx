import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface GlobalModalProps {
  /** Título que se muestra en la parte superior del modal. */
  title?: string;

  /** Controla si el modal está abierto o cerrado. */
  isOpen: boolean;

  /** Callback que se dispara cuando cambia el estado de apertura del modal. */
  onOpenChange: (nextOpen: boolean) => void;

  /** Determina si se puede cerrar el modal haciendo clic fuera (por defecto: false). */
  isDismissable?: boolean;

  /** Si es true, desactiva el cierre con tecla de escape (por defecto: false). */
  isKeyboardDismissDisabled?: boolean;

  /** Contenido principal del modal (se renderiza en ModalBody). */
  children: React.ReactNode;

  /** Texto para el botón de confirmación (por defecto: "Confirm"). */
  confirmLabel?: string;

  /** Texto para el botón de cancelar/cerrar (por defecto: "Close"). */
  cancelLabel?: string;

  /** Callback que se llama al hacer clic en el botón de “Confirmar”. */
  onConfirm?: () => void;

  /** Callback que se llama al hacer clic en el botón de “Cancelar”. */
  onCancel?: () => void;
}

/**
 * Modal reutilizable al estilo Hero UI.
 * Permite un título, botones de confirmación/cancelación, y contenido central.
 */
export function GlobalModal({
  title,
  isOpen,
  onOpenChange,
  isDismissable = false,
  isKeyboardDismissDisabled = false,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Close",
  onConfirm,
  onCancel,
}: GlobalModalProps) {
  // Lógica interna para el botón de cerrar
  function handleClose() {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  }

  // Lógica interna para el botón de confirmar
  function handleConfirm() {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    >
      <ModalContent>
        {() => (
          <>
            {/* Encabezado */}
            <ModalHeader className="flex flex-col gap-1">
              {title}
            </ModalHeader>

            {/* Cuerpo */}
            <ModalBody>
              {children}
            </ModalBody>

            {/* Pie con botones */}
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                {cancelLabel}
              </Button>
              <Button color="primary" onPress={handleConfirm}>
                {confirmLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
