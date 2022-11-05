export interface RecordDrawerEditProps {
  id: string;
  data: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
}
