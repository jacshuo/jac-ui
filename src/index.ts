// ─── Styles (must be imported by the consumer)
// import '@jac/ui/styles/theme.css';

// ─── Utilities
export { cn } from "./lib/utils";

// ─── Category modules (ergonomic grouped API)
export { default as Primitives } from "./components/Primitives/index";
export { default as Layout } from "./components/Layout/index";
export { default as DataDisplay } from "./components/DataDisplay/index";
export { default as Navigation } from "./components/Navigation/index";
export { default as Disclosure } from "./components/Disclosure/index";
export { default as Overlay } from "./components/Overlay/index";
export { default as Feedback } from "./components/Feedback/index";
export { default as Extras } from "./components/Extras/index";
export { default as Forms } from "./components/Forms/index";
export { default as Chart } from "./components/Chart/index";

import PrimitivesGroup from "./components/Primitives/index";
import LayoutGroup from "./components/Layout/index";
import DataDisplayGroup from "./components/DataDisplay/index";
import NavigationGroup from "./components/Navigation/index";
import DisclosureGroup from "./components/Disclosure/index";
import OverlayGroup from "./components/Overlay/index";
import FeedbackGroup from "./components/Feedback/index";
import ExtrasGroup from "./components/Extras/index";
import FormsGroup from "./components/Forms/index";
import ChartGroup from "./components/Chart/index";

const Onyx = {
  Primitives: PrimitivesGroup,
  Layout: LayoutGroup,
  DataDisplay: DataDisplayGroup,
  Navigation: NavigationGroup,
  Disclosure: DisclosureGroup,
  Overlay: OverlayGroup,
  Feedback: FeedbackGroup,
  Extras: ExtrasGroup,
  Forms: FormsGroup,
  Chart: ChartGroup,
};

export default Onyx;

// ─── Theme (CVA variant definitions)
export {
  buttonVariants,
  badgeVariants,
  inputVariants,
  cardVariants,
  panelVariants,
  labelVariants,
  tableVariants,
  listVariants,
  listItemVariants,
  accordionVariants,
  accordionTriggerVariants,
  accordionContentVariants,
  treeItemVariants,
  tabListVariants,
  tabTriggerVariants,
  dialogContentVariants,
  tooltipVariants,
  alertVariants,
  navLinkVariants,
  codeBlockVariants,
  progressBarVariants,
  spinVariants,
  switchTrackVariants,
  checkboxVariants,
  radioVariants,
  indicatorVariants,
} from "./styles/theme";

// ─── Primitives
export { Button } from "./components/Primitives/Button/index";
export {
  Dropdown,
  type DropdownOption,
  type DropdownProps,
  type DropdownSingleProps,
  type DropdownMultipleProps,
} from "./components/Primitives/Dropdown/index";
export {
  DropdownButton,
  type DropdownItem,
  type DropdownButtonProps,
} from "./components/Primitives/DropdownButton/index";
export { Badge } from "./components/Primitives/Badge/index";
export { Indicator, type IndicatorProps } from "./components/Primitives/Indicator/index";
export { Label } from "./components/Primitives/Label/index";
export { Input } from "./components/Primitives/Input/index";
export { TextBox, type TextBoxProps } from "./components/Primitives/TextBox/index";
export { Switch, type SwitchProps } from "./components/Primitives/Switch/index";
export { Checkbox, type CheckboxProps } from "./components/Primitives/Checkbox/index";
export {
  Radio,
  RadioGroup,
  type RadioProps,
  type RadioGroupProps,
} from "./components/Primitives/Radio/index";

// ─── Layout
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  HorizontalCard,
} from "./components/Layout/Card/index";
export {
  ImageCard,
  ImageCardBody,
  ImageCardTitle,
  ImageCardDescription,
  ImageCardActions,
} from "./components/Layout/ImageCard/index";
export { Panel, PanelHeader, PanelContent } from "./components/Layout/Panel/index";

