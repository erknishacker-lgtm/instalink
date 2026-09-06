'use client';

import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, ArrowUpDown } from 'lucide-react';
import { Button, IconButton } from './ui';

interface Ordered { id: string; order: number }

export function swapped<T>(list: T[], index: number, dir: -1 | 1): T[] | null {
  const j = index + dir;
  if (j < 0 || j >= list.length) return null;
  const next = list.slice();
  [next[index], next[j]] = [next[j], next[index]];
  return next;
}

// Uma requisição por item, em série: o db faz ler-alterar-gravar no registro
// inteiro, então PUTs em paralelo se sobrescreveriam. `list` chega na ordem nova
// mas com os `order` antigos, e é essa diferença que diz o que precisa gravar.
export async function persistOrder(endpoint: string, list: Ordered[]) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].order === i + 1) continue;
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: list[i].id, order: i + 1 }),
    });
    if (!res.ok) throw new Error('Falha ao reordenar');
  }
}

/**
 * Reordenar é um modo à parte, não mais dois botões espremidos na linha: no
 * celular as setas precisam de 44px e a linha já carrega editar e remover.
 */
export function useReorder<T extends Ordered>(
  endpoint: string,
  items: T[] | null,
  setItems: (items: T[]) => void,
  reload: () => void
) {
  const [active, setActive] = useState(false);
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  // A lista se move na hora e a gravação entra numa fila: dois toques seguidos
  // nunca disparam PUTs concorrentes no mesmo registro, e nenhum toque se perde.
  function move(index: number, dir: -1 | 1) {
    if (!items) return;
    const next = swapped(items, index, dir);
    if (!next) return;
    setItems(next.map((item, i) => ({ ...item, order: i + 1 })));
    queue.current = queue.current
      .then(() => persistOrder(endpoint, next))
      .catch(() => {
        toast.error('Não consegui salvar a nova ordem');
        reload();
      });
  }

  return { active, setActive, move };
}

export function ReorderToggle({ active, onClick, disabled }: { active: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <Button
      type="button"
      variant={active ? 'primary' : 'secondary'}
      icon={active ? <Check className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
      onClick={onClick}
      disabled={disabled}
    >
      {active ? 'Pronto' : 'Ordem'}
    </Button>
  );
}

export function MoveButtons({
  index,
  total,
  onMove,
  axis = 'vertical',
}: {
  index: number;
  total: number;
  onMove: (index: number, dir: -1 | 1) => void;
  axis?: 'vertical' | 'horizontal';
}) {
  const Back = axis === 'vertical' ? ArrowUp : ArrowLeft;
  const Fwd = axis === 'vertical' ? ArrowDown : ArrowRight;
  return (
    <>
      <IconButton
        label={axis === 'vertical' ? 'Subir' : 'Mover para antes'}
        onClick={() => onMove(index, -1)}
        disabled={index === 0}
        className="bg-paper-deep disabled:opacity-25"
      >
        <Back className="h-[18px] w-[18px]" />
      </IconButton>
      <IconButton
        label={axis === 'vertical' ? 'Descer' : 'Mover para depois'}
        onClick={() => onMove(index, 1)}
        disabled={index === total - 1}
        className="bg-paper-deep disabled:opacity-25"
      >
        <Fwd className="h-[18px] w-[18px]" />
      </IconButton>
    </>
  );
}
