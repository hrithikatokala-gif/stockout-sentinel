export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
}

export const suppliers: Supplier[] = [
  {
    id: "sup-001",
    name: "FreshMeats Co.",
    contactName: "Marcus Thompson",
    email: "orders@freshmeats.com",
    phone: "(555) 234-5678",
    address: "1250 Industrial Blvd, Chicago, IL 60607",
    categories: ["Protein"],
  },
  {
    id: "sup-002",
    name: "Ocean Fresh",
    contactName: "Sarah Chen",
    email: "supply@oceanfresh.com",
    phone: "(555) 345-6789",
    address: "800 Harbor Drive, Boston, MA 02210",
    categories: ["Protein"],
  },
  {
    id: "sup-003",
    name: "Italian Grains Ltd.",
    contactName: "Giovanni Rossi",
    email: "sales@italiangrains.com",
    phone: "(555) 456-7890",
    address: "45 Pasta Lane, Brooklyn, NY 11201",
    categories: ["Pasta", "Pantry"],
  },
  {
    id: "sup-004",
    name: "Cheese Masters",
    contactName: "Elena Rodriguez",
    email: "orders@cheesemasters.com",
    phone: "(555) 567-8901",
    address: "320 Dairy Road, Madison, WI 53703",
    categories: ["Dairy"],
  },
  {
    id: "sup-005",
    name: "Dairy Direct",
    contactName: "Robert Miller",
    email: "supply@dairydirect.com",
    phone: "(555) 678-9012",
    address: "150 Farm Way, Columbus, OH 43215",
    categories: ["Dairy"],
  },
  {
    id: "sup-006",
    name: "Valley Farms",
    contactName: "Amanda Foster",
    email: "orders@valleyfarms.com",
    phone: "(555) 789-0123",
    address: "2400 Agricultural Pkwy, Fresno, CA 93721",
    categories: ["Produce"],
  },
  {
    id: "sup-007",
    name: "Herb Garden Co.",
    contactName: "David Kim",
    email: "fresh@herbgarden.com",
    phone: "(555) 890-1234",
    address: "78 Greenhouse Lane, Portland, OR 97201",
    categories: ["Produce"],
  },
  {
    id: "sup-008",
    name: "Mediterranean Imports",
    contactName: "Sophia Papadopoulos",
    email: "orders@mediterimports.com",
    phone: "(555) 901-2345",
    address: "550 Import Plaza, Los Angeles, CA 90015",
    categories: ["Pantry"],
  },
  {
    id: "sup-009",
    name: "Italian Imports",
    contactName: "Marco Bianchi",
    email: "supply@italimports.com",
    phone: "(555) 012-3456",
    address: "890 Little Italy St, New York, NY 10013",
    categories: ["Pantry"],
  },
  {
    id: "sup-010",
    name: "Wine Imports",
    contactName: "Pierre Dubois",
    email: "orders@wineimports.com",
    phone: "(555) 123-4567",
    address: "1200 Vineyard Ave, Napa, CA 94559",
    categories: ["Pantry"],
  },
  {
    id: "sup-011",
    name: "Fresh Pasta Co.",
    contactName: "Antonio Esposito",
    email: "orders@freshpasta.com",
    phone: "(555) 234-5679",
    address: "340 Artisan Way, San Francisco, CA 94102",
    categories: ["Pasta"],
  },
];
