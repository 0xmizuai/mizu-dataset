export interface SampleDataProps {
  id: string;
  name: string;
  data_type: string;
  language: string;
}

export interface SampleDataItem {
  id: string;
  text: string;
  uri: string;
  created_at: string;
}

export interface HistoryItem {
  id: string;
  query: string;
  date: string;
  expend: string;
  status: string;
  created_at: string;
  points_spent: string;
}
