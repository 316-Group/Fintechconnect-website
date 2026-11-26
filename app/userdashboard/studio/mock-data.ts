/**
 * Banking mock data for the Mock Data plugin: people, transactions, cards and accounts,
 * formatted for a locale (currency, dates, phone numbers, bank details). Everything is made
 * up here, from a seed, so the same seed gives the same data and nothing is fetched.
 *
 * The data is test data only: card numbers pass the Luhn check and IBANs / routing numbers
 * carry valid check digits (so form validation accepts them) but belong to no one. Emails
 * use example.com and phone numbers come from ranges set aside for fiction where one exists.
 */

export type MockDataset = 'people' | 'transactions' | 'cards' | 'accounts';

export type MockField = { key: string; label: string };
export type MockRecord = Record<string, string>;

export const DATASETS: { id: MockDataset; label: string; fields: MockField[] }[] = [
  {
    id: 'transactions',
    label: 'Transactions',
    fields: [
      { key: 'merchant', label: 'Merchant' },
      { key: 'amount', label: 'Amount' },
      { key: 'category', label: 'Category' },
      { key: 'date', label: 'Date' },
      { key: 'time', label: 'Time' },
      { key: 'status', label: 'Status' },
      { key: 'reference', label: 'Reference' },
    ],
  },
  {
    id: 'people',
    label: 'Customers',
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'address', label: 'Address' },
      { key: 'dob', label: 'Date of birth' },
      { key: 'kyc', label: 'KYC status' },
    ],
  },
  {
    id: 'cards',
    label: 'Cards',
    fields: [
      { key: 'brand', label: 'Network' },
      { key: 'number', label: 'Card number' },
      { key: 'masked', label: 'Masked' },
      { key: 'holder', label: 'Cardholder' },
      { key: 'expiry', label: 'Expiry' },
      { key: 'cvv', label: 'CVV' },
      { key: 'limit', label: 'Limit' },
    ],
  },
  {
    id: 'accounts',
    label: 'Accounts',
    fields: [
      { key: 'type', label: 'Account' },
      { key: 'balance', label: 'Balance' },
      { key: 'number', label: 'Account no.' },
      { key: 'bankCode', label: 'Bank code' },
      { key: 'iban', label: 'IBAN' },
      { key: 'holder', label: 'Holder' },
      { key: 'opened', label: 'Opened' },
    ],
  },
];

/* ---------------------------------- Random ---------------------------------- */

type Rng = () => number;

