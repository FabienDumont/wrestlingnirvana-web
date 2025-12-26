<!-- app/components/championships/ChampionshipOwnershipHistoryModal.vue -->
<script setup lang="ts">
import type { ColumnDef, Row as TanstackRow } from '@tanstack/vue-table';
import * as z from 'zod';
import type { ChampionshipResponse } from '#shared/types/championships';

type PromotionOption = { label: string; value: string };

type OwnershipLine = {
  promotionId: string;
  fromDate: string;
  toDate: string | null;
};

type TableRow = {
  id: string;
  promotionId: string | null;
  fromDate: string;
  toDate: string | null;
};

const props = defineProps<{
  open: boolean;
  loading?: boolean;
  promotionOptions: PromotionOption[];
  championship: ChampionshipResponse | null;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'save', payload: { lines: OwnershipLine[] }): void;
}>();

const today = () => new Date().toISOString().slice(0, 10);
const newRowId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

const rows = ref<TableRow[]>([]);
const errorMessage = ref<string | null>(null);

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;

    rows.value = (props.championship?.ownershipHistory ?? []).map((l) => ({
      id: newRowId(),
      promotionId: l.promotionId,
      fromDate: l.fromDate,
      toDate: l.toDate,
    }));

    if (rows.value.length === 0) {
      rows.value.push({
        id: newRowId(),
        promotionId: null,
        fromDate: today(),
        toDate: null,
      });
    }

    errorMessage.value = null;
  },
);

const addRow = () => {
  rows.value.push({
    id: newRowId(),
    promotionId: null,
    fromDate: today(),
    toDate: null,
  });
};

const removeRow = (id: string) => {
  rows.value = rows.value.filter((r) => r.id !== id);
  if (rows.value.length === 0) addRow();
};

const autoFillEndDates = () => {
  const ordered = [...rows.value].sort((a, b) => a.fromDate.localeCompare(b.fromDate));
  for (let i = 0; i < ordered.length - 1; i++) {
    ordered[i]!.toDate = ordered[i + 1]!.fromDate;
  }
  const byId = new Map(ordered.map((r) => [r.id, r]));
  rows.value = rows.value.map((r) => byId.get(r.id) ?? r);
};

const lineSchema = z
  .object({
    promotionId: z.string().min(1, 'Promotion is required'),
    fromDate: z.string().min(1, 'Start date is required'),
    toDate: z.string().nullable(),
  })
  .refine((r) => !r.toDate || r.toDate >= r.fromDate, {
    message: 'End date cannot be before start date',
  });

const payloadSchema = z.array(lineSchema).superRefine((lines, ctx) => {
  const ordered = [...lines].sort((a, b) => a.fromDate.localeCompare(b.fromDate));

  for (let i = 0; i < ordered.length - 1; i++) {
    if (!ordered[i]!.toDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'Only the last line may have an empty end date.',
      });
      return;
    }
  }

  for (let i = 1; i < ordered.length; i++) {
    const prev = ordered[i - 1]!;
    const cur = ordered[i]!;
    if (prev.toDate && cur.fromDate < prev.toDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'Lines overlap.',
      });
      return;
    }
  }
});

const onSave = () => {
  errorMessage.value = null;

  const lines: OwnershipLine[] = [...rows.value]
    .sort((a, b) => a.fromDate.localeCompare(b.fromDate))
    .map((r) => ({
      promotionId: r.promotionId ?? '',
      fromDate: r.fromDate,
      toDate: r.toDate,
    }));

  const parsed = payloadSchema.safeParse(lines);
  if (!parsed.success) {
    errorMessage.value = parsed.error.issues[0]?.message ?? 'Invalid ownership history.';
    return;
  }

  emit('save', { lines: parsed.data });
};

const columns: ColumnDef<TableRow>[] = [
  { id: 'promotionId', header: 'Promotion', accessorKey: 'promotionId' },
  { id: 'fromDate', header: 'Start', accessorKey: 'fromDate' },
  { id: 'toDate', header: 'End', accessorKey: 'toDate' },
  { id: 'actions', header: '' },
];

type SlotRow = TanstackRow<TableRow>;

const setPromotionForRow = (row: TableRow, opt: PromotionOption | null) => {
  row.promotionId = opt?.value ?? null;
};

const getSelectedPromotion = (row: TableRow): PromotionOption | null => {
  if (!row.promotionId) return null;
  return props.promotionOptions.find((o) => o.value === row.promotionId) ?? null;
};
</script>

<template>
  <UModal
    :open="open"
    :dismissible="false"
    :title="'Ownership history - ' + props.championship?.name"
    :ui="{
      content: 'w-[calc(100vw-10rem)] max-w-none h-[calc(100dvh-10rem)] max-h-none',
      body: 'p-0 flex-1 overflow-hidden',
    }"
    @update:open="(v) => emit('update:open', v)"
  >
    <template #body>
      <!-- Make the modal body layout a column and allow children to shrink -->
      <div class="flex h-full min-h-0 flex-col gap-4 p-4">
        <div class="flex items-center justify-between gap-2">
          <div class="text-sm text-gray-500">
            Add / edit ownership lines, then save all changes.
          </div>

          <div class="flex items-center gap-2">
            <UButton size="sm" variant="ghost" color="neutral" @click="autoFillEndDates">
              Auto-fill end dates
            </UButton>
            <UButton size="sm" icon="i-lucide-plus" @click="addRow">Add line</UButton>
          </div>
        </div>

        <UAlert
          v-if="errorMessage"
          color="error"
          title="Invalid ownership history"
          :description="errorMessage"
        />

        <!-- Scroll area -->
        <div class="min-h-0 flex-1 overflow-auto">
          <UTable :data="rows" :columns="columns">
            <!-- Promotion -->
            <template #promotionId-cell="{ row }">
              <USelectMenu
                :model-value="getSelectedPromotion((row as SlotRow).original)"
                :items="promotionOptions"
                option-attribute="label"
                placeholder="Select..."
                class="w-full"
                @update:model-value="
                  (opt: PromotionOption | null) =>
                    setPromotionForRow((row as SlotRow).original, opt)
                "
              />
            </template>

            <!-- Start -->
            <template #fromDate-cell="{ row }">
              <UInput v-model="(row as SlotRow).original.fromDate" type="date" class="w-full" />
            </template>

            <!-- End -->
            <template #toDate-cell="{ row }">
              <div class="flex items-center gap-2">
                <UInput v-model="(row as SlotRow).original.toDate" type="date" class="w-full" />
                <UButton
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  :disabled="(row as SlotRow).original.toDate === null"
                  @click="(row as SlotRow).original.toDate = null"
                >
                  Clear
                </UButton>
              </div>
            </template>

            <!-- Actions -->
            <template #actions-cell="{ row }">
              <div class="flex justify-end">
                <UButton
                  icon="i-lucide-trash"
                  size="xs"
                  variant="ghost"
                  color="error"
                  aria-label="Remove line"
                  @click="removeRow((row as SlotRow).original.id)"
                />
              </div>
            </template>
          </UTable>
        </div>

        <!-- Footer stays visible -->
        <div class="flex justify-end gap-2">
          <UButton
            variant="ghost"
            color="neutral"
            type="button"
            @click="emit('update:open', false)"
          >
            Cancel
          </UButton>
          <UButton :loading="loading" @click="onSave">Save all</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
