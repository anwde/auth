import { lazy } from "react"; 
//Lazy loading and code splitting
//apps
const Chat = lazy(() => import("../views/chat/Chat"));
const Contacts = lazy(() => import("../views/contacts/Contacts"));
const Email = lazy(() => import("../views/email/Email"));
const Notes = lazy(() => import("../views/notes/Notes"));
const Todo = lazy(() => import("../views/todo/Todo"));
//dashboards
const FirstDashboard = lazy(() => import("../views/dashboards/FirstDashboard"));
const SecondDashboard = lazy(() =>
  import("../views/dashboards/SecondDashboard")
);
const ThirdDashboard = lazy(() => import("../views/dashboards/ThirdDashboard"));
const FourthDashboard = lazy(() =>
  import("../views/dashboards/FourthDashboard")
);
const FifthDashboard = lazy(() => import("../views/dashboards/FifthDashboard"));
const SixthDashboard = lazy(() => import("../views/dashboards/SixthDashboard"));
//Ui-components Dropdown
const Alerts = lazy(() => import("../views/ui-components/Alert"));
const Badges = lazy(() => import("../views/ui-components/Badge"));
const Spinners = lazy(() => import("../views/ui-components/Spinner"));
const Toasts = lazy(() => import("../views/ui-components/Toasts"));
const Breadcrumbs = lazy(() => import("../views/ui-components/Breadcrumb"));
const Buttons = lazy(() => import("../views/ui-components/Button"));
const Dropdowns = lazy(() => import("../views/ui-components/DropDown"));
const BtnGroups = lazy(() => import("../views/ui-components/BtnGroup"));
const Cards = lazy(() => import("../views/ui-components/Cards"));
const CollapseComponent = lazy(() => import("../views/ui-components/Collapse"));
const CarouselComponent = lazy(() => import("../views/ui-components/Carousel"));
const JumbotronComponent = lazy(() =>
  import("../views/ui-components/Jumbotron")
);
const LayoutComponent = lazy(() => import("../views/ui-components/Layout"));
const ListComponent = lazy(() => import("../views/ui-components/ListGroup"));
const MediaComponent = lazy(() => import("../views/ui-components/Media"));
const ModalComponent = lazy(() => import("../views/ui-components/Modal"));
const NavbarComponent = lazy(() => import("../views/ui-components/Navbar"));
const NavsComponent = lazy(() => import("../views/ui-components/Navs"));
const PaginationComponent = lazy(() =>
  import("../views/ui-components/Pagination")
);
const PopoverComponent = lazy(() => import("../views/ui-components/Popover"));
const ProgressComponent = lazy(() => import("../views/ui-components/Progress"));
const TableComponent = lazy(() => import("../views/ui-components/Table"));
const TabsComponent = lazy(() => import("../views/ui-components/Tabs"));
const TooltipComponent = lazy(() => import("../views/ui-components/ToolTip"));
//Sample Pages Dropdown
const Starterkit = lazy(() => import("../views/sample-pages/StarterKit"));
const Profile = lazy(() => import("../views/sample-pages/Profile"));
const Searchresult = lazy(() => import("../views/sample-pages/SearchResult"));
const Gallery = lazy(() => import("../views/sample-pages/Gallery"));
const Helperclass = lazy(() => import("../views/sample-pages/HelperClass"));
const Widgets = lazy(() => import("../views/widget/Widget"));
const Calendar = lazy(() => import("../views/calendar/Calendar"));

//Chart Pages Dropdown
const Chartjs = lazy(() => import("../views/charts/ChartJs"));
const Chartc3 = lazy(() => import("../views/charts/C3Chart"));
const Apexcharts = lazy(() => import("../views/charts/ApexCharts"));
//Icon Pages Dropdown
const Materialicon = lazy(() => import("../views/icons/Material"));
const FontAwesome = lazy(() => import("../views/icons/FontAwesome"));
const Themify = lazy(() => import("../views/icons/Themify"));
const Weather = lazy(() => import("../views/icons/Weather"));
const Simpleline = lazy(() => import("../views/icons/SimpleLine"));
const FlagIcon = lazy(() => import("../views/icons/Flag"));
//Form Layout Pages Dropdown
const Basicform = lazy(() => import("../views/form-layouts/Basic"));
const FormInputs = lazy(() => import("../views/form-layouts/FormInputs"));
const FormGroups = lazy(() => import("../views/form-layouts/FormGroups"));
const FormGrids = lazy(() => import("../views/form-layouts/FormGrids"));
//Form-pickers Pages Dropdown
const Datepicker = lazy(() => import("../views/form-pickers/DateTimePicker"));
const Tagselect = lazy(() => import("../views/form-pickers/TagSelect"));
//Form Validation Page
const FormValidate = lazy(() =>
  import("../views/form-validation/FormValidation")
);
//Form Wizard Page
const FormSteps = lazy(() => import("../views/steps/Steps"));
//Table Pages Dropdown
const Basictable = lazy(() => import("../views/tables/TableBasic"));
const CustomReactTable = lazy(() => import("../views/tables/CustomReactTable"));
const Datatable = lazy(() => import("../views/tables/ReactBootstrapTable"));