// ─── Data Display
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SortableTable,
  DataTable,
  TableEmpty,
  type ColumnDef,
  type SortState,
  type SortDirection,
  type SelectionMode,
  type DataTableProps,
  type TableEmptyProps,
} from "./components/DataDisplay/Table/index";
export { List, ListItem, type ListItemProps } from "./components/DataDisplay/List/index";
export { Tree, TreeItem } from "./components/DataDisplay/Tree/index";
export { Chat, type ChatMessage, type ChatProps } from "./components/DataDisplay/Chat/index";
export {
  CodeBlock,
  type CodeBlockLanguage,
  type CodeBlockProps,
} from "./components/DataDisplay/CodeBlock/index";

// ─── Navigation
export {
  SideNav,
  type SideNavCollapseMode,
  type SideNavItem,
  type SideNavProps,
  type SideNavLinkComponentProps,
} from "./components/Navigation/SideNav/index";
export {
  Header,
  type HeaderProps,
  type HeaderNavItem,
  type HeaderAction,
} from "./components/Navigation/Header/index";
export { NavLink } from "./components/Navigation/NavLink/index";

// ─── Disclosure
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/Disclosure/Accordion/index";
export {
  Tabs,
  TabList,
  TabTrigger,
  TabPanels,
  TabContent,
} from "./components/Disclosure/Tabs/index";

// ─── Overlay
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./components/Overlay/Dialog/index";
export { Tooltip } from "./components/Overlay/Tooltip/index";

// ─── Feedback
export {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  useAlert,
  configureAlertTopOffset,
  type AlertPosition,
  type AlertOptions,
} from "./components/Feedback/Alert/index";
export { ProgressBar, type ProgressBarProps } from "./components/Feedback/ProgressBar/index";
export { Spin, useSpin, type SpinProps } from "./components/Feedback/Spin/index";

// ─── Extras
export {
  FilmReel,
  type FilmReelPhoto,
  type FilmReelAction,
  type FilmReelLayout,
  type FilmReelProps,
} from "./components/Extras/FilmReel/index";

export {
  MiniPlayer,
  type MiniPlayerTrack,
  type MiniPlayerPosition,
  type MiniPlayerEntrance,
  type MiniPlayerProps,
} from "./components/Extras/MiniPlayer/index";

export {
  CinePlayer,
  type CinePlayerMedia,
  type CinePlayerSortKey,
  type CinePlayerProps,
} from "./components/Extras/CinePlayer/index";

export {
  FileExplorer,
  type FileExplorerItem,
  type FileExplorerViewMode,
  type FileExplorerDockSide,
  type FileExplorerInputMode,
  type FileExplorerAction,
  type FileExplorerProps,
} from "./components/Extras/FileExplorer/index";

export {
  Masonry,
  type MasonryProps,
  type MasonryItemData,
} from "./components/Extras/Masonry/index";

export { TypewriterText, type TypewriterTextProps } from "./components/Extras/TypewriterText/index";

// ─── Form
export {
  Form,
  FormItem,
  FormSection,
  type FormProps,
  type FormItemProps,
  type FormSectionProps,
  type FormLayout,
  type FormSize,
  type FormValidationStatus,
  type FormValidation,
  type ValidationResult,
  type ValidateCallback,
} from "./components/Forms/Form/index";

// ─── Chart
export { LineChart, type LineChartProps } from "./components/Chart/LineChart";
export { BarChart, type BarChartProps } from "./components/Chart/BarChart";
export { PieChart, type PieChartProps } from "./components/Chart/PieChart";
export { ScatterChart, type ScatterChartProps } from "./components/Chart/ScatterChart";
export type {
  ChartSeries,
  ChartDataPoint,
  PieSlice,
  AxisConfig,
  LegendItem,
  BaseChartProps,
} from "./components/Chart/types";
export { chartContainerVariants, chartLegendVariants, chartTooltipVariants } from "./styles/theme";
