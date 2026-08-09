// ===== Base Notion Types =====

interface NotionUser {
  object: "user";
  id: string;
}

interface NotionFileObject {
  name: string;
  type: "file";
  file: {
    url: string;
    expiry_time: string;
  };
}

interface SelectOption {
  id: string;
  name: string;
  color: string;
}

// ===== Property Types =====

interface FormulaStringProperty {
  id: string;
  type: "formula";
  formula: {
    type: "string";
    string: string;
  };
}

interface FormulaBooleanProperty {
  id: string;
  type: "formula";
  formula: {
    type: "boolean";
    boolean: boolean;
  };
}

interface NumberProperty {
  id: string;
  type: "number";
  number: number | null;
}

interface SelectProperty {
  id: string;
  type: "select";
  select: SelectOption | null;
}

interface MultiSelectProperty {
  id: string;
  type: "multi_select";
  multi_select: SelectOption[];
}

interface CheckboxProperty {
  id: string;
  type: "checkbox";
  checkbox: boolean;
}

interface DateProperty {
  id: string;
  type: "date";
  date: {
    start: string;
    end: string | null;
    time_zone: string | null;
  } | null;
}

interface FilesProperty {
  id: string;
  type: "files";
  files: NotionFileObject[];
}

interface TitleProperty {
  id: string;
  type: "title";
  title: {
    type: "text";
    text: {
      content: string;
      link: string | null;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href: string | null;
  }[];
}

// ===== Trading Journal Properties =====

interface TradingJournalProperties {
  Year: FormulaStringProperty;
  "MAE Price": NumberProperty;
  "Positive tags": MultiSelectProperty;
  "Exit Price": NumberProperty;
  "Overall emotion": SelectProperty;
  WIN: FormulaBooleanProperty;
  BE: CheckboxProperty;
  "Rating(1-10)": NumberProperty;
  "Actual Model": SelectProperty;
  "Entry Price": NumberProperty;
  Account: MultiSelectProperty;
  "Exit Reason": SelectProperty;
  "TP Price": NumberProperty;
  "SL Price": NumberProperty;
  "Profit/Loss": NumberProperty;
  "Files & media": FilesProperty;
  DOW: FormulaStringProperty;
  Month: FormulaStringProperty;
  "Market Regime": SelectProperty;
  "Negative tags": MultiSelectProperty;
  "Duration in Minutes": NumberProperty;
  "Position Size (lot)": NumberProperty;
  Date: DateProperty;
  Pairs: SelectProperty;
  Direction: SelectProperty;
  "MFE Price": NumberProperty;
  Name: TitleProperty;
  Session: SelectProperty;
  "Followed rules": CheckboxProperty;
  "Model Used": SelectProperty;
  "Entry Window": SelectProperty;
}

// ===== Full Page Type =====

interface NotionParent {
  type: "data_source_id";
  data_source_id: string;
  database_id: string;
}

export interface TradingJournalEntry {
  object: "page";
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: NotionUser;
  last_edited_by: NotionUser;
  cover: unknown | null;
  icon: unknown | null;
  parent: NotionParent;
  in_trash: boolean;
  is_archived: boolean;
  is_locked: boolean;
  properties: TradingJournalProperties;
  url: string;
  public_url: string | null;
  archived: boolean;
}

// ===== Helper: Simplified/Flattened type for analysis =====
// Berguna kalau mau parsing data ini jadi bentuk lebih ringkas untuk analisis

export interface TradingJournalEntrySimplified {
  id: string;
  name: string;
  date: string | null;
  year: string;
  month: string;
  dayOfWeek: string;
  pair: string | null;
  direction: "LONG" | "SHORT" | null;
  session: string | null;
  entryWindow: string | null;
  modelUsed: string | null;
  actualModel: string | null;
  marketRegime: string | null;
  entryPrice: number | null;
  exitPrice: number | null;
  slPrice: number | null;
  tpPrice: number | null;
  maePrice: number | null;
  mfePrice: number | null;
  positionSizeLot: number | null;
  durationMinutes: number | null;
  profitLoss: number | null;
  isWin: boolean;
  isBreakEven: boolean;
  followedRules: boolean;
  rating: number | null;
  overallEmotion: string | null;
  positiveTags: string[];
  negativeTags: string[];
  exitReason: string | null;
  account: string[];
}