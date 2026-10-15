import { useStore } from '../context/StoreContext';

export default function Toast() {
  const { toast } = useStore();
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