/** mulberry32: a small, fast seeded random number generator. */
function seeded(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const int = (r: Rng, min: number, max: number) => min + Math.floor(r() * (max - min + 1));
const pick = <T,>(r: Rng, items: readonly T[]) => items[Math.floor(r() * items.length)];
const digits = (r: Rng, count: number) => Array.from({ length: count }, () => int(r, 0, 9)).join('');
const letters = (r: Rng, count: number) =>
  Array.from({ length: count }, () => String.fromCharCode(65 + int(r, 0, 25))).join('');

/* --------------------------------- Locales --------------------------------- */

type BankDetails = { number: string; bankCode: string; iban: string };

type Locale = {
  id: string;
  label: string;
  intl: string;
  currency: string;
  /** Roughly how many units of this currency make one US dollar (to size amounts). */
  perDollar: number;
  first: string[];
  last: string[];
  cities: string[];
  streets: string[];
  address: (r: Rng, street: string, city: string) => string;
  phone: (r: Rng) => string;
  bank: (r: Rng) => BankDetails;
};

/** ISO 13616 check digits for an IBAN with this country code and account part. */
function ibanFor(country: string, bban: string) {
  const rearranged = `${bban}${country}00`
    .split('')
    .map((ch) => (/[A-Z]/.test(ch) ? String(ch.charCodeAt(0) - 55) : ch))
    .join('');
  let remainder = 0;
  for (const ch of rearranged) remainder = (remainder * 10 + Number(ch)) % 97;
  const check = String(98 - remainder).padStart(2, '0');
  return `${country}${check}${bban}`.replace(/(.{4})/g, '$1 ').trim();
}

/** A US ABA routing number with a valid checksum. */
function abaRouting(r: Rng) {
  const first = String(int(r, 1, 12)).padStart(2, '0') + digits(r, 6);
  const d = first.split('').map(Number);
  const sum = 3 * (d[0] + d[3] + d[6]) + 7 * (d[1] + d[4] + d[7]) + (d[2] + d[5]);
  return first + String((10 - (sum % 10)) % 10);
}

const LOCALES: Locale[] = [
  {
    id: 'us',
    label: 'United States (USD)',
    intl: 'en-US',
    currency: 'USD',
    perDollar: 1,
    first: ['Olivia', 'Liam', 'Ava', 'Noah', 'Sophia', 'Elijah', 'Mia', 'Mateo', 'Harper', 'Lucas', 'Amelia', 'Jackson'],
    last: ['Johnson', 'Martinez', 'Nguyen', 'Brooks', 'Carter', 'Patel', 'Reyes', 'Bennett', 'Coleman', 'Foster', 'Hayes', 'Kim'],
    cities: ['Austin, TX', 'Denver, CO', 'Portland, OR', 'Raleigh, NC', 'Columbus, OH', 'Phoenix, AZ', 'Madison, WI'],
    streets: ['Maple Ave', 'Oak Street', 'Cedar Lane', 'Lakeview Dr', 'Park Blvd', 'Willow Way', 'Main Street'],
    address: (r, street, city) => `${int(r, 100, 9800)} ${street}, ${city} ${digits(r, 5)}`,
    // 555-0100 to 555-0199 is reserved for fiction.
    phone: (r) => `+1 (${pick(r, ['212', '303', '415', '512', '617', '702'])}) 555-01${digits(r, 2)}`,
    bank: (r) => ({ number: digits(r, int(r, 9, 12)), bankCode: abaRouting(r), iban: 'Not used in the US' }),
  },
  {
    id: 'gb',
    label: 'United Kingdom (GBP)',
    intl: 'en-GB',
    currency: 'GBP',
    perDollar: 0.8,
    first: ['Oliver', 'Amelia', 'George', 'Isla', 'Arthur', 'Ava', 'Muhammad', 'Freya', 'Leo', 'Lily', 'Harry', 'Grace'],
    last: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Evans', 'Khan', 'Thomas', 'Roberts', 'Walker', 'Wright'],
    cities: ['London', 'Manchester', 'Bristol', 'Leeds', 'Edinburgh', 'Cardiff', 'Birmingham'],
    streets: ['High Street', 'Station Road', 'Church Lane', 'Victoria Road', 'Green Lane', 'Kings Road', 'Mill Lane'],
    address: (r, street, city) => `${int(r, 1, 220)} ${street}, ${city} ${letters(r, 2)}${int(r, 1, 20)} ${int(r, 1, 9)}${letters(r, 2)}`,
    // Ofcom sets 07700 900000 to 900999 aside for drama.
    phone: (r) => `+44 7700 900${digits(r, 3)}`,
    bank: (r) => {
      const sort = digits(r, 6);
      const account = digits(r, 8);
      return {
        number: account,
        bankCode: sort.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3'),
        iban: ibanFor('GB', `${letters(r, 4)}${sort}${account}`),
      };
    },
  },
  {
    id: 'de',
    label: 'Germany (EUR)',
    intl: 'de-DE',
    currency: 'EUR',
    perDollar: 0.92,
    first: ['Emma', 'Noah', 'Mia', 'Matteo', 'Hannah', 'Elias', 'Lina', 'Leon', 'Clara', 'Paul', 'Lea', 'Felix'],
    last: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Becker', 'Wagner', 'Hoffmann', 'Koch', 'Richter', 'Wolf', 'Neumann'],
    cities: ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt am Main', 'Leipzig', 'Stuttgart'],
    streets: ['Hauptstraße', 'Gartenstraße', 'Bahnhofstraße', 'Lindenstraße', 'Schulstraße', 'Bergstraße', 'Ringstraße'],
    address: (r, street, city) => `${street} ${int(r, 1, 140)}, ${digits(r, 5)} ${city}`,
    phone: (r) => `+49 ${pick(r, ['151', '160', '170', '176'])} ${digits(r, 8)}`,
    bank: (r) => {
      const blz = digits(r, 8);
      const account = digits(r, 10);
      return { number: account, bankCode: blz, iban: ibanFor('DE', `${blz}${account}`) };
    },
  },
  {
    id: 'ke',
    label: 'Kenya (KES)',
    intl: 'en-KE',
    currency: 'KES',
    perDollar: 130,
    first: ['Wanjiru', 'Otieno', 'Achieng', 'Kamau', 'Njeri', 'Mwangi', 'Akinyi', 'Kiprono', 'Wambui', 'Mutua', 'Chebet', 'Omondi'],
    last: ['Kariuki', 'Odhiambo', 'Wafula', 'Njoroge', 'Kiplagat', 'Mutiso', 'Wekesa', 'Ochieng', 'Gitau', 'Kimani', 'Atieno', 'Maina'],
    cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Nyeri'],
    streets: ['Moi Avenue', 'Kenyatta Avenue', 'Ngong Road', 'Waiyaki Way', 'Kimathi Street', 'Argwings Kodhek Road', 'Lenana Road'],
    address: (r, street, city) => `${street}, P.O. Box ${int(r, 100, 99999)}-${digits(r, 5)}, ${city}`,
    phone: (r) => `+254 7${digits(r, 2)} ${digits(r, 3)} ${digits(r, 3)}`,
    bank: (r) => ({ number: digits(r, 13), bankCode: `${digits(r, 2)}-${digits(r, 3)}`, iban: 'Not used in Kenya' }),
  },
  {
    id: 'ng',
    label: 'Nigeria (NGN)',
    intl: 'en-NG',
    currency: 'NGN',
    perDollar: 1500,
    first: ['Chinedu', 'Aisha', 'Tunde', 'Ngozi', 'Emeka', 'Fatima', 'Segun', 'Amaka', 'Ibrahim', 'Funmi', 'Uche', 'Zainab'],
    last: ['Okafor', 'Adeyemi', 'Bello', 'Eze', 'Balogun', 'Okonkwo', 'Abubakar', 'Olawale', 'Nwosu', 'Danjuma', 'Afolabi', 'Ibe'],
    cities: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu', 'Benin City'],
    streets: ['Awolowo Road', 'Adeola Odeku Street', 'Allen Avenue', 'Ahmadu Bello Way', 'Herbert Macaulay Way', 'Ozumba Mbadiwe Avenue'],
    address: (r, street, city) => `${int(r, 1, 120)} ${street}, ${city}`,
    phone: (r) => `+234 ${pick(r, ['803', '806', '813', '816', '903'])} ${digits(r, 3)} ${digits(r, 4)}`,
    bank: (r) => ({ number: digits(r, 10), bankCode: digits(r, 3), iban: 'Not used in Nigeria' }),
  },
  {
    id: 'in',
    label: 'India (INR)',
    intl: 'en-IN',
    currency: 'INR',
    perDollar: 83,
    first: ['Aarav', 'Ananya', 'Vihaan', 'Diya', 'Arjun', 'Isha', 'Reyansh', 'Saanvi', 'Kabir', 'Meera', 'Rohan', 'Priya'],
    last: ['Sharma', 'Patel', 'Iyer', 'Reddy', 'Gupta', 'Nair', 'Singh', 'Mehta', 'Rao', 'Das', 'Kapoor', 'Joshi'],
    cities: ['Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'New Delhi', 'Ahmedabad'],
    streets: ['MG Road', 'Linking Road', 'Park Street', 'Brigade Road', 'Anna Salai', 'FC Road', 'Residency Road'],
    address: (r, street, city) => `${int(r, 1, 300)}, ${street}, ${city} ${int(r, 1, 8)}${digits(r, 5)}`,
    phone: (r) => `+91 ${int(r, 7, 9)}${digits(r, 4)} ${digits(r, 5)}`,
    bank: (r) => ({ number: digits(r, int(r, 11, 14)), bankCode: `${letters(r, 4)}0${digits(r, 6)}`, iban: 'Not used in India' }),
  },
];

export const MOCK_LOCALES = LOCALES.map(({ id, label }) => ({ id, label }));

/* -------------------------------- Generators -------------------------------- */

const MERCHANTS: { name: string; category: string; min: number; max: number; credit?: boolean }[] = [
  { name: 'Corner Coffee Co.', category: 'Dining', min: 3, max: 9 },
  { name: 'FreshCart Groceries', category: 'Groceries', min: 18, max: 140 },
  { name: 'Metro Transit', category: 'Transport', min: 2, max: 15 },
  { name: 'QuickRide', category: 'Transport', min: 7, max: 38 },
  { name: 'Streamly Premium', category: 'Subscriptions', min: 9, max: 18 },
  { name: 'CloudFit Gym', category: 'Health', min: 25, max: 60 },
  { name: 'City Power & Water', category: 'Utilities', min: 45, max: 160 },
  { name: 'Northwind Airlines', category: 'Travel', min: 120, max: 680 },
  { name: 'Harbour Hotel', category: 'Travel', min: 90, max: 420 },
  { name: 'Bookshelf & Co.', category: 'Shopping', min: 12, max: 55 },
  { name: 'TechHub Store', category: 'Shopping', min: 40, max: 900 },
  { name: 'Green Bowl Kitchen', category: 'Dining', min: 11, max: 42 },
  { name: 'Mobile top-up', category: 'Bills', min: 5, max: 30 },
  { name: 'Salary · Acme Ltd', category: 'Income', min: 2200, max: 5200, credit: true },
  { name: 'Transfer from savings', category: 'Transfer', min: 50, max: 800, credit: true },
  { name: 'Refund · TechHub Store', category: 'Refund', min: 15, max: 120, credit: true },
];

const KYC = ['Verified', 'Verified', 'Verified', 'Pending review', 'Documents requested', 'Rejected'];
const STATUSES = ['Completed', 'Completed', 'Completed', 'Completed', 'Pending', 'Declined'];
const ACCOUNT_TYPES = ['Current account', 'Savings account', 'Business account', 'Joint account', 'Fixed deposit'];

/** Card networks with their number prefixes and lengths (test numbers, Luhn-valid). */
const NETWORKS = [
  { brand: 'Visa', prefixes: ['4'], length: 16, cvv: 3 },
  { brand: 'Mastercard', prefixes: ['51', '52', '53', '54', '55'], length: 16, cvv: 3 },
  { brand: 'American Express', prefixes: ['34', '37'], length: 15, cvv: 4 },
];

function luhnComplete(partial: string) {
  let sum = 0;
  const reversed = partial.split('').reverse();
  reversed.forEach((ch, index) => {
    let d = Number(ch);
    if (index % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  });
  return partial + String((10 - (sum % 10)) % 10);
}

function cardNumber(r: Rng, network: (typeof NETWORKS)[number]) {
  const prefix = pick(r, network.prefixes);
  const raw = luhnComplete(prefix + digits(r, network.length - prefix.length - 1));
  return network.length === 15
    ? raw.replace(/^(\d{4})(\d{6})(\d{5})$/, '$1 $2 $3')
    : raw.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/** Generates `count` records of a dataset for a locale. The same seed gives the same records. */
export function generateMockData(dataset: MockDataset, localeId: string, seed: number, count: number): MockRecord[] {
  const locale = LOCALES.find((item) => item.id === localeId) ?? LOCALES[0];
  const r = seeded(seed * 7919 + dataset.length * 104729 + localeId.charCodeAt(0));
  const money = new Intl.NumberFormat(locale.intl, { style: 'currency', currency: locale.currency });
  const dateFormat = new Intl.DateTimeFormat(locale.intl, { day: 'numeric', month: 'short', year: 'numeric' });
  const timeFormat = new Intl.DateTimeFormat(locale.intl, { hour: '2-digit', minute: '2-digit' });
  // Round amounts the way prices look in each currency.
  const amount = (dollars: number) => {
    const value = dollars * locale.perDollar;
    return value >= 1000 ? Math.round(value / 10) * 10 : value >= 100 ? Math.round(value) : Math.round(value * 100) / 100;
  };
  const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000 - int(r, 0, 86_399) * 1000);
  const person = () => {
    const first = pick(r, locale.first);
    const last = pick(r, locale.last);
    return { first, last, name: `${first} ${last}` };
  };
  const ascii = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').toLowerCase();

  return Array.from({ length: count }, (_, index): MockRecord => {
    switch (dataset) {
      case 'people': {
        const { first, last, name } = person();
        const born = new Date(Date.UTC(int(r, 1958, 2004), int(r, 0, 11), int(r, 1, 28)));
        return {
          name,
          email: `${ascii(first)}.${ascii(last)}${int(r, 1, 99)}@example.com`,
          phone: locale.phone(r),
          address: locale.address(r, pick(r, locale.streets), pick(r, locale.cities)),
          dob: dateFormat.format(born),
          kyc: pick(r, KYC),
        };
      }
      case 'transactions': {
        const merchant = pick(r, MERCHANTS);
        const value = amount(merchant.min + r() * (merchant.max - merchant.min));
        const when = daysAgo(index * 1.3 + r() * 1.3);
        return {
          merchant: merchant.name,
          amount: `${merchant.credit ? '+' : '−'}${money.format(value)}`,
          category: merchant.category,
          date: dateFormat.format(when),
          time: timeFormat.format(when),
          status: pick(r, STATUSES),
          reference: `TXN-${letters(r, 2)}${digits(r, 8)}`,
        };
      }
      case 'cards': {
        const network = NETWORKS[index % 5 === 4 ? 2 : int(r, 0, 1)];
        const number = cardNumber(r, network);
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + int(r, 6, 60));
        return {
          brand: network.brand,
          number,
          masked: `•••• ${number.replace(/\s/g, '').slice(-4)}`,
          holder: person().name.toUpperCase(),
          expiry: `${String(expiry.getMonth() + 1).padStart(2, '0')}/${String(expiry.getFullYear()).slice(-2)}`,
          cvv: digits(r, network.cvv),
          limit: money.format(amount(pick(r, [1000, 2500, 5000, 10000, 15000]))),
        };
      }
      case 'accounts': {
        const bank = locale.bank(r);
        const type = pick(r, ACCOUNT_TYPES);
        const scale = type === 'Business account' ? 40000 : type === 'Savings account' || type === 'Fixed deposit' ? 18000 : 4500;
        return {
          type,
          balance: money.format(amount(scale * (0.05 + r()))),
          number: bank.number,
          bankCode: bank.bankCode,
          iban: bank.iban,
          holder: person().name,
          opened: dateFormat.format(daysAgo(int(r, 60, 3650))),
        };
      }
    }
  });
}

/** The label a locale's bank code goes by (sort code, routing number, ...). */
export function bankCodeLabel(localeId: string) {
  return ({ us: 'Routing no.', gb: 'Sort code', de: 'BLZ', ke: 'Bank / branch', ng: 'Bank code', in: 'IFSC' } as Record<string, string>)[localeId] ?? 'Bank code';
}

/** The records as CSV, with a header row. */
export function toCsv(fields: MockField[], records: MockRecord[]) {
  const cell = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
  return [fields.map((field) => cell(field.label)), ...records.map((record) => fields.map((field) => cell(record[field.key] ?? '')))]
    .map((row) => row.join(','))
    .join('\n');
}