const CustomVectorMap = lazy(() => import("../views/maps/CustomVectorMap"));
// const auths = [].concat(AuthRoutes);

const Welcome = lazy(() => import("@/pages/welcome"));

const Competence = lazy(() => import("@/pages/competence"));
const Menus = lazy(() => import("@/pages/menus"));
const Permission = lazy(() => import("@/pages/permission"));
const Columns = lazy(() => import("@/pages/columns"));
const User = lazy(() => import("@/pages/user"));
const Customer = lazy(() => import("@/pages/customer/customer"));
const Customer_applications = lazy(() => import("@/pages/customer/applications"));
const Customer_applications_channel = lazy(() => import("@/pages/customer/applications_channel"));
const Customer_applications_extend = lazy(() => import("@/pages/customer/applications_extend"));
const Customer_applications_extend_items = lazy(() => import("@/pages/customer/applications_extend_items"));
const Customer_competence_user = lazy(() => import("@/pages/customer/competence_user"));



const Account = lazy(() => import("@/pages/account"));
const System_visit_log = lazy(() =>
  import("@/pages/system_visit_log")
);
const Authorize_Project = lazy(() => import("@/pages/project"));

const Widget_Columns = lazy(() => import("@/pages/widget/columns"));
const Templates = lazy(() => import("@/pages/templates"));
const Models = lazy(() => import("@/pages/models"));
const Content = lazy(() => import("@/pages/content"));
const Collection = lazy(() => import("@/pages/collection"));

var ThemeRoutes = [
  {
    collapse: true,
    name: "authorize",
    child: [
      {
        path: "/competence/:method?/:id?",
        name: "competence",
        component: Competence,
      },
      {
        path: "/menus/:method?/:id?",
        name: "competence",
        component: Menus,
      },
      {
        path: "/permission/:method?/:id?",
        name: "permission",
        component: Permission,
      },
      {
        path: "/columns/:method?/:id?",
        name: "columns",
        component: Columns,
      }, 
      {
        path: "/customer/applications/:method?/:id?",
        name: "customer_applications",
        component: Customer_applications,
      },
      {
        path: "/customer/applications_channel/:method?/:applications_id?/:id?",
        name: "customer_applications_channel",
        component: Customer_applications_channel,
      },
      {
        path: "/customer/applications_extend/:method?/:applications_id?/:id?",
        name: "customer_applications_extend",
        component: Customer_applications_extend,
      },
      {
        path: "/customer/applications_extend_items/:method?/:extend_id?/:id?",
        name: "customer_applications_extend_items",
        component: Customer_applications_extend_items,
      },
      {
        path: "/customer/competence_user/:method?/:customer_id?/:id?",
        name: "customer_competence_user",
        component: Customer_competence_user,
      },
      {
        path: "/customer/:method?/:id?",
        name: "customer",
        component: Customer,
      },
      {
        path: "/user/:method?/:id?",
        name: "user",
        component: User,
      },
      {
        path: "/account/:method?/:id?",
        name: "account",
        component: Account,
      },
      {
        path: "/system_visit_log/:method?/:id?",
        name: "system_visit_log",
        component: System_visit_log,
      },
      {
        path: "/project/:method?/:id?",
        name: "authorize_project",
        component: Authorize_Project,
      },
    ],
  },
  
  {
    collapse: true,
    name: "content",
    child: [
      {
        path: "/models/:method?/:id?",
        name: "models",
        component: Models,
      },
      {
        path: "/content/:method?/:id?",
        name: "Content",
        component: Content,
      },
      {
        path: "/templates/:method?/:id?",
        name: "Templates",
        component: Templates,
      },
      {
        path: "/collection/:method?/:id?",
        name: "collection",
        component: Collection,
      },
    ],
  },
  {
    collapse: true,
    name: "Widget",
    child: [
      {
        path: "/widget/columns/:method?/:id?",
        name: "widget_columns",
        component: Widget_Columns,
      }
    ]
  },
  {
    collapse: true,
    path: "/dashboards",
    name: "Dashboards",
    state: "dashboardpages",
    icon: "mdi mdi-av-timer",
    child: [
      {
        path: "/dashboards/firstdashboard",
        name: "Dashboard 1",
        mini: "B",
        icon: "mdi mdi-adjust",
        component: FirstDashboard,
      },
      {
        path: "/dashboards/seconddashboard",
        name: "Dashboard 2",
        mini: "B",
        icon: "mdi mdi-adjust",
        component: SecondDashboard,
      },
      {
        path: "/dashboards/thirddashboard",
        name: "Dashboard 3",
        mini: "B",
        icon: "mdi mdi-adjust",
        component: ThirdDashboard,
      },
      {
        path: "/dashboards/fourthdashboard",
        name: "Dashboard 4",
        mini: "B",
        icon: "mdi mdi-adjust",
        component: FourthDashboard,
      },
      {
        path: "/dashboards/fifthdashboard",
        name: "Dashboard 5",
        mini: "B",
        icon: "mdi mdi-adjust",
        component: FifthDashboard,
      },
      {
        path: "/dashboards/sixthdashboard",
        name: "Dashboard 6",
        mini: "B",
        icon: "mdi mdi-adjust",
        component: SixthDashboard,
      },
    ],
  },
];
export default ThemeRoutes;
