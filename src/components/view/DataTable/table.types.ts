import { VisibilityState } from '@tanstack/react-table';

export default interface TableProps {
  columns: any[];
  data: any[];
  onRowClick?: (row?: any) => void;
  classes?: string;
  showVisibility?: boolean;
  initialVisibility?: VisibilityState;
  actions?: React.ReactNode;
  primaryAction?: React.ReactNode;
  isLoading?: boolean;
}
