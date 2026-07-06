"use client";

export default function ConfirmDeleteButton({
  id,
  action,
  confirmText = "Tem certeza? Essa ação não pode ser desfeita.",
  label = "Excluir",
}: {
  id: string;
  action: (formData: FormData) => void;
  confirmText?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
        {label}
      </button>
    </form>
  );
}
