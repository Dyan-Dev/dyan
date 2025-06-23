import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoint: string;
  method: string;
  response: string;
}

export function ResponseModal({ isOpen, onClose, endpoint, method, response }: ResponseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Response from {method} {endpoint}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px]">
          <pre className="bg-gray-900 text-white p-4 rounded text-sm overflow-x-auto">
            {response}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
